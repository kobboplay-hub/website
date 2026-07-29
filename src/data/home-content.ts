/**
 * EDITABLE: Homepage marketing copy and placeholder media.
 * Update this file when client provides final content/assets.
 */

export const announcementBar = {
  items: [
    {
      id: "offer",
      label: "₹50 Off on Online Payments",
      icon: "sparkles" as const,
    },
    {
      id: "ganpati",
      label: "New: Ganpati Collection",
      icon: "ganpati" as const,
      accent: true as const,
      href: "/collections/ganpati-collection",
    },
    {
      id: "payments",
      label: "Secure Payments",
      icon: "shield" as const,
    },
  ] as const,
};

export const heroContent = {
  ratingValue: "4.8",
  ratingLabel: "Rated by 675+ Happy Families",
  headline: "More than toys",
  description:
    "Educational toys, STEM kits & creative play for growing minds",
  primaryCta: { label: "Shop Now", href: "/shop" },
  trustItems: [
    { id: "safe", label: "Safe Materials", icon: "shield" as const },
    { id: "designed", label: "Thoughtfully Designed", icon: "leaf" as const },
  ],
  imageBadgeTitle: "Screen-Free",
  imageBadgeSubtitle: "Learning Toys",
  imageDesktop: "/hero-desktop.png",
  imageMobile: "/hero-mobile.png",
  imageAlt: "Child playing with colorful educational toys",
};

export const collectionsSection = {
  title: "Shop by Collection",
  subtitle: "Explore curated collections for every mood and celebration.",
};

export const ganpatiCollection = {
  handle: "ganpati-collection",
  title: "Ganpati Collection",
};

export const newsletterSection = {
  title: "Let's Keep the Fun Going!",
  subtitle: "Join our newsletter for offers, new toys and parenting tips.",
  placeholder: "Enter your email",
  buttonLabel: "Subscribe",
  successFallback: "Thank you for subscribing!",
};

export const instagramSection = {
  title: "Unboxing & Play Moments",
  subtitle:
    "Watch real unboxing moments and playful demos from our products.",
  profileUrl:
    "https://www.instagram.com/kobboplay?igsh=MXE3bDZ3NWxzbzk0bg%3D%3D&utm_source=qr",
  viewOnInstagramLabel: "View on Instagram",
};
