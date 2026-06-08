"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (productId: number, quantity?: number, size?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string) => void;
  removeItem: (productId: number, size?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "zazzo-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setItems(JSON.parse(saved) as CartItem[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value: CartContextValue = {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem: (productId, quantity = 1, size) => {
      setItems((current) => {
        const normalizedSize = size?.trim() || undefined;
        const existing = current.find(
          (item) => item.productId === productId && item.size === normalizedSize
        );
        if (!existing) {
          return [...current, { productId, quantity, size: normalizedSize }];
        }

        return current.map((item) =>
          item.productId === productId && item.size === normalizedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      });
    },
    updateQuantity: (productId, quantity, size) => {
      const normalizedSize = size?.trim() || undefined;
      if (quantity <= 0) {
        setItems((current) =>
          current.filter(
            (item) => !(item.productId === productId && item.size === normalizedSize)
          )
        );
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.productId === productId && item.size === normalizedSize
            ? { ...item, quantity }
            : item
        )
      );
    },
    removeItem: (productId, size) => {
      const normalizedSize = size?.trim() || undefined;
      setItems((current) =>
        current.filter(
          (item) => !(item.productId === productId && item.size === normalizedSize)
        )
      );
    },
    clearCart: () => setItems([])
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
