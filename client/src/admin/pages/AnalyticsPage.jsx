/**
 * client/src/admin/pages/AnalyticsPage.jsx
 * Executive intelligence — revenue, leads, projects, team, client health.
 * Pure CSS charts (no external chart library).
 */
import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import { apiClient } from "../../services/apiClient.js";
import {
  TrendingUp, Users, Briefcase, Target,
  CheckCircle, ArrowUp, ArrowDown,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
function fmt$(n) {
  if (n == null) return "$0";
  const num = Number(n);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1000)      return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

function pct(val, total) {
  if (!total) return 0;
  return Math.round((val / total) * 100);
}

// ── Stat Tile ────────────────────────────────────────────────────
function StatTile({ label, value, sub, change, icon, accent = "accent" }) {
  const isUp = change > 0;
  return (
    <div className={`gg-kpi-card gg-kpi-card--${accent}`}>
      <div className="gg-kpi-top">
        <span className={`gg-kpi-icon gg-kpi-icon--${accent}`}>{icon}</span>
        {change != null && (
          <span className={`gg-anly-change ${isUp ? "gg-anly-change--up" : "gg-anly-change--down"}`}>
            {isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="gg-kpi-value">{value}</p>
      <p className="gg-kpi-label">{label}</p>
      {sub && <p className="gg-kpi-sub">{sub}</p>}
    </div>
  );
}

// ── Horizontal Bar Chart ─────────────────────────────────────────
function HBarChart({ items = [], colorVar = "--gg-accent" }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="gg-hbar-list">
      {items.map((item) => (
        <div key={item.label} className="gg-hbar-row">
          <span className="gg-hbar-label">{item.label}</span>
          <div className="gg-hbar-track">
            <div
              className="gg-hbar-fill"
              style={{
                width: `${Math.max(Math.round((item.value / max) * 100), item.value > 0 ? 4 : 0)}%`,
                background: item.color || `var(${colorVar})`,
              }}
            />
          </div>
          <span className="gg-hbar-val">{item.display ?? item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Donut Chart (CSS) ────────────────────────────────────────────
function DonutChart({ segments = [], total, label }) {
  // segments: [{label, value, color}]
  let cumulativePct = 0;
  const conicParts = segments.map((s) => {
    const p = pct(s.value, total || 1);
    const part = `${s.color} ${cumulativePct}% ${cumulativePct + p}%`;
    cumulativePct += p;
    return part;
  });
  const gradient = conicParts.length
    ? `conic-gradient(${conicParts.join(", ")}, var(--gg-border) ${cumulativePct}% 100%)`
    : `conic-gradient(var(--gg-border) 0% 100%)`;

  return (
    <div className="gg-donut-wrap">
      <div className="gg-donut" style={{ background: gradient }}>
        <div className="gg-donut-hole">
          <p className="gg-donut-val">{total ?? 0}</p>
          <p className="gg-donut-lbl">{label}</p>
        </div>
      </div>
      <div className="gg-donut-legend">
        {segments.map((s) => (
          <div key={s.label} className="gg-donut-legend-item">
            <span className="gg-donut-legend-dot" style={{ background: s.color }} />
            <span className="gg-donut-legend-text">{s.label}</span>
            <span className="gg-donut-legend-count">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Monthly Rev Bar Chart ────────────────────────────────────────
function MonthlyChart({ bars = [] }) {
  const max = Math.max(...bars.map((b) => b.amount), 1);
  return (
    <div className="gg-rev-chart" style={{ height: 140 }}>
      {bars.map((b) => {
        const p = Math.max(Math.round((b.amount / max) * 100), b.amount > 0 ? 5 : 0);
        return (
          <div key={b.month} className="gg-rev-bar-wrap">
            <span className="gg-rev-bar-value" style={{ fontSize: "0.65rem" }}>
              {b.amount > 0 ? fmt$(b.amount) : ""}
            </span>
            <div className={`gg-rev-bar${b.amount === 0 ? " gg-rev-bar--empty" : ""}`}
              style={{ height: `${p}%` }} />
            <span className="gg-rev-bar-label">{b.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── AnalyticsPage ────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    Promise.allSettled([
      apiClient.get("/api/dashboard/admin"),
      apiClient.get("/api/leads"),
      apiClient.get("/api/tasks"),
      apiClient.get("/api/payments/summary"),
    ]).then(([dashRes, leadsRes, tasksRes, payRes]) => {
      const dash   = dashRes.status   === "fulfilled" ? dashRes.value.data   : {};
      const leads  = leadsRes.status  === "fulfilled" ? leadsRes.value.data  : {};
      const tasks  = tasksRes.status  === "fulfilled" ? tasksRes.value.data  : {};
      const pay    = payRes.status    === "fulfilled" ? payRes.value.data    : {};
      setData({ dash, leads, tasks, pay });
    }).catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageWrapper title="Analytics" description="Executive business intelligence.">
      <div className="gg-empty">Loading analytics…</div>
    </PageWrapper>
  );

  if (error || !data) return (
    <PageWrapper title="Analytics" description="Executive business intelligence.">
      <div className="gg-empty">{error || "No data available."}</div>
    </PageWrapper>
  );

  const { dash, leads, tasks, pay } = data;
  const stats   = dash.stats   || {};
  const lifecycle = dash.lifecycle || {};
  const revenueChart = dash.revenueChart || [];

  // Lead source breakdown
  const leadList   = leads.leads || leads.clients || [];
  const leadSources = leadList.reduce((acc, l) => {
    const src = l.source || "Direct";
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});
  const sourceItems = Object.entries(leadSources).map(([label, value]) => ({
    label, value, display: value,
    color: label === "Referral"  ? "#6366f1" :
           label === "Direct"    ? "#0ea5e9" :
           label === "Website"   ? "#22c55e" :
           label === "Social"    ? "#f59e0b" : "#94a3b8",
  })).sort((a, b) => b.value - a.value);

  // Stage pipeline data
  const stageItems = [
    { label: "New",          value: lifecycle.lead       ?? 0, color: "#6366f1" },
    { label: "Onboarding",   value: lifecycle.onboarding ?? 0, color: "#0ea5e9" },
    { label: "Active",       value: lifecycle.active     ?? 0, color: "#22c55e" },
    { label: "Delivered",    value: lifecycle.delivered  ?? 0, color: "#f59e0b" },
    { label: "Retainer",     value: lifecycle.subscription ?? 0, color: "#8b5cf6" },
  ];
  const totalClients = stageItems.reduce((s, i) => s + i.value, 0);

  // Task breakdown
  const taskList     = tasks.tasks || [];
  const tasksDone    = taskList.filter((t) => t.status === "done" || t.status === "completed").length;
  const tasksActive  = taskList.filter((t) => t.status === "in_progress" || t.status === "active").length;
  const tasksOverdue = taskList.filter((t) => t.status === "overdue").length;
  const totalTasks   = taskList.length;

  // Close rate
  const wonLeads  = leadList.filter((l) => l.lifecycle_stage === "active" || l.lifecycle_stage === "subscription").length;
  const closeRate = totalClients > 0 ? Math.round((wonLeads / Math.max(totalClients, 1)) * 100) : 0;

  // Avg project value
  const avgProjectValue = stats.totalProjects > 0
    ? Math.round((pay.totalRevenue || 0) / stats.totalProjects)
    : 0;

  return (
    <PageWrapper title="Analytics" description="Executive business intelligence at a glance.">

      {/* ── Top KPIs ────────────────────────────────────────── */}
      <div className="gg-kpi-row" style={{ marginBottom: 24 }}>
        <StatTile
          label="Revenue MTD"
          value={fmt$(stats.revenueRaw ?? pay.totalRevenue ?? 0)}
          sub="Monthly collected"
          accent="success"
          icon={<TrendingUp size={15} />}
          change={dash.momRevenue}
        />
        <StatTile
          label="Close Rate"
          value={`${closeRate}%`}
          sub="Lead → Active"
          accent="accent"
          icon={<Target size={15} />}
        />
        <StatTile
          label="Avg Project Value"
          value={fmt$(avgProjectValue)}
          sub="Per project"
          accent="blue"
          icon={<Briefcase size={15} />}
        />
        <StatTile
          label="Active Clients"
          value={stats.totalClients ?? totalClients}
          sub={`${lifecycle.lead ?? 0} new leads`}
          accent="purple"
          icon={<Users size={15} />}
        />
        <StatTile
          label="Tasks Completed"
          value={tasksDone}
          sub={`${tasksOverdue} overdue`}
          accent={tasksOverdue > 0 ? "warn" : "success"}
          icon={<CheckCircle size={15} />}
        />
      </div>

      {/* ── Revenue trend + Client pipeline ─────────────────── */}
      <div className="gg-dash-grid" style={{ marginBottom: 20 }}>
        <div className="gg-dash-col">
          <div className="gg-card">
            <div className="gg-card-header">
              <h3 className="gg-card-title">Revenue Trend</h3>
              <p className="gg-card-subtitle">Monthly collected · {new Date().getFullYear()}</p>
            </div>
            <div className="gg-card-body">
              {revenueChart.length > 0
                ? <MonthlyChart bars={revenueChart} />
                : <p className="gg-muted">No revenue data yet.</p>
              }
            </div>
          </div>
        </div>

        <div className="gg-dash-col">
          <div className="gg-card">
            <div className="gg-card-header">
              <h3 className="gg-card-title">Client Lifecycle</h3>
              <p className="gg-card-subtitle">{totalClients} total</p>
            </div>
            <div className="gg-card-body">
              <DonutChart
                segments={stageItems.filter((s) => s.value > 0)}
                total={totalClients}
                label="clients"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Lead sources + Task health ───────────────────────── */}
      <div className="gg-owner-triptych" style={{ marginBottom: 20 }}>
        <div className="gg-card">
          <div className="gg-card-header">
            <h3 className="gg-card-title">Lead Sources</h3>
            <p className="gg-card-subtitle">{leadList.length} total leads</p>
          </div>
          <div className="gg-card-body">
            {sourceItems.length > 0
              ? <HBarChart items={sourceItems} />
              : <p className="gg-muted">No lead source data.</p>
            }
          </div>
        </div>

        <div className="gg-card">
          <div className="gg-card-header">
            <h3 className="gg-card-title">Task Health</h3>
            <p className="gg-card-subtitle">{totalTasks} tasks total</p>
          </div>
          <div className="gg-card-body">
            <DonutChart
              segments={[
                { label: "Completed", value: tasksDone,    color: "#22c55e" },
                { label: "Active",    value: tasksActive,  color: "#6366f1" },
                { label: "Overdue",   value: tasksOverdue, color: "#ef4444" },
              ].filter((s) => s.value > 0)}
              total={totalTasks}
              label="tasks"
            />
          </div>
        </div>

        <div className="gg-card">
          <div className="gg-card-header">
            <h3 className="gg-card-title">Key Metrics</h3>
            <p className="gg-card-subtitle">Business health score</p>
          </div>
          <div className="gg-card-body">
            <div className="gg-anly-metrics">
              <div className="gg-anly-metric-row">
                <span className="gg-anly-metric-label">Close Rate</span>
                <div className="gg-anly-metric-bar-track">
                  <div className="gg-anly-metric-bar-fill" style={{ width: `${closeRate}%`, background: "#6366f1" }} />
                </div>
                <span className="gg-anly-metric-val">{closeRate}%</span>
              </div>
              <div className="gg-anly-metric-row">
                <span className="gg-anly-metric-label">Task Done Rate</span>
                <div className="gg-anly-metric-bar-track">
                  <div className="gg-anly-metric-bar-fill" style={{ width: `${pct(tasksDone, totalTasks)}%`, background: "#22c55e" }} />
                </div>
                <span className="gg-anly-metric-val">{pct(tasksDone, totalTasks)}%</span>
              </div>
              <div className="gg-anly-metric-row">
                <span className="gg-anly-metric-label">Overdue Rate</span>
                <div className="gg-anly-metric-bar-track">
                  <div className="gg-anly-metric-bar-fill" style={{ width: `${pct(tasksOverdue, totalTasks)}%`, background: "#ef4444" }} />
                </div>
                <span className="gg-anly-metric-val">{pct(tasksOverdue, totalTasks)}%</span>
              </div>
              <div className="gg-anly-metric-row">
                <span className="gg-anly-metric-label">Retainer Rate</span>
                <div className="gg-anly-metric-bar-track">
                  <div className="gg-anly-metric-bar-fill" style={{ width: `${pct(lifecycle.subscription ?? 0, totalClients)}%`, background: "#8b5cf6" }} />
                </div>
                <span className="gg-anly-metric-val">{pct(lifecycle.subscription ?? 0, totalClients)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pipeline funnel ──────────────────────────────────── */}
      <div className="gg-card">
        <div className="gg-card-header">
          <h3 className="gg-card-title">Pipeline Funnel</h3>
          <p className="gg-card-subtitle">Client journey stages</p>
        </div>
        <div className="gg-card-body">
          <HBarChart
            items={stageItems.map((s) => ({ ...s, display: `${s.value} clients` }))}
          />
        </div>
      </div>

    </PageWrapper>
  );
}
