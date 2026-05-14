import { db } from "../db/pool.js";
import { cache, cacheKey, CACHE_TTL } from "../utils/cache.js";

// ──────────────────────────────────────────────────────────────────────────────
// CONVERSATIONS  (Engineering: caching, pagination, access control)
// Returns list of projects with last message + unread count for the caller.
// Admin & team = all; client = only their own projects.
// ──────────────────────────────────────────────────────────────────────────────
export async function getConversations(user, { page=1, limit=20 }={}) {
  const ck = cacheKey.conversations(user.id) + `:${page}`;
  const cached = cache.get(ck);
  if (cached) return cached;

  let projectFilter = "";
  const params = [user.id];

  if (user.role === "client") {
    // Only projects belonging to this user's client account
    projectFilter = "AND p.client_id = (SELECT id FROM clients WHERE user_id = $1 LIMIT 1)";
  } else if (user.role === "team") {
    // Projects where this team member is assigned
    projectFilter = "AND p.team_member_ids @> $2::jsonb";
    params.push(JSON.stringify([user.id]));
  }
  // admin: no filter — all projects

  const offset = (page - 1) * limit;

  const { rows } = await db.query(`
    SELECT
      p.id            AS project_id,
      p.name          AS project_name,
      c.company       AS client_name,
      c.id            AS client_id,
      lm.id           AS last_message_id,
      lm.text         AS last_message_text,
      lm.created_at   AS last_message_at,
      lm.sender_id    AS last_sender_id,
      su.name         AS last_sender_name,
      COUNT(unread.id) FILTER (WHERE unread.id IS NOT NULL) AS unread_count
    FROM projects p
    JOIN clients c ON c.id = p.client_id
    LEFT JOIN LATERAL (
      SELECT id, text, created_at, sender_id
      FROM   messages
      WHERE  project_id = p.id
      ORDER BY created_at DESC LIMIT 1
    ) lm ON true
    LEFT JOIN users su ON su.id = lm.sender_id
    LEFT JOIN messages unread ON unread.project_id = p.id
      AND unread.sender_id != $1
      AND NOT EXISTS (
        SELECT 1 FROM message_reads mr WHERE mr.message_id=unread.id AND mr.user_id=$1
      )
    WHERE 1=1 ${projectFilter}
    GROUP BY p.id, p.name, c.company, c.id,
             lm.id, lm.text, lm.created_at, lm.sender_id, su.name
    ORDER BY COALESCE(lm.created_at, p.created_at) DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `, [...params, limit, offset]);

  const result = rows.map(r => ({
    projectId:       r.project_id,
    projectName:     r.project_name,
    clientName:      r.client_name,
    clientId:        r.client_id,
    lastMessage:     r.last_message_id ? {
      id:         r.last_message_id,
      text:       r.last_message_text,
      createdAt:  r.last_message_at,
      senderId:   r.last_sender_id,
      senderName: r.last_sender_name,
    } : null,
    unreadCount: Number(r.unread_count),
  }));

  cache.set(ck, result, CACHE_TTL.CONVERSATIONS);
  return result;
}

// ──────────────────────────────────────────────────────────────────────────────
// THREAD  (Engineering: pagination, access control, filtering internal notes)
// ──────────────────────────────────────────────────────────────────────────────
export async function getThread(projectId, user, { page=1, limit=40 }={}) {
  const ck = cacheKey.thread(projectId) + `:${user.id}:${page}`;
  const cached = cache.get(ck);
  if (cached) return cached;

  // Access check: clients can only see their own project
  if (user.role === "client") {
    const { rows } = await db.query(
      "SELECT 1 FROM projects p JOIN clients c ON c.id=p.client_id WHERE p.id=$1 AND c.user_id=$2",
      [projectId, user.id]
    );
    if (!rows[0]) return { messages:[], total:0 };
  }

  // Clients never see internal notes
  const typeFilter = user.role === "client" ? "AND m.type != 'note'" : "";
  const offset = (page - 1) * limit;

  const [msgRes, countRes] = await Promise.all([
    db.query(`
      SELECT m.*, u.name AS sender_name, u.role AS sender_role,
             EXISTS (SELECT 1 FROM message_reads mr WHERE mr.message_id=m.id AND mr.user_id=$1) AS is_read
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.project_id = $2 ${typeFilter}
      ORDER BY m.created_at DESC
      LIMIT $3 OFFSET $4
    `, [user.id, projectId, limit, offset]),
    db.query(`SELECT COUNT(*) FROM messages m WHERE m.project_id=$1 ${typeFilter}`, [projectId]),
  ]);

  const result = {
    messages: msgRes.rows.map(m => ({
      id:          m.id,
      projectId:   m.project_id,
      senderId:    m.sender_id,
      senderName:  m.sender_name,
      senderRole:  m.sender_role,
      text:        m.text,
      type:        m.type,
      attachments: m.attachments || [],
      createdAt:   m.created_at,
      editedAt:    m.edited_at,
      isRead:      m.is_read,
    })).reverse(), // return oldest-first for chat display
    total: Number(countRes.rows[0].count),
    page, limit,
  };

  cache.set(ck, result, CACHE_TTL.CONVERSATIONS);
  return result;
}

// ──────────────────────────────────────────────────────────────────────────────
// SEND MESSAGE  (Engineering: idempotency via clientMessageId 60s dedup)
// ──────────────────────────────────────────────────────────────────────────────
const _sentIds = new Map(); // clientMessageId -> { id, createdAt } — short-lived dedup

