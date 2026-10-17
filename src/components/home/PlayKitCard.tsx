"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/shopify/types";

interface PlayKitCardProps {
  product: Product;
  ageName?: string;
  index: number;
  count: number;
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PlayKitCard({ product, ageName, index, count }: PlayKitCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isOpeningKit, setIsOpeningKit] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const merchandiseId = product.variants.find((variant) => variant.availableForSale)?.id ?? null;
  const images = product.featuredImage
    ? [product.featuredImage, ...product.images.filter((image) => image.url !== product.featuredImage?.url)]
    : product.images;
  const activeImage = images[activeImageIndex] ?? images[0];

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    const thumbnail = strip?.children.item(activeImageIndex) as HTMLElement | null;
    if (!strip || !thumbnail) return;

    strip.scrollTo({
      left: thumbnail.offsetLeft + thumbnail.offsetWidth / 2 - strip.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [activeImageIndex]);

  useEffect(() => {
    if (!isOpeningKit) return;
    const timeout = window.setTimeout(() => setIsOpeningKit(false), 15000);
    return () => window.clearTimeout(timeout);
  }, [isOpeningKit]);

  function showAdjacentImage(direction: number) {
    setActiveImageIndex((current) => (current + direction + images.length) % images.length);
  }

  function handleImageTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null || images.length < 2) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) > 40) showAdjacentImage(distance < 0 ? 1 : -1);
  }

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}`}
      className="grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-kobbo-beige bg-kobbo-cream shadow-soft sm:grid-cols-2"
    >
      <div className="min-w-0 bg-kobbo-beige p-3 sm:p-4">
        <div
          className="relative aspect-square w-full touch-pan-y overflow-hidden rounded-2xl bg-kobbo-white"
          onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
          onTouchEnd={handleImageTouchEnd}
          onTouchCancel={() => { touchStartX.current = null; }}
        >
          {activeImage ? (
            <Image
              src={activeImage.url}
              alt={activeImage.altText || `${product.title} image ${activeImageIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 35vw"
              className="object-contain p-3 sm:p-4"
              draggable={false}
            />
          ) : (
            <span className="flex h-full items-center justify-center p-6 text-center font-heading text-2xl font-bold text-kobbo-black">
              {product.title}
            </span>
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => showAdjacentImage(-1)}
                aria-label={`Previous image of ${product.title}`}
                className="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-kobbo-black shadow-soft transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => showAdjacentImage(1)}
                aria-label={`Next image of ${product.title}`}
                className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-kobbo-black shadow-soft transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div ref={thumbnailStripRef} className="scrollbar-none relative mt-3 flex gap-2 overflow-x-hidden" role="group" aria-label={`${product.title} images`}>
            {images.map((image, imageIndex) => (
              <button
                key={`${image.url}-${imageIndex}`}
                type="button"
                onClick={() => setActiveImageIndex(imageIndex)}
                aria-label={`Show image ${imageIndex + 1} of ${images.length} for ${product.title}`}
                aria-pressed={activeImageIndex === imageIndex}
                className={`relative size-12 shrink-0 overflow-hidden rounded-xl border-2 bg-kobbo-white transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kobbo-black sm:size-13 ${activeImageIndex === imageIndex ? "border-kobbo-yellow shadow-soft" : "border-transparent opacity-80 hover:opacity-100"}`}
              >
                <Image src={image.url} alt="" fill sizes="64px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-kobbo-muted">{ageName}</p>
        <h3 className="font-heading mt-2 text-2xl font-extrabold text-kobbo-black sm:text-3xl">{product.title}</h3>
        {product.description && <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-kobbo-black/80">{product.description}</p>}
        <div className="mt-5 flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-2xl font-extrabold text-kobbo-black">{formatPrice(product.price, product.currencyCode)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-kobbo-muted line-through">{formatPrice(product.compareAtPrice, product.currencyCode)}</span>
          )}
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <AddToCartButton
            merchandiseId={merchandiseId}
            productTitle={product.title}
            disabled={!product.availableForSale}
            variant="full"
            label={product.availableForSale ? "Add to Cart" : "Sold Out"}
            className="min-h-11 px-5"
          />
          <Link
            href={`/products/${product.handle}`}
            onClick={(event) => {
              if (isOpeningKit) event.preventDefault();
              else setIsOpeningKit(true);
            }}
            aria-busy={isOpeningKit}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-kobbo-beige bg-kobbo-white px-5 text-sm font-bold text-kobbo-black transition-colors hover:border-kobbo-yellow"
          >
            {isOpeningKit ? "Opening kit…" : "View Kit"}
            {isOpeningKit ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
          </Link>
        </div>
      </div>
    </article>
  );
}
