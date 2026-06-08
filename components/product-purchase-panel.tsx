"use client";

import { useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Product } from "@/lib/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0] ?? "");

  return (
    <div className="mt-8">
      {product.availableSizes.length ? (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
            Select Size
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selectedSize === size
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-pine"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            This product will be added with the selected size and shown the same
            way in cart, checkout, and admin orders.
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-4">
        <AddToCartButton
          productId={product.id}
          size={selectedSize}
          requiresSize={product.availableSizes.length > 0}
        />
        <Link
          href="/checkout"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  );
}
