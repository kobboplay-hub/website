import { Sparkles, Puzzle, Heart, Smile } from "lucide-react";

const badges = [
  { icon: Sparkles, title: "Curated Toys" },
  { icon: Puzzle, title: "Skill Building" },
  { icon: Heart, title: "Parent Loved" },
  { icon: Smile, title: "Joyful Play" },
];

export default function TrustBadges() {
  return (
    <section className="bg-gradient-to-b from-kobbo-cream via-kobbo-yellow/10 to-kobbo-cream py-3 sm:py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-2 rounded-xl bg-kobbo-yellow/15 px-3 py-2 sm:justify-center sm:px-3.5 sm:py-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-kobbo-white/60 sm:h-8 sm:w-8">
                <badge.icon className="h-3.5 w-3.5 text-kobbo-yellow sm:h-4 sm:w-4" />
              </div>
              <span className="font-heading text-xs font-bold text-kobbo-black sm:text-sm">
                {badge.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
