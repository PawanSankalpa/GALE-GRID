import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/pool.js";

const JWT_EXPIRES_IN = "12h";
const SALT_ROUNDS = 10;

export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to a strong 32+ character value");
  }
  return secret;
}

/** Strip password_hash before sending to client */
export function sanitizeUser(row) {
  if (!row) return null;
  const { password_hash, ...safe } = row;
  // Normalise DB snake_case → camelCase expected by frontend
  return {
    id:         safe.id,
    name:       safe.name,
    email:      safe.email,
    role:       safe.role,
    title:      safe.title,
    department: safe.department,
    status:     safe.status,
    createdAt:  safe.created_at,
  };
}

export async function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const { rows } = await db.query(
    "SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1",
    [normalizedEmail]
  );
  return rows[0] || null;
}

export async function validateCredentials(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid ? user : null;
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) return { error: "Invalid email format" };

  const existing = await findUserByEmail(normalizedEmail);
  if (existing) return { error: "A user with this email already exists" };

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId   = `u_${Date.now()}`;
  const clientId = `c_${Date.now() + 1}`;
  const today    = new Date().toISOString().split("T")[0];

  // Wrap user + client creation in a transaction so both succeed or both fail
  const pgClient = await db.connect();
  try {
    await pgClient.query("BEGIN");

    const { rows } = await pgClient.query(
      `INSERT INTO users (id, name, email, role, password_hash)
       VALUES ($1, $2, $3, 'client', $4)
       RETURNING id, name, email, role, title, department, status, created_at`,
      [userId, name.trim(), normalizedEmail, password_hash]
    );

    await pgClient.query(
      `INSERT INTO clients (id, user_id, company, contact_name, contact_email, stage, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'lead', $6, $6)`,
      [clientId, userId, name.trim(), name.trim(), normalizedEmail, today]
    );

    await pgClient.query("COMMIT");
    console.log(`[AUTH] Registered user ${userId} with client ${clientId}`);
    return { user: rows[0], clientId };
  } catch (err) {
    await pgClient.query("ROLLBACK");
    console.error("[AUTH] Registration transaction rolled back:", err.message);
    throw err;
  } finally {
    pgClient.release();
  }
}

export function createJwtForUser(user) {
  const sessionSecret = getSessionSecret();
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email, name: user.name },
    sessionSecret,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
