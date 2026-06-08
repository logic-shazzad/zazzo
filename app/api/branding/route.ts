import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { jsonError } from "@/lib/api-response";
import { getStoreSnapshot, updateStoreBranding } from "@/lib/store";
import { StoreBranding } from "@/lib/types";

export async function GET() {
  try {
    const snapshot = await getStoreSnapshot();
    return NextResponse.json(snapshot.branding);
  } catch (error) {
    return jsonError(error, "Failed to load branding.");
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<StoreBranding>;
    const branding = await updateStoreBranding({
      footerDescription: String(body.footerDescription ?? ""),
      widgetTitle: String(body.widgetTitle ?? ""),
      whatsappLabel: String(body.whatsappLabel ?? ""),
      whatsappNumber: String(body.whatsappNumber ?? ""),
      phoneLabel: String(body.phoneLabel ?? ""),
      phoneNumber: String(body.phoneNumber ?? ""),
      facebookLabel: String(body.facebookLabel ?? ""),
      facebookHandle: String(body.facebookHandle ?? ""),
      facebookPageUrl: String(body.facebookPageUrl ?? ""),
      supportHours: String(body.supportHours ?? ""),
      socialFacebookLabel: String(body.socialFacebookLabel ?? ""),
      socialFacebookUrl: String(body.socialFacebookUrl ?? ""),
      socialInstagramLabel: String(body.socialInstagramLabel ?? ""),
      socialInstagramUrl: String(body.socialInstagramUrl ?? ""),
      socialWhatsappLabel: String(body.socialWhatsappLabel ?? "")
    });

    revalidatePath("/", "layout");
    revalidatePath("/products");
    revalidatePath("/checkout");
    revalidatePath("/cart");

    return NextResponse.json({ branding });
  } catch (error) {
    return jsonError(error, "Failed to update branding.");
  }
}
