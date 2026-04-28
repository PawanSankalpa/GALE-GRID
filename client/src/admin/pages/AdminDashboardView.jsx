/**
 * client/src/admin/pages/AdminDashboardView.jsx
 * Premium owner / admin command center for Gale Grid.
 * Fully self-contained — no shared imports from DashboardHome.
 */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../services/apiClient.js";
import {
  AlertTriangle, BarChart3, Briefcase, CheckCircle, ChevronRight,
  Clock, DollarSign, MessageSquare, Target, TrendingDown,
  Users,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
function relativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function greeting(name) {
  const h = new Date().getHours();
  const tod = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${tod}, ${(name || "there").split(" ")[0]}`;
}

function formatDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function fmt$(n) {
  if (n == null) return "$0";
  const num = Number(n);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1000)      return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

// ── useCountUp ───────────────────────────────────────────────────
function useCountUp(target, duration = 700) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (target == null || isNaN(Number(target))) { setVal(target); return; }
    const to = Number(target);
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return val;
}

// ── OwnerBriefBar ────────────────────────────────────────────────
function OwnerBriefBar({ displayName, momRevenue = 0, alertCount = 0, deadlineCount = 0 }) {
  return (
    <div className="gg-brief-bar">
      <div className="gg-brief-left">
        <p className="gg-brief-greeting">{greeting(displayName)}</p>
        <p className="gg-brief-date">{formatDate()}</p>
      </div>
      <div className="gg-brief-chips">
        {momRevenue !== 0 && (
          <span className={`gg-brief-chip gg-brief-chip--${momRevenue >= 0 ? "ok" : "warn"}`}>
            {momRevenue >= 0 ? "↑" : "↓"} {Math.abs(momRevenue)}% vs last month
          </span>
        )}
        {alertCount > 0 && (
          <span className="gg-brief-chip gg-brief-chip--alert">
            {alertCount} item{alertCount !== 1 ? "s" : ""} need attention
          </span>
        )}
        {deadlineCount > 0 && (
          <span className="gg-brief-chip gg-brief-chip--warn">
            {deadlineCount} deadline{deadlineCount !== 1 ? "s" : ""} this week
          </span>
        )}
        {alertCount === 0 && deadlineCount === 0 && (
          <span className="gg-brief-chip gg-brief-chip--ok">All clear today</span>
        )}
      </div>
      <div className="gg-brief-art" aria-hidden="true">
        <BarChart3 size={68} strokeWidth={0.7} />
      </div>
    </div>
  );
}

// ── AdminKpiCard ─────────────────────────────────────────────────
function AdminKpiCard({ label, value, prefix = "", suffix = "", sub, accent = "accent", icon, momPct, to }) {
  const navigate = useNavigate();
  const numeric = typeof value === "number" ? value : null;
  const counted = useCountUp(numeric);
  const display = numeric !== null ? `${prefix}${counted.toLocaleString()}${suffix}` : value;

  return (
    <div
      className={`gg-kpi-card gg-kpi-card--${accent}${to ? " gg-kpi-card--clickable" : ""}`}
      onClick={to ? () => navigate(to) : undefined}
      role={to ? "button" : undefined}
      tabIndex={to ? 0 : undefined}
      onKeyDown={to ? (e) => e.key === "Enter" && navigate(to) : undefined}
    >
      <div className="gg-kpi-top">
        <span className={`gg-kpi-icon gg-kpi-icon--${accent}`}>{icon}</span>
        {momPct != null && momPct !== 0 && (
          <span className={`gg-kpi-mom gg-kpi-mom--${momPct >= 0 ? "up" : "down"}`}>
            {momPct >= 0 ? "↑" : "↓"}{Math.abs(momPct)}%
          </span>
        )}
      </div>
      <p className="gg-kpi-value">{display}</p>
      <p className="gg-kpi-label">{label}</p>
      {sub && <p className="gg-kpi-sub">{sub}</p>}
    </div>
  );
}

// ── AdminRevenueChart ────────────────────────────────────────────
function AdminRevenueChart({ bars = [], ytdRevenue = 0 }) {
  const max = Math.max(...bars.map((b) => b.amount), 1);
  return (
    <>
      <div className="gg-rev-header">
        <div>
          <p className="gg-rev-total">{fmt$(ytdRevenue)}</p>
          <p className="gg-rev-ytd-label">Year to date</p>
        </div>
      </div>
      <div className="gg-rev-chart">
        {bars.map((b) => {
          const pct = Math.max(Math.round((b.amount / max) * 100), b.amount > 0 ? 6 : 0);
          return (
            <div key={b.month} className="gg-rev-bar-wrap">
              <span className="gg-rev-bar-value">{b.amount > 0 ? fmt$(b.amount) : ""}</span>
              <div
                className={`gg-rev-bar${b.amount === 0 ? " gg-rev-bar--empty" : ""}`}
                style={{ height: `${pct}%` }}
              />
              <span className="gg-rev-bar-label">{b.month}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── AlertCenter ──────────────────────────────────────────────────
function AlertCenter({ items = [], navigate }) {
  if (!items.length) {
    return (
      <div className="gg-alert-empty">
        <CheckCircle size={17} />
        <span>All clear — no urgent items</span>
      </div>
    );
  }
  return (
    <div className="gg-alert-center">
      {items.map((item, i) => (
        <button
          key={i}
          className={`gg-alert-item gg-alert-item--${item.severity}`}
          onClick={() => item.to && navigate(item.to)}
        >
          <span className="gg-alert-icon">
            {item.severity === "red"   ? <AlertTriangle size={13} /> :
             item.severity === "amber" ? <Clock size={13} /> :
             <MessageSquare size={13} />}
          </span>
          <span className="gg-alert-label">{item.message}</span>
          <ChevronRight size={12} style={{ marginLeft: "auto", flexShrink: 0, opacity: 0.5 }} />
        </button>
      ))}
    </div>
  );
}

// ── ProjectHealthBoard ───────────────────────────────────────────
function ProjectHealthBoard({ projects = [] }) {
  if (!projects.length) {
    return <p className="gg-muted" style={{ paddingTop: 8 }}>No active projects.</p>;
  }
  return (
    <div className="gg-health-board">
      {projects.map((p) => {
        const days = p.deadline
          ? Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000)
          : null;
        const dot = !days || days < 0 ? "red" : days <= 14 ? "red" : days <= 30 ? "amber" : "green";
        return (
          <div key={p.id} className="gg-health-row">
            <span className={`gg-health-dot gg-health-dot--${dot}`} title={dot === "red" ? "At risk" : dot === "amber" ? "Watch" : "On track"} />
            <span className="gg-health-name">{p.name}</span>
            <div className="gg-health-bar-track" title={`${p.progress ?? 0}% complete`}>
              <div className="gg-health-bar-fill" style={{ width: `${p.progress ?? 0}%` }} />
            </div>
            <span className="gg-health-days">
              {days == null ? "–" : days < 0 ? "Overdue" : `${days}d`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── ClientPipelineFunnel ─────────────────────────────────────────
function ClientPipelineFunnel({ lifecycle = {}, totalValue = 0 }) {
  const stages = [
    { key: "lead",         label: "Leads" },
    { key: "onboarding",   label: "Onboarding" },
    { key: "active",       label: "Active" },
    { key: "delivered",    label: "Delivered" },
    { key: "subscription", label: "Retainer" },
  ];
  const maxCount = Math.max(...stages.map((s) => lifecycle[s.key] ?? 0), 1);
  return (
    <div className="gg-funnel-list">
      {stages.map((s) => {
        const count = lifecycle[s.key] ?? 0;
        const width = count > 0 ? Math.max(Math.round((count / maxCount) * 100), 10) : 0;
        return (
          <div key={s.key} className="gg-funnel-stage">
            <span className="gg-funnel-label">{s.label}</span>
            <div className="gg-funnel-track">
              <div className="gg-funnel-fill" style={{ width: `${width}%` }} />
            </div>
            <span className="gg-funnel-count">{count}</span>
          </div>
        );
      })}
      {totalValue > 0 && (
        <p className="gg-funnel-total">Pipeline value: {fmt$(totalValue)}</p>
      )}
    </div>
  );
}

// ── TeamLoadWidget ───────────────────────────────────────────────
function TeamLoadWidget({ team = [], teamMembersCount = 0 }) {
  if (!team.length) {
    return (
      <p className="gg-muted" style={{ paddingTop: 8 }}>
        {teamMembersCount > 0 ? "Task data loading…" : "No team members found."}
      </p>
    );
  }
  return (
    <div className="gg-load-list">
      {team.map((m) => {
        const pct = m.loadPct ?? 0;
        const fillCls = pct > 80 ? "over" : pct > 60 ? "warn" : "ok";
        return (
          <div key={m.id} className="gg-load-row">
            <span className="gg-load-avatar">{initials(m.name)}</span>
            <span className="gg-load-name" title={m.name}>{m.name.split(" ")[0]}</span>
            <div className="gg-load-bar-track" title={`${m.activeTasks} active / ${m.totalTasks} total tasks`}>
              <div className={`gg-load-bar-fill gg-load-fill--${fillCls}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <span className="gg-load-pct">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ── PaymentsTimeline ─────────────────────────────────────────────
function PaymentsTimeline({ payments = [] }) {
  if (!payments.length) {
    return <p className="gg-muted" style={{ paddingTop: 8 }}>No recent payments.</p>;
  }
  return (
    <div className="gg-pay-timeline">
      {payments.map((p, i) => (
        <div key={p.id || i} className="gg-pay-tl-item">
          <div className="gg-pay-tl-left">
            <div className="gg-pay-tl-dot" />
            {i < payments.length - 1 && <div className="gg-pay-tl-line" />}
          </div>
          <div className="gg-pay-tl-body">
            <span className="gg-pay-tl-client">{p.clientName || p.client_name || "Client"}</span>
            <span className="gg-pay-tl-amount">{fmt$(p.amount)}</span>
            <span className="gg-pay-tl-time">{relativeTime(p.paidAt || p.paid_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── DeadlinesWidget ──────────────────────────────────────────────
function DeadlinesWidget({ deadlines = [] }) {
  if (!deadlines.length) {
    return <p className="gg-muted" style={{ paddingTop: 8 }}>No deadlines in the next 14 days.</p>;
  }
  return (
    <div className="gg-dl-list">
      {deadlines.map((d, i) => {
        const days = d.daysLeft ?? Math.ceil((new Date(d.deadline).getTime() - Date.now()) / 86400000);
        const chipCls = days <= 3 ? "urgent" : days <= 14 ? "warn" : "ok";
        return (
          <div key={d.id || i} className="gg-dl-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="gg-dl-name">{d.projectName || d.name}</p>
              {d.clientName && (
                <p style={{ margin: 0, fontSize: "0.73rem", color: "var(--gg-text-muted)", marginTop: 1 }}>{d.clientName}</p>
              )}
            </div>
            <span className={`gg-dl-chip gg-dl-chip--${chipCls}`}>
              {days <= 0 ? "Overdue" : `${days}d`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── AdminActivityFeed ────────────────────────────────────────────
function AdminActivityFeed({ activity = [] }) {
  if (!activity.length) {
    return <p className="gg-muted" style={{ padding: "12px 0" }}>No activity yet.</p>;
  }
  return (
    <div className="gg-activity-list">
      {activity.map((item, i) => (
        <div key={i} className="gg-activity-item">
          <div className="gg-activity-avatar">{initials(item.user || "?")}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="gg-activity-text">
              <strong>{(item.user || "Unknown").split(" ")[0]}</strong> {item.action}
            </p>
            <p className="gg-activity-time">{relativeTime(item.time)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── AdminDashboardView ───────────────────────────────────────────
export default function AdminDashboardView({ user }) {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    Promise.allSettled([
      apiClient.get("/api/dashboard/admin"),
      apiClient.get("/api/comms/activity"),
    ]).then(([dashResult, actResult]) => {
      if (dashResult.status === "fulfilled") {
        setData(dashResult.value.data);
      } else {
        setError("Failed to load dashboard data.");
      }
      if (actResult.status === "fulfilled") {
        setActivity(actResult.value.data.activity || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="gg-dash-loading">
        <div className="gg-dash-spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="gg-dash-error">
        <span className="gg-dash-error-icon">⚠</span>
        <p>{error || "Dashboard data unavailable."}</p>
      </div>
    );
  }

  const {
    stats = {}, lifecycle = {}, projects = [], recentActivity = [],
    revenueChart = [], teamLoad = [], upcomingDeadlines = [],
    momRevenue = 0, ytdRevenue = 0, totalPipelineValue = 0, recentPayments = [],
  } = data;

  const displayName = user?.name || "there";

  // Build actionable alert list from stats
  const alertList = [
    ...(stats.overdueCount > 0   ? [{ severity: "red",   message: `${stats.overdueCount} overdue task${stats.overdueCount   !== 1 ? "s" : ""}`,   to: "/admin/tasks" }] : []),
    ...(stats.unreadMessages > 0 ? [{ severity: "red",   message: `${stats.unreadMessages} unread message${stats.unreadMessages !== 1 ? "s" : ""}`, to: "/admin/inbox" }] : []),
    ...(stats.pendingRequests > 0 ? [{ severity: "amber", message: `${stats.pendingRequests} pending request${stats.pendingRequests !== 1 ? "s" : ""}`, to: "/admin/tasks" }] : []),
    ...(stats.outstandingRaw > 0  ? [{ severity: "amber", message: `${fmt$(stats.outstandingRaw)} outstanding — follow up`, to: "/admin/payments" }] : []),
  ];

  const weekDeadlines = upcomingDeadlines.filter((d) => {
    const days = d.daysLeft ?? Math.ceil((new Date(d.deadline).getTime() - Date.now()) / 86400000);
    return days <= 7;
  }).length;

  const activityFeedData = activity.length > 0 ? activity : recentActivity;

  const kpiCards = [
    {
      label: "Revenue MTD",
      value: stats.revenueRaw ?? 0,
      prefix: "$",
      sub: `YTD: ${fmt$(ytdRevenue)}`,
      accent: "success",
      icon: <DollarSign size={15} />,
      momPct: momRevenue,
    },
    {
      label: "Outstanding",
      value: stats.outstandingRaw ?? 0,
      prefix: "$",
      sub: "Awaiting payment",
      accent: stats.outstandingRaw > 0 ? "warn" : "neutral",
      icon: stats.outstandingRaw > 0 ? <TrendingDown size={15} /> : <CheckCircle size={15} />,
    },
    {
      label: "Active Clients",
      value: stats.totalClients ?? 0,
      sub: `${lifecycle.lead ?? 0} in lead stage`,
      accent: "accent",
      icon: <Users size={15} />,
      to: "/admin/clients",
    },
    {
      label: "Active Projects",
      value: stats.totalProjects ?? 0,
      sub: `${stats.activeTasks ?? 0} open tasks`,
      accent: "blue",
      icon: <Briefcase size={15} />,
      to: "/admin/projects",
    },
    {
      label: "Pipeline",
      value: lifecycle.lead ?? 0,
      suffix: " leads",
      sub: totalPipelineValue > 0 ? `${fmt$(totalPipelineValue)} value` : "in lead stage",
      accent: "purple",
      icon: <Target size={15} />,
      to: "/admin/leads",
    },
  ];

  return (
    <>
      {/* ── Brief Bar ───────────────────────────────────────────── */}
      <OwnerBriefBar
        displayName={displayName}
        momRevenue={momRevenue}
        alertCount={alertList.length}
        deadlineCount={weekDeadlines}
      />

      {/* ── KPI Row ─────────────────────────────────────────────── */}
      <div className="gg-kpi-row">
        {kpiCards.map((k) => <AdminKpiCard key={k.label} {...k} />)}
      </div>

      {/* ── Revenue trend + Alert center ────────────────────────── */}
      <div className="gg-dash-grid">
        <div className="gg-dash-col">
          <div className="gg-card">
            <div className="gg-card-header">
              <h3 className="gg-card-title">Revenue Overview</h3>
              <p className="gg-card-subtitle">Monthly collected · {new Date().getFullYear()}</p>
            </div>
            <div className="gg-card-body">
              <AdminRevenueChart bars={revenueChart} ytdRevenue={ytdRevenue} />
            </div>
          </div>
        </div>

        <div className="gg-dash-col">
          <div className="gg-card">
            <div className="gg-card-header">
              <h3 className="gg-card-title">
                {alertList.length > 0 ? (
                  <>{alertList.length} item{alertList.length !== 1 ? "s" : ""} need attention</>
                ) : (
                  <>Action Required</>
                )}
              </h3>
              <p className="gg-card-subtitle">
                {alertList.length > 0 ? "Review and resolve" : "Everything looks good"}
              </p>
            </div>
            <div className="gg-card-body">
              <AlertCenter items={alertList} navigate={navigate} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Triptych: Health · Pipeline · Team load ──────────────── */}
      <div className="gg-owner-triptych">
        <div className="gg-card">
          <div className="gg-card-header">
            <h3 className="gg-card-title">Project Health</h3>
            <p className="gg-card-subtitle">{projects.length} active</p>
          </div>
          <div className="gg-card-body">
            <ProjectHealthBoard projects={projects} />
          </div>
        </div>

        <div className="gg-card">
          <div className="gg-card-header">
            <h3 className="gg-card-title">Client Pipeline</h3>
            <p className="gg-card-subtitle">{stats.totalClients} total</p>
          </div>
          <div className="gg-card-body">
            <ClientPipelineFunnel lifecycle={lifecycle} totalValue={totalPipelineValue} />
          </div>
        </div>

        <div className="gg-card">
          <div className="gg-card-header">
            <h3 className="gg-card-title">Team Capacity</h3>
            <p className="gg-card-subtitle">{teamLoad.length || stats.teamMembers} members</p>
          </div>
          <div className="gg-card-body">
            <TeamLoadWidget team={teamLoad} teamMembersCount={stats.teamMembers} />
          </div>
        </div>
      </div>

      {/* ── Payments + Deadlines ────────────────────────────────── */}
      <div className="gg-owner-bottom">
        <div className="gg-card">
          <div className="gg-card-header">
            <h3 className="gg-card-title">Recent Payments</h3>
            <button
              className="gg-btn gg-btn-ghost gg-btn-sm"
              onClick={() => navigate("/admin/finance")}
            >
              View all
            </button>
          </div>
          <div className="gg-card-body">
            <PaymentsTimeline payments={recentPayments} />
          </div>
        </div>

        <div className="gg-card">
          <div className="gg-card-header">
            <h3 className="gg-card-title">Upcoming Deadlines</h3>
            <p className="gg-card-subtitle">Next 14 days</p>
          </div>
          <div className="gg-card-body">
            <DeadlinesWidget deadlines={upcomingDeadlines} />
          </div>
        </div>
      </div>

      {/* ── Activity Feed ────────────────────────────────────────── */}
      <div className="gg-card">
        <div className="gg-card-header">
          <h3 className="gg-card-title">Activity</h3>
          <p className="gg-card-subtitle">Recent team actions</p>
        </div>
        <div className="gg-card-body">
          <AdminActivityFeed activity={activityFeedData} />
        </div>
      </div>
    </>
  );
}
