import { getTrainsBetweenStations, railradarConfigured } from "../../lib/railradar.js";
import { loadSeedTrains } from "../../lib/db.js";
import { filterTrains } from "../../data/constants.js";

const FARE_PER_KM = { SL: 0.4, "3A": 1.2, "2A": 1.8, "1A": 3.5, CC: 1.0, EC: 1.4, "2S": 0.35 };
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();

function fmtDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function estimateFare(distanceKm, travelClass) {
  const rate = FARE_PER_KM[travelClass] || 1;
  return Math.max(100, Math.round(distanceKm * rate));
}

function mapLiveStatus(live) {
  if (!live) return { status: "Timetable", seats: null };
  if (live.delayMinutes > 15) return { status: "Delayed", seats: null };
  if (live.type === "departed") return { status: "Departed", seats: null };
  return { status: "On time", seats: null };
}

function mapItem(item, { from, to, fromName, toName, travelClass }) {
  const live = mapLiveStatus(item.live);
  return {
    number: item.train.number,
    name: item.train.name,
    type: item.train.type,
    fromCode: from,
    toCode: to,
    fromName,
    toName,
    depart: item.from?.departure || "—",
    arrive: item.to?.arrival || "—",
    duration: fmtDuration(item.duration || 0),
    availability: live.status,
    seats: live.seats,
    fare: estimateFare(item.distance || 50, travelClass),
    runDays: item.train.runDays,
    distance: item.distance,
    halts: item.totalHaltsBetween,
    bookable: false
  };
}

function mergeSeed(items, seeds) {
  const seedMap = new Map(seeds.map((t) => [t.number, t]));
  return items.map((t) => {
    const seed = seedMap.get(t.number);
    if (!seed) return t;
    return {
      ...t,
      ...seed,
      fromName: t.fromName,
      toName: t.toName,
      depart: t.depart,
      arrive: t.arrive,
      duration: t.duration,
      bookable: true
    };
  });
}

async function localFallback({ fromCode, toCode, fromName, toName, date, travelClass, quota, message }) {
  const { trains: seeds, offline: dbOffline } = await loadSeedTrains();
  const filtered = filterTrains(seeds, { from: fromCode, to: toCode, class: travelClass });
  const dbNote = dbOffline
    ? " Database is offline — start it with: docker compose up -d && npm run db:setup"
    : "";
  return {
    from: fromCode,
    to: toCode,
    fromName: fromName || fromCode,
    toName: toName || toCode,
    date,
    class: travelClass,
    quota: quota || "GN",
    count: filtered.length,
    trains: filtered.map((t) => ({ ...t, bookable: true })),
    fallback: true,
    message: `${message}${dbNote}`
  };
}

export async function searchBetweenStations({ from, to, date, fromName, toName, travelClass, quota, live = true }) {
  const fromCode = String(from).toUpperCase();
  const toCode = String(to).toUpperCase();
  const cacheKey = `${fromCode}:${toCode}:${date}:${travelClass}:${live}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return { ...hit.data, quota, class: travelClass };

  if (!railradarConfigured()) {
    return localFallback({
      fromCode, toCode, fromName, toName, date, travelClass, quota,
      message: "Live schedule not configured. Showing demo trains for this route where available."
    });
  }

  let payload = { trains: [], from: { code: fromCode }, to: { code: toCode } };
  try {
    const raw = await getTrainsBetweenStations(fromCode, toCode, { date, live });
    payload = raw.data || payload;
  } catch (err) {
    if (err.status === 404) {
      return localFallback({
        fromCode, toCode, fromName, toName, date, travelClass, quota,
        message: "No live trains on this date. Showing demo trains for this route if available."
      });
    }
    if (err.status === 429 || err.status === 503 || err.status === 502) {
      return localFallback({
        fromCode, toCode, fromName, toName, date, travelClass, quota,
        message: "Live schedule service is busy. Showing demo trains for this route where available."
      });
    }
    throw err;
  }

  const mapped = (payload.trains || []).map((item) =>
    mapItem(item, { from: fromCode, to: toCode, fromName, toName, travelClass })
  );
  const { trains: seeds, offline: dbOffline } = await loadSeedTrains();
  const trains = mergeSeed(mapped, seeds);

  const result = {
    from: fromCode,
    to: toCode,
    fromName: fromName || payload.from?.name || fromCode,
    toName: toName || payload.to?.name || toCode,
    date,
    class: travelClass,
    quota: quota || "GN",
    count: trains.length,
    trains,
    ...(dbOffline && {
      fallback: true,
      message: "Database is offline. Live schedule shown; booking uses demo trains. Run: docker compose up -d && npm run db:setup"
    })
  };

  cache.set(cacheKey, { at: Date.now(), data: result });
  return result;
}
