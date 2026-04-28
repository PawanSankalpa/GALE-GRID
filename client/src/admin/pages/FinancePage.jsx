/**
 * client/src/admin/pages/FinancePage.jsx
 * Executive finance summary — revenue KPIs, chart, and invoice table.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper.jsx";
import { apiClient } from "../../services/apiClient.js";
import { ArrowRight, CheckCircle, Clock, TrendingUp } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
function fmt$(n) {
  if (n == null) return "$0";
  const num = Number(n);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1000)      return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

function agingDays(issuedAt) {
  if (!issuedAt) return null;
  return Math.ceil((Date.now() - new Date(issuedAt).getTime()) / 86400000);
}

function agingLabel(days) {
  if (days == null) return "–";
  if (days === 0)   return "Today";
  if (days < 0)     return "Upcoming";
  return `${days}d`;
}

function agingColor(days, status) {
  if (status === "paid") return "var(--gg-success, #22c55e)";
  if (days == null) return "";
  if (days > 30) return "#ef4444";
  if (days > 14) return "#eab308";
  return "var(--gg-text-muted, #64748b)";
}

// ── Revenue Mini-Chart ───────────────────────────────────────────
function RevChart({ bars = [] }) {
  const max = Math.max(...bars.map((b) => b.amount), 1);
  return (
    <div className="gg-rev-chart">
      {bars.map((b) => {
        const pct = Math.max(Math.round((b.amount / max) * 100), b.amount > 0 ? 6 : 0);
        return (
          <div key={b.month} className="gg-rev-bar-wrap">
            <span className="gg-rev-bar-value">{b.amount > 0 ? fmt$(b.amount) : ""}</span>
            <div
              className={`gg-rev-bar${b.amount === 0 ? " gg-rev-bar--empty" : ""}`}
              style={{ height: `${pct}%` }}
            />
            <span className="gg-rev-bar-label">{b.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── FinancePage ──────────────────────────────────────────────────
export default function FinancePage() {
  const navigate = useNavigate();
  const [summary, setSummary]     = useState(null);
  const [invoices, setInvoices]   = useState([]);
  const [chart, setChart]         = useState([]);
  const [ytd, setYtd]             = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    Promise.allSettled([
      apiClient.get("/api/payments/summary"),
      apiClient.get("/api/payments/invoices"),
      apiClient.get("/api/dashboard/admin"),
    ]).then(([sumRes, invRes, dashRes]) => {
      if (sumRes.status === "fulfilled") setSummary(sumRes.value.data);
      if (invRes.status === "fulfilled") setInvoices(invRes.value.data.invoices || []);
      if (dashRes.status === "fulfilled") {
        const d = dashRes.value.data;
        setChart(d.revenueChart || []);
        setYtd(d.ytdRevenue || 0);
      }
    }).catch(() => setError("Failed to load finance data."))
      .finally(() => setLoading(false));
  }, []);

  const activeMrr = invoices
    .filter((i) => i.status === "paid" && i.type === "subscription")
    .reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <PageWrapper title="Finance" description="Revenue overview, invoices, and payment status.">
      {loading ? (
        <div className="gg-empty">Loading finance data…</div>
      ) : error ? (
        <div className="gg-empty">{error}</div>
      ) : (
        <>
          {/* ── KPI tiles ─────────────────────────────────────── */}
          <div className="gg-kpi-row" style={{ marginBottom: 20 }}>
            <div className="gg-kpi-card gg-kpi-card--success">
              <div className="gg-kpi-top">
                <span className="gg-kpi-icon gg-kpi-icon--success"><TrendingUp size={15} /></span>
              </div>
              <p className="gg-kpi-value">{fmt$(summary?.totalRevenue ?? 0)}</p>
              <p className="gg-kpi-label">Revenue MTD</p>
            </div>

            <div className="gg-kpi-card gg-kpi-card--blue">
              <div className="gg-kpi-top">
                <span className="gg-kpi-icon gg-kpi-icon--blue"><TrendingUp size={15} /></span>
              </div>
              <p className="gg-kpi-value">{fmt$(ytd)}</p>
              <p className="gg-kpi-label">YTD Revenue</p>
            </div>

            <div className="gg-kpi-card gg-kpi-card--warn">
              <div className="gg-kpi-top">
                <span className="gg-kpi-icon gg-kpi-icon--warn"><Clock size={15} /></span>
              </div>
              <p className="gg-kpi-value">{fmt$(summary?.outstanding ?? 0)}</p>
              <p className="gg-kpi-label">Outstanding</p>
            </div>

            <div className="gg-kpi-card gg-kpi-card--purple">
              <div className="gg-kpi-top">
                <span className="gg-kpi-icon gg-kpi-icon--purple"><CheckCircle size={15} /></span>
              </div>
              <p className="gg-kpi-value">{fmt$(activeMrr)}</p>
              <p className="gg-kpi-label">Active MRR</p>
              <p className="gg-kpi-sub">Subscription revenue</p>
            </div>
          </div>

          {/* ── Revenue chart ─────────────────────────────────── */}
          {chart.length > 0 && (
            <div className="gg-card" style={{ marginBottom: 20 }}>
              <div className="gg-card-header">
                <h3 className="gg-card-title">Revenue Overview</h3>
                <div className="gg-rev-header">
                  <p className="gg-rev-total">{fmt$(ytd)}</p>
                  <p className="gg-rev-ytd-label">year to date</p>
                </div>
              </div>
              <div className="gg-card-body">
                <RevChart bars={chart} />
              </div>
            </div>
          )}

          {/* ── Invoices table ────────────────────────────────── */}
          <div className="gg-card" style={{ marginBottom: 20 }}>
            <div className="gg-card-header">
              <h3 className="gg-card-title">Invoices</h3>
              <button
                className="gg-btn gg-btn-ghost gg-btn-sm"
                onClick={() => navigate("/admin/payments")}
              >
                Full view <ArrowRight size={12} style={{ marginLeft: 4 }} />
              </button>
            </div>
            <div className="gg-card-body" style={{ padding: 0 }}>
              <div className="gg-table-wrap">
                <table className="gg-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Aging</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="gg-empty">No invoices found.</td>
                      </tr>
                    ) : invoices.slice(0, 20).map((inv) => {
                      const days = agingDays(inv.issued_at || inv.created_at);
                      return (
                        <tr key={inv.id}>
                          <td>{inv.client_name || inv.clientName || "—"}</td>
                          <td style={{ fontWeight: 700 }}>{fmt$(inv.amount)}</td>
                          <td>
                            <span className={`gg-badge gg-badge--${(inv.status || "").toLowerCase()}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td style={{ color: agingColor(days, inv.status), fontWeight: 600 }}>
                            {agingLabel(days)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Quick links ───────────────────────────────────── */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              className="gg-btn gg-btn-secondary"
              onClick={() => navigate("/admin/payments")}
            >
              Manage Invoices <ArrowRight size={14} style={{ marginLeft: 4 }} />
            </button>
            <button
              className="gg-btn gg-btn-ghost"
              onClick={() => navigate("/admin/subscriptions")}
            >
              Subscriptions <ArrowRight size={14} style={{ marginLeft: 4 }} />
            </button>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
