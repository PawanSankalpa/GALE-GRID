/**
 * client/src/admin/pages/PartnersPage.jsx
 * Admin view — manage partner accounts, view referrals, approve payouts.
 */
import React, { useCallback, useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import { apiClient } from "../../services/apiClient.js";
import { useToast } from "../components/Toast.jsx";
import {
  Users, Award, DollarSign, TrendingUp,
  X, Plus,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
function fmt$(n) {
  if (n == null) return "$0";
  const num = Number(n);
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

function relTime(iso) {
  if (!iso) return "–";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function statusBadge(status) {
  const cls = {
    active:   "gg-badge--active",
    pending:  "gg-badge--planning",
    inactive: "gg-badge--completed",
    approved: "gg-badge--in-progress",
    paid:     "gg-badge--completed",
    due:      "gg-badge--review",
  }[status?.toLowerCase()] || "gg-badge--planning";
  return <span className={`gg-badge ${cls}`}>{status}</span>;
}

// ── Invite Partner Modal ─────────────────────────────────────────
function InviteModal({ onClose, onInvited }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", commissionRate: 15 });
  const [saving, setSaving] = useState(false);
  const [err, setErr]   = useState("");
  const toast = useToast();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) { setErr("Email is required."); return; }
    setSaving(true); setErr("");
    try {
      const res = await apiClient.post("/api/partners/invite", form);
      toast.success("Partner invitation sent.");
      onInvited?.(res.data);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to send invitation.");
    } finally { setSaving(false); }
  };

  return (
    <div className="gg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gg-modal">
        <div className="gg-modal-header">
          <h3 className="gg-modal-title">Invite Partner</h3>
          <button className="gg-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="gg-modal-body">
            {err && <p className="gg-modal-error">{err}</p>}
            <div className="gg-field">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" />
            </div>
            <div className="gg-field">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required autoFocus placeholder="jane@agency.com" />
            </div>
            <div className="gg-field">
              <label>Company</label>
              <input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Agency name" />
            </div>
            <div className="gg-field">
              <label>Commission Rate (%)</label>
              <input type="number" min="0" max="50" value={form.commissionRate}
                onChange={(e) => set("commissionRate", Number(e.target.value))} />
            </div>
          </div>
          <div className="gg-modal-footer">
            <button type="button" className="gg-btn gg-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="gg-btn gg-btn-primary" disabled={saving}>
              {saving ? "Sending…" : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── PartnersPage ─────────────────────────────────────────────────
export default function PartnersPage() {
  const [partners, setPartners]       = useState([]);
  const [referrals, setReferrals]     = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [tab, setTab]                 = useState("partners"); // partners | referrals | payouts
  const [showInvite, setShowInvite]   = useState(false);
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    Promise.allSettled([
      apiClient.get("/api/partners"),
      apiClient.get("/api/partners/referrals"),
      apiClient.get("/api/partners/commissions"),
    ]).then(([pRes, rRes, cRes]) => {
      if (pRes.status === "fulfilled") setPartners(pRes.value.data.partners || pRes.value.data || []);
      if (rRes.status === "fulfilled") setReferrals(rRes.value.data.referrals || rRes.value.data || []);
      if (cRes.status === "fulfilled") setCommissions(cRes.value.data.commissions || cRes.value.data || []);
      if (pRes.status === "rejected")  setError("Failed to load partner data.");
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approvePayout = async (commissionId) => {
    try {
      await apiClient.put(`/api/partners/commissions/${commissionId}/approve`);
      toast.success("Payout approved.");
      setCommissions((prev) => prev.map((c) =>
        c.id === commissionId ? { ...c, status: "approved" } : c
      ));
    } catch { toast.error("Failed to approve payout."); }
  };

  // Summary stats
  const totalPartners   = partners.length;
  const activePartners  = partners.filter((p) => p.status === "active").length;
  const monthAdj        = new Date(); monthAdj.setDate(1);
  const referralsMonth  = referrals.filter((r) => r.createdAt && new Date(r.createdAt) >= monthAdj).length;
  const commissionsDue  = commissions.filter((c) => c.status === "due").reduce((s, c) => s + (c.amount || 0), 0);
  const conversionRate  = referrals.length > 0
    ? Math.round((referrals.filter((r) => r.status === "converted").length / referrals.length) * 100)
    : 0;

  return (
    <PageWrapper
      title="Partners"
      description="Referral partner management and commission tracking."
      actions={
        <button className="gg-btn gg-btn-primary gg-btn-sm" onClick={() => setShowInvite(true)}>
          <Plus size={14} style={{ marginRight: 4 }} /> Invite Partner
        </button>
      }
    >
      {/* ── KPI Row ─────────────────────────────────────────── */}
      <div className="gg-kpi-row" style={{ marginBottom: 24 }}>
        <div className="gg-kpi-card gg-kpi-card--accent">
          <div className="gg-kpi-top"><span className="gg-kpi-icon gg-kpi-icon--accent"><Users size={15} /></span></div>
          <p className="gg-kpi-value">{totalPartners}</p>
          <p className="gg-kpi-label">Total Partners</p>
          <p className="gg-kpi-sub">{activePartners} active</p>
        </div>
        <div className="gg-kpi-card gg-kpi-card--blue">
          <div className="gg-kpi-top"><span className="gg-kpi-icon gg-kpi-icon--blue"><TrendingUp size={15} /></span></div>
          <p className="gg-kpi-value">{referralsMonth}</p>
          <p className="gg-kpi-label">Referrals This Month</p>
          <p className="gg-kpi-sub">{referrals.length} total</p>
        </div>
        <div className="gg-kpi-card gg-kpi-card--purple">
          <div className="gg-kpi-top"><span className="gg-kpi-icon gg-kpi-icon--purple"><Award size={15} /></span></div>
          <p className="gg-kpi-value">{conversionRate}%</p>
          <p className="gg-kpi-label">Conversion Rate</p>
          <p className="gg-kpi-sub">Referral → client</p>
        </div>
        <div className="gg-kpi-card gg-kpi-card--warn">
          <div className="gg-kpi-top"><span className="gg-kpi-icon gg-kpi-icon--warn"><DollarSign size={15} /></span></div>
          <p className="gg-kpi-value">{fmt$(commissionsDue)}</p>
          <p className="gg-kpi-label">Commissions Due</p>
          <p className="gg-kpi-sub">Pending payout</p>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="gg-tabs" style={{ marginBottom: 20 }}>
        {[
          { key: "partners",  label: `Partners (${totalPartners})` },
          { key: "referrals", label: `Referrals (${referrals.length})` },
          { key: "payouts",   label: `Payouts (${commissions.length})` },
        ].map((t) => (
          <button
            key={t.key}
            className={`gg-tab${tab === t.key ? " gg-tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="gg-empty">Loading partners…</div>
      ) : error ? (
        <div className="gg-empty">{error}</div>
      ) : (
        <>
          {/* ── Partners Tab ──────────────────────────────── */}
          {tab === "partners" && (
            partners.length === 0 ? (
              <div className="gg-empty">
                <Users size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>No partners yet. Invite your first partner.</p>
              </div>
            ) : (
              <div className="gg-table-wrap">
                <table className="gg-table">
                  <thead>
                    <tr>
                      <th>Partner</th>
                      <th>Commission</th>
                      <th>Referrals</th>
                      <th>Converted</th>
                      <th>Total Earned</th>
                      <th>Status</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.name || p.email}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--gg-text-muted)" }}>{p.company || p.email}</div>
                        </td>
                        <td>{p.commissionRate ?? 15}%</td>
                        <td>{p.totalReferrals ?? 0}</td>
                        <td>{p.conversions ?? 0}</td>
                        <td style={{ fontWeight: 700, color: "var(--gg-success)" }}>{fmt$(p.totalEarned ?? 0)}</td>
                        <td>{statusBadge(p.status || "active")}</td>
                        <td style={{ color: "var(--gg-text-muted)" }}>{relTime(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ── Referrals Tab ─────────────────────────────── */}
          {tab === "referrals" && (
            referrals.length === 0 ? (
              <div className="gg-empty">No referrals yet.</div>
            ) : (
              <div className="gg-table-wrap">
                <table className="gg-table">
                  <thead>
                    <tr>
                      <th>Referred Company</th>
                      <th>Partner</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{r.companyName || r.company_name || "–"}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--gg-text-muted)" }}>{r.contactEmail || r.contact_email}</div>
                        </td>
                        <td>{r.partnerName || r.partner_name || "–"}</td>
                        <td>{r.estimatedBudget ? fmt$(r.estimatedBudget) : "–"}</td>
                        <td>{statusBadge(r.status || "new")}</td>
                        <td style={{ color: "var(--gg-text-muted)" }}>{relTime(r.createdAt || r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ── Payouts Tab ───────────────────────────────── */}
          {tab === "payouts" && (
            commissions.length === 0 ? (
              <div className="gg-empty">No commissions recorded yet.</div>
            ) : (
              <div className="gg-table-wrap">
                <table className="gg-table">
                  <thead>
                    <tr>
                      <th>Partner</th>
                      <th>Amount</th>
                      <th>Rate</th>
                      <th>Status</th>
                      <th>Period</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.partnerName || c.partner_name || "–"}</td>
                        <td style={{ fontWeight: 700, color: "var(--gg-success)" }}>{fmt$(c.amount)}</td>
                        <td>{c.rate ?? "–"}%</td>
                        <td>{statusBadge(c.status || "due")}</td>
                        <td style={{ color: "var(--gg-text-muted)" }}>{relTime(c.createdAt || c.created_at)}</td>
                        <td>
                          {c.status === "due" && (
                            <button
                              className="gg-btn gg-btn-success gg-btn-sm"
                              onClick={() => approvePayout(c.id)}
                            >
                              Approve
                            </button>
                          )}
                          {c.status === "approved" && (
                            <span className="gg-badge gg-badge--completed">Approved</span>
                          )}
                          {c.status === "paid" && (
                            <span className="gg-badge gg-badge--completed">Paid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </>
      )}

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvited={(p) => setPartners((prev) => [p, ...prev])}
        />
      )}
    </PageWrapper>
  );
}
