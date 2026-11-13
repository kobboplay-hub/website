import { redirect } from "next/navigation";

import { getStorefrontCartPath, parseStorefront } from "@/lib/storefront/product-routing";
import MagicCheckoutClient from "./MagicCheckoutClient";

export default async function MagicCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ cartId?: string; store?: string }>;
}) {
  const { cartId, store } = await searchParams;
  const storefront = parseStorefront(store);
  if (!cartId) redirect(getStorefrontCartPath(storefront));

  return <MagicCheckoutClient cartId={cartId} storefront={storefront} />;
}
