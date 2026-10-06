"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({
  productId,
  compact = false,
  size,
  requiresSize = false,
  redirectHref,
  sizeOptions = [],
  productName = "this product"
}: {
  productId: number;
  compact?: boolean;
  size?: string;
  requiresSize?: boolean;
  redirectHref?: string;
  sizeOptions?: string[];
  productName?: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const label = requiresSize && !size ? "Select size" : added ? "Added" : "Add to cart";

  function addSelectedSize(selectedSize: string) {
    addItem(productId, 1, selectedSize);
    setSizePickerOpen(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (requiresSize && !size) {
            if (sizeOptions.length) {
              setSizePickerOpen(true);
              return;
            }
            if (redirectHref) router.push(redirectHref);
            return;
          }

          addItem(productId, 1, size);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1400);
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white transition ${
          compact ? "bg-pine px-4 py-2 text-sm" : "bg-ink px-6 py-3 text-sm"
        }`}
      >
        <span aria-hidden="true">{added ? "✓" : requiresSize && !size ? "•" : "+"}</span>
        <span>{label}</span>
      </button>

      {sizePickerOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Select a size for ${productName}`}
          onClick={() => setSizePickerOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                  Select Size
                </p>
                <h2 className="mt-2 text-xl font-semibold text-ink">{productName}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSizePickerOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 hover:bg-slate-50"
                aria-label="Close size selector"
              >
                ×
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sizeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => addSelectedSize(option)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-ink hover:bg-ink hover:text-white"
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
              Choose a size to add this product to your bag.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
