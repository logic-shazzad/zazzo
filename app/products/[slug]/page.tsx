import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/currency";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const snapshot = await getStoreSnapshot();
  const product = snapshot.products.find((item) => item.slug === slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : []
    }
  };
}

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const snapshot = await getStoreSnapshot();
  const product = snapshot.products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = snapshot.products
    .filter((item) => item.id !== product.id)
    .sort(
      (a, b) =>
        Number(b.category === product.category) - Number(a.category === product.category)
    )
    .slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className="shell min-w-0 py-8 sm:py-12">
        <div className="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-2">
          <ProductGallery
            images={product.images}
            name={product.name}
            accent={product.accent}
          />
          <div className="panel min-w-0 p-5 sm:p-8">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              {product.category}
            </span>
            <h1 className="mt-5 break-words text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {product.description}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Price</p>
                <p className="mt-2 text-2xl font-semibold text-pine">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Stock</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{product.inventory}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Rating</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{product.rating}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">SKU</p>
                <p className="mt-2 text-xl font-semibold text-ink">{product.sku}</p>
              </div>
            </div>
            <ProductPurchasePanel product={product} />
            <p className="mt-6 text-sm leading-6 text-slate-500">
              This product currently has {product.images.length} gallery images for
              customers to review before purchase.
            </p>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: product.images,
              sku: product.sku,
              category: product.category,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                ratingCount: 1
              },
              offers: {
                "@type": "Offer",
                price: product.price,
                priceCurrency: "BDT",
                availability:
                  product.inventory > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock"
              }
            })
          }}
        />

        {relatedProducts.length ? (
          <section className="mt-16">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">
              More to Explore
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              You may also like
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Discover more products from ZAZZO. We are showing similar and popular
              items customers usually browse next.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
