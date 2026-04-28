/**
 * client/src/portals/partner/PartnerLayout.jsx
 * Partner portal shell — sidebar, topbar, outlet.
 */
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "./partner-shell.css";
import {
  LayoutDashboard, Users, DollarSign, BookOpen,
  LogOut, Menu, X, ChevronLeft,
} from "lucide-react";

const NAV = [
  { label: "Dashboard",  to: "/partner",          Icon: LayoutDashboard, end: true },
  { label: "My Leads",   to: "/partner/leads",     Icon: Users },
  { label: "Earnings",   to: "/partner/earnings",  Icon: DollarSign },
  { label: "Resources",  to: "/partner/resources", Icon: BookOpen },
];

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default function PartnerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed]   = useState(false);

  const displayName = user?.name || user?.email?.split("@")[0] || "Partner";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="pp-shell">
      {/* ── Mobile overlay ────────────────────────────────── */}
      {mobileOpen && (
        <button className="pp-overlay" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
      )}

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className={`pp-sidebar${collapsed ? " pp-sidebar--collapsed" : ""}${mobileOpen ? " pp-sidebar--open" : ""}`}>
        <div className="pp-sidebar-brand">
          <div className="pp-brand-mark">GG</div>
          {!collapsed && (
            <div className="pp-brand-text-wrap">
              <span className="pp-brand-name">GALE GRID</span>
              <small className="pp-brand-sub">Partner Portal</small>
            </div>
          )}
        </div>

        <nav className="pp-nav">
          {NAV.map(({ label, to, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `pp-nav-item${isActive ? " pp-nav-item--active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} className="pp-nav-icon" />
              {!collapsed && <span className="pp-nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="pp-sidebar-footer">
          {!collapsed && (
            <div className="pp-user-info">
              <div className="pp-user-avatar">{initials(displayName)}</div>
              <div className="pp-user-text">
                <p className="pp-user-name">{displayName}</p>
                <p className="pp-user-role">Partner</p>
              </div>
            </div>
          )}
          <button className="pp-logout-btn" onClick={handleLogout} title="Log out">
            <LogOut size={16} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>

        <button
          className="pp-collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={14} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
      </aside>

      {/* ── Main shell ────────────────────────────────────── */}
      <div className="pp-main">
        {/* Mobile topbar */}
        <header className="pp-topbar">
          <button className="pp-hamburger" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="pp-topbar-brand">GALE GRID Partner</span>
          <div className="pp-topbar-avatar">{initials(displayName)}</div>
        </header>

        {/* Page content */}
        <main className="pp-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
