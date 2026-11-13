import SiteLayout from "@/components/SiteLayout";
import { StorefrontProvider } from "@/components/storefront/StorefrontContext";

interface PageShellProps {
  children: React.ReactNode;
}

/** Toys account chrome. Lifestyle has its own account routes under `/lifestyle/account`. */
export default function PageShell({ children }: PageShellProps) {
  return (
    <StorefrontProvider storefront="toys">
      <SiteLayout mainClassName="bg-kobbo-cream">{children}</SiteLayout>
    </StorefrontProvider>
  );
}
