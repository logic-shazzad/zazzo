import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { OWNER_EMAIL, OWNER_PASSWORD, requireOwnerRole } from "@/lib/admin-auth";
import { createModeratorUser, deleteModeratorUser, getModeratorUsers } from "@/lib/store";

export async function GET() {
  try {
    await requireOwnerRole();
    const moderators = await getModeratorUsers();

    return NextResponse.json({
      owner: {
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD
      },
      moderators
    });
  } catch (error) {
    return jsonError(error, "Failed to load admin manager data.");
  }
}

export async function POST(request: Request) {
  try {
    await requireOwnerRole();
    const body = (await request.json()) as { email?: string; password?: string };
    const moderator = await createModeratorUser({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
      ownerEmail: OWNER_EMAIL
    });

    return NextResponse.json({ moderator });
  } catch (error) {
    return jsonError(error, "Failed to create moderator.");
  }
}

export async function DELETE(request: Request) {
  try {
    await requireOwnerRole();
    const body = (await request.json()) as { id?: string };
    const result = await deleteModeratorUser(String(body.id ?? ""));

    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error, "Failed to remove moderator.");
  }
}