export async function sendMessage({ projectId, senderId, text, type="message", attachments=[], clientMessageId }) {
  // Idempotency: same clientMessageId within 60s returns existing msg
  if (clientMessageId) {
    const existing = _sentIds.get(clientMessageId);
    if (existing && Date.now() - existing.ts < 60_000) return { message: existing.msg };
  }

  // Access: verify sender has access to the project
  const { rows: access } = await db.query(`
    SELECT 1 FROM projects p
    JOIN clients c ON c.id = p.client_id
    JOIN users u ON u.id = $2
    WHERE p.id = $1
      AND (
        u.role IN ('admin','team')
        OR c.user_id = $2
      )
  `, [projectId, senderId]);
  if (!access[0]) return { error: "Access denied" };

  const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  const { rows } = await db.query(`
    INSERT INTO messages (id, project_id, sender_id, text, type, attachments, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,NOW())
    RETURNING *
  `, [id, projectId, senderId, text, type, JSON.stringify(attachments)]);

  const msg = rows[0];

  // Cache sender's own read
  await db.query(
    "INSERT INTO message_reads (message_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [id, senderId]
  );

  if (clientMessageId) _sentIds.set(clientMessageId, { msg, ts: Date.now() });
  cache.invalidate(`thread:${projectId}`);
  cache.invalidate(`conversations:`);
  cache.invalidate(`unread:`);

  return {
    message: {
      id: msg.id, projectId: msg.project_id, senderId: msg.sender_id,
      text: msg.text, type: msg.type, attachments: msg.attachments || [],
      createdAt: msg.created_at,
    }
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// MARK READ
// ──────────────────────────────────────────────────────────────────────────────
export async function markThreadRead(projectId, userId) {
  const { rows: unread } = await db.query(`
    SELECT m.id FROM messages m
    WHERE m.project_id=$1
      AND m.sender_id != $2
      AND NOT EXISTS (SELECT 1 FROM message_reads WHERE message_id=m.id AND user_id=$2)
  `, [projectId, userId]);

  if (unread.length === 0) return { count: 0 };

  const ids = unread.map(r => r.id);
  await db.query(`
    INSERT INTO message_reads (message_id, user_id)
    SELECT unnest($1::text[]), $2
    ON CONFLICT DO NOTHING
  `, [ids, userId]);

  cache.invalidate(`unread:${userId}`);
  cache.invalidate(`conversations:${userId}`);
  cache.invalidate(`thread:${projectId}`);
  return { count: ids.length };
}

// ──────────────────────────────────────────────────────────────────────────────
// UNREAD COUNT
// ──────────────────────────────────────────────────────────────────────────────
export async function getUnreadCountForUser(userId) {
  const ck = cacheKey.unread(userId);
  const cached = cache.get(ck);
  if (cached !== null) return cached;

  const { rows } = await db.query(`
    SELECT COUNT(*) FROM messages m
    WHERE m.sender_id != $1
      AND NOT EXISTS (SELECT 1 FROM message_reads mr WHERE mr.message_id=m.id AND mr.user_id=$1)
  `, [userId]);

  const count = Number(rows[0].count);
  cache.set(ck, count, CACHE_TTL.UNREAD_COUNT);
  return count;
}

// ──────────────────────────────────────────────────────────────────────────────
// CLIENT REQUESTS
// ──────────────────────────────────────────────────────────────────────────────
export async function getRequestsForClient(clientId) {
  const { rows } = await db.query(
    "SELECT * FROM client_requests WHERE client_id=$1 ORDER BY created_at DESC", [clientId]
  );
  return rows;
}

export async function getAllRequests() {
  const { rows } = await db.query(`
    SELECT cr.*,
           c.company AS client_name,
           p.name    AS project_name
    FROM   client_requests cr
    LEFT JOIN clients  c ON c.id = cr.client_id
    LEFT JOIN projects p ON p.id = cr.project_id
    ORDER BY cr.created_at DESC
  `);
  return rows;
}

export async function createRequest({ clientId, projectId, type, title, description, userId }) {
  const id = `req_${Date.now()}`;
  const today = new Date().toISOString().split("T")[0];

  const { rows } = await db.query(`
    INSERT INTO client_requests (id, client_id, project_id, type, title, description, status, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,'pending',$7)
    RETURNING *
  `, [id, clientId, projectId, type||"change", title, description||"", today]);

  await db.query(
    "INSERT INTO activity_log (id,user_id,action,timestamp) VALUES ($1,$2,$3,NOW())",
    [`act_${Date.now()}`, userId||"unknown", `submitted ${type} request: "${title}"`]
  );

  cache.invalidate(`dashboard:`);
  return { request: rows[0] };
}

export async function updateRequestStatus(requestId, newStatus, userId) {
  const valid = ["pending","in-progress","completed","rejected"];
  if (!valid.includes(newStatus)) return { error: `Invalid status` };

  const today = new Date().toISOString().split("T")[0];
  const resolvedAt = ["completed","rejected"].includes(newStatus) ? today : null;

  const { rows } = await db.query(
    "UPDATE client_requests SET status=$1, resolved_at=$2 WHERE id=$3 RETURNING *",
    [newStatus, resolvedAt, requestId]
  );
  if (!rows[0]) return { error: "Request not found" };

  cache.invalidate(`dashboard:`);
  return { request: rows[0] };
}

// ──────────────────────────────────────────────────────────────────────────────
// ACTIVITY LOG
// ──────────────────────────────────────────────────────────────────────────────
export async function getActivityLog(limit=20) {
  const { rows } = await db.query(`
    SELECT al.*, u.name AS user_name
    FROM   activity_log al
    LEFT JOIN users u ON u.id = al.user_id
    ORDER BY al.timestamp DESC
    LIMIT $1
  `, [limit]);
  return rows.map(a => ({ ...a, userName: a.user_name || a.user_id }));
}
