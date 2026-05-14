/**
 * server/middleware/validateMiddleware.js
 * Engineering pattern: Input validation + sanitization at system boundary.
 * Validates required fields and strips dangerous characters.
 */

/** Strip HTML tags and trim whitespace */
function sanitize(val) {
  if (typeof val !== "string") return val;
  return val.replace(/<[^>]*>/g, "").trim();
}

/** Recursively sanitize all string leaves in an object */
function sanitizeBody(obj) {
  if (typeof obj === "string") return sanitize(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeBody);
  if (obj && typeof obj === "object") {
    const clean = {};
    for (const [k, v] of Object.entries(obj)) clean[k] = sanitizeBody(v);
    return clean;
  }
  return obj;
}

/**
 * Returns express middleware that:
 * 1. Checks all required fields are present and non-empty
 * 2. Sanitizes all string values in req.body
 */
export function validate(requiredFields = []) {
  return (req, res, next) => {
    req.body = sanitizeBody(req.body);

    const missing = requiredFields.filter((field) => {
      const val = req.body[field];
      return val === undefined || val === null || val === "";
    });

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    next();
  };
}

/** Standalone sanitiser middleware — sanitizes body without validation */
export function sanitizeRequest(req, _res, next) {
  req.body = sanitizeBody(req.body);
  next();
}
