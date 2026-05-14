import { db } from "../db/pool.js";
import { cache, cacheKey, CACHE_TTL } from "../utils/cache.js";

const DEFAULT_TIMELINE = [
  { phase:"Discovery",    done:false, completedAt:null },
  { phase:"UI/UX Design", done:false, completedAt:null },
  { phase:"Development",  done:false, completedAt:null },
  { phase:"QA & Review",  done:false, completedAt:null },
  { phase:"Launch",       done:false, completedAt:null },
];

function normalise(row) {
  return {
    id:            row.id,
    clientId:      row.client_id,
    clientName:    row.client_name || "—",
    name:          row.name,
    teamMemberIds: row.team_member_ids || [],
    teamMembers:   row.team_members || [],
    status:        row.status,
    priority:      row.priority,
    progress:      row.progress,
    deadline:      row.deadline,
    timeline:      row.timeline || [],
    nextStep:      row.next_step,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  };
}

export async function getAllProjects() {
  const cached = cache.get(cacheKey.projects());
  if (cached) return cached;

  const { rows } = await db.query(`
    SELECT p.*, c.company AS client_name
    FROM   projects p
    LEFT JOIN clients c ON c.id = p.client_id
    ORDER BY p.created_at DESC
  `);

  // Attach team member names
  const userIds = [...new Set(rows.flatMap(r => r.team_member_ids || []))];
  let userMap = {};
  if (userIds.length) {
    const { rows: users } = await db.query(
      `SELECT id, name FROM users WHERE id = ANY($1)`, [userIds]
    );
    userMap = Object.fromEntries(users.map(u => [u.id, u.name]));
  }

  const result = rows.map(r => normalise({
    ...r,
    team_members: (r.team_member_ids || []).map(id => ({ id, name: userMap[id] || id })),
  }));

  cache.set(cacheKey.projects(), result, CACHE_TTL.PROJECTS);
  return result;
}

export async function getProjectById(projectId) {
  const { rows } = await db.query(`
    SELECT p.*, c.company AS client_name
    FROM   projects p
    LEFT JOIN clients c ON c.id = p.client_id
    WHERE  p.id = $1
  `, [projectId]);
  if (!rows[0]) return null;

  const [taskRes, msgRes, reqRes] = await Promise.all([
    db.query("SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at", [projectId]),
    db.query("SELECT * FROM messages WHERE project_id = $1 ORDER BY created_at", [projectId]),
    db.query("SELECT * FROM client_requests WHERE project_id = $1 ORDER BY created_at DESC", [projectId]),
  ]);

  return {
    ...normalise(rows[0]),
    tasks:    taskRes.rows,
    messages: msgRes.rows,
    requests: reqRes.rows,
  };
}

export async function canAccessProjectByRole({ userId, role, projectId }) {
  if (role === "admin" || role === "team") return true;
  if (role !== "client") return false;

  const { rows } = await db.query(
    `SELECT 1
     FROM projects p
     JOIN clients c ON c.id = p.client_id
     WHERE p.id = $1 AND c.user_id = $2
     LIMIT 1`,
    [projectId, userId]
  );

  return Boolean(rows[0]);
}

export async function getProjectsForClient(clientId) {
  const cached = cache.get(cacheKey.clientProjects(clientId));
  if (cached) return cached;

  const { rows } = await db.query(
    "SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC", [clientId]
  );
  const result = rows.map(normalise);
  cache.set(cacheKey.clientProjects(clientId), result, CACHE_TTL.PROJECTS);
  return result;
}

export async function getProjectsForTeamMember(userId) {
  const { rows } = await db.query(`
    SELECT p.*, c.company AS client_name
    FROM   projects p
    LEFT JOIN clients c ON c.id = p.client_id
    WHERE  p.team_member_ids @> $1::jsonb
    ORDER BY p.created_at DESC
  `, [JSON.stringify([userId])]);
  return rows.map(normalise);
}

export async function createProject({ clientId, name, teamMemberIds, priority, deadline, actorUserId }) {
  const id = `p_${Date.now()}`;
  const today = new Date().toISOString().split("T")[0];

  const { rows } = await db.query(`
    INSERT INTO projects
      (id, client_id, name, team_member_ids, status, priority, progress, deadline, timeline, next_step, created_at, updated_at)
    VALUES ($1,$2,$3,$4,'Planning',$5,0,$6,$7,'Begin discovery phase',$8,$8)
    RETURNING *
  `, [id, clientId, name, JSON.stringify(teamMemberIds || []),
      priority || "medium", deadline || null,
      JSON.stringify(DEFAULT_TIMELINE), today]);

  await db.query(
    "INSERT INTO activity_log (id, user_id, action, timestamp) VALUES ($1,$2,$3,NOW())",
    [`act_${Date.now()}`, actorUserId || "u_admin_1", `created project "${name}"`]
  );

  cache.invalidate("projects");
  return { project: normalise(rows[0]) };
}

export async function updateProject(projectId, updates, actorUserId) {
  const fieldMap = {
    name: "name", status: "status", priority: "priority",
    progress: "progress", deadline: "deadline",
    teamMemberIds: "team_member_ids", nextStep: "next_step", timeline: "timeline",
  };

  const setClauses = [];
  const values = [];

  for (const [camel, col] of Object.entries(fieldMap)) {
    if (updates[camel] !== undefined) {
      const v = typeof updates[camel] === "object" ? JSON.stringify(updates[camel]) : updates[camel];
      values.push(v);
      setClauses.push(`${col} = $${values.length}`);
    }
  }
  if (setClauses.length === 0) return { error: "Nothing to update" };

  const today = new Date().toISOString().split("T")[0];
  values.push(today);
  setClauses.push(`updated_at = $${values.length}`);
  values.push(projectId);

  const { rows } = await db.query(
    `UPDATE projects SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );
  if (!rows[0]) return { error: "Project not found" };

  cache.invalidate("projects");
  return { project: normalise(rows[0]) };
}
