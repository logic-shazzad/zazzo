import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { getStoreSnapshot } from "@/lib/store";

export async function GET() {
  try {
    const snapshot = await getStoreSnapshot();
    return NextResponse.json(snapshot.customers);
  } catch (error) {
    return jsonError(error, "Failed to load customers.");
  }
}
