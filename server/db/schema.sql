-- ═══════════════════════════════════════════════════════════
-- Gale Grid — PostgreSQL Schema (idempotent, Session 1)
-- Uses gen_random_uuid() — requires pgcrypto (available in Supabase)
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  role          TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin','team','client')),
  password_hash TEXT NOT NULL,
  title         TEXT,
  department    TEXT,
  status        TEXT DEFAULT 'offline' CHECK (status IN ('online','away','offline')),
  last_seen_at  TIMESTAMPTZ,
  created_at    DATE DEFAULT CURRENT_DATE
);

-- ─── CLIENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id            TEXT PRIMARY KEY,
  user_id       TEXT REFERENCES users(id) ON DELETE SET NULL,
  company       TEXT NOT NULL,
  contact_name  TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  stage         TEXT DEFAULT 'lead' CHECK (stage IN ('lead','onboarding','active','delivered','subscription')),
  assigned_team JSONB DEFAULT '[]',
  notes         TEXT DEFAULT '',
  created_at    DATE DEFAULT CURRENT_DATE,
  updated_at    DATE DEFAULT CURRENT_DATE
);

-- ─── PROJECTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id             TEXT PRIMARY KEY,
  client_id      TEXT REFERENCES clients(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  team_member_ids JSONB DEFAULT '[]',
  status         TEXT DEFAULT 'Planning',
  priority       TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  progress       INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline       DATE,
  timeline       JSONB DEFAULT '[]',
  next_step      TEXT DEFAULT '',
  created_at     DATE DEFAULT CURRENT_DATE,
  updated_at     DATE DEFAULT CURRENT_DATE
);

-- ─── TASKS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES projects(id) ON DELETE CASCADE,
  assignee_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  priority    TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  status      TEXT DEFAULT 'todo' CHECK (status IN ('todo','in-progress','review','completed')),
  due_date    DATE,
  created_at  DATE DEFAULT CURRENT_DATE
);

-- ─── PLANS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  price_yearly  INTEGER NOT NULL,
  features      JSONB DEFAULT '[]'
);

-- ─── SUBSCRIPTIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                TEXT PRIMARY KEY,
  client_id         TEXT REFERENCES clients(id) ON DELETE CASCADE,
  plan_id           TEXT REFERENCES plans(id),
  billing           TEXT DEFAULT 'monthly' CHECK (billing IN ('monthly','yearly')),
  status            TEXT DEFAULT 'active' CHECK (status IN ('active','past_due','cancelled','paused')),
  start_date        DATE,
  next_billing_date DATE,
  cancelled_at      DATE
);

-- ─── INVOICES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id              TEXT PRIMARY KEY,
  client_id       TEXT REFERENCES clients(id) ON DELETE CASCADE,
  subscription_id TEXT REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount          INTEGER NOT NULL,
  status          TEXT DEFAULT 'due' CHECK (status IN ('paid','due','overdue')),
  issued_at       DATE,
  paid_at         DATE,
  due_date        DATE,
  description     TEXT DEFAULT ''
);

-- ─── MESSAGES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES projects(id) ON DELETE CASCADE,
  sender_id   TEXT REFERENCES users(id) ON DELETE SET NULL,
  text        TEXT NOT NULL,
  type        TEXT DEFAULT 'message' CHECK (type IN ('message','note','system')),
  attachments JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  edited_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_messages_project ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

-- ─── MESSAGE READS (per-user read tracking) ───────────────
CREATE TABLE IF NOT EXISTS message_reads (
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  user_id    TEXT REFERENCES users(id) ON DELETE CASCADE,
  read_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);

-- ─── CLIENT REQUESTS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_requests (
  id          TEXT PRIMARY KEY,
  client_id   TEXT REFERENCES clients(id) ON DELETE CASCADE,
  project_id  TEXT REFERENCES projects(id) ON DELETE CASCADE,
  type        TEXT DEFAULT 'change' CHECK (type IN ('change','upload','approval','bug','feature')),
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','in-progress','completed','rejected')),
  created_at  DATE DEFAULT CURRENT_DATE,
  resolved_at DATE
);

-- ─── NOTIFICATIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         TEXT PRIMARY KEY DEFAULT 'notif_' || gen_random_uuid()::text,
  user_id    TEXT REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT DEFAULT 'system' CHECK (type IN ('message','request','approval','deliverable','payment','system')),
  title      TEXT NOT NULL,
  body       TEXT DEFAULT '',
  link       TEXT DEFAULT '/admin',
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

-- ─── DELIVERABLES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deliverables (
  id             TEXT PRIMARY KEY DEFAULT 'del_' || gen_random_uuid()::text,
  project_id     TEXT REFERENCES projects(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT DEFAULT '',
  file_url       TEXT,
  filename       TEXT,
  mime_type      TEXT,
  file_size      INTEGER,
  uploaded_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
  status         TEXT DEFAULT 'draft' CHECK (status IN ('draft','review','approved','revision_needed')),
  review_comment TEXT DEFAULT '',
  reviewed_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FILE ATTACHMENTS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS file_attachments (
  id          TEXT PRIMARY KEY DEFAULT 'att_' || gen_random_uuid()::text,
  message_id  TEXT REFERENCES messages(id) ON DELETE CASCADE,
  filename    TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  mime_type   TEXT,
  file_size   INTEGER,
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ACTIVITY LOG ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id        TEXT PRIMARY KEY,
  user_id   TEXT REFERENCES users(id) ON DELETE SET NULL,
  action    TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_ts ON activity_log(timestamp DESC);

-- ─── BOOKINGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT DEFAULT '',
  company       TEXT DEFAULT '',
  website       TEXT DEFAULT '',
  budget        TEXT DEFAULT '',
  service       TEXT DEFAULT '',
  hear_about    TEXT DEFAULT '',
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','no_show')),
  cal_event_uid TEXT,
  scheduled_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── UPLOAD DEDUP CACHE (idempotency for file uploads) ────
CREATE TABLE IF NOT EXISTS upload_dedup (
  hash       TEXT PRIMARY KEY,
  file_url   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
