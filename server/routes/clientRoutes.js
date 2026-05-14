import express from "express";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  listClients,
  getClient,
  getMyClientData,
  changeClientStage,
  addClient,
  editClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.use(authenticateJwt);

// Client self-service
router.get("/me", authorizeRoles("client"), getMyClientData);

// Admin management
router.get("/", authorizeRoles("admin"), listClients);
router.get("/:id", authorizeRoles("admin"), getClient);
router.post("/", authorizeRoles("admin"), addClient);
router.put("/:id", authorizeRoles("admin"), editClient);
router.put("/:id/stage", authorizeRoles("admin"), changeClientStage);

export default router;
