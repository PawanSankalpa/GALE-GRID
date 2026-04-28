import React, { useCallback, useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import { apiClient } from "../../services/apiClient.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useToast } from "../components/Toast.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { Lightbulb, AlertTriangle, Check, X, CheckCircle, Clock } from "lucide-react";

function statusBadge(status) {
  return <span className={`gg-badge gg-badge--${status.toLowerCase()}`}>{status}</span>;
}

// ─── Client Billing View ─────────────────────────────────────
function ClientBillingView() {
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSavings, setShowSavings] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get("/api/payments/my-subscription"),
      apiClient.get("/api/payments/my-invoices"),
    ]).then(([subRes, invRes]) => {
      setSubscription(subRes.data.subscription || null);
      setInvoices(invRes.data.invoices || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="gg-empty">Loading billing…</div>;

  const paidTotal = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter((i) => i.status === "due" || i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const monthlyPrice = subscription?.planPrice || 149;
  const annualSavings = Math.round(monthlyPrice * 12 * 0.2);
  const annualPrice = monthlyPrice * 12 - annualSavings;

  const daysUntilBilling = subscription?.nextBillingDate
    ? Math.max(0, Math.ceil((new Date(subscription.nextBillingDate) - Date.now()) / 86400000))
    : null;

  return (
    <div className="cp-billing-wrap">
      {/* Annual savings strip */}
      {showSavings && subscription?.billing !== "yearly" && (
        <div className="cp-savings-strip">
          <span className="cp-savings-icon"><Lightbulb size={18} /></span>
          <div className="cp-savings-text">
            <h4>Save ${annualSavings}/year by switching to annual</h4>
            <p>Pay ${annualPrice} annually instead of ${monthlyPrice * 12} — that's 2 free months!</p>
          </div>
          <button className="cp-savings-dismiss" onClick={() => setShowSavings(false)} aria-label="Dismiss"><X size={15} /></button>
        </div>
      )}

      {/* Outstanding alert */}
      {outstanding > 0 && (
        <div className="cp-outstanding-alert">
          <span className="cp-outstanding-alert-icon"><AlertTriangle size={18} /></span>
          <div className="cp-outstanding-alert-text">
            <h4>Payment Due — ${outstanding}</h4>
            <p>You have an outstanding balance. Please settle to keep services uninterrupted.</p>
          </div>
          <button className="cp-outstanding-btn">Pay Now</button>
        </div>
      )}

      {/* Payment stat row */}
      <div className="cp-pay-stats">
        <div className="cp-pay-stat">
          <p className="cp-pay-stat-val" style={{ color: "#16a34a" }}>${paidTotal}</p>
          <p className="cp-pay-stat-label">Total Paid</p>
        </div>
        <div className="cp-pay-stat">
          <p className="cp-pay-stat-val" style={{ color: outstanding > 0 ? "#b45309" : "var(--gg-text)" }}>${outstanding}</p>
          <p className="cp-pay-stat-label">Outstanding</p>
        </div>
        <div className="cp-pay-stat">
          <p className="cp-pay-stat-val">{invoices.length}</p>
          <p className="cp-pay-stat-label">Total Invoices</p>
        </div>
      </div>

      <div className="cp-billing-grid">
        {/* Invoice timeline */}
        <div className="cp-inv-timeline">
          <p className="cp-inv-title">Invoice History</p>
          {invoices.length === 0 ? (
            <p className="gg-muted">No invoices yet.</p>
          ) : invoices.map((inv, i) => (
            <div key={inv.id} className="cp-inv-item">
              <div className="cp-inv-dot-col">
                <div className={`cp-inv-icon-wrap cp-inv-icon-wrap--${inv.status}`}>
                  {inv.status === "paid" ? <CheckCircle size={13} /> : inv.status === "overdue" ? <AlertTriangle size={13} /> : <Clock size={13} />}
                </div>
                {i < invoices.length - 1 && <div className="cp-inv-line" />}
              </div>
              <div className="cp-inv-body">
                <p className="cp-inv-desc">{inv.description || `Invoice ${inv.id}`}</p>
                <p className="cp-inv-small">
                  {inv.status === "paid" ? `Paid ${inv.paidAt || inv.dueDate}` : `Due ${inv.dueDate}`}
                </p>
              </div>
              <p className={`cp-inv-amount-col cp-inv-amount--${inv.status}`}>${inv.amount}</p>
            </div>
          ))}
        </div>

        {/* Subscription card */}
        {subscription && (
          <div className="cp-subscription-card">
            <div className="cp-sub-plan-head">
              <span className="cp-sub-plan-name">{subscription.planName}</span>
              <span className="cp-sub-badge">{subscription.status}</span>
            </div>
            <p className="cp-sub-price">${subscription.planPrice}<small>/mo</small></p>
            <p className="cp-sub-next">Next billing: {subscription.nextBillingDate}</p>
            <ul className="cp-sub-features">
              {(subscription.features || []).map((f) => (
                <li key={f} className="cp-sub-feature">
                  <span className="cp-sub-feature-check"><Check size={12} strokeWidth={2.5} /></span> {f}
                </li>
              ))}
            </ul>
            {daysUntilBilling !== null && (
              <div className="cp-sub-countdown">
                <p className="cp-sub-countdown-label">Next invoice in</p>
                <p className="cp-sub-countdown-days">{daysUntilBilling} days</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const { role } = useAuth();

  if (role === "client") {
    return (
      <PageWrapper title="Billing" description="Your subscription, invoices, and payment history.">
        <ClientBillingView />
      </PageWrapper>
    );
  }

  return <AdminPaymentsView />;
}

function AdminPaymentsView() {
  const toast = useToast();
  const [summary, setSummary]   = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [marking, setMarking]   = useState(null); // invoiceId
  const [confirmPay, setConfirmPay] = useState(null); // invoiceId awaiting confirm

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiClient.get("/api/payments/summary"),
      apiClient.get("/api/payments/invoices"),
    ])
      .then(([sumRes, invRes]) => {
        setSummary(sumRes.data);
        setInvoices(invRes.data.invoices || []);
      })
      .catch(() => setError("Failed to load payment data."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const markPaid = async (invoiceId) => {
    setMarking(invoiceId);
    try {
      const res = await apiClient.put(`/api/payments/invoices/${invoiceId}/paid`);
      setInvoices((prev) => prev.map((inv) => inv.id === invoiceId ? { ...inv, ...res.data } : inv));
      toast.success("Invoice marked as paid.");
    } catch {
      toast.error("Failed to update invoice.");
    } finally {
      setMarking(null);
    }
  };

  return (
    <>
    <PageWrapper title="Payments" description="Invoice tracking and revenue overview.">
      {loading ? (
        <div className="gg-empty">Loading payments…</div>
      ) : error ? (
        <div className="gg-empty">{error}</div>
      ) : (
        <>
          {/* Summary stat cards */}
          {summary && (
            <div className="gg-stat-row" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 480 }}>
              <div className="gg-stat-card">
                <p className="gg-stat-label">Total Revenue</p>
                <p className="gg-stat-value gg-stat-value--success">${summary.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="gg-stat-card">
                <p className="gg-stat-label">Outstanding Balance</p>
                <p className="gg-stat-value gg-stat-value--warn">${summary.outstanding.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Invoice table */}
          <div className="gg-table-wrap">
            <table className="gg-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={6} className="gg-empty">No invoices found.</td></tr>
                ) : invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 500 }}>{inv.clientName || inv.clientId}</td>
                    <td style={{ color: "var(--gg-text-muted)" }}>{inv.description}</td>
                    <td style={{ fontWeight: 600 }}>${inv.amount}</td>
                    <td style={{ color: "var(--gg-text-muted)" }}>{inv.dueDate}</td>
                    <td>{statusBadge(inv.status)}</td>
                    <td>
                      {(inv.status === "due" || inv.status === "overdue") ? (
                        <button
                          className="gg-btn gg-btn-sm gg-btn-primary"
                          disabled={marking === inv.id}
                          onClick={() => setConfirmPay(inv.id)}
                        >
                          {marking === inv.id ? "Saving…" : "Mark Paid"}
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--gg-text-muted)" }}>
                          {inv.paidAt ? `Paid ${inv.paidAt}` : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageWrapper>

    <ConfirmDialog
      open={!!confirmPay}
      intent="warning"
      title="Mark Invoice as Paid?"
      message="This will record the invoice as settled. Make sure payment has been received before confirming."
      confirmLabel="Mark as Paid"
      onConfirm={() => { markPaid(confirmPay); setConfirmPay(null); }}
      onCancel={() => setConfirmPay(null)}
    />
    </>
  );
}
