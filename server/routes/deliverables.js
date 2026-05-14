/**
 * server/routes/deliverables.js
 * Mounted at /api/deliverables
 */
import express from "express";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  getDeliverablesForProject,
  createDeliverable,
  updateDeliverableStatus,
} from "../services/deliverableService.js";

const router = express.Router();
router.use(authenticateJwt);

// ── GET /api/deliverables/project/:projectId ────────────────────
router.get("/project/:projectId", async (req, res) => {
  try {
    const items = await getDeliverablesForProject(
      req.params.projectId,
      req.user
    );
    res.json({ deliverables: items });
  } catch (err) {
    console.error("[deliverables] GET error:", err.message);
    res.status(500).json({ error: "Failed to load deliverables" });
  }
});

// ── POST /api/deliverables  (admin/team only) ───────────────────
router.post(
  "/",
  authorizeRoles("admin", "team"),
  validate(["projectId", "title"]),
  async (req, res) => {
    try {
      const { projectId, title, description, fileUrl, filename, mimeType, fileSize } = req.body;
      const deliverable = await createDeliverable({
        projectId,
        title,
        description,
        fileUrl,
        filename,
        mimeType,
        fileSize: fileSize ? Number(fileSize) : null,
        uploadedBy: req.user.id,
      });
      res.status(201).json({ deliverable });
    } catch (err) {
      console.error("[deliverables] POST error:", err.message);
      res.status(500).json({ error: "Failed to create deliverable" });
    }
  }
);

// ── PUT /api/deliverables/:id/status ───────────────────────────
router.put(
  "/:id/status",
  validate(["status"]),
  async (req, res) => {
    try {
      const { status, reviewComment } = req.body;
      const result = await updateDeliverableStatus(
        req.params.id,
        status,
        reviewComment,
        req.user
      );

      if (result.error) {
        return res.status(result.status || 400).json({ error: result.error });
      }

      res.json({ deliverable: result.deliverable, changed: result.changed });
    } catch (err) {
      console.error("[deliverables] PUT status error:", err.message);
      res.status(500).json({ error: "Failed to update deliverable status" });
    }
  }
);

export default router;
