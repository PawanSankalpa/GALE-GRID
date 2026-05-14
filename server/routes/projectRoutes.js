import express from "express";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";
import { listProjects, getProject, addProject, editProject } from "../controllers/projectController.js";

const router = express.Router();

router.use(authenticateJwt);

router.get("/", authorizeRoles("admin"), listProjects);
router.get("/:id", getProject);
router.post("/", authorizeRoles("admin"), addProject);
router.put("/:id", authorizeRoles("admin"), editProject);

export default router;
