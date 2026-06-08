"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({
  productId,
  compact = false,
  size,
  requiresSize = false,
  redirectHref
}: {
  productId: number;
  compact?: boolean;
  size?: string;
  requiresSize?: boolean;
  redirectHref?: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const label = requiresSize && !size ? "Select size" : added ? "Added" : "Add to cart";

  return (
    <button
      type="button"
      onClick={() => {
        if (requiresSize && !size) {
          if (redirectHref) {
            router.push(redirectHref);
          }
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
  );
}
