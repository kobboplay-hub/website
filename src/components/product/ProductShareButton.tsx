"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";

interface ProductShareButtonProps {
  productTitle: string;
  productHandle: string;
  /** Overlay on gallery (Amazon-style) vs inline next to title */
  variant?: "overlay" | "inline";
}

function getProductUrl(handle: string) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/products/${handle}`;
}

export default function ProductShareButton({
  productTitle,
  productHandle,
  variant = "overlay",
}: ProductShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const shareUrl = () => getProductUrl(productHandle);
  const shareText = `Check out ${productTitle} on Kobbo`;

  const copyLink = async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
    }
  };

  const handleShare = async () => {
    const url = shareUrl();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: productTitle,
          text: shareText,
          url,
        });
        return;
      } catch (error) {
        // User cancelled share sheet — don't open fallback menu
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }
    setOpen((prev) => !prev);
  };

  const encodedUrl = encodeURIComponent(shareUrl() || "");
  const encodedText = encodeURIComponent(shareText);

  const triggerClass =
    variant === "overlay"
      ? "flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-kobbo-black shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95"
      : "inline-flex items-center gap-1.5 rounded-full border border-kobbo-beige bg-kobbo-white px-3 py-1.5 text-xs font-semibold text-kobbo-muted transition-colors hover:border-kobbo-yellow hover:text-kobbo-black";

  return (
    <div
      ref={rootRef}
      className={
        variant === "overlay" ? "absolute right-14 top-2 z-20 sm:right-16 sm:top-3" : "relative"
      }
    >
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this product"
        aria-expanded={open}
        className={triggerClass}
      >
        <Share2 className="h-4 w-4" strokeWidth={2.1} />
        {variant === "inline" ? <span>Share</span> : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Share options"
          className={`absolute z-30 w-56 overflow-hidden rounded-2xl border border-kobbo-beige bg-kobbo-white shadow-soft-lg ${
            variant === "overlay"
              ? "right-0 top-12"
              : "right-0 top-full mt-2 sm:left-0 sm:right-auto"
          }`}
        >
          <p className="border-b border-kobbo-beige/80 px-3.5 py-2.5 text-xs font-semibold text-kobbo-muted">
            Share this product
          </p>
          <div className="p-1.5">
            <button
              type="button"
              onClick={copyLink}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-kobbo-black transition-colors hover:bg-kobbo-cream"
            >
              {copied ? (
                <Check className="h-4 w-4 text-kobbo-green" />
              ) : (
                <Copy className="h-4 w-4 text-kobbo-muted" />
              )}
              {copied ? "Link copied!" : "Copy link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-kobbo-black transition-colors hover:bg-kobbo-cream"
              onClick={() => setOpen(false)}
            >
              <Link2 className="h-4 w-4 text-kobbo-muted" />
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-kobbo-black transition-colors hover:bg-kobbo-cream"
              onClick={() => setOpen(false)}
            >
              <Share2 className="h-4 w-4 text-kobbo-muted" />
              Facebook
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
