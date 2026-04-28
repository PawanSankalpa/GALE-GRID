import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import {
  LayoutDashboard, Calendar, Users, Users2, Briefcase, DollarSign,
  CreditCard, Settings, CheckSquare, MessageSquare, Globe,
  ChevronLeft, ChevronRight, FileText, Inbox,
  BarChart2, FolderOpen, Award,
} from "lucide-react";

const NAV_BY_ROLE = {
  admin: [
    { label: "Dashboard",     to: "/admin",               Icon: LayoutDashboard, end: true },
    { label: "Bookings",      to: "/admin/bookings",       Icon: Calendar },
    { label: "Leads",         to: "/admin/leads",          Icon: Users },
    { label: "Clients",       to: "/admin/clients",        Icon: Briefcase },
    { label: "Projects",      to: "/admin/projects",       Icon: Globe },
    { label: "Finance",       to: "/admin/finance",        Icon: DollarSign },
    { label: "Analytics",     to: "/admin/analytics",      Icon: BarChart2 },
    { label: "Files",         to: "/admin/files",          Icon: FolderOpen },
    { label: "Partners",      to: "/admin/partners",       Icon: Award },
    { label: "Team",          to: "/admin/team",           Icon: Users2 },
    { label: "Inbox",         to: "/admin/inbox",          Icon: Inbox },
    { label: "Settings",      to: "/admin/settings",       Icon: Settings },
  ],
  team: [
    { label: "Overview",  to: "/admin",          Icon: LayoutDashboard, end: true },
    { label: "My Tasks",  to: "/admin/tasks",     Icon: CheckSquare },
    { label: "Projects",  to: "/admin/projects",  Icon: Globe },
    { label: "Inbox",     to: "/admin/inbox",     Icon: Inbox },
  ],
  client: [
    { label: "My Portal",   to: "/admin",            Icon: LayoutDashboard, end: true },
    { label: "My Projects", to: "/admin/projects",   Icon: Globe },
    { label: "Messages",    to: "/admin/messages",   Icon: MessageSquare },
    { label: "Requests",    to: "/admin/tasks",      Icon: FileText },
    { label: "Billing",     to: "/admin/payments",   Icon: CreditCard },
  ],
};

const ROLE_LABELS = {
  admin: "Admin OS",
  team: "Team Hub",
  client: "Client Portal",
};

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapsed }) {
  const { role } = useAuth();
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.admin;
  const subtext = ROLE_LABELS[role] || "Admin OS";

  return (
    <>
      {mobileOpen && <button className="gg-sidebar-overlay" onClick={onCloseMobile} aria-label="Close menu" />}
      <aside className={`gg-sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-open" : ""}`.trim()}>
        <div className="gg-sidebar-brand">
          <span className="gg-brand-mark">GG</span>
          <div className="gg-brand-text-wrap">
            <span className="gg-brand-text">GALE GRID</span>
            <small className="gg-brand-subtext">{subtext}</small>
          </div>
        </div>

        <button className="gg-sidebar-collapse" onClick={onToggleCollapsed} aria-label="Toggle sidebar width">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <nav className="gg-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) => `gg-nav-link ${isActive ? "is-active" : ""}`.trim()}
            >
              <span className="gg-nav-icon" aria-hidden="true">
                <item.Icon size={15} strokeWidth={1.8} />
              </span>
              <span className="gg-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
