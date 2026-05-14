import jwt from "jsonwebtoken";
import { db } from "../db/pool.js";

export async function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.SESSION_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const { rows } = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = $1 LIMIT 1",
      [payload.sub]
    );
    if (!rows[0]) {
      return res.status(401).json({ message: "Invalid token user" });
    }
    req.user = rows[0];
    return next();
  } catch (err) {
    console.error("[Auth] DB lookup error:", err.message);
    return res.status(500).json({ message: "Authentication error" });
  }
}

export function authorizeRoles(...allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}
