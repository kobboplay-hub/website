"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ImageOff,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";

interface SearchResult {
  handle: string;
  title: string;
  price: string;
  imageUrl: string | null;
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const quickSuggestions = ["Puzzle", "Blocks", "Creative", "Learning"];

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      requestAnimationFrame(() => {
        setVisible(true);
        inputRef.current?.focus();
      });
    } else {
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(trimmed)}`,
      );
      const data = (await response.json()) as { products: SearchResult[] };
      setResults(data.products ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      void runSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, open, runSearch]);

  const handleViewAll = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSuggestion = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  if (!open) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Search">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        className={`absolute inset-0 bg-kobbo-black/60 backdrop-blur-md transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Top panel — aligned with site header */}
      <div
        className={`relative z-10 w-full border-b border-kobbo-beige/80 bg-kobbo-white/98 shadow-soft-lg backdrop-blur-xl transition-all duration-300 ease-out ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {/* Header row */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-lg font-extrabold text-kobbo-black sm:text-xl">
                Search Toys
              </p>
              <p className="mt-0.5 text-xs text-kobbo-muted sm:text-sm">
                Find educational toys, kits and games
              </p>
            </div>
            <button
              type="button"
              aria-label="Close search"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-cream text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-yellow/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-kobbo-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search toys..."
              className="w-full rounded-full border-2 border-kobbo-beige bg-kobbo-cream py-3.5 pl-12 pr-4 text-sm text-kobbo-black outline-none transition-all placeholder:text-kobbo-muted focus:border-kobbo-yellow focus:bg-kobbo-white focus:shadow-soft sm:text-base"
            />
          </div>

          {/* Results area */}
          <div className="mt-4 min-h-[120px]">
            {loading && (
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-kobbo-cream/60 py-10 text-sm text-kobbo-muted">
                <Loader2 className="h-4 w-4 animate-spin text-kobbo-yellow" />
                Searching...
              </div>
            )}

            {!loading && !hasQuery && (
              <div className="rounded-2xl bg-kobbo-cream/50 px-4 py-5">
                <div className="flex items-center gap-2 text-kobbo-muted">
                  <Sparkles className="h-4 w-4 text-kobbo-yellow" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Popular searches
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickSuggestions.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSuggestion(term)}
                      className="rounded-full border border-kobbo-beige bg-kobbo-white px-3.5 py-1.5 text-xs font-semibold text-kobbo-black transition-all hover:border-kobbo-yellow hover:bg-kobbo-yellow/15 sm:text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!loading && hasQuery && results.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-kobbo-cream/50 py-10 text-center">
                <ImageOff className="h-8 w-8 text-kobbo-muted" />
                <p className="mt-3 font-heading text-base font-bold text-kobbo-black">
                  No toys found
                </p>
                <p className="mt-1 text-sm text-kobbo-muted">
                  Try a different keyword or browse the shop
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="mt-4 rounded-full bg-kobbo-yellow px-5 py-2 text-xs font-bold text-kobbo-black transition-colors hover:bg-kobbo-yellow-light sm:text-sm"
                >
                  Browse Shop
                </Link>
              </div>
            )}

            {!loading && results.length > 0 && (
              <ul className="space-y-1.5">
                {results.map((product) => (
                  <li key={product.handle}>
                    <Link
                      href={`/products/${product.handle}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 rounded-2xl border border-transparent bg-kobbo-cream/40 px-3 py-2.5 transition-all hover:border-kobbo-yellow/40 hover:bg-kobbo-white hover:shadow-soft"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-kobbo-white ring-1 ring-kobbo-beige">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageOff className="h-4 w-4 text-kobbo-muted" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-kobbo-black sm:text-base">
                          {product.title}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-kobbo-muted sm:text-sm">
                          {product.price}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-kobbo-muted transition-transform group-hover:translate-x-0.5 group-hover:text-kobbo-black" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div
            className={`mt-4 flex flex-col-reverse items-center justify-between gap-3 ${
              hasQuery
                ? "border-t border-kobbo-beige/80 pt-4"
                : "hidden sm:flex sm:border-t sm:border-kobbo-beige/80 sm:pt-4"
            } sm:flex-row`}
          >
            <p className="hidden text-[11px] text-kobbo-muted sm:block sm:text-xs">
              Press <kbd className="rounded bg-kobbo-cream px-1.5 py-0.5 font-mono text-[10px] text-kobbo-black">Esc</kbd> to close
            </p>
            {hasQuery && !loading && (
              <button
                type="button"
                onClick={handleViewAll}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-6 py-2.5 text-sm font-bold text-kobbo-black transition-all hover:bg-kobbo-yellow-light hover:shadow-soft sm:w-auto"
              >
                View all results
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
