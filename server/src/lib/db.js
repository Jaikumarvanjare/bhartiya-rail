import { prisma } from "./prisma.js";
import { SEED_TRAINS } from "../data/seedTrains.js";

export function isDbUnavailable(err) {
  const code = err?.code;
  const msg = String(err?.message || "");
  return code === "P1001" || code === "P1017" || msg.includes("Can't reach database");
}

export async function loadSeedTrains() {
  try {
    const trains = await prisma.train.findMany();
    return { trains, offline: false };
  } catch (err) {
    if (isDbUnavailable(err)) return { trains: SEED_TRAINS, offline: true };
    throw err;
  }
}
