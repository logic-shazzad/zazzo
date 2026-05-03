import { cookies } from "next/headers";

export const OWNER_EMAIL = "gb.shazzad@gmail.com";
export const OWNER_PASSWORD = "GB.Shaz-ZaD@#";
export const ADMIN_COOKIE_NAME = "zazzo_admin";

export type AdminRole = "owner" | "moderator";

export function isAdminRole(value: string | undefined): value is AdminRole {
  return value === "owner" || value === "moderator";
}

export function createAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  };
}

export async function getAdminRoleFromCookies() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isAdminRole(value) ? value : null;
}

export async function requireOwnerRole() {
  const role = await getAdminRoleFromCookies();
  if (role !== "owner") {
    throw new Error("Owner access is required for this action.");
  }

  return role;
}
