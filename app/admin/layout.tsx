import Link from "next/link";
import { getAdminRoleFromCookies } from "@/lib/admin-auth";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const role = await getAdminRoleFromCookies();

  return (
    <main className="shell py-6">
      <header className="panel mb-6 flex items-center justify-between px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Backend</p>
          <h1 className="text-xl font-semibold text-ink">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-medium text-coral">
            Back to storefront
          </Link>
          <AdminLogoutButton />
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar role={role} />
        <section>{children}</section>
      </div>
    </main>
  );
}
