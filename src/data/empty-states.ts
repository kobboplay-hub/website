/**
 * EDITABLE: Warm empty-state copy used across the storefront.
 */

export const emptyStates = {
  cart: {
    title: "Your cart is waiting",
    description:
      "Looks like you haven't added any toys yet. Explore our collection and find something playful!",
    cta: "Continue Shopping",
    ctaHref: "/shop",
    emoji: "🧸",
  },
  wishlist: {
    title: "Your wishlist is empty",
    description:
      "Save toys you love and come back anytime. Your favourites will be right here.",
    cta: "Browse Shop",
    ctaHref: "/shop",
  },
  search: {
    title: "No toys found",
    description:
      "We couldn't find a match. Try a different keyword or explore our full collection.",
    cta: "View All Products",
    ctaHref: "/shop",
  },
  searchPrompt: {
    title: "Search our toys",
    description: "Use the search icon in the header to find educational toys and games.",
    cta: "Browse Shop",
    ctaHref: "/shop",
  },
  orders: {
    title: "No orders yet",
    description:
      "When you place your first order, it will show up here with delivery updates.",
    cta: "Start Shopping",
    ctaHref: "/shop",
  },
  recentlyViewed: {
    title: "No recently viewed toys",
    description: "Toys you browse will appear here for easy access.",
  },
  reviews: {
    title: "No reviews yet",
    description:
      "Be the first to share your experience with this toy. Your review helps other parents.",
  },
  shop: {
    title: "No toys available right now",
    description: "Check back soon for new arrivals. Great play is on the way!",
  },
} as const;

export const errorStates = {
  shop: {
    title: "We couldn't load products",
    description:
      "Something went wrong while fetching our toy collection. Please refresh or try again shortly.",
  },
  search: {
    title: "Search isn't available right now",
    description:
      "We're having trouble loading results. Please try again in a moment.",
  },
  cart: {
    title: "Cart update didn't go through",
    description:
      "Please try again. If the issue continues, refresh the page.",
  },
  orders: {
    title: "Couldn't load your orders",
    description:
      "Please refresh the page or sign in again to view your order history.",
  },
  productNotFound: {
    title: "Toy not found",
    description:
      "This product may have been moved or is no longer available.",
    cta: "Browse Shop",
    ctaHref: "/shop",
  },
  generic: {
    title: "Something went wrong",
    description: "Please try again. We're here to help if you need support.",
  },
} as const;
