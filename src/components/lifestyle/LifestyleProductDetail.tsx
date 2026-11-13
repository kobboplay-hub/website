"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Heart, Link2, Loader2, Minus, Plus, ShieldCheck, Truck, Wallet } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { lifestyleDelivery } from "@/data/lifestyle";
import type { ProductOption, ShopifyImage, ShopifyVariant } from "@/lib/shopify/types";
import { LIFESTYLE_BASE_PATH, getProductPath, withStorefrontParam } from "@/lib/storefront/product-routing";
import LifestyleGallery from "./LifestyleGallery";
import LifestylePrice from "./LifestylePrice";
import LifestyleRatingStars from "./LifestyleRatingStars";

export interface LifestyleDetailProduct {
  id: string;
  handle: string;
  title: string;
  category: string | null;
  vendor: string;
  currencyCode: string;
  availableForSale: boolean;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  options: ProductOption[];
}

interface LifestyleProductDetailProps {
  product: LifestyleDetailProduct;
  rating: { averageRating: number; reviewCount: number };
  summary: string;
}

const MAX_QUANTITY = 10;

type Selection = Record<string, string>;

function selectionOf(variant: ShopifyVariant | undefined): Selection {
  return Object.fromEntries((variant?.selectedOptions ?? []).map((option) => [option.name, option.value]));
}

function matches(variant: ShopifyVariant, selection: Selection): boolean {
  return variant.selectedOptions.every((option) => selection[option.name] === option.value);
}

