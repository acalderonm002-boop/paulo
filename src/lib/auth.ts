import "server-only";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const ADMIN_COOKIE = "admin_token";

type AdminTokenPayload = {
  admin: true;
  iat?: number;
  exp?: number;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

export function signAdminToken(): string {
  return jwt.sign({ admin: true }, getSecret(), { expiresIn: "24h" });
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const secret = getSecret();
    const payload = jwt.verify(token, secret) as AdminTokenPayload;
    return payload.admin === true;
  } catch {
    return false;
  }
}

/**
 * Reads the admin_token cookie from the current request and verifies it.
 * Usable from Route Handlers and Server Components.
 */
export function verifyAdmin(): boolean {
  const store = cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}
