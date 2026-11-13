"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";

import {
  getRecentlyViewedForDisplay,
  trackRecentlyViewed,
  type RecentlyViewedItem,
} from "@/lib/recently-viewed";
import { formatPrice, type Product } from "@/lib/shopify/types";
import { getProductPath } from "@/lib/storefront/product-routing";

/** Recently viewed Lifestyle products only; Toys products are never shown here. */
export default function LifestyleRecentlyViewed({ currentProduct }: { currentProduct: Product }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    const previous = getRecentlyViewedForDisplay(currentProduct.handle, 6, true);
    trackRecentlyViewed(currentProduct);
    const frame = requestAnimationFrame(() => setItems(previous));
    return () => cancelAnimationFrame(frame);
  }, [currentProduct]);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="lifestyle-recently-viewed" className="border-t border-ls-line py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="lifestyle-recently-viewed" className="font-ls-display text-xl font-bold tracking-[-0.01em] text-ls-ink">
          Recently viewed
        </h2>
        <ul className="-mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li key={item.handle} className="w-36 shrink-0 sm:w-auto">
              <Link href={getProductPath(item)} className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-ls-sand">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt="" fill sizes="(max-width: 640px) 144px, 16vw" className="object-cover" />
                  ) : (
                    <ImageOff className="absolute inset-0 m-auto size-5 text-ls-muted" aria-hidden />
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-ls-ink group-hover:underline group-hover:underline-offset-4">{item.title}</p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-ls-ink">{formatPrice(item.price, item.currencyCode)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
