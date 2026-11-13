"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff, Loader2, Search, X } from "lucide-react";

import { getProductPath } from "@/lib/storefront/product-routing";

interface SearchResult {
  handle: string;
  title: string;
  category: string | null;
  price: string;
  imageUrl: string | null;
}

type SearchState = "idle" | "loading" | "done" | "error";

export default function LifestyleSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [state, setState] = useState<SearchState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setState("loading");
      try {
        const response = await fetch(`/api/lifestyle/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search failed");
        const data = (await response.json()) as { products: SearchResult[] };
        setResults(data.products);
        setState("done");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setState("error");
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  if (!open) return null;

  const hasTerm = query.trim().length >= 2;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search Kobbo Lifestyle">
      <div className="absolute inset-0 bg-ls-ink/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div className="relative mx-auto mt-0 w-full max-w-2xl bg-ls-paper shadow-2xl sm:mt-16 sm:rounded-2xl">
        <div className="flex items-center gap-3 border-b border-ls-line px-4 py-3 sm:px-6">
          <Search className="size-5 shrink-0 text-ls-muted" strokeWidth={1.6} aria-hidden />
          <label htmlFor="lifestyle-search" className="sr-only">
            Search products
          </label>
          <input
            ref={inputRef}
            id="lifestyle-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (event.target.value.trim().length < 2) {
                setResults([]);
                setState("idle");
              }
            }}
            placeholder="Search Lifestyle products"
            autoComplete="off"
            className="h-11 min-w-0 flex-1 bg-transparent text-base text-ls-ink placeholder:text-ls-muted focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex size-10 items-center justify-center rounded-full text-ls-ink hover:bg-ls-sand focus-visible:outline-2 focus-visible:outline-ls-ink"
          >
            <X className="size-5" strokeWidth={1.6} aria-hidden />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-2 py-3 sm:px-4" aria-live="polite">
          {!hasTerm && <p className="px-3 py-6 text-sm text-ls-muted">Type at least two letters to search.</p>}
          {hasTerm && state === "loading" && (
            <p className="flex items-center gap-2 px-3 py-6 text-sm text-ls-muted">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Searching…
            </p>
          )}
          {hasTerm && state === "error" && (
            <p className="px-3 py-6 text-sm text-ls-muted">Search is unavailable right now. Please try again.</p>
          )}
          {hasTerm && state === "done" && results.length === 0 && (
            <p className="px-3 py-6 text-sm text-ls-muted">No products match “{query.trim()}”.</p>
          )}
          {hasTerm && state === "done" && results.length > 0 && (
            <ul className="divide-y divide-ls-line">
              {results.map((product) => (
                <li key={product.handle}>
                  <Link
                    href={getProductPath({ handle: product.handle, isLifestyle: true })}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-ls-sand focus-visible:outline-2 focus-visible:outline-ls-ink"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-ls-sand">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                      ) : (
                        <ImageOff className="absolute inset-0 m-auto size-5 text-ls-muted" aria-hidden />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      {product.category && (
                        <span className="block text-[11px] uppercase tracking-[0.14em] text-ls-muted">{product.category}</span>
                      )}
                      <span className="block truncate font-medium text-ls-ink">{product.title}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ls-ink">{product.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
