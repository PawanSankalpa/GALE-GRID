import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import Card from "../components/Card.jsx";
import { apiClient } from "../../services/apiClient.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../components/Toast.jsx";
import { ChevronDown, Check } from "lucide-react";

const REQ_TYPES = ["change", "approval", "bug", "feature"];
const REQ_TYPE_LABELS = { change: "Change Request", approval: "Approval", bug: "Bug Report", feature: "Feature Request" };
const PLACEHOLDERS = {
  change: "Describe the change you'd like to make, e.g. 'Update the hero headline copy to...'",
  approval: "Describe what you're approving, e.g. 'Approve the homepage design v3 mockup'",
  bug: "Please describe the bug: what happened, what you expected, and steps to reproduce",
  feature: "Describe the new feature or functionality you'd like added to the project",
};

const FILTER_TABS = ["all", "pending", "in-progress", "completed"];

function statusToFilter(s) {
  if (s === "pending") return "pending";
  if (s === "in-progress" || s === "in_progress") return "in-progress";
  if (s === "completed") return "completed";
  return "pending";
}

function RequestCard({ req, userId, onApprove, onRequestChanges, approving }) {
  const [open, setOpen] = useState(false);
  const isApproval = req.type === "approval";
  const isPending = req.status === "pending";
  return (
    <div className={`cp-req-card${isApproval && isPending ? " cp-req-card--approval" : ""}`}>
      <div className="cp-req-card-head" onClick={() => setOpen((v) => !v)}>
        <span className={`cp-req-type-badge cp-req-type--${req.type || "change"}`}>{REQ_TYPE_LABELS[req.type] || req.type}</span>
        <span className="cp-req-title">{req.title}</span>
        <span className={`cp-req-status cp-req-status--${statusToFilter(req.status)}`}>{req.status}</span>
        <ChevronDown size={16} className={`cp-req-chevron${open ? " is-open" : ""}`} />
      </div>
      {open && (
        <div className="cp-req-body">
          <p className="cp-req-desc">{req.description || "No description provided."}</p>
          <p className="cp-req-meta">Submitted: {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          {isApproval && isPending && (
            <div className="cp-req-actions">
              <button className="cp-btn-approve" disabled={approving === req.id} onClick={() => onApprove(req)}>
                {approving === req.id ? "Approving…" : <><Check size={13} style={{ verticalAlign: "middle" }} /> Approve</>}
              </button>
              <button className="cp-btn-changes" disabled={!!approving} onClick={() => onRequestChanges(req)}>
                Request Changes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClientRequestsView({ user }) {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [approving, setApproving] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ projectId: "", type: "change", title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get("/api/comms/requests/mine"),
      apiClient.get("/api/dashboard/client"),
    ]).then(([reqRes, dashRes]) => {
      setRequests(reqRes.data.requests || []);
      setProjects(dashRes.data.projects || []);
      if (dashRes.data.projects?.length) {
        setForm((f) => ({ ...f, projectId: dashRes.data.projects[0].id }));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (req) => {
    setApproving(req.id);
    try {
      await apiClient.put(`/api/comms/requests/${req.id}/status`, { status: "completed" });
      setRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "completed" } : r));
      toast.success("Approved! 🎉 The team has been notified.");
    } catch { toast.error("Failed to approve."); }
    finally { setApproving(null); }
  };

  const handleRequestChanges = async (req) => {
    setApproving(req.id + "_c");
    try {
      await apiClient.put(`/api/comms/requests/${req.id}/status`, { status: "in-progress" });
      setRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "in-progress" } : r));
      toast.success("Change request submitted. The team will follow up.");
    } catch { toast.error("Failed to submit."); }
    finally { setApproving(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post("/api/comms/requests", form);
      setRequests((prev) => [res.data.request || { ...form, id: Date.now(), status: "pending", createdAt: new Date().toISOString() }, ...prev]);
      setForm((f) => ({ ...f, title: "", description: "" }));
      setShowForm(false);
      toast.success("Request submitted successfully!");
    } catch { toast.error("Failed to submit request."); }
    finally { setSubmitting(false); }
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    "in-progress": requests.filter((r) => r.status === "in-progress" || r.status === "in_progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  const visible = filter === "all" ? requests : requests.filter((r) => statusToFilter(r.status) === filter);

  if (loading) return <div className="gg-empty">Loading requests…</div>;

  return (
    <>
      {/* Pipeline header */}
      <div className="cp-req-pipeline">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            className={`cp-req-chip cp-req-chip--${tab === "all" ? "all" : tab === "pending" ? "pending" : tab === "in-progress" ? "active" : "done"}${filter === tab ? " is-active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
            <span className="cp-req-count">{counts[tab]}</span>
          </button>
        ))}
        <button
          style={{ marginLeft: "auto", background: "var(--gg-accent)", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "+ New Request"}
        </button>
      </div>

      {/* New request form */}
      {showForm && (
        <form className="cp-new-req-form" onSubmit={handleSubmit}>
          <p className="cp-new-req-title">Submit a New Request</p>
          <div className="cp-form-row">
            <div className="cp-form-field">
              <label className="cp-form-label">Request Type</label>
              <select className="cp-form-select" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                {REQ_TYPES.map((t) => <option key={t} value={t}>{REQ_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div className="cp-form-field">
              <label className="cp-form-label">Project</label>
              <select className="cp-form-select" value={form.projectId} onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="cp-form-field" style={{ marginBottom: 12 }}>
            <label className="cp-form-label">Title *</label>
            <input className="cp-form-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Brief summary of your request…" required />
          </div>
          <div className="cp-form-field" style={{ marginBottom: 16 }}>
            <label className="cp-form-label">Description</label>
            <textarea className="cp-form-ta" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder={PLACEHOLDERS[form.type]} />
          </div>
          <button type="submit" className="cp-btn-approve" disabled={submitting}>{submitting ? "Submitting…" : "Submit Request"}</button>
        </form>
      )}

      {/* Request cards */}
      {visible.length === 0 ? (
        <div className="gg-empty">No {filter !== "all" ? filter : ""} requests found.</div>
      ) : (
        visible.map((req) => (
          <RequestCard
            key={req.id}
            req={req}
            userId={user?.id}
            onApprove={handleApprove}
            onRequestChanges={handleRequestChanges}
            approving={approving}
          />
        ))
      )}
    </>
  );
}

export default function TasksPage() {
  const { user, role } = useAuth();

  if (role === "client") {
    return (
      <PageWrapper title="Requests" description="Submit and track change requests, approvals, and more.">
        <ClientRequestsView user={user} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Tasks" description="Your assigned deliverables and current workload.">
      <div className="gg-grid gg-grid-3">
        <Card title="Active Tasks" subtitle="In progress">
          <p className="gg-muted">No active tasks yet. Check back when projects are assigned.</p>
        </Card>
        <Card title="Upcoming" subtitle="Scheduled">
          <p className="gg-muted">Nothing scheduled. Your queue is clear.</p>
        </Card>
        <Card title="Completed" subtitle="This week">
          <p className="gg-muted">Completed tasks will appear here.</p>
        </Card>
      </div>
    </PageWrapper>
  );
}
