import { db } from "../db/pool.js";
import { cache, cacheKey, CACHE_TTL } from "../utils/cache.js";

export async function getOverviewForRole(user) {
  let projRows, taskRows;

  if (user.role === "client") {
    const { rows: cl } = await db.query("SELECT id FROM clients WHERE user_id=$1", [user.id]);
    const clientId = cl[0]?.id;
    if (!clientId) return { stats:{}, recentActivity:[], projects:[], lifecycle:{} };
    const pr = await db.query("SELECT * FROM projects WHERE client_id=$1", [clientId]);
    projRows = pr.rows; taskRows = [];
  } else if (user.role === "team") {
    const [pr, tr] = await Promise.all([
      db.query("SELECT * FROM projects WHERE team_member_ids @> $1::jsonb", [JSON.stringify([user.id])]),
      db.query("SELECT * FROM tasks WHERE assignee_id=$1", [user.id]),
    ]);
    projRows = pr.rows; taskRows = tr.rows;
  } else {
    const [pr, tr] = await Promise.all([db.query("SELECT * FROM projects"), db.query("SELECT * FROM tasks")]);
    projRows = pr.rows; taskRows = tr.rows;
  }

  const [actRes, teamCount, clientCount, subCount] = await Promise.all([
    db.query("SELECT al.*, u.name AS user_name FROM activity_log al LEFT JOIN users u ON u.id=al.user_id ORDER BY al.timestamp DESC LIMIT 5"),
    db.query("SELECT COUNT(*) FROM users WHERE role='team'"),
    db.query("SELECT COUNT(*) FROM clients"),
    db.query("SELECT COUNT(*) FROM subscriptions WHERE status='active'"),
  ]);

  const lcRes = await db.query("SELECT stage, COUNT(*) AS c FROM clients GROUP BY stage");
  const lc = { lead:0, onboarding:0, active:0, delivered:0, subscription:0 };
  lcRes.rows.forEach(r => { lc[r.stage] = Number(r.c); });

  return {
    stats: {
      totalProjects: projRows.length,
      teamMembers:   Number(teamCount.rows[0].count),
      activeTasks:   taskRows.filter(t => t.status !== "completed").length,
      pendingReviews: taskRows.filter(t => t.status === "review").length,
      totalClients:  Number(clientCount.rows[0].count),
      activeSubscriptions: Number(subCount.rows[0].count),
    },
    recentActivity: actRes.rows.map(a => ({ user: a.user_name||a.user_id, action:a.action, time:a.timestamp })),
    projects: projRows.map(p => ({ id:p.id, name:p.name, status:p.status, progress:p.progress, nextStep:p.next_step })),
    lifecycle: lc,
  };
}

