import Link from "next/link";
import { AdminRole } from "@/lib/admin-auth";
import { ZazzoLogo } from "@/components/zazzo-logo";

const groups = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard" }]
  },
  {
    label: "Store",
    links: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/customers", label: "Customers" }
    ]
  },
  {
    label: "Content",
    links: [
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/branding", label: "Branding" }
    ]
  },
  {
    label: "System",
    links: [{ href: "/admin/settings", label: "Settings" }]
  }
];

export function AdminSidebar({ role }: { role: AdminRole | null }) {
  const visibleGroups =
    role === "owner"
      ? [
          ...groups,
          {
            label: "Access",
            links: [{ href: "/admin/admin-manager", label: "Admin Manager" }]
          }
        ]
      : groups;

  return (
    <aside className="panel h-fit p-5">
      <div className="rounded-[22px] bg-pine p-5 text-white">
        <ZazzoLogo compact dark />
        <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/70">Admin</p>
        <h2 className="mt-1 text-2xl font-semibold">ZAZZO Control</h2>
        <p className="mt-3 text-sm leading-6 text-white/75">
          Products, orders, payments, and delivery status in one place.
        </p>
      </div>
      <nav className="mt-6 space-y-5">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
              {group.label}
            </p>
            <div className="mt-1 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
