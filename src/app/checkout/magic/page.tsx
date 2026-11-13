import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getStorefrontCartPath, parseStorefront } from "@/lib/storefront/product-routing";
import MagicCheckoutClient from "./MagicCheckoutClient";

interface MagicCheckoutPageProps {
  searchParams: Promise<{ cartId?: string; store?: string }>;
}

export async function generateMetadata({ searchParams }: MagicCheckoutPageProps): Promise<Metadata> {
  const { store } = await searchParams;
  return {
    title: parseStorefront(store) === "lifestyle" ? "Secure checkout | Kobbo Lifestyle" : "Secure checkout — Kobbo",
    robots: { index: false },
  };
}

export default async function MagicCheckoutPage({ searchParams }: MagicCheckoutPageProps) {
  const { cartId, store } = await searchParams;
  const storefront = parseStorefront(store);
  if (!cartId) redirect(getStorefrontCartPath(storefront));

  return <MagicCheckoutClient cartId={cartId} storefront={storefront} />;
}
