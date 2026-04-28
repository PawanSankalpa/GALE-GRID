import React, { useState, useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Shield,
  Users,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Menu,
  Home,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth.js";

const NAV_ITEMS = [
  {
    label: "Navigation",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, text: "Overview", end: true, roles: ["admin", "team", "client"] },
      { to: "/dashboard/admin", icon: Shield, text: "Admin Panel", roles: ["admin"] },
      { to: "/dashboard/team", icon: Users, text: "Team Hub", roles: ["admin", "team"] },
      { to: "/dashboard/client", icon: FolderKanban, text: "My Projects", roles: ["admin", "client"] },
    ],
  },
  {
    label: "Business",
    items: [
      { to: "/dashboard/payments", icon: CreditCard, text: "Payments", roles: ["admin"] },
      { to: "/dashboard/messages", icon: MessageSquare, text: "Messages", roles: ["admin", "client"] },
    ],
  },
];

function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GG";

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <motion.aside
        className={`dash-sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}
        initial={false}
      >
        {/* Brand */}
        <div className="dash-sidebar-brand">
          <div className="brand-icon">GG</div>
          <span className="brand-text">GALE GRID</span>
        </div>

        {/* Collapse toggle */}
        <button
          className="dash-sidebar-toggle"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Nav links */}
        <nav className="dash-sidebar-nav">
          {NAV_ITEMS.map((group) => (
            <React.Fragment key={group.label}>
              <div className="dash-nav-label">{group.label}</div>
              {group.items
                .filter((item) => item.roles.includes(role))
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `dash-nav-link${isActive ? " active" : ""}`}
                    onClick={closeMobile}
                  >
                    <span className="nav-icon">
                      <item.icon size={18} />
                    </span>
                    <span className="nav-text">{item.text}</span>
                  </NavLink>
                ))}
            </React.Fragment>
          ))}
        </nav>

        {/* User card */}
        <div className="dash-sidebar-footer">
          <div className="dash-user-card">
            <div className="dash-user-avatar">{initials}</div>
            <div className="dash-user-info">
              <div className="dash-user-name">{user?.name || "User"}</div>
              <div className="dash-user-role">{role}</div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="dash-sidebar-overlay" onClick={closeMobile} />}

      {/* Main area */}
      <main className={`dash-main`}>
        {/* Header */}
        <header className="dash-header">
          <div className="dash-header-left">
            <button
              className="dash-mobile-menu-btn"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
            <h1 className="dash-header-title">Dashboard</h1>
          </div>

          <div className="dash-header-right">
            <button
              className="dash-header-btn"
              onClick={() => navigate("/")}
              title="Back to site"
            >
              <Home size={16} />
            </button>
            <button className="dash-header-btn" title="Notifications">
              <Bell size={16} />
            </button>
            <button className="dash-logout-btn" onClick={handleLogout}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page content - Outlet renders child routes */}
        <div className="dash-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
