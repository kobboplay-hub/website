const reasons = [
  {
    title: "Chosen for the stage",
    description:
      "We start with what children aged 2–3 and 3–5 are learning, then pick toys that let them practise it.",
  },
  {
    title: "A skill in every toy",
    description:
      "Counting, balancing, doing, naming feelings. Each toy practises something your child is ready to learn.",
  },
  {
    title: "Everything in one box",
    description:
      "No guessing what to buy next. One kit covers the whole stage, with simple ideas for playing together.",
  },
];

export default function WhyKobboKits() {
  return (
    <section aria-labelledby="why-kobbo-kits-heading" className="bg-kobbo-cream py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="why-kobbo-kits-heading" className="font-heading text-3xl font-extrabold text-kobbo-black sm:text-4xl">
          Why Kobbo Kits
        </h2>
        <div className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {reasons.map((reason) => (
            <div key={reason.title} className="border-t-[3px] border-kobbo-yellow pt-4">
              <h3 className="font-heading text-lg font-bold leading-snug text-kobbo-black sm:text-xl">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-kobbo-muted sm:text-base">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
