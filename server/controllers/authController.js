import {
  createJwtForUser,
  getSessionSecret,
  sanitizeUser,
  validateCredentials,
  registerUser,
} from "../services/authService.js";
import { createNotification } from "../services/notificationService.js";
import { db } from "../db/pool.js";
import { Resend } from "resend";
import jwt from "jsonwebtoken";

const FROM_EMAIL  = "GaleGrid <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await validateCredentials(email, password);
  if (!user) {
    console.warn("[AUTH] Login failed");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createJwtForUser(user);
  console.log(`[AUTH] Login success for user ${user.id}`);
  return res.status(200).json({
    token,
    user: sanitizeUser(user),
  });
}

export async function registerController(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const result = await registerUser({ name, email, password });

  if (result.error) {
    console.warn("[AUTH] Register failed");
    return res.status(409).json({ message: result.error });
  }

  const token = createJwtForUser(result.user);
  console.log(`[AUTH] Register success for user ${result.user.id}`);

  // ── Fire-and-forget: notify all admins ────────────────────────
  (async () => {
    try {
      const { rows: admins } = await db.query("SELECT id FROM users WHERE role='admin'");
      for (const admin of admins) {
        await createNotification({
          userId: admin.id,
          type:   "system",
          title:  `New client registered: ${name.trim()}`,
          body:   email.trim().toLowerCase(),
          link:   "/admin/clients",
        });
      }
    } catch (err) {
      console.error("[AUTH] Admin notification failed:", err.message);
    }

    // Email admin via Resend
    try {
      const r = getResend();
      if (r && ADMIN_EMAIL) {
        await r.emails.send({
          from:    FROM_EMAIL,
          to:      ADMIN_EMAIL,
          subject: `New client registered — ${name.trim()}`,
          html: `
            <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <div style="background:#0f172a;padding:20px 28px;display:flex;align-items:center;gap:10px;">
                <span style="font-size:13px;font-weight:700;color:#ffffff;letter-spacing:2px;">GALE GRID</span>
              </div>
              <div style="padding:28px;">
                <h2 style="margin:0 0 8px;font-size:18px;color:#111827;">New client just registered 🎉</h2>
                <p style="margin:0 0 20px;font-size:14px;color:#6b7280;">A new client created an account on your platform.</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:8px 12px;background:#f9fafb;border-radius:6px 6px 0 0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Name</td><td style="padding:8px 12px;background:#f9fafb;border-radius:6px 6px 0 0;font-size:14px;color:#111827;font-weight:600;">${name.trim()}</td></tr>
                  <tr><td style="padding:8px 12px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Email</td><td style="padding:8px 12px;font-size:14px;color:#111827;">${email.trim().toLowerCase()}</td></tr>
                  <tr><td style="padding:8px 12px;background:#f9fafb;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Stage</td><td style="padding:8px 12px;background:#f9fafb;font-size:14px;color:#111827;">lead</td></tr>
                </table>
                <div style="margin-top:24px;">
                  <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/clients"
                     style="display:inline-block;background:#0284c7;color:#ffffff;padding:11px 22px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                    View in Admin OS →
                  </a>
                </div>
              </div>
              <div style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">GaleGrid Admin OS · This is an automated notification</p>
              </div>
            </div>
          `,
        });
        console.log("[AUTH] Admin email sent");
      }
    } catch (err) {
      console.error("[AUTH] Admin email failed:", err.message);
    }
  })();

  return res.status(201).json({
    token,
    user: sanitizeUser(result.user),
  });
}

export function meController(req, res) {
  return res.status(200).json({ user: req.user });
}

// ── Invite: admin sends a magic-link invite to a prospect ────────
export async function sendInviteController(req, res) {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Check if already registered
  const { rows } = await db.query("SELECT id FROM users WHERE LOWER(email)=$1 LIMIT 1", [email.trim().toLowerCase()]);
  if (rows[0]) {
    return res.status(409).json({ message: "This email is already registered" });
  }

  // Sign a short-lived invite token (24h)
  const sessionSecret = getSessionSecret();
  const inviteToken = jwt.sign(
    { email: email.trim().toLowerCase(), name: name?.trim() || "", type: "invite" },
    sessionSecret,
    { expiresIn: "24h" }
  );

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const inviteUrl   = `${frontendUrl}/register?invite=${inviteToken}`;

  // Send invite email
  try {
    const r = getResend();
    if (r) {
      await r.emails.send({
        from:    FROM_EMAIL,
        to:      email.trim().toLowerCase(),
        subject: "You're invited to GaleGrid",
        html: `
          <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#0f172a;padding:20px 28px;">
              <span style="font-size:13px;font-weight:700;color:#ffffff;letter-spacing:2px;">GALE GRID</span>
            </div>
            <div style="padding:28px;">
              <h2 style="margin:0 0 8px;font-size:18px;color:#111827;">You're invited 🎉</h2>
              <p style="margin:0 0 20px;font-size:14px;color:#6b7280;">
                ${name ? `Hi ${name.trim()}, you've` : "You've"} been invited to access the GaleGrid client portal. Create your account using the button below.
              </p>
              <a href="${inviteUrl}"
                 style="display:inline-block;background:#0284c7;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                Create Your Account →
              </a>
              <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">This link expires in 24 hours.</p>
            </div>
            <div style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">GaleGrid · You received this because an admin invited you</p>
            </div>
          </div>
        `,
      });
    }
  } catch (err) {
    console.error("[AUTH] Invite email failed:", err.message);
    // Still return the URL so admin can copy-share manually
  }

  console.log(`[AUTH] Invite sent by admin ${req.user.id}`);
  return res.status(200).json({ message: "Invite sent", inviteUrl });
}

// ── Validate invite token (called by register page) ──────────────
export function validateInviteController(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Token required" });

  try {
    const sessionSecret = getSessionSecret();
    const payload = jwt.verify(token, sessionSecret);
    if (payload.type !== "invite") {
      return res.status(400).json({ message: "Invalid token type" });
    }
    return res.status(200).json({ email: payload.email, name: payload.name, valid: true });
  } catch {
    return res.status(401).json({ message: "Invite link expired or invalid" });
  }
}
