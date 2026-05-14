import express from "express";
import { prequalify, calWebhook, listBookings } from "../controllers/bookingController.js";
import { authenticateJwt } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public — called from the booking modal step 1
router.post("/prequalify", prequalify);

// Public — called by Cal.com webhook (HMAC-verified internally)
router.post("/webhook", calWebhook);

// Admin-only — booking CRM table
router.get("/", authenticateJwt, listBookings);

export default router;
