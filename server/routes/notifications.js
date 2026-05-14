/**
 * server/routes/notifications.js
 */
import { Router } from "express";
import { authenticateJwt } from "../middleware/authMiddleware.js";
import {
  getNotificationsForUser,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService.js";

const router = Router();

// GET /api/notifications
router.get("/", authenticateJwt, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 30;
    const data  = await getNotificationsForUser(req.user.id, { page, limit });
    return res.json({ notifications: data });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});

// PUT /api/notifications/:id/read
router.put("/:id/read", authenticateJwt, async (req, res) => {
  try {
    await markNotificationRead(req.params.id, req.user.id);
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});

// PUT /api/notifications/read-all
router.put("/read-all", authenticateJwt, async (req, res) => {
  try {
    await markAllNotificationsRead(req.user.id);
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ message: e.message }); }
});

export default router;
