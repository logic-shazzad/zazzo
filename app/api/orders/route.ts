import { NextResponse } from "next/server";
import { createOrder, getStoreSnapshot } from "@/lib/store";
import { CartItem, CreateOrderInput } from "@/lib/types";

export async function GET() {
  const snapshot = await getStoreSnapshot();
  return NextResponse.json(snapshot.orders);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input: CreateOrderInput = {
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      address: String(body.address ?? "").trim(),
      paymentMethod: String(body.paymentMethod ?? "Cash on Delivery").trim(),
      items: Array.isArray(body.items) ? (body.items as CartItem[]) : []
    };

    if (!input.name || !input.phone || !input.address) {
      throw new Error("Please complete customer information before placing the order.");
    }

    const order = await createOrder(input);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to place order" },
      { status: 400 }
    );
  }
}
