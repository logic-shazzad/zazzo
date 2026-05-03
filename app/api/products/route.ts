import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { createProduct, getStoreSnapshot } from "@/lib/store";
import { ProductInput } from "@/lib/types";

function normalizeProductInput(body: Record<string, unknown>): ProductInput {
  const images = Array.isArray(body.images)
    ? body.images
    : typeof body.images === "string"
      ? body.images.split("\n")
      : typeof body.image === "string"
        ? [body.image]
        : [];

  return {
    name: String(body.name ?? "").trim(),
    category: String(body.category ?? "").trim(),
    description: String(body.description ?? "").trim(),
    price: Number(body.price ?? 0),
    inventory: Number(body.inventory ?? 0),
    rating: Number(body.rating ?? 4.5),
    images: images.map((image) => String(image).trim()).filter(Boolean),
    accent: String(body.accent ?? "from-slate-200 via-white to-white").trim(),
    featured: Boolean(body.featured),
    sku: String(body.sku ?? "").trim()
  };
}

function validateProductInput(input: ProductInput) {
  if (
    !input.name ||
    !input.category ||
    !input.description ||
    !input.accent ||
    !input.sku
  ) {
    throw new Error("Please complete all product fields.");
  }

  if (input.images.length < 3 || input.images.length > 9) {
    throw new Error("Please add between 3 and 9 product images.");
  }

  if (input.price <= 0 || input.inventory < 0 || input.rating <= 0) {
    throw new Error("Price, inventory, and rating must be valid numbers.");
  }
}

export async function GET() {
  try {
    const snapshot = await getStoreSnapshot();
    return NextResponse.json(snapshot.products);
  } catch (error) {
    return jsonError(error, "Failed to load products.");
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input = normalizeProductInput(body);
    validateProductInput(input);
    const product = await createProduct(input);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return jsonError(error, "Failed to create product.");
  }
}
