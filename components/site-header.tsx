"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 lg:bg-white/90 lg:backdrop-blur-md">
      <div className="shell">
        <div className="flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">
          <ZazzoLogo withLink showTagline />
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
        <nav className="border-t border-slate-200 py-3 lg:hidden">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    active ? "bg-[#111111] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/cart"
              className="shrink-0 rounded-full bg-[#F5B800] px-4 py-2.5 text-sm font-semibold text-[#111111] transition"
            >
              Bag ({count})
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
