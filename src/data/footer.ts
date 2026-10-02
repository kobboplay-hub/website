/**
 * Footer links, contact info, and social placeholders.
 */

export const footerBrand = {
  tagline: "More than toys.",
  email: "hello@kobbo.in",
  phone: "+91 8329195232",
  paymentMethods: ["Razorpay", "UPI", "Cards", "NetBanking"] as const,
};

/** Legal entity shown in footer, contact page, and policies */
export const legalEntity = {
  name: "Kobbo",
  ownershipLine: "Kobbo — Developmental Play Kits for curious, growing minds.",
} as const;

export const footerQuickLinks = [
  { label: "Shop by Age", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faqs" },
] as const;

export const footerCustomerCare = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Terms of Service", href: "/terms-and-conditions" },
] as const;

/** Social profile URLs */
export const footerSocialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/kobboplay" },
  { label: "Instagram", href: "https://www.instagram.com/kobboplay" },
  { label: "YouTube", href: "https://youtube.com/@kobboplay" },
] as const;