export async function getAdminData() {
  const [usersRes, clientsRes, projRes, statsRes, actRes, bookRes] = await Promise.all([
    db.query("SELECT id,name,email,role,title,department,status,created_at FROM users ORDER BY created_at"),
    db.query("SELECT c.id,c.company,c.stage, COALESCE(c.contact_name,u.name,\'—\') AS contact_name, COUNT(p.id) AS project_count FROM clients c LEFT JOIN users u ON u.id=c.user_id LEFT JOIN projects p ON p.client_id=c.id GROUP BY c.id,u.name ORDER BY c.created_at DESC"),
    db.query("SELECT p.id,p.name,p.status,p.priority,p.progress,p.deadline,c.company AS client_name FROM projects p LEFT JOIN clients c ON c.id=p.client_id ORDER BY p.created_at DESC"),
    db.query("SELECT (SELECT COUNT(*) FROM users) AS total_users,(SELECT COUNT(*) FROM clients) AS total_clients,(SELECT COUNT(*) FROM projects) AS total_projects,(SELECT COUNT(*) FROM users WHERE role=\'team\') AS team_members,(SELECT COALESCE(SUM(amount),0) FROM invoices WHERE status=\'paid\') AS revenue,(SELECT COALESCE(SUM(amount),0) FROM invoices WHERE status IN(\'due\',\'overdue\')) AS outstanding,(SELECT COUNT(*) FROM subscriptions WHERE status=\'active\') AS active_subs,(SELECT COUNT(*) FROM client_requests WHERE status=\'pending\') AS pending_reqs,(SELECT COUNT(*) FROM tasks WHERE status!=\'completed\') AS active_tasks"),
    db.query("SELECT al.*,u.name AS user_name FROM activity_log al LEFT JOIN users u ON u.id=al.user_id ORDER BY al.timestamp DESC LIMIT 8"),
    db.query("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 4"),
  ]);

  const s = statsRes.rows[0];

  const { rows: unreadRows } = await db.query("SELECT COUNT(*) FROM messages m WHERE NOT EXISTS (SELECT 1 FROM message_reads mr JOIN users u ON u.id=mr.user_id WHERE mr.message_id=m.id AND u.role=\'admin\')");
  const lcRes = await db.query("SELECT stage, COUNT(*) AS c FROM clients GROUP BY stage");
  const lc = { lead:0, onboarding:0, active:0, delivered:0, subscription:0 };
  lcRes.rows.forEach(r => { lc[r.stage] = Number(r.c); });

  // ── Enrichment queries (graceful degradation) ────────────────────────────
  const [teamLoadRes, deadlinesRes, momRes, ytdRes, paymentsRes, chartRes] = await Promise.allSettled([
    db.query(`SELECT u.id, u.name, COUNT(t.id)::int AS total_tasks, COUNT(CASE WHEN t.status != 'completed' THEN 1 END)::int AS active_tasks, COUNT(CASE WHEN t.due_date < NOW() AND t.status != 'completed' THEN 1 END)::int AS overdue_count FROM users u LEFT JOIN tasks t ON t.assignee_id = u.id WHERE u.role = 'team' GROUP BY u.id, u.name ORDER BY active_tasks DESC`),
    db.query(`SELECT p.id, p.name AS project_name, COALESCE(c.company, 'Unknown') AS client_name, p.deadline, (p.deadline::date - CURRENT_DATE) AS days_left FROM projects p LEFT JOIN clients c ON c.id = p.client_id WHERE p.deadline IS NOT NULL AND p.deadline::date > CURRENT_DATE AND p.deadline::date <= CURRENT_DATE + INTERVAL '14 days' ORDER BY p.deadline ASC LIMIT 5`),
    db.query(`SELECT COALESCE(SUM(CASE WHEN DATE_TRUNC('month', paid_at) = DATE_TRUNC('month', NOW()) THEN amount ELSE 0 END), 0) AS this_month, COALESCE(SUM(CASE WHEN DATE_TRUNC('month', paid_at) = DATE_TRUNC('month', NOW() - INTERVAL '1 month') THEN amount ELSE 0 END), 0) AS last_month FROM invoices WHERE status = 'paid'`),
    db.query(`SELECT COALESCE(SUM(amount), 0) AS ytd FROM invoices WHERE status = 'paid' AND EXTRACT(YEAR FROM paid_at) = EXTRACT(YEAR FROM NOW())`),
    db.query(`SELECT i.id, i.amount, i.paid_at, COALESCE(c.company, 'Unknown') AS client_name FROM invoices i LEFT JOIN clients c ON c.id = i.client_id WHERE i.status = 'paid' ORDER BY i.paid_at DESC LIMIT 5`),
    db.query(`SELECT TO_CHAR(DATE_TRUNC('month', paid_at), 'Mon') AS month, EXTRACT(MONTH FROM paid_at)::int AS month_num, EXTRACT(YEAR FROM paid_at)::int AS year_num, COALESCE(SUM(amount), 0) AS amount FROM invoices WHERE status = 'paid' AND paid_at >= DATE_TRUNC('month', NOW()) - INTERVAL '11 months' GROUP BY DATE_TRUNC('month', paid_at), month, month_num, year_num ORDER BY year_num ASC, month_num ASC`),
  ]);

  // Team load
  const teamLoad = teamLoadRes.status === "fulfilled"
    ? teamLoadRes.value.rows.map(r => ({
        id: r.id, name: r.name,
        totalTasks: Number(r.total_tasks),
        activeTasks: Number(r.active_tasks),
        overdueCount: Number(r.overdue_count),
        loadPct: Number(r.total_tasks) > 0 ? Math.min(100, Math.round((Number(r.active_tasks) / Number(r.total_tasks)) * 100)) : 0,
      }))
    : [];

  // Upcoming deadlines
  const upcomingDeadlines = deadlinesRes.status === "fulfilled"
    ? deadlinesRes.value.rows.map(r => ({
        id: r.id, projectName: r.project_name, clientName: r.client_name,
        deadline: r.deadline, daysLeft: Number(r.days_left),
      }))
    : [];

  // Month-on-month revenue %
  let momRevenue = 0;
  if (momRes.status === "fulfilled") {
    const thisM = Number(momRes.value.rows[0]?.this_month || 0);
    const lastM = Number(momRes.value.rows[0]?.last_month || 0);
    momRevenue = lastM > 0 ? Math.round(((thisM - lastM) / lastM) * 100) : 0;
  }

  // Year-to-date revenue
  const ytdRevenue = ytdRes.status === "fulfilled"
    ? Number(ytdRes.value.rows[0]?.ytd || 0)
    : 0;

  // Recent payments
  const recentPayments = paymentsRes.status === "fulfilled"
    ? paymentsRes.value.rows
    : [];

  // Compute overdue count from team load
  const overdueCount = teamLoad.reduce((sum, m) => sum + m.overdueCount, 0);

  // 12-month revenue chart
  let revenueChart;
  if (chartRes.status === "fulfilled" && chartRes.value.rows) {
    const rows = chartRes.value.rows;
    revenueChart = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const mNum = d.getMonth() + 1;
      const yNum = d.getFullYear();
      const label = d.toLocaleDateString("en-US", { month: "short" });
      const found = rows.find(r => Number(r.month_num) === mNum && Number(r.year_num) === yNum);
      revenueChart.push({ month: label, amount: found ? Number(found.amount) : 0 });
    }
  } else {
    revenueChart = [
      { month: "Jan", amount: 0 }, { month: "Feb", amount: 0 },
      { month: "Mar", amount: 0 }, { month: "Apr", amount: 0 },
      { month: "May", amount: 0 }, { month: "Jun", amount: 0 },
    ];
  }

  return {
    users: usersRes.rows,
    clients: clientsRes.rows.map(r => ({ id:r.id, company:r.company, contactName:r.contact_name, stage:r.stage, projectCount:Number(r.project_count) })),
    projects: projRes.rows,
    stats: {
      totalUsers: Number(s.total_users), totalClients: Number(s.total_clients),
      totalProjects: Number(s.total_projects), teamMembers: Number(s.team_members),
      revenue: "$" + Number(s.revenue).toLocaleString(), revenueRaw: Number(s.revenue),
      outstanding: "$" + Number(s.outstanding).toLocaleString(), outstandingRaw: Number(s.outstanding),
      activeSubscriptions: Number(s.active_subs), pendingRequests: Number(s.pending_reqs),
      unreadMessages: Number(unreadRows[0].count), activeTasks: Number(s.active_tasks),
      overdueCount,
    },
    lifecycle: lc,
    recentActivity: actRes.rows.map(a => ({ user:a.user_name||a.user_id, action:a.action, time:a.timestamp })),
    recentBookings: bookRes.rows,
    revenueChart,
    teamLoad,
    upcomingDeadlines,
    momRevenue,
    ytdRevenue,
    totalPipelineValue: 0,
    recentPayments,
    alertItems: [],
  };
}

