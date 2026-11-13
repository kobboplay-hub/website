import SiteLayout from "@/components/SiteLayout";
import LifestyleShell from "@/components/lifestyle/LifestyleShell";
import { getLifestyleNavCategories } from "@/lib/shopify/lifestyle";
import { getRequestStorefront } from "@/lib/storefront/server";

interface PageShellProps {
  children: React.ReactNode;
}

/** Account pages are shared by both storefronts; the visitor keeps the header and footer they shopped with. */
export default async function PageShell({ children }: PageShellProps) {
  if ((await getRequestStorefront()) === "lifestyle") {
    return <LifestyleShell categories={await getLifestyleNavCategories()}>{children}</LifestyleShell>;
  }
  return <SiteLayout mainClassName="bg-kobbo-cream">{children}</SiteLayout>;
}
