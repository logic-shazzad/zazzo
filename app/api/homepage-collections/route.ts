import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { HomepageCollectionCard } from "@/lib/types";
import { getStoreSnapshot, updateHomepageCollections } from "@/lib/store";

export async function GET() {
  try {
    const snapshot = await getStoreSnapshot();
    return NextResponse.json({
      cards: snapshot.homepageCollections,
      heroDescription: snapshot.heroDescription
    });
  } catch (error) {
    return jsonError(error, "Failed to load homepage content.");
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      cards?: HomepageCollectionCard[];
      heroDescription?: string;
    };
    const cards = Array.isArray(body.cards) ? body.cards : [];
    const updatedHomepageContent = await updateHomepageCollections(
      cards,
      body.heroDescription
    );
    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return NextResponse.json(updatedHomepageContent);
  } catch (error) {
    return jsonError(error, "Failed to update homepage collections.");
  }
}
