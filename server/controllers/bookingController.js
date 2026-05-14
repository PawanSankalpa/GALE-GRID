import crypto from "crypto";
import { db } from "../db/pool.js";
import {
  createPrequalLead,
  confirmBookingByEmail,
  sendAdminAlert,
  sendClientConfirmation,
} from "../services/bookingService.js";

// POST /api/bookings/prequalify
export async function prequalify(req, res) {
  const { name, email, phone, company, website, budget, service, hearAbout } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required." });

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) return res.status(400).json({ error: "Invalid email address." });

  try {
    const lead = await createPrequalLead({ name, email, phone, company, website, budget, service, hearAbout });
    return res.status(201).json({ success: true, bookingId: lead.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// POST /api/bookings/webhook
export async function calWebhook(req, res) {
  const signature = req.headers["x-cal-signature-256"] || req.headers["x-webhook-secret"] || "";
  const secret = process.env.CAL_WEBHOOK_SECRET || "";
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !secret) {
    return res.status(500).json({ error: "Webhook secret is not configured." });
  }

  if (secret) {
    if (!signature) {
      return res.status(401).json({ error: "Missing webhook signature." });
    }
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(JSON.stringify(req.body));
    const expected = hmac.digest("hex");
    const expectedBuf = Buffer.from(expected);
    const sigBuf = Buffer.from(signature);
    if (expectedBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expectedBuf, sigBuf)) {
      return res.status(401).json({ error: "Invalid webhook signature." });
    }
  }

  const { triggerEvent, payload } = req.body;
  if (!["BOOKING_CREATED","booking.created","booking_created"].includes(triggerEvent)) {
    return res.json({ received: true });
  }

  try {
    const booking = await confirmBookingByEmail(payload);
    await Promise.all([sendAdminAlert(booking), sendClientConfirmation(booking)]).catch(err => {
      console.error("Email send failed:", err.message);
    });
    return res.json({ received: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// GET /api/bookings
export async function listBookings(req, res) {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM bookings ORDER BY created_at DESC";
    const params = [];
    if (status && status !== "all") {
      query = "SELECT * FROM bookings WHERE status=$1 ORDER BY created_at DESC";
      params.push(status);
    }
    const { rows } = await db.query(query, params);
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
