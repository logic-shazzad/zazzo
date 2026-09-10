import type { MetadataRoute } from "next";
import { getStoreSnapshot } from "@/lib/store";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zazzo-zazzo.vercel.app";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/products`, changeFrequency: "daily", priority: 0.9 }
  ];

  try {
    const snapshot = await getStoreSnapshot();
    return [
      ...staticRoutes,
      ...snapshot.products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8
      }))
    ];
  } catch {
    return staticRoutes;
  }
}
