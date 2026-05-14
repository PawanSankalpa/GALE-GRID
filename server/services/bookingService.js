import { Resend } from "resend";
import { db } from "../db/pool.js";

let _resend = null;
function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "pawansankalpanew123@gmail.com";
const FROM = "GaleGrid Bookings <onboarding@resend.dev>";

// ─── Create pre-qual lead ──────────────────────────────────
export async function createPrequalLead(data) {
  const id = `bk_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const now = new Date().toISOString();

  const { rows } = await db.query(`
    INSERT INTO bookings (id, name, email, phone, company, website, budget, service, hear_about, status, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending',$10,$10)
    RETURNING *
  `, [id, data.name, data.email, data.phone||"", data.company||"", data.website||"", data.budget||"", data.service||"", data.hearAbout||"", now]);

  return rows[0];
}

// ─── Confirm booking from Cal.com webhook ─────────────────
export async function confirmBookingByEmail(calPayload) {
  const { uid, attendees, startTime } = calPayload;
  const attendee = attendees?.[0] || {};

  // Try to find existing pending booking by attendee email
  const { rows: existing } = await db.query(
    "SELECT * FROM bookings WHERE LOWER(email)=LOWER($1) AND status='pending' ORDER BY created_at DESC LIMIT 1",
    [attendee.email || ""]
  );

  let booking;
  if (existing[0]) {
    const { rows } = await db.query(
      "UPDATE bookings SET status='confirmed', cal_event_uid=$1, scheduled_at=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
      [uid, startTime, existing[0].id]
    );
    booking = rows[0];
  } else {
    const id = `bk_cal_${Date.now()}`;
    const now = new Date().toISOString();
    const { rows } = await db.query(`
      INSERT INTO bookings (id, name, email, status, cal_event_uid, scheduled_at, created_at, updated_at)
      VALUES ($1,$2,$3,'confirmed',$4,$5,$6,$6)
      RETURNING *
    `, [id, attendee.name||"", attendee.email||"", uid, startTime, now]);
    booking = rows[0];
  }

  return booking;
}

// ─── Admin alert email ────────────────────────────────────
export async function sendAdminAlert(booking) {
  const resend = getResend();
  if (!resend) { console.warn("RESEND_API_KEY not set"); return; }
  const date = booking.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })
    : "TBD";

  await resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `New Call — ${booking.name} | ${booking.budget||"—"} | ${date}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;"><div style="background:#0f172a;padding:24px 32px;"><h2 style="color:#fff;margin:0;font-size:18px;">New Discovery Call</h2></div><div style="padding:28px 32px;"><table style="width:100%;border-collapse:collapse;"><tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Name</td><td style="padding:8px 0;font-weight:500;">${booking.name}</td></tr><tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Email</td><td>${booking.email}</td></tr><tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Budget</td><td style="color:#f97316;font-weight:600;">${booking.budget||"—"}</td></tr><tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Service</td><td>${booking.service||"—"}</td></tr><tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Scheduled</td><td style="font-weight:600;">${date}</td></tr></table></div></div>`,
  });
}

// ─── Client confirmation email ────────────────────────────
export async function sendClientConfirmation(booking) {
  const resend = getResend();
  if (!resend) { console.warn("RESEND_API_KEY not set"); return; }
  const date = booking.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleString("en-GB", { weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Asia/Dubai" })
    : "as scheduled";

  await resend.emails.send({
    from: FROM, to: booking.email,
    subject: `Your call is confirmed — ${date}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;"><div style="background:#0f172a;padding:24px 32px;"><h2 style="color:#fff;margin:0;font-size:18px;">Discovery call confirmed</h2></div><div style="padding:28px 32px;"><p>Hi ${booking.name||"there"},</p><p>Your 15-minute discovery call with GaleGrid is booked for:</p><div style="background:#f9fafb;border-left:3px solid #f97316;padding:14px 18px;border-radius:6px;margin:20px 0;"><strong>${date}</strong></div><p style="color:#374151;">See you soon,<br/><strong>The GaleGrid Team</strong></p></div></div>`,
  });
}
