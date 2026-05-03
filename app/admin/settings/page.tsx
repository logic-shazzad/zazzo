import { AdminSettingsManager } from "@/components/admin-settings-manager";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const snapshot = await getStoreSnapshot();
  return <AdminSettingsManager initialSettings={snapshot.settings} />;
}
