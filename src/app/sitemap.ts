import type { MetadataRoute } from "next";

import { ageGroupHref } from "@/lib/shop-by-age";
import { getAgeGroups, getAllProducts } from "@/lib/shopify";
import { getLifestyleProducts } from "@/lib/shopify/lifestyle";
import { SITE_URL } from "@/lib/storefront/lifestyle-seo";
import { LIFESTYLE_BASE_PATH, getProductPath } from "@/lib/storefront/product-routing";

export const revalidate = 3600;

const STATIC_PATHS = [
  "/",
  "/shop",
  "/about",
  "/contact",
  "/faqs",
  "/shipping-policy",
  "/return-policy",
  "/cancellation-policy",
  "/privacy-policy",
  "/terms-and-conditions",
  LIFESTYLE_BASE_PATH,
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Each source is optional so a Shopify outage never breaks the whole sitemap.
  const [toys, lifestyle, ageGroups] = await Promise.all([
    getAllProducts().catch(() => []),
    getLifestyleProducts().catch(() => []),
    getAgeGroups().catch(() => []),
  ]);

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...ageGroups.map((group) => ({ url: `${SITE_URL}${ageGroupHref(group.handle)}` })),
    ...toys.map((product) => ({ url: `${SITE_URL}${getProductPath(product)}` })),
    ...lifestyle.map((product) => ({ url: `${SITE_URL}${getProductPath(product)}` })),
  ];
}
