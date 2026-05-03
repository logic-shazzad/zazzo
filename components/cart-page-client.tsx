"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/currency";
import { Product, StoreSettings } from "@/lib/types";

export function CartPageClient({
  products,
  settings
}: {
  products: Product[];
  settings: StoreSettings;
}) {
  const { items, removeItem, updateQuantity } = useCart();

  const rows = items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as { product: Product; quantity: number }[];

  const subtotal = rows.reduce(
    (sum, row) => sum + row.product.price * row.quantity,
    0
  );
  const shipping = subtotal === 0 ? 0 : settings.deliveryCharge;
  const total = subtotal + shipping;

  return (
    <main className="shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="panel p-8">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Your Cart</h1>
          <p className="mt-3 text-slate-600">
            Review products, update quantity, and prepare the order before checkout.
          </p>

          {rows.length === 0 ? (
            <div className="mt-10 rounded-[28px] border border-dashed border-slate-300 p-8 text-center">
              <p className="text-lg text-slate-600">Your cart is empty right now.</p>
              <Link
                href="/products"
                className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
              >
                Explore products
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {rows.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="grid gap-4 rounded-[28px] border border-slate-200 p-4 sm:grid-cols-[120px_1fr_auto]"
                >
                  <div className="relative h-28 overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                      sizes="120px"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{product.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">{product.category}</p>
                    <p className="mt-2 text-lg font-semibold text-pine">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-slate-200 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="text-lg text-slate-500"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="text-lg text-slate-500"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-sm font-medium text-coral"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="panel h-fit p-8">
          <h2 className="text-2xl font-semibold text-ink">Cart Summary</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-ink">{formatCurrency(shipping)}</span>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-base text-slate-600">Total</span>
              <span className="text-3xl font-semibold text-pine">{formatCurrency(total)}</span>
            </div>
            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-500">
              <p>Cart page is for reviewing items only. Payment and shipping details are completed in the checkout step.</p>
              <p>Current delivery charge for this order is {formatCurrency(shipping)}.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700"
              >
                Continue shopping
              </Link>
            <Link
              href="/checkout"
              className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white ${
                rows.length === 0 ? "pointer-events-none bg-slate-300" : "bg-ink"
              }`}
            >
              Continue to secure checkout
            </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
