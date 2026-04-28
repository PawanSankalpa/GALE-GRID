/**
 * client/src/admin/components/MessageThread.jsx
 * Engineering patterns: Optimistic UI, prevent double-send, lazy-loaded images,
 * auto-scroll to bottom, socket real-time updates.
 *
 * Props:
 *   projectId  - string
 *   currentUser - { id, role, name }
 *   socket     - socket.io-client instance (or null)
 *   onUnread   - callback() to refresh unread count
 */
import React, {
  useState, useEffect, useRef, useCallback, useLayoutEffect
} from "react";
import { Send, RefreshCw, File as FileIcon } from "lucide-react";
import apiClient from "../../services/apiClient";
import FileAttachButton from "./FileAttachButton";

// ─── Lazy image with IntersectionObserver ────────────────────────────────────
function LazyImage({ src, alt, className }) {
  const imgRef  = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.src = src;
        obs.disconnect();
      }
    }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      className={`${className} ${loaded ? "gg-img-loaded" : "gg-img-loading"}`}
      onLoad={() => setLoaded(true)}
    />
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────
function Bubble({ msg, isMine, onRetry }) {
  const isImage = msg.attachment?.mimeType?.startsWith("image/");
  const hasFile = msg.attachment && !isImage;

  return (
    <div
      className={`gg-bubble-wrap ${isMine ? "gg-bubble-mine" : "gg-bubble-theirs"}`}
      style={{ opacity: msg.pending ? 0.55 : 1 }}
    >
      {!isMine && <span className="gg-bubble-author">{msg.sender_name}</span>}

      {msg.type === "note" && (
        <span className="gg-bubble-badge">Internal note</span>
      )}

      {msg.content && (
        <p className="gg-bubble-text">{msg.content}</p>
      )}

      {isImage && (
        <LazyImage
          src={msg.attachment.url}
          alt={msg.attachment.filename}
          className="gg-bubble-img"
        />
      )}

      {hasFile && (
        <a
          href={msg.attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="gg-bubble-file"
        >
          <FileIcon size={14} />
          {msg.attachment.filename}
        </a>
      )}

      <span className="gg-bubble-time">
        {msg.pending
          ? "Sending…"
          : msg.error
            ? <button className="gg-retry-btn" onClick={() => onRetry(msg)}>
                <RefreshCw size={12} /> Retry
              </button>
            : new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator({ typingUsers }) {
  const names = Object.values(typingUsers);
  if (!names.length) return null;
  return (
    <div className="gg-typing-indicator">
      {names.join(", ")} {names.length === 1 ? "is" : "are"} typing
      <span className="gg-typing-dots"><span/><span/><span/></span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const PAGE_SIZE = 30;

export default function MessageThread({ projectId, currentUser, socket, onUnread }) {
  const [messages, setMessages]       = useState([]);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [text, setText]               = useState("");
  const [attachment, setAttachment]   = useState(null);   // { url, filename, mimeType, fileSize }
  const [sending, setSending]         = useState(false);  // prevent double-send
  const [typingUsers, setTypingUsers] = useState({});     // { userId: name }
  const bottomRef   = useRef(null);
  const listRef     = useRef(null);
  const typingTimer = useRef(null);

  // ── Load thread ──────────────────────────────────────────────────────────────
  const loadThread = useCallback(async (pageNum = 1, prepend = false) => {
    if (!projectId) return;
    try {
      setLoadingMore(true);
      const resp = await apiClient.get(
        `/api/comms/thread/${projectId}?page=${pageNum}&limit=${PAGE_SIZE}`
      );
      const incoming = resp.data.messages || [];
      setHasMore(incoming.length === PAGE_SIZE);

      setMessages((prev) => prepend ? [...incoming, ...prev] : incoming);

      // Mark thread read
      apiClient.put(`/api/comms/thread/${projectId}/read`).catch(() => {});
      onUnread?.();
    } catch (err) {
      console.error("[MessageThread] load error:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [projectId, onUnread]);

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(false);
    if (projectId) loadThread(1);
  }, [projectId, loadThread]);

  // ── Auto-scroll to bottom on new messages ────────────────────────────────────
  useLayoutEffect(() => {
    if (!listRef.current || !bottomRef.current) return;
    const list = listRef.current;
    const isNearBottom =
      list.scrollHeight - list.scrollTop - list.clientHeight < 150;
    if (isNearBottom) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ── Load more (older) messages ────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await loadThread(nextPage, true);
  }, [hasMore, loadingMore, page, loadThread]);

  // ── Socket: join/leave + listeners ────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !projectId) return;

    socket.emit("join_project", { projectId });

    function onNewMessage(msg) {
      // Avoid duplicate if we sent it ourselves (optimistic already added)
      setMessages((prev) => {
        const alreadyHas = prev.some((m) => m.id === msg.id);
        if (alreadyHas) {
          // Confirm the optimistic bubble
          return prev.map((m) => m._tempId && m.content === msg.content
            ? { ...msg, pending: false }
            : m
          );
        }
        return [...prev, msg];
      });
      // Clear typing for the sender
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[msg.user_id];
        return next;
      });
      apiClient.put(`/api/comms/thread/${projectId}/read`).catch(() => {});
      onUnread?.();
    }

    function onTyping({ userId, userName }) {
      setTypingUsers((prev) => ({ ...prev, [userId]: userName }));
    }
    function onStopTyping({ userId }) {
      setTypingUsers((prev) => { const n = { ...prev }; delete n[userId]; return n; });
    }

    socket.on("new_message",          onNewMessage);
    socket.on("user_typing",          onTyping);
    socket.on("user_stopped_typing",  onStopTyping);

    return () => {
      socket.emit("leave_project", { projectId });
      socket.off("new_message",         onNewMessage);
      socket.off("user_typing",          onTyping);
      socket.off("user_stopped_typing",  onStopTyping);
    };
  }, [socket, projectId, onUnread]);

  // ── Typing throttle ───────────────────────────────────────────────────────────
  function handleTextChange(e) {
    setText(e.target.value);
    if (!socket) return;
    socket.emit("typing_start", { projectId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("typing_stop", { projectId });
    }, 2000);
  }

  // ── Retry failed message ──────────────────────────────────────────────────────
  const handleRetry = useCallback(async (failedMsg) => {
    setMessages((prev) =>
      prev.map((m) => m._tempId === failedMsg._tempId ? { ...m, error: false, pending: true } : m)
    );
    try {
      const resp = await apiClient.post("/api/comms/send", {
        projectId,
        content:    failedMsg.content,
        type:       failedMsg.type || "message",
        attachment: failedMsg.attachment || null,
        clientMessageId: failedMsg._tempId,
      });
      const saved = resp.data.message;
      setMessages((prev) =>
        prev.map((m) => m._tempId === failedMsg._tempId ? { ...saved, pending: false } : m)
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) => m._tempId === failedMsg._tempId ? { ...m, pending: false, error: true } : m)
      );
    }
  }, [projectId]);

  // ── Send message (prevent double-send via `sending` flag) ─────────────────────
  async function handleSend() {
    const trimmed = text.trim();
    if ((!trimmed && !attachment) || sending) return;

    // Prevent double-send
    setSending(true);
    socket?.emit("typing_stop", { projectId });
    clearTimeout(typingTimer.current);

    const tempId   = `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const optimistic = {
      _tempId:    tempId,
      id:         tempId,
      project_id: projectId,
      user_id:    currentUser?.id,
      sender_name: currentUser?.name || "You",
      content:    trimmed,
      type:       currentUser?.role === "team" ? "message" : "message",
      attachment: attachment || null,
      created_at: new Date().toISOString(),
      pending:    true,
      error:      false,
    };

    // Optimistic UI: add immediately
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setAttachment(null);

    try {
      if (socket) {
        // Via socket for instant broadcast
        socket.emit("send_message", {
          projectId,
          content:         trimmed,
          type:            "message",
          attachment:      attachment || null,
          clientMessageId: tempId,
        });
        // Confirm optimistic after short delay (socket will confirm via new_message)
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) => m._tempId === tempId ? { ...m, pending: false } : m)
          );
        }, 2000);
      } else {
        // REST fallback
        const resp = await apiClient.post("/api/comms/send", {
          projectId,
          content:         trimmed,
          type:            "message",
          attachment:      attachment || null,
          clientMessageId: tempId,
        });
        const saved = resp.data.message;
        setMessages((prev) =>
          prev.map((m) => m._tempId === tempId ? { ...saved, pending: false } : m)
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) => m._tempId === tempId ? { ...m, pending: false, error: true } : m)
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!projectId) {
    return (
      <div className="gg-thread-empty">
        <p>Select a conversation to view messages.</p>
      </div>
    );
  }

  return (
    <div className="gg-thread-container">
      {/* Load more banner */}
      {hasMore && (
        <button
          className="gg-thread-load-more"
          onClick={loadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading…" : "Load older messages"}
        </button>
      )}

      {/* Message list */}
      <div className="gg-thread-list" ref={listRef}>
        {messages.map((msg) => (
          <Bubble
            key={msg._tempId || msg.id}
            msg={msg}
            isMine={msg.user_id === currentUser?.id}
            onRetry={handleRetry}
          />
        ))}
        <TypingIndicator typingUsers={typingUsers} />
        <div ref={bottomRef} />
      </div>

      {/* Compose bar */}
      <div className="gg-compose-bar">
        {attachment && (
          <div className="gg-compose-attachment">
            <FileIcon size={14} />
            <span>{attachment.filename}</span>
            <button
              type="button"
              className="gg-compose-attachment-remove"
              onClick={() => setAttachment(null)}
              aria-label="Remove attachment"
            >×</button>
          </div>
        )}

        <div className="gg-compose-row">
          <FileAttachButton
            projectId={projectId}
            onAttached={(a) => setAttachment(a)}
            disabled={sending}
          />
          <textarea
            className="gg-compose-input"
            placeholder="Write a message… (Enter to send)"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={sending}
          />
          <button
            type="button"
            className="gg-compose-send"
            onClick={handleSend}
            disabled={sending || (!text.trim() && !attachment)}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
