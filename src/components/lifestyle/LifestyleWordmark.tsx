import Link from "next/link";

import { LIFESTYLE_BASE_PATH } from "@/lib/storefront/product-routing";

interface LifestyleWordmarkProps {
  onClick?: () => void;
  tone?: "ink" | "paper";
}

export default function LifestyleWordmark({ onClick, tone = "ink" }: LifestyleWordmarkProps) {
  const onDark = tone === "paper";
  return (
    <Link
      href={LIFESTYLE_BASE_PATH}
      onClick={onClick}
      aria-label="Kobbo Lifestyle home"
      className={`inline-flex items-baseline gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${
        onDark ? "focus-visible:outline-ls-paper" : "focus-visible:outline-ls-ink"
      }`}
    >
      <span
        className={`font-ls-display text-[1.65rem] font-extrabold lowercase leading-none tracking-[-0.04em] sm:text-[1.85rem] ${
          onDark ? "text-ls-paper" : "text-ls-ink"
        }`}
      >
        kobbo
      </span>
      <span
        className={`text-[10px] font-semibold uppercase leading-none tracking-[0.28em] sm:text-[11px] ${
          onDark ? "text-ls-accent-soft" : "text-ls-accent"
        }`}
      >
        Lifestyle
      </span>
    </Link>
  );
}
