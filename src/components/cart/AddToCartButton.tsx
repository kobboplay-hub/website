"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface AddToCartButtonProps {
  merchandiseId: string | null;
  quantity?: number;
  productTitle: string;
  disabled?: boolean;
  className?: string;
  variant?: "icon" | "full";
  label?: string;
  openDrawer?: boolean;
}

export default function AddToCartButton({
  merchandiseId,
  quantity = 1,
  productTitle,
  disabled,
  className = "",
  variant = "icon",
  label = "Add to Cart",
  openDrawer = true,
}: AddToCartButtonProps) {
  const { addToCart, isAddingMerchandise } = useCart();
  const isLoading = merchandiseId ? isAddingMerchandise(merchandiseId) : false;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!merchandiseId || disabled || isLoading) return;
    await addToCart(merchandiseId, quantity, { openDrawer });
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        aria-label={`Add ${productTitle} to cart`}
        disabled={disabled || !merchandiseId || isLoading}
        onClick={handleClick}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kobbo-yellow text-kobbo-black shadow-soft transition-all hover:scale-110 hover:bg-kobbo-yellow-light disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10 ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled || !merchandiseId || isLoading}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light hover:shadow-soft-lg disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}
