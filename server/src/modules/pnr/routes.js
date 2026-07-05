import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import * as booking from "../bookings/service.js";

const router = Router();

router.get("/pnr/:pnrNumber", asyncHandler(async (req, res) => {
  const session = await booking.getSessionByPnr(req.params.pnrNumber.toUpperCase());
  res.json({
    pnr: session.pnr,
    status: session.status,
    trainNumber: session.trainNumber,
    journeyDate: session.journeyDate,
    travelClass: session.travelClass,
    quota: session.quota,
    coach: session.coach,
    berths: session.berths,
    passengers: session.passengers,
    fareTotal: session.fareTotal
  });
}));

router.get("/pnr/:pnrNumber/status", asyncHandler(async (req, res) => {
  const session = await booking.getSessionByPnr(req.params.pnrNumber.toUpperCase());
  const chartStatus = session.status === "confirmed" ? "confirmed" : session.status;
  res.json({
    pnr: session.pnr,
    bookingStatus: session.status,
    chartStatus,
    waitlistPosition: session.status === "confirmed" ? null : null,
    racStatus: session.quota === "GN" && session.status === "confirmed" ? "confirmed" : null
  });
}));

export default router;
