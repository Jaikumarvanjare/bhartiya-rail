export const CLASSES = ["SL", "3A", "2A", "1A", "CC", "EC", "2S"];

export const QUOTAS = [
  { code: "GN", label: "General" },
  { code: "TQ", label: "Tatkal" },
  { code: "PT", label: "Premium Tatkal" },
  { code: "LD", label: "Ladies" },
  { code: "SS", label: "Senior Citizen" },
  { code: "HP", label: "Physically Handicapped" }
];

export function filterTrains(trains, query) {
  const from = query.from || "";
  const to = query.to || "";
  const travelClass = query.class || "";
  const q = (query.q || "").toLowerCase();

  return trains.filter((train) => {
    if (from && train.fromCode !== from && !train.fromName.toLowerCase().includes(from.toLowerCase())) {
      return false;
    }
    if (to && train.toCode !== to && !train.toName.toLowerCase().includes(to.toLowerCase())) {
      return false;
    }
    if (q && ![train.name, train.type, train.culture].some((v) => v.toLowerCase().includes(q))) {
      return false;
    }
    if (travelClass === "SL" && train.type === "Vande Bharat") {
      return false;
    }
    return true;
  });
}

export function makePnr(seed = Date.now()) {
  return `BR${String(seed % 100_000_000).padStart(8, "0")}`;
}

export function makeBookingId(seed = Date.now()) {
  return `BK${String(seed % 1_000_000).padStart(6, "0")}`;
}

export function countPassengers(body = {}) {
  if (Array.isArray(body.passengers)) {
    return Math.max(1, body.passengers.length);
  }
  return 1;
}

export function makeBerths(count) {
  return Array.from({ length: count }, (_, i) => `C${3 + Math.floor(i / 72)}-${41 + i}`);
}
