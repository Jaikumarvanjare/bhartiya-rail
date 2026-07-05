import { Router } from "express";
import * as rr from "../../lib/railradar.js";
import { asyncHandler } from "../../lib/http.js";
import { fetchTrainDetails, fetchLiveStatus, proxy } from "./service.js";

const router = Router();

const bool = (v, fallback = false) => (v === undefined ? fallback : v !== "false");

// Trains — register /between before /:trainNumber
router.get("/integrations/railradar", (_req, res) => {
  res.json({
    provider: "RailRadar",
    docs: "https://railradar.in/docs",
    configured: rr.railradarConfigured(),
    routes: [
      { method: "GET", path: "/trains/:trainNumber/details", upstream: "/v1/trains/{number}" },
      { method: "GET", path: "/trains/:trainNumber/live", upstream: "/v1/trains/{number}/live" },
      { method: "GET", path: "/live-status/:trainNumber", upstream: "/v1/trains/{number}/live", note: "UI alias" },
      { method: "GET", path: "/trains/:trainNumber/route", upstream: "/v1/trains/{number}/route" },
      { method: "GET", path: "/trains/between/:from/:to", upstream: "/v1/trains/between/{from}/{to}" },
      { method: "GET", path: "/stations/:code/trains", upstream: "/v1/stations/{code}/trains" },
      { method: "GET", path: "/stations/:code/live", upstream: "/v1/stations/{code}/live" },
      { method: "GET", path: "/lookup/trains", upstream: "/v1/lookup/trains" },
      { method: "GET", path: "/lookup/stations", upstream: "/v1/lookup/stations" },
      { method: "GET", path: "/legacy/stations/all-kvs", upstream: "/v1/legacy/stations/all-kvs" },
      { method: "GET", path: "/legacy/trains/all-kvs", upstream: "/v1/legacy/trains/all-kvs" },
      { method: "GET", path: "/legacy/trains/between", upstream: "/v1/legacy/trains/between" },
      { method: "GET", path: "/legacy/modules/shipping/find-trains", upstream: "/v1/legacy/modules/shipping/find-trains" },
      { method: "GET", path: "/legacy/trains/:trainNumber", upstream: "/v1/legacy/trains/{number}" }
    ]
  });
});

router.get("/trains/between/:from/:to", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getTrainsBetweenStations(req.params.from, req.params.to, {
    date: req.query.date,
    live: bool(req.query.live),
    byCity: bool(req.query.byCity),
    type: req.query.type,
    category: req.query.category
  })));
}));

router.get("/trains/:trainNumber/details", asyncHandler(async (req, res) => {
  const haltsOnly = req.query.haltsOnly !== "false";
  res.json(await fetchTrainDetails(req.params.trainNumber, { haltsOnly }));
}));

router.get("/trains/:trainNumber/live", asyncHandler(async (req, res) => {
  res.json(await fetchLiveStatus(req.params.trainNumber, {
    date: req.query.date,
    haltsOnly: req.query.haltsOnly !== "false",
    geometry: req.query.geometry,
    format: req.query.format,
    includeCoordinates: req.query.includeCoordinates
  }));
}));

router.get("/trains/:trainNumber/route", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getTrainRouteGeometry(req.params.trainNumber, {
    format: req.query.format || "geojson",
    stops: bool(req.query.stops)
  })));
}));

// Stations
router.get("/stations/:code/trains", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getStationBoard(req.params.code, {
    includeIntermediate: bool(req.query.includeIntermediate)
  })));
}));

router.get("/stations/:code/live", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getStationLiveBoard(req.params.code, {
    hours: req.query.hours ? Number(req.query.hours) : 4,
    includeIntermediate: bool(req.query.includeIntermediate)
  })));
}));

// Lookup
router.get("/lookup/trains", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getTrainLookup()));
}));

router.get("/lookup/stations", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getStationLookup()));
}));

// Legacy
router.get("/legacy/stations/all-kvs", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getLegacyStationsKvs()));
}));

router.get("/legacy/trains/all-kvs", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getLegacyTrainsKvs()));
}));

router.get("/legacy/trains/between", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getLegacyTrainsBetween({
    from: req.query.from,
    to: req.query.to
  })));
}));

router.get("/legacy/modules/shipping/find-trains", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getLegacyShippingFindTrains({
    source: req.query.source,
    lat: req.query.lat,
    lng: req.query.lng,
    radius: req.query.radius,
    minHaltSource: req.query.minHaltSource,
    minHaltNear: req.query.minHaltNear,
    limit: req.query.limit
  })));
}));

router.get("/legacy/trains/:trainNumber", asyncHandler(async (req, res) => {
  res.json(await proxy(() => rr.getLegacyTrainDetails(req.params.trainNumber, {
    journeyDate: req.query.journeyDate,
    dataType: req.query.dataType,
    dataProvider: req.query.dataProvider,
    userId: req.query.userId
  })));
}));

export default router;
