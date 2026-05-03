import { AdminHomepageManager } from "@/components/admin-homepage-manager";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const snapshot = await getStoreSnapshot();
  return (
    <AdminHomepageManager
      initialCards={snapshot.homepageCollections}
      initialHeroDescription={snapshot.heroDescription}
    />
  );
}
