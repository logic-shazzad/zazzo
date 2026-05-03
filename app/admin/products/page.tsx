import { AdminProductsManager } from "@/components/admin-products-manager";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const snapshot = await getStoreSnapshot();
  return <AdminProductsManager initialProducts={snapshot.products} />;
}
