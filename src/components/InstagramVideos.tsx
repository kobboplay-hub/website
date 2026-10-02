import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { instagramSection } from "@/data/home-content";
import { instagramVideos } from "@/data/instagramVideos";

export default function InstagramVideos() {
  return (
    <section aria-labelledby="play-moments-heading" className="overflow-hidden bg-kobbo-cream py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="play-moments-heading" className="font-heading text-3xl font-extrabold text-kobbo-black sm:text-4xl">
            {instagramSection.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-kobbo-muted sm:text-base">
            {instagramSection.subtitle}
          </p>
        </div>

        <div className="scrollbar-none -mx-4 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-4 sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:px-0" aria-label="Kobbo Instagram reels">
          {instagramVideos.map((reel) => (
            <article key={reel.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border border-kobbo-beige bg-kobbo-white shadow-soft sm:w-[46%] lg:w-[24%]">
              <div className="aspect-[9/16] w-full overflow-hidden bg-kobbo-beige">
                <iframe
                  src={`${reel.url}embed/`}
                  title={`${reel.title} from @kobboplay`}
                  loading="lazy"
                  allow="fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-full w-full border-0"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="min-w-0 text-sm font-semibold text-kobbo-black">{reel.title}</p>
                <Link href={reel.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${reel.title} on Instagram`} className="shrink-0 text-kobbo-black hover:text-kobbo-muted">
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-3 text-center">
          <Link href={instagramSection.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-kobbo-black/10 bg-kobbo-white px-6 py-2.5 text-sm font-bold text-kobbo-black transition-all hover:border-kobbo-yellow hover:shadow-soft">
            {instagramSection.viewOnInstagramLabel}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
