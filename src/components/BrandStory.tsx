import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section id="about" className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-kobbo-beige shadow-soft">
          <div className="grid lg:grid-cols-2 lg:items-center">
            <div className="p-6 sm:p-8 lg:p-10">
              <h2 className="font-heading text-2xl font-extrabold leading-tight text-kobbo-black sm:text-3xl">
                More Than Just Toys.
              </h2>
              <p className="font-heading mt-1 text-xl font-extrabold text-kobbo-yellow sm:text-2xl">
                It&apos;s Their Tomorrow.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-kobbo-muted sm:text-base">
                Every toy at Kobbo is selected to spark curiosity, build skills
                and create joyful memories.
              </p>
              <Link
                href="#"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-kobbo-yellow px-6 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light"
              >
                Our Story
              </Link>
            </div>

            <div className="relative aspect-[16/10] min-h-[200px] lg:aspect-auto lg:min-h-[280px]">
              <Image
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=500&fit=crop"
                alt="Child playing with colorful toys"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-kobbo-beige/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
