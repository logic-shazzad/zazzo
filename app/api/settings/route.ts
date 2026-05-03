import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { getStoreSnapshot, updateStoreSettings } from "@/lib/store";

export async function GET() {
  try {
    const snapshot = await getStoreSnapshot();
    return NextResponse.json(snapshot.settings);
  } catch (error) {
    return jsonError(error, "Failed to load store settings.");
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { deliveryCharge?: number };
    const settings = await updateStoreSettings({
      deliveryCharge: Number(body.deliveryCharge ?? 0)
    });

    revalidatePath("/");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/admin/settings");

    return NextResponse.json({ settings });
  } catch (error) {
    return jsonError(error, "Failed to update settings.");
  }
}
