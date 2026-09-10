import { CartPageClient } from "@/components/cart-page-client";
import { SiteHeader } from "@/components/site-header";
import { getStoreSnapshot } from "@/lib/store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your Shopping Bag",
  robots: { index: false, follow: false }
};

export default async function CartPage() {
  const snapshot = await getStoreSnapshot();

  return (
    <>
      <SiteHeader />
      <CartPageClient products={snapshot.products} settings={snapshot.settings} />
    </>
  );
}
