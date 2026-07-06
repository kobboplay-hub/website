import Image from "next/image";
import Link from "next/link";
import { Play, ExternalLink } from "lucide-react";
import { instagramSection } from "@/data/home-content";
import { instagramVideos } from "@/data/instagramVideos";

export default function InstagramVideos() {
  return (
    <section className="bg-kobbo-cream py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-xl font-extrabold text-kobbo-black sm:text-2xl">
            {instagramSection.title}
          </h2>
          <p className="mx-auto mt-1.5 max-w-lg text-sm text-kobbo-muted">
            {instagramSection.subtitle}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {instagramVideos.map((video) => (
            <a
              key={video.id}
              href={video.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${video.title} on Instagram`}
              className="group relative overflow-hidden rounded-2xl bg-kobbo-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-kobbo-black/20 transition-colors group-hover:bg-kobbo-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kobbo-white/95 shadow-soft transition-transform group-hover:scale-110 sm:h-11 sm:w-11">
                    <Play className="h-4 w-4 fill-kobbo-black text-kobbo-black sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>
              <div className="p-2.5 sm:p-3">
                <p className="truncate text-xs font-semibold text-kobbo-black sm:text-sm">
                  {video.title}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-5 text-center">
          <Link
            href={instagramSection.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-kobbo-black/10 bg-kobbo-white px-6 py-2.5 text-sm font-bold text-kobbo-black transition-all hover:border-kobbo-yellow hover:shadow-soft"
          >
            {instagramSection.viewOnInstagramLabel}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
