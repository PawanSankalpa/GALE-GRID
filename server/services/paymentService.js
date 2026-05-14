import { db } from "../db/pool.js";

export async function getPlans() {
  const { rows } = await db.query("SELECT * FROM plans ORDER BY price_monthly ASC");
  return rows.map(r => ({
    id: r.id, name: r.name,
    priceMonthly: r.price_monthly, priceYearly: r.price_yearly,
    features: r.features || [],
  }));
}

export async function getSubscriptionForClient(clientId) {
  const { rows } = await db.query(`
    SELECT s.*, pl.name AS plan_name, pl.features AS plan_features,
           CASE WHEN s.billing='yearly' THEN pl.price_yearly ELSE pl.price_monthly END AS plan_price
    FROM subscriptions s
    JOIN plans pl ON pl.id = s.plan_id
    WHERE s.client_id = $1
    LIMIT 1
  `, [clientId]);
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: r.id, clientId: r.client_id, planId: r.plan_id,
    billing: r.billing, status: r.status,
    startDate: r.start_date, nextBillingDate: r.next_billing_date,
    planName: r.plan_name, planPrice: r.plan_price, planFeatures: r.plan_features || [],
  };
}

export async function getAllSubscriptions() {
  const { rows } = await db.query(`
    SELECT s.*, pl.name AS plan_name, cl.company AS client_name,
           CASE WHEN s.billing='yearly' THEN pl.price_yearly ELSE pl.price_monthly END AS plan_price
    FROM subscriptions s
    JOIN plans pl ON pl.id = s.plan_id
    JOIN clients cl ON cl.id = s.client_id
    ORDER BY s.start_date DESC
  `);
  return rows.map(r => ({
    id: r.id, clientId: r.client_id, planId: r.plan_id,
    billing: r.billing, status: r.status,
    startDate: r.start_date, nextBillingDate: r.next_billing_date,
    planName: r.plan_name, planPrice: r.plan_price, clientName: r.client_name,
  }));
}

export async function getInvoicesForClient(clientId) {
  const { rows } = await db.query(
    "SELECT * FROM invoices WHERE client_id=$1 ORDER BY issued_at DESC", [clientId]
  );
  return rows.map(normaliseInvoice);
}

export async function getAllInvoices() {
  const { rows } = await db.query(`
    SELECT i.*, c.company AS client_name
    FROM invoices i JOIN clients c ON c.id = i.client_id
    ORDER BY i.issued_at DESC
  `);
  return rows.map(normaliseInvoice);
}

export async function markInvoicePaid(invoiceId) {
  const today = new Date().toISOString().split("T")[0];
  const { rows } = await db.query(
    "UPDATE invoices SET status='paid', paid_at=$1 WHERE id=$2 RETURNING *",
    [today, invoiceId]
  );
  if (!rows[0]) return { error: "Invoice not found" };
  return { invoice: normaliseInvoice(rows[0]) };
}

export async function cancelSubscription(subscriptionId) {
  const { rows } = await db.query("SELECT * FROM subscriptions WHERE id=$1", [subscriptionId]);
  if (!rows[0]) return { error: "Subscription not found" };
  const sub = rows[0];
  if (sub.status === "cancelled") return { error: "Already cancelled" };

  const days = Math.floor((Date.now() - new Date(sub.start_date)) / 86_400_000);
  const refundMessage = days <= 7
    ? "Full refund issued (cancelled within 7-day window)"
    : days <= 30
      ? "Pro-rated refund will be applied"
      : "No refund — service active until billing period ends";

  const today = new Date().toISOString().split("T")[0];
  await db.query(
    "UPDATE subscriptions SET status='cancelled', cancelled_at=$1 WHERE id=$2",
    [today, subscriptionId]
  );
  return { subscription: { ...sub, status: "cancelled", cancelledAt: today }, refundMessage };
}

export async function getPaymentSummary() {
  const { rows } = await db.query(`
    SELECT
      COALESCE(SUM(CASE WHEN status='paid' THEN amount ELSE 0 END),0)    AS total_revenue,
      COALESCE(SUM(CASE WHEN status IN('due','overdue') THEN amount ELSE 0 END),0) AS outstanding,
      COUNT(*) FILTER (WHERE status='paid')    AS paid_count,
      COUNT(*)                                  AS total_invoices
    FROM invoices
  `);
  const { rows: subs } = await db.query(
    "SELECT COUNT(*) FILTER (WHERE status='active') AS active, COUNT(*) FILTER (WHERE status='cancelled') AS cancelled FROM subscriptions"
  );
  return {
    totalRevenue:          Number(rows[0].total_revenue),
    outstanding:           Number(rows[0].outstanding),
    activeSubscriptions:   Number(subs[0].active),
    cancelledSubscriptions:Number(subs[0].cancelled),
    totalInvoices:         Number(rows[0].total_invoices),
  };
}

function normaliseInvoice(r) {
  return {
    id: r.id, clientId: r.client_id, subscriptionId: r.subscription_id,
    amount: r.amount, status: r.status,
    issuedAt: r.issued_at, paidAt: r.paid_at, dueDate: r.due_date,
    description: r.description, clientName: r.client_name || undefined,
  };
}
