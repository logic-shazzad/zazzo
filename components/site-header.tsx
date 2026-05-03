"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { useCart } from "@/components/cart-provider";
import { ZazzoLogo } from "@/components/zazzo-logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/checkout", label: "Checkout" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 lg:bg-white/90 lg:backdrop-blur-md">
      <div className="shell">
        <div className="flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">
          <ZazzoLogo withLink showTagline />
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex items-center justify-center lg:hidden"
            aria-label="Toggle menu"
          >
            <BrandIcon size={36} circle />
          </button>
          <nav className="hidden items-center gap-2 text-sm font-medium text-slate-600 lg:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2.5 transition ${
                    active ? "bg-[#111111] text-white" : "hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/cart"
              className="rounded-full bg-[#F5B800] px-4 py-2.5 font-semibold text-[#111111] transition hover:translate-y-[-1px]"
            >
              Bag ({count})
            </Link>
          </nav>
        </div>
        {menuOpen ? (
          <nav className="grid gap-2 border-t border-slate-200 py-4 lg:hidden">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-[#111111] text-white" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl bg-[#F5B800] px-4 py-3 text-sm font-semibold text-[#111111]"
            >
              Bag ({count})
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
