/**
 * server/services/notificationService.js
 * Engineering patterns: Queue with 3x retry, 2s back-off, email via Resend.
 */
import { Resend } from "resend";
import { db } from "../db/pool.js";
import { cache, cacheKey, CACHE_TTL } from "../utils/cache.js";

let _resend = null;
function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "pawansankalpanew123@gmail.com";
const FROM = "GaleGrid <onboarding@resend.dev>";

// ── In-memory queue (FIFO) ──────────────────────────────────────
const _queue = [];
let _processing = false;

async function processQueue() {
  if (_processing || _queue.length === 0) return;
  _processing = true;

  while (_queue.length > 0) {
    const job = _queue.shift();
    let attempt = 0;
    let success = false;

    while (attempt < 3 && !success) {
      attempt++;
      try {
        await job.fn();
        success = true;
      } catch (err) {
        console.error(`[Notification] Email attempt ${attempt} failed:`, err.message);
        if (attempt < 3) await sleep(2000 * attempt);
      }
    }
    if (!success) console.error("[Notification] Email dropped after 3 attempts");
  }

  _processing = false;
}

function enqueue(fn) {
  _queue.push({ fn });
  processQueue().catch(() => {});
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Create DB notification ──────────────────────────────────────
export async function createNotification({ userId, type, title, body, link }) {
  const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await db.query(
    "INSERT INTO notifications (id, user_id, type, title, body, link) VALUES ($1,$2,$3,$4,$5,$6)",
    [id, userId, type || "system", title, body || "", link || "/admin"]
  );
  cache.invalidate(`notifications:${userId}`);
  return id;
}

// ── Get notifications for a user (paginated) ───────────────────
export async function getNotificationsForUser(userId, { page = 1, limit = 30 } = {}) {
  const ck = cacheKey.notifications(userId) + `:${page}`;
  const cached = cache.get(ck);
  if (cached) return cached;

  const offset = (page - 1) * limit;
  const { rows } = await db.query(
    "SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    [userId, limit, offset]
  );

  const result = rows;
  cache.set(ck, result, CACHE_TTL.NOTIFICATIONS);
  return result;
}

// ── Mark read ───────────────────────────────────────────────────
export async function markNotificationRead(notificationId, userId) {
  await db.query(
    "UPDATE notifications SET read=true WHERE id=$1 AND user_id=$2",
    [notificationId, userId]
  );
  cache.invalidate(`notifications:${userId}`);
}

export async function markAllNotificationsRead(userId) {
  await db.query("UPDATE notifications SET read=true WHERE user_id=$1 AND read=false", [userId]);
  cache.invalidate(`notifications:${userId}`);
}

// ── New message notification (queue + email) ────────────────────
export async function notifyNewMessage({ projectId, projectName, senderName, recipientId, messagePreview }) {
  try {
    const id = await createNotification({
      userId: recipientId,
      type:   "message",
      title:  `New message from ${senderName}`,
      body:   messagePreview?.slice(0, 120),
      link:   `/admin/inbox/${projectId}`,
    });

    // Queue email
    const { rows } = await db.query("SELECT email, name FROM users WHERE id=$1 LIMIT 1", [recipientId]);
    const recipient = rows[0];
    if (!recipient) return;

    enqueue(async () => {
      const r = getResend();
      if (!r) return;
      await r.emails.send({
        from: FROM,
        to: recipient.email,
        subject: `New message on ${projectName} — GaleGrid`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#0f172a;padding:20px 28px;">
              <h2 style="color:#fff;margin:0;font-size:17px;">New Message</h2>
            </div>
            <div style="padding:24px 28px;">
              <p style="margin:0 0 12px;font-size:14px;color:#374151;">
                <strong>${senderName}</strong> sent a message on <strong>${projectName}</strong>:
              </p>
              <blockquote style="margin:0 0 20px;padding:12px 16px;background:#f9fafb;border-left:3px solid #6366f1;color:#374151;font-size:14px;">
                ${messagePreview?.slice(0, 200)}
              </blockquote>
              <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/admin/inbox/${projectId}"
                 style="display:inline-block;background:#6366f1;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;">
                View Conversation
              </a>
            </div>
          </div>
        `,
      });
    });
  } catch (err) {
    console.error("[Notification] notifyNewMessage error:", err.message);
  }
}

// ── New request notification ────────────────────────────────────
export async function notifyNewRequest({ clientName, requestTitle, requestType }) {
  try {
    // Notify all admins
    const { rows: admins } = await db.query("SELECT id FROM users WHERE role='admin'");

    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type:   "request",
        title:  `New ${requestType} request from ${clientName}`,
        body:   requestTitle,
        link:   "/admin/requests",
      });
    }

    enqueue(async () => {
      const r = getResend();
      if (!r) return;
      await r.emails.send({
        from:    FROM,
        to:      ADMIN_EMAIL,
        subject: `New Request: ${requestTitle} — GaleGrid`,
        html: `<p><strong>${clientName}</strong> submitted a <strong>${requestType}</strong> request: "${requestTitle}"</p><p><a href="${process.env.CLIENT_URL || "http://localhost:5173"}/admin/requests">Review in CRM</a></p>`,
      });
    });
  } catch (err) {
    console.error("[Notification] notifyNewRequest error:", err.message);
  }
}
