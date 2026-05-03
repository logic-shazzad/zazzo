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
  addItem: (productId: number, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
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
    addItem: (productId, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (!existing) {
          return [...current, { productId, quantity }];
        }

        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      });
    },
    updateQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        setItems((current) => current.filter((item) => item.productId !== productId));
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    },
    removeItem: (productId) => {
      setItems((current) => current.filter((item) => item.productId !== productId));
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
