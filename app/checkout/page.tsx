import { CheckoutClient } from "@/components/checkout-client";
import { SiteHeader } from "@/components/site-header";
import { getStoreSnapshot } from "@/lib/store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Secure Checkout",
  robots: { index: false, follow: false }
};

export default async function CheckoutPage() {
  const snapshot = await getStoreSnapshot();

  return (
    <>
      <SiteHeader />
      <CheckoutClient products={snapshot.products} settings={snapshot.settings} />
    </>
  );
}
