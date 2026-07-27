import type {
  Product,
  ShopifyMediaVideo,
  ShopifyMetafield,
  ShopifyMetafieldReference,
} from "@/lib/shopify/types";
import { productFaqs, type ProductFAQ } from "@/data/faqs";

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


/** Supported video sources on PDP — managed via Shopify media or metafields */
export type ProductVideoType = "youtube" | "mp4" | "instagram" | "external";

export interface ProductVideoItem {
  id: string;
  type: ProductVideoType;
  url: string;
  thumbnail: string;
  label?: string;
}

export interface HomeProductVideo {
  id: string;
  title: string;
  handle: string;
  video: ProductVideoItem;
}

export interface ProductTabsContent {
  descriptionHtml: string;
  features: string[];
  specifications: { label: string; value: string }[];
  careInstructions: string[];
}

/** Static PDP content — highlights until Shopify metafields are wired */
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

/** @deprecated Import from @/data/faqs — kept for backward compatibility */
export const defaultFaqs = productFaqs;
export type { ProductFAQ };

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

export const placeholderVideo: ProductVideoItem = {
  id: "placeholder",
  type: "youtube",
  url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnail:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=675&fit=crop",
  label: "Product Demo",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getMetafieldValue(product: Product, key: string): string | null {
  const field = product.metafields.find((m) => m.key === key);
  return field?.value?.trim() || null;
}

/** Parse list metafield — supports JSON array, comma-separated, or newline-separated URLs */
export function parseListMetafield(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((s) => s.trim()).filter(Boolean);
      }
    } catch {
      // fall through to delimiter parsing
    }
  }

  return trimmed
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseVideoUrl(rawUrl: string): ProductVideoItem | null {
  const url = rawUrl.trim();
  if (!url) return null;

  const defaultThumb =
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=450&fit=crop";

  if (/instagram\.com/i.test(url)) {
    return {
      id: `ig-${url}`,
      type: "instagram",
      url,
      thumbnail: defaultThumb,
      label: "Watch on Instagram",
    };
  }

  if (/youtube\.com|youtu\.be/i.test(url)) {
    const embedUrl = toYouTubeEmbedUrl(url);
    if (!embedUrl) return null;
    const videoId = embedUrl.split("/embed/")[1]?.split("?")[0];
    return {
      id: `yt-${videoId ?? url}`,
      type: "youtube",
      url: embedUrl,
      thumbnail: videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : defaultThumb,
      label: "Watch on YouTube",
    };
  }

  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) {
    return {
      id: `mp4-${url}`,
      type: "mp4",
      url,
      thumbnail: defaultThumb,
      label: "Play Video",
    };
  }

  return {
    id: `ext-${url}`,
    type: "external",
    url,
    thumbnail: defaultThumb,
    label: "Watch Video",
  };
}

function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.pathname.includes("/embed/")) {
      return url;
    }
    const id = parsed.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function mediaVideoToItem(
  media: ShopifyMediaVideo,
  fallbackThumb: string,
): ProductVideoItem | null {
  if (media.mediaContentType === "VIDEO" && media.sources?.[0]?.url) {
    return {
      id: media.id,
      type: "mp4",
      url: media.sources[0].url,
      thumbnail: media.previewImage?.url ?? fallbackThumb,
      label: media.alt ?? "Product Video",
    };
  }

  if (media.mediaContentType === "EXTERNAL_VIDEO" && media.embedUrl) {
    const origin = media.originUrl ?? media.embedUrl;
    if (/instagram\.com/i.test(origin)) {
      return {
        id: media.id,
        type: "instagram",
        url: origin,
        thumbnail: media.previewImage?.url ?? fallbackThumb,
        label: "Watch on Instagram",
      };
    }
    if (/youtube\.com|youtu\.be/i.test(origin) || media.host === "YOUTUBE") {
      const embed = toYouTubeEmbedUrl(media.embedUrl) ?? media.embedUrl;
      const videoId = embed.split("/embed/")[1]?.split("?")[0];
      return {
        id: media.id,
        type: "youtube",
        url: embed,
        thumbnail:
          media.previewImage?.url ??
          (videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : fallbackThumb),
        label: "Watch on YouTube",
      };
    }
    return {
      id: media.id,
      type: "external",
      url: media.embedUrl,
      thumbnail: media.previewImage?.url ?? fallbackThumb,
      label: "Watch Video",
    };
  }

  return null;
}

function metafieldReferenceToItem(
  ref: ShopifyMetafieldReference,
  fallbackThumb: string,
): ProductVideoItem | null {
  if (ref.sources?.[0]?.url) {
    return mediaVideoToItem(
      {
        id: ref.id ?? "metafield-video",
        mediaContentType: "VIDEO",
        alt: ref.alt,
        sources: ref.sources,
        previewImage: ref.previewImage,
      },
      fallbackThumb,
    );
  }

  if (ref.embedUrl) {
    return mediaVideoToItem(
      {
        id: ref.id ?? "metafield-external-video",
        mediaContentType: "EXTERNAL_VIDEO",
        alt: ref.alt,
        embedUrl: ref.embedUrl,
        host: ref.host,
        originUrl: ref.originUrl,
        previewImage: ref.previewImage,
      },
      fallbackThumb,
    );
  }

  if (ref.url) {
    if (
      ref.mimeType?.startsWith("video/") ||
      /\.(mp4|webm|mov)(\?|$)/i.test(ref.url)
    ) {
      return {
        id: ref.id ?? ref.url,
        type: "mp4",
        url: ref.url,
        thumbnail: fallbackThumb,
        label: "Product Video",
      };
    }

    return parseVideoUrl(ref.url);
  }

  return null;
}

