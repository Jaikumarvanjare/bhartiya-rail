import Redis from "ioredis";

let client;

export function getRedis() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || "redis://localhost:6380", {
      maxRetriesPerRequest: null,
      lazyConnect: true
    });
  }
  return client;
}

export async function connectRedis() {
  const redis = getRedis();
  if (redis.status === "wait") await redis.connect();
  return redis;
}

export const SEAT_LOCK_TTL = Number(process.env.SEAT_LOCK_TTL_SECONDS || 900);
