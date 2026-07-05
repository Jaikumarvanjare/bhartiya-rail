import jwt from "jsonwebtoken";

const accessSecret = () => process.env.JWT_ACCESS_SECRET || "dev-access-secret";
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, accessSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m"
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: "refresh" }, refreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d"
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret());
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, refreshSecret());
  if (payload.type !== "refresh") throw new Error("Invalid refresh token");
  return payload;
}

export function refreshExpiryDate() {
  const days = Number(process.env.JWT_REFRESH_DAYS || 7);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
