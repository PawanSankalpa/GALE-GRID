import {
  getPlans, getSubscriptionForClient, getAllSubscriptions,
  getInvoicesForClient, getAllInvoices, markInvoicePaid,
  cancelSubscription, getPaymentSummary,
} from "../services/paymentService.js";
import { getClientByUserId } from "../services/clientService.js";

export async function listPlans(req, res) {
  try { return res.json({ plans: await getPlans() }); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function getMySubscription(req, res) {
  try {
    const client = await getClientByUserId(req.user.id);
    if (!client) return res.status(404).json({ message: "No client profile found" });
    const sub = await getSubscriptionForClient(client.id);
    return res.json({ subscription: sub });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function getMyInvoices(req, res) {
  try {
    const client = await getClientByUserId(req.user.id);
    if (!client) return res.status(404).json({ message: "No client profile found" });
    return res.json({ invoices: await getInvoicesForClient(client.id) });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function listAllSubscriptions(req, res) {
  try { return res.json({ subscriptions: await getAllSubscriptions() }); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function listAllInvoices(req, res) {
  try { return res.json({ invoices: await getAllInvoices() }); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function markPaid(req, res) {
  try {
    const result = await markInvoicePaid(req.params.id);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.json(result.invoice);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function cancelSub(req, res) {
  try {
    const result = await cancelSubscription(req.params.id);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.json({ subscription: result.subscription, refundMessage: result.refundMessage });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function paymentOverview(req, res) {
  try { return res.json(await getPaymentSummary()); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}
