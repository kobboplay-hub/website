import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import { aboutContent } from "@/data/about";
import { buildMetadata, buildPageTitle } from "@/data/seo";

export const metadata: Metadata = buildMetadata(
  buildPageTitle("Our Story"),
  "At Kobbo, childhood is about building curious minds and lifelong learners. Discover why we're more than toys.",
);

export default function AboutPage() {
  const { eyebrow, headline, paragraphs, purpose, closing } = aboutContent;

  return (
    <SiteLayout mainClassName="bg-kobbo-cream">
      <section className="relative overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(255,199,0,0.28),_transparent_60%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-kobbo-muted transition-colors hover:text-kobbo-black"
          >
            ← Back to home
          </Link>

          <div className="mt-8 grid items-end gap-8 lg:mt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <header className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-kobbo-muted">
                {eyebrow}
              </p>
              <h1 className="font-heading mt-3 text-4xl font-extrabold tracking-tight text-kobbo-black sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                {headline}
              </h1>
            </header>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-soft sm:aspect-[16/11] lg:aspect-auto lg:min-h-[320px]">
              <Image
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1000&h=750&fit=crop"
                alt="Child playing and discovering with toys"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-kobbo-black/25 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </div>

          <article className="mx-auto mt-10 max-w-3xl sm:mt-14">
            <div className="space-y-5 sm:space-y-6">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[15px] leading-relaxed text-kobbo-muted sm:text-base sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <p className="font-heading mt-8 text-2xl font-extrabold leading-snug text-kobbo-black sm:mt-10 sm:text-3xl">
              {purpose}
            </p>

            <div className="mt-8 space-y-2 border-t border-kobbo-beige pt-8 sm:mt-10">
              {closing.map((line, index) => (
                <p
                  key={line}
                  className={
                    index === closing.length - 1
                      ? "font-heading text-xl font-extrabold text-kobbo-black sm:text-2xl"
                      : "text-[15px] leading-relaxed text-kobbo-muted sm:text-base"
                  }
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center">
              <Link
                href="/shop"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-kobbo-yellow px-7 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light"
              >
                Shop Toys
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-kobbo-beige bg-kobbo-white px-7 py-2.5 text-sm font-bold text-kobbo-black transition-colors hover:border-kobbo-yellow"
              >
                Contact Us
              </Link>
            </div>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
