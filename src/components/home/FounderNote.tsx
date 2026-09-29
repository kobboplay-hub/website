import { Quote } from "lucide-react";

export default function FounderNote() {
  return (
    <section className="relative overflow-hidden bg-kobbo-white py-12 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Floating card styled in Kobbo cream and beige */}
        <div className="group relative overflow-hidden rounded-3xl border border-kobbo-beige bg-kobbo-cream p-6 shadow-soft-lg transition-all duration-500 hover:shadow-2xl sm:p-12 lg:p-14">
          <div className="flex flex-col items-center text-center">
            {/* Soft decorative quotation icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kobbo-yellow/30 text-kobbo-black sm:h-14 sm:w-14">
              <Quote className="h-6 w-6 rotate-180" />
            </div>

            {/* Heading in Kobbo editorial style */}
            <p className="mt-4 font-heading text-xs font-bold uppercase tracking-[0.2em] text-kobbo-muted">
              Our Philosophy
            </p>
            <h2 className="font-heading mt-1 text-2xl font-extrabold lowercase tracking-tight text-kobbo-black sm:text-3xl lg:text-4xl">
              a note from the founder
            </h2>

            {/* Exact Client Copy */}
            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-kobbo-black/85 sm:mt-8 sm:text-base sm:leading-relaxed">
              <p>
                I&apos;ve always found the toy aisle a little overwhelming.
              </p>
              <p>
                So many choices. So many things labelled educational. And so much time spent wondering what is actually worth bringing home.
              </p>
              <p className="font-semibold text-kobbo-black">
                That got me thinking, what if someone just did the choosing for you?
              </p>
              <p className="font-extrabold text-kobbo-black">
                That&apos;s the idea behind Kobbo.
              </p>
              <p>
                We bring together thoughtful toys and activities for different ages and kinds of play, and put them together in a way that makes choosing a little easier.
              </p>
            </div>

            {/* Signature & Sign-off in Kobbo styling */}
            <div className="mt-8 border-t border-kobbo-beige pt-6 sm:mt-10 sm:pt-8">
              <p className="font-heading text-xl font-extrabold text-kobbo-black sm:text-2xl">
                Kobbo Play
              </p>
              <p className="mt-1 text-xs font-semibold text-kobbo-muted">
                Thoughtfully put-together for growing minds
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
