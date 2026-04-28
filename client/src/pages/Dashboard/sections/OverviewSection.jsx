import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  FolderKanban,
  Users,
  Clock,
  Activity,
  TrendingUp,
  UserCheck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import useDashboardData from "../hooks/useDashboardData.js";
import StatCard, {
  DashboardPage,
  SkeletonStats,
  SkeletonPanel,
} from "../components/DashboardWidgets.jsx";
import { useAuth } from "../../../hooks/useAuth.js";

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const STAGE_COLORS = {
  lead: "#60a5fa",
  onboarding: "#a78bfa",
  active: "#34d399",
  delivered: "#ff8c00",
  subscription: "#f472b6",
};

export default function OverviewSection() {
  const { data, loading, error } = useDashboardData("/api/dashboard/overview");
  const { role } = useAuth();

  if (error) {
    return (
      <DashboardPage>
        <div className="dash-empty">
          <div className="dash-empty-title">Failed to load overview</div>
          <div className="dash-empty-desc">{error}</div>
        </div>
      </DashboardPage>
    );
  }

  if (loading || !data) {
    return (
      <DashboardPage>
        <SkeletonStats count={4} />
        <div className="dash-grid-2">
          <SkeletonPanel />
          <SkeletonPanel />
        </div>
      </DashboardPage>
    );
  }

  const stats = data.stats || {};
  const recentActivity = data.recentActivity || [];
  const projects = data.projects || [];
  const lifecycle = data.lifecycle || {};

  return (
    <DashboardPage>
      {/* Stats row */}
      <motion.div className="dash-stats-grid" variants={stagger} initial="initial" animate="animate">
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          value={stats.totalProjects ?? 0}
          color="orange"
        />
        <StatCard
          icon={Users}
          label="Team Members"
          value={stats.teamMembers ?? 0}
          color="blue"
        />
        <StatCard
          icon={BarChart3}
          label="Active Tasks"
          value={stats.activeTasks ?? 0}
          color="green"
        />
        {role === "admin" ? (
          <StatCard
            icon={UserCheck}
            label="Total Clients"
            value={stats.totalClients ?? 0}
            color="purple"
          />
        ) : (
          <StatCard
            icon={Clock}
            label="Pending Reviews"
            value={stats.pendingReviews ?? 0}
            color="purple"
          />
        )}
      </motion.div>

      {/* Client Lifecycle Pipeline — Admin only */}
      {role === "admin" && (
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span className="dash-panel-title">Client Pipeline</span>
            <CreditCard size={16} style={{ color: "var(--dash-text-muted)" }} />
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
      )}

      {/* Two-column body */}
      <div className="dash-grid-2">
        {/* Recent activity */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span className="dash-panel-title">Recent Activity</span>
            <Activity size={16} style={{ color: "var(--dash-text-muted)" }} />
          </div>
          <div className="dash-panel-body">
            {recentActivity.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-desc">No recent activity</div>
              </div>
            ) : (
              recentActivity.map((item, idx) => (
                <div className="dash-activity-item" key={idx}>
                  <div className="dash-activity-dot" />
                  <div>
                    <div className="dash-activity-text">
                      <strong>{item.user}</strong> {item.action}
                    </div>
                    <div className="dash-activity-time">
                      {new Date(item.time).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Projects summary */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span className="dash-panel-title">Projects</span>
            <TrendingUp size={16} style={{ color: "var(--dash-text-muted)" }} />
          </div>
          <div className="dash-panel-body">
            {projects.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-desc">No projects yet</div>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{project.name}</span>
                    <span className={`dash-badge ${project.status?.toLowerCase().replace(/\s/g, "-")}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="dash-progress">
                    <div
                      className="dash-progress-bar"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                  {project.nextStep && (
                    <div style={{ fontSize: "0.72rem", color: "var(--dash-accent)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      <ArrowRight size={10} /> {project.nextStep}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
