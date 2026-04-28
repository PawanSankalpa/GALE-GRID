import React from "react";
import {
  DollarSign,
  CreditCard,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import useDashboardData from "../hooks/useDashboardData.js";
import StatCard, {
  DashboardPage,
  SkeletonStats,
  SkeletonPanel,
} from "../components/DashboardWidgets.jsx";

export default function PaymentsSection() {
  const { data: summary, loading: loadingSummary, error: errorSummary } = useDashboardData("/api/payments/summary");
  const { data: invoicesData, loading: loadingInv } = useDashboardData("/api/payments/invoices");
  const { data: subsData, loading: loadingSubs } = useDashboardData("/api/payments/subscriptions");

  if (errorSummary) {
    return (
      <DashboardPage>
        <div className="dash-empty">
          <DollarSign size={40} className="dash-empty-icon" />
          <div className="dash-empty-title">Failed to load payments</div>
          <div className="dash-empty-desc">{errorSummary}</div>
        </div>
      </DashboardPage>
    );
  }

  if (loadingSummary || !summary) {
    return (
      <DashboardPage>
        <SkeletonStats count={4} />
        <SkeletonPanel />
      </DashboardPage>
    );
  }

  const invoices = invoicesData || [];
  const subscriptions = subsData || [];

  return (
    <DashboardPage>
      {/* Payment stats */}
      <div className="dash-stats-grid">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${summary.totalRevenue?.toLocaleString() ?? 0}`} color="green" />
        <StatCard icon={AlertTriangle} label="Outstanding" value={`$${summary.outstanding?.toLocaleString() ?? 0}`} color="red" />
        <StatCard icon={CreditCard} label="Active Subs" value={summary.activeSubscriptions ?? 0} color="blue" />
        <StatCard icon={FileText} label="Total Invoices" value={summary.totalInvoices ?? 0} color="orange" />
      </div>

      <div className="dash-grid-2">
        {/* Subscriptions */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span className="dash-panel-title">Active Subscriptions</span>
            <TrendingUp size={16} style={{ color: "var(--dash-text-muted)" }} />
          </div>
          <div className="dash-panel-body" style={{ padding: 0 }}>
            {loadingSubs ? (
              <div className="dash-empty" style={{ padding: 32 }}>
                <div className="dash-empty-desc">Loading...</div>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="dash-empty" style={{ padding: 32 }}>
                <div className="dash-empty-desc">No subscriptions</div>
              </div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Plan</th>
                    <th>Billing</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600, color: "var(--dash-text)" }}>{s.clientId}</td>
                      <td>{s.planId}</td>
                      <td>{s.billing}</td>
                      <td>
                        <span className={`dash-badge ${s.status}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Invoices */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span className="dash-panel-title">All Invoices</span>
            <FileText size={16} style={{ color: "var(--dash-text-muted)" }} />
          </div>
          <div className="dash-panel-body" style={{ padding: 0 }}>
            {loadingInv ? (
              <div className="dash-empty" style={{ padding: 32 }}>
                <div className="dash-empty-desc">Loading...</div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="dash-empty" style={{ padding: 32 }}>
                <div className="dash-empty-desc">No invoices</div>
              </div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600, color: "var(--dash-text)", fontSize: "0.8rem" }}>
                        {inv.id}
                      </td>
                      <td>{inv.clientId}</td>
                      <td>${inv.amount}</td>
                      <td>
                        <span className={`dash-badge ${inv.status}`}>{inv.status}</span>
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "var(--dash-text-muted)" }}>
                        {new Date(inv.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
