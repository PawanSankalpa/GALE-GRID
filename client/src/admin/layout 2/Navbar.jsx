import React, { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Search, LogOut, ChevronDown } from "lucide-react";
import { BellButton, NotificationsPanel } from "../components/NotificationsPanel.jsx";

const pageTitleByPath = {
  "/admin":               "Dashboard",
  "/admin/bookings":      "Bookings",
  "/admin/leads":         "Leads",
  "/admin/clients":       "Clients",
  "/admin/projects":      "Projects",
  "/admin/payments":      "Payments",
  "/admin/subscriptions": "Subscriptions",
  "/admin/settings":      "Settings",
  "/admin/tasks":         "My Tasks",
  "/admin/messages":      "Messages",
  "/admin/inbox":         "Inbox",
  "/admin/team":          "Team",
  "/admin/finance":       "Finance",
  "/admin/analytics":     "Analytics",
  "/admin/files":         "Files",
  "/admin/partners":      "Partners",
};

const roleTitles = { admin: "Dashboard", team: "Overview", client: "My Portal" };

function getPageTitle(pathname, role) {
  if (pageTitleByPath[pathname]) return pageTitleByPath[pathname];
  if (pathname === "/admin") return roleTitles[role] || "Dashboard";
  return "Admin";
}

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default function Navbar({ onToggleMobileMenu, onOpenCmd }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const title = getPageTitle(location.pathname, role);

  const [notifOpen, setNotifOpen]     = useState(false);
  const [notifCount, setNotifCount]   = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const roleLabel   = role === "admin" ? "Owner" : role === "team" ? "Team" : "Client";
  const isMac       = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);
  const cmdHint     = isMac ? "⌘K" : "Ctrl K";

  const handleNotifCount = useCallback((n) => setNotifCount(n), []);

  return (
    <>
      <header className="gg-navbar">
        <div className="gg-navbar-left">
          <button className="gg-mobile-menu-btn" onClick={onToggleMobileMenu} aria-label="Open sidebar menu">
            <span /><span /><span />
          </button>
          <div className="gg-navbar-brand">GALE GRID</div>
          <h2 className="gg-navbar-title">{title}</h2>
        </div>

        <div className="gg-navbar-right">
          {/* ⌘K search trigger */}
          <button className="gg-cmd-trigger" onClick={onOpenCmd} aria-label="Open command palette">
            <Search size={14} className="gg-cmd-trigger-icon" />
            <span className="gg-cmd-trigger-text">Search…</span>
            <kbd className="gg-cmd-trigger-kbd">{cmdHint}</kbd>
          </button>

          {/* Bell */}
          <BellButton count={notifCount} onClick={() => setNotifOpen((p) => !p)} />

          {/* User avatar + dropdown */}
          <div className="gg-user-menu-wrap" ref={userMenuRef}>
            <button
              className="gg-user-btn"
              onClick={() => setUserMenuOpen((p) => !p)}
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
            >
              <span className="gg-user-avatar">{initials(displayName)}</span>
              <span className="gg-user-name">{displayName}</span>
              <ChevronDown size={13} className="gg-user-chevron" />
            </button>

            {userMenuOpen && (
              <div className="gg-user-dropdown" role="menu">
                <div className="gg-user-dropdown-info">
                  <p className="gg-user-dropdown-name">{displayName}</p>
                  <p className="gg-user-dropdown-role">{roleLabel}</p>
                </div>
                <hr className="gg-user-dropdown-divider" />
                <button
                  className="gg-user-dropdown-item gg-user-dropdown-item--danger"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NotificationsPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onCountChange={handleNotifCount}
      />
    </>
  );
}
