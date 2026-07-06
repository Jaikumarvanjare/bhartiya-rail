import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { STATIONS } from "./data/stations.js";
import { SEED_TRAINS } from "../src/data/seedTrains.js";

const prisma = new PrismaClient();

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

  for (const train of SEED_TRAINS) {
    await prisma.train.create({ data: train });
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
