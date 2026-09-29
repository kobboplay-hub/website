"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Package,
  Layers,
  Truck,
  ShieldCheck,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

export type PlayKitAge = "year-2" | "year-3-5";

interface KitItem {
  name: string;
  focus: string;
}

interface KitData {
  id: PlayKitAge;
  tabLabel: string;
  ageBadge: string;
  heading: string;
  description: string;
  price: number;
  originalPrice: number;
  skills: string[];
  items: KitItem[];
  kitColor: string;
}

const kitsData: Record<PlayKitAge, KitData> = {
  "year-2": {
    id: "year-2",
    tabLabel: "Year 2",
    ageBadge: "24–36 Months",
    heading: "The Little Explorer Kit",
    description:
      "A hands-on collection for a stage full of first discoveries. Designed around the kinds of play children are ready for at this stage, exploring, creating, figuring things out and beginning to do more for themselves.",
    price: 2999,
    originalPrice: 3999,
    skills: ["Cause & Effect", "Fine Motor Skills", "Sensory Discovery", "Early Language"],
    items: [
      { name: "Wooden Shape & Peg Puzzle", focus: "Spatial reasoning & grip precision" },
      { name: "Sensory Stacking & Nesting Cups", focus: "Size gradation & balance" },
      { name: "Cause-and-Effect Roller Wheel", focus: "Visual tracking & physics curiosity" },
      { name: "Montessori Threading & Lacing Beads", focus: "Two-handed coordination" },
      { name: "Little Explorer Parent Play Guide", focus: "Step-by-step developmental tips" },
    ],
    kitColor: "text-kobbo-yellow",
  },
  "year-3-5": {
    id: "year-3-5",
    tabLabel: "Year 3–5",
    ageBadge: "36–60 Months",
    heading: "The Tinker Kit",
    description:
      "A hands-on collection for a stage full of first discoveries. Designed around the kinds of play children are ready for at this stage, exploring, creating, figuring things out and beginning to do more for themselves.",
    price: 2999,
    originalPrice: 3999,
    skills: ["STEM & Building", "Creative Thinking", "Problem Solving", "Storytelling"],
    items: [
      { name: "Architectural Geo Wooden Blocks", focus: "3D construction & gravity intuition" },
      { name: "Tangram & Pattern Challenge Cards", focus: "Visual logic & pattern completion" },
      { name: "Mechanical Gear Interlock Set", focus: "Simple machines & gear motion" },
      { name: "Imaginative Story Prompt Cubes", focus: "Vocabulary & emotional expression" },
      { name: "The Tinker Parent Play Guide", focus: "Open-ended play experiments" },
    ],
    kitColor: "text-kobbo-yellow",
  },
};

interface PlayKitsSectionProps {
  initialAge?: PlayKitAge;
}

