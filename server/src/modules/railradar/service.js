import * as rr from "../../lib/railradar.js";
import { httpError } from "../../lib/http.js";

export function unwrapEnvelope(payload) {
  if (!payload?.success) {
    throw httpError(502, payload?.error?.message || "RailRadar upstream error");
  }
  return { source: "railradar", data: payload.data, meta: payload.meta };
}

export function assertConfigured() {
  if (!rr.railradarConfigured()) throw httpError(503, "RailRadar API key not configured");
}

export function mapTrainDetails(payload) {
  const { data, meta, source } = unwrapEnvelope(payload);
  const { train, route } = data;
  return {
    source,
    train: {
      number: train.number,
      name: train.name,
      type: train.type,
      category: train.category,
      from: train.source,
      to: train.destination,
      runDays: train.runDays,
      distance: train.distance,
      durationMinutes: train.duration,
      avgSpeed: train.avgSpeed,
      maxSpeed: train.maxSpeed,
      totalHalts: train.totalHalts,
      returnTrain: train.returnTrain,
      coachPosition: train.coachPosition
    },
    route: (route || []).map((stop) => ({
      sequence: stop.sequence,
      station: stop.station,
      arrival: stop.arrival,
      departure: stop.departure,
      arrivalDay: stop.arrivalDay,
      departureDay: stop.departureDay,
      distance: stop.distance,
      platform: stop.platform,
      isHalt: stop.isHalt
    })),
    meta
  };
}

export function mapLiveStatus(payload) {
  const { data, meta, source } = unwrapEnvelope(payload);
  const progress = Math.round((data.currentLocation?.segmentProgress ?? 0) * 100);
  const stops = (data.route || [])
    .filter((s) => s.isHalt !== false)
    .map((s) => ({
      name: s.stationName,
      code: s.stationCode,
      scheduledArrival: s.scheduledArrival,
      scheduledDeparture: s.scheduledDeparture,
      actualArrival: s.actualArrival,
      actualDeparture: s.actualDeparture,
      delay: s.delayArrival ?? s.delayDeparture ?? 0,
      status: s.status,
      state: s.status === "departed" ? "done" : s.status === "upcoming" ? "next" : "active",
      platform: s.platform
    }));

  return {
    source,
    train: data.trainNumber,
    trainName: data.trainName,
    status: data.status,
    delayMinutes: data.delayMinutes ?? 0,
    startDate: data.startDate,
    isLive: data.isLive,
    platform: data.route?.find((s) => s.status === "active")?.platform || data.currentLocation?.platform,
    speedKmph: data.currentLocation?.speedKmh ?? null,
    progress: progress || 0,
    lastStation: data.previousHalt?.stationName || null,
    nextStation: data.nextHalt?.stationName || null,
    currentStation: data.currentLocation?.stationCode || null,
    exceptions: data.exceptions || [],
    stops,
    trainInfo: data.train || null,
    meta
  };
}

function mockLive(trainNumber) {
  return {
    source: "mock",
    train: trainNumber,
    trainName: `Train ${trainNumber}`,
    status: "running",
    delayMinutes: 0,
    platform: "4",
    speedKmph: 110,
    progress: 42,
    lastStation: "Kanpur Central",
    nextStation: "Prayagraj Junction",
    stops: [
      { name: "New Delhi", code: "NDLS", state: "done", status: "departed" },
      { name: "Kanpur Central", code: "CNB", state: "done", status: "departed" },
      { name: "Prayagraj Junction", code: "PRYJ", state: "active", status: "active" },
      { name: "Varanasi Junction", code: "BSB", state: "next", status: "upcoming" }
    ]
  };
}

export async function fetchTrainDetails(trainNumber, options) {
  assertConfigured();
  return mapTrainDetails(await rr.getTrainDetails(trainNumber, options));
}

export async function fetchLiveStatus(trainNumber, options) {
  if (!rr.railradarConfigured()) return mockLive(trainNumber);
  try {
    const raw = await rr.getLiveTrainStatus(trainNumber, options);
    return mapLiveStatus(raw);
  } catch {
    return mockLive(trainNumber);
  }
}

export async function proxy(fn) {
  assertConfigured();
  return unwrapEnvelope(await fn());
}
