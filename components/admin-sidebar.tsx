import Link from "next/link";
import { ZazzoLogo } from "@/components/zazzo-logo";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/settings", label: "Settings" }
];

export function AdminSidebar() {
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
      <nav className="mt-6 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
