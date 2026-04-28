import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import { ToastProvider } from "../components/Toast.jsx";
import CommandPalette from "../components/CommandPalette.jsx";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ToastProvider>
      <div className="gg-shell">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        />

        <div className={`gg-main ${collapsed ? "is-collapsed" : ""}`.trim()}>
          <Navbar
            onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
            onOpenCmd={openCmd}
          />

          <main className="gg-content">
            <div className="gg-content-inner">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <CommandPalette open={cmdOpen} onClose={closeCmd} />
    </ToastProvider>
  );
}
