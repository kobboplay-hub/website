import type { ReactNode } from "react";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import type {
  PolicyBlock,
  PolicyPageContent,
  PolicySection,
} from "@/data/policies";

interface PolicyPageLayoutProps {
  content: PolicyPageContent;
}

const relatedPolicies = [
  { label: "Shipping", href: "/shipping-policy", titles: ["Shipping Policy"] },
  {
    label: "Returns & Refunds",
    href: "/return-policy",
    titles: [
      "Returns & Refunds",
      "Return Policy",
      "Return & Refund Policy",
      "Return, Refund & Replacement Policy",
    ],
  },
  {
    label: "Cancellation",
    href: "/cancellation-policy",
    titles: ["Cancellation Policy"],
  },
  { label: "Privacy", href: "/privacy-policy", titles: ["Privacy Policy"] },
  {
    label: "Terms",
    href: "/terms-and-conditions",
    titles: ["Terms & Conditions", "Terms of Service"],
  },
] as const;

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getBlocks(section: PolicySection): PolicyBlock[] {
  if (section.blocks?.length) return section.blocks;
  const blocks: PolicyBlock[] = [];
  for (const paragraph of section.paragraphs ?? []) {
    blocks.push({ type: "paragraph", text: paragraph });
  }
  for (const bullet of section.bullets ?? []) {
    blocks.push({ type: "bullet", text: bullet });
  }
  return blocks;
}

function SectionBlocks({ blocks }: { blocks: PolicyBlock[] }) {
  const nodes: ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = (key: string) => {
    if (!bulletBuffer.length) return;
    nodes.push(
      <ul key={key} className="mt-3 space-y-2.5">
        {bulletBuffer.map((text) => (
          <li key={text} className="flex gap-3 text-sm leading-relaxed text-kobbo-muted sm:text-[15px]">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-kobbo-yellow"
              aria-hidden
            />
            <span>{text}</span>
          </li>
        ))}
      </ul>,
    );
    bulletBuffer = [];
  };

  blocks.forEach((block, index) => {
    if (block.type === "bullet") {
      bulletBuffer.push(block.text);
      return;
    }
    flushBullets(`bullets-before-${index}`);
    if (block.type === "subtitle") {
      nodes.push(
        <h3
          key={`sub-${index}-${block.text}`}
          className="font-heading mt-5 text-base font-bold text-kobbo-black first:mt-0"
        >
          {block.text}
        </h3>,
      );
      return;
    }
    nodes.push(
      <p
        key={`p-${index}-${block.text.slice(0, 24)}`}
        className="mt-3 text-sm leading-relaxed text-kobbo-muted first:mt-0 sm:text-[15px] sm:leading-7"
      >
        {block.text}
      </p>,
    );
  });
  flushBullets("bullets-end");

  return <div>{nodes}</div>;
}

export default function PolicyPageLayout({ content }: PolicyPageLayoutProps) {
  const showToc = content.sections.length >= 8;

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="relative overflow-hidden pb-14 pt-8 sm:pb-16 sm:pt-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,_rgba(255,199,0,0.22),_transparent_65%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-kobbo-muted transition-colors hover:text-kobbo-black"
          >
            ← Back to home
          </Link>

          <header className="mt-5 max-w-3xl">
            {content.lastUpdated ? (
              <p className="inline-flex items-center rounded-full border border-kobbo-beige bg-kobbo-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-kobbo-muted">
                Last updated {content.lastUpdated}
              </p>
            ) : null}
            <h1 className="font-heading mt-3 text-3xl font-extrabold tracking-tight text-kobbo-black sm:text-4xl lg:text-[2.75rem]">
              {content.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-kobbo-muted sm:text-base">
              {content.description}
            </p>
            {content.intro ? (
              <p className="mt-5 border-l-[3px] border-kobbo-yellow pl-4 text-sm leading-relaxed text-kobbo-black/80 sm:text-[15px] sm:leading-7">
                {content.intro}
              </p>
            ) : null}
          </header>

          <div
            className={`mt-10 ${showToc ? "lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10" : "mx-auto max-w-3xl"}`}
          >
            {showToc ? (
              <aside className="mb-8 hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-kobbo-beige/80 bg-kobbo-white/70 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-kobbo-muted">
                    On this page
                  </p>
                  <nav className="mt-3 max-h-[70vh] space-y-1 overflow-y-auto pr-1">
                    {content.sections.map((section) => (
                      <a
                        key={section.title}
                        href={`#${sectionId(section.title)}`}
                        className="block rounded-lg px-2 py-1.5 text-xs leading-snug text-kobbo-muted transition-colors hover:bg-kobbo-cream hover:text-kobbo-black"
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            ) : null}

            <div className={`space-y-4 ${showToc ? "max-w-3xl" : ""}`}>
              {content.sections.map((section, index) => (
                <article
                  key={section.title}
                  id={sectionId(section.title)}
                  className="scroll-mt-28 rounded-3xl border border-kobbo-beige/70 bg-kobbo-white p-5 shadow-soft sm:p-7"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-kobbo-yellow/25 font-heading text-sm font-bold text-kobbo-black">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-heading text-lg font-bold text-kobbo-black sm:text-xl">
                        {section.title.replace(/^\d+\.\s*/, "")}
                      </h2>
                      <div className="mt-3">
                        <SectionBlocks blocks={getBlocks(section)} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <div className="rounded-3xl border border-dashed border-kobbo-beige bg-kobbo-white/60 px-5 py-6 sm:px-7">
                <p className="font-heading text-base font-bold text-kobbo-black">
                  Related policies
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {relatedPolicies
                    .filter((item) => !(item.titles as readonly string[]).includes(content.title))
                    .map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex rounded-full border border-kobbo-beige bg-kobbo-cream px-3.5 py-1.5 text-xs font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow hover:bg-kobbo-yellow/20"
                      >
                        {item.label}
                      </Link>
                    ))}
                </div>
                <p className="mt-4 text-sm text-kobbo-muted">
                  Questions? Email{" "}
                  <a
                    href="mailto:support@kobbo.in"
                    className="font-semibold text-kobbo-black underline decoration-kobbo-yellow/70 underline-offset-2 hover:decoration-kobbo-yellow"
                  >
                    support@kobbo.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
