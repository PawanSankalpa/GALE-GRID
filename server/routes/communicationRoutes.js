import express from "express";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";
import { messageLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  conversations,
  projectThread,
  postMessage,
  unreadCount,
  markRead,
  myRequests,
  allRequests,
  submitRequest,
  changeRequestStatus,
  activityFeed,
} from "../controllers/communicationController.js";

const router = express.Router();

router.use(authenticateJwt);

// Conversations inbox
router.get("/conversations", conversations);

// Thread (paginated messages for one project)
router.get("/thread/:projectId",  projectThread);
router.put("/thread/:projectId/read", markRead);

// Send message
router.post("/messages", messageLimiter, validate(["projectId", "text"]), postMessage);

// Unread count
router.get("/unread", unreadCount);

// Client requests — clients AND admin/team can both access
router.get("/requests/mine", authorizeRoles("client"), myRequests);
router.get("/requests", authorizeRoles("admin", "team"), allRequests);
router.post("/requests", authorizeRoles("client"), validate(["projectId", "title"]), submitRequest);
router.put("/requests/:id/status", authorizeRoles("admin", "client", "team"), changeRequestStatus);

// Activity
router.get("/activity", authorizeRoles("admin"), activityFeed);

export default router;
