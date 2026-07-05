import { api } from "./client.js";

export async function searchTrains({ from, to, date, fromName, toName, travelClass, quota, live = true }) {
  const qs = new URLSearchParams({
    date,
    class: travelClass || "CC",
    quota: quota || "GN",
    live: String(live)
  });
  if (fromName) qs.set("fromName", fromName);
  if (toName) qs.set("toName", toName);
  return api(`/search/between/${from}/${to}?${qs}`);
}

export function fetchTrainDetails(trainNumber, haltsOnly = true) {
  return api(`/trains/${trainNumber}/details?haltsOnly=${haltsOnly}`);
}

export function fetchLiveStatus(trainNumber, { date, haltsOnly = true } = {}) {
  const qs = new URLSearchParams({ haltsOnly: String(haltsOnly) });
  if (date) qs.set("date", date);
  return api(`/trains/${trainNumber}/live?${qs}`).catch(() => api(`/live-status/${trainNumber}?${qs}`));
}

export function fetchTrainRoute(trainNumber, { format = "geojson", stops = true } = {}) {
  const qs = new URLSearchParams({ format, stops: String(stops) });
  return api(`/trains/${trainNumber}/route?${qs}`);
}

export function fetchStationBoard(code, includeIntermediate = false) {
  return api(`/stations/${code}/trains?includeIntermediate=${includeIntermediate}`);
}

export function fetchStationLive(code, hours = 4) {
  return api(`/stations/${code}/live?hours=${hours}`);
}

export function fetchTrainLookup() {
  return api("/lookup/trains");
}

export function fetchStationLookup() {
  return api("/lookup/stations");
}

export function fetchLegacyStationsKv() {
  return api("/legacy/stations/all-kvs");
}

export function fetchLegacyTrainsKv() {
  return api("/legacy/trains/all-kvs");
}

export function fetchLegacyBetween(from, to) {
  return api(`/legacy/trains/between?from=${from}&to=${to}`);
}

export function fetchLegacyShipping({ source, lat, lng, radius, limit }) {
  const qs = new URLSearchParams({ source, lat, lng });
  if (radius) qs.set("radius", radius);
  if (limit) qs.set("limit", limit);
  return api(`/legacy/modules/shipping/find-trains?${qs}`);
}

export function fetchLegacyTrainDetails(trainNumber, journeyDate) {
  const qs = journeyDate ? `?journeyDate=${journeyDate}` : "";
  return api(`/legacy/trains/${trainNumber}${qs}`);
}