export default function LifestyleProductDetail({ product, rating, summary }: LifestyleProductDetailProps) {
  const { addToCart, buyNow, isAddingMerchandise, isBuyNowLoading, error } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const initialVariant = product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const [selection, setSelection] = useState<Selection>(() => selectionOf(initialVariant));
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [buyNowFailed, setBuyNowFailed] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Shopify's single "Default Title" option is not a real choice.
  const optionGroups = useMemo(
    () =>
      product.options.filter(
        (option) => !(option.values.length <= 1 && (option.values[0] ?? "Default Title") === "Default Title"),
      ),
    [product.options],
  );

  const variant = product.variants.find((item) => matches(item, selection));
  const available = Boolean(variant?.availableForSale);
  const price = variant ? parseFloat(variant.price.amount) : null;
  const compareAt = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
  const adding = variant ? isAddingMerchandise(variant.id) : false;
  const buying = variant ? isBuyNowLoading(variant.id) : false;
  const wishlisted = isWishlisted(product.handle);

  useEffect(() => {
    const target = ctaRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const choose = (name: string, value: string) => {
    const next = { ...selection, [name]: value };
    if (product.variants.some((item) => matches(item, next))) {
      setSelection(next);
      return;
    }
    // Keep the clicked value and move the other options to the closest existing (preferably in-stock) variant.
    const candidates = product.variants.filter((item) =>
      item.selectedOptions.some((option) => option.name === name && option.value === value),
    );
    const fallback = candidates.find((item) => item.availableForSale) ?? candidates[0];
    if (fallback) setSelection(selectionOf(fallback));
  };

  const valueState = (name: string, value: string) => {
    const next = { ...selection, [name]: value };
    const exact = product.variants.filter((item) => matches(item, next));
    return {
      exists: exact.length > 0,
      inStock: exact.some((item) => item.availableForSale),
    };
  };

  const handleAddToCart = async () => {
    if (!variant || !available) return;
    await addToCart(variant.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!variant || !available) return;
    setBuyNowFailed(false);
    const url = await buyNow(variant.id, quantity);
    if (url) window.location.href = withStorefrontParam(url, "lifestyle");
    else setBuyNowFailed(true);
  };

  const share = async () => {
    const url = `${window.location.origin}${getProductPath({ handle: product.handle, isLifestyle: true })}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sharing was cancelled or clipboard access was denied.
    }
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-7">
          <LifestyleGallery images={product.images} title={product.title} activeImageUrl={variant?.image?.url ?? null} />
        </div>

        <div className="min-w-0 lg:col-span-5 lg:pt-2">
          <div className="lg:sticky lg:top-28">
            {product.category && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ls-accent">{product.category}</p>
            )}
            <h1 className="mt-3 font-ls-display text-[1.85rem] font-bold leading-tight tracking-[-0.02em] text-ls-ink sm:text-[2.25rem]">
              {product.title}
            </h1>

            {rating.reviewCount > 0 && (
              <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-ls-ink-soft underline-offset-4 hover:underline">
                <LifestyleRatingStars rating={rating.averageRating} />
                <span>
                  {rating.averageRating.toFixed(1)} · {rating.reviewCount} {rating.reviewCount === 1 ? "review" : "reviews"}
                </span>
              </a>
            )}

            <div className="mt-6">
              {price !== null ? (
                <LifestylePrice price={price} compareAtPrice={compareAt} currencyCode={product.currencyCode} size="lg" />
              ) : (
                <p className="text-sm text-ls-muted">This combination is not available.</p>
              )}
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm" role="status">
              <span className={`size-2 rounded-full ${available ? "bg-emerald-600" : "bg-ls-muted"}`} aria-hidden />
              <span className={available ? "text-ls-ink" : "text-ls-muted"}>{available ? "In stock" : "Sold out"}</span>
            </p>

            {summary && <p className="mt-6 text-[15px] leading-relaxed text-ls-ink-soft">{summary}</p>}

            {optionGroups.map((option) => {
              const selectedValue = selection[option.name];
              return (
                <fieldset key={option.name} className="mt-7">
                  <legend className="text-sm text-ls-ink">
                    <span className="font-medium">{option.name}</span>
                    {selectedValue && <span className="text-ls-muted">: {selectedValue}</span>}
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const state = valueState(option.name, value);
                      const selected = selectedValue === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => choose(option.name, value)}
                          aria-pressed={selected}
                          aria-label={`${option.name} ${value}${state.inStock ? "" : ", sold out"}`}
                          className={`relative min-h-11 min-w-12 rounded-[4px] border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink ${
                            selected
                              ? "border-ls-ink bg-ls-ink text-ls-paper"
                              : "border-ls-line bg-ls-paper text-ls-ink hover:border-ls-ink"
                          } ${state.exists && state.inStock ? "" : "text-ls-muted line-through decoration-1"}`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}

            <div ref={ctaRef} className="mt-8 space-y-3">
              <div className="flex gap-3">
                <div className="flex h-12 items-center rounded-[4px] border border-ls-line bg-ls-paper" role="group" aria-label="Quantity">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex size-12 items-center justify-center text-ls-ink disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-ls-ink"
                  >
                    <Minus className="size-4" strokeWidth={1.8} aria-hidden />
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.min(MAX_QUANTITY, current + 1))}
                    disabled={quantity >= MAX_QUANTITY}
                    aria-label="Increase quantity"
                    className="flex size-12 items-center justify-center text-ls-ink disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-ls-ink"
                  >
                    <Plus className="size-4" strokeWidth={1.8} aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!available || adding}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[4px] bg-ls-ink px-6 text-sm font-medium text-ls-paper transition-colors hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding && <Loader2 className="size-4 animate-spin" aria-hidden />}
                  {available ? "Add to cart" : "Sold out"}
                </button>
              </div>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!available || buying}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[4px] border border-ls-ink px-6 text-sm font-medium text-ls-ink transition-colors hover:bg-ls-ink hover:text-ls-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buying && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Buy it now
              </button>
              {(buyNowFailed || error) && (
                <p role="alert" className="text-sm text-red-700">
                  {error ?? "Checkout could not open. Please try again."}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center gap-5 text-sm">
              <button
                type="button"
                onClick={() => toggleWishlist(product.handle)}
                aria-pressed={wishlisted}
                className="inline-flex items-center gap-2 text-ls-ink-soft underline-offset-4 hover:text-ls-ink hover:underline focus-visible:outline-2 focus-visible:outline-ls-ink"
              >
                <Heart className={`size-4 ${wishlisted ? "fill-ls-ink text-ls-ink" : ""}`} strokeWidth={1.7} aria-hidden />
                {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
              </button>
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 text-ls-ink-soft underline-offset-4 hover:text-ls-ink hover:underline focus-visible:outline-2 focus-visible:outline-ls-ink"
              >
                {copied ? <Check className="size-4" strokeWidth={1.8} aria-hidden /> : <Link2 className="size-4" strokeWidth={1.7} aria-hidden />}
                {copied ? "Link copied" : "Share"}
              </button>
            </div>

            <ul className="mt-8 space-y-3 border-t border-ls-line pt-6 text-sm text-ls-ink-soft">
              <li className="flex items-start gap-3">
                <Truck className="mt-0.5 size-[18px] shrink-0 text-ls-accent" strokeWidth={1.5} aria-hidden />
                <span>
                  {lifestyleDelivery.shipping}. {lifestyleDelivery.dispatch}.{" "}
                  <Link href={`${LIFESTYLE_BASE_PATH}/shipping-policy`} className="text-ls-ink underline underline-offset-4">
                    Shipping policy
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Wallet className="mt-0.5 size-[18px] shrink-0 text-ls-accent" strokeWidth={1.5} aria-hidden />
                <span>Cash on Delivery available at checkout.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-[18px] shrink-0 text-ls-accent" strokeWidth={1.5} aria-hidden />
                <span>
                  Secure payments by Razorpay.{" "}
                  <Link href={`${LIFESTYLE_BASE_PATH}/return-policy`} className="text-ls-ink underline underline-offset-4">
                    Return policy
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        aria-hidden={!showStickyBar}
        inert={!showStickyBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-ls-line bg-ls-ivory/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ls-ink">{product.title}</p>
            {price !== null && (
              <LifestylePrice price={price} compareAtPrice={compareAt} currencyCode={product.currencyCode} />
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!available || adding}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-[4px] bg-ls-ink px-5 text-sm font-medium text-ls-paper disabled:opacity-50"
          >
            {adding && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {available ? "Add to cart" : "Sold out"}
          </button>
        </div>
      </div>
    </>
  );
}