function extractVideosFromMetafield(
  metafield: ShopifyMetafield,
  fallbackThumb: string,
): ProductVideoItem[] {
  const videos: ProductVideoItem[] = [];

  if (metafield.reference) {
    const item = metafieldReferenceToItem(metafield.reference, fallbackThumb);
    if (item) videos.push(item);
  }

  for (const edge of metafield.references?.edges ?? []) {
    const item = metafieldReferenceToItem(edge.node, fallbackThumb);
    if (item) videos.push(item);
  }

  if (videos.length > 0) {
    return videos;
  }

  const urls =
    metafield.key === "video_url"
      ? [metafield.value]
      : parseListMetafield(metafield.value ?? "");

  return urls
    .filter((url) => url && !url.startsWith("gid://"))
    .map(parseVideoUrl)
    .filter((v): v is ProductVideoItem => v !== null);
}

function collectProductVideos(product: Product): ProductVideoItem[] {
  const fallbackThumb =
    product.featuredImage?.url ??
    product.images[0]?.url ??
    placeholderVideo.thumbnail;

  const fromMedia =
    product.mediaVideos
      ?.map((m) => mediaVideoToItem(m, fallbackThumb))
      .filter((v): v is ProductVideoItem => v !== null) ?? [];

  if (fromMedia.length > 0) {
    return fromMedia;
  }

  const metafieldKeys = ["product_video", "product_videos", "video_url"] as const;
  return metafieldKeys.flatMap((key) => {
    const field = product.metafields.find((m) => m.key === key);
    return field ? extractVideosFromMetafield(field, fallbackThumb) : [];
  });
}

/**
 * Product tabs — content from Shopify description + metafields.
 * Metafields: custom.features, custom.specifications, custom.care_instructions
 */
export function getProductTabsContent(product: Product): ProductTabsContent {
  const featuresValue = getMetafieldValue(product, "features");
  const careValue = getMetafieldValue(product, "care_instructions");
  const specsValue = getMetafieldValue(product, "specifications");

  const features = featuresValue
    ? parseListMetafield(featuresValue.replace(/\n/g, ","))
    : product.tags.length > 0
      ? product.tags
      : [];

  const careInstructions = careValue
    ? parseListMetafield(careValue.replace(/\n/g, ","))
    : [];

  const specifications = specsValue
    ? specsValue
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const colonIndex = line.indexOf(":");
          if (colonIndex === -1) return { label: line, value: "" };
          return {
            label: line.slice(0, colonIndex).trim(),
            value: line.slice(colonIndex + 1).trim(),
          };
        })
        .filter((s) => s.label && s.value)
    : [
        ...(product.vendor
          ? [{ label: "Brand", value: product.vendor }]
          : []),
        ...(product.productType
          ? [{ label: "Type", value: product.productType }]
          : []),
        {
          label: "Availability",
          value: product.availableForSale ? "In Stock" : "Out of Stock",
        },
      ].filter((s) => s.value);

  return {
    descriptionHtml: product.descriptionHtml || product.description,
    features,
    specifications,
    careInstructions,
  };
}

export function hasTabContent(
  tabId: "description" | "features" | "specifications" | "care",
  content: ProductTabsContent,
): boolean {
  switch (tabId) {
    case "description":
      return stripHtml(content.descriptionHtml).length > 0;
    case "features":
      return content.features.length > 0;
    case "specifications":
      return content.specifications.length > 0;
    case "care":
      return content.careInstructions.length > 0;
    default:
      return false;
  }
}

/**
 * Product videos — priority:
 * A) Shopify product media (Video / ExternalVideo)
 * B) Metafield custom.product_video / custom.product_videos (file or URL)
 * C) Legacy metafield custom.video_url
 * D) Placeholder fallback
 */
export function getProductVideos(product: Product): ProductVideoItem[] {
  const fallbackThumb =
    product.featuredImage?.url ??
    product.images[0]?.url ??
    placeholderVideo.thumbnail;

  const videos = collectProductVideos(product);

  if (videos.length > 0) {
    return videos.slice(0, 4);
  }

  return [{ ...placeholderVideo, thumbnail: fallbackThumb }];
}

/** First real product video for gallery preview — null when none configured */
export function getPrimaryProductVideo(product: Product): ProductVideoItem | null {
  const videos = collectProductVideos(product);
  return videos[0] ?? null;
}

/** Homepage video cards from products that have uploaded videos */
export function getHomepageProductVideos(
  products: Product[],
  limit = 8,
): HomeProductVideo[] {
  return products
    .map((product) => {
      const video = getPrimaryProductVideo(product);
      if (!video) return null;

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        video,
      };
    })
    .filter((item): item is HomeProductVideo => item !== null)
    .slice(0, limit);
}
