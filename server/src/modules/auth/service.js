import crypto from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { hashPassword, verifyPassword, hashToken, verifyTokenHash } from "../../lib/password.js";
import { signAccessToken, signRefreshToken, refreshExpiryDate } from "../../lib/jwt.js";
import { httpError } from "../../lib/http.js";

const OTP_TTL = Number(process.env.OTP_TTL_SECONDS || 300);

function hashOtp(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function makeOtp() {
  return String(crypto.randomInt(100000, 999999));
}

export async function registerUser({ email, password, name, phone }) {
  if (!email || !password || !name) throw httpError(400, "email, password, and name are required");
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) throw httpError(409, "Email already registered");

  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      phone: phone || null,
      name,
      passwordHash: await hashPassword(password)
    },
    select: { id: true, email: true, name: true, phone: true }
  });
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw httpError(401, "Invalid email or password");
  }
  return issueTokens(user);
}

export async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: refreshExpiryDate()
    }
  });
  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone }
  };
}

export async function refreshSession(refreshToken) {
  const records = await prisma.refreshToken.findMany({
    where: { expiresAt: { gt: new Date() } },
    include: { user: true }
  });
  const match = records.find((r) => verifyTokenHash(refreshToken, r.tokenHash));
  if (!match) throw httpError(401, "Invalid refresh token");

  await prisma.refreshToken.delete({ where: { id: match.id } });
  return issueTokens(match.user);
}

export async function logoutUser(refreshToken) {
  const records = await prisma.refreshToken.findMany({ where: { expiresAt: { gt: new Date() } } });
  const match = records.find((r) => verifyTokenHash(refreshToken, r.tokenHash));
  if (match) await prisma.refreshToken.delete({ where: { id: match.id } });
  return { status: "logged_out" };
}

export async function sendOtp({ target, purpose }) {
  if (!target || !purpose) throw httpError(400, "target and purpose are required");
  const code = makeOtp();
  await prisma.otpCode.deleteMany({ where: { target, purpose } });
  await prisma.otpCode.create({
    data: {
      target: target.toLowerCase(),
      purpose,
      codeHash: hashOtp(code),
      expiresAt: new Date(Date.now() + OTP_TTL * 1000)
    }
  });
  if (process.env.NODE_ENV !== "production") {
    console.log(`[OTP] ${purpose} for ${target}: ${code}`);
  }
  return { status: "sent", expiresIn: OTP_TTL };
}

export async function verifyOtp({ target, code, purpose }) {
  const record = await prisma.otpCode.findFirst({
    where: { target: target.toLowerCase(), purpose, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" }
  });
  if (!record || record.codeHash !== hashOtp(code)) throw httpError(400, "Invalid or expired OTP");
  await prisma.otpCode.delete({ where: { id: record.id } });
  return { status: "verified" };
}

export async function resetPassword({ email, code, newPassword }) {
  await verifyOtp({ target: email, code, purpose: "reset" });
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw httpError(404, "User not found");
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) }
  });
  return { status: "password_reset" };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw httpError(401, "Current password is incorrect");
  }
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(newPassword) }
  });
  return { status: "password_changed" };
}
