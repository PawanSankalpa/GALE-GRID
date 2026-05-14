/**
 * server/routes/team.js
 * Mounted at /api/team  (admin-only)
 */
import express from "express";
import rateLimit from "express-rate-limit";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  getAllTeamMembers,
  getTeamMemberById,
  getWorkloadSummary,
  createTeamMember,
  updateTeamMember,
  deactivateTeamMember,
} from "../services/teamService.js";

const router = express.Router();

// All team management routes are admin-only
router.use(authenticateJwt);
router.use(authorizeRoles("admin"));

// Custom rate-limiter: max 10 new-member creations per hour
const createTeamLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Too many team member additions. Try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── GET /api/team ───────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const [members, workload] = await Promise.all([
      getAllTeamMembers(),
      getWorkloadSummary(),
    ]);

    // Merge workload into members
    const workloadMap = Object.fromEntries(
      workload.map((w) => [w.user_id, w])
    );
    const enriched = members.map((m) => ({
      ...m,
      ...(workloadMap[m.id] || {}),
    }));

    res.json({ members: enriched });
  } catch (err) {
    console.error("[team] GET / error:", err.message);
    res.status(500).json({ error: "Failed to load team members" });
  }
});

// ── GET /api/team/:id ───────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const member = await getTeamMemberById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json({ member });
  } catch (err) {
    console.error("[team] GET /:id error:", err.message);
    res.status(500).json({ error: "Failed to load team member" });
  }
});

// ── POST /api/team ──────────────────────────────────────────────
router.post(
  "/",
  createTeamLimiter,
  validate(["name", "email", "password"]),
  async (req, res) => {
    try {
      const { name, email, password, title, department } = req.body;
      const member = await createTeamMember({ name, email, password, title, department });
      res.status(201).json({ member });
    } catch (err) {
      console.error("[team] POST error:", err.message);
      if (err.message === "EMAIL_EXISTS") {
        return res.status(409).json({ error: "A user with that email already exists." });
      }
      res.status(500).json({ error: "Failed to create team member" });
    }
  }
);

// ── PUT /api/team/:id ───────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const { name, email, title, department } = req.body;
    const member = await updateTeamMember(req.params.id, { name, email, title, department });
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json({ member });
  } catch (err) {
    console.error("[team] PUT error:", err.message);
    res.status(500).json({ error: "Failed to update team member" });
  }
});

// ── DELETE /api/team/:id ────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    if (req.body?.confirm !== true) {
      return res.status(400).json({ error: "Confirmation required. Send { confirm: true } in request body." });
    }
    const result = await deactivateTeamMember(req.params.id);
    if (!result) return res.status(404).json({ error: "Member not found" });
    res.json({ message: "Team member deactivated successfully." });
  } catch (err) {
    console.error("[team] DELETE error:", err.message);
    res.status(500).json({ error: "Failed to deactivate team member" });
  }
});

export default router;
