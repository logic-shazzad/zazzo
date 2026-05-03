import { CartPageClient } from "@/components/cart-page-client";
import { SiteHeader } from "@/components/site-header";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const snapshot = await getStoreSnapshot();

  return (
    <>
      <SiteHeader />
      <CartPageClient products={snapshot.products} settings={snapshot.settings} />
    </>
  );
}
