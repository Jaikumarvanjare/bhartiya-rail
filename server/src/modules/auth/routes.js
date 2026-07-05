import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { requireAuth } from "../../middleware/auth.js";
import * as auth from "./service.js";

const router = Router();

router.post("/auth/register", asyncHandler(async (req, res) => {
  const user = await auth.registerUser(req.body);
  res.status(201).json({ user });
}));

router.post("/auth/login", asyncHandler(async (req, res) => {
  res.json(await auth.loginUser(req.body));
}));

router.post("/auth/logout", asyncHandler(async (req, res) => {
  res.json(await auth.logoutUser(req.body.refreshToken));
}));

router.post("/auth/refresh-token", asyncHandler(async (req, res) => {
  res.json(await auth.refreshSession(req.body.refreshToken));
}));

router.post("/auth/send-otp", asyncHandler(async (req, res) => {
  res.json(await auth.sendOtp(req.body));
}));

router.post("/auth/verify-otp", asyncHandler(async (req, res) => {
  res.json(await auth.verifyOtp(req.body));
}));

router.post("/auth/forgot-password", asyncHandler(async (req, res) => {
  res.json(await auth.sendOtp({ target: req.body.email, purpose: "reset" }));
}));

router.post("/auth/reset-password", asyncHandler(async (req, res) => {
  res.json(await auth.resetPassword(req.body));
}));

router.post("/auth/change-password", requireAuth, asyncHandler(async (req, res) => {
  res.json(await auth.changePassword(req.user.id, req.body));
}));

export default router;
