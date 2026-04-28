import React, { useCallback, useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import Button from "../components/Button.jsx";
import { apiClient } from "../../services/apiClient.js";
import CopyButton from "../components/CopyButton.jsx";
import { useToast } from "../components/Toast.jsx";

const STAGES = ["all", "lead", "onboarding", "active", "delivered", "subscription"];
const STAGE_OPTIONS = ["lead", "onboarding", "active", "delivered", "subscription"];

function badgeClass(stage) {
  return `gg-badge gg-badge--${stage}`;
}

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30)  return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

function isNew(dateStr) {
  if (!dateStr) return false;
  return Date.now() - new Date(dateStr).getTime() < 7 * 24 * 60 * 60 * 1000;
}

/* ── Invite Modal ─────────────────────────────────────────────── */
function InviteModal({ client, onClose, onSent }) {
  const [email,   setEmail]   = useState(client?.contactEmail ?? "");
  const [sending, setSending] = useState(false);
  const [err,     setErr]     = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setErr("Email is required."); return; }
    setSending(true);
    setErr("");
    try {
      await apiClient.post("/api/auth/invite", { email: email.trim() });
      onSent();
      onClose();
    } catch (ex) {
      setErr(ex.response?.data?.message || "Failed to send invite.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="gg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gg-modal" style={{ maxWidth: 400 }}>
        <div className="gg-modal-header">
          <h3 className="gg-modal-title">Send Portal Invite</h3>
          <button className="gg-modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSend}>
          <div className="gg-modal-body">
            {err && <p className="gg-modal-error">{err}</p>}
            <p style={{ fontSize: "0.85rem", color: "var(--gg-text-muted)", marginBottom: 12 }}>
              An invite link will be emailed to <strong>{client?.company}</strong> so they can register their portal account.
            </p>
            <div className="gg-field">
              <label>Client Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                placeholder="client@example.com"
                required
              />
            </div>
          </div>
          <div className="gg-modal-footer">
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" disabled={sending}>{sending ? "Sending…" : "Send Invite"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientModal({ initial, allClients, onClose, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    company:      initial?.company      ?? "",
    contactName:  initial?.contactName  ?? "",
    contactEmail: initial?.contactEmail ?? "",
    notes:        initial?.notes        ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim()) { setErr("Company name is required."); return; }
    setSaving(true);
    setErr("");
    try {
      if (isEdit) {
        const res = await apiClient.put(`/api/clients/${initial.id}`, form);
        onSaved(res.data);
      } else {
        const res = await apiClient.post("/api/clients", form);
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
          <h3 className="gg-modal-title">{isEdit ? "Edit Client" : "Add Client"}</h3>
          <button className="gg-modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="gg-modal-body">
            {err && <p className="gg-modal-error">{err}</p>}
            <div className="gg-field">
              <label>Company Name *</label>
              <input value={form.company} onChange={(e) => set("company", e.target.value)} autoFocus />
            </div>
            <div className="gg-field">
              <label>Contact Name</label>
              <input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
            </div>
            <div className="gg-field">
              <label>Contact Email</label>
              <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
            </div>
            <div className="gg-field">
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>
          <div className="gg-modal-footer">
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : isEdit ? "Save Changes" : "Add Client"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const toast = useToast();
  const [clients,   setClients]   = useState([]);
  const [lifecycle, setLifecycle] = useState({});
  const [tab,       setTab]       = useState("all");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [modal,     setModal]     = useState(null); // null | "add" | {client}
  const [inviting,  setInviting]  = useState(null); // null | {client}

  const fetchClients = useCallback(() => {
    setLoading(true);
    apiClient.get("/api/clients")
      .then((res) => {
        setClients(res.data.clients || []);
        setLifecycle(res.data.lifecycle || {});
      })
      .catch(() => setError("Failed to load clients."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleStageChange = async (clientId, stage) => {
    try {
      const res = await apiClient.put(`/api/clients/${clientId}/stage`, { stage });
      setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, ...res.data } : c));
    } catch {
      // stage dropdown stays as-is on error
    }
  };

  const handleSaved = (updated) => {
    setClients((prev) => {
      const idx = prev.findIndex((c) => c.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
    fetchClients();
  };

  const filtered     = tab === "all" ? clients : clients.filter((c) => c.stage === tab);
  const portalCount  = clients.filter((c) => c.userId).length;
  const newCount     = clients.filter((c) => isNew(c.createdAt)).length;
  const activeCount  = clients.filter((c) => c.stage === "active").length;

  return (
    <>
      <PageWrapper
        title="Clients"
        description="Full client lifecycle — from lead to active subscription."
        actions={<Button onClick={() => setModal("add")}>+ Add Client</Button>}
      >
        {/* KPI row */}
        <div className="gg-kpi-row" style={{ marginBottom: 24 }}>
          <div className="gg-kpi-card gg-kpi-card--accent">
            <div className="gg-kpi-top">
              <span className="gg-kpi-icon gg-kpi-icon--accent">👥</span>
            </div>
            <p className="gg-kpi-value">{clients.length}</p>
            <p className="gg-kpi-label">Total Clients</p>
          </div>
          <div className="gg-kpi-card gg-kpi-card--blue">
            <div className="gg-kpi-top">
              <span className="gg-kpi-icon gg-kpi-icon--blue">🔗</span>
            </div>
            <p className="gg-kpi-value">{portalCount}</p>
            <p className="gg-kpi-label">Portal Users</p>
          </div>
          <div className="gg-kpi-card gg-kpi-card--success">
            <div className="gg-kpi-top">
              <span className="gg-kpi-icon gg-kpi-icon--success">✓</span>
            </div>
            <p className="gg-kpi-value">{activeCount}</p>
            <p className="gg-kpi-label">Active</p>
          </div>
          <div className="gg-kpi-card gg-kpi-card--warn">
            <div className="gg-kpi-top">
              <span className="gg-kpi-icon gg-kpi-icon--warn">🆕</span>
            </div>
            <p className="gg-kpi-value">{newCount}</p>
            <p className="gg-kpi-label">New (7d)</p>
          </div>
        </div>

        {/* Stage tabs */}
        <div className="gg-tabs">
          {STAGES.map((s) => (
            <button
              key={s}
              className={`gg-tab${tab === s ? " is-active" : ""}`}
              onClick={() => setTab(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && lifecycle[s] != null ? ` (${lifecycle[s]})` : ""}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="gg-empty">Loading clients…</div>
        ) : error ? (
          <div className="gg-empty">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="gg-empty">No clients in this stage.</div>
        ) : (
          <div className="gg-table-wrap">
            <table className="gg-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Stage</th>
                  <th>Registered</th>
                  <th>Projects</th>
                  <th>Move Stage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                        {client.company}
                        {client.userId && (
                          <span
                            title="Portal account linked"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: "0.7rem",
                              fontWeight: 500,
                              padding: "1px 7px",
                              borderRadius: 20,
                              background: "#dbeafe",
                              color: "#1d4ed8",
                              lineHeight: 1.6,
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
                            Portal
                          </span>
                        )}
                        {isNew(client.createdAt) && (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 600,
                              padding: "1px 6px",
                              borderRadius: 20,
                              background: "#fef9c3",
                              color: "#854d0e",
                              letterSpacing: "0.04em",
                              lineHeight: 1.8,
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>{client.contactName || "—"}</div>
                      {client.contactEmail && (
                        <span className="gg-cell-copy" style={{ fontSize: "0.76rem", color: "var(--gg-text-muted)" }}>
                          <span className="gg-cell-copy-text">{client.contactEmail}</span>
                          <CopyButton text={client.contactEmail} label="Copy email" onCopied={() => toast.success("Email copied!")} />
                        </span>
                      )}
                    </td>
                    <td><span className={badgeClass(client.stage)}>{client.stage}</span></td>
                    <td style={{ fontSize: "0.8rem", color: "var(--gg-text-muted)", whiteSpace: "nowrap" }}>
                      {timeAgo(client.createdAt)}
                    </td>
                    <td style={{ textAlign: "center" }}>{client.projectCount ?? 0}</td>
                    <td>
                      <select
                        className="gg-select-inline"
                        value={client.stage}
                        onChange={(e) => handleStageChange(client.id, e.target.value)}
                      >
                        {STAGE_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="gg-table-actions">
                        <button
                          className="gg-btn gg-btn-sm gg-btn-ghost"
                          onClick={() => setModal(client)}
                        >
                          Edit
                        </button>
                        {!client.userId && (
                          <button
                            className="gg-btn gg-btn-sm gg-btn-ghost"
                            style={{ color: "#0284c7" }}
                            onClick={() => setInviting(client)}
                            title="Send portal invite"
                          >
                            Invite
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>

      {modal && (
        <ClientModal
          initial={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {inviting && (
        <InviteModal
          client={inviting}
          onClose={() => setInviting(null)}
          onSent={() => toast.success("Invite sent successfully!")}
        />
      )}
    </>
  );
}
