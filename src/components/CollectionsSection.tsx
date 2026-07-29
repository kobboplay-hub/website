import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { collectionsSection } from "@/data/home-content";
import type { Collection } from "@/lib/shopify/types";

interface CollectionsSectionProps {
  collections: Collection[];
}

function isGanpatiCollection(collection: Collection): boolean {
  const value = `${collection.handle} ${collection.title}`.toLowerCase();
  return value.includes("ganpati");
}

export default function CollectionsSection({
  collections,
}: CollectionsSectionProps) {
  if (collections.length === 0) return null;

  return (
    <section id="collections" className="py-3 sm:py-5 lg:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-xl font-extrabold text-kobbo-black sm:text-3xl">
            {collectionsSection.title}
          </h2>
          <p className="mx-auto mt-1 max-w-xl px-1 text-xs leading-snug text-kobbo-muted sm:mt-1.5 sm:text-sm">
            {collectionsSection.subtitle}
          </p>
        </div>

        <div
          className={`mt-3 grid gap-2.5 sm:mt-5 sm:gap-4 ${
            collections.length === 1
              ? "grid-cols-1 sm:mx-auto sm:max-w-md"
              : "grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {collections.map((collection) => {
            const festive = isGanpatiCollection(collection);

            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className={`group relative overflow-hidden rounded-xl shadow-soft transition-all duration-300 active:scale-[0.98] sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:shadow-soft-lg ${
                  festive
                    ? "ring-1 ring-[#e07a2f]/40 sm:ring-2 sm:ring-[#e07a2f]/35 sm:ring-offset-2 sm:ring-offset-kobbo-cream"
                    : "bg-kobbo-white"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-kobbo-beige sm:aspect-[5/3]">
                  {collection.image?.url ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText ?? collection.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-kobbo-yellow/40 via-kobbo-beige to-kobbo-cream">
                      <span className="font-heading text-2xl font-extrabold text-kobbo-black/20 sm:text-3xl">
                        {collection.title.slice(0, 1)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`absolute inset-0 ${
                      festive
                        ? "bg-gradient-to-t from-[#7a3b00]/80 via-[#e07a2f]/25 to-transparent"
                        : "bg-gradient-to-t from-kobbo-black/70 via-kobbo-black/20 to-transparent"
                    }`}
                  />

                  {festive && (
                    <>
                      <div className="pointer-events-none absolute inset-0 opacity-50 ganpati-sparkle sm:opacity-60" />
                      <div className="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-[#e07a2f] shadow-soft sm:left-3 sm:top-3 sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]">
                        <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        Festive
                      </div>
                    </>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-5">
                    <h3 className="font-heading text-sm font-extrabold leading-tight text-white drop-shadow sm:text-xl">
                      {collection.title}
                    </h3>
                    {collection.description && (
                      <p className="mt-0.5 hidden line-clamp-2 text-sm text-white/85 sm:mt-1 sm:block">
                        {collection.description}
                      </p>
                    )}
                    <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-kobbo-yellow sm:mt-2.5 sm:gap-1 sm:text-sm">
                      Shop
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
