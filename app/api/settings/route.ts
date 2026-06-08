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
    const body = (await request.json()) as {
      insideDhakaDeliveryCharge?: number;
      outsideDhakaDeliveryCharge?: number;
    };
    const settings = await updateStoreSettings({
      insideDhakaDeliveryCharge: Number(body.insideDhakaDeliveryCharge ?? 0),
      outsideDhakaDeliveryCharge: Number(body.outsideDhakaDeliveryCharge ?? 0)
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
