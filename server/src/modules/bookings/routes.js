import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import * as booking from "./service.js";
import { checkTatkalRateLimit, getTatkalQueue } from "../../lib/queue.js";
import { serializeBooking } from "./service.js";

const router = Router();

router.post("/bookings/initiate", optionalAuth, asyncHandler(async (req, res) => {
  const count = Number(req.body.passengerCount || 1);
  const { session, lock, train } = await booking.initiateSession({
    userId: req.user?.id,
    trainNumber: req.body.trainNumber,
    journeyDate: req.body.journeyDate,
    travelClass: req.body.travelClass,
    quota: req.body.quota,
    passengerCount: count,
    isTatkal: false
  });
  res.status(201).json({
    sessionId: session.id,
    status: session.status,
    expiresAt: session.expiresAt,
    seatLock: lock,
    fareTotal: session.fareTotal,
    train: { number: train.number, name: train.name, fare: train.fare }
  });
}));

router.post("/bookings/tatkal/initiate", requireAuth, asyncHandler(async (req, res) => {
  await checkTatkalRateLimit(req.user.id);
  const queue = getTatkalQueue();
  const job = await queue.add("tatkal-initiate", {
    userId: req.user.id,
    ...req.body,
    passengerCount: Number(req.body.passengerCount || 1)
  }, { priority: 1, attempts: 2 });

  res.status(202).json({ jobId: job.id, status: "queued", message: "Tatkal booking queued" });
}));

router.post("/bookings/premium-tatkal/initiate", requireAuth, asyncHandler(async (req, res) => {
  await checkTatkalRateLimit(req.user.id);
  const { session, lock, train } = await booking.initiateSession({
    userId: req.user.id,
    trainNumber: req.body.trainNumber,
    journeyDate: req.body.journeyDate,
    travelClass: req.body.travelClass,
    quota: "PT",
    passengerCount: Number(req.body.passengerCount || 1),
    isTatkal: true
  });
  res.status(201).json({
    sessionId: session.id,
    status: session.status,
    quota: "PT",
    seatLock: lock,
    fareTotal: session.fareTotal,
    train: { number: train.number, name: train.name }
  });
}));

router.post("/bookings/:id/passengers", optionalAuth, asyncHandler(async (req, res) => {
  const session = await booking.addPassengers(req.params.id, req.user?.id, req.body.passengers);
  res.json(serializeBooking(session));
}));

router.post("/bookings/:id/confirm", optionalAuth, asyncHandler(async (req, res) => {
  const session = await booking.confirmSession(
    req.params.id,
    req.user?.id,
    req.headers["idempotency-key"] || req.body.idempotencyKey
  );
  res.json({
    ...serializeBooking(session),
    message: "Booking confirmed in the Bharat Rail prototype.",
    heritageHint: "Reach the station early and look for the architecture story panel near the concourse."
  });
}));

router.get("/bookings", requireAuth, asyncHandler(async (req, res) => {
  const sessions = await booking.listSessions(req.user.id);
  res.json({ bookings: sessions.map(serializeBooking) });
}));

router.get("/bookings/:id", optionalAuth, asyncHandler(async (req, res) => {
  const session = await booking.getSession(req.params.id, req.user?.id);
  res.json(serializeBooking(session));
}));

router.delete("/bookings/:id/cancel-session", optionalAuth, asyncHandler(async (req, res) => {
  const session = await booking.cancelSession(req.params.id, req.user?.id);
  res.json(serializeBooking(session));
}));

router.post("/bookings", optionalAuth, asyncHandler(async (req, res) => {
  const train = req.body.train;
  const passengers = req.body.passengers || [];
  const journeyDate = req.body.journeyDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const { session } = await booking.initiateSession({
    userId: req.user?.id,
    trainNumber: train.number,
    journeyDate,
    travelClass: req.body.travelClass || "CC",
    quota: req.body.quota || "GN",
    passengerCount: passengers.length || 1
  });

  await booking.addPassengers(session.id, req.user?.id, passengers.length ? passengers : [{ name: "Passenger", age: 30, gender: "Male" }]);

  const { createOrder, verifyPayment } = await import("../payments/service.js");
  const payment = await createOrder(session.id, req.user?.id);
  await verifyPayment({ orderId: payment.orderId, paymentRef: "LEGACY-MOCK" });
  const confirmed = await booking.confirmSession(session.id, req.user?.id, req.headers["idempotency-key"]);

  res.status(201).json({
    status: confirmed.status,
    pnr: confirmed.pnr,
    bookingId: confirmed.id,
    message: "Booking confirmed in the Bharat Rail prototype.",
    coach: confirmed.coach,
    berths: confirmed.berths,
    heritageHint: "Reach the station early and look for the architecture story panel near the concourse."
  });
}));

export default router;
