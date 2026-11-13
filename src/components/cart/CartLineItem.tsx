"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ImageOff, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/shopify/types";
import type { CartLine } from "@/lib/shopify/cart-types";
import { useCart } from "@/context/cart-context";
import { getProductPath } from "@/lib/storefront/product-routing";
import { useStorefront } from "@/components/storefront/StorefrontContext";

interface CartLineItemProps {
  line: CartLine;
  compact?: boolean;
}

const STYLES = {
  toys: {
    row: "flex gap-3 rounded-2xl bg-kobbo-cream p-3",
    thumb: "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-kobbo-white",
    title: "line-clamp-2 font-heading text-sm font-bold text-kobbo-black hover:text-kobbo-muted",
    muted: "text-kobbo-muted",
    price: "mt-1 text-sm font-bold text-kobbo-black",
    stepper: "flex items-center rounded-full border border-kobbo-beige bg-kobbo-white",
    stepButton: "hover:bg-kobbo-cream",
    stepLeft: "rounded-l-full",
    stepRight: "rounded-r-full",
    quantity: "font-bold",
    remove: "text-kobbo-muted hover:text-kobbo-black",
  },
  lifestyle: {
    row: "flex gap-4 border-b border-ls-line pb-4 last:border-b-0",
    thumb: "relative h-24 w-20 shrink-0 overflow-hidden rounded-[3px] bg-ls-sand",
    title: "line-clamp-2 font-ls-display text-sm font-semibold text-ls-ink hover:underline hover:underline-offset-4",
    muted: "text-ls-muted",
    price: "mt-1 text-sm font-semibold text-ls-ink",
    stepper: "flex items-center rounded-[3px] border border-ls-line bg-ls-paper",
    stepButton: "hover:bg-ls-sand",
    stepLeft: "",
    stepRight: "",
    quantity: "font-medium text-ls-ink",
    remove: "text-ls-muted hover:text-ls-ink",
  },
} as const;

export default function CartLineItem({ line, compact }: CartLineItemProps) {
  const { updateQuantity, removeItem, isLineLoading } = useCart();
  const isLoading = isLineLoading(line.id);
  const lifestyle = useStorefront() === "lifestyle";
  const s = lifestyle ? STYLES.lifestyle : STYLES.toys;

  return (
    <div className={s.row}>
      <Link
        href={getProductPath({ handle: line.productHandle, isLifestyle: line.isLifestyle })}
        className={s.thumb}
      >
        {line.imageUrl ? (
          <Image
            src={line.imageUrl}
            alt={line.imageAlt ?? line.productTitle}
            fill
            sizes="80px"
            className={lifestyle ? "object-cover" : "object-contain p-1"}
          />
        ) : (
          <div className={`flex h-full items-center justify-center ${s.muted}`}>
            <ImageOff className="h-5 w-5" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={getProductPath({ handle: line.productHandle, isLifestyle: line.isLifestyle })}
          className={s.title}
        >
          {line.productTitle}
        </Link>
        {line.variantTitle !== "Default Title" && (
          <p className={`mt-0.5 text-xs ${s.muted}`}>{line.variantTitle}</p>
        )}
        <p className={s.price}>
          {formatPrice(line.price, line.currencyCode)}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className={s.stepper}>
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={isLoading}
              onClick={() => updateQuantity(line.id, line.quantity - 1)}
              className={`flex h-7 w-7 items-center justify-center ${s.stepLeft} transition-colors ${s.stepButton} disabled:opacity-50`}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </button>
            <span className={`w-7 text-center text-xs ${s.quantity}`}>
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={isLoading}
              onClick={() => updateQuantity(line.id, line.quantity + 1)}
              className={`flex h-7 w-7 items-center justify-center ${s.stepRight} transition-colors ${s.stepButton} disabled:opacity-50`}
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
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${s.remove} disabled:opacity-50`}
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
