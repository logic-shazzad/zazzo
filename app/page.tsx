import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/section-title";
import { SiteHeader } from "@/components/site-header";
import { getStoreSnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const snapshot = await getStoreSnapshot();

  return (
    <>
      <SiteHeader />
      <main className="pb-6">
        <section className="bg-hero-grid">
          <div className="shell grid gap-6 py-6 sm:gap-7 sm:py-8 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-center lg:py-10">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0">
              <div className="inline-flex items-center rounded-full border border-coral/20 bg-white/85 px-4 py-2 shadow-sm">
                <span className="text-sm font-medium text-coral">Modern fashion destination</span>
              </div>
              <h1 className="mt-4 text-[2.2rem] font-semibold tracking-tight leading-[1.12] text-ink sm:mt-5 sm:text-4xl sm:leading-[1.12] lg:text-[3.2rem] lg:leading-[1.07]">
                <span className="block">
                  <span className="font-black text-[#111111]">ZAZZO</span> brings
                </span>
                <span className="block">stylish fashion finds</span>
                <span className="block">into one clean,</span>
                <span className="block">
                  <span className="font-black text-coral">Premium Shopping</span> experience.
                </span>
              </h1>
              <p className="mt-4 max-w-[52ch] text-base leading-7 text-slate-700 sm:mt-5 sm:text-xl sm:leading-9">
                {snapshot.heroDescription}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products"
                  className="rounded-full bg-pine px-7 py-3 text-center text-sm font-semibold text-white sm:w-auto"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="panel overflow-hidden p-2.5 sm:p-3">
              <div className="relative min-h-[280px] overflow-hidden rounded-[22px] sm:min-h-[390px] sm:rounded-[26px]">
                <Image
                  src="https://images.pexels.com/photos/9155636/pexels-photo-9155636.jpeg?cs=srgb&dl=pexels-cottonbro-9155636.jpg&fm=jpg"
                  alt="Stylish female and male fashion banner for ZAZZO"
                  fill
                  className="object-cover object-center"
                  priority
                  quality={72}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/75">
                    Signature Style
                  </p>
                  <h2 className="mt-2 max-w-md text-xl font-semibold tracking-tight sm:mt-3 sm:text-4xl">
                    ZAZZO makes comfort look confident and style feel effortless.
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/90 sm:mt-4 sm:text-lg sm:leading-8">
                    Discover refined fashion for men and women with pieces that feel
                    modern, wearable, and made to elevate your everyday presence.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
                    <Link
                      href="/products"
                      className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-ink"
                    >
                      Explore Styles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shell section-auto mt-14 sm:mt-16">
          <SectionTitle
            eyebrow="Featured Products"
            title="Pick your favorites and add them to bag in a single tap."
            description="Browse fresh ZAZZO picks with clear prices, stylish presentation, and quick add-to-cart actions that make shopping feel smooth and satisfying."
          />
          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {snapshot.featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="shell section-auto mt-14 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {snapshot.homepageCollections.map((card) => (
            <article key={card.id} className="panel p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
                {card.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-ink">{card.title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
