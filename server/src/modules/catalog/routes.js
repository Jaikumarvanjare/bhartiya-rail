import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { prisma } from "../../lib/prisma.js";
import { CLASSES, QUOTAS, filterTrains } from "../../data/constants.js";
import { searchBetweenStations } from "./betweenSearch.js";

const router = Router();

router.get("/classes", (_req, res) => {
  res.json({ classes: CLASSES });
});

router.get("/quotas", (_req, res) => {
  res.json({ quotas: QUOTAS });
});

router.get("/search/between/:from/:to", asyncHandler(async (req, res) => {
  const { from, to } = req.params;
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: "date query parameter is required (YYYY-MM-DD)" });

  const result = await searchBetweenStations({
    from,
    to,
    date,
    fromName: req.query.fromName,
    toName: req.query.toName,
    travelClass: req.query.class || "CC",
    quota: req.query.quota || "GN",
    live: req.query.live !== "false"
  });
  res.json(result);
}));

router.get("/stations", asyncHandler(async (req, res) => {
  const q = (req.query.q || "").toString().toLowerCase();
  const stations = await prisma.station.findMany({ orderBy: { name: "asc" } });
  const filtered = q
    ? stations.filter((s) => [s.code, s.name, s.city, s.region].some((v) => v.toLowerCase().includes(q)))
    : stations;
  res.json({ stations: filtered });
}));

router.get("/stations/:code", asyncHandler(async (req, res) => {
  const station = await prisma.station.findUnique({ where: { code: req.params.code.toUpperCase() } });
  if (!station) return res.status(404).json({ error: "Station not found" });
  res.json({ station });
}));

router.get("/trains", asyncHandler(async (req, res) => {
  const trains = await prisma.train.findMany({ orderBy: { name: "asc" } });
  const filtered = filterTrains(trains, req.query);
  res.json({ count: filtered.length, trains: filtered });
}));

router.get("/trains/:trainNumber", asyncHandler(async (req, res) => {
  const train = await prisma.train.findUnique({ where: { number: req.params.trainNumber } });
  if (!train) return res.status(404).json({ error: "Train not found" });
  res.json({ train });
}));

router.get("/search/trains", asyncHandler(async (req, res) => {
  const trains = await prisma.train.findMany();
  const filtered = filterTrains(trains, req.query);
  res.json({
    from: req.query.from || null,
    to: req.query.to || null,
    date: req.query.date || null,
    count: filtered.length,
    trains: filtered
  });
}));

export default router;
