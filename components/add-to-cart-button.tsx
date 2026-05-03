"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({
  productId,
  compact = false
}: {
  productId: number;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(productId, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white transition ${
        compact ? "bg-pine px-4 py-2 text-sm" : "bg-ink px-6 py-3 text-sm"
      }`}
    >
      <span aria-hidden="true">{added ? "✓" : "+"}</span>
      <span>{added ? "Added" : "Add to cart"}</span>
    </button>
  );
}
