import Image from "next/image";
import type { PlayKitItem } from "@/lib/shopify/types";
import PlayKitBuyNowButton from "@/components/product/PlayKitBuyNowButton";

interface InsidePlayKitProps {
  items: PlayKitItem[];
}

export default function InsidePlayKit({ items }: InsidePlayKitProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="inside-play-kit-heading" className="bg-kobbo-cream py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="inside-play-kit-heading"
          className="font-heading text-center text-3xl font-extrabold leading-tight text-kobbo-black sm:text-4xl"
        >
          Inside the Play Kit
        </h2>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-kobbo-yellow" aria-hidden />

        <div className="mt-8 grid grid-cols-1 gap-x-7 gap-y-10 sm:mt-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-10">
          {items.map((item) => (
            <article key={item.id} className="min-w-0 text-center">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-kobbo-white">
                {item.image && (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-contain p-3 sm:p-4"
                  />
                )}
              </div>
              <h3 className="mx-auto mt-4 max-w-sm font-heading text-xl font-bold leading-snug text-kobbo-black sm:text-2xl">
                {item.title}
              </h3>
              {item.description && (
                <p className="mx-auto mt-1.5 max-w-sm whitespace-pre-line text-sm leading-relaxed text-kobbo-muted sm:text-base">
                  {item.description}
                </p>
              )}
            </article>
          ))}
        </div>
        <PlayKitBuyNowButton />
      </div>
    </section>
  );
}
