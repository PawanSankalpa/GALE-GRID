import express from "express";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";
import { listMyTasks, listAllTasks, addTask, changeTaskStatus } from "../controllers/taskController.js";

const router = express.Router();

router.use(authenticateJwt);

router.get("/mine", authorizeRoles("admin", "team"), listMyTasks);
router.get("/", authorizeRoles("admin"), listAllTasks);
router.post("/", authorizeRoles("admin"), addTask);
router.put("/:id/status", authorizeRoles("admin", "team"), changeTaskStatus);

export default router;
