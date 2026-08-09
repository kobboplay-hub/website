import type {
  Product,
  ShopifyMediaVideo,
  ShopifyMetafield,
  ShopifyMetafieldReference,
} from "@/lib/shopify/types";
import type { ProductFAQ } from "@/data/faqs";

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

/** Static PDP content — why parents love until Shopify metafields are wired */
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
 * Strip any HTML/tags from metafield text so we never render markup.
 * Preserves line breaks from common block tags.
 */
function sanitizeSpecificationsText(raw: string): string {
  return raw
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/\s*p\s*>/gi, "\n")
    .replace(/<\s*\/\s*tr\s*>/gi, "\n")
    .replace(/<\s*\/\s*li\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

/**
 * Parse custom.specifications multi-line text:
 * "Label: Value" → { label, value }
 * Splits only on the first colon; skips blank/malformed lines.
 */
export function parseSpecificationsMetafield(
  raw: string | null | undefined,
): { label: string; value: string }[] {
  if (!raw?.trim()) return [];

  const text = sanitizeSpecificationsText(raw);
  const rows: { label: string; value: string }[] = [];

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex <= 0) continue;

    const label = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    if (!label || !value) continue;

    rows.push({ label, value });
  }

  return rows;
}

/**
 * Parse custom.product_faqs multi-line text:
 *
 *   Q: Question text?
 *   A: Answer text.
 *
 * - Lines starting with Q: begin a new question
 * - Lines starting with A: begin the paired answer
 * - Continuation lines append to the current Q or A
 * - Empty lines are ignored
 * - Incomplete pairs (missing answer) are dropped
 */
export function parseProductFaqsMetafield(
  raw: string | null | undefined,
): ProductFAQ[] {
  if (!raw?.trim()) return [];

  const text = sanitizeSpecificationsText(raw);
  const faqs: ProductFAQ[] = [];

  let question: string | null = null;
  let answer: string | null = null;
  let mode: "q" | "a" | null = null;

  const flush = () => {
    const q = question?.trim();
    const a = answer?.trim();
    if (q && a) {
      faqs.push({ question: q, answer: a });
    }
    question = null;
    answer = null;
    mode = null;
  };

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const qMatch = /^Q:\s*(.*)$/i.exec(trimmed);
    if (qMatch) {
      flush();
      question = qMatch[1].trim();
      answer = null;
      mode = "q";
      continue;
    }

    const aMatch = /^A:\s*(.*)$/i.exec(trimmed);
    if (aMatch) {
      answer = aMatch[1].trim();
      mode = "a";
      continue;
    }

    if (mode === "q" && question !== null) {
      question = `${question} ${trimmed}`.trim();
    } else if (mode === "a" && answer !== null) {
      answer = `${answer} ${trimmed}`.trim();
    }
  }

  flush();
  return faqs;
}

/** Product-specific FAQs from metafield custom.product_faqs */
export function getProductFaqs(product: Product): ProductFAQ[] {
  return parseProductFaqsMetafield(getMetafieldValue(product, "product_faqs"));
}

function buildProductSpecifications(
  product: Product,
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];

  if (product.vendor?.trim()) {
    rows.push({ label: "Brand", value: product.vendor.trim() });
  }

  rows.push(
    ...parseSpecificationsMetafield(getMetafieldValue(product, "specifications")),
  );

  rows.push({
    label: "Availability",
    value: product.availableForSale ? "In Stock" : "Out of Stock",
  });

  return rows;
}

/**
 * Product tabs — content from Shopify description + metafields.
 * Specs from a single multi-line metafield: custom.specifications
 * (+ Brand from vendor, Availability from stock status).
 */
export function getProductTabsContent(product: Product): ProductTabsContent {
  const featuresValue = getMetafieldValue(product, "features");
  const careValue = getMetafieldValue(product, "care_instructions");

  const features = featuresValue
    ? parseListMetafield(featuresValue.replace(/\n/g, ","))
    : product.tags.length > 0
      ? product.tags
      : [];

  const careInstructions = careValue
    ? parseListMetafield(careValue.replace(/\n/g, ","))
    : [];

  return {
    descriptionHtml: product.descriptionHtml || product.description,
    features,
    specifications: buildProductSpecifications(product),
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
 * Returns empty when none are configured (section stays hidden).
 */
export function getProductVideos(product: Product): ProductVideoItem[] {
  const videos = collectProductVideos(product);
  return videos.slice(0, 4);
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