export async function getTeamData(user) {
  const [taskRes, projRes] = await Promise.all([
    db.query("SELECT t.*,p.name AS project_name FROM tasks t LEFT JOIN projects p ON p.id=t.project_id WHERE t.assignee_id=$1 ORDER BY t.due_date ASC", [user.id]),
    db.query("SELECT p.id,p.name,p.status,p.progress,p.deadline,p.next_step FROM projects p WHERE p.team_member_ids @> $1::jsonb ORDER BY p.deadline ASC", [JSON.stringify([user.id])]),
  ]);

  const tasks = taskRes.rows.map(t => ({
    id:t.id, title:t.title, projectName:t.project_name||"—",
    priority: t.priority.charAt(0).toUpperCase()+t.priority.slice(1),
    status:t.status, dueDate:t.due_date,
  }));

  return {
    tasks,
    projects: projRes.rows.map(p => ({ id:p.id, name:p.name, status:p.status, progress:p.progress, deadline:p.deadline, nextStep:p.next_step })),
    stats: { totalTasks:tasks.length, completed:tasks.filter(t=>t.status==="completed").length, inProgress:tasks.filter(t=>t.status==="in-progress").length, todo:tasks.filter(t=>t.status==="todo").length },
  };
}

export async function getClientData(user) {
  const ck = cacheKey.dashboard(user.id);
  const cached = cache.get(ck);
  if (cached) return cached;

  const { rows: cl } = await db.query("SELECT id FROM clients WHERE user_id=$1", [user.id]);
  const client = cl[0];
  if (!client) return { projects:[], stats:{}, payments:null, requests:[], stage:null, startDate:null, teamMembers:[] };

  const clientId = client.id;
  const [projRes, subRes, invRes, reqRes, teamRes, ciRes] = await Promise.all([
    db.query("SELECT * FROM projects WHERE client_id=$1 ORDER BY created_at", [clientId]),
    db.query("SELECT s.*,pl.name AS plan_name,pl.features AS plan_features, CASE WHEN s.billing='yearly' THEN pl.price_yearly ELSE pl.price_monthly END AS plan_price FROM subscriptions s JOIN plans pl ON pl.id=s.plan_id WHERE s.client_id=$1 LIMIT 1", [clientId]),
    db.query("SELECT * FROM invoices WHERE client_id=$1 ORDER BY issued_at DESC", [clientId]),
    db.query("SELECT * FROM client_requests WHERE client_id=$1 ORDER BY created_at DESC", [clientId]),
    db.query("SELECT u.id,u.name,u.role FROM clients c JOIN users u ON u.id=ANY(ARRAY(SELECT jsonb_array_elements_text(c.assigned_team))) WHERE c.id=$1", [clientId]),
    db.query("SELECT stage,created_at FROM clients WHERE id=$1", [clientId]),
  ]);

  const { rows: unreadRows } = await db.query("SELECT COUNT(*) FROM messages m JOIN projects p ON p.id=m.project_id WHERE p.client_id=$1 AND m.sender_id!=$2 AND NOT EXISTS(SELECT 1 FROM message_reads mr WHERE mr.message_id=m.id AND mr.user_id=$2)", [clientId, user.id]);

  const projects = projRes.rows.map(p => ({
    id:p.id, name:p.name, status:p.status, progress:p.progress,
    nextStep:p.next_step, deadline:p.deadline,
    timeline: (p.timeline||[]).map(ph => ({ name:ph.phase, completed:ph.done, completedAt:ph.completedAt })),
  }));

  const sub = subRes.rows[0];
  const ci = ciRes.rows[0];

  const result = {
    projects,
    stats: {
      totalProjects: projects.length,
      completedMilestones: projects.reduce((s,p) => s+(p.timeline?.filter(t=>t.completed).length||0), 0),
      activeProjects: projects.filter(p => p.status==="In Progress").length,
      unreadMessages: Number(unreadRows[0].count),
      pendingRequests: reqRes.rows.filter(r=>r.status==="pending").length,
    },
    payments: sub ? { planName:sub.plan_name, planPrice:sub.plan_price, billing:sub.billing, status:sub.status, nextBillingDate:sub.next_billing_date, features:sub.plan_features||[] } : null,
    invoices: invRes.rows.map(i => ({ id:i.id, amount:i.amount, status:i.status, issuedAt:i.issued_at, paidAt:i.paid_at, dueDate:i.due_date, description:i.description })),
    requests: reqRes.rows,
    stage: ci?.stage,
    startDate: ci?.created_at,
    teamMembers: teamRes.rows,
  };

  cache.set(ck, result, CACHE_TTL.DASHBOARD);
  return result;
}
