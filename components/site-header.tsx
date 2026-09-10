"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/components/cart-provider";
import { ZazzoLogo } from "@/components/zazzo-logo";
import { formatCurrency } from "@/lib/currency";
import { Product } from "@/lib/types";

type HeaderIconName = "menu" | "close" | "bag" | "home" | "sparkles" | "card" | "trash" | "minus" | "plus";

function HeaderIcon({ name, className = "" }: { name: HeaderIconName; className?: string }) {
  const paths: Record<HeaderIconName, string> = {
    menu: "M4 6h16M4 12h16M4 18h16",
    close: "M6 6l12 12M18 6L6 18",
    bag: "M6 8h12l1 12H5L6 8Zm3 0a3 3 0 0 1 6 0",
    home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Zm6 11v-6h6v6",
    sparkles: "m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Zm6 11 .7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7L18 14Z",
    card: "M3 6h18v12H3V6Zm0 4h18M7 15h4",
    trash: "M5 7h14M10 11v5m4-5v5M9 7V4h6v3m-9 0 1 13h10l1-13",
    minus: "M5 12h14",
    plus: "M12 5v14M5 12h14"
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

const links = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/products", label: "Products", icon: "sparkles" as const },
  { href: "/checkout", label: "Checkout", icon: "card" as const }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { items, count, removeItem, updateQuantity } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { products?: Product[] } | null) => {
        if (data?.products) setProducts(data.products);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (menuOpen || cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  const subtotal = items.reduce(
    (sum, row) => sum + (products.find((product) => product.id === row.productId)?.price || 0) * row.quantity,
    0
  );

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-amber-950/10 bg-white/80 backdrop-blur-md transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <ZazzoLogo withLink showTagline />
            </div>

            <nav className="hidden items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 p-1.5 text-sm font-medium text-slate-600 shadow-inner lg:flex">
              {links.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 ${
                      active
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-xs"
                    }`}
                  >
                    <HeaderIcon name={Icon} className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative inline-flex items-center gap-2.5 rounded-full border border-amber-300/80 bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-md active:translate-y-0"
                aria-label={`Shopping bag with ${count} items`}
              >
                <HeaderIcon name="bag" className="h-5 w-5" />
                <span className="hidden sm:inline">Bag</span>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 text-xs font-bold text-white">
                  {count}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors duration-200 hover:bg-slate-50 hover:text-slate-950 active:scale-95 lg:hidden"
                aria-label="Open navigation drawer"
              >
                <HeaderIcon name="menu" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mounted &&
        createPortal(
          <>
            <div className="lg:hidden">
              <div
                style={{ zIndex: 99998 }}
                className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
                  menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />

              <aside
                style={{ zIndex: 99999 }}
                className={`fixed inset-y-0 left-0 flex h-dvh w-70 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                  menuOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
                }`}
                aria-label="Mobile navigation drawer"
              >
                <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">
                  <ZazzoLogo compact />
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    aria-label="Close navigation drawer"
                  >
                    <HeaderIcon name="close" className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
                  {links.map((link) => {
                    const active = pathname === link.href;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                          active
                            ? "bg-slate-950 text-white shadow-sm"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                      >
                        <HeaderIcon name={Icon} className={`h-5 w-5 ${active ? "text-amber-400" : "text-slate-500"}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="shrink-0 border-t border-slate-100 p-4 pb-8">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setCartOpen(true);
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-amber-300/80 bg-amber-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-xs transition-colors hover:bg-amber-300"
                  >
                    <div className="flex items-center gap-3">
                      <HeaderIcon name="bag" className="h-5 w-5" />
                      <span>Your Bag</span>
                    </div>
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-950 px-2 text-xs font-bold text-white">
                      {count}
                    </span>
                  </button>
                </div>
              </aside>
            </div>

            <div>
              <div
                style={{ zIndex: 99998 }}
                className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
                  cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setCartOpen(false)}
                aria-hidden="true"
              />

              <aside
                style={{ zIndex: 99999 }}
                className={`fixed inset-y-0 right-0 flex h-dvh w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                  cartOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
                }`}
                aria-label="Shopping Cart Drawer"
              >
                <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">
                  <div className="flex items-center gap-2.5">
                    <HeaderIcon name="bag" className="h-6 w-6 text-slate-950" />
                    <h2 className="text-lg font-bold text-slate-950">Your Cart</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                      {count}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    aria-label="Close cart drawer"
                  >
                    <HeaderIcon name="close" className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <HeaderIcon name="bag" className="h-8 w-8" />
                      </div>
                      <p className="mt-4 text-base font-semibold text-slate-800">Your cart is empty</p>
                      <p className="mt-1 text-sm text-slate-500">Looks like you haven't added anything yet.</p>
                      <button
                        type="button"
                        onClick={() => setCartOpen(false)}
                        className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map(({ productId, quantity, size }) => {
                        const product = products.find((item) => item.id === productId);
                        if (!product) return null;

                        return (
                        <div
                          key={`${product.id}-${size ?? "default"}`}
                          className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50"
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200/60">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover object-center"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
                                  {product.name}
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => removeItem(product.id, size)}
                                  className="text-slate-400 transition hover:text-red-600"
                                  aria-label="Remove item"
                                >
                                  <HeaderIcon name="trash" className="h-4 w-4" />
                                </button>
                              </div>
                              {size ? (
                                <p className="mt-0.5 text-xs text-slate-500">Size: {size}</p>
                              ) : null}
                              <p className="mt-1 text-sm font-bold text-slate-900">
                                {formatCurrency(product.price)}
                              </p>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(product.id, quantity - 1, size)}
                                  className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg transition"
                                  aria-label="Decrease quantity"
                                >
                                  <HeaderIcon name="minus" className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-slate-900">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(product.id, quantity + 1, size)}
                                  className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-lg transition"
                                  aria-label="Increase quantity"
                                >
                                  <HeaderIcon name="plus" className="h-3 w-3" />
                                </button>
                              </div>

                              <span className="text-xs font-semibold text-slate-500">
                                Total: {formatCurrency(product.price * quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span className="text-lg font-bold text-slate-950">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Shipping and taxes are calculated at checkout.
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2.5">
                      <Link
                        href="/checkout"
                        onClick={() => setCartOpen(false)}
                        className="flex w-full items-center justify-center rounded-full bg-slate-950 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800"
                      >
                        Proceed to Checkout
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setCartOpen(false)}
                        className="flex w-full items-center justify-center rounded-full border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View Full Cart
                      </Link>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
