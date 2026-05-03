import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import { RootChrome } from "@/components/root-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZAZZO",
  description:
    "ZAZZO is a clean modern ecommerce storefront with a private admin dashboard.",
  icons: {
    icon: "/icon"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <RootChrome>{children}</RootChrome>
        </CartProvider>
      </body>
    </html>
  );
}
