/**
 * server/routes/uploads.js
 * File upload endpoint with rate limiting and access control.
 */
import { Router } from "express";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadLimiter } from "../middleware/rateLimiter.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadFile, uploadDeliverable } from "../services/storageService.js";
import { db } from "../db/pool.js";

const router = Router();

// POST /api/uploads/attachment — attach file to a message
router.post(
  "/attachment",
  authenticateJwt,
  uploadLimiter,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file provided" });

      const { projectId } = req.body;
      const { url, hash, deduplicated } = await uploadFile({
        buffer:       req.file.buffer,
        originalname: req.file.originalname,
        mimetype:     req.file.mimetype,
        projectId,
        uploadedBy:   req.user.id,
      });

      return res.json({
        url,
        filename:     req.file.originalname,
        mimeType:     req.file.mimetype,
        fileSize:     req.file.size,
        hash,
        deduplicated,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/uploads/deliverable — upload a deliverable (admin/team only)
router.post(
  "/deliverable",
  authenticateJwt,
  authorizeRoles("admin", "team"),
  uploadLimiter,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file provided" });

      const { projectId, title, description } = req.body;
      if (!projectId) return res.status(400).json({ error: "projectId is required" });

      const result = await uploadDeliverable({
        buffer:       req.file.buffer,
        originalname: req.file.originalname,
        mimetype:     req.file.mimetype,
        projectId,
        title,
        description,
        uploadedBy:   req.user.id,
      });

      return res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/uploads/deliverables/:projectId
router.get("/deliverables/:projectId", authenticateJwt, async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM deliverables WHERE project_id=$1 ORDER BY created_at DESC",
      [req.params.projectId]
    );
    return res.json({ deliverables: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/uploads/deliverables/:id/review — client approves/requests revision
router.put("/deliverables/:id/review", authenticateJwt, async (req, res) => {
  try {
    const { status, comment } = req.body;
    const validStatuses = ["approved", "revision_needed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status must be approved or revision_needed" });
    }

    const { rows } = await db.query(`
      UPDATE deliverables
      SET status=$1, review_comment=$2, reviewed_by=$3, reviewed_at=NOW()
      WHERE id=$4
      RETURNING *
    `, [status, comment || "", req.user.id, req.params.id]);

    if (!rows[0]) return res.status(404).json({ error: "Deliverable not found" });
    return res.json({ deliverable: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
