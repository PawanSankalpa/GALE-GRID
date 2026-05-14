/**
 * server/services/teamService.js
 * Engineering patterns: Caching (5 min), soft-delete, access control,
 * prevent duplicate email registration.
 */
import bcrypt from "bcrypt";
import { db } from "../db/pool.js";
import { cache } from "../utils/cache.js";

const SALT_ROUNDS = 10;
const CACHE_KEY   = "team:members";
const CACHE_WORKLOAD = "team:workload";
const TTL_5MIN = 5 * 60 * 1000;

function newId() {
  return `u_tm_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
}

// ── Invalidate team caches ────────────────────────────────────────
function invalidate() {
  cache.invalidate("team:");
}

// ── Get all active team members ───────────────────────────────────
export async function getAllTeamMembers() {
  const cached = cache.get(CACHE_KEY);
  if (cached) return cached;

  const { rows } = await db.query(
    `SELECT id, name, email, role, title, department, status, last_seen_at, created_at
     FROM   users
     WHERE  role IN ('admin','team')
       AND  deleted_at IS NULL
     ORDER  BY role DESC, name ASC`
  );

  cache.set(CACHE_KEY, rows, TTL_5MIN);
  return rows;
}

// ── Get one member + their assigned projects + workload ───────────
export async function getTeamMemberById(memberId) {
  const { rows: [member] } = await db.query(
    `SELECT id, name, email, role, title, department, status, last_seen_at, created_at
     FROM   users
     WHERE  id = $1 AND deleted_at IS NULL`,
    [memberId]
  );
  if (!member) return null;

  const [{ rows: projects }, { rows: tasks }] = await Promise.all([
    db.query(
      `SELECT id, name, status FROM projects
       WHERE  team_member_ids @> $1::jsonb AND deleted_at IS NULL`,
      [JSON.stringify([memberId])]
    ),
    db.query(
      `SELECT id, title, status, priority, due_date FROM tasks
       WHERE  assigned_to = $1 AND status != 'Completed'
       ORDER  BY due_date ASC NULLS LAST`,
      [memberId]
    ),
  ]);

  return { ...member, projects, tasks };
}

// ── Workload summary (cached) ────────────────────────────────────
export async function getWorkloadSummary() {
  const cached = cache.get(CACHE_WORKLOAD);
  if (cached) return cached;

  const { rows } = await db.query(
    `SELECT u.id, u.name,
            COUNT(t.id)::int  AS task_count,
            COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END)::int AS active_tasks,
            COUNT(CASE WHEN t.due_date < NOW() AND t.status != 'Completed' THEN 1 END)::int AS overdue_tasks
     FROM   users u
     LEFT JOIN tasks t ON t.assigned_to = u.id
     WHERE  u.role IN ('admin','team') AND u.deleted_at IS NULL
     GROUP  BY u.id, u.name
     ORDER  BY task_count DESC`
  );

  cache.set(CACHE_WORKLOAD, rows, TTL_5MIN);
  return rows;
}

// ── Create a new team member ─────────────────────────────────────
export async function createTeamMember({ name, email, password, title, department }) {
  const normalizedEmail = email.trim().toLowerCase();

  // Check for existing email
  const { rows: existing } = await db.query(
    "SELECT id FROM users WHERE LOWER(email)=$1",
    [normalizedEmail]
  );
  if (existing.length > 0) {
    return { error: "A user with this email already exists" };
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const id = newId();

  const { rows: [member] } = await db.query(
    `INSERT INTO users (id, name, email, role, password_hash, title, department)
     VALUES ($1,$2,$3,'team',$4,$5,$6)
     RETURNING id, name, email, role, title, department, status, created_at`,
    [id, name.trim(), normalizedEmail, password_hash, title || null, department || null]
  );

  invalidate();
  return { member };
}

// ── Update a team member ─────────────────────────────────────────
export async function updateTeamMember(memberId, fields) {
  const allowed = ["name", "email", "title", "department"];
  const setClauses = [];
  const values = [];
  let idx = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setClauses.push(`${key}=$${idx}`);
      values.push(key === "email" ? fields[key].trim().toLowerCase() : fields[key]);
      idx++;
    }
  }

  if (setClauses.length === 0) return { error: "No valid fields to update" };

  values.push(memberId);
  const { rows: [updated] } = await db.query(
    `UPDATE users SET ${setClauses.join(",")} WHERE id=$${idx} AND deleted_at IS NULL
     RETURNING id, name, email, role, title, department, status, created_at`,
    values
  );

  if (!updated) return { error: "Member not found" };

  invalidate();
  return { member: updated };
}

// ── Soft-delete a team member ────────────────────────────────────
export async function deactivateTeamMember(memberId) {
  const { rows: [member] } = await db.query(
    "SELECT id FROM users WHERE id=$1 AND role='team' AND deleted_at IS NULL",
    [memberId]
  );
  if (!member) return { error: "Team member not found or already deactivated" };

  await db.query(
    "UPDATE users SET deleted_at=NOW(), status='offline' WHERE id=$1",
    [memberId]
  );

  invalidate();
  return { success: true };
}
