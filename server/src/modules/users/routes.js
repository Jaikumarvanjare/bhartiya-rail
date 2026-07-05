import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { requireAuth } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";
import { httpError } from "../../lib/http.js";

const router = Router();

router.get("/users/me", requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, phone: true, walletBalance: true, createdAt: true }
  });
  res.json({ user });
}));

router.patch("/users/me", requireAuth, asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { ...(name && { name }), ...(phone !== undefined && { phone }) },
    select: { id: true, email: true, name: true, phone: true, walletBalance: true }
  });
  res.json({ user });
}));

router.delete("/users/me", requireAuth, asyncHandler(async (req, res) => {
  await prisma.user.delete({ where: { id: req.user.id } });
  res.json({ status: "deleted" });
}));

router.get("/users/me/wallet", requireAuth, asyncHandler(async (req, res) => {
  res.json({ balance: req.user.walletBalance, currency: "INR" });
}));

export default router;
