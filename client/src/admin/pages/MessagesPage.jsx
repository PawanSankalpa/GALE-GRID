import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper.jsx";
import apiClient from "../../services/apiClient.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useSocket } from "../../hooks/useSocket.js";
import MessageThread from "../components/MessageThread.jsx";

/**
 * MessagesPage
 * - Admin/Team → now redirects to the full InboxPage at /admin/inbox
 * - Client     → shows a lightweight project-thread view using MessageThread + socket
 */

function ClientMessagesView({ user, token }) {
  const [projects, setProjects]           = useState([]);
  const [activeProjectId, setActiveProject] = useState(null);
  const { socket } = useSocket(token);

  useEffect(() => {
    apiClient.get("/api/dashboard/client")
      .then((res) => {
        const projs = res.data.projects || [];
        setProjects(projs);
        if (projs.length) setActiveProject(projs[0].id);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="cp-chat-wrap">
      {/* Sidebar */}
      <div className="cp-chat-sidebar">
        <div className="cp-chat-sidebar-head">Conversations</div>
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`cp-chat-project-item${activeProjectId === p.id ? " is-active" : ""}`}
            onClick={() => setActiveProject(p.id)}
          >
            <div className="cp-chat-proj-avatar">
              {p.name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <p className="cp-chat-proj-name">{p.name}</p>
              <p className="cp-chat-proj-status">{p.status}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Thread */}
      <div className="cp-chat-thread">
        <MessageThread
          projectId={activeProjectId}
          currentUser={user}
          socket={socket}
          onUnread={null}
        />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const { user, role, token } = useAuth();

  // Admin and team members now use the full InboxPage
  if (role === "admin" || role === "team") {
    return <Navigate to="/admin/inbox" replace />;
  }

  // Client portal messaging
  return (
    <PageWrapper title="Messages" description="Direct communication with your project team.">
      <div style={{ height: "calc(100vh - 120px)", minHeight: 500 }}>
        <ClientMessagesView user={user} token={token} />
      </div>
    </PageWrapper>
  );
}
