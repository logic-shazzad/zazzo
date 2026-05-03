import { NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_EMAIL ?? "admin@zazzo.local";
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "admin12345";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "").trim();

  if (email !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("zazzo_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return response;
}
