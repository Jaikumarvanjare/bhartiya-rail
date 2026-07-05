import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { optionalAuth } from "../../middleware/auth.js";
import * as seats from "./service.js";

const router = Router();

router.post("/seats/lock", optionalAuth, asyncHandler(async (req, res) => {
  const result = await seats.lockSeats({
    trainNumber: req.body.trainNumber,
    journeyDate: req.body.journeyDate,
    count: Number(req.body.count || 1),
    userId: req.user?.id
  });
  res.status(201).json(result);
}));

router.delete("/seats/lock/:lockId", optionalAuth, asyncHandler(async (req, res) => {
  res.json(await seats.releaseLockById(req.params.lockId));
}));

export default router;
