import express from "express";
import {
  adminDataController,
  clientDataController,
  overviewController,
  teamDataController,
} from "../controllers/dashboardController.js";
import {
  authenticateJwt,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateJwt);

router.get("/overview", overviewController);
router.get("/admin", authorizeRoles("admin"), adminDataController);
router.get("/team", authorizeRoles("team", "admin"), teamDataController);
router.get("/client", authorizeRoles("client", "admin"), clientDataController);

export default router;
