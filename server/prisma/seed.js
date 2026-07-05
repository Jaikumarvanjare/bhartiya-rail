import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { STATIONS } from "./data/stations.js";

const prisma = new PrismaClient();

const trains = [
  ["22436", "Vande Bharat Kashi", "Vande Bharat", "NDLS", "New Delhi", "BSB", "Varanasi Junction", "06:00", "14:05", "8h 05m", "Available", "Capital to Kashi route with ghats, temple craft, and silk markets", 1840, 62, 4.8],
  ["12951", "Mumbai Rajdhani", "Rajdhani", "MMCT", "Mumbai Central", "NDLS", "New Delhi", "17:00", "08:35", "15h 35m", "RAC", "Western coast to capital corridor through Gujarat and Rajasthan", 3920, 18, 4.7],
  ["12301", "Howrah Rajdhani", "Rajdhani", "HWH", "Howrah Junction", "NDLS", "New Delhi", "16:50", "10:05", "17h 15m", "Available", "Hooghly river heritage, Bengal food, and the grand trunk corridor", 4210, 35, 4.6],
  ["12002", "Shatabdi Bhopal", "Shatabdi", "NDLS", "New Delhi", "BPL", "Bhopal Junction", "06:00", "14:25", "8h 25m", "Available", "Fast day route linking capital avenues with the lake city", 1650, 71, 4.5],
  ["20977", "Ajmer Vande Bharat", "Vande Bharat", "AII", "Ajmer Junction", "NDLS", "New Delhi", "06:20", "11:35", "5h 15m", "Available", "Aravalli views, Sufi heritage, and north Indian palace towns", 1495, 44, 4.6],
  ["12903", "Golden Temple Mail", "Mail Express", "MMCT", "Mumbai Central", "ASR", "Amritsar Junction", "18:45", "23:35", "28h 50m", "Waitlist", "From Arabian Sea business streets to Punjab's sacred city", 2860, 0, 4.1],
  ["12627", "Karnataka Express", "Superfast", "SBC", "KSR Bengaluru", "NDLS", "New Delhi", "19:20", "10:30", "39h 10m", "Available", "Deccan plateau journey across languages, crops, and cuisines", 3380, 54, 4.3],
  ["12841", "Coromandel Express", "Superfast", "HWH", "Howrah Junction", "MAS", "MGR Chennai Central", "14:50", "17:00", "26h 10m", "Available", "Bay of Bengal rail story through Odisha and the Coromandel coast", 2745, 29, 4.2],
  ["12957", "Swarna Jayanti Rajdhani", "Rajdhani", "NDLS", "New Delhi", "JP", "Jaipur Junction", "19:55", "00:10", "4h 15m", "Available", "Short heritage hop to pink sandstone, forts, and block prints", 1190, 83, 4.4],
  ["22439", "Vande Bharat Katra", "Vande Bharat", "NDLS", "New Delhi", "SVDK", "Shri Mata Vaishno Devi Katra", "06:00", "14:00", "8h 00m", "Available", "Capital to Himalayan foothills pilgrimage corridor", 1720, 37, 4.7]
];

const history = [
  ["1853", "First passenger train", "On 16 April 1853, India's first passenger train ran from Bombay to Thane, covering about 34 km with 14 carriages and around 400 passengers.", "Bombay Presidency"],
  ["1854", "The line reaches Kalyan", "The early western railway expanded beyond Thane toward Kalyan, including difficult bridge work around Thane Creek.", "Western India"],
  ["1854", "Eastern India service", "Passenger railway service began from the Howrah side toward Hooghly, linking the Bengal river corridor to rail travel.", "Bengal"],
  ["1856", "South India rail growth", "Railway activity expanded in the Madras region, helping connect coastal trading cities and inland towns.", "Southern India"],
  ["1925", "Electric traction begins", "Electric train operation began in the Bombay region, starting a long modernization path for suburban and mainline rail.", "Bombay"],
  ["1951", "Indian Railways consolidation", "After independence, many railway systems were consolidated into Indian Railways, creating a unified national network.", "India"],
  ["1977", "National Rail Museum", "The Rail Transport Museum opened in New Delhi, later becoming the National Rail Museum and preserving locomotives, coaches, and archives.", "New Delhi"],
  ["2019", "Vande Bharat era", "Vande Bharat introduced a modern Indian semi-high-speed train identity with faster acceleration, better passenger comfort, and indigenous manufacturing focus.", "Modern India"]
];

const meals = [
  ["Banarasi Thali", "Uttar Pradesh", "Vegetarian", 260, "Kachori, seasonal sabzi, dal, rice, curd, and a small sweet."],
  ["Rajasthani Heritage Box", "Rajasthan", "Vegetarian", 310, "Dal baati churma inspired platter with pickles and millet roti."],
  ["Bengal Comfort Meal", "Bengal", "Vegetarian", 285, "Rice, dal, aloo posto style vegetables, chutney, and sandesh."],
  ["Deccan Breakfast", "Karnataka", "Vegetarian", 180, "Idli, vada, upma, coconut chutney, and filter coffee."],
  ["Punjab Rail Dhaba", "Punjab", "Vegetarian", 295, "Paratha, chole, lassi, salad, and jaggery."],
  ["Coastal Coromandel Tray", "Tamil Nadu", "Vegetarian", 250, "Lemon rice, curd rice, poriyal, sambar, and banana chips."]
];

async function main() {
  await prisma.payment.deleteMany();
  await prisma.bookingPassenger.deleteMany();
  await prisma.bookingSession.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.savedPassenger.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.user.deleteMany();
  await prisma.train.deleteMany();
  await prisma.station.deleteMany();
  await prisma.historyEvent.deleteMany();
  await prisma.meal.deleteMany();

  await prisma.station.createMany({ data: STATIONS });
  console.log(`Seeded ${STATIONS.length} stations`);

  for (const row of trains) {
    const [number, name, type, fromCode, fromName, toCode, toName, depart, arrive, duration, availability, culture, fare, seats, rating] = row;
    await prisma.train.create({
      data: { number, name, type, fromCode, fromName, toCode, toName, depart, arrive, duration, availability, culture, fare, seats, rating }
    });
  }

  for (const [year, title, detail, region] of history) {
    await prisma.historyEvent.create({ data: { year, title, detail, region } });
  }

  for (const [name, region, type, price, note] of meals) {
    await prisma.meal.create({ data: { name, region, type, price, note } });
  }

  await prisma.user.create({
    data: {
      email: "demo@bharatrail.in",
      name: "Vikram Rao",
      phone: "+919876543210",
      passwordHash: await bcrypt.hash("demo1234", 10),
      walletBalance: 2500
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
