import { redirect } from "next/navigation";
import { AdminManager } from "@/components/admin-manager";
import { OWNER_EMAIL, OWNER_PASSWORD, getAdminRoleFromCookies } from "@/lib/admin-auth";
import { getModeratorUsers } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminManagerPage() {
  const role = await getAdminRoleFromCookies();

  if (role !== "owner") {
    redirect("/admin");
  }

  const moderators = await getModeratorUsers();

  return (
    <AdminManager
      owner={{
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD
      }}
      initialModerators={moderators}
    />
  );
}
