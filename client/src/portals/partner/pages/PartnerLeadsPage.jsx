/**
 * client/src/portals/partner/pages/PartnerLeadsPage.jsx
 * Partner's submitted referral leads — submit new, track status.
 */
import React, { useCallback, useEffect, useState } from "react";
import { apiClient } from "../../../services/apiClient.js";
import { Users, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
function relTime(iso) {
  if (!iso) return "–";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

// ── Submit Lead Modal ────────────────────────────────────────────
function SubmitLeadModal({ onClose, onSubmitted }) {
  const [form, setForm] = useState({
    companyName: "", contactName: "", contactEmail: "",
    contactPhone: "", estimatedBudget: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr]   = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.contactEmail.trim()) {
      setErr("Company name and email are required.");
      return;
    }
    setSaving(true); setErr("");
    try {
      const res = await apiClient.post("/api/partners/me/referrals", form);
      onSubmitted?.(res.data);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Submission failed. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <div className="gg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gg-modal" style={{ maxWidth: 480 }}>
        <div className="gg-modal-header">
          <h3 className="gg-modal-title">Submit a Referral</h3>
          <button className="gg-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="gg-modal-body">
            {err && <p className="gg-modal-error">{err}</p>}
            <div className="gg-field">
              <label>Company Name *</label>
              <input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} autoFocus placeholder="ACME Corp" />
            </div>
            <div className="gg-field">
              <label>Contact Name</label>
              <input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="John Smith" />
            </div>
            <div className="gg-field">
              <label>Contact Email *</label>
              <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="john@acme.com" />
            </div>
            <div className="gg-field">
              <label>Contact Phone</label>
              <input type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+1 555 000 0000" />
            </div>
            <div className="gg-field">
              <label>Estimated Budget ($)</label>
              <input type="number" min="0" value={form.estimatedBudget} onChange={(e) => set("estimatedBudget", e.target.value)} placeholder="5000" />
            </div>
            <div className="gg-field">
              <label>Notes</label>
              <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any context about this lead…" />
            </div>
          </div>
          <div className="gg-modal-footer">
            <button type="button" className="gg-btn gg-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="gg-btn gg-btn-primary" disabled={saving}>
              {saving ? "Submitting…" : "Submit Referral"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── PartnerLeadsPage ─────────────────────────────────────────────
export default function PartnerLeadsPage() {
  const [leads, setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded]   = useState(null);

  const load = useCallback(() => {
    apiClient.get("/api/partners/me/referrals")
      .then((res) => setLeads(res.data.referrals || res.data || []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const statusColor = (s) => ({
    new:       "pp-badge--new",
    pending:   "pp-badge--pending",
    converted: "pp-badge--converted",
    active:    "pp-badge--active",
  })[s?.toLowerCase()] || "pp-badge--new";

  return (
    <div>
      <div className="pp-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="pp-page-title">My Referrals</h1>
          <p className="pp-page-sub">Track all leads you've submitted.</p>
        </div>
        <button
          className="pp-copy-btn"
          style={{ background: "var(--pp-accent)" }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={14} style={{ marginRight: 4 }} />
          Submit Referral
        </button>
      </div>

      {/* Stats row */}
      <div className="pp-kpi-row" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Submitted", value: leads.length, accent: "" },
          { label: "Pending Review",  value: leads.filter((l) => l.status === "pending" || l.status === "new").length, accent: "--warn" },
          { label: "Converted",       value: leads.filter((l) => l.status === "converted" || l.status === "active").length, accent: "--success" },
        ].map((s) => (
          <div key={s.label} className={`pp-kpi-card${s.accent ? ` pp-kpi-card${s.accent}` : ""}`}>
            <p className="pp-kpi-value">{s.value}</p>
            <p className="pp-kpi-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="pp-card">
        <div className="pp-card-header">
          <h3 className="pp-card-title">Referral Pipeline</h3>
          <p className="pp-card-sub">{leads.length} submitted total</p>
        </div>

        {loading ? (
          <div className="pp-empty">Loading referrals…</div>
        ) : leads.length === 0 ? (
          <div className="pp-empty">
            <Users size={32} style={{ opacity: 0.25, marginBottom: 8 }} />
            <p>No referrals yet. Submit your first lead to get started!</p>
          </div>
        ) : (
          <div className="pp-table-wrap">
            <table className="pp-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <React.Fragment key={l.id}>
                    <tr>
                      <td style={{ fontWeight: 600 }}>{l.companyName || l.company_name || "–"}</td>
                      <td>
                        <div>{l.contactName || l.contact_name || "–"}</div>
                        <div style={{ fontSize: "0.73rem", color: "var(--pp-text-muted)" }}>{l.contactEmail || l.contact_email}</div>
                      </td>
                      <td>{l.estimatedBudget ? `$${Number(l.estimatedBudget).toLocaleString()}` : "–"}</td>
                      <td><span className={`pp-badge ${statusColor(l.status)}`}>{l.status || "new"}</span></td>
                      <td style={{ color: "var(--pp-text-muted)", fontSize: "0.78rem" }}>{relTime(l.createdAt || l.created_at)}</td>
                      <td>
                        {l.notes && (
                          <button
                            style={{ background: "none", border: "none", color: "var(--pp-text-muted)", cursor: "pointer", padding: 4 }}
                            onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                            title="Toggle notes"
                          >
                            {expanded === l.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expanded === l.id && l.notes && (
                      <tr>
                        <td colSpan={6} style={{ background: "var(--pp-surface-2)", fontSize: "0.82rem", color: "var(--pp-text-muted)", padding: "8px 14px 12px" }}>
                          <strong>Notes:</strong> {l.notes}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <SubmitLeadModal
          onClose={() => setShowModal(false)}
          onSubmitted={(newLead) => {
            setLeads((prev) => [newLead, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
