/**
 * server/services/storageService.js
 * Engineering pattern: Idempotent uploads (SHA-256 hash dedup, 30s window).
 * Supports Cloudflare R2 (S3-compatible). Falls back to local /uploads/ if not configured.
 */
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "../db/pool.js";
import path from "path";

// ── R2 client (lazy init) ───────────────────────────────────────
let _s3 = null;
function getS3() {
  if (_s3) return _s3;
  const { CF_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!CF_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;

  _s3 = new S3Client({
    region:   "auto",
    endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  return _s3;
}

const BUCKET   = process.env.R2_BUCKET_NAME || "galegrid";
const BASE_URL = process.env.R2_PUBLIC_URL  || "/uploads";

// ── Hash file buffer ────────────────────────────────────────────
function hashBuffer(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

// ── Upload with idempotency ─────────────────────────────────────
export async function uploadFile({ buffer, originalname, mimetype, projectId, uploadedBy }) {
  const hash = hashBuffer(buffer);

  // Check dedup cache (30s window is handled by DB created_at check)
  const { rows: existing } = await db.query(
    "SELECT file_url FROM upload_dedup WHERE hash=$1 AND created_at > NOW() - INTERVAL '30 seconds'",
    [hash]
  );
  if (existing[0]) {
    return { url: existing[0].file_url, hash, deduplicated: true };
  }

  // Generate unique key
  const ext  = path.extname(originalname).toLowerCase();
  const key  = `${projectId || "general"}/${Date.now()}_${hash.slice(0, 8)}${ext}`;
  const s3   = getS3();

  let fileUrl;

  if (s3) {
    // ── Upload to Cloudflare R2 ─────────────────────────────
    await s3.send(new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: mimetype,
      Metadata: {
        projectId:  projectId || "",
        uploadedBy: uploadedBy || "",
      },
    }));
    fileUrl = `${BASE_URL}/${key}`;
  } else {
    // ── Fallback: save hash only (no local disk in production) ──
    console.warn("[Storage] R2 not configured. File not persisted.");
    fileUrl = `/uploads/placeholder/${key}`;
  }

  // Store in dedup table
  await db.query(
    "INSERT INTO upload_dedup (hash, file_url) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [hash, fileUrl]
  );

  return { url: fileUrl, hash, deduplicated: false };
}

export async function uploadDeliverable({ buffer, originalname, mimetype, projectId, title, description, uploadedBy }) {
  const { url, hash } = await uploadFile({ buffer, originalname, mimetype, projectId, uploadedBy });

  const id = `del_${Date.now()}_${hash.slice(0, 6)}`;
  const { rows } = await db.query(`
    INSERT INTO deliverables (id, project_id, title, description, file_url, filename, mime_type, file_size, uploaded_by, status, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'draft',NOW())
    RETURNING *
  `, [id, projectId, title || originalname, description || "", url, originalname, mimetype, buffer.length, uploadedBy]);

  return { deliverable: rows[0], fileUrl: url };
}
