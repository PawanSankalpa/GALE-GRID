import { db } from "../db/pool.js";
import { cache, cacheKey, CACHE_TTL } from "../utils/cache.js";

const VALID_STAGES = ["lead", "onboarding", "active", "delivered", "subscription"];
const STAGE_TRANSITIONS = {
  lead:         ["onboarding"],
  onboarding:   ["active", "lead"],
  active:       ["delivered"],
  delivered:    ["subscription", "active"],
  subscription: ["active"],
};

function normaliseClient(row) {
  return {
    id:           row.id,
    userId:       row.user_id,
    company:      row.company,
    contactName:  row.contact_name || row.user_name || "—",
    contactEmail: row.contact_email || row.user_email || "—",
    stage:        row.stage,
    assignedTeam: row.assigned_team || [],
    notes:        row.notes || "",
    projectCount: Number(row.project_count || 0),
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  };
}

export async function getAllClients() {
  const cached = cache.get(cacheKey.clients());
  if (cached) return cached;

  const { rows } = await db.query(`
    SELECT c.*,
           u.name  AS user_name,
           u.email AS user_email,
           COUNT(p.id) AS project_count
    FROM   clients c
    LEFT JOIN users    u ON u.id = c.user_id
    LEFT JOIN projects p ON p.client_id = c.id
    GROUP BY c.id, u.name, u.email
    ORDER BY c.created_at DESC
  `);

  const result = rows.map(normaliseClient);
  cache.set(cacheKey.clients(), result, CACHE_TTL.CLIENTS);
  return result;
}

export async function getClientById(clientId) {
  const { rows } = await db.query(`
    SELECT c.*, u.name AS user_name, u.email AS user_email
    FROM   clients c
    LEFT JOIN users u ON u.id = c.user_id
    WHERE  c.id = $1
  `, [clientId]);

  if (!rows[0]) return null;
  const client = normaliseClient(rows[0]);

  const [projRes, subRes, invRes, reqRes] = await Promise.all([
    db.query("SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC", [clientId]),
    db.query(`SELECT s.*, pl.name AS plan_name, pl.features AS plan_features,
                     CASE WHEN s.billing='yearly' THEN pl.price_yearly ELSE pl.price_monthly END AS plan_price
              FROM subscriptions s JOIN plans pl ON pl.id = s.plan_id
              WHERE s.client_id = $1 LIMIT 1`, [clientId]),
    db.query("SELECT * FROM invoices WHERE client_id = $1 ORDER BY issued_at DESC", [clientId]),
    db.query("SELECT * FROM client_requests WHERE client_id = $1 ORDER BY created_at DESC", [clientId]),
  ]);

  const sub = subRes.rows[0] || null;
  return {
    ...client,
    projects:     projRes.rows,
    subscription: sub ? { ...sub, planName: sub.plan_name, planFeatures: sub.plan_features } : null,
    invoices:     invRes.rows,
    requests:     reqRes.rows,
  };
}

export async function getClientByUserId(userId) {
  const { rows } = await db.query("SELECT id FROM clients WHERE user_id = $1 LIMIT 1", [userId]);
  if (!rows[0]) return null;
  return getClientById(rows[0].id);
}

export async function moveClientStage(clientId, newStage, actorUserId) {
  const { rows } = await db.query("SELECT * FROM clients WHERE id = $1", [clientId]);
  const client = rows[0];
  if (!client) return { error: "Client not found" };
  if (!VALID_STAGES.includes(newStage)) return { error: `Invalid stage: ${newStage}` };

  const allowed = STAGE_TRANSITIONS[client.stage] || [];
  if (!allowed.includes(newStage)) {
    return { error: `Cannot move from '${client.stage}' to '${newStage}'. Allowed: ${allowed.join(", ")}` };
  }

  const today = new Date().toISOString().split("T")[0];
  await db.query("UPDATE clients SET stage = $1, updated_at = $2 WHERE id = $3", [newStage, today, clientId]);
  await db.query(
    "INSERT INTO activity_log (id, user_id, action, timestamp) VALUES ($1,$2,$3,NOW())",
    [`act_${Date.now()}`, actorUserId || "u_admin_1", `moved ${client.company} to ${newStage}`]
  );

  cache.invalidate("clients");
  return { client: { ...client, stage: newStage, updatedAt: today } };
}

export async function createClient({ company, contactName, contactEmail, notes, actorUserId }) {
  const today = new Date().toISOString().split("T")[0];
  const id = `cl_${Date.now()}`;

  const { rows } = await db.query(`
    INSERT INTO clients (id, company, contact_name, contact_email, stage, assigned_team, notes, created_at, updated_at)
    VALUES ($1,$2,$3,$4,'lead','[]',$5,$6,$6)
    RETURNING *
  `, [id, company, contactName || "", contactEmail || "", notes || "", today]);

  await db.query(
    "INSERT INTO activity_log (id, user_id, action, timestamp) VALUES ($1,$2,$3,NOW())",
    [`act_${Date.now()}`, actorUserId || "u_admin_1", `added new lead: ${company}`]
  );

  cache.invalidate("clients");
  return { client: normaliseClient(rows[0]) };
}

export async function updateClient(clientId, updates, actorUserId) {
  const allowed = ["company", "contact_name", "contact_email", "notes", "assigned_team"];
  const setClauses = [];
  const values = [];

  // Map camelCase → snake_case
  const fieldMap = {
    company: "company", contactName: "contact_name",
    contactEmail: "contact_email", notes: "notes", assignedTeam: "assigned_team"
  };

  for (const [camel, col] of Object.entries(fieldMap)) {
    if (updates[camel] !== undefined) {
      values.push(typeof updates[camel] === "object" ? JSON.stringify(updates[camel]) : updates[camel]);
      setClauses.push(`${col} = $${values.length}`);
    }
  }

  if (setClauses.length === 0) return { error: "No valid fields to update" };

  const today = new Date().toISOString().split("T")[0];
  values.push(today);
  setClauses.push(`updated_at = $${values.length}`);
  values.push(clientId);

  const { rows } = await db.query(
    `UPDATE clients SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );

  if (!rows[0]) return { error: "Client not found" };
  cache.invalidate("clients");
  return { client: normaliseClient(rows[0]) };
}

export async function getLifecycleSummary() {
  const { rows } = await db.query(
    "SELECT stage, COUNT(*) AS count FROM clients GROUP BY stage"
  );
  const summary = { lead:0, onboarding:0, active:0, delivered:0, subscription:0 };
  for (const row of rows) summary[row.stage] = Number(row.count);
  return summary;
}
