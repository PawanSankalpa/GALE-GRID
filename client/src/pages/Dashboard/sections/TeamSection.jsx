import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  ArrowRight,
  PlayCircle,
  Eye,
} from "lucide-react";
import useDashboardData from "../hooks/useDashboardData.js";
import StatCard, {
  DashboardPage,
  SkeletonStats,
  SkeletonPanel,
} from "../components/DashboardWidgets.jsx";
import { apiClient } from "../../../services/apiClient.js";

const STATUS_FLOW = {
  todo: { next: "in-progress", icon: PlayCircle, label: "Start" },
  "in-progress": { next: "review", icon: Eye, label: "Review" },
  review: { next: "completed", icon: CheckCircle2, label: "Done" },
};

function TaskStatusBtn({ task, onUpdate }) {
  const flow = STATUS_FLOW[task.status];
  const [loading, setLoading] = useState(false);

  if (!flow) return null;

  const handleClick = async () => {
    setLoading(true);
    try {
      await apiClient.put(`/api/tasks/${task.id}/status`, { status: flow.next });
      onUpdate();
    } catch (err) {
      console.error("Failed to update task status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="dash-btn-sm"
      onClick={handleClick}
      disabled={loading}
      title={`Move to ${flow.next}`}
    >
      <flow.icon size={12} />
      {flow.label}
    </button>
  );
}

export default function TeamSection() {
  const { data, loading, error, refetch } = useDashboardData("/api/dashboard/team");

  if (error) {
    return (
      <DashboardPage>
        <div className="dash-empty">
          <div className="dash-empty-title">Failed to load team data</div>
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
      </DashboardPage>
    );
  }

  const tasks = data.tasks || [];
  const projects = data.projects || [];
  const stats = data.stats || {};

  return (
    <DashboardPage>
      {/* Stats */}
      <div className="dash-stats-grid">
        <StatCard icon={ListTodo} label="My Tasks" value={stats.totalTasks ?? tasks.length} color="blue" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed ?? 0} color="green" />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgress ?? 0} color="orange" />
        <StatCard icon={AlertCircle} label="To Do" value={stats.todo ?? 0} color="purple" />
      </div>

      {/* Tasks table */}
      <div className="dash-panel">
        <div className="dash-panel-header">
          <span className="dash-panel-title">Assigned Tasks</span>
        </div>
        <div className="dash-panel-body" style={{ padding: 0 }}>
          {tasks.length === 0 ? (
            <div className="dash-empty">
              <AlertCircle size={32} className="dash-empty-icon" />
              <div className="dash-empty-desc">No tasks assigned</div>
            </div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: "var(--dash-text)" }}>{t.title}</td>
                    <td>{t.projectName || "—"}</td>
                    <td>
                      <span className={`dash-badge ${t.priority?.toLowerCase()}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`dash-badge ${t.status?.toLowerCase().replace(/\s/g, "-")}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--dash-text-muted)" }}>
                      {t.dueDate || "—"}
                    </td>
                    <td>
                      <TaskStatusBtn task={t} onUpdate={refetch} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Team projects */}
      <div className="dash-panel">
        <div className="dash-panel-header">
          <span className="dash-panel-title">Team Projects</span>
        </div>
        <div className="dash-panel-body">
          {projects.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-desc">No team projects</div>
            </div>
          ) : (
            projects.map((p) => (
              <div key={p.id} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{p.name}</span>
                  <span className={`dash-badge ${p.status?.toLowerCase().replace(/\s/g, "-")}`}>
                    {p.status}
                  </span>
                </div>
                <div className="dash-progress">
                  <div className="dash-progress-bar" style={{ width: `${p.progress || 0}%` }} />
                </div>
                {p.nextStep && (
                  <div style={{ fontSize: "0.72rem", color: "var(--dash-accent)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <ArrowRight size={10} /> {p.nextStep}
                  </div>
                )}
                {p.deadline && (
                  <div style={{ fontSize: "0.7rem", color: "var(--dash-text-muted)", marginTop: 2 }}>
                    Deadline: {p.deadline}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardPage>
  );
}
