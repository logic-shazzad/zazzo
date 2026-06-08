import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { deleteProduct, updateProduct } from "@/lib/store";
import { ProductInput } from "@/lib/types";

function normalizeProductInput(body: Record<string, unknown>): ProductInput {
  const images = Array.isArray(body.images)
    ? body.images
    : typeof body.images === "string"
      ? body.images.split("\n")
      : typeof body.image === "string"
        ? [body.image]
        : [];
  const sizes = Array.isArray(body.availableSizes)
    ? body.availableSizes
    : typeof body.availableSizes === "string"
      ? body.availableSizes.split(/[\n,]+/)
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
    sku: String(body.sku ?? "").trim(),
    availableSizes: sizes.map((size) => String(size).trim().toUpperCase()).filter(Boolean)
  };
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const input = normalizeProductInput(body);

    if (input.images.length < 3 || input.images.length > 9) {
      throw new Error("Please add between 3 and 9 product images.");
    }

    const product = await updateProduct(Number(id), input);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    return NextResponse.json(product);
  } catch (error) {
    return jsonError(error, "Failed to update product.");
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await deleteProduct(Number(id));
    revalidatePath("/");
    revalidatePath("/products");
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error, "Failed to delete product.");
  }
}
