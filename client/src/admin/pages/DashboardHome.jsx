import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../services/apiClient.js";
import { useAuth } from "../../hooks/useAuth.js";
import {
  Briefcase, CheckCircle, MessageSquare, Clock, Users, ChevronRight,
  Check, ArrowRight, Package, Zap, CalendarDays,
  Sparkles, Rocket, Star, Building2,
  ThumbsDown, Frown, Meh, Smile, ThumbsUp, Heart,
  AlertTriangle, Target,
} from "lucide-react";
import AdminDashboardView from "./AdminDashboardView.jsx";

// ─── Helpers ────────────────────────────────────────────────
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
  return `${tod}, ${name.split(" ")[0]}`;
}

function formatDate() {
  return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

const STAGE_META = {
  lead:         { label: "Lead",         cls: "gg-pipeline-pill--lead" },
  onboarding:   { label: "Onboarding",   cls: "gg-pipeline-pill--onboarding" },
  active:       { label: "Active",       cls: "gg-pipeline-pill--active" },
  delivered:    { label: "Delivered",    cls: "gg-pipeline-pill--delivered" },
  subscription: { label: "Subscription", cls: "gg-pipeline-pill--subscription" },
};

const STATUS_COLORS = {
  "In Progress": "gg-badge--in-progress",
  "Planning":    "gg-badge--planning",
  "Completed":   "gg-badge--completed",
  "Review":      "gg-badge--review",
};

// ─── Sub-components ─────────────────────────────────────────
function KpiCard({ label, value, sub, accent, icon, trend, to }) {
  const navigate = useNavigate();
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
        {trend && <span className={`gg-kpi-trend gg-kpi-trend--${trend.dir}`}>{trend.label}</span>}
      </div>
      <p className="gg-kpi-value">{value}</p>
      <p className="gg-kpi-label">{label}</p>
      {sub && <p className="gg-kpi-sub">{sub}</p>}
    </div>
  );
}

