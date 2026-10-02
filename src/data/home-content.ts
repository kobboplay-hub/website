/**
 * EDITABLE: Homepage marketing copy and placeholder media.
 * Update this file when client provides final content/assets.
 */

export const announcementBar = {
  items: [
    {
      id: "shipping",
      label: "Free Shipping",
      icon: "truck" as const,
    },
    {
      id: "age-focus",
      label: "Made for 2–5 years",
      icon: "sparkles" as const,
      accent: true as const,
    },
    {
      id: "payments",
      label: "Secure Payments",
      icon: "shield" as const,
    },
  ] as const,
};

export const heroContent = {
  headline: "More than toys",
  description:
    "Thoughtfully put-together developmental play kits for 2–3 and 3–5 year olds, with toys selected for their stage of development.",
  primaryCta: { label: "Explore The Kits", href: "#play-kits" },
  trustItems: [
    { id: "age-kits", label: "Age-based kits", icon: "sparkles" as const },
    { id: "learn-play", label: "Learn through play", icon: "leaf" as const },
  ],
  imageBadgeTitle: "Stage-Based",
  imageBadgeSubtitle: "Learning Kits",
  imageDesktop: "/hero-desktop.png",
  imageMobile: "/hero-mobile.png",
  imageAlt: "Children playing with Kobbo developmental toys",
};

export const collectionsSection = {
  title: "Shop by Collection",
  subtitle: "Explore curated collections for every mood and celebration.",
};

export const ganpatiCollection = {
  handle: "ganpati-collection",
  title: "Ganpati Collection",
};


export interface WhyParentsItem {
  title: string;
  description: string;
  image: { src: string; alt: string };
}

export const whyParentsSection: {
  eyebrow: string;
  title: string;
  items: WhyParentsItem[];
} = {
  eyebrow: "Confidence for every parent",
  title: "Why Parents Choose Us",
  items: [
    {
      title: "Thoughtfully Curated",
      description: "Handpicked for every age",
      image: {
        src: "/premium_craftsmanship.avif",
        alt: "Wooden toys arranged on a playroom table",
      },
    },
    {
      title: "Skill-Based Play",
      description: "Learn while having fun",
      image: {
        src: "/designed_for_learning.avif",
        alt: "Children playing together with learning toys",
      },
    },
    {
      title: "Age-Appropriate",
      description: "Chosen with little learners in mind",
      image: {
        src: "/Safety First.avif",
        alt: "Toddler playing with building blocks alongside parents",
      },
    },
    {
      title: "Easy Shopping",
      description: "Thoughtful picks, all in one place",
      image: {
        src: "/our-story.png",
        alt: "A curated collection of children's toys and books",
      },
    },
  ],
};

export const instagramSection = {
  title: "Unboxing & Play Moments",
  subtitle: "Play moments from @kobboplay.",
  profileUrl: "https://www.instagram.com/kobboplay/",
  viewOnInstagramLabel: "View on Instagram",
};
