import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/cart-provider";
import { RootChrome } from "@/components/root-chrome";
import { getStoreSnapshot } from "@/lib/store";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://zazzo-zazzo.vercel.app"),
  title: {
    default: "ZAZZO | Modern Fashion & Everyday Essentials",
    template: "%s | ZAZZO"
  },
  description:
    "Shop trend-forward fashion, bags, sneakers, home decor, and everyday essentials from ZAZZO.",
  keywords: ["ZAZZO", "online fashion store", "fashion Bangladesh", "clothing", "bags", "sneakers"],
  authors: [{ name: "ZAZZO" }],
  creator: "ZAZZO",
  openGraph: {
    type: "website",
    siteName: "ZAZZO",
    title: "ZAZZO | Modern Fashion & Everyday Essentials",
    description:
      "Discover refined fashion and everyday essentials with a clean, fast shopping experience."
  },
  twitter: {
    card: "summary_large_image",
    title: "ZAZZO | Modern Fashion & Everyday Essentials",
    description:
      "Discover refined fashion and everyday essentials with a clean, fast shopping experience."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/icon"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
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
