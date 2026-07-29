"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import {
  formatPrice,
  getProductImageUrl,
  type Product,
} from "@/lib/shopify/types";
import ProductCardRating from "@/components/reviews/ProductCardRating";

interface RecentlyViewedProps {
  currentHandle: string;
  productPool: Product[];
}

export default function RecentlyViewed({
  currentHandle,
  productPool,
}: RecentlyViewedProps) {
  const [handles, setHandles] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("kobbo-recently-viewed");
    const previous: string[] = stored ? JSON.parse(stored) : [];
    const updated = [
      currentHandle,
      ...previous.filter((h) => h !== currentHandle),
    ].slice(0, 6);
    localStorage.setItem("kobbo-recently-viewed", JSON.stringify(updated));
    setHandles(updated.filter((h) => h !== currentHandle).slice(0, 4));
  }, [currentHandle]);

  const products = handles
    .map((handle) => productPool.find((p) => p.handle === handle))
    .filter((p): p is Product => Boolean(p));

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("recently-viewed-track");
    if (!container) return;
    const amount = direction === "left" ? -280 : 280;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="bg-kobbo-cream py-5 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-extrabold text-kobbo-black sm:text-2xl">
            Recently Viewed
          </h2>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scroll("left")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-kobbo-white shadow-soft transition-colors hover:bg-kobbo-yellow"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-kobbo-white shadow-soft transition-colors hover:bg-kobbo-yellow"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          id="recently-viewed-track"
          className="mt-4 flex gap-3 overflow-x-auto pb-2 sm:gap-4"
        >
          {products.map((product) => {
            const imageUrl = getProductImageUrl(product);
            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group w-40 shrink-0 overflow-hidden rounded-2xl bg-kobbo-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg sm:w-48"
              >
                <div className="relative aspect-square bg-kobbo-beige">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      sizes="192px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-kobbo-muted">
                      <ImageOff className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-bold text-kobbo-black">
                    {product.title}
                  </p>
                  <ProductCardRating productId={product.id} />
                  <p className="mt-0.5 text-sm font-semibold text-kobbo-black">
                    {formatPrice(product.price, product.currencyCode)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
