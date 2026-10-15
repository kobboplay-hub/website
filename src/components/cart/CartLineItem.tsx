"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ImageOff, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/shopify/types";
import type { CartLine } from "@/lib/shopify/cart-types";
import { useCart } from "@/context/cart-context";

interface CartLineItemProps {
  line: CartLine;
  compact?: boolean;
}

export default function CartLineItem({ line, compact }: CartLineItemProps) {
  const { updateQuantity, removeItem, isLineLoading } = useCart();
  const isLoading = isLineLoading(line.id);

  return (
    <div className="flex gap-3 rounded-2xl bg-kobbo-cream p-3">
      <Link
        href={`/products/${line.productHandle}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-kobbo-white"
      >
        {line.imageUrl ? (
          <Image
            src={line.imageUrl}
            alt={line.imageAlt ?? line.productTitle}
            fill
            sizes="80px"
            className="object-contain p-1"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-kobbo-muted">
            <ImageOff className="h-5 w-5" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/products/${line.productHandle}`}
          className="line-clamp-2 font-heading text-sm font-bold text-kobbo-black hover:text-kobbo-muted"
        >
          {line.productTitle}
        </Link>
        {line.variantTitle !== "Default Title" && (
          <p className="mt-0.5 text-xs text-kobbo-muted">{line.variantTitle}</p>
        )}
        <p className="mt-1 text-sm font-bold text-kobbo-black">
          {formatPrice(line.price, line.currencyCode)}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-full border border-kobbo-beige bg-kobbo-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={isLoading}
              onClick={() => updateQuantity(line.id, line.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-l-full transition-colors hover:bg-kobbo-cream disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </button>
            <span className="w-7 text-center text-xs font-bold">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={isLoading}
              onClick={() => updateQuantity(line.id, line.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-r-full transition-colors hover:bg-kobbo-cream disabled:opacity-50"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {!compact && (
            <button
              type="button"
              aria-label="Remove item"
              disabled={isLoading}
              onClick={() => removeItem(line.id)}
              className="flex items-center gap-1 text-xs font-medium text-kobbo-muted transition-colors hover:text-kobbo-black disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
