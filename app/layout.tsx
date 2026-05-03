import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import { RootChrome } from "@/components/root-chrome";
import { getStoreSnapshot } from "@/lib/store";
import "./globals.css";

export const dynamic = "force-dynamic";

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
  const snapshotPromise = getStoreSnapshot();

  return (
    <html lang="en">
      <body className="min-h-screen">
        <CartProvider>
          <RootChromeWrapper snapshotPromise={snapshotPromise}>{children}</RootChromeWrapper>
        </CartProvider>
      </body>
    </html>
  );
}

async function RootChromeWrapper({
  children,
  snapshotPromise
}: {
  children: React.ReactNode;
  snapshotPromise: ReturnType<typeof getStoreSnapshot>;
}) {
  const snapshot = await snapshotPromise;
  return <RootChrome branding={snapshot.branding}>{children}</RootChrome>;
}
