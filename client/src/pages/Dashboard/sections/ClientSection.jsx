import React, { useState } from "react";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  MessageSquare,
  CreditCard,
  FileText,
  AlertCircle,
  ArrowRight,
  Mail,
  Send,
  Star,
} from "lucide-react";
import useDashboardData from "../hooks/useDashboardData.js";
import StatCard, {
  DashboardPage,
  SkeletonStats,
  SkeletonPanel,
} from "../components/DashboardWidgets.jsx";
import { apiClient } from "../../../services/apiClient.js";

const REQUEST_TYPES = ["change", "upload", "approval"];

function RequestForm({ onSubmit }) {
  const [type, setType] = useState("change");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ type, description: description.trim() });
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="dash-request-form" onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {REQUEST_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            className={`dash-chip${type === t ? " active" : ""}`}
            onClick={() => setType(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="dash-input"
          type="text"
          placeholder="Describe your request..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
        <button className="dash-btn-accent" type="submit" disabled={submitting || !description.trim()}>
          <Send size={14} />
        </button>
      </div>
    </form>
  );
}

export default function ClientSection() {
  const { data, loading, error, refetch } = useDashboardData("/api/dashboard/client");

  if (error) {
    return (
      <DashboardPage>
        <div className="dash-empty">
          <div className="dash-empty-title">Failed to load project data</div>
          <div className="dash-empty-desc">{error}</div>
        </div>
      </DashboardPage>
    );
  }

  if (loading || !data) {
    return (
      <DashboardPage>
        <SkeletonStats count={4} />
        <SkeletonPanel />
        <SkeletonPanel />
      </DashboardPage>
    );
  }

  const projects = data.projects || [];
  const stats = data.stats || {};
  const payments = data.payments;
  const invoices = data.invoices || [];
  const requests = data.requests || [];

  const handleSubmitRequest = async ({ type, description }) => {
    await apiClient.post("/api/comms/requests", { type, description });
    refetch();
  };

  return (
    <DashboardPage>
      {/* Client stats */}
      <div className="dash-stats-grid">
        <StatCard icon={FolderKanban} label="My Projects" value={stats.totalProjects ?? projects.length} color="orange" />
        <StatCard icon={CheckCircle2} label="Milestones Done" value={stats.completedMilestones ?? 0} color="green" />
        <StatCard icon={Clock} label="In Progress" value={stats.activeProjects ?? 0} color="blue" />
        <StatCard icon={Mail} label="Unread Messages" value={stats.unreadMessages ?? 0} color="purple" />
      </div>

      {/* Payment & Invoices row */}
      <div className="dash-grid-2">
        {/* Current Plan */}
        {payments ? (
          <div className="dash-panel dash-plan-card">
            <div className="dash-panel-header">
              <span className="dash-panel-title">
                <CreditCard size={16} style={{ marginRight: 8 }} />
                Current Plan
              </span>
              <span className={`dash-badge ${payments.status}`}>{payments.status}</span>
            </div>
            <div className="dash-panel-body">
              <div className="dash-plan-name">{payments.planName}</div>
              <div className="dash-plan-price">
                ${payments.planPrice}<span className="dash-plan-period">/{payments.billing === "yearly" ? "yr" : "mo"}</span>
              </div>
              <div className="dash-plan-next">
                Next billing: {new Date(payments.nextBillingDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              {payments.features?.length > 0 && (
                <ul className="dash-plan-features">
                  {payments.features.map((f, i) => (
                    <li key={i}>
                      <Star size={12} style={{ color: "var(--dash-accent)", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="dash-panel">
            <div className="dash-panel-body">
              <div className="dash-empty" style={{ padding: 32 }}>
                <CreditCard size={28} className="dash-empty-icon" />
                <div className="dash-empty-desc">No active subscription</div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span className="dash-panel-title">
              <FileText size={16} style={{ marginRight: 8 }} />
              Invoices
            </span>
          </div>
          <div className="dash-panel-body" style={{ padding: 0 }}>
            {invoices.length === 0 ? (
              <div className="dash-empty" style={{ padding: 32 }}>
                <div className="dash-empty-desc">No invoices</div>
              </div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600, color: "var(--dash-text)", fontSize: "0.8rem" }}>
                        {inv.id}
                      </td>
                      <td>${inv.amount}</td>
                      <td>
                        <span className={`dash-badge ${inv.status}`}>{inv.status}</span>
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "var(--dash-text-muted)" }}>
                        {new Date(inv.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* My Requests */}
      <div className="dash-panel">
        <div className="dash-panel-header">
          <span className="dash-panel-title">
            <AlertCircle size={16} style={{ marginRight: 8 }} />
            My Requests
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--dash-text-muted)" }}>
            {requests.filter((r) => r.status === "pending").length} pending
          </span>
        </div>
        <div className="dash-panel-body">
          <RequestForm onSubmit={handleSubmitRequest} />
          {requests.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {requests.map((req) => (
                <div className="dash-request-item" key={req.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span className={`dash-badge ${req.type}`}>{req.type}</span>
                    <span className={`dash-badge ${req.status}`}>{req.status}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--dash-text-muted)", marginLeft: "auto" }}>
                      {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--dash-text-secondary)" }}>
                    {req.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project timelines */}
      {projects.map((project) => (
        <div className="dash-panel" key={project.id}>
          <div className="dash-panel-header">
            <span className="dash-panel-title">{project.name}</span>
            <span className={`dash-badge ${project.status?.toLowerCase().replace(/\s/g, "-")}`}>
              {project.status}
            </span>
          </div>
          <div className="dash-panel-body">
            {/* Next step callout */}
            {project.nextStep && (
              <div className="dash-next-step">
                <ArrowRight size={14} />
                <span>Next: {project.nextStep}</span>
              </div>
            )}

            {/* Overall progress */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.82rem", color: "var(--dash-text-secondary)" }}>
                  Overall Progress
                </span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  {project.progress || 0}%
                </span>
              </div>
              <div className="dash-progress">
                <div className="dash-progress-bar" style={{ width: `${project.progress || 0}%` }} />
              </div>
            </div>

            {/* Timeline */}
            {project.timeline && project.timeline.length > 0 && (
              <div className="dash-timeline">
                {project.timeline.map((phase, idx) => (
                  <div className="dash-timeline-item" key={idx}>
                    <div className={`dash-timeline-dot${phase.completed ? " completed" : ""}`} />
                    <div className="dash-timeline-title">{phase.name}</div>
                    <div className="dash-timeline-desc">
                      {phase.completed
                        ? `Completed${phase.completedAt ? ` ・ ${new Date(phase.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}`
                        : "Upcoming"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {projects.length === 0 && (
        <div className="dash-panel">
          <div className="dash-panel-body">
            <div className="dash-empty">
              <MessageSquare size={36} className="dash-empty-icon" />
              <div className="dash-empty-title">No Projects Yet</div>
              <div className="dash-empty-desc">Your projects will appear here once assigned.</div>
            </div>
          </div>
        </div>
      )}
    </DashboardPage>
  );
}
