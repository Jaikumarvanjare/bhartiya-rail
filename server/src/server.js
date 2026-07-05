import "dotenv/config";
import app from "./app.js";
import { connectRedis } from "./lib/redis.js";
import { startTatkalWorker } from "./lib/queue.js";
import * as booking from "./modules/bookings/service.js";

const port = Number(process.env.PORT || 4000);

async function boot() {
  await connectRedis();

  startTatkalWorker(async (job) => {
    const { userId, trainNumber, journeyDate, travelClass, passengerCount } = job.data;
    const { session } = await booking.initiateSession({
      userId,
      trainNumber,
      journeyDate,
      travelClass,
      quota: "TQ",
      passengerCount,
      isTatkal: true
    });
    return { sessionId: session.id, status: session.status };
  });

  app.listen(port, () => {
    console.log(`Bharat Rail API listening on http://localhost:${port}`);
  });
}

boot().catch((err) => {
  console.error(err);
  process.exit(1);
});
