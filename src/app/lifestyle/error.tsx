"use client";

import Link from "next/link";

import { LIFESTYLE_BASE_PATH } from "@/lib/storefront/product-routing";

export default function LifestyleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ls-accent">Something went wrong</p>
      <h1 className="mt-4 font-ls-display text-3xl font-bold tracking-[-0.02em] text-ls-ink">This page didn’t load</h1>
      <p className="mt-3 text-sm text-ls-muted">Please try again. Your cart is safe.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-[4px] bg-ls-ink px-6 text-sm font-medium text-ls-paper hover:bg-ls-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
        >
          Try again
        </button>
        <Link
          href={LIFESTYLE_BASE_PATH}
          className="inline-flex h-11 items-center justify-center rounded-[4px] border border-ls-ink/25 px-6 text-sm font-medium text-ls-ink hover:border-ls-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ls-ink"
        >
          Lifestyle home
        </Link>
      </div>
    </div>
  );
}
