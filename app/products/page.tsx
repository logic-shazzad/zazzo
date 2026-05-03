import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/section-title";
import { SiteHeader } from "@/components/site-header";
import { getStoreSnapshot } from "@/lib/store";

export const revalidate = 3600;

export default async function ProductsPage() {
  const snapshot = await getStoreSnapshot();

  return (
    <>
      <SiteHeader />
      <main className="shell py-12">
        <SectionTitle
          eyebrow="Catalog"
          title="Find the styles you love and add them to your bag instantly."
          description="Explore the full ZAZZO collection with clean visuals, easy browsing, and quick shopping actions built to make customers feel confident and excited."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {snapshot.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}
