import { AdminBrandingManager } from "@/components/admin-branding-manager";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminBrandingPage() {
  const snapshot = await getStoreSnapshot();
  return <AdminBrandingManager initialBranding={snapshot.branding} />;
}
