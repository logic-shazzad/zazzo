import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { HomepageCollectionCard } from "@/lib/types";
import { getStoreSnapshot, updateHomepageCollections } from "@/lib/store";

export async function GET() {
  const snapshot = await getStoreSnapshot();
  return NextResponse.json({
    cards: snapshot.homepageCollections,
    heroDescription: snapshot.heroDescription
  });
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
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update homepage collections."
      },
      { status: 400 }
    );
  }
}
