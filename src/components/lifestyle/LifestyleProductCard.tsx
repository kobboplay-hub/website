"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff, Loader2, Plus } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { getDiscountPercent, type LifestyleCardProduct } from "@/lib/storefront/lifestyle-card";
import { getProductPath } from "@/lib/storefront/product-routing";
import LifestylePrice from "./LifestylePrice";

interface LifestyleProductCardProps {
  product: LifestyleCardProduct;
  priority?: boolean;
  sizes?: string;
}

export default function LifestyleProductCard({
  product,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: LifestyleProductCardProps) {
  const { addToCart, isAddingMerchandise } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const href = getProductPath({ handle: product.handle, isLifestyle: true });
  const [primary, secondary] = product.images;
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const wishlisted = isWishlisted(product.handle);
  const adding = product.quickAddVariantId ? isAddingMerchandise(product.quickAddVariantId) : false;
  const canQuickAdd = product.availableForSale && Boolean(product.quickAddVariantId);

  const quickAdd = async () => {
    if (!product.quickAddVariantId || adding) return;
    await addToCart(product.quickAddVariantId, 1);
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-ls-sand">
        <Link href={href} aria-label={product.title} className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink">
          {primary ? (
            <>
              <Image
                src={primary.url}
                alt={primary.altText || product.title}
                fill
                sizes={sizes}
                priority={priority}
                className={`object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.03] motion-reduce:group-hover:scale-100 ${
                  secondary ? "group-hover:opacity-0" : ""
                }`}
              />
              {secondary && (
                <Image
                  src={secondary.url}
                  alt=""
                  fill
                  sizes={sizes}
                  className="object-cover opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-ls-muted">
              <ImageOff className="size-6" strokeWidth={1.5} aria-hidden />
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {!product.availableForSale ? (
            <span className="rounded-sm bg-ls-paper/95 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ls-ink">
              Sold out
            </span>
          ) : discount ? (
            <span className="rounded-sm bg-ls-accent px-2 py-1 text-[11px] font-medium tracking-[0.04em] text-ls-paper">
              −{discount}%
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.handle)}
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-2.5 top-2.5 flex size-9 items-center justify-center rounded-full bg-ls-paper/90 text-ls-ink backdrop-blur-sm transition-opacity hover:bg-ls-paper focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ls-ink lg:opacity-0 lg:group-hover:opacity-100 lg:aria-pressed:opacity-100"
        >
          <Heart className={`size-4 ${wishlisted ? "fill-ls-ink" : ""}`} strokeWidth={1.7} aria-hidden />
        </button>

        <div className="absolute inset-x-2.5 bottom-2.5 hidden translate-y-2 opacity-0 transition-all duration-300 motion-reduce:transition-none group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:block">
          {canQuickAdd ? (
            <button
              type="button"
              onClick={quickAdd}
              disabled={adding}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-ls-ink text-sm font-medium text-ls-paper transition-colors hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink disabled:opacity-70"
            >
              {adding && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Quick add
            </button>
          ) : product.availableForSale ? (
            <Link
              href={href}
              className="flex h-10 w-full items-center justify-center rounded-[4px] bg-ls-paper text-sm font-medium text-ls-ink transition-colors hover:bg-ls-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
            >
              Choose options
            </Link>
          ) : null}
        </div>

        {canQuickAdd && (
          <button
            type="button"
            onClick={quickAdd}
            disabled={adding}
            aria-label={`Add ${product.title} to cart`}
            className="absolute bottom-2.5 right-2.5 flex size-9 items-center justify-center rounded-full bg-ls-ink text-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink disabled:opacity-70 lg:hidden"
          >
            {adding ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" strokeWidth={2} aria-hidden />}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        {product.category && (
          <p className="text-[11px] uppercase tracking-[0.14em] text-ls-muted">{product.category}</p>
        )}
        <h3 className="text-[15px] font-medium leading-snug text-ls-ink">
          <Link href={href} className="line-clamp-2 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-ls-ink">
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto pt-1">
          <LifestylePrice price={product.price} compareAtPrice={product.compareAtPrice} currencyCode={product.currencyCode} />
        </div>
      </div>
    </article>
  );
}
