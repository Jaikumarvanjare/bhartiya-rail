import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = fs.readFileSync(path.join(__dirname, "stations-index.txt"), "utf8");

const HERITAGE = {
  NDLS: ["New Delhi", "Delhi", "Northern India", "Mughal avenues, capital routes, and national connections"],
  BSB: ["Varanasi Junction", "Varanasi", "Gangetic Plains", "Temple bells, ghats, silk, and sacred river journeys"],
  CSMT: ["Chhatrapati Shivaji Maharaj Terminus", "Mumbai", "Western Coast", "Gothic heritage station and Maratha-era city memory"],
  CSTM: ["Chhatrapati Shivaji Maharaj Terminus", "Mumbai", "Western Coast", "Gothic heritage station and Maratha-era city memory"],
  MMCT: ["Mumbai Central", "Mumbai", "Western Coast", "Gateway routes toward Gujarat, Rajasthan, and Delhi"],
  BCT: ["Mumbai Central", "Mumbai", "Western Coast", "Gateway routes toward Gujarat, Rajasthan, and Delhi"],
  HWH: ["Howrah Junction", "Kolkata", "Eastern India", "Hooghly river crossings, literature, food, and old port routes"],
  MAS: ["MGR Chennai Central", "Chennai", "Coromandel Coast", "Dravidian temple corridors and southern coastal rail"],
  SBC: ["KSR Bengaluru", "Bengaluru", "Deccan Plateau", "Garden city, tech corridors, and old Mysore links"],
  JP: ["Jaipur Junction", "Jaipur", "Rajasthan", "Pink city arches, forts, crafts, and desert gateways"],
  AII: ["Ajmer Junction", "Ajmer", "Rajasthan", "Sufi heritage, Aravalli hills, and pilgrimage routes"],
  ASR: ["Amritsar Junction", "Amritsar", "Punjab", "Golden Temple, frontier stories, and Punjabi food culture"],
  BPL: ["Bhopal Junction", "Bhopal", "Central India", "Lakes, Buddhist routes, and central India junctions"],
  SVDK: ["Shri Mata Vaishno Devi Katra", "Katra", "Jammu", "Himalayan foothills and pilgrimage travel"]
};

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bJn\./g, "Jn.")
    .replace(/\b(T)\b/g, "(T)");
}

function parseLine(line) {
  const cleaned = line.trim().replace(/\s+/g, " ");
  if (!cleaned) return null;

  const slashMatch = cleaned.match(/^(.+?)\s+([A-Z]{2,5}\/[A-Z]{2,5})$/i);
  if (slashMatch) {
    const code = slashMatch[2].split("/")[0].toUpperCase();
    return { name: titleCase(slashMatch[1]), code };
  }

  const parts = cleaned.split(" ");
  const code = parts.pop().toUpperCase();
  if (!/^[A-Z0-9]{1,6}$/.test(code)) return null;
  const name = titleCase(parts.join(" "));
  return { name, code };
}

const map = new Map();

for (const line of raw.split("\n")) {
  const parsed = parseLine(line);
  if (!parsed || map.has(parsed.code)) continue;
  map.set(parsed.code, parsed.name);
}

for (const [code, heritage] of Object.entries(HERITAGE)) {
  map.set(code, heritage[0]);
}

const stations = [...map.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([code, name]) => {
    const heritage = HERITAGE[code];
    const city = heritage?.[1] || name.replace(/ Jn\.|\(T\)|\(GOA\)/gi, "").trim();
    const region = heritage?.[2] || "Indian Railways";
    const note = heritage?.[3] || "Passenger station on the Indian Railways network.";
    return { code, name, city, region, note };
  });

const out = `// Auto-generated from stations-index.txt — TAG-13 station code index\nexport const STATIONS = ${JSON.stringify(stations, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, "stations.js"), out);
console.log(`Generated ${stations.length} stations`);
