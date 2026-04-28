import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { Bell, X, MessageSquare, FileText, CreditCard, CheckCircle2 } from "lucide-react";
import apiClient from "../../services/apiClient.js";

const TYPE_META = {
  message:  { icon: MessageSquare, cls: "gg-notif--message",  label: "Message" },
  request:  { icon: FileText,      cls: "gg-notif--request",  label: "Request" },
  payment:  { icon: CreditCard,    cls: "gg-notif--payment",  label: "Payment" },
  system:   { icon: CheckCircle2,  cls: "gg-notif--system",   label: "System" },
};

function relativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Panel ───────────────────────────────────────────────────
export function NotificationsPanel({ open, onClose, onCountChange }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const panelRef    = useRef(null);
  const navigate    = useNavigate();

  const fetchData = useCallback(() => {
    if (!open) return;
    setLoading(true);
    apiClient.get("/api/notifications")
      .then((res) => {
        const notifs = res.data.notifications || [];
        setItems(notifs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Report unread count upward for badge
  useEffect(() => {
    const unread = items.filter((n) => !n.is_read).length;
    onCountChange?.(unread);
  }, [items, onCountChange]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Debounced mark-all-read (500 ms)
  const markAllRead = () => {
    // Optimistic UI
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      apiClient.put("/api/notifications/read-all").catch(() => fetchData());
    }, 500);
  };

  const handleClick = (item) => {
    // Optimistic mark read
    setItems((prev) => prev.map((n) => n.id === item.id ? { ...n, is_read: true } : n));
    apiClient.put(`/api/notifications/${item.id}/read`).catch(() => {});
    navigate(item.link || "/admin");
    onClose();
  };

  const unreadCount = items.filter((n) => !n.is_read).length;

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="gg-notif-panel" ref={panelRef} role="dialog" aria-label="Notifications">
      <div className="gg-notif-header">
        <div>
          <h3 className="gg-notif-title">Notifications</h3>
          {unreadCount > 0 && (
            <span className="gg-notif-unread-label">{unreadCount} unread</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {unreadCount > 0 && (
            <button className="gg-notif-mark-all" onClick={markAllRead}>
              Mark all read
            </button>
          )}
          <button className="gg-notif-close" onClick={onClose} aria-label="Close notifications">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="gg-notif-list">
        {loading && (
          <div className="gg-notif-empty">Loading…</div>
        )}
        {!loading && items.length === 0 && (
          <div className="gg-notif-empty">
            <CheckCircle2 size={28} style={{ color: "var(--gg-text-muted)", opacity: 0.4 }} />
            <p>You&rsquo;re all caught up!</p>
          </div>
        )}
        {!loading && items.map((item) => {
          const meta = TYPE_META[item.type] || TYPE_META.system;
          const Icon = meta.icon;
          const isRead = item.is_read;
          return (
            <button
              key={item.id}
              className={`gg-notif-item${isRead ? " is-read" : ""}`}
              onClick={() => handleClick(item)}
            >
              <span className={`gg-notif-icon ${meta.cls}`}><Icon size={14} /></span>
              <div className="gg-notif-body">
                <p className="gg-notif-item-title">{item.title}</p>
                <p className="gg-notif-item-body">{item.body || item.message}</p>
                <p className="gg-notif-item-time">{relativeTime(item.created_at || item.time)}</p>
              </div>
              {!isRead && <span className="gg-notif-dot" aria-label="Unread" />}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}

// ─── Bell Button (used in Navbar) ────────────────────────────
export function BellButton({ count, onClick }) {
  return (
    <button className="gg-bell-btn" onClick={onClick} aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}>
      <Bell size={17} />
      {count > 0 && <span className="gg-bell-badge">{count > 9 ? "9+" : count}</span>}
    </button>
  );
}
