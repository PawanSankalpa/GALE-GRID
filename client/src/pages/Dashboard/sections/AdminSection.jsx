import React from "react";
import {
  Shield,
  Users,
  FolderKanban,
  DollarSign,
  ArrowRight,
  CreditCard,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import useDashboardData from "../hooks/useDashboardData.js";
import StatCard, {
  DashboardPage,
  SkeletonStats,
  SkeletonPanel,
} from "../components/DashboardWidgets.jsx";

const STAGE_COLORS = {
  lead: "#60a5fa",
  onboarding: "#a78bfa",
  active: "#34d399",
  delivered: "#ff8c00",
  subscription: "#f472b6",
};

export default function AdminSection() {
  const { data, loading, error } = useDashboardData("/api/dashboard/admin");

  if (error) {
    return (
      <DashboardPage>
        <div className="dash-empty">
          <Shield size={40} className="dash-empty-icon" />
          <div className="dash-empty-title">Access Error</div>
          <div className="dash-empty-desc">{error}</div>
        </div>
      </DashboardPage>
    );
  }

  if (loading || !data) {
    return (
      <DashboardPage>
        <SkeletonStats count={5} />
        <SkeletonPanel />
        <SkeletonPanel />
      </DashboardPage>
    );
  }

  const users = data.users || [];
  const clients = data.clients || [];
  const projects = data.projects || [];
  const stats = data.stats || {};
  const lifecycle = data.lifecycle || {};

  return (
    <DashboardPage>
      {/* Admin stats */}
      <div className="dash-stats-grid">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers ?? users.length} color="blue" />
        <StatCard icon={UserCheck} label="Total Clients" value={stats.totalClients ?? clients.length} color="purple" />
        <StatCard icon={FolderKanban} label="Projects" value={stats.totalProjects ?? projects.length} color="orange" />
        <StatCard icon={DollarSign} label="Revenue" value={stats.revenue ?? "$0"} color="green" />
        <StatCard icon={AlertTriangle} label="Outstanding" value={stats.outstanding ?? "$0"} color="red" />
      </div>

      {/* Client Lifecycle Pipeline */}
      <div className="dash-panel">
        <div className="dash-panel-header">
          <span className="dash-panel-title">Client Lifecycle Pipeline</span>
          <span style={{ fontSize: "0.72rem", color: "var(--dash-text-muted)" }}>
            {stats.activeSubscriptions ?? 0} active subscriptions
          </span>
        </div>
        <div className="dash-panel-body">
          <div className="dash-pipeline">
            {Object.entries(lifecycle).map(([stage, count], idx) => (
              <React.Fragment key={stage}>
                <div className="dash-pipeline-stage">
                  <div
                    className="dash-pipeline-count"
                    style={{ background: `${STAGE_COLORS[stage]}20`, color: STAGE_COLORS[stage] }}
                  >
                    {count}
                  </div>
                  <div className="dash-pipeline-label">{stage}</div>
                </div>
                {idx < Object.keys(lifecycle).length - 1 && (
                  <ArrowRight size={16} className="dash-pipeline-arrow" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-grid-2">
        {/* Clients table */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span className="dash-panel-title">Clients</span>
            <CreditCard size={16} style={{ color: "var(--dash-text-muted)" }} />
          </div>
          <div className="dash-panel-body" style={{ padding: 0 }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Stage</th>
                  <th>Projects</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: "var(--dash-text)" }}>{c.company}</td>
                    <td>{c.contactName}</td>
                    <td>
                      <span
                        className="dash-badge"
                        style={{
                          color: STAGE_COLORS[c.stage] || "var(--dash-text-secondary)",
                          background: `${STAGE_COLORS[c.stage] || "#888"}15`,
                        }}
                      >
                        {c.stage}
                      </span>
                    </td>
                    <td>{c.projectCount}</td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--dash-text-muted)" }}>No clients</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users table */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span className="dash-panel-title">Users</span>
          </div>
          <div className="dash-panel-body" style={{ padding: 0 }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: "var(--dash-text)" }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`dash-badge ${u.role}`}>{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Projects table */}
      <div className="dash-panel">
        <div className="dash-panel-header">
          <span className="dash-panel-title">All Projects</span>
        </div>
        <div className="dash-panel-body" style={{ padding: 0 }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: "var(--dash-text)" }}>{p.name}</td>
                  <td>{p.clientName || "—"}</td>
                  <td>
                    <span className={`dash-badge ${p.priority?.toLowerCase()}`}>
                      {p.priority || "—"}
                    </span>
                  </td>
                  <td>
                    <span className={`dash-badge ${p.status?.toLowerCase().replace(/\s/g, "-")}`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--dash-text-muted)" }}>
                    {p.deadline || "—"}
                  </td>
                  <td style={{ width: 120 }}>
                    <div className="dash-progress">
                      <div className="dash-progress-bar" style={{ width: `${p.progress || 0}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPage>
  );
}
