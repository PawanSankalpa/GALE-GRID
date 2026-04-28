import React, { useCallback, useEffect, useRef, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import Button from "../components/Button.jsx";
import { apiClient } from "../../services/apiClient.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../components/Toast.jsx";
import { LayoutGrid, Trello, Palette, Rocket, Check, ArrowRight, Package } from "lucide-react";
import DeliverableCard from "../components/DeliverableCard.jsx";

const PRIORITY_OPTIONS = ["high", "medium", "low"];
const STATUS_OPTIONS   = ["Planning", "In Progress", "Review", "Completed", "On Hold"];

const KANBAN_COLS = [
  { key: "Planning",    label: "Planning",     accent: "#6366f1" },
  { key: "In Progress", label: "In Progress",  accent: "#f59e0b" },
  { key: "Review",      label: "Review",       accent: "#3b82f6" },
  { key: "Completed",   label: "Completed",    accent: "#22c55e" },
  { key: "On Hold",     label: "On Hold",      accent: "#94a3b8" },
];

function daysRemaining(deadline) {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - Date.now()) / 86400000);
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, warn: true };
  if (diff === 0) return { label: "Due today", warn: true };
  return { label: `${diff}d left`, warn: false };
}

function badgeClass(s = "") {
  return `gg-badge gg-badge--${s.toLowerCase().replace(/\s+/g, "-")}`;
}

function priorityDot(p) {
  const map = { high: "#dc2626", medium: "#f59e0b", low: "#22c55e" };
  return <span className="gg-kanban-priority-dot" style={{ background: map[p] || "#94a3b8" }} title={p} />;
}

