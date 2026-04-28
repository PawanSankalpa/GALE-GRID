/**
 * client/src/admin/pages/InboxPage.jsx
 * Admin / Team inbox — shows all project conversations + thread.
 * Engineering patterns:
 *   - Debounced search (300 ms)
 *   - Lazy loading (pagination via communicationService)
 *   - Real-time via socket (useSocket hook)
 *   - Access control: admin sees all, team sees assigned, client redirected
 */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, MessageSquare, Loader2 } from "lucide-react";
import apiClient from "../../services/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import MessageThread from "../components/MessageThread";

const PAGE_SIZE = 20;

function ConversationItem({ conv, isActive, onClick }) {
  const unread = conv.unread_count > 0;
  return (
    <button
      type="button"
      className={`gg-inbox-item ${isActive ? "gg-inbox-item-active" : ""} ${unread ? "gg-inbox-item-unread" : ""}`}
      onClick={() => onClick(conv)}
    >
      <div className="gg-inbox-item-header">
        <span className="gg-inbox-item-title">{conv.project_name}</span>
        {unread && (
          <span className="gg-inbox-unread-badge">{conv.unread_count}</span>
        )}
      </div>
      <div className="gg-inbox-item-meta">
        <span className="gg-inbox-item-client">{conv.client_name}</span>
        {conv.last_message && (
          <span className="gg-inbox-item-preview">{conv.last_message}</span>
        )}
      </div>
    </button>
  );
}

export default function InboxPage() {
  const { projectId: routeProjectId } = useParams();
  const navigate   = useNavigate();
  const { user, token } = useAuth();

  const [conversations,  setConversations]  = useState([]);
  const [filteredConvs,  setFilteredConvs]  = useState([]);
  const [searchRaw,      setSearchRaw]      = useState("");
  const [activeProjectId, setActiveProjectId] = useState(routeProjectId || null);
  const [page,           setPage]           = useState(1);
  const [hasMore,        setHasMore]        = useState(false);
  const [loading,        setLoading]        = useState(false);

  const debounceRef = useRef(null);
  const { socket } = useSocket(token);

  // ── Load conversations ─────────────────────────────────────────────────────
  const loadConversations = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const resp = await apiClient.get(
        `/api/comms/conversations?page=${pageNum}&limit=${PAGE_SIZE}`
      );
      const items = resp.data.conversations || [];
      setHasMore(items.length === PAGE_SIZE);
      setConversations((prev) => append ? [...prev, ...items] : items);
      setFilteredConvs((prev) => append ? [...prev, ...items] : items);
    } catch (err) {
      console.error("[InboxPage] load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadConversations(1); }, [loadConversations]);

  // Sync active project from URL param
  useEffect(() => {
    if (routeProjectId) setActiveProjectId(routeProjectId);
  }, [routeProjectId]);

  // ── Debounced search (300 ms) ──────────────────────────────────────────────
  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchRaw(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = val.trim().toLowerCase();
      if (!q) {
        setFilteredConvs(conversations);
        return;
      }
      setFilteredConvs(
        conversations.filter(
          (c) =>
            c.project_name?.toLowerCase().includes(q) ||
            c.client_name?.toLowerCase().includes(q)
        )
      );
    }, 300);
  }

  // ── Select conversation ────────────────────────────────────────────────────
  function handleSelectConv(conv) {
    setActiveProjectId(conv.project_id);
    navigate(`/admin/inbox/${conv.project_id}`, { replace: true });
    // Optimistically clear unread in sidebar
    setConversations((prev) =>
      prev.map((c) =>
        c.project_id === conv.project_id ? { ...c, unread_count: 0 } : c
      )
    );
    setFilteredConvs((prev) =>
      prev.map((c) =>
        c.project_id === conv.project_id ? { ...c, unread_count: 0 } : c
      )
    );
  }

  // ── Refresh unread counts after MessageThread marks read ───────────────────
  const handleUnreadRefresh = useCallback(() => {
    loadConversations(1);
  }, [loadConversations]);

  // ── Socket: listen for incoming messages to bump unread badges ─────────────
  useEffect(() => {
    if (!socket) return;
    function onUnreadMessage({ projectId, senderName }) {
      if (projectId === activeProjectId) return; // already viewing this thread
      setConversations((prev) =>
        prev.map((c) =>
          c.project_id === projectId
            ? { ...c, unread_count: (c.unread_count || 0) + 1 }
            : c
        )
      );
      setFilteredConvs((prev) =>
        prev.map((c) =>
          c.project_id === projectId
            ? { ...c, unread_count: (c.unread_count || 0) + 1 }
            : c
        )
      );
    }
    socket.on("unread_message", onUnreadMessage);
    return () => socket.off("unread_message", onUnreadMessage);
  }, [socket, activeProjectId]);

  return (
    <div className="gg-inbox-layout">
      {/* Sidebar ─── */}
      <aside className="gg-inbox-sidebar">
        <div className="gg-inbox-sidebar-header">
          <MessageSquare size={18} />
          <h2 className="gg-inbox-sidebar-title">Inbox</h2>
        </div>

        <div className="gg-inbox-search-wrap">
          <Search size={14} className="gg-inbox-search-icon" />
          <input
            type="search"
            className="gg-inbox-search"
            placeholder="Search conversations…"
            value={searchRaw}
            onChange={handleSearchChange}
          />
        </div>

        <div className="gg-inbox-list">
          {loading && page === 1 ? (
            <div className="gg-inbox-loading">
              <Loader2 size={20} className="gg-spin" />
            </div>
          ) : filteredConvs.length === 0 ? (
            <p className="gg-inbox-empty">No conversations found.</p>
          ) : (
            filteredConvs.map((conv) => (
              <ConversationItem
                key={conv.project_id}
                conv={conv}
                isActive={activeProjectId === conv.project_id}
                onClick={handleSelectConv}
              />
            ))
          )}

          {hasMore && !loading && (
            <button
              className="gg-inbox-load-more"
              onClick={() => {
                const next = page + 1;
                setPage(next);
                loadConversations(next, true);
              }}
            >
              Load more
            </button>
          )}
        </div>
      </aside>

      {/* Thread ─── */}
      <main className="gg-inbox-main">
        <MessageThread
          projectId={activeProjectId}
          currentUser={user}
          socket={socket}
          onUnread={handleUnreadRefresh}
        />
      </main>
    </div>
  );
}
