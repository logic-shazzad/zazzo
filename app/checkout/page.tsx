import { CheckoutClient } from "@/components/checkout-client";
import { SiteHeader } from "@/components/site-header";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const snapshot = await getStoreSnapshot();

  return (
    <>
      <SiteHeader />
      <CheckoutClient products={snapshot.products} settings={snapshot.settings} />
    </>
  );
}
