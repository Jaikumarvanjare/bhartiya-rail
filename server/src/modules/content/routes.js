import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/meals", asyncHandler(async (_req, res) => {
  const meals = await prisma.meal.findMany({ orderBy: { name: "asc" } });
  res.json({ meals });
}));

router.get("/history", asyncHandler(async (_req, res) => {
  const timeline = await prisma.historyEvent.findMany({ orderBy: { id: "asc" } });
  res.json({
    timeline,
    summary: "Indian railways grew from a short steam-hauled passenger service into one of the world's most important public transport systems, carrying people, goods, stories, food, festivals, and languages across the country."
  });
}));

router.get("/dashboard", (_req, res) => {
  res.json({
    profile: { name: "Vikram Rao", tier: "Platinum Yatri", points: 42880, journeys: 126, savedPassengers: 4 },
    upcoming: {
      pnr: "BR48291372",
      train: "22436 Vande Bharat Kashi",
      from: "New Delhi",
      to: "Varanasi Junction",
      coach: "C3",
      seat: "42",
      date: "2026-07-12",
      status: "Confirmed"
    },
    insights: [
      "Most travelled corridor: Delhi to Varanasi",
      "Favourite meal: Banarasi thali",
      "Carbon saver badge unlocked for electric corridors"
    ]
  });
});

export default router;
