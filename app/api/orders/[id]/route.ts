import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { deleteOrder, updateOrderStatus } from "@/lib/store";
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
    return jsonError(error, "Failed to update order.");
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await deleteOrder(id);
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error, "Failed to delete order.");
  }
}
