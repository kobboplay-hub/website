/**
 * EDITABLE: Footer links, contact info, and social placeholders.
 */

export const footerBrand = {
  tagline: "More Than Toys.",
  email: "support@kobbo.in",
  phone: "+91 8329195232",
  paymentMethods: ["VISA", "Mastercard", "UPI"] as const,
};

export const footerQuickLinks = [
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
] as const;

export const footerCustomerCare = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Returns & Refunds", href: "/return-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
] as const;

/** Social profile URLs */
export const footerSocialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/kobboplay" },
  { label: "Instagram", href: "https://www.instagram.com/kobboplay" },
  { label: "YouTube", href: "https://youtube.com/@kobboplay" },
] as const;