function RevenueChart({ bars }) {
  const max = Math.max(...bars.map((b) => b.amount), 1);
  return (
    <div className="gg-rev-chart">
      {bars.map((b) => {
        const pct = Math.max(Math.round((b.amount / max) * 100), b.amount > 0 ? 8 : 0);
        return (
          <div key={b.month} className="gg-rev-bar-wrap">
            <span className="gg-rev-bar-value">{b.amount > 0 ? `$${b.amount}` : ""}</span>
            <div
              className={`gg-rev-bar${b.amount === 0 ? " gg-rev-bar--empty" : ""}`}
              style={{ height: `${pct}%` }}
            />
            <span className="gg-rev-bar-label">{b.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function Pipeline({ lifecycle }) {
  const stages = ["lead", "onboarding", "active", "delivered", "subscription"];
  return (
    <div className="gg-pipeline-row">
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`gg-pipeline-pill ${STAGE_META[s].cls}`}>
            <span className="gg-pipeline-count">{lifecycle[s] ?? 0}</span>
            <span className="gg-pipeline-label">{STAGE_META[s].label}</span>
          </div>
          {i < stages.length - 1 && <span className="gg-pipeline-arrow">›</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function ProjectsTable({ projects }) {
  if (!projects?.length) return <p className="gg-muted" style={{ padding: "12px 0" }}>No active projects.</p>;
  return (
    <div className="gg-table-wrap" style={{ border: "none", boxShadow: "none", borderRadius: 0 }}>
      <table className="gg-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th style={{ minWidth: 100 }}>Progress</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td style={{ fontWeight: 600, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</td>
              <td style={{ color: "var(--gg-text-muted)", whiteSpace: "nowrap" }}>{p.clientName}</td>
              <td>
                <div className="gg-progress" style={{ marginBottom: 2 }}>
                  <div className="gg-progress-fill" style={{ width: `${p.progress}%` }} />
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--gg-text-muted)" }}>{p.progress}%</span>
              </td>
              <td style={{ color: "var(--gg-text-muted)", whiteSpace: "nowrap", fontSize: "0.82rem" }}>{p.deadline}</td>
              <td><span className={`gg-badge ${STATUS_COLORS[p.status] || "gg-badge--todo"}`}>{p.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityFeed({ activity }) {
  if (!activity?.length) return <p className="gg-muted" style={{ padding: "12px 0" }}>No activity yet.</p>;
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

function BookingsList({ bookings }) {
  if (!bookings?.length) return <p className="gg-muted" style={{ padding: "12px 0" }}>No bookings yet.</p>;
  return (
    <div className="gg-booking-list">
      {bookings.map((b) => (
        <div key={b.id} className="gg-booking-item">
          <div className="gg-booking-avatar">{initials(b.name || "?")}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="gg-booking-name">{b.name}</p>
            <p className="gg-booking-meta">{b.service || b.email}</p>
          </div>
          <span className="gg-badge gg-badge--active" style={{ fontSize: "0.68rem" }}>Booked</span>
        </div>
      ))}
    </div>
  );
}

// ─── useCountUp hook ─────────────────────────────────────────
function useCountUp(target, duration = 800) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (target == null || isNaN(target)) { setVal(target); return; }
    const start = performance.now();
    const from = 0;
    const to = Number(target);
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return val;
}

// ─── KPI Tile ────────────────────────────────────────────────
function KpiTile({ icon, iconClass, value, label, prefix = "", suffix = "", duration = 800 }) {
  const counted = useCountUp(typeof value === "number" ? value : null, duration);
  const display = typeof value === "number" ? `${prefix}${counted}${suffix}` : value;
  return (
    <div className="cp-kpi-tile">
      <div className={`cp-kpi-tile-icon ${iconClass}`}>{icon}</div>
      <p className="cp-kpi-num cp-count-num">{display}</p>
      <p className="cp-kpi-label">{label}</p>
    </div>
  );
}

// ─── Deadline Arc ─────────────────────────────────────────────
function DeadlineStrip({ deadline, startDate }) {
  if (!deadline) return null;
  const now = Date.now();
  const end = new Date(deadline).getTime();
  const start = startDate ? new Date(startDate).getTime() : now - 90 * 86400000;
  const total = end - start;
  const elapsed = now - start;
  const pct = Math.max(0, Math.min(1, elapsed / total));
  const days = Math.ceil((end - now) / 86400000);
  const degPct = Math.round(pct * 360);

  let arcColor = "#0284c7";
  let daysCls = "cp-deadline-days";
  if (days <= 0) { arcColor = "#dc2626"; daysCls = "cp-deadline-days cp-deadline-days--pulse"; }
  else if (days <= 14) { arcColor = "#dc2626"; daysCls = "cp-deadline-days cp-deadline-days--urgent"; }
  else if (days <= 30) { arcColor = "#b45309"; daysCls = "cp-deadline-days cp-deadline-days--warn"; }

  return (
    <div className="cp-deadline-strip">
      <div
        className="cp-deadline-arc"
        style={{ "--cp-arc-color": arcColor, "--cp-arc-pct": `${degPct}deg` }}
      >
        <span className="cp-deadline-arc-inner">{Math.round(pct * 100)}%</span>
      </div>
      <div>
        <p className={daysCls}>{days > 0 ? `${days} days` : "Deadline passed"}</p>
        <p className="cp-deadline-label">until {new Date(deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
      </div>
    </div>
  );
}

// ─── Phase Progress ───────────────────────────────────────────
function PhaseProgress({ timeline = [] }) {
  if (!timeline.length) return null;
  const done = timeline.filter((t) => t.completed).length;
  return (
    <div className="cp-phase-bar">
      <div className="cp-phase-header">
        <span className="cp-phase-title">Project Phases</span>
        <span className="cp-phase-story">{done} of {timeline.length} complete</span>
      </div>
      <div className="cp-phase-track">
        {timeline.map((p, i) => (
          <div
            key={i}
            className={`cp-phase-segment${p.completed ? " cp-phase-segment--done" : i === done ? " cp-phase-segment--active" : ""}`}
          />
        ))}
      </div>
      <div className="cp-phase-dots">
        {timeline.map((p, i) => (
          <div key={i} className="cp-phase-dot-wrap">
            <div className={`cp-phase-dot${p.completed ? " cp-phase-dot--done" : i === done ? " cp-phase-dot--active" : ""}`}>
              {p.completed ? <Check size={10} strokeWidth={3} /> : i + 1}
            </div>
            <span className="cp-phase-dot-label">{p.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Activity Timeline ────────────────────────────────────────
function ActivityTimeline({ timeline = [], requests = [] }) {
  const events = [
    ...timeline.filter((t) => t.completed && t.completedAt).map((t) => ({
      label: `${t.name} completed`,
      date: t.completedAt,
      type: "done",
    })),
    ...requests.slice(0, 3).map((r) => ({
      label: r.title,
      date: r.createdAt,
      type: "request",
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  if (!events.length) return null;
  return (
    <div className="cp-activity">
      <p className="cp-activity-title">Activity</p>
      {events.map((ev, i) => (
        <div key={i} className="cp-tl-item">
          <div className="cp-tl-left">
            <div className={`cp-tl-icon-wrap cp-tl-icon-wrap--${ev.type}`}>
              {ev.type === "done" ? <CheckCircle size={13} /> : ev.type === "request" ? <MessageSquare size={13} /> : <Clock size={13} />}
            </div>
            {i < events.length - 1 && <div className="cp-tl-line" />}
          </div>
          <div className="cp-tl-body">
            <p className="cp-tl-label">{ev.label}</p>
            <p className="cp-tl-meta">{relativeTime(ev.date)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Team Card ────────────────────────────────────────────────
function TeamCard({ members = [] }) {
  if (!members.length) return null;
  return (
    <div className="cp-team-card">
      <p className="cp-team-title">Your Team</p>
      <div className="cp-team-list">
        {members.map((m) => (
          <div key={m.id} className="cp-team-member">
            <div className="cp-team-avatar">{initials(m.name)}</div>
            <div>
              <p className="cp-team-name">{m.name}</p>
              <p className="cp-team-role">{m.role}</p>
            </div>
            <div className="cp-team-online" title="Online" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NPS Row ──────────────────────────────────────────────────
const NPS_OPTIONS = [
  { Icon: ThumbsDown, label: "Poor",  value: "1" },
  { Icon: Frown,      label: "Bad",   value: "2" },
  { Icon: Meh,        label: "Okay",  value: "3" },
  { Icon: Smile,      label: "Good",  value: "4" },
  { Icon: ThumbsUp,   label: "Great", value: "5" },
];
function NpsRow() {
  const key = "gg_nps_done";
  const [picked, setPicked] = useState(() => localStorage.getItem(key) || null);
  if (picked) return (
    <div className="cp-nps">
      <p className="cp-nps-thanks" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Heart size={14} style={{ color: "#e11d48" }} /> Thanks for your feedback!
      </p>
    </div>
  );
  return (
    <div className="cp-nps">
      <p className="cp-nps-label">How is your experience so far?</p>
      <div className="cp-nps-row">
        {NPS_OPTIONS.map(({ Icon, label, value }) => (
          <button key={value} className="cp-nps-emoji" onClick={() => { localStorage.setItem(key, value); setPicked(value); }}>
            <Icon size={22} strokeWidth={1.5} />
            <span className="cp-nps-emoji-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ClientPortalHome ─────────────────────────────────────────
function ClientPortalHome({ user }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/dashboard/client")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
        <div className="cp-skeleton cp-skeleton-card" />
        <div className="cp-kpi-bar">
          {[1,2,3,4].map((i) => <div key={i} className="cp-skeleton cp-skeleton-card" style={{ height: 100 }} />)}
        </div>
        <div className="cp-skeleton cp-skeleton-rect" style={{ height: 180 }} />
      </div>
    );
  }

  const { projects = [], stats = {}, payments, invoices = [], requests = [], stage = "active", startDate, teamMembers = [] } = data || {};
  const project = projects[0];
  const timeline = project?.timeline || [];
  const displayName = user?.name || "there";

  const stageClass = `cp-hero--${stage}`;
  const stageLabel = stage.charAt(0).toUpperCase() + stage.slice(1);

  const STAGE_ICON_MAP = { delivered: Sparkles, onboarding: Rocket, subscription: Star, active: Building2 };
  const HeroIcon = STAGE_ICON_MAP[stage] || Building2;

  const kpiItems = [
    { icon: <Briefcase size={16} />, iconClass: "cp-kpi-tile-icon--blue", value: stats.totalProjects ?? 0, label: "Active Projects" },
    { icon: <CheckCircle size={16} />, iconClass: "cp-kpi-tile-icon--green", value: stats.completedMilestones ?? 0, label: "Milestones Done" },
    { icon: <MessageSquare size={16} />, iconClass: "cp-kpi-tile-icon--amber", value: stats.unreadMessages ?? 0, label: "Unread Messages" },
    { icon: <Clock size={16} />, iconClass: "cp-kpi-tile-icon--purple", value: stats.pendingRequests ?? 0, label: "Pending Requests" },
  ];

  const paidTotal = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <>
      {/* Hero banner */}
      <div className={`cp-hero ${stageClass}`}>
        <div className="cp-hero-badge">
          <Users size={12} /> {stageLabel} Client
        </div>
        <h2 className="cp-hero-title">{greeting(displayName)}</h2>
        <p className="cp-hero-sub">
          {project ? `Your ${project.name} is ${project.progress ?? 0}% complete.` : "Welcome to your Gale Grid client portal."}
        </p>
        <div className="cp-hero-tags">
          {payments && <span className="cp-hero-tag"><Package size={11} /> {payments.planName}</span>}
          {project && <span className="cp-hero-tag"><Zap size={11} /> {project.status}</span>}
          <span className="cp-hero-tag"><CalendarDays size={11} /> {formatDate()}</span>
        </div>
        <div className="cp-hero-art"><HeroIcon size={72} strokeWidth={1} style={{ opacity: 0.18 }} /></div>
      </div>

      {/* KPI bar */}
      <div className="cp-kpi-bar">
        {kpiItems.map((k) => <KpiTile key={k.label} {...k} />)}
      </div>

      {/* Main 2-col */}
      <div className="cp-grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Deadline arc */}
          {project?.deadline && (
            <DeadlineStrip deadline={project.deadline} startDate={startDate} />
          )}

          {/* Phase progress */}
          {timeline.length > 0 && <PhaseProgress timeline={timeline} />}

          {/* Project card */}
          {project && (
            <div className="cp-project-wrap" onClick={() => navigate("/admin/projects")} style={{ cursor: "pointer" }}>
              <div className="cp-project-status-row">
                <h3 className="cp-project-name">{project.name}</h3>
                <ChevronRight size={16} style={{ color: "var(--gg-text-muted)", marginLeft: "auto" }} />
              </div>
              <div className="gg-progress">
                <div className="gg-progress-fill" style={{ width: `${project.progress ?? 0}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: "0.78rem", color: "var(--gg-text-muted)" }}>{project.progress ?? 0}% complete</span>
                <span style={{ fontSize: "0.78rem", color: "var(--gg-text-muted)" }}>Due {project.deadline}</span>
              </div>
              {project.nextStep && (
                <p className="cp-project-next"><ArrowRight size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />{project.nextStep}</p>
              )}
            </div>
          )}

          {/* Activity timeline */}
          <ActivityTimeline timeline={timeline} requests={requests} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Team card */}
          <TeamCard members={teamMembers} />

          {/* Billing summary */}
          {payments && (
            <div className="cp-subscription-card">
              <div className="cp-sub-plan-head">
                <span className="cp-sub-plan-name">{payments.planName}</span>
                <span className="cp-sub-badge">Active</span>
              </div>
              <p className="cp-sub-price">${payments.planPrice}<small>/mo</small></p>
              <p className="cp-sub-next">Next billing: {payments.nextBillingDate}</p>
              <ul className="cp-sub-features">
                {(payments.features || []).map((f) => (
                  <li key={f} className="cp-sub-feature">
                    <span className="cp-sub-feature-check"><Check size={12} strokeWidth={2.5} /></span> {f}
                  </li>
                ))}
              </ul>
              {paidTotal > 0 && (
                <div className="cp-sub-countdown">
                  <p className="cp-sub-countdown-label">Total paid to date</p>
                  <p className="cp-sub-countdown-days">${paidTotal.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {/* NPS */}
          <NpsRow />
        </div>
      </div>
    </>
  );
}

// ─── TodaysFocus widget (team members) ─────────────────────
function TodaysFocus({ userId }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    apiClient.get("/api/tasks")
      .then((res) => {
        const today = new Date().toISOString().split("T")[0];
        const mine = (res.data.tasks || [])
          .filter((t) => {
            const isAssignedToMe = t.assignedTo === userId || t.assigned_to === userId;
            const dueToday = t.due_date && t.due_date.split("T")[0] === today;
            const isOpen = t.status !== "completed" && t.status !== "done";
            return isAssignedToMe && dueToday && isOpen;
          })
          .slice(0, 6);
        setTasks(mine);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleStatusChange = async (task, newStatus) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: newStatus } : t));
    setUpdating(task.id);
    try {
      await apiClient.put(`/api/tasks/${task.id}`, { ...task, status: newStatus });
    } catch {
      // Revert on failure
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: task.status } : t));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return null;
  if (!tasks.length) return null;

  return (
    <div className="gg-card gg-today-focus">
      <div className="gg-card-header">
        <h3 className="gg-card-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Target size={15} /> Today's Focus
        </h3>
        <p className="gg-card-subtitle">{tasks.length} task{tasks.length > 1 ? "s" : ""} due today</p>
      </div>
      <div className="gg-card-body">
        {tasks.map((task) => (
          <div key={task.id} className="gg-focus-row">
            <span className="gg-focus-task-name">{task.title}</span>
            <select
              className="gg-focus-status-select"
              value={task.status}
              disabled={updating === task.id}
              onChange={(e) => handleStatusChange(task, e.target.value)}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
        <button
          className="gg-btn gg-btn-ghost gg-btn-sm"
          style={{ marginTop: 8 }}
          onClick={() => navigate("/admin/tasks")}
        >
          View all tasks
        </button>
      </div>
    </div>
  );
}

// ─── Team Dashboard View ──────────────────────────────────
function TeamDashboardView({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      apiClient.get("/api/dashboard/admin"),
    ]).then(([dashRes]) => {
      if (dashRes.status === "fulfilled") setData(dashRes.value.data);
    }).finally(() => setLoading(false));
  }, []);

  const displayName = user?.name || "there";

  if (loading) {
    return (
      <div className="gg-dash-loading">
        <div className="gg-dash-spinner" />
        <span>Loading…</span>
      </div>
    );
  }

  const { stats, projects } = data || {};

  const kpiCards = [
    {
      label: "Active Projects",
      value: stats?.totalProjects ?? 0,
      accent: "blue",
      icon: "P",
      to: "/admin/projects",
    },
    {
      label: "Open Tasks",
      value: stats?.activeTasks ?? 0,
      accent: "accent",
      icon: <Check size={14} />,
      to: "/admin/tasks",
    },
    {
      label: "Messages",
      value: stats?.unreadMessages ?? 0,
      accent: stats?.unreadMessages > 0 ? "warn" : "neutral",
      icon: <MessageSquare size={14} />,
      to: "/admin/inbox",
    },
  ];

  return (
    <>
      <div className="gg-dash-greeting">
        <div>
          <h2 className="gg-dash-greeting-name">{greeting(displayName)}</h2>
          <p className="gg-dash-greeting-date">{formatDate()}</p>
        </div>
      </div>
      <div className="gg-kpi-row">
        {kpiCards.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>
      <div className="gg-dash-grid">
        <div className="gg-dash-col">
          <TodaysFocus userId={user?.id} />
          <div className="gg-card">
            <div className="gg-card-header">
              <h3 className="gg-card-title">Active Projects</h3>
            </div>
            <div className="gg-card-body" style={{ padding: 0 }}>
              <ProjectsTable projects={projects || []} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Dashboard Router ────────────────────────────────────────
export default function DashboardHome() {
  const { user, role } = useAuth();
  if (role === "client") return <ClientPortalHome user={user} />;
  if (role === "team")   return <TeamDashboardView user={user} />;
  return <AdminDashboardView user={user} />;
}
