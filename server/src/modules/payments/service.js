import crypto from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { httpError } from "../../lib/http.js";
import * as booking from "../bookings/service.js";

export async function createOrder(sessionId, userId, idempotencyKey) {
  const session = await booking.getSession(sessionId, userId);
  if (!["passengers_added", "payment_pending"].includes(session.status)) {
    throw httpError(400, "Add passengers before payment");
  }

  if (idempotencyKey) {
    const existing = await prisma.payment.findUnique({ where: { idempotencyKey } });
    if (existing) return prisma.payment.findUnique({ where: { id: existing.id } });
  }

  const orderId = `ORD${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
  const payment = await prisma.payment.upsert({
    where: { sessionId },
    create: {
      sessionId,
      orderId,
      amount: session.fareTotal,
      idempotencyKey: idempotencyKey || null
    },
    update: { amount: session.fareTotal }
  });

  await prisma.bookingSession.update({
    where: { id: sessionId },
    data: { status: "payment_pending" }
  });

  return payment;
}

export async function verifyPayment({ orderId, paymentRef, userId }) {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: { session: { include: { passengers: true } } }
  });
  if (!payment) throw httpError(404, "Payment order not found");
  if (userId && payment.session.userId && payment.session.userId !== userId) {
    throw httpError(403, "Not allowed");
  }
  if (payment.status === "paid") return payment;

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "paid", gatewayRef: paymentRef || `MOCK-${Date.now()}` }
  });

  await prisma.bookingSession.update({
    where: { id: payment.sessionId },
    data: { status: "paid" }
  });

  return updated;
}

export async function refundPayment(sessionId, amount) {
  const payment = await prisma.payment.findUnique({ where: { sessionId } });
  if (!payment || payment.status !== "paid") throw httpError(400, "No paid payment to refund");

  return prisma.payment.update({
    where: { id: payment.id },
    data: { status: "refunded" }
  });
}

export function paymentHistory(userId) {
  return prisma.payment.findMany({
    where: { session: { userId } },
    orderBy: { createdAt: "desc" },
    include: { session: { select: { pnr: true, trainNumber: true, journeyDate: true } } }
  });
}
