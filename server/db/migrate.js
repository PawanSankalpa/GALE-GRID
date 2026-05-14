/**
 * server/db/migrate.js
 * Runs schema DDL and seeds initial data if tables are empty.
 * Called once at server start.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";
import { db } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  console.log("🗄️  Running DB migrations…");

  // ─── Apply schema DDL ──────────────────────────────────────
  const sql = readFileSync(join(__dirname, "schema.sql"), "utf8");
  await db.query(sql);
  console.log("✅ Schema applied");

  // ─── Seed only if users table is empty ────────────────────
  const { rowCount } = await db.query("SELECT 1 FROM users LIMIT 1");
  if (rowCount > 0) {
    console.log("✅ Seed data already present — skipping");
    return;
  }

  console.log("🌱 Seeding initial data…");
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    // Only seed users when explicit non-default passwords are provided.
    const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;
    const seedTeamPassword = process.env.SEED_TEAM_PASSWORD;
    const seedClientPassword = process.env.SEED_CLIENT_PASSWORD;

    const canSeedUsers = Boolean(
      seedAdminPassword && seedTeamPassword && seedClientPassword
    );

    let adminHash;
    let teamHash;
    let clientHash;

    if (canSeedUsers) {
      [adminHash, teamHash, clientHash] = await Promise.all([
        bcrypt.hash(seedAdminPassword, 10),
        bcrypt.hash(seedTeamPassword, 10),
        bcrypt.hash(seedClientPassword, 10),
      ]);
    }

    // ── Users ──────────────────────────────────────────────
    if (canSeedUsers) {
      await client.query(`
        INSERT INTO users (id, name, email, role, password_hash, title, department, created_at) VALUES
          ('u_admin_1', 'Pawan Admin',    'admin@galegrid.com', 'admin',  $1, 'Founder & Lead Designer', 'Management', '2025-01-15'),
          ('u_team_1',  'Tharani Team',   'team@galegrid.com',  'team',   $2, 'Developer',               'Engineering', '2025-03-10'),
          ('u_client_1','Lifecare Client','client@galegrid.com','client', $3, NULL, NULL, '2025-06-01')
        ON CONFLICT DO NOTHING
      `, [adminHash, teamHash, clientHash]);
    } else {
      console.warn("[MIGRATE] Skipping default user credential seed. Set SEED_*_PASSWORD env vars to seed users.");
    }

    // ── Plans ──────────────────────────────────────────────
    await client.query(`
      INSERT INTO plans (id, name, price_monthly, price_yearly, features) VALUES
        ('plan_starter','Starter',  49,   470,  $1),
        ('plan_growth', 'Growth',  149,  1430,  $2),
        ('plan_scale',  'Scale',   349,  3350,  $3)
      ON CONFLICT DO NOTHING
    `, [
      JSON.stringify(["1 active project","Email support","Monthly report"]),
      JSON.stringify(["3 active projects","Priority support","Weekly reports","Revision rounds (3/mo)"]),
      JSON.stringify(["Unlimited projects","Dedicated team","Daily standups","Unlimited revisions","24/7 support"]),
    ]);

    // ── Clients ────────────────────────────────────────────
    await client.query(`
      INSERT INTO clients (id, user_id, company, contact_name, contact_email, stage, assigned_team, notes, created_at, updated_at) VALUES
        ('cl_1','u_client_1','Lifecare Medical',     '',                  '',                  'active',      $1, 'Priority client — medical platform launch Q2 2026','2025-06-01','2026-04-14'),
        ('cl_2',NULL,        'FreshBite Restaurant', 'Amal Fernando',     'amal@freshbite.com','lead',        $2, 'Inquiry via website contact form',                  '2026-04-10','2026-04-10'),
        ('cl_3',NULL,        'SunMax Energy',        'Ravi Perera',       'ravi@sunmax.lk',    'onboarding',  $3, 'Signed contract — awaiting brand assets',           '2026-03-20','2026-04-13')
      ON CONFLICT DO NOTHING
    `, [
      JSON.stringify(["u_team_1"]),
      JSON.stringify([]),
      JSON.stringify(["u_team_1"]),
    ]);

    // ── Projects ───────────────────────────────────────────
    await client.query(`
      INSERT INTO projects (id, client_id, name, team_member_ids, status, priority, progress, deadline, timeline, next_step, created_at, updated_at) VALUES
        ('p_1001','cl_1','Lifecare Medical Platform',    $1,'In Progress','high',  72,'2026-05-30',$2,'Complete QA testing and client review','2025-09-01','2026-04-14'),
        ('p_1002','cl_3','SunMax Energy Site Revamp',    $3,'Planning',   'medium',28,'2026-08-15',$4,'Start wireframe and design phase',    '2026-03-20','2026-04-13')
      ON CONFLICT DO NOTHING
    `, [
      JSON.stringify(["u_team_1"]),
      JSON.stringify([
        { phase:"Discovery",    done:true,  completedAt:"2025-10-15" },
        { phase:"UI/UX Design", done:true,  completedAt:"2026-01-20" },
        { phase:"Development",  done:true,  completedAt:"2026-03-30" },
        { phase:"QA & Review",  done:false, completedAt:null },
        { phase:"Launch",       done:false, completedAt:null },
      ]),
      JSON.stringify(["u_team_1"]),
      JSON.stringify([
        { phase:"Discovery",    done:true,  completedAt:"2026-04-05" },
        { phase:"UI/UX Design", done:false, completedAt:null },
        { phase:"Development",  done:false, completedAt:null },
        { phase:"QA & Review",  done:false, completedAt:null },
        { phase:"Launch",       done:false, completedAt:null },
      ]),
    ]);

    // ── Tasks ──────────────────────────────────────────────
    await client.query(`
      INSERT INTO tasks (id, project_id, assignee_id, title, priority, status, due_date, created_at) VALUES
        ('t_1','p_1001','u_team_1','Finalize responsive nav behavior',         'high',  'in-progress','2026-04-17','2026-04-10'),
        ('t_2','p_1001','u_team_1','Integrate API endpoints for timeline',     'medium','completed',  '2026-04-11','2026-04-05'),
        ('t_3','p_1002','u_team_1','Build pricing card motion polish',         'low',   'todo',       '2026-04-21','2026-04-12'),
        ('t_4','p_1001','u_team_1','Cross-browser QA testing',                'high',  'todo',       '2026-04-20','2026-04-14')
      ON CONFLICT DO NOTHING
    `);

    // ── Subscription ───────────────────────────────────────
    await client.query(`
      INSERT INTO subscriptions (id, client_id, plan_id, billing, status, start_date, next_billing_date) VALUES
        ('sub_1','cl_1','plan_growth','monthly','active','2025-09-01','2026-05-01')
      ON CONFLICT DO NOTHING
    `);

    // ── Invoices ───────────────────────────────────────────
    await client.query(`
      INSERT INTO invoices (id, client_id, subscription_id, amount, status, issued_at, paid_at, due_date, description) VALUES
        ('inv_1001','cl_1','sub_1',149,'paid',   '2026-03-01','2026-03-02','2026-03-15','Growth Plan — March 2026'),
        ('inv_1002','cl_1','sub_1',149,'paid',   '2026-04-01','2026-04-03','2026-04-15','Growth Plan — April 2026'),
        ('inv_1003','cl_1','sub_1',149,'due',    '2026-05-01',NULL,        '2026-05-15','Growth Plan — May 2026')
      ON CONFLICT DO NOTHING
    `);

    // ── Messages ───────────────────────────────────────────
    await client.query(`
      INSERT INTO messages (id, project_id, sender_id, text, type, created_at) VALUES
        ('msg_1','p_1001','u_client_1','Can we get an update on the QA timeline?',          'message','2026-04-13T10:30:00Z'),
        ('msg_2','p_1001','u_admin_1', 'QA starts this week. You''ll be able to review by Friday.','message','2026-04-13T11:15:00Z'),
        ('msg_3','p_1001','u_client_1','Great — also need to discuss the mobile nav design.','message','2026-04-14T09:00:00Z')
      ON CONFLICT DO NOTHING
    `);

    // ── Mark msg_1 and msg_2 as read by admin ──────────────
    await client.query(`
      INSERT INTO message_reads (message_id, user_id) VALUES
        ('msg_1','u_admin_1'),('msg_2','u_admin_1'),
        ('msg_1','u_client_1'),('msg_2','u_client_1')
      ON CONFLICT DO NOTHING
    `);

    // ── Client Requests ────────────────────────────────────
    await client.query(`
      INSERT INTO client_requests (id, client_id, project_id, type, title, description, status, created_at) VALUES
        ('req_1','cl_1','p_1001','change',  'Update hero section copy', 'Please replace the hero headline with ''Your Health, Our Priority''','pending',  '2026-04-12'),
        ('req_2','cl_1','p_1001','approval','Approve homepage design v3','Final homepage design ready for client sign-off',                   'pending',  '2026-04-14')
      ON CONFLICT DO NOTHING
    `);

    // ── Activity Log ───────────────────────────────────────
    await client.query(`
      INSERT INTO activity_log (id, user_id, action, timestamp) VALUES
        ('act_1','u_team_1', 'completed task ''Integrate API endpoints''',       '2026-04-14T16:00:00Z'),
        ('act_2','u_admin_1','moved SunMax Energy to onboarding',                '2026-04-13T14:30:00Z'),
        ('act_3','u_client_1','submitted change request for Lifecare',           '2026-04-12T11:00:00Z'),
        ('act_4','u_admin_1','created project SunMax Energy Site Revamp',        '2026-04-13T10:00:00Z'),
        ('act_5','u_team_1', 'started task ''Finalize responsive nav''',         '2026-04-14T09:00:00Z')
      ON CONFLICT DO NOTHING
    `);

    await client.query("COMMIT");
    console.log("✅ Seed data inserted");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed — rolled back:", err.message);
    throw err;
  } finally {
    client.release();
  }
}
