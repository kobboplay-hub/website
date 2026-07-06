import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import EmptyState from "@/components/ui/EmptyState";
import { errorStates } from "@/data/empty-states";
import { buildPageTitle } from "@/data/seo";

export const metadata = {
  title: buildPageTitle("Page Not Found"),
};

export default function NotFound() {
  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-lg">
          <EmptyState
            title={errorStates.productNotFound.title}
            description={errorStates.productNotFound.description}
            cta={errorStates.productNotFound.cta}
            ctaHref={errorStates.productNotFound.ctaHref}
            emoji="🔍"
          />
          <p className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-kobbo-black hover:underline"
            >
              Back to home
            </Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
