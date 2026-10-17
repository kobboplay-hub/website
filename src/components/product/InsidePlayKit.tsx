import Image from "next/image";
import type { PlayKitItem } from "@/lib/shopify/types";
import PlayKitBuyNowButton from "@/components/product/PlayKitBuyNowButton";

interface InsidePlayKitProps {
  items: PlayKitItem[];
}

export default function InsidePlayKit({ items }: InsidePlayKitProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="inside-play-kit-heading"
      className="border-y border-kobbo-yellow/35 bg-kobbo-beige/75 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2
          id="inside-play-kit-heading"
          className="font-heading text-center text-3xl font-extrabold leading-tight text-kobbo-black sm:text-4xl"
        >
          Inside the Play Kit
        </h2>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-kobbo-yellow" aria-hidden />

        <div className="mx-auto mt-9 flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-12 sm:mt-12 lg:gap-x-12 lg:gap-y-14">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex w-full max-w-[20rem] min-w-0 flex-col items-center text-center sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-kobbo-cream/75">
                {item.image && (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    sizes="(max-width: 639px) 85vw, (max-width: 1023px) 42vw, 28vw"
                    className="object-contain p-3"
                  />
                )}
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold leading-snug text-kobbo-black">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1.5 max-w-[19rem] whitespace-pre-line text-sm leading-relaxed text-kobbo-muted sm:text-[0.9375rem]">
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