// ─── Kanban Board ─────────────────────────────────────────────
function KanbanBoard({ projects, clients, onStatusChange, onEdit }) {
  const dragItem = useRef(null);
  const [hoveredCol, setHoveredCol] = useState(null);

  const clientName = (id) => clients.find((c) => c.id === id)?.company || "—";

  const handleDragStart = (e, project) => {
    dragItem.current = project;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, colKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoveredCol(colKey);
  };

  const handleDrop = (e, colKey) => {
    e.preventDefault();
    setHoveredCol(null);
    if (dragItem.current && dragItem.current.status !== colKey) {
      onStatusChange(dragItem.current, colKey);
    }
    dragItem.current = null;
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    setHoveredCol(null);
  };

  return (
    <div className="gg-kanban">
      {KANBAN_COLS.map((col) => {
        const cards = projects.filter((p) => (p.status || "Planning") === col.key);
        return (
          <div
            key={col.key}
            className={`gg-kanban-col${hoveredCol === col.key ? " is-drop-target" : ""}`}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDrop={(e) => handleDrop(e, col.key)}
            onDragLeave={() => setHoveredCol(null)}
          >
            <div className="gg-kanban-col-header" style={{ "--col-accent": col.accent }}>
              <span className="gg-kanban-col-dot" />
              <span className="gg-kanban-col-title">{col.label}</span>
              <span className="gg-kanban-col-count">{cards.length}</span>
            </div>

            <div className="gg-kanban-cards">
              {cards.map((p) => (
                <div
                  key={p.id}
                  className="gg-kanban-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, p)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="gg-kanban-card-top">
                    {priorityDot(p.priority)}
                    <span className="gg-kanban-card-name">{p.name}</span>
                  </div>
                  <p className="gg-kanban-card-client">{clientName(p.clientId)}</p>
                  {p.deadline && (
                    <p className="gg-kanban-card-due">Due {p.deadline}</p>
                  )}
                  <div className="gg-progress" style={{ marginTop: 6 }}>
                    <div className="gg-progress-fill" style={{ width: `${p.progress ?? 0}%` }} />
                  </div>
                  <div className="gg-kanban-card-footer">
                    <span className="gg-kanban-card-pct">{p.progress ?? 0}%</span>
                    <button className="gg-kanban-card-edit" onClick={() => onEdit(p)}>Edit</button>
                  </div>
                </div>
              ))}

              {cards.length === 0 && (
                <div className="gg-kanban-empty-col">Drop here</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Project Modal ─────────────────────────────────────────────
function ProjectModal({ clients, initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name:      initial?.name     ?? "",
    clientId:  initial?.clientId ?? (clients[0]?.id || ""),
    priority:  initial?.priority ?? "medium",
    deadline:  initial?.deadline ?? "",
    status:    initial?.status   ?? "Planning",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Project name is required."); return; }
    if (!form.clientId)    { setErr("Please select a client."); return; }
    setSaving(true);
    setErr("");
    try {
      if (isEdit) {
        const res = await apiClient.put(`/api/projects/${initial.id}`, form);
        onSaved(res.data);
      } else {
        const res = await apiClient.post("/api/projects", form);
        onSaved(res.data);
      }
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gg-modal">
        <div className="gg-modal-header">
          <h3 className="gg-modal-title">{isEdit ? "Edit Project" : "New Project"}</h3>
          <button className="gg-modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="gg-modal-body">
            {err && <p className="gg-modal-error">{err}</p>}
            <div className="gg-field">
              <label>Project Name *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} autoFocus />
            </div>
            <div className="gg-field">
              <label>Client *</label>
              <select value={form.clientId} onChange={(e) => set("clientId", e.target.value)}>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.company}</option>)}
              </select>
            </div>
            <div className="gg-field">
              <label>Priority</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            {isEdit && (
              <div className="gg-field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div className="gg-field">
              <label>Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </div>
          </div>
          <div className="gg-modal-footer">
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Client Projects View ─────────────────────────────────────
function Confetti({ show }) {
  if (!show) return null;
  return (
    <div className="cp-confetti-wrap" aria-hidden="true">
      {[1,2,3,4,5,6,7,8].map((i) => (
        <div key={i} className="cp-confetti-piece" />
      ))}
    </div>
  );
}

function ClientProjectsView() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    apiClient.get("/api/dashboard/client")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (request) => {
    setApproving(request.id);
    try {
      await apiClient.put(`/api/comms/requests/${request.id}/status`, { status: "completed" });
      setData((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => r.id === request.id ? { ...r, status: "completed" } : r),
      }));
      setConfetti(true);
      toast.success("Design approved! 🎉 Our team has been notified.");
      setTimeout(() => setConfetti(false), 1400);
    } catch {
      toast.error("Failed to submit approval.");
    } finally {
      setApproving(null);
    }
  };

  const handleRequestChanges = async (request) => {
    setApproving(request.id + "_changes");
    try {
      await apiClient.put(`/api/comms/requests/${request.id}/status`, { status: "in-progress" });
      setData((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => r.id === request.id ? { ...r, status: "in-progress" } : r),
      }));
      toast.success("Change request submitted. The team will follow up shortly.");
    } catch {
      toast.error("Failed to submit changes request.");
    } finally {
      setApproving(null);
    }
  };

  if (loading) return <div className="gg-empty">Loading projects…</div>;

  const { projects = [], requests = [] } = data || {};
  const project = projects[0];
  const timeline = project?.timeline || [];
  const done = timeline.filter((t) => t.completed).length;
  const pendingApprovals = requests.filter((r) => r.type === "approval" && r.status === "pending");

  return (
    <>
      {/* Approval callouts */}
      {pendingApprovals.map((req) => (
        <div key={req.id} className="cp-approval-callout" style={{ position: "relative" }}>
          <Confetti show={confetti} />
          <div className="cp-approval-callout-head">
            <span className="cp-approval-icon"><Palette size={18} /></span>
            <span className="cp-approval-title">Action Required — Design Approval</span>
          </div>
          <p className="cp-approval-sub">{req.title} · Submitted {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
          <div className="cp-approval-actions">
            <button
              className="cp-btn-approve"
              disabled={approving === req.id}
              onClick={() => handleApprove(req)}
            >
              {approving === req.id ? "Approving…" : <><Check size={13} style={{ verticalAlign: "middle" }} /> Approve Design</>}
            </button>
            <button
              className="cp-btn-changes"
              disabled={!!approving}
              onClick={() => handleRequestChanges(req)}
            >
              Request Changes
            </button>
          </div>
        </div>
      ))}

      {/* Phase story banner */}
      {project && timeline.length > 0 && (
        <div className="cp-story-banner">
          <Rocket size={14} style={{ verticalAlign: "middle" }} /> {done} of {timeline.length} phases complete
          {project.deadline && ` · targeting ${new Date(project.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} launch`}
          {project.nextStep && ` · next: ${project.nextStep}`}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="gg-empty">No projects yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {projects.map((p) => {
            const tl = p.timeline || [];
            const pDone = tl.filter((t) => t.completed).length;
            return (
              <div key={p.id} className="cp-project-wrap">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <h3 className="cp-project-name" style={{ marginBottom: 2 }}>{p.name}</h3>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className={`gg-badge gg-badge--${(p.status || "planning").toLowerCase().replace(/\s+/g, "-")}`}>{p.status}</span>
                      <span className="gg-badge gg-badge--active">{p.priority} priority</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{p.progress ?? 0}%</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--gg-text-muted)" }}>complete</div>
                  </div>
                </div>
                <div className="gg-progress" style={{ marginBottom: 14, height: 8 }}>
                  <div className="gg-progress-fill" style={{ width: `${p.progress ?? 0}%` }} />
                </div>
                {tl.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${tl.length}, 1fr)`, gap: 4, marginBottom: 12 }}>
                    {tl.map((ph, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: ph.completed ? "#16a34a" : i === pDone ? "#0284c7" : "var(--gg-border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: ph.completed || i === pDone ? "#fff" : "var(--gg-text-muted)",
                          fontSize: "0.72rem", fontWeight: 700,
                        }}>
                          {ph.completed ? <Check size={10} strokeWidth={3} /> : i + 1}
                        </div>
                        <span style={{ fontSize: "0.62rem", color: "var(--gg-text-muted)", textAlign: "center" }}>{ph.name.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                )}
                {p.nextStep && <p className="cp-project-next"><ArrowRight size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />{p.nextStep}</p>}
                <p style={{ fontSize: "0.78rem", color: "var(--gg-text-muted)", marginTop: 8 }}>
                  Deadline: <strong>{p.deadline || "—"}</strong>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Deliverables Tab (admin/team) ───────────────────────────
function DeliverablesTab({ role }) {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [deliverables, setDeliverables] = useState([]);
  const [loadingDlv, setLoadingDlv] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", fileUrl: "", filename: "" });
  const [uploading, setUploading] = useState(false);
  const uploadLock = useRef(false);

  useEffect(() => {
    apiClient.get("/api/projects")
      .then((res) => {
        const list = res.data.projects || [];
        setProjects(list);
        if (list.length) setSelectedProjectId(list[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    setLoadingDlv(true);
    apiClient.get(`/api/deliverables/project/${selectedProjectId}`)
      .then((res) => setDeliverables(res.data.deliverables || []))
      .catch(() => toast.error("Failed to load deliverables."))
      .finally(() => setLoadingDlv(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  const handleStatusChange = useCallback(async (id, newStatus, comment) => {
    setActionLoading(true);
    try {
      const res = await apiClient.put(`/api/deliverables/${id}/status`, {
        status: newStatus,
        reviewComment: comment,
      });
      const updated = res.data.deliverable;
      // Optimistic-update merged with server response
      setDeliverables((prev) =>
        prev.map((d) => d.id === id ? { ...d, ...updated } : d)
      );
      toast.success("Status updated.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) { toast.error("Title is required."); return; }
    if (!selectedProjectId) { toast.error("Select a project first."); return; }
    if (uploadLock.current) return;
    uploadLock.current = true;
    setUploading(true);
    try {
      const res = await apiClient.post("/api/deliverables", {
        projectId: selectedProjectId,
        ...uploadForm,
      });
      setDeliverables((prev) => [res.data.deliverable, ...prev]);
      setUploadForm({ title: "", description: "", fileUrl: "", filename: "" });
      toast.success("Deliverable added.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
      setTimeout(() => { uploadLock.current = false; }, 500);
    }
  };

  return (
    <div>
      {/* Project selector */}
      <div className="gg-dlv-toolbar">
        <select
          className="gg-select"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Upload form (admin/team only) */}
      {(role === "admin" || role === "team") && (
        <form className="gg-dlv-upload-form" onSubmit={handleUpload}>
          <h4 className="gg-dlv-upload-title">Add Deliverable</h4>
          <div className="gg-dlv-upload-row">
            <input
              placeholder="Title *"
              value={uploadForm.title}
              onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))}
            />
            <input
              placeholder="File URL"
              value={uploadForm.fileUrl}
              onChange={(e) => setUploadForm((f) => ({ ...f, fileUrl: e.target.value }))}
            />
            <input
              placeholder="Filename"
              value={uploadForm.filename}
              onChange={(e) => setUploadForm((f) => ({ ...f, filename: e.target.value }))}
            />
          </div>
          <textarea
            className="gg-dlv-textarea"
            placeholder="Description (optional)"
            rows={2}
            value={uploadForm.description}
            onChange={(e) => setUploadForm((f) => ({ ...f, description: e.target.value }))}
          />
          <button
            type="submit"
            className="gg-btn gg-btn-primary"
            disabled={uploading}
          >
            {uploading ? "Adding…" : "+ Add Deliverable"}
          </button>
        </form>
      )}

      {/* List */}
      {loadingDlv ? (
        <div className="gg-empty">Loading deliverables…</div>
      ) : deliverables.length === 0 ? (
        <div className="gg-empty">
          <Package size={28} style={{ opacity: 0.3 }} />
          <p>No deliverables yet for this project.</p>
        </div>
      ) : (
        <div className="gg-deliverable-grid">
          {deliverables.map((d) => (
            <DeliverableCard
              key={d.id}
              deliverable={d}
              currentUserRole={role}
              onStatusChange={handleStatusChange}
              loading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const { role } = useAuth();
  const [tab, setTab] = useState("projects");

  if (role === "client") {
    return (
      <PageWrapper title="My Projects" description="Track your project progress and milestones.">
        <ClientProjectsView />
      </PageWrapper>
    );
  }

  return (
    <>
      <div className="gg-tab-bar">
        <button
          className={`gg-tab-btn${tab === "projects" ? " gg-tab-btn--active" : ""}`}
          onClick={() => setTab("projects")}
        >
          Projects
        </button>
        <button
          className={`gg-tab-btn${tab === "deliverables" ? " gg-tab-btn--active" : ""}`}
          onClick={() => setTab("deliverables")}
        >
          Deliverables
        </button>
      </div>
      {tab === "projects" ? <AdminProjectsView /> : <DeliverablesTab role={role} />}
    </>
  );
}

function AdminProjectsView() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [modal, setModal]       = useState(null); // null | "new" | {project}
  const [view, setView]         = useState("board"); // "board" | "kanban"

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiClient.get("/api/projects"),
      apiClient.get("/api/clients"),
    ])
      .then(([pRes, cRes]) => {
        setProjects(pRes.data.projects || []);
        setClients(cRes.data.clients   || []);
      })
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaved = (updated) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = updated; return next; }
      return [updated, ...prev];
    });
  };

  const handleStatusChange = useCallback(async (project, newStatus) => {
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => p.id === project.id ? { ...p, status: newStatus } : p)
    );
    try {
      await apiClient.put(`/api/projects/${project.id}`, { ...project, status: newStatus });
    } catch {
      // Revert on failure
      setProjects((prev) =>
        prev.map((p) => p.id === project.id ? { ...p, status: project.status } : p)
      );
    }
  }, []);

  const clientName = (id) => clients.find((c) => c.id === id)?.company || "—";

  const viewToggle = (
    <div className="gg-view-toggle">
      <button
        className={`gg-view-toggle-btn${view === "board" ? " is-active" : ""}`}
        onClick={() => setView("board")}
        aria-label="Card view"
      >
        <LayoutGrid size={14} />
      </button>
      <button
        className={`gg-view-toggle-btn${view === "kanban" ? " is-active" : ""}`}
        onClick={() => setView("kanban")}
        aria-label="Kanban view"
      >
        <Trello size={14} />
      </button>
    </div>
  );

  return (
    <>
      <PageWrapper
        title="Projects"
        description="Active and upcoming delivery projects."
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {viewToggle}
            <Button onClick={() => setModal("new")}>+ New Project</Button>
          </div>
        }
      >
        {loading ? (
          <div className="gg-empty">Loading projects…</div>
        ) : error ? (
          <div className="gg-empty">{error}</div>
        ) : projects.length === 0 ? (
          <div className="gg-empty">No projects yet. Create one above.</div>
        ) : view === "kanban" ? (
          <KanbanBoard
            projects={projects}
            clients={clients}
            onStatusChange={handleStatusChange}
            onEdit={(p) => setModal(p)}
          />
        ) : (
          <div className="gg-grid gg-grid-3">
            {projects.map((p) => {
              const deadline = daysRemaining(p.deadline);
              const timeline = p.timeline || [];
              return (
                <div key={p.id} className="gg-project-card">
                  <div className="gg-project-card-top">
                    <div>
                      <h3 className="gg-project-name">{p.name}</h3>
                      <p className="gg-project-client">{clientName(p.clientId)}</p>
                    </div>
                    <span className={`gg-badge gg-badge--${(p.priority || "medium").toLowerCase()}`}>
                      {p.priority}
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="gg-progress">
                      <div className="gg-progress-fill" style={{ width: `${p.progress ?? 0}%` }} />
                    </div>
                    <div className="gg-project-meta" style={{ marginTop: 4 }}>
                      <span>{p.progress ?? 0}% complete</span>
                      <span className={badgeClass(p.status)}>{p.status}</span>
                    </div>
                  </div>

                  {/* Timeline dots */}
                  {timeline.length > 0 && (
                    <div className="gg-timeline">
                      {timeline.map((phase, i) => (
                        <React.Fragment key={phase.phase}>
                          <div
                            className={`gg-timeline-dot${phase.done ? " is-done" : ""}`}
                            title={phase.phase}
                          />
                          {i < timeline.length - 1 && (
                            <div className={`gg-timeline-line${phase.done ? " is-done" : ""}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  <div className="gg-project-meta">
                    <span>Due: {p.deadline || "—"}</span>
                    {deadline && (
                      <span style={{ color: deadline.warn ? "#b91c1c" : "var(--gg-text-muted)" }}>
                        {deadline.label}
                      </span>
                    )}
                  </div>

                  {p.nextStep && (
                    <p className="gg-project-next">Next: {p.nextStep}</p>
                  )}

                  <div className="gg-project-actions">
                    <button
                      className="gg-btn gg-btn-sm gg-btn-ghost"
                      onClick={() => setModal(p)}
                    >Edit</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageWrapper>

      {modal && (
        <ProjectModal
          clients={clients}
          initial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
