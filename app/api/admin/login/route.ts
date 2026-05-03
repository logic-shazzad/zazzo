import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminCookieOptions,
  OWNER_EMAIL,
  OWNER_PASSWORD
} from "@/lib/admin-auth";
import { getModeratorUsers } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "").trim();

  let role: "owner" | "moderator" | null = null;

  if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
    role = "owner";
  } else {
    const moderators = await getModeratorUsers();
    const moderator = moderators.find(
      (entry) => entry.email.toLowerCase() === email && entry.password === password
    );

    if (moderator) {
      role = "moderator";
    }
  }

  if (!role) {
    return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, role });
  response.cookies.set(ADMIN_COOKIE_NAME, role, createAdminCookieOptions());
  return response;
}
