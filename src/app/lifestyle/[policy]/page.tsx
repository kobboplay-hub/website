import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBlocks, sectionId } from "@/components/policy/PolicyPageLayout";
import { lifestylePolicyLinks } from "@/data/lifestyle";
import {
  cancellationPolicyContent,
  privacyPolicyContent,
  returnPolicyContent,
  shippingPolicyContent,
  termsPolicyContent,
  type PolicyPageContent,
} from "@/data/policies";
import { lifestyleMetadata } from "@/lib/storefront/lifestyle-seo";

// Store-wide policies shown in the Lifestyle storefront; the original URLs stay canonical.
const policies: Record<string, PolicyPageContent> = {
  "shipping-policy": shippingPolicyContent,
  "return-policy": returnPolicyContent,
  "cancellation-policy": cancellationPolicyContent,
  "privacy-policy": privacyPolicyContent,
  "terms-and-conditions": termsPolicyContent,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(policies).map((policy) => ({ policy }));
}

interface LifestylePolicyPageProps {
  params: Promise<{ policy: string }>;
}

export async function generateMetadata({ params }: LifestylePolicyPageProps): Promise<Metadata> {
  const { policy } = await params;
  const content = policies[policy];
  if (!content) return {};
  return lifestyleMetadata({
    title: `${content.title} | Kobbo Lifestyle`,
    description: content.description,
    path: `/${policy}`,
  });
}

export default async function LifestylePolicyPage({ params }: LifestylePolicyPageProps) {
  const { policy } = await params;
  const content = policies[policy];
  if (!content) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="border-b border-ls-line pb-10">
        {content.lastUpdated && <p className="text-xs uppercase tracking-[0.18em] text-ls-muted">Last updated {content.lastUpdated}</p>}
        <h1 className="mt-4 font-ls-display text-4xl font-bold tracking-[-0.025em] text-ls-ink">{content.title}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ls-ink-soft">{content.description}</p>
        {content.intro && <p className="mt-4 text-[15px] leading-relaxed text-ls-ink-soft">{content.intro}</p>}
      </header>

      <div className="divide-y divide-ls-line">
        {content.sections.map((section) => (
          <section key={section.title} id={sectionId(section.title)} className="scroll-mt-28 py-8">
            <h2 className="font-ls-display text-lg font-semibold text-ls-ink">{section.title.replace(/^\d+\.\s*/, "")}</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-7 text-ls-ink-soft">
              {getBlocks(section).map((block, index) =>
                block.type === "subtitle" ? (
                  <h3 key={index} className="pt-2 font-ls-display text-base font-semibold text-ls-ink">
                    {block.text}
                  </h3>
                ) : block.type === "bullet" ? (
                  <p key={index} className="flex gap-3">
                    <span className="mt-[0.7rem] size-1 shrink-0 rounded-full bg-ls-accent" aria-hidden />
                    <span>{block.text}</span>
                  </p>
                ) : (
                  <p key={index}>{block.text}</p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <nav aria-label="Other policies" className="mt-6 border-t border-ls-line pt-8">
        <p className="text-sm font-medium text-ls-ink">Other policies</p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {lifestylePolicyLinks
            .filter((link) => link.slug !== policy)
            .map((link) => (
              <li key={link.slug}>
                <Link href={`/lifestyle/${link.slug}`} className="text-ls-ink-soft underline-offset-4 hover:text-ls-ink hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </article>
  );
}
