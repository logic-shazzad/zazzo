"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/currency";
import { DeliveryZone, Product, StoreSettings } from "@/lib/types";

export function CheckoutClient({
  products,
  settings
}: {
  products: Product[];
  settings: StoreSettings;
}) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
    deliveryZone: "inside_dhaka" as DeliveryZone
  });

  const cartRows = items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { product, quantity: item.quantity, size: item.size } : null;
    })
    .filter(Boolean) as { product: Product; quantity: number; size?: string }[];

  const subtotal = cartRows.reduce(
    (sum, row) => sum + row.product.price * row.quantity,
    0
  );
  const shipping =
    subtotal === 0
      ? 0
      : form.deliveryZone === "inside_dhaka"
        ? settings.insideDhakaDeliveryCharge
        : settings.outsideDhakaDeliveryCharge;
  const total = subtotal + shipping;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cartRows.length) {
      setMessage("Please add products to your cart before checkout.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        items
      })
    });

    const data = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      setMessage(data.message ?? "Failed to place order.");
      setLoading(false);
      return;
    }

    clearCart();
    setLoading(false);
    setSuccessMessage(
      `Congratulations! Your order ${data.id} has been placed successfully. We will inform you shortly with the next delivery update.`
    );
    setMessage(null);
    router.refresh();
  }

  return (
    <main className="shell py-12">
      {successMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
              Order Confirmed
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
              Thank you for shopping with ZAZZO
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{successMessage}</p>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <section className="panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
            Checkout
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">
            Complete shipping details and confirm the payment method.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            This step is only for final order confirmation. If you want to change
            products or quantities, go back to the cart first.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            {[
              ["name", "Full Name"],
              ["email", "Email Address"],
              ["phone", "Phone Number"],
              ["address", "Shipping Address"]
            ].map(([key, label]) => (
              <label key={key} className="grid gap-2 text-sm font-medium text-slate-700">
                {label}
                <input
                  required={key !== "email"}
                  value={form[key as keyof typeof form]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
                  placeholder={
                    key === "email"
                      ? "Enter email address (optional)"
                      : `Enter ${label.toLowerCase()}`
                  }
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Delivery Area
              <select
                value={form.deliveryZone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    deliveryZone: event.target.value as DeliveryZone
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
              >
                <option value="inside_dhaka">Inside Dhaka City Corporation</option>
                <option value="outside_dhaka">Outside Dhaka City Corporation</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Payment Method
              <select
                value={form.paymentMethod}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    paymentMethod: event.target.value
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
              >
                <option>Cash on Delivery</option>
                <option>bKash</option>
                <option>Nagad</option>
                <option>Card</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-3 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Placing order..." : "Place order"}
            </button>
            <Link
              href="/cart"
              className="text-sm font-medium text-pine"
            >
              Back to cart
            </Link>
            {message ? <p className="text-sm text-pine">{message}</p> : null}
          </form>
        </section>

        <aside className="panel p-8">
          <h2 className="text-2xl font-semibold text-ink">Final Order Summary</h2>
          <div className="mt-6 space-y-4">
            {cartRows.length === 0 ? (
              <p className="text-sm text-slate-500">
                No items in cart yet. Add products first, then come back to checkout.
              </p>
            ) : (
              cartRows.map(({ product, quantity, size }) => (
                <div
                  key={`${product.id}-${size ?? "default"}`}
                  className="flex items-center justify-between text-sm text-slate-600"
                >
                  <span>
                    {product.name}
                    {size ? ` (${size})` : ""} x {quantity}
                  </span>
                  <span className="font-semibold text-ink">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-ink">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Area</span>
                <span className="font-semibold text-ink">
                  {form.deliveryZone === "inside_dhaka"
                    ? "Inside Dhaka City Corporation"
                    : "Outside Dhaka City Corporation"}
                </span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-base text-slate-600">Total</span>
              <span className="text-3xl font-semibold text-pine">{formatCurrency(total)}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Taxes are included in product pricing. Delivery charge is applied once
              per order based on the area selected by the customer.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
