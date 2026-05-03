import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatCurrency } from "@/lib/currency";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-soft transition duration-300 hover:shadow-[0_20px_50px_rgba(31,41,51,0.10)] sm:rounded-[30px] sm:hover:-translate-y-1 sm:hover:shadow-[0_24px_70px_rgba(31,41,51,0.12)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className={`bg-gradient-to-br ${product.accent} p-3.5 sm:p-5`}>
          <div className="relative h-52 overflow-hidden rounded-[18px] bg-white/90 sm:h-64 sm:rounded-[24px]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
            quality={70}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-slate-700">
            {product.category}
          </span>
          <span className="text-sm text-slate-500">{product.rating} rating</span>
        </div>
        <div>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-lg font-semibold text-ink sm:text-xl">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3">
              {product.description}
            </p>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-semibold text-pine sm:text-2xl">{formatCurrency(product.price)}</span>
          <AddToCartButton productId={product.id} compact />
        </div>
      </div>
    </article>
  );
}
