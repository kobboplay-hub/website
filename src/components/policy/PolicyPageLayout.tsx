import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import type { PolicyPageContent } from "@/data/policies";

interface PolicyPageLayoutProps {
  content: PolicyPageContent;
}

export default function PolicyPageLayout({ content }: PolicyPageLayoutProps) {
  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-kobbo-muted transition-colors hover:text-kobbo-black"
          >
            ← Back to home
          </Link>

          <h1 className="font-heading mt-4 text-3xl font-extrabold text-kobbo-black sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-2 text-sm text-kobbo-muted sm:text-base">
            {content.description}
          </p>

          <div className="mt-8 space-y-6">
            {content.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl bg-kobbo-white p-6 shadow-soft"
              >
                <h2 className="font-heading text-lg font-bold text-kobbo-black">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-2">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-relaxed text-kobbo-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
