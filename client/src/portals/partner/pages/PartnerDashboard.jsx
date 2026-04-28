/**
 * client/src/portals/partner/pages/PartnerDashboard.jsx
 * Partner home — stats overview, referral link, recent activity.
 */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../services/apiClient.js";
import { useAuth } from "../../../hooks/useAuth.js";
import { TrendingUp, Users, DollarSign, Award, Copy, Check, ChevronRight } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
function fmt$(n) {
  if (n == null) return "$0";
  const num = Number(n);
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

function relTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── useCountUp ───────────────────────────────────────────────────
function useCountUp(target, duration = 600) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (target == null || isNaN(Number(target))) { setVal(target); return; }
    const to = Number(target);
    const start = performance.now();
    const step = (now) => {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return val;
}

// ── KpiTile ──────────────────────────────────────────────────────
function KpiTile({ label, value, sub, accent, icon }) {
  const numeric = typeof value === "number" ? value : null;
  const counted = useCountUp(numeric);
  const display = numeric !== null ? counted.toLocaleString() : value;
  return (
    <div className={`pp-kpi-card pp-kpi-card--${accent}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ color: accent === "success" ? "var(--pp-success)" : accent === "warn" ? "var(--pp-warn)" : "var(--pp-accent)", opacity: 0.75 }}>
          {icon}
        </div>
      </div>
      <p className="pp-kpi-value">{display}</p>
      <p className="pp-kpi-label">{label}</p>
      {sub && <p className="pp-kpi-sub">{sub}</p>}
    </div>
  );
}

// ── ReferralLinkBox ──────────────────────────────────────────────
function ReferralLinkBox({ code }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}?ref=${code || "YOUR_CODE"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="pp-referral-box">
      <div style={{ flex: 1 }}>
        <p className="pp-referral-label">Your Referral Link</p>
        <div className="pp-referral-link-row">
          <input className="pp-referral-input" value={link} readOnly />
          <button className="pp-copy-btn" onClick={handleCopy}>
            {copied ? <><Check size={12} style={{ marginRight: 4 }} />Copied!</> : <><Copy size={12} style={{ marginRight: 4 }} />Copy</>}
          </button>
        </div>
      </div>
      {code && (
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Code</p>
          <p style={{ margin: "2px 0 0", fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "0.1em" }}>{code}</p>
        </div>
      )}
    </div>
  );
}

// ── PartnerDashboard ─────────────────────────────────────────────
export default function PartnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/partners/me/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.name || "Partner";
  const stats       = data?.stats       || {};
  const referrals   = data?.referrals   || [];
  const earnings    = data?.earnings    || [];
  const referralCode = data?.referralCode || user?.referralCode || "";

  const pendingPayout = (data?.commissions || [])
    .filter((c) => c.status === "due")
    .reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div>
      <div className="pp-page-header">
        <h1 className="pp-page-title">
          {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"},{" "}
          {displayName.split(" ")[0]}
        </h1>
        <p className="pp-page-sub">Your referral performance at a glance.</p>
      </div>

      {/* Referral link strip */}
      <ReferralLinkBox code={referralCode} />

      {/* KPI tiles */}
      {loading ? (
        <div className="pp-empty" style={{ padding: "24px 0" }}>Loading…</div>
      ) : (
        <div className="pp-kpi-row">
          <KpiTile label="Total Referrals"    value={stats.totalReferrals ?? referrals.length} sub="All time"           accent="accent"  icon={<Users size={16} />} />
          <KpiTile label="Converted"          value={stats.converted      ?? 0}                sub="Became clients"    accent="success" icon={<Award size={16} />} />
          <KpiTile label="Pending Payout"     value={`$${pendingPayout}`}                      sub="Awaiting approval" accent="warn"    icon={<DollarSign size={16} />} />
          <KpiTile label="Total Earned"       value={fmt$(stats.totalEarned ?? 0)}             sub="Commission paid"   accent="success" icon={<TrendingUp size={16} />} />
        </div>
      )}

      {/* Recent referrals */}
      <div className="pp-card">
        <div className="pp-card-header">
          <h3 className="pp-card-title">Recent Referrals</h3>
          <button
            className="pp-copy-btn"
            style={{ background: "transparent", color: "var(--pp-accent)", padding: "4px 8px", fontSize: "0.78rem" }}
            onClick={() => navigate("/partner/leads")}
          >
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="pp-card-body" style={{ padding: 0 }}>
          {referrals.length === 0 ? (
            <div className="pp-empty">No referrals yet. Share your link to get started!</div>
          ) : (
            <table className="pp-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {referrals.slice(0, 5).map((r, i) => (
                  <tr key={r.id || i}>
                    <td style={{ fontWeight: 600 }}>{r.companyName || r.company_name || "–"}</td>
                    <td>
                      <span className={`pp-badge pp-badge--${(r.status || "new").toLowerCase()}`}>{r.status || "New"}</span>
                    </td>
                    <td style={{ color: "var(--pp-text-muted)", fontSize: "0.78rem" }}>
                      {relTime(r.createdAt || r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent earnings */}
      <div className="pp-card">
        <div className="pp-card-header">
          <h3 className="pp-card-title">Recent Earnings</h3>
          <button
            className="pp-copy-btn"
            style={{ background: "transparent", color: "var(--pp-accent)", padding: "4px 8px", fontSize: "0.78rem" }}
            onClick={() => navigate("/partner/earnings")}
          >
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="pp-card-body">
          {earnings.length === 0 ? (
            <p style={{ margin: 0, color: "var(--pp-text-muted)", fontSize: "0.84rem" }}>
              Earnings will appear here once referrals convert.
            </p>
          ) : (
            <div className="pp-timeline">
              {earnings.slice(0, 5).map((e, i) => (
                <div key={e.id || i} className="pp-tl-item">
                  <div className="pp-tl-left">
                    <div className={`pp-tl-dot${e.status === "paid" ? " pp-tl-dot--success" : ""}`} />
                    {i < earnings.length - 1 && <div className="pp-tl-line" />}
                  </div>
                  <div className="pp-tl-body">
                    <p className="pp-tl-label">{e.clientName || e.client_name || "Client"}</p>
                    <p className="pp-tl-amount">{fmt$(e.amount)}</p>
                    <p className="pp-tl-time">{relTime(e.createdAt || e.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
