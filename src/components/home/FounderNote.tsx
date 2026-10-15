import Image from "next/image";

const paragraphs = [
  "I've always found the toy aisle a little overwhelming.",
  "So many choices. So many things labelled educational. And so much time spent wondering what is actually worth bringing home.",
  "That got me thinking, what if someone just did the choosing for you?",
  "That's the idea behind Kobbo.",
  "We bring together thoughtful toys and activities for different ages and kinds of play, and put them together in a way that makes choosing a little easier.",
];

export default function FounderNote() {
  return (
    <section
      aria-labelledby="founder-heading"
      className="relative isolate flex min-h-[660px] items-center justify-center bg-kobbo-cream px-4 py-12 [clip-path:inset(0)] sm:min-h-[700px] sm:px-6"
    >
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <Image
          src="/founder-ruchi.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-kobbo-black/15" />
      </div>
      <div className="relative z-10 w-full max-w-[540px] bg-kobbo-white px-6 py-7 text-center shadow-[0_20px_70px_rgba(31,31,31,0.18)] sm:px-10 sm:py-8">
        <h2 id="founder-heading" className="font-heading text-2xl font-extrabold tracking-tight text-kobbo-black sm:text-3xl">
          A Note From Founder
        </h2>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-kobbo-yellow" aria-hidden="true" />
        <div className="mt-5 space-y-3 text-[13px] leading-5 text-kobbo-black/85 sm:text-sm sm:leading-6">
          {paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={index === 3 ? "font-bold text-kobbo-black" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
        <p className="mt-5 font-heading text-xl font-bold italic text-kobbo-black sm:text-2xl">
          — Love, Ruchi
        </p>
      </div>
    </section>
  );
}
