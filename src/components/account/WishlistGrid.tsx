"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/shopify/types";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

export default function WishlistGrid() {
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart, isAddingMerchandise } = useCart();

  const handleMoveToCart = async (merchandiseId: string | null) => {
    if (!merchandiseId) return;
    await addToCart(merchandiseId, 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-kobbo-white px-6 py-16 text-center shadow-soft">
        <p className="font-heading text-xl font-bold text-kobbo-black">
          Your wishlist is empty
        </p>
        <p className="mt-2 text-sm text-kobbo-muted">
          Save toys you love and come back anytime.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-kobbo-yellow px-6 py-3 text-sm font-bold text-kobbo-black shadow-soft"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
              className="relative block aspect-square bg-kobbo-beige"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="200px"
                  className="object-cover"
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
                  className="flex flex-1 items-center justify-center gap-1 rounded-full bg-kobbo-yellow py-2 text-xs font-bold text-kobbo-black disabled:opacity-50"
                >
                  {adding ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-3.5 w-3.5" />
                  )}
                  Move to Cart
                </button>
                <button
                  type="button"
                  aria-label="Remove from wishlist"
                  onClick={() => removeFromWishlist(item.handle)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-kobbo-beige text-kobbo-muted hover:text-red-600"
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
