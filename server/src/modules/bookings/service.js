import crypto from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { httpError } from "../../lib/http.js";
import { makePnr } from "../../data/constants.js";
import * as seats from "../seats/service.js";
import { SEAT_LOCK_TTL } from "../../lib/redis.js";

const SESSION_TTL_MS = SEAT_LOCK_TTL * 1000;

function calcFare(fare, count) {
  const base = fare * count;
  const gst = Math.round(base * 0.05);
  return base + gst;
}

export async function initiateSession({ userId, trainNumber, journeyDate, travelClass, quota, passengerCount, isTatkal }) {
  const train = await prisma.train.findUnique({ where: { number: trainNumber } });
  if (!train) throw httpError(404, "Train not found");
  if (train.seats < passengerCount) throw httpError(409, "Not enough seats on train");

  const lock = await seats.lockSeats({
    trainNumber,
    journeyDate,
    count: passengerCount,
    userId
  });

  const session = await prisma.bookingSession.create({
    data: {
      userId: userId || null,
      trainNumber,
      journeyDate,
      travelClass: travelClass || "CC",
      quota: quota || "GN",
      status: "initiated",
      seatLockId: lock.lockId,
      coach: lock.coach,
      berths: lock.berths,
      fareTotal: calcFare(train.fare, passengerCount),
      isTatkal: Boolean(isTatkal),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS)
    }
  });

  return { session, lock, train };
}

export async function addPassengers(sessionId, userId, passengers) {
  if (!Array.isArray(passengers) || !passengers.length) {
    throw httpError(400, "passengers array is required");
  }

  const session = await getOwnedSession(sessionId, userId);
  if (!["initiated", "passengers_added"].includes(session.status)) {
    throw httpError(400, "Cannot add passengers in current state");
  }
  if (passengers.length !== session.berths.length) {
    throw httpError(400, "Passenger count must match locked berths");
  }

  await prisma.bookingPassenger.deleteMany({ where: { sessionId } });
  await prisma.bookingPassenger.createMany({
    data: passengers.map((p) => ({
      sessionId,
      name: p.name,
      age: Number(p.age),
      gender: p.gender,
      berthPref: p.berthPref || null
    }))
  });

  const train = await prisma.train.findUnique({ where: { number: session.trainNumber } });
  const updated = await prisma.bookingSession.update({
    where: { id: sessionId },
    data: {
      status: "passengers_added",
      fareTotal: calcFare(train.fare, passengers.length)
    },
    include: { passengers: true }
  });

  return updated;
}

export async function cancelSession(sessionId, userId) {
  const session = await getOwnedSession(sessionId, userId);
  if (session.status === "confirmed") throw httpError(400, "Cannot cancel confirmed booking here");

  if (session.seatLockId) {
    await seats.releaseLockById(session.seatLockId).catch(() => {});
  }

  return prisma.bookingSession.update({
    where: { id: sessionId },
    data: { status: "cancelled" }
  });
}

export async function confirmSession(sessionId, userId, idempotencyKey) {
  const session = await getOwnedSession(sessionId, userId, { includePayment: true, includePassengers: true });

  if (session.status === "confirmed" && session.pnr) {
    return session;
  }

  if (idempotencyKey) {
    const existing = await prisma.bookingSession.findUnique({ where: { idempotencyKey } });
    if (existing?.pnr) return existing;
  }

  if (session.payment?.status !== "paid") {
    throw httpError(402, "Payment required before confirmation");
  }

  const pnr = session.pnr || makePnr(Date.now());
  const count = session.passengers?.length || session.berths.length;

  const result = await prisma.$transaction(async (tx) => {
    const train = await tx.train.findUnique({ where: { number: session.trainNumber } });
    if (!train || train.seats < count) throw httpError(409, "Seats sold out");

    await tx.train.update({
      where: { number: session.trainNumber },
      data: { seats: { decrement: count } }
    });

    return tx.bookingSession.update({
      where: { id: sessionId },
      data: {
        status: "confirmed",
        pnr,
        idempotencyKey: idempotencyKey || session.idempotencyKey || crypto.randomUUID()
      },
      include: { passengers: true, payment: true }
    });
  });

  if (session.seatLockId) {
    await seats.releaseLockById(session.seatLockId).catch(() => {});
  }

  return result;
}

export async function listSessions(userId) {
  return prisma.bookingSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { passengers: true, payment: true }
  });
}

export async function getSession(sessionId, userId) {
  return getOwnedSession(sessionId, userId, { includePayment: true, includePassengers: true });
}

export async function getSessionByPnr(pnr) {
  const session = await prisma.bookingSession.findUnique({
    where: { pnr },
    include: { passengers: true, payment: true, user: { select: { name: true, email: true } } }
  });
  if (!session) throw httpError(404, "PNR not found");
  return session;
}

async function getOwnedSession(sessionId, userId, opts = {}) {
  const session = await prisma.bookingSession.findUnique({
    where: { id: sessionId },
    include: {
      passengers: opts.includePassengers,
      payment: opts.includePayment
    }
  });
  if (!session) throw httpError(404, "Booking session not found");
  if (userId && session.userId && session.userId !== userId) {
    throw httpError(403, "Not allowed to access this booking");
  }
  if (session.expiresAt < new Date() && session.status !== "confirmed") {
    throw httpError(410, "Booking session expired");
  }
  return session;
}

export function serializeBooking(session) {
  return {
    bookingId: session.id,
    pnr: session.pnr,
    status: session.status,
    trainNumber: session.trainNumber,
    journeyDate: session.journeyDate,
    travelClass: session.travelClass,
    quota: session.quota,
    coach: session.coach,
    berths: session.berths,
    fareTotal: session.fareTotal,
    passengers: session.passengers,
    payment: session.payment,
    isTatkal: session.isTatkal,
    refundAmount: session.refundAmount
  };
}
