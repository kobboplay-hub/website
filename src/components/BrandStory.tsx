import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section id="about" className="py-4 sm:py-5 lg:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-kobbo-beige shadow-soft sm:rounded-3xl">
          <div className="grid lg:grid-cols-2 lg:items-stretch">
            {/* Image first on mobile for stronger visual */}
            <div className="relative order-1 aspect-[16/10] min-h-[180px] sm:min-h-[220px] lg:order-2 lg:aspect-auto lg:min-h-[300px]">
              <Image
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=500&fit=crop"
                alt="Child playing with colorful toys"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kobbo-beige/40 to-transparent lg:bg-gradient-to-r lg:from-kobbo-beige/50 lg:to-transparent" />
            </div>

            <div className="order-2 flex flex-col justify-center px-5 py-5 text-center sm:px-8 sm:py-6 sm:text-left lg:order-1 lg:px-10 lg:py-8">
              <h2 className="font-heading text-[1.65rem] font-extrabold leading-tight text-kobbo-black sm:text-3xl lg:text-4xl">
                More Than Just Toys.
              </h2>
              <p className="font-heading mt-1 text-xl font-extrabold leading-snug text-kobbo-yellow sm:mt-1.5 sm:text-2xl lg:text-3xl">
                It&apos;s Their Tomorrow.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-kobbo-muted sm:mx-0 sm:mt-4 sm:text-base">
                Every toy at Kobbo is selected to spark curiosity, build skills
                and create joyful memories.
              </p>
              <div className="mt-5 sm:mt-6">
                <Link
                  href="/#about"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kobbo-yellow px-6 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light sm:w-auto"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