export default function PlayKitsSection({
  initialAge = "year-2",
}: PlayKitsSectionProps) {
  const [selectedAge, setSelectedAge] = useState<PlayKitAge>(initialAge);
  const [isAdding, setIsAdding] = useState(false);
  const { openCart } = useCart();

  const kit = kitsData[selectedAge];
  const discountPercent = Math.round(
    ((kit.originalPrice - kit.price) / kit.originalPrice) * 100,
  );

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 450);
  };

  return (
    <section id="kits" className="relative scroll-mt-20 bg-kobbo-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-kobbo-yellow/50 bg-kobbo-yellow/25 px-3 py-1 text-xs font-bold text-kobbo-black">
            <Sparkles className="h-3.5 w-3.5 text-kobbo-black" />
            Stage-Based Play Kits
          </div>
          <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-tight text-kobbo-black sm:text-4xl lg:text-5xl">
            Choose Your Play Kit
          </h2>
          <p className="mt-2 text-sm text-kobbo-muted sm:text-base">
            Expertly curated sets designed around your child&apos;s exact window of growth.
          </p>

          {/* Age Selection Tab Pills styled in Kobbo theme */}
          <div className="mt-6 inline-flex rounded-full border border-kobbo-beige bg-kobbo-beige/70 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setSelectedAge("year-2")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm ${
                selectedAge === "year-2"
                  ? "bg-kobbo-white text-kobbo-black shadow-soft"
                  : "text-kobbo-muted hover:text-kobbo-black"
              }`}
            >
              <span>Year 2</span>
              <span className="rounded-full bg-kobbo-yellow/30 px-2 py-0.5 text-[10px] font-bold text-kobbo-black">
                24–36 Mo
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAge("year-3-5")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm ${
                selectedAge === "year-3-5"
                  ? "bg-kobbo-white text-kobbo-black shadow-soft"
                  : "text-kobbo-muted hover:text-kobbo-black"
              }`}
            >
              <span>Year 3–5</span>
              <span className="rounded-full bg-kobbo-yellow/30 px-2 py-0.5 text-[10px] font-bold text-kobbo-black">
                36–60 Mo
              </span>
            </button>
          </div>
        </div>

        {/* Kit Showcase Card in Kobbo cream & beige */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-kobbo-beige bg-kobbo-cream p-5 shadow-soft transition-all duration-300 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Visual Box / Dummy Kit Preview */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-kobbo-beige/80 bg-kobbo-white p-6 shadow-soft lg:col-span-5">
              <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 sm:right-4 sm:top-4">
                <span className="rounded-full bg-kobbo-yellow px-3 py-1 font-heading text-xs font-extrabold text-kobbo-black shadow-xs">
                  {discountPercent}% OFF
                </span>
                <span className="rounded-full border border-kobbo-beige bg-kobbo-white/95 px-3 py-1 text-xs font-bold text-kobbo-black shadow-2xs">
                  Age {kit.ageBadge}
                </span>
              </div>

              {/* Decorative toy kit dummy visuals */}
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-kobbo-beige bg-kobbo-cream shadow-soft sm:h-28 sm:w-28">
                  <Package className="h-12 w-12 text-kobbo-black sm:h-14 sm:w-14" strokeWidth={1.75} />
                </div>
                <div className="mt-4">
                  <span className="font-heading text-lg font-bold text-kobbo-black sm:text-xl">
                    {kit.heading}
                  </span>
                  <p className="mt-1 text-xs text-kobbo-muted">
                    Includes 5 Stage-Aligned Play Essentials + Guide
                  </p>
                </div>
              </div>

              {/* Floating feature pills on image */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 sm:bottom-4 sm:left-4 sm:right-4">
                {kit.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full border border-kobbo-beige/70 bg-kobbo-cream/90 px-2.5 py-1 text-[11px] font-semibold text-kobbo-black shadow-2xs"
                  >
                    <CheckCircle2 className="h-3 w-3 text-kobbo-green" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Kit Details & Purchase Area */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-kobbo-yellow/50 bg-kobbo-yellow/25 px-3 py-1 text-xs font-bold text-kobbo-black">
                  Stage {selectedAge === "year-2" ? "Year 2" : "Year 3–5"}
                </span>
                <span className="text-xs font-semibold text-kobbo-muted">
                  Ages {kit.ageBadge}
                </span>
              </div>

              <h3 className="font-heading mt-2 text-2xl font-extrabold text-kobbo-black sm:text-3xl lg:text-4xl">
                {kit.heading}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-kobbo-black/80 sm:text-base">
                {kit.description}
              </p>

              {/* Price Row */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-heading text-3xl font-extrabold text-kobbo-black sm:text-4xl">
                  ₹{kit.price.toLocaleString("en-IN")}
                </span>
                <span className="text-base text-kobbo-muted line-through sm:text-lg">
                  ₹{kit.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="rounded-md bg-kobbo-yellow/30 px-2 py-0.5 text-xs font-bold text-kobbo-black">
                  Save ₹{(kit.originalPrice - kit.price).toLocaleString("en-IN")}
                </span>
              </div>

              {/* What's Inside the Kit */}
              <div className="mt-6 border-t border-kobbo-beige pt-5">
                <h4 className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-kobbo-black">
                  <Layers className="h-4 w-4 text-kobbo-black" />
                  What&apos;s Included In This Kit:
                </h4>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {kit.items.map((item, idx) => (
                    <li
                      key={item.name}
                      className="flex items-start gap-2.5 rounded-xl border border-kobbo-beige bg-kobbo-white p-2.5 text-xs text-kobbo-black shadow-2xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-kobbo-yellow/30 text-[10px] font-bold text-kobbo-black">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-kobbo-black">{item.name}</p>
                        <p className="text-[11px] text-kobbo-muted">{item.focus}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-6 py-3 font-heading text-sm font-extrabold text-kobbo-black shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-kobbo-yellow-light active:scale-[0.99] disabled:opacity-75 sm:text-base"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isAdding ? "Adding to Cart..." : `Add ${kit.heading} to Cart · ₹2,999`}
                </button>

                <a
                  href="/shop"
                  className="flex min-h-12 items-center justify-center gap-1.5 rounded-full border-2 border-kobbo-beige bg-kobbo-white px-5 py-3 font-heading text-xs font-bold text-kobbo-black shadow-soft transition-all hover:border-kobbo-yellow hover:bg-kobbo-cream"
                >
                  Explore All Kits
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Guarantees */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-kobbo-muted">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-kobbo-green" />
                  <span>Free Shipping across India</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-kobbo-green" />
                  <span>100% Non-Toxic & Child-Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
