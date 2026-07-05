import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { optionalAuth } from "../../middleware/auth.js";
import * as cancellation from "./service.js";

const router = Router();

router.post("/cancellation/:pnrNumber", optionalAuth, asyncHandler(async (req, res) => {
  res.json(await cancellation.cancelBooking(req.params.pnrNumber.toUpperCase(), req.user?.id));
}));

router.post("/cancellation/partial", optionalAuth, asyncHandler(async (req, res) => {
  res.json(await cancellation.cancelBooking(req.body.pnr.toUpperCase(), req.user?.id, {
    partialPassengerIds: req.body.passengerIds
  }));
}));

router.get("/cancellation/:pnrNumber/refund-status", asyncHandler(async (req, res) => {
  res.json(await cancellation.refundStatus(req.params.pnrNumber.toUpperCase()));
}));

export default router;
