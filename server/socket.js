/**
 * server/socket.js
 * Engineering patterns: Real-time via Socket.io, throttle (typing), access control.
 * Exports `initSocket(httpServer)` → call after server is created.
 */
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { db } from "./db/pool.js";
import { cache } from "./utils/cache.js";
import { getSessionSecret } from "./services/authService.js";

const FRONTEND_ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

// Per-user typing throttle: max 1 event per 2s per project
const _typingLastSent = new Map(); // `${userId}:${projectId}` → timestamp

export function initSocket(httpServer) {
  const sessionSecret = getSessionSecret();
  const io = new Server(httpServer, {
    cors: {
      origin:      FRONTEND_ORIGIN,
      credentials: true,
    },
    connectionStateRecovery: { maxDisconnectionDuration: 2 * 60_000 },
  });

  // ── JWT auth middleware ──────────────────────────────────────
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("No token"));

    let payload;
    try {
      payload = jwt.verify(token, sessionSecret);
    } catch {
      return next(new Error("Invalid token"));
    }

    try {
      const { rows } = await db.query(
        "SELECT id, name, role FROM users WHERE id = $1 LIMIT 1",
        [payload.sub]
      );
      if (!rows[0]) return next(new Error("User not found"));
      socket.user = rows[0];
      next();
    } catch (err) {
      next(new Error("Auth DB error"));
    }
  });

  // ── Connection ───────────────────────────────────────────────
  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(`[WS] connected: ${user.name} (${user.role})`);

    // Update online status
    db.query("UPDATE users SET status='online', last_seen_at=NOW() WHERE id=$1", [user.id])
      .catch(() => {});

    // ── Join project room ────────────────────────────────────
    socket.on("join_project", async (projectId) => {
      // Verify access
      const ok = await canAccessProject(user, projectId);
      if (!ok) { socket.emit("error", { message: "Access denied" }); return; }
      socket.join(`project:${projectId}`);
      socket.emit("joined", { projectId });
    });

    socket.on("leave_project", (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    // ── New message (clients/admin/team send this) ────────────
    socket.on("send_message", async (data) => {
      const { projectId, text, type = "message", attachments = [], clientMessageId } = data;
      if (!projectId || !text) return;

      const ok = await canAccessProject(user, projectId);
      if (!ok) { socket.emit("error", { message: "Access denied" }); return; }

      // Import lazily to avoid circular dep
      const { sendMessage } = await import("./services/communicationService.js");
      const result = await sendMessage({
        projectId, senderId: user.id,
        text, type, attachments, clientMessageId,
      });

      if (result.error) { socket.emit("message_error", { error: result.error }); return; }

      const payload = {
        ...result.message,
        senderName: user.name,
        senderRole: user.role,
      };

      // Broadcast to everyone in the room
      io.to(`project:${projectId}`).emit("new_message", payload);

      // Deliver unread notification to users NOT in this room
      const roomSockets = await io.in(`project:${projectId}`).fetchSockets();
      const connectedUserIds = new Set(roomSockets.map(s => s.user?.id));

      await notifyAbsentUsers(io, projectId, payload, connectedUserIds, user.id);
    });

    // ── Typing indicator (throttled: 1/2s per user+project) ──
    socket.on("typing_start", (projectId) => {
      const key = `${user.id}:${projectId}`;
      const now = Date.now();
      const last = _typingLastSent.get(key) || 0;
      if (now - last < 2000) return; // throttle
      _typingLastSent.set(key, now);
      socket.to(`project:${projectId}`).emit("user_typing", {
        userId:   user.id,
        userName: user.name,
        projectId,
      });
    });

    socket.on("typing_stop", (projectId) => {
      socket.to(`project:${projectId}`).emit("user_stopped_typing", {
        userId: user.id, projectId,
      });
    });

    // ── Disconnect ───────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`[WS] disconnected: ${user.name}`);
      db.query("UPDATE users SET status='offline', last_seen_at=NOW() WHERE id=$1", [user.id])
        .catch(() => {});
    });
  });

  return io;
}

// ── Helpers ──────────────────────────────────────────────────

async function canAccessProject(user, projectId) {
  if (user.role === "admin") return true;
  if (user.role === "team") {
    const { rows } = await db.query(
      "SELECT 1 FROM projects WHERE id=$1 AND team_member_ids @> $2::jsonb",
      [projectId, JSON.stringify([user.id])]
    );
    return rows.length > 0;
  }
  // client
  const { rows } = await db.query(
    "SELECT 1 FROM projects p JOIN clients c ON c.id=p.client_id WHERE p.id=$1 AND c.user_id=$2",
    [projectId, user.id]
  );
  return rows.length > 0;
}

async function notifyAbsentUsers(io, projectId, message, presentIds, senderId) {
  try {
    // Get all users who should receive this notification
    const { rows } = await db.query(`
      SELECT DISTINCT u.id
      FROM projects p
      JOIN clients c ON c.id = p.client_id
      JOIN users u ON (
        u.role IN ('admin','team')
        OR u.id = c.user_id
      )
      WHERE p.id = $1 AND u.id != $2
    `, [projectId, senderId]);

    for (const row of rows) {
      if (!presentIds.has(row.id)) {
        // Emit to their personal room (joined at connection)
        io.to(`user:${row.id}`).emit("unread_message", {
          projectId,
          message,
        });
      }
    }
  } catch {
    // non-critical
  }
}
