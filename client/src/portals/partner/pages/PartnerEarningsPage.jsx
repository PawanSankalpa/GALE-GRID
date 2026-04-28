/**
 * client/src/portals/partner/pages/PartnerEarningsPage.jsx
 * Partner commissions, payout history, and earnings breakdown.
 */
import React, { useEffect, useState } from "react";
import { apiClient } from "../../../services/apiClient.js";
import { DollarSign, Clock, CheckCircle, TrendingUp } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
function fmt$(n) {
  if (n == null) return "$0";
  const num = Number(n);
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

function relTime(iso) {
  if (!iso) return "–";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function badgeCls(status) {
  return ({
    paid:     "pp-badge--paid",
    approved: "pp-badge--active",
    due:      "pp-badge--due",
    pending:  "pp-badge--pending",
  })[status?.toLowerCase()] || "pp-badge--pending";
}

// ── PartnerEarningsPage ──────────────────────────────────────────
export default function PartnerEarningsPage() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      apiClient.get("/api/partners/me/earnings"),
      apiClient.get("/api/partners/me/dashboard"),
    ]).then(([earningsRes, dashRes]) => {
      const earnings    = earningsRes.status === "fulfilled" ? (earningsRes.value.data.commissions || earningsRes.value.data || []) : [];
      const dashData    = dashRes.status === "fulfilled" ? dashRes.value.data : {};
      setData({ earnings, stats: dashData.stats || {} });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pp-empty">Loading earnings…</div>;

  const { earnings = [], stats = {} } = data || {};
  const totalEarned  = earnings.filter((e) => e.status === "paid").reduce((s, e)  => s + (e.amount || 0), 0);
  const pending      = earnings.filter((e) => e.status === "due"  || e.status === "pending").reduce((s, e) => s + (e.amount || 0), 0);
  const approved     = earnings.filter((e) => e.status === "approved").reduce((s, e) => s + (e.amount || 0), 0);
  const commissionRate = earnings[0]?.rate ?? stats.commissionRate ?? 15;

  return (
    <div>
      <div className="pp-page-header">
        <h1 className="pp-page-title">My Earnings</h1>
        <p className="pp-page-sub">Commission history and payout status.</p>
      </div>

      {/* KPI tiles */}
      <div className="pp-kpi-row">
        <div className="pp-kpi-card pp-kpi-card--success">
          <div style={{ color: "var(--pp-success)", marginBottom: 8 }}><DollarSign size={18} /></div>
          <p className="pp-kpi-value">{fmt$(totalEarned)}</p>
          <p className="pp-kpi-label">Total Paid Out</p>
        </div>
        <div className="pp-kpi-card pp-kpi-card--warn">
          <div style={{ color: "var(--pp-warn)", marginBottom: 8 }}><Clock size={18} /></div>
          <p className="pp-kpi-value">{fmt$(pending)}</p>
          <p className="pp-kpi-label">Pending</p>
          <p className="pp-kpi-sub">Awaiting approval</p>
        </div>
        <div className="pp-kpi-card pp-kpi-card--accent">
          <div style={{ color: "var(--pp-accent)", marginBottom: 8 }}><CheckCircle size={18} /></div>
          <p className="pp-kpi-value">{fmt$(approved)}</p>
          <p className="pp-kpi-label">Approved</p>
          <p className="pp-kpi-sub">Processing payout</p>
        </div>
        <div className="pp-kpi-card">
          <div style={{ color: "var(--pp-text-muted)", marginBottom: 8 }}><TrendingUp size={18} /></div>
          <p className="pp-kpi-value">{commissionRate}%</p>
          <p className="pp-kpi-label">Your Rate</p>
          <p className="pp-kpi-sub">Commission rate</p>
        </div>
      </div>

      {/* Earnings breakdown bar */}
      {(totalEarned + pending + approved) > 0 && (
        <div className="pp-card" style={{ marginBottom: 20 }}>
          <div className="pp-card-header">
            <h3 className="pp-card-title">Earnings Breakdown</h3>
          </div>
          <div className="pp-card-body">
            <div className="pp-stat-bar-row">
              {[
                { label: "Paid",     value: totalEarned, total: totalEarned + pending + approved, color: "var(--pp-success)" },
                { label: "Approved", value: approved,    total: totalEarned + pending + approved, color: "var(--pp-accent)" },
                { label: "Pending",  value: pending,     total: totalEarned + pending + approved, color: "var(--pp-warn)" },
              ].map((s) => (
                <div key={s.label} className="pp-stat-bar-item">
                  <span className="pp-stat-bar-label">{s.label}</span>
                  <div className="pp-stat-bar-track">
                    <div
                      className="pp-stat-bar-fill"
                      style={{
                        width: `${s.total > 0 ? Math.round((s.value / s.total) * 100) : 0}%`,
                        background: s.color,
                      }}
                    />
                  </div>
                  <span className="pp-stat-bar-val">{fmt$(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Commission history */}
      <div className="pp-card">
        <div className="pp-card-header">
          <h3 className="pp-card-title">Commission History</h3>
          <p className="pp-card-sub">{earnings.length} entries</p>
        </div>
        {earnings.length === 0 ? (
          <div className="pp-empty">No earnings yet. Commissions appear when referrals convert.</div>
        ) : (
          <div className="pp-table-wrap">
            <table className="pp-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((e, i) => (
                  <tr key={e.id || i}>
                    <td style={{ fontWeight: 600 }}>{e.clientName || e.client_name || "–"}</td>
                    <td style={{ fontWeight: 700, color: "var(--pp-success)" }}>{fmt$(e.amount)}</td>
                    <td style={{ color: "var(--pp-text-muted)" }}>{e.rate ?? commissionRate}%</td>
                    <td><span className={`pp-badge ${badgeCls(e.status)}`}>{e.status || "pending"}</span></td>
                    <td style={{ color: "var(--pp-text-muted)", fontSize: "0.78rem" }}>{relTime(e.paidAt || e.paid_at || e.createdAt || e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
