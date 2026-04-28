/**
 * client/src/admin/pages/TeamPage.jsx
 * Admin-only team management page.
 * Engineering patterns: lazy loading, double-click prevention,
 * optimistic UI, socket online indicators, confirm dialog, debounce.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import { apiClient } from "../../services/apiClient.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useSocket } from "../../hooks/useSocket.js";
import { useToast } from "../components/Toast.jsx";
import { Users, Plus, X, AlertTriangle } from "lucide-react";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

// ─── Confirm Dialog ───────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="gg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="gg-confirm-dialog">
        <div className="gg-confirm-icon"><AlertTriangle size={24} /></div>
        <p className="gg-confirm-message">{message}</p>
        <div className="gg-confirm-actions">
          <button className="gg-btn gg-btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="gg-btn gg-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Removing…" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Workload Bar ─────────────────────────────────────────────
function WorkloadBar({ taskCount = 0, activeCount = 0, overdueCount = 0 }) {
  const max = Math.max(taskCount, 1);
  const overduePct  = Math.round((overdueCount  / max) * 100);
  const activePct   = Math.round(((activeCount - overdueCount) / max) * 100);
  const donePct     = Math.max(0, 100 - overduePct - activePct);
  return (
    <div className="gg-workload-bar" title={`${taskCount} tasks · ${overdueCount} overdue`}>
      <div className="gg-workload-fill gg-workload-fill--done"    style={{ width: `${donePct}%` }} />
      <div className="gg-workload-fill gg-workload-fill--active"  style={{ width: `${activePct}%` }} />
      <div className="gg-workload-fill gg-workload-fill--overdue" style={{ width: `${overduePct}%` }} />
    </div>
  );
}

// ─── Team Member Card ─────────────────────────────────────────
function TeamMemberCard({ member, onlineIds, onEdit, onDeactivate }) {
  const isOnline = onlineIds.includes(member.id);
  return (
    <div className="gg-team-card">
      <div className="gg-team-card-top">
        <div className="gg-team-avatar-wrap">
          <div className="gg-team-avatar">{initials(member.name)}</div>
          <span className={`gg-online-dot${isOnline ? " gg-online-dot--on" : ""}`} title={isOnline ? "Online" : "Offline"} />
        </div>
        <div className="gg-team-info">
          <p className="gg-team-name">{member.name}</p>
          <p className="gg-team-title">{member.title || member.role}</p>
          {member.department && <p className="gg-team-dept">{member.department}</p>}
        </div>
      </div>

      <WorkloadBar
        taskCount={member.task_count ?? 0}
        activeCount={member.active_tasks ?? 0}
        overdueCount={member.overdue_tasks ?? 0}
      />
      <p className="gg-team-workload-label">
        {member.task_count ?? 0} tasks
        {(member.overdue_tasks ?? 0) > 0 && (
          <span className="gg-team-overdue"> · {member.overdue_tasks} overdue</span>
        )}
      </p>

      <div className="gg-team-actions">
        <button className="gg-btn gg-btn-sm gg-btn-ghost" onClick={() => onEdit(member)}>
          Edit
        </button>
        <button className="gg-btn gg-btn-sm gg-btn-danger-ghost" onClick={() => onDeactivate(member)}>
          Deactivate
        </button>
      </div>
    </div>
  );
}

// ─── Add / Edit Slide Panel ────────────────────────────────────
function MemberPanel({ initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const toast = useToast();
  const [form, setForm] = useState({
    name:       initial?.name       ?? "",
    email:      initial?.email      ?? "",
    password:   "",
    title:      initial?.title      ?? "",
    department: initial?.department ?? "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const submitLock = useRef(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address.";
    if (!isEdit && !form.password) e.password = "Password is required.";
    if (!isEdit && form.password.length < 8) e.password = "Password must be at least 8 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (submitLock.current) return;
    submitLock.current = true;
    setSaving(true);
    setErrors({});
    try {
      let saved;
      if (isEdit) {
        const res = await apiClient.put(`/api/team/${initial.id}`, {
          name: form.name, email: form.email,
          title: form.title, department: form.department,
        });
        saved = res.data.member;
      } else {
        const res = await apiClient.post("/api/team", form);
        saved = res.data.member;
      }
      toast.success(isEdit ? "Member updated." : "Team member added.");
      onSaved(saved, isEdit);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "Save failed. Try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
      setTimeout(() => { submitLock.current = false; }, 500);
    }
  };

  return (
    <>
      <div className="gg-slide-panel-overlay" onClick={onClose} />
      <div className="gg-slide-panel">
        <div className="gg-slide-panel-header">
          <h3>{isEdit ? "Edit Member" : "Add Team Member"}</h3>
          <button className="gg-slide-panel-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="gg-slide-panel-body">
            <div className="gg-field">
              <label>Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                autoFocus
              />
              {errors.name && <span className="gg-field-error">{errors.name}</span>}
            </div>
            <div className="gg-field">
              <label>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
              {errors.email && <span className="gg-field-error">{errors.email}</span>}
            </div>
            {!isEdit && (
              <div className="gg-field">
                <label>Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  autoComplete="new-password"
                />
                {errors.password && <span className="gg-field-error">{errors.password}</span>}
              </div>
            )}
            <div className="gg-field">
              <label>Job Title</label>
              <input
                placeholder="e.g. Lead Designer"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
            <div className="gg-field">
              <label>Department</label>
              <input
                placeholder="e.g. Design, Development"
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
              />
            </div>
          </div>

          <div className="gg-slide-panel-footer">
            <button type="button" className="gg-btn gg-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="gg-btn gg-btn-primary" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── TeamPage ──────────────────────────────────────────────────
export default function TeamPage() {
  const { role, token } = useAuth();
  const toast = useToast();
  const { socket } = useSocket(token);
  const [members, setMembers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [removing, setRemoving]     = useState(false);
  const [onlineIds, setOnlineIds]   = useState([]);

  const fetchMembers = useCallback(() => {
    setLoading(true);
    apiClient.get("/api/team")
      .then((res) => setMembers(res.data.members || []))
      .catch(() => toast.error("Failed to load team."))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => { if (role === "admin") fetchMembers(); }, [role, fetchMembers]);

  // Socket: track online status
  useEffect(() => {
    if (!socket) return;
    const handler = ({ userId, status }) => {
      setOnlineIds((prev) =>
        status === "online"
          ? [...new Set([...prev, userId])]
          : prev.filter((id) => id !== userId)
      );
    };
    socket.on("user_status_change", handler);
    return () => socket.off("user_status_change", handler);
  }, [socket]);

  const handleSaved = (member, isEdit) => {
    setMembers((prev) =>
      isEdit
        ? prev.map((m) => m.id === member.id ? member : m)
        : [member, ...prev]
    );
  };

  const handleDeactivate = async () => {
    if (!confirmTarget) return;
    setRemoving(true);
    try {
      await apiClient.delete(`/api/team/${confirmTarget.id}`, { data: { confirm: true } });
      setMembers((prev) => prev.filter((m) => m.id !== confirmTarget.id));
      toast.success(`${confirmTarget.name} deactivated.`);
    } catch {
      toast.error("Failed to deactivate member.");
    } finally {
      setRemoving(false);
      setConfirmTarget(null);
    }
  };

  if (role !== "admin") return null;

  return (
    <>
      <PageWrapper
        title="Team"
        description="Manage team members, workloads, and access."
        actions={
          <button
            className="gg-btn gg-btn-primary"
            onClick={() => { setEditTarget(null); setPanelOpen(true); }}
          >
            <Plus size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
            Add Member
          </button>
        }
      >
        {loading ? (
          <div className="gg-empty">Loading team…</div>
        ) : members.length === 0 ? (
          <div className="gg-empty">
            <Users size={28} style={{ opacity: 0.3 }} />
            <p>No team members yet. Add your first member.</p>
          </div>
        ) : (
          <div className="gg-team-grid">
            {members.map((m) => (
              <TeamMemberCard
                key={m.id}
                member={m}
                onlineIds={onlineIds}
                onEdit={(mem) => { setEditTarget(mem); setPanelOpen(true); }}
                onDeactivate={(mem) => setConfirmTarget(mem)}
              />
            ))}
          </div>
        )}
      </PageWrapper>

      {panelOpen && (
        <MemberPanel
          initial={editTarget}
          onClose={() => setPanelOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {confirmTarget && (
        <ConfirmDialog
          message={`Deactivate ${confirmTarget.name}? They will lose access immediately.`}
          onConfirm={handleDeactivate}
          onCancel={() => setConfirmTarget(null)}
          loading={removing}
        />
      )}
    </>
  );
}
