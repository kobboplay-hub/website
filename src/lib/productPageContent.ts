import type { Product } from "@/lib/shopify/types";

export interface ProductHighlight {
  title: string;
  description: string;
}

export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductVideoData {
  type: "youtube" | "mp4";
  url: string;
  thumbnail: string;
}

/** Static PDP content — reviews, FAQs, highlights until Shopify metafields are wired */
export const defaultHighlights = [
  {
    title: "Skill Development",
    description: "Builds problem-solving and hand-eye coordination",
  },
  {
    title: "Creative Learning",
    description: "Encourages exploration through playful discovery",
  },
  {
    title: "Interactive Play",
    description: "Keeps little hands busy and minds curious",
  },
  {
    title: "Parent Approved",
    description: "Loved by families for quality and engagement",
  },
];

export const defaultWhyParentsLove = [
  {
    title: "Encourages Creativity",
    description:
      "Open-ended play sparks imagination and self-expression every day.",
  },
  {
    title: "Builds Motor Skills",
    description:
      "Fine and gross motor development through grasping, stacking and sorting.",
  },
  {
    title: "Keeps Kids Engaged",
    description:
      "Thoughtful design holds attention longer than ordinary toys.",
  },
];

export const defaultFaqs = [
  {
    question: "What age group is this toy suitable for?",
    answer:
      "Please refer to the product description for age recommendations. Always supervise play for younger children.",
  },
  {
    question: "What materials are used?",
    answer:
      "Material details are listed in the product description and specifications tab.",
  },
  {
    question: "Is assembly required?",
    answer:
      "Check the product description for assembly requirements. Most toys arrive ready to play.",
  },
  {
    question: "How should I clean the toy?",
    answer:
      "Wipe clean with a damp cloth. Avoid soaking or using harsh chemicals.",
  },
];

export const defaultReviews = [
  {
    id: "r1",
    name: "Priya M.",
    rating: 5,
    text: "Beautiful quality toy! My child loves it and plays with it every day.",
    date: "2 weeks ago",
  },
  {
    id: "r2",
    name: "Rahul K.",
    rating: 5,
    text: "Great craftsmanship. Arrived well-packaged and exactly as shown.",
    date: "1 month ago",
  },
  {
    id: "r3",
    name: "Ananya S.",
    rating: 4,
    text: "Wonderful toy for skill building. Highly recommend from Kobbo!",
    date: "1 month ago",
  },
];

export const defaultRatingBreakdown = [
  { stars: 5, percent: 72 },
  { stars: 4, percent: 18 },
  { stars: 3, percent: 6 },
  { stars: 2, percent: 3 },
  { stars: 1, percent: 1 },
];

export const placeholderVideo = {
  type: "youtube" as const,
  url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnail:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=675&fit=crop",
};

export function getProductTabsContent(product: Product) {
  const featuresMetafield = product.metafields.find((m) => m.key === "features");
  const careMetafield = product.metafields.find(
    (m) => m.key === "care_instructions",
  );
  const specsMetafield = product.metafields.find(
    (m) => m.key === "specifications",
  );

  const features = featuresMetafield
    ? featuresMetafield.value.split("\n").filter(Boolean)
    : product.tags.length > 0
      ? product.tags
      : ["Premium quality toy", "Designed for interactive play"];

  const careInstructions = careMetafield
    ? careMetafield.value.split("\n").filter(Boolean)
    : [
        "Wipe clean with a soft, damp cloth after use.",
        "Keep away from direct sunlight and moisture.",
        "Store in a dry place when not in use.",
      ];

  const specifications = specsMetafield
    ? specsMetafield.value.split("\n").map((line) => {
        const [label, ...rest] = line.split(":");
        return { label: label.trim(), value: rest.join(":").trim() };
      })
    : [
        { label: "Vendor", value: product.vendor || "Kobbo" },
        { label: "Type", value: product.productType || "Toy" },
        {
          label: "Availability",
          value: product.availableForSale ? "In Stock" : "Out of Stock",
        },
      ].filter((s) => s.value);

  return {
    descriptionHtml: product.descriptionHtml,
    features,
    specifications,
    careInstructions,
  };
}

export function getProductVideoThumbnail(product: Product) {
  const videoMetafield = product.metafields.find((m) => m.key === "video_url");
  const imageUrl =
    product.featuredImage?.url ??
    product.images[0]?.url ??
    placeholderVideo.thumbnail;

  if (videoMetafield?.value) {
    const url = videoMetafield.value;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return {
        type: "youtube" as const,
        url: url.includes("embed") ? url : placeholderVideo.url,
        thumbnail: imageUrl,
      };
    }
    return { type: "mp4" as const, url, thumbnail: imageUrl };
  }

  return { ...placeholderVideo, thumbnail: imageUrl };
}
