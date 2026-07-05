import { prisma } from "../../lib/prisma.js";
import { httpError } from "../../lib/http.js";
import * as booking from "../bookings/service.js";
import * as payments from "../payments/service.js";

export async function cancelBooking(pnr, userId, { partialPassengerIds } = {}) {
  const session = await booking.getSessionByPnr(pnr);
  if (session.status !== "confirmed") throw httpError(400, "Only confirmed bookings can be cancelled");
  if (userId && session.userId && session.userId !== userId) {
    throw httpError(403, "Not allowed to cancel this PNR");
  }

  const isPartial = Array.isArray(partialPassengerIds) && partialPassengerIds.length > 0;
  const refundAmount = isPartial
    ? Math.round((session.fareTotal || 0) * (partialPassengerIds.length / session.passengers.length) * 0.5)
    : Math.round((session.fareTotal || 0) * 0.7);

  await payments.refundPayment(session.id, refundAmount);

  const updated = await prisma.$transaction(async (tx) => {
    const restored = isPartial ? partialPassengerIds.length : session.passengers.length;
    await tx.train.update({
      where: { number: session.trainNumber },
      data: { seats: { increment: restored } }
    });

    return tx.bookingSession.update({
      where: { id: session.id },
      data: {
        status: isPartial ? "partially_cancelled" : "cancelled",
        refundAmount
      },
      include: { passengers: true, payment: true }
    });
  });

  return {
    pnr,
    status: updated.status,
    refundAmount,
    refundStatus: "processing",
    message: "Refund initiated for Bharat Rail prototype gateway"
  };
}

export function refundStatus(pnr) {
  return booking.getSessionByPnr(pnr).then((session) => ({
    pnr,
    bookingStatus: session.status,
    refundAmount: session.refundAmount,
    refundStatus: session.payment?.status === "refunded" ? "completed" : "not_applicable",
    paymentStatus: session.payment?.status
  }));
}
