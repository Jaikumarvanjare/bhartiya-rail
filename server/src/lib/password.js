import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function hashToken(token) {
  return bcrypt.hashSync(token, 10);
}

export async function verifyTokenHash(token, tokenHash) {
  return bcrypt.compare(token, tokenHash);
}
