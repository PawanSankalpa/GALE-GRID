import {
  getConversations, getThread, sendMessage, markThreadRead,
  getUnreadCountForUser, getRequestsForClient, getAllRequests,
  createRequest, updateRequestStatus, getActivityLog,
} from "../services/communicationService.js";
import { getClientByUserId } from "../services/clientService.js";

// ── Conversations (admin/team inbox) ──────────────────────────
export async function conversations(req, res) {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const data  = await getConversations(req.user, { page, limit });
    return res.json({ conversations: data });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

// ── Single project thread ─────────────────────────────────────
export async function projectThread(req, res) {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 40;
    const data  = await getThread(req.params.projectId, req.user, { page, limit });
    return res.json(data);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

// ── Send a message ─────────────────────────────────────────────
export async function postMessage(req, res) {
  try {
    const { projectId, text, type, attachments, clientMessageId } = req.body;
    if (!projectId || !text) return res.status(400).json({ message: "projectId and text are required" });

    const result = await sendMessage({
      projectId, senderId: req.user.id,
      text, type, attachments, clientMessageId,
    });
    if (result.error) return res.status(403).json({ message: result.error });
    return res.status(201).json(result.message);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

// ── Unread count ──────────────────────────────────────────────
export async function unreadCount(req, res) {
  try {
    const count = await getUnreadCountForUser(req.user.id);
    return res.json({ unread: count });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

// ── Mark thread read ──────────────────────────────────────────
export async function markRead(req, res) {
  try {
    const result = await markThreadRead(req.params.projectId, req.user.id);
    return res.json(result);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

// ── Client requests ───────────────────────────────────────────
export async function myRequests(req, res) {
  try {
    const client = await getClientByUserId(req.user.id);
    if (!client) return res.status(404).json({ message: "No client profile" });
    return res.json({ requests: await getRequestsForClient(client.id) });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function allRequests(req, res) {
  try { return res.json({ requests: await getAllRequests() }); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function submitRequest(req, res) {
  try {
    const client = await getClientByUserId(req.user.id);
    if (!client) return res.status(404).json({ message: "No client profile" });

    const { projectId, type, title, description } = req.body;
    if (!projectId || !title) return res.status(400).json({ message: "projectId and title are required" });

    const result = await createRequest({ clientId: client.id, projectId, type, title, description, userId: req.user.id });
    return res.status(201).json(result.request);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function changeRequestStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const result = await updateRequestStatus(req.params.id, status, req.user.id);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.json(result.request);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

// ── Activity feed ─────────────────────────────────────────────
export async function activityFeed(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 20;
    return res.json({ activity: await getActivityLog(limit) });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}
