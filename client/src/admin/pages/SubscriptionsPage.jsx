import React, { useCallback, useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import { apiClient } from "../../services/apiClient.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useToast } from "../components/Toast.jsx";

function statusBadge(status) {
  const cls = {
    active:   "gg-badge--active",
    past_due: "gg-badge--overdue",
    cancelled:"gg-badge--cancelled",
    paused:   "gg-badge--paused",
  }[status] || "gg-badge--todo";
  return <span className={`gg-badge ${cls}`}>{status.replace("_", " ")}</span>;
}

export default function SubscriptionsPage() {
  const toast = useToast();
  const [subs, setSubs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [cancelling, setCancelling] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null); // subId awaiting confirm

  const fetchSubs = useCallback(() => {
    setLoading(true);
    apiClient.get("/api/payments/subscriptions")
      .then((res) => setSubs(res.data.subscriptions || []))
      .catch(() => setError("Failed to load subscriptions."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const cancelSub = async (subId) => {
    setCancelling(subId);
    try {
      const res = await apiClient.post(`/api/payments/subscriptions/${subId}/cancel`);
      setSubs((prev) =>
        prev.map((s) => s.id === subId ? { ...s, ...res.data.subscription } : s)
      );
      toast.success("Subscription cancelled.");
    } catch {
      toast.error("Failed to cancel subscription.");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <>
    <PageWrapper title="Subscriptions" description="Recurring client plans and billing cycles.">
      {loading ? (
        <div className="gg-empty">Loading subscriptions…</div>
      ) : error ? (
        <div className="gg-empty">{error}</div>
      ) : (
        <div className="gg-table-wrap">
          <table className="gg-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Plan</th>
                <th>Billing</th>
                <th>Status</th>
                <th>Next Billing</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.length === 0 ? (
                <tr><td colSpan={7} className="gg-empty">No subscriptions found.</td></tr>
              ) : subs.map((sub) => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 500 }}>{sub.clientName || sub.clientId}</td>
                  <td>{sub.planName || sub.planId}</td>
                  <td style={{ textTransform: "capitalize", color: "var(--gg-text-muted)" }}>{sub.billing}</td>
                  <td>{statusBadge(sub.status)}</td>
                  <td style={{ color: "var(--gg-text-muted)" }}>{sub.nextBillingDate || "—"}</td>
                    <td style={{ fontWeight: 600 }}>${sub.planPrice ?? sub.amount ?? "—"}</td>
                  <td>
                    {sub.status === "active" ? (
                      <button
                        className="gg-btn gg-btn-sm gg-btn-danger"
                        disabled={cancelling === sub.id}
                        onClick={() => setConfirmCancel(sub.id)}
                      >
                        {cancelling === sub.id ? "Cancelling…" : "Cancel"}
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "var(--gg-text-muted)" }}>
                        {sub.cancelledAt ? `Cancelled ${sub.cancelledAt}` : "—"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>

    <ConfirmDialog
      open={!!confirmCancel}
      intent="danger"
      title="Cancel Subscription?"
      message="This cannot be undone. The client will immediately lose access to their plan."
      confirmLabel="Cancel Subscription"
      onConfirm={() => { cancelSub(confirmCancel); setConfirmCancel(null); }}
      onCancel={() => setConfirmCancel(null)}
    />
    </>
  );
}
