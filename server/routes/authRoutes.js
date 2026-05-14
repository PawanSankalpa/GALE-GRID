import express from "express";
import {
  loginController,
  registerController,
  meController,
  sendInviteController,
  validateInviteController,
} from "../controllers/authController.js";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login",    loginController);
router.get("/me",        authenticateJwt, meController);

// Invite: admin-only send + public validate
router.post("/invite",          authenticateJwt, authorizeRoles("admin"), sendInviteController);
router.get("/invite/validate",  validateInviteController);

export default router;
