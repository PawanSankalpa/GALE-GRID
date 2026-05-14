/**
 * server/services/deliverableService.js
 * Engineering patterns: Access control, idempotency (state guard),
 * cache invalidation, notification queue on status change.
 */
import { db } from "../db/pool.js";
import { cache, cacheKey, CACHE_TTL } from "../utils/cache.js";
import {
  createNotification,
  notifyNewRequest,
} from "./notificationService.js";

const VALID_TRANSITIONS = {
  draft:            ["review"],
  review:           ["approved", "revision_needed"],
  approved:         [],          // terminal
  revision_needed:  ["review"],  // team re-submits after fixing
};

function newId() {
  return `dlv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── Cache helpers ────────────────────────────────────────────────
function ckProject(projectId) { return `deliverables:project:${projectId}`; }

// ── Get deliverables for a project ───────────────────────────────
export async function getDeliverablesForProject(projectId, requestingUser) {
  const ck = ckProject(projectId);
  const cached = cache.get(ck);
  if (cached) return cached;

  const { rows } = await db.query(
    `SELECT d.*,
            u.name  AS uploader_name,
            rv.name AS reviewer_name
     FROM   deliverables d
     LEFT JOIN users u  ON u.id  = d.uploaded_by
     LEFT JOIN users rv ON rv.id = d.reviewed_by
     WHERE  d.project_id = $1
     ORDER  BY d.created_at DESC`,
    [projectId]
  );

  cache.set(ck, rows, CACHE_TTL.PROJECTS);
  return rows;
}

// ── Create a deliverable ─────────────────────────────────────────
export async function createDeliverable({
  projectId,
  title,
  description,
  fileUrl,
  filename,
  mimeType,
  fileSize,
  uploadedBy,
}) {
  const id = newId();

  const { rows } = await db.query(
    `INSERT INTO deliverables
       (id, project_id, title, description, file_url, filename,
        mime_type, file_size, uploaded_by, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'draft')
     RETURNING *`,
    [id, projectId, title, description || null, fileUrl || null,
     filename || null, mimeType || null, fileSize || null, uploadedBy]
  );

  cache.invalidate(`deliverables:project:${projectId}`);
  cache.invalidate(`projects:`);

  // Log activity
  await db.query(
    `INSERT INTO activity_log (id, project_id, user_id, action, details)
     VALUES ($1,$2,$3,'deliverable_created',$4)`,
    [`act_${Date.now()}`, projectId, uploadedBy, JSON.stringify({ title })]
  ).catch(() => {});

  return rows[0];
}

// ── Update deliverable status (idempotent, transition-guarded) ───
export async function updateDeliverableStatus(
  deliverableId,
  newStatus,
  reviewComment,
  requestingUser        // { id, role }
) {
  // Fetch current row
  const { rows: [current] } = await db.query(
    `SELECT d.*, p.client_id
     FROM   deliverables d
     JOIN   projects p ON p.id = d.project_id
     WHERE  d.id = $1`,
    [deliverableId]
  );
  if (!current) return { error: "Deliverable not found", status: 404 };

  // Idempotency: already in requested state — no-op
  if (current.status === newStatus) {
    return { deliverable: current, changed: false };
  }

  // Validate transition
  const allowed = VALID_TRANSITIONS[current.status] || [];
  if (!allowed.includes(newStatus)) {
    return {
      error: `Cannot transition from '${current.status}' to '${newStatus}'`,
      status: 400,
    };
  }

  // Access control:
  // Only admin/team can move draft→review
  // Only client (project owner) or admin can move review→approved|revision_needed
  if (newStatus === "review" && !["admin", "team"].includes(requestingUser.role)) {
    return { error: "Only team members can submit for review", status: 403 };
  }
  if (["approved", "revision_needed"].includes(newStatus)) {
    if (requestingUser.role !== "admin" && requestingUser.role !== "client") {
      return { error: "Only the client or admin can approve/request revision", status: 403 };
    }
    // Extra: client must own the project
    if (requestingUser.role === "client") {
      const { rows: [proj] } = await db.query(
        "SELECT client_id FROM projects WHERE id=$1",
        [current.project_id]
      );
      const { rows: [cl] } = await db.query(
        "SELECT id FROM clients WHERE user_id=$1",
        [requestingUser.id]
      );
      if (!proj || !cl || proj.client_id !== cl?.id) {
        return { error: "Forbidden — not your project", status: 403 };
      }
    }
  }

  // Apply update
  const { rows: [updated] } = await db.query(
    `UPDATE deliverables
     SET status=$1, review_comment=$2, reviewed_by=$3, reviewed_at=NOW()
     WHERE id=$4
     RETURNING *`,
    [newStatus, reviewComment || null, requestingUser.id, deliverableId]
  );

  // Invalidate cache
  cache.invalidate(`deliverables:project:${current.project_id}`);

  // Log activity
  await db.query(
    `INSERT INTO activity_log (id, project_id, user_id, action, details)
     VALUES ($1,$2,$3,'deliverable_status_changed',$4)`,
    [
      `act_${Date.now()}`,
      current.project_id,
      requestingUser.id,
      JSON.stringify({ deliverableId, from: current.status, to: newStatus }),
    ]
  ).catch(() => {});

  // Notifications (fire-and-forget via queue)
  _notifyStatusChange(current, newStatus, updated, requestingUser).catch(() => {});

  return { deliverable: updated, changed: true };
}

async function _notifyStatusChange(prev, newStatus, updated, actor) {
  try {
    if (newStatus === "review") {
      // Notify the project's client that a deliverable is ready for review
      const { rows: [proj] } = await db.query(
        "SELECT client_id FROM projects WHERE id=$1",
        [prev.project_id]
      );
      if (proj?.client_id) {
        const { rows: [cl] } = await db.query(
          "SELECT user_id FROM clients WHERE id=$1",
          [proj.client_id]
        );
        if (cl?.user_id) {
          await createNotification({
            userId: cl.user_id,
            type:   "message",
            title:  "Deliverable ready for review",
            body:   `"${updated.title}" is ready for your approval.`,
            link:   `/admin/projects`,
          });
        }
      }
    }

    if (newStatus === "revision_needed") {
      // Notify the uploader (team member) that revision is needed
      if (prev.uploaded_by) {
        await createNotification({
          userId: prev.uploaded_by,
          type:   "request",
          title:  "Revision requested",
          body:   `Client requested changes on "${updated.title}". Comment: ${updated.review_comment || "—"}`,
          link:   `/admin/projects`,
        });
      }
    }

    if (newStatus === "approved") {
      // Notify the uploader
      if (prev.uploaded_by) {
        await createNotification({
          userId: prev.uploaded_by,
          type:   "system",
          title:  "Deliverable approved!",
          body:   `"${updated.title}" was approved by the client.`,
          link:   `/admin/projects`,
        });
      }
    }
  } catch (err) {
    console.error("[Deliverable] notification error:", err.message);
  }
}
