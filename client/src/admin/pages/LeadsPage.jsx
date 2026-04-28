import React, { useCallback, useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import Button from "../components/Button.jsx";
import { apiClient } from "../../services/apiClient.js";
import CopyButton from "../components/CopyButton.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useToast } from "../components/Toast.jsx";

function LeadModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ company: "", contactName: "", contactEmail: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim()) { setErr("Company name is required."); return; }
    setSaving(true);
    setErr("");
    try {
      const res = await apiClient.post("/api/clients", form);
      onSaved(res.data);
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
          <h3 className="gg-modal-title">Add Lead</h3>
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
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="How did they reach out?" />
            </div>
          </div>
          <div className="gg-modal-footer">
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Add Lead"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const toast = useToast();
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [moving, setMoving]   = useState(null); // clientId being moved
  const [confirmMove, setConfirmMove] = useState(null); // clientId awaiting confirm

  const fetchLeads = useCallback(() => {
    setLoading(true);
    apiClient.get("/api/clients")
      .then((res) => {
        const all = res.data.clients || [];
        setLeads(all.filter((c) => c.stage === "lead"));
      })
      .catch(() => setError("Failed to load leads."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const moveToOnboarding = async (clientId) => {
    setMoving(clientId);
    try {
      await apiClient.put(`/api/clients/${clientId}/stage`, { stage: "onboarding" });
      setLeads((prev) => prev.filter((c) => c.id !== clientId));
      toast.success("Lead moved to onboarding.");
    } catch {
      toast.error("Failed to move lead.");
    } finally {
      setMoving(null);
    }
  };

  const handleSaved = (newClient) => {
    setLeads((prev) => [newClient, ...prev]);
  };

  return (
    <>
      <PageWrapper
        title="Leads"
        description="Prospects who haven't started onboarding yet."
        actions={<Button onClick={() => setShowModal(true)}>+ Add Lead</Button>}
      >
        {loading ? (
          <div className="gg-empty">Loading leads…</div>
        ) : error ? (
          <div className="gg-empty">{error}</div>
        ) : leads.length === 0 ? (
          <div className="gg-empty">No leads right now. Add one above.</div>
        ) : (
          <div className="gg-table-wrap">
            <table className="gg-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td style={{ fontWeight: 600 }}>{lead.company}</td>
                    <td>{lead.contactName || "—"}</td>
                    <td style={{ color: "var(--gg-text-muted)" }}>
                      <span className="gg-cell-copy">
                        <span className="gg-cell-copy-text">{lead.contactEmail || "—"}</span>
                        {lead.contactEmail && (
                          <CopyButton text={lead.contactEmail} label="Copy email" onCopied={() => toast.success("Email copied!")} />
                        )}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220, color: "var(--gg-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lead.notes || "—"}
                    </td>
                    <td>
                      <button
                        className="gg-btn gg-btn-sm gg-btn-primary"
                        disabled={moving === lead.id}
                        onClick={() => setConfirmMove(lead.id)}
                      >
                        {moving === lead.id ? "Moving…" : "→ Onboarding"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>

      {showModal && (
        <LeadModal onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}

      <ConfirmDialog
        open={!!confirmMove}
        intent="warning"
        title="Move to Onboarding?"
        message="This will advance the lead to the onboarding stage. You can change it back from the Clients page."
        confirmLabel="Move to Onboarding"
        onConfirm={() => { moveToOnboarding(confirmMove); setConfirmMove(null); }}
        onCancel={() => setConfirmMove(null)}
      />
    </>
  );
}
