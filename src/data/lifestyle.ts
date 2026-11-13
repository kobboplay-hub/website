/**
 * Editable copy for the Lifestyle storefront.
 * Every claim must match a live policy or checkout setting:
 * - Free shipping: shippingPolicyContent ("free shipping across India on all orders") and the ₹0 shipping rates.
 * - Cash on Delivery with OTP: Razorpay Magic Checkout COD settings.
 * - Dispatch time: shippingPolicyContent ("dispatched within 5 business days").
 */

export const lifestyleAnnouncements = [
  "Free shipping across India",
  "Cash on Delivery available",
  "Secure payments by Razorpay",
] as const;

export const lifestyleHero = {
  eyebrow: "Kobbo Lifestyle",
  heading: "Everyday Essentials. Thoughtfully Chosen.",
  description: "Discover everyday favourites for your home, your routine and everything in between.",
  primaryCta: "Explore Collection",
  secondaryCta: "Shop Featured",
} as const;

export const lifestyleEditorial = {
  eyebrow: "The Lifestyle Edit",
  heading: "Little Things. Better Everyday Living.",
  description: "Useful, well-made pieces for the moments that fill your day.",
  cta: "Browse the collection",
} as const;

export const lifestyleTrustItems = [
  {
    icon: "shield",
    title: "Secure checkout",
    description: "Payments are processed securely by Razorpay.",
  },
  {
    icon: "truck",
    title: "Free shipping across India",
    description: "Orders are usually dispatched within 5 business days.",
  },
  {
    icon: "wallet",
    title: "Cash on Delivery",
    description: "Prefer to pay at your door? Choose COD at checkout.",
  },
  {
    icon: "package",
    title: "Track your orders",
    description: "Follow every order from your Kobbo account.",
  },
] as const;

export const lifestyleDelivery = {
  shipping: "Free shipping across India",
  dispatch: "Usually dispatched within 5 business days",
} as const;

export const lifestylePolicyLinks = [
  { label: "Shipping Policy", slug: "shipping-policy" },
  { label: "Return Policy", slug: "return-policy" },
  { label: "Cancellation Policy", slug: "cancellation-policy" },
  { label: "Privacy Policy", slug: "privacy-policy" },
  { label: "Terms & Conditions", slug: "terms-and-conditions" },
] as const;

export const lifestyleEmptyStates = {
  cart: {
    title: "Your cart is empty",
    description: "Discover everyday essentials for your home and routine.",
    cta: "Shop Lifestyle",
    ctaHref: "/lifestyle",
  },
  wishlist: {
    title: "Your wishlist is empty",
    description: "Save the products you love and find them here anytime.",
    cta: "Shop Lifestyle",
    ctaHref: "/lifestyle",
  },
  orders: {
    title: "No orders yet",
    description: "When you place your first order, it will appear here with delivery updates.",
    cta: "Start shopping",
    ctaHref: "/lifestyle",
  },
} as const;

export const lifestyleSeo = {
  title: "Kobbo Lifestyle | Everyday Essentials, Thoughtfully Chosen",
  description:
    "Shop Kobbo Lifestyle for everyday essentials for your home and routine, with free shipping across India and secure checkout.",
} as const;
