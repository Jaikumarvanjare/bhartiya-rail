import { httpError } from "./http.js";

const BASE = process.env.RAILRADAR_BASE_URL || "https://api.railradar.in";

function apiKey() {
  return process.env.RAILRADAR_API_KEY || "";
}

export function railradarConfigured() {
  return Boolean(apiKey());
}

async function railradarFetch(path, query = {}) {
  const key = apiKey();
  if (!key) throw httpError(503, "RailRadar API key not configured");

  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" }
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error?.message || `RailRadar request failed (${response.status})`;
    throw httpError(response.status === 404 ? 404 : response.status === 429 ? 429 : 502, message);
  }
  return body;
}

function trainNo(n) {
  return String(n).replace(/\D/g, "");
}

function stationCode(c) {
  return String(c).toUpperCase().trim();
}

// Trains
export function getTrainDetails(number, { haltsOnly = true } = {}) {
  return railradarFetch(`/v1/trains/${trainNo(number)}`, { haltsOnly });
}

export function getLiveTrainStatus(number, opts = {}) {
  const { date, haltsOnly = true, geometry, format, includeCoordinates } = opts;
  return railradarFetch(`/v1/trains/${trainNo(number)}/live`, {
    date, haltsOnly, geometry, format, includeCoordinates
  });
}

export function getTrainRouteGeometry(number, { format = "geojson", stops = false } = {}) {
  return railradarFetch(`/v1/trains/${trainNo(number)}/route`, { format, stops });
}

export function getTrainsBetweenStations(from, to, opts = {}) {
  const { date, live, byCity, type, category } = opts;
  return railradarFetch(`/v1/trains/between/${stationCode(from)}/${stationCode(to)}`, {
    date, live, byCity, type, category
  });
}

// Stations
export function getStationBoard(code, { includeIntermediate = false } = {}) {
  return railradarFetch(`/v1/stations/${stationCode(code)}/trains`, { includeIntermediate });
}

export function getStationLiveBoard(code, { hours = 4, includeIntermediate = false } = {}) {
  return railradarFetch(`/v1/stations/${stationCode(code)}/live`, { hours, includeIntermediate });
}

// Lookup
export function getTrainLookup() {
  return railradarFetch("/v1/lookup/trains");
}

export function getStationLookup() {
  return railradarFetch("/v1/lookup/stations");
}

// Legacy
export function getLegacyStationsKvs() {
  return railradarFetch("/v1/legacy/stations/all-kvs");
}

export function getLegacyTrainsKvs() {
  return railradarFetch("/v1/legacy/trains/all-kvs");
}

export function getLegacyTrainsBetween({ from, to }) {
  return railradarFetch("/v1/legacy/trains/between", { from: stationCode(from), to: stationCode(to) });
}

export function getLegacyShippingFindTrains(opts) {
  const { source, lat, lng, radius, minHaltSource, minHaltNear, limit } = opts;
  return railradarFetch("/v1/legacy/modules/shipping/find-trains", {
    source: stationCode(source), lat, lng, radius, minHaltSource, minHaltNear, limit
  });
}

export function getLegacyTrainDetails(number, opts = {}) {
  const { journeyDate, dataType, dataProvider, userId } = opts;
  return railradarFetch(`/v1/legacy/trains/${trainNo(number)}`, {
    journeyDate, dataType, dataProvider, userId
  });
}
