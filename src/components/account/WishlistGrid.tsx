"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/shopify/types";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import EmptyState from "@/components/ui/EmptyState";
import { ProductCardSkeleton } from "@/components/ui/SkeletonCard";
import { emptyStates } from "@/data/empty-states";

export default function WishlistGrid() {
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart, isAddingMerchandise } = useCart();

  const handleMoveToCart = async (merchandiseId: string | null) => {
    if (!merchandiseId) return;
    await addToCart(merchandiseId, 1);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyStates.wishlist.title}
        description={emptyStates.wishlist.description}
        cta={emptyStates.wishlist.cta}
        ctaHref={emptyStates.wishlist.ctaHref}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {items.map((item) => {
        const adding = item.merchandiseId
          ? isAddingMerchandise(item.merchandiseId)
          : false;

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl bg-kobbo-white shadow-soft"
          >
            <Link
              href={`/products/${item.handle}`}
              className="relative block aspect-square bg-kobbo-white"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="200px"
                  className="object-contain p-2"
                />
              ) : null}
            </Link>
            <div className="p-3">
              <Link href={`/products/${item.handle}`}>
                <h3 className="font-heading line-clamp-2 text-sm font-bold text-kobbo-black">
                  {item.title}
                </h3>
              </Link>
              <p className="mt-1 text-sm font-bold text-kobbo-black">
                {formatPrice(item.price, item.currencyCode)}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={!item.availableForSale || !item.merchandiseId || adding}
                  onClick={() => handleMoveToCart(item.merchandiseId)}
                  className="flex min-h-10 flex-1 items-center justify-center gap-1 rounded-full bg-kobbo-yellow py-2 text-xs font-bold text-kobbo-black disabled:opacity-50"
                >
                  {adding ? (
                    <span className="text-xs">Adding…</span>
                  ) : (
                    <>
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Move to Cart
                    </>
                  )}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${item.title} from wishlist`}
                  onClick={() => removeFromWishlist(item.handle)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-kobbo-beige text-kobbo-muted transition-colors hover:border-kobbo-yellow hover:text-kobbo-black"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
