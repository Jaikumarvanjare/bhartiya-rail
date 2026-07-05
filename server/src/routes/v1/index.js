import { Router } from "express";
import catalogRoutes from "../../modules/catalog/routes.js";
import authRoutes from "../../modules/auth/routes.js";
import userRoutes from "../../modules/users/routes.js";
import seatRoutes from "../../modules/seats/routes.js";
import bookingRoutes from "../../modules/bookings/routes.js";
import paymentRoutes from "../../modules/payments/routes.js";
import pnrRoutes from "../../modules/pnr/routes.js";
import cancellationRoutes from "../../modules/cancellation/routes.js";
import contentRoutes from "../../modules/content/routes.js";
import liveRoutes from "../../modules/live/routes.js";
import railradarRoutes from "../../modules/railradar/routes.js";
import stubRoutes from "../../modules/stubs/routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "bharat-rail-api" });
});

router.get("/system/version", (_req, res) => {
  res.json({ version: "0.3.0", stack: "PERN", modules: ["auth", "seats", "bookings", "payments", "pnr", "cancellation", "tatkal"] });
});

router.use(authRoutes);
router.use(userRoutes);
router.use(catalogRoutes);
router.use(railradarRoutes);
router.use(seatRoutes);
router.use(bookingRoutes);
router.use(paymentRoutes);
router.use(pnrRoutes);
router.use(cancellationRoutes);
router.use(contentRoutes);
router.use(liveRoutes);
router.use(stubRoutes);

export default router;
