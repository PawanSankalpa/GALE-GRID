import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Mail,
} from "lucide-react";
import {
  DashboardPage,
  SkeletonPanel,
} from "../components/DashboardWidgets.jsx";
import { apiClient } from "../../../services/apiClient.js";
import { useAuth } from "../../../hooks/useAuth.js";

export default function MessagesSection() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  // Load projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await apiClient.get("/api/projects");
        const data = Array.isArray(res.data) ? res.data : [];
        setProjects(data);
        if (data.length > 0) setSelectedProjectId(data[0].id);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Load messages when project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    async function loadMessages() {
      try {
        const res = await apiClient.get(`/api/comms/messages?projectId=${selectedProjectId}`);
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch {
        setMessages([]);
      }
    }
    loadMessages();
  }, [selectedProjectId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProjectId) return;
    setSending(true);
    try {
      await apiClient.post("/api/comms/messages", {
        projectId: selectedProjectId,
        content: newMessage.trim(),
      });
      setNewMessage("");
      // Reload messages
      const res = await apiClient.get(`/api/comms/messages?projectId=${selectedProjectId}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardPage>
        <SkeletonPanel />
      </DashboardPage>
    );
  }

  return (
    <DashboardPage>
      <div className="dash-panel" style={{ minHeight: 500 }}>
        <div className="dash-panel-header">
          <span className="dash-panel-title">
            <MessageSquare size={16} style={{ marginRight: 8 }} />
            Project Messages
          </span>
          <Mail size={16} style={{ color: "var(--dash-text-muted)" }} />
        </div>
        <div className="dash-panel-body" style={{ padding: 0 }}>
          {projects.length === 0 ? (
            <div className="dash-empty" style={{ padding: 60 }}>
              <MessageSquare size={36} className="dash-empty-icon" />
              <div className="dash-empty-title">No Projects</div>
              <div className="dash-empty-desc">Messages are scoped to projects.</div>
            </div>
          ) : (
            <div className="dash-messages-layout">
              {/* Project selector sidebar */}
              <div className="dash-messages-sidebar">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    className={`dash-messages-project${selectedProjectId === p.id ? " active" : ""}`}
                    onClick={() => setSelectedProjectId(p.id)}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>{p.name}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--dash-text-muted)" }}>{p.status}</span>
                  </button>
                ))}
              </div>

              {/* Messages panel */}
              <div className="dash-messages-main">
                <div className="dash-messages-list" ref={listRef}>
                  {messages.length === 0 ? (
                    <div className="dash-empty" style={{ padding: 40 }}>
                      <div className="dash-empty-desc">No messages yet. Start the conversation!</div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`dash-message${msg.senderId === user?.id ? " own" : ""}`}
                      >
                        <div className="dash-message-header">
                          <span className="dash-message-sender">{msg.senderId === user?.id ? "You" : msg.senderId}</span>
                          <span className="dash-message-time">
                            {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="dash-message-content">{msg.content}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Compose */}
                <form className="dash-messages-compose" onSubmit={handleSend}>
                  <input
                    className="dash-input"
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    maxLength={500}
                  />
                  <button className="dash-btn-accent" type="submit" disabled={sending || !newMessage.trim()}>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardPage>
  );
}
