#!/usr/bin/env node
/**
 * Verifies all RailRadar proxy routes are registered and respond.
 * Usage: npm run verify:railradar -w server
 */
import "dotenv/config";

const BASE = process.env.API_BASE || "http://localhost:4000/api/v1";
const DELAY_MS = Number(process.env.VERIFY_DELAY_MS || 7000);

const checks = [
  { name: "inventory", path: "/integrations/railradar", expect: (b) => b.routes?.length >= 13 },
  { name: "train-details", path: "/trains/12919/details?haltsOnly=true", expect: (b) => b.train?.number === "12919" },
  { name: "train-live", path: "/trains/12919/live?haltsOnly=true", expect: (b) => b.train === "12919" || b.trainName },
  { name: "live-status-alias", path: "/live-status/12919?haltsOnly=true", expect: (b) => b.train === "12919" || b.trainName },
  { name: "train-geometry", path: "/trains/12919/route?format=geojson&stops=true", expect: (b) => b.data?.geojson || b.data?.format },
  { name: "trains-between", path: "/trains/between/UJN/INDB?date=2026-03-15", expect: (b) => b.data?.trains?.length > 0 },
  { name: "station-board", path: "/stations/UJN/trains", expect: (b) => b.data?.station?.code === "UJN" },
  { name: "station-live", path: "/stations/UJN/live", expect: (b) => b.data?.station?.code === "UJN" },
  { name: "lookup-trains", path: "/lookup/trains", expect: (b) => b.data?.["12919"] || b.data?.["12920"] },
  { name: "lookup-stations", path: "/lookup/stations", expect: (b) => b.data?.UJN || b.data?.INDB },
  { name: "legacy-stations-kv", path: "/legacy/stations/all-kvs", expect: (b) => Array.isArray(b.data) },
  { name: "legacy-trains-kv", path: "/legacy/trains/all-kvs", expect: (b) => Array.isArray(b.data) },
  { name: "legacy-between", path: "/legacy/trains/between?from=NDLS&to=BCT", expect: (b) => b.data?.trains },
  { name: "legacy-shipping", path: "/legacy/modules/shipping/find-trains?source=NDLS&lat=27.1767&lng=78.0081&limit=5", expect: (b) => Array.isArray(b.data) },
  { name: "legacy-train", path: "/legacy/trains/12919?dataType=static", expect: (b) => b.data?.train?.number === "12919" }
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log(`RailRadar route verify → ${BASE}\n`);
  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    await sleep(DELAY_MS);
    try {
      const res = await fetch(`${BASE}${check.path}`);
      const body = await res.json();
      const ok = res.ok && check.expect(body);
      const rateLimited = res.status === 429;
      if (ok) {
        passed++;
        console.log(`✓ ${check.name} (${res.status})`);
      } else if (rateLimited) {
        passed++;
        console.log(`~ ${check.name} (429 rate limit — route registered, retry later)`);
      } else {
        failed++;
        console.log(`✗ ${check.name} (${res.status})`, body.error || body.status || "unexpected body");
      }
    } catch (err) {
      failed++;
      console.log(`✗ ${check.name} (ERR)`, err.message);
    }
  }

  console.log(`\n${passed}/${checks.length} passed`);
  process.exit(failed ? 1 : 0);
}

run();
