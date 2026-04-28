import React from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import Card from "../components/Card.jsx";
import { useAuth } from "../../hooks/useAuth.js";

const ROLE_LABELS = {
  admin:  "Owner / Admin",
  team:   "Team Member",
  client: "Client",
};

export default function SettingsPage() {
  const { user, role } = useAuth();

  const displayName  = user?.name  || "—";
  const displayEmail = user?.email || "—";
  const displayRole  = ROLE_LABELS[role] || role || "—";
  const joinedAt     = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <PageWrapper title="Settings" description="Account and workspace configuration.">
      <div className="gg-grid gg-grid-2">

        {/* Profile */}
        <Card title="Your Profile" subtitle="Account details from the system">
          <div className="gg-profile-row">
            <span className="gg-profile-label">Name</span>
            <span className="gg-profile-value">{displayName}</span>
          </div>
          <div className="gg-profile-row">
            <span className="gg-profile-label">Email</span>
            <span className="gg-profile-value">{displayEmail}</span>
          </div>
          <div className="gg-profile-row">
            <span className="gg-profile-label">Role</span>
            <span className="gg-profile-value">
              <span className={`gg-badge gg-badge--${role || "todo"}`}>{displayRole}</span>
            </span>
          </div>
          <div className="gg-profile-row">
            <span className="gg-profile-label">Joined</span>
            <span className="gg-profile-value">{joinedAt}</span>
          </div>
        </Card>

        {/* Business Info */}
        <Card title="Business Info" subtitle="GALE GRID agency details">
          <div className="gg-profile-row">
            <span className="gg-profile-label">Agency</span>
            <span className="gg-profile-value">GALE GRID</span>
          </div>
          <div className="gg-profile-row">
            <span className="gg-profile-label">Type</span>
            <span className="gg-profile-value">Web Design Agency</span>
          </div>
          <div className="gg-profile-row">
            <span className="gg-profile-label">System</span>
            <span className="gg-profile-value">GALE GRID OS v1.0</span>
          </div>
          <div className="gg-profile-row">
            <span className="gg-profile-label">Support</span>
            <span className="gg-profile-value">admin@galegrid.com</span>
          </div>
        </Card>

        {/* Coming soon placeholders */}
        <Card title="Security" subtitle="Password & access controls">
          <p className="gg-muted">Password change and two-factor authentication controls will be available in the next update.</p>
        </Card>

        <Card title="Team Members" subtitle="User management">
          <p className="gg-muted">Invite and manage team members and client accounts from here in the next phase.</p>
        </Card>

      </div>
    </PageWrapper>
  );
}
