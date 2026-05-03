import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/store";
import { DeliveryStatus, PaymentStatus } from "@/lib/types";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      paymentStatus?: PaymentStatus;
      deliveryStatus?: DeliveryStatus;
    };
    const order = await updateOrderStatus(id, body);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update order" },
      { status: 400 }
    );
  }
}
