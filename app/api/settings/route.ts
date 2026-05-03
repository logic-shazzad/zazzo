import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getStoreSnapshot, updateStoreSettings } from "@/lib/store";

export async function GET() {
  const snapshot = await getStoreSnapshot();
  return NextResponse.json(snapshot.settings);
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
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update settings." },
      { status: 400 }
    );
  }
}
