/**
 * server/middleware/rateLimiter.js
 * Engineering pattern: Rate Limiting via express-rate-limit.
 * Different limits for auth, messaging, uploads, and general API.
 */
import rateLimit from "express-rate-limit";

const jsonHandler = (req, res) =>
  res.status(429).json({ error: "Too many requests — please slow down." });

/** Strict limiter for auth endpoints: 5 attempts per minute */
export const authLimiter = rateLimit({
  windowMs:         60_000,
  max:              5,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          jsonHandler,
});

/** Messaging: 20 messages per minute per IP */
export const messageLimiter = rateLimit({
  windowMs:         60_000,
  max:              20,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          jsonHandler,
});

/** File uploads: 10 per minute per IP */
export const uploadLimiter = rateLimit({
  windowMs:         60_000,
  max:              10,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          jsonHandler,
});

/** General API: 200 requests per minute per IP */
export const apiLimiter = rateLimit({
  windowMs:         60_000,
  max:              200,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          jsonHandler,
});
