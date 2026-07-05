import crypto from "node:crypto";
import { getRedis, SEAT_LOCK_TTL } from "../../lib/redis.js";
import { makeBerths } from "../../data/constants.js";
import { httpError } from "../../lib/http.js";

function seatKey(trainNumber, journeyDate, berth) {
  return `seat:${trainNumber}:${journeyDate}:${berth}`;
}

function lockMetaKey(lockId) {
  return `lock:${lockId}`;
}

export async function lockSeats({ trainNumber, journeyDate, count, userId }) {
  if (!trainNumber || !journeyDate || !count) {
    throw httpError(400, "trainNumber, journeyDate, and count are required");
  }

  const redis = getRedis();
  const lockId = crypto.randomUUID();
  const berths = makeBerths(count);
  const coach = berths[0]?.split("-")[0] || "C3";
  const acquired = [];

  for (const berth of berths) {
    const key = seatKey(trainNumber, journeyDate, berth);
    const ok = await redis.set(key, lockId, "EX", SEAT_LOCK_TTL, "NX");
    if (ok !== "OK") {
      await releaseSeats({ lockId, trainNumber, journeyDate, berths: acquired });
      throw httpError(409, "Selected seats no longer available");
    }
    acquired.push(berth);
  }

  await redis.set(
    lockMetaKey(lockId),
    JSON.stringify({ trainNumber, journeyDate, berths, userId: userId || null, coach }),
    "EX",
    SEAT_LOCK_TTL
  );

  return { lockId, berths, coach, expiresIn: SEAT_LOCK_TTL };
}

export async function releaseSeats({ lockId, trainNumber, journeyDate, berths }) {
  const redis = getRedis();
  for (const berth of berths) {
    const key = seatKey(trainNumber, journeyDate, berth);
    const owner = await redis.get(key);
    if (owner === lockId) await redis.del(key);
  }
  await redis.del(lockMetaKey(lockId));
}

export async function releaseLockById(lockId) {
  const redis = getRedis();
  const raw = await redis.get(lockMetaKey(lockId));
  if (!raw) throw httpError(404, "Seat lock not found or expired");
  const meta = JSON.parse(raw);
  await releaseSeats({ lockId, ...meta });
  return { status: "released", lockId };
}

export async function getLockMeta(lockId) {
  const redis = getRedis();
  const raw = await redis.get(lockMetaKey(lockId));
  if (!raw) return null;
  return JSON.parse(raw);
}
