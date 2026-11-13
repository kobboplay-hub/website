import type { Metadata } from "next";
import type { ReactNode } from "react";

import LifestyleShell from "@/components/lifestyle/LifestyleShell";
import { getLifestyleNavCategories } from "@/lib/shopify/lifestyle";
import { lifestyleHomeMetadata } from "@/lib/storefront/lifestyle-seo";

export const metadata: Metadata = lifestyleHomeMetadata;

export default async function LifestyleLayout({ children }: { children: ReactNode }) {
  const categories = await getLifestyleNavCategories();
  return <LifestyleShell categories={categories}>{children}</LifestyleShell>;
}
