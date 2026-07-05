import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { fetchLiveStatus } from "../railradar/service.js";

const router = Router();

router.get("/live-status/:trainNumber", asyncHandler(async (req, res) => {
  const live = await fetchLiveStatus(req.params.trainNumber, {
    date: req.query.date,
    haltsOnly: req.query.haltsOnly !== "false"
  });
  res.json(live);
}));

export default router;
