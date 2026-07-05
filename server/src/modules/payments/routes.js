import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";
import * as payments from "./service.js";

const router = Router();

router.post("/payments/create-order", optionalAuth, asyncHandler(async (req, res) => {
  const payment = await payments.createOrder(
    req.body.sessionId,
    req.user?.id,
    req.headers["idempotency-key"] || req.body.idempotencyKey
  );
  res.status(201).json({
    orderId: payment.orderId,
    amount: payment.amount,
    currency: "INR",
    sessionId: payment.sessionId
  });
}));

router.post("/payments/verify", optionalAuth, asyncHandler(async (req, res) => {
  const payment = await payments.verifyPayment({
    orderId: req.body.orderId,
    paymentRef: req.body.paymentRef,
    userId: req.user?.id
  });
  res.json({ status: payment.status, orderId: payment.orderId, gatewayRef: payment.gatewayRef });
}));

router.post("/payments/webhook", asyncHandler(async (_req, res) => {
  res.json({ status: "ignored", message: "Mock gateway — use /payments/verify in prototype" });
}));

router.get("/payments/:id/status", optionalAuth, asyncHandler(async (req, res) => {
  const record = await prisma.payment.findFirst({
    where: { OR: [{ id: req.params.id }, { orderId: req.params.id }] },
    include: { session: { select: { id: true, pnr: true, status: true } } }
  });
  if (!record) return res.status(404).json({ error: "Payment not found" });
  res.json(record);
}));

router.get("/payments/history", requireAuth, asyncHandler(async (req, res) => {
  res.json({ payments: await payments.paymentHistory(req.user.id) });
}));

export default router;
