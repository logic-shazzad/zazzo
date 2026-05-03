import { AdminOrdersManager } from "@/components/admin-orders-manager";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const snapshot = await getStoreSnapshot();
  return <AdminOrdersManager initialOrders={snapshot.orders} />;
}
