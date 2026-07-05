import { Queue, Worker } from "bullmq";
import { getRedis } from "./redis.js";

const connection = () => {
  const url = new URL(process.env.REDIS_URL || "redis://localhost:6380");
  return { host: url.hostname, port: Number(url.port || 6379) };
};

let tatkalQueue;

export function getTatkalQueue() {
  if (!tatkalQueue) tatkalQueue = new Queue("tatkal-bookings", { connection: connection() });
  return tatkalQueue;
}

export function startTatkalWorker(processor) {
  return new Worker("tatkal-bookings", processor, { connection: connection() });
}

export async function checkTatkalRateLimit(userId) {
  const redis = getRedis();
  const key = `tatkal:rate:${userId}:${new Date().toISOString().slice(0, 10)}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 86400);
  const max = Number(process.env.TATKAL_DAILY_LIMIT || 3);
  if (count > max) throw Object.assign(new Error("Tatkal daily limit reached"), { status: 429 });
}
