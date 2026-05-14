import express from "express";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  listPlans,
  getMySubscription,
  getMyInvoices,
  listAllSubscriptions,
  listAllInvoices,
  markPaid,
  cancelSub,
  paymentOverview,
} from "../controllers/paymentController.js";

const router = express.Router();

router.use(authenticateJwt);

// Public (any authenticated user)
router.get("/plans", listPlans);

// Client self-service
router.get("/my-subscription", authorizeRoles("client"), getMySubscription);
router.get("/my-invoices", authorizeRoles("client"), getMyInvoices);

// Admin
router.get("/subscriptions", authorizeRoles("admin"), listAllSubscriptions);
router.get("/invoices", authorizeRoles("admin"), listAllInvoices);
router.get("/summary", authorizeRoles("admin"), paymentOverview);
router.put("/invoices/:id/paid", authorizeRoles("admin"), markPaid);
router.post("/subscriptions/:id/cancel", authorizeRoles("admin"), cancelSub);

export default router;
