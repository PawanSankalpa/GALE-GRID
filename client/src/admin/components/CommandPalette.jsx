import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Users, Users2, Briefcase, CreditCard,
  RefreshCw, Settings, Search, ArrowRight, Clock, Zap,
  CheckSquare, Inbox, DollarSign, BarChart2, FolderOpen, Award,
} from "lucide-react";

// ─── Static command registry ─────────────────────────────────
const NAV_COMMANDS = [
  { id: "nav-dashboard",      label: "Dashboard",       category: "Navigate", icon: LayoutDashboard, to: "/admin" },
  { id: "nav-bookings",       label: "Bookings",        category: "Navigate", icon: Calendar,        to: "/admin/bookings" },
  { id: "nav-leads",          label: "Leads",           category: "Navigate", icon: Users,           to: "/admin/leads" },
  { id: "nav-clients",        label: "Clients",         category: "Navigate", icon: Users,           to: "/admin/clients" },
  { id: "nav-projects",       label: "Projects",        category: "Navigate", icon: Briefcase,       to: "/admin/projects" },
  { id: "nav-payments",       label: "Payments",        category: "Navigate", icon: CreditCard,      to: "/admin/payments" },
  { id: "nav-subscriptions",  label: "Subscriptions",   category: "Navigate", icon: RefreshCw,       to: "/admin/subscriptions" },
  { id: "nav-tasks",          label: "Tasks",           category: "Navigate", icon: CheckSquare,     to: "/admin/tasks" },
  { id: "nav-team",           label: "Team",            category: "Navigate", icon: Users2,          to: "/admin/team" },
  { id: "nav-inbox",          label: "Inbox",           category: "Navigate", icon: Inbox,           to: "/admin/inbox" },
  { id: "nav-finance",        label: "Finance",         category: "Navigate", icon: DollarSign,      to: "/admin/finance" },
  { id: "nav-analytics",      label: "Analytics",       category: "Navigate", icon: BarChart2,       to: "/admin/analytics" },
  { id: "nav-files",          label: "Files",           category: "Navigate", icon: FolderOpen,      to: "/admin/files" },
  { id: "nav-partners",       label: "Partners",        category: "Navigate", icon: Award,           to: "/admin/partners" },
  { id: "nav-settings",       label: "Settings",        category: "Navigate", icon: Settings,        to: "/admin/settings" },
];

const ACTION_COMMANDS = [
  { id: "action-add-lead",    label: "Add Lead",        category: "Action",   icon: Zap,             to: "/admin/leads" },
  { id: "action-add-client",  label: "Add Client",      category: "Action",   icon: Zap,             to: "/admin/clients" },
  { id: "action-payments",    label: "View Payments",   category: "Action",   icon: Zap,             to: "/admin/payments" },
];

const ALL_COMMANDS = [...NAV_COMMANDS, ...ACTION_COMMANDS];

const HISTORY_KEY = "gg_cmd_history";
const MAX_HISTORY = 5;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
  catch { return []; }
}

function saveHistory(id) {
  const prev = loadHistory().filter((h) => h !== id);
  const next = [id, ...prev].slice(0, MAX_HISTORY);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
}

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="gg-cmd-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Component ───────────────────────────────────────────────
export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [history, setHistory] = useState(loadHistory);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      // Show recently used first, then all nav commands
      const histCmds = history
        .map((id) => ALL_COMMANDS.find((c) => c.id === id))
        .filter(Boolean);
      const rest = ALL_COMMANDS.filter((c) => !history.includes(c.id));
      return [...histCmds, ...rest];
    }
    const q = query.toLowerCase();
    return ALL_COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [query, history]);

  // Keep activeIdx in bounds
  useEffect(() => {
    setActiveIdx((prev) => Math.min(prev, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx];
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const execute = useCallback((cmd) => {
    saveHistory(cmd.id);
    setHistory(loadHistory());
    navigate(cmd.to);
    onClose();
  }, [navigate, onClose]);

  const handleKey = useCallback((e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIdx]) execute(filtered[activeIdx]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [filtered, activeIdx, execute, onClose]);

  if (!open) return null;

  const showHistory = !query.trim() && history.length > 0;
  const historyIds = new Set(history);

  return ReactDOM.createPortal(
    <div className="gg-cmd-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gg-cmd-modal" role="dialog" aria-modal="true" aria-label="Command palette">

        {/* Search input */}
        <div className="gg-cmd-search-row">
          <Search size={16} className="gg-cmd-search-icon" aria-hidden />
          <input
            ref={inputRef}
            className="gg-cmd-input"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={handleKey}
            placeholder="Search pages and actions…"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="gg-cmd-esc-hint">ESC</kbd>
        </div>

        {/* Results */}
        <div className="gg-cmd-results" ref={listRef} role="listbox">
          {filtered.length === 0 && (
            <div className="gg-cmd-empty">No results for &ldquo;{query}&rdquo;</div>
          )}

          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            const isHistory = showHistory && historyIds.has(cmd.id);
            return (
              <div
                key={cmd.id}
                className={`gg-cmd-item${i === activeIdx ? " is-active" : ""}`}
                role="option"
                aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseDown={() => execute(cmd)}
              >
                <span className={`gg-cmd-item-icon gg-cmd-item-icon--${cmd.category === "Action" ? "action" : "nav"}`}>
                  <Icon size={15} />
                </span>
                <span className="gg-cmd-item-label">
                  {highlight(cmd.label, query)}
                </span>
                {isHistory && (
                  <span className="gg-cmd-item-badge">
                    <Clock size={11} /> recent
                  </span>
                )}
                {!isHistory && (
                  <span className="gg-cmd-item-category">{cmd.category}</span>
                )}
                <ArrowRight size={13} className="gg-cmd-item-arrow" aria-hidden />
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="gg-cmd-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
