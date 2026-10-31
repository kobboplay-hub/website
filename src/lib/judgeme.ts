export interface JudgeMeReview {
  id: number;
  rating: number;
  title: string;
  body: string;
  reviewerName: string;
  verified: boolean;
  createdAt: string;
  images: string[];
}

export interface JudgeMeRatingBreakdown {
  stars: number;
  count: number;
  percent: number;
}

export interface JudgeMeProductReviewData {
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: JudgeMeRatingBreakdown[];
  reviews: JudgeMeReview[];
}

export interface JudgeMeProductSummary {
  shopifyProductId: string;
  averageRating: number;
  reviewCount: number;
}

const JUDGEME_API_BASE = "https://judge.me/api/v1";
const REVALIDATE_SECONDS = 3600;

interface JudgeMeConfig {
  privateToken: string;
  publicToken: string;
  shopDomain: string;
}

interface JudgeMeApiReview {
  id: number;
  title?: string | null;
  body?: string | null;
  rating: number;
  verified?: string | boolean | null;
  curated?: string | null;
  hidden?: boolean;
  created_at?: string;
  pictures?: {
    hidden?: boolean;
    urls?: {
      small?: string;
      compact?: string;
      huge?: string;
      original?: string;
    };
  }[];
  reviewer?: {
    name?: string | null;
    email?: string | null;
  };
}

function getJudgeMeConfig(): JudgeMeConfig | null {
  const privateToken = process.env.JUDGEME_PRIVATE_TOKEN;
  const publicToken = process.env.JUDGEME_PUBLIC_TOKEN ?? "";
  const shopDomain =
    process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN ??
    process.env.SHOPIFY_STORE_DOMAIN;

  if (!privateToken || !shopDomain) return null;

  return { privateToken, publicToken, shopDomain };
}

export function isJudgeMeConfigured(): boolean {
  return getJudgeMeConfig() !== null;
}

export function parseShopifyProductId(productId: string): string {
  const match = productId.match(/\/Product\/(\d+)/);
  return match ? match[1] : productId;
}

function sanitizeText(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractRating(review: JudgeMeApiReview): number {
  const raw = review.rating;
  const num =
    typeof raw === "string" ? parseFloat(raw) : typeof raw === "number" ? raw : 0;

  if (!Number.isFinite(num) || num < 1) return 0;
  return Math.max(1, Math.min(5, Math.round(num)));
}

function normalizeReview(review: JudgeMeApiReview): JudgeMeReview | null {
  const rating = extractRating(review);
  if (rating === 0) return null;

  const images =
    review.pictures
      ?.filter((picture) => !picture.hidden)
      .map(
        (picture) =>
          picture.urls?.compact ??
          picture.urls?.small ??
          picture.urls?.original ??
          "",
      )
      .filter(Boolean) ?? [];

  const verified =
    review.verified === true ||
    review.verified === "buyer" ||
    review.verified === "verified";

  return {
    id: review.id,
    rating,
    title: sanitizeText(review.title),
    body: sanitizeText(review.body),
    reviewerName: sanitizeText(review.reviewer?.name) || "Kobbo Parent",
    verified,
    createdAt: review.created_at ?? new Date().toISOString(),
    images,
  };
}

function buildRatingBreakdown(
  reviews: JudgeMeReview[],
  reviewCount: number,
): JudgeMeRatingBreakdown[] {
  const counts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));

  const total = reviewCount > 0 ? reviewCount : reviews.length;

  return counts.map(({ stars, count }) => ({
    stars,
    count,
    percent: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}

function computeAverageRating(reviews: JudgeMeReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

async function judgeMeFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T | null> {
  const config = getJudgeMeConfig();
  if (!config) return null;

  const searchParams = new URLSearchParams({
    api_token: config.privateToken,
    shop_domain: config.shopDomain,
  });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  try {
    const response = await fetch(`${JUDGEME_API_BASE}${path}?${searchParams}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function judgeMeFetchNoCache<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T | null> {
  const config = getJudgeMeConfig();
  if (!config) return null;

  const searchParams = new URLSearchParams({
    api_token: config.privateToken,
    shop_domain: config.shopDomain,
  });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  try {
    const response = await fetch(`${JUDGEME_API_BASE}${path}?${searchParams}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function getJudgeMeProduct(
  shopifyProductId: string,
): Promise<JudgeMeProductRecord | null> {
  const data = await judgeMeFetch<{ product?: JudgeMeProductRecord }>(
    "/products/-1",
    { external_id: shopifyProductId },
  );

  return data?.product ?? null;
}

async function getJudgeMeInternalProductId(
  shopifyProductId: string,
): Promise<number | null> {
  const product = await getJudgeMeProduct(shopifyProductId);
  return product?.id ?? null;
}

function isPublishedReview(review: JudgeMeApiReview): boolean {
  if (review.hidden) return false;
  if (review.curated === "spam" || review.curated === "rejected") return false;
  return extractRating(review) > 0;
}

interface JudgeMeProductRecord {
  id?: number;
  external_id?: number;
  average_rating?: number;
  rating?: number;
  reviews_count?: number;
  review_count?: number;
}

function parsePreviewBadgeHtml(html: string): {
  averageRating: number;
  reviewCount: number;
} | null {
  const averageMatch = html.match(
    /data-average-rating=['"]([\d.]+)['"]|average-rating=['"]([\d.]+)['"]/i,
  );
  const countMatch = html.match(
    /data-number-of-reviews=['"](\d+)['"]|number-of-reviews=['"](\d+)['"]/i,
  );

  const averageRating = parseFloat(averageMatch?.[1] ?? averageMatch?.[2] ?? "");
  const reviewCount = parseInt(countMatch?.[1] ?? countMatch?.[2] ?? "", 10);

  if (!Number.isFinite(averageRating) || !Number.isFinite(reviewCount)) {
    return null;
  }

  if (reviewCount <= 0 || averageRating <= 0) return null;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
  };
}

async function fetchPreviewBadgeStats(
  shopifyProductId: string,
): Promise<{ averageRating: number; reviewCount: number } | null> {
  const config = getJudgeMeConfig();
  if (!config) return null;

  const searchParams = new URLSearchParams({
    api_token: config.privateToken,
    shop_domain: config.shopDomain,
    external_id: shopifyProductId,
  });

  try {
    const response = await fetch(
      `${JUDGEME_API_BASE}/widgets/preview_badge?${searchParams}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );

    if (!response.ok) return null;

    const data = (await response.json()) as { badge?: string; widget?: string };
    const html = data.badge ?? data.widget ?? "";
    if (!html) return null;

    return parsePreviewBadgeHtml(html);
  } catch {
    return null;
  }
}

function getReviewFetchParams(
  shopifyProductId: string,
  internalProductId: number | null,
  perPage: number,
  page = 1,
): Record<string, string | number> {
  if (internalProductId) {
    return { product_id: internalProductId, per_page: perPage, page };
  }

  return { external_id: shopifyProductId, per_page: perPage, page };
}

async function fetchReviewsList(
  shopifyProductId: string,
  internalProductId: number | null,
  perPage = 20,
): Promise<JudgeMeReview[]> {
  const data = await judgeMeFetch<{ reviews?: JudgeMeApiReview[] }>(
    "/reviews",
    {
      ...getReviewFetchParams(shopifyProductId, internalProductId, perPage),
      published: "true",
    },
  );

  return (data?.reviews ?? [])
    .filter(isPublishedReview)
    .map(normalizeReview)
    .filter((review): review is JudgeMeReview => review !== null);
}

async function resolveProductReviewStats(
  shopifyProductId: string,
  perPage = 20,
): Promise<{ averageRating: number; reviewCount: number; reviews: JudgeMeReview[] }> {
  const product = await getJudgeMeProduct(shopifyProductId);
  const internalProductId = product?.id ?? null;
  const reviews = await fetchReviewsList(
    shopifyProductId,
    internalProductId,
    perPage,
  );

  if (reviews.length > 0) {
    return {
      averageRating: computeAverageRating(reviews),
      reviewCount: reviews.length,
      reviews,
    };
  }

  const productAverage = product?.average_rating ?? product?.rating ?? 0;
  const productCount = product?.reviews_count ?? product?.review_count ?? 0;

  if (productAverage > 0 && productCount > 0) {
    return {
      averageRating: Math.round(productAverage * 10) / 10,
      reviewCount: productCount,
      reviews: [],
    };
  }

  const badgeStats = await fetchPreviewBadgeStats(shopifyProductId);
  if (badgeStats) {
    return { ...badgeStats, reviews: [] };
  }

  return { averageRating: 0, reviewCount: 0, reviews: [] };
}

export async function customerHasReviewedProduct(
  shopifyProductId: string,
  customerEmail: string,
): Promise<boolean> {
  const externalId = parseShopifyProductId(shopifyProductId);
  const normalizedEmail = customerEmail.trim().toLowerCase();

  if (!isJudgeMeConfigured() || !externalId || !normalizedEmail) {
    return false;
  }

  const internalProductId = await getJudgeMeInternalProductId(externalId);
  const data = await judgeMeFetchNoCache<{ reviews?: JudgeMeApiReview[] }>(
    "/reviews",
    getReviewFetchParams(externalId, internalProductId, 100),
  );

  const emailMatch = (data?.reviews ?? []).some((review) => {
    const reviewEmail = review.reviewer?.email?.trim().toLowerCase();
    return reviewEmail === normalizedEmail;
  });

  if (emailMatch) return true;

  const reviewerData = await judgeMeFetchNoCache<{ reviewer?: { id?: number } }>(
    "/reviewers/-1",
    { email: normalizedEmail },
  );

  const reviewerId = reviewerData?.reviewer?.id;
  if (!reviewerId) return false;

  const byReviewer = await judgeMeFetchNoCache<{ reviews?: JudgeMeApiReview[] }>(
    "/reviews",
    {
      reviewer_id: reviewerId,
      ...getReviewFetchParams(externalId, internalProductId, 10),
    },
  );

  return (byReviewer?.reviews ?? []).length > 0;
}

export async function getProductReviews(
  shopifyProductId: string,
): Promise<JudgeMeProductReviewData> {
  const externalId = parseShopifyProductId(shopifyProductId);
  const empty: JudgeMeProductReviewData = {
    averageRating: 0,
    reviewCount: 0,
    ratingBreakdown: buildRatingBreakdown([], 0),
    reviews: [],
  };

  if (!isJudgeMeConfigured() || !externalId) return empty;

  const stats = await resolveProductReviewStats(externalId, 20);

  if (stats.reviewCount === 0) return empty;

  return {
    averageRating: stats.averageRating,
    reviewCount: stats.reviewCount,
    ratingBreakdown: buildRatingBreakdown(stats.reviews, stats.reviewCount),
    reviews: stats.reviews,
  };
}

export async function getProductReviewSummary(
  shopifyProductId: string,
): Promise<JudgeMeProductSummary> {
  const externalId = parseShopifyProductId(shopifyProductId);
  const fallback = {
    shopifyProductId: externalId,
    averageRating: 0,
    reviewCount: 0,
  };

  if (!isJudgeMeConfigured() || !externalId) return fallback;

  const stats = await resolveProductReviewStats(externalId, 50);

  if (stats.reviewCount === 0 || stats.averageRating === 0) return fallback;

  return {
    shopifyProductId: externalId,
    averageRating: stats.averageRating,
    reviewCount: stats.reviewCount,
  };
}

export async function getProductReviewSummaries(
  shopifyProductIds: string[],
): Promise<Record<string, JudgeMeProductSummary>> {
  const uniqueIds = [
    ...new Set(shopifyProductIds.map(parseShopifyProductId).filter(Boolean)),
  ];

  const summaries = await Promise.all(
    uniqueIds.map((id) => getProductReviewSummary(id)),
  );

  return Object.fromEntries(
    summaries.map((summary) => [summary.shopifyProductId, summary]),
  );
}

export function formatReviewDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export interface SubmitReviewInput {
  shopifyProductId: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  body: string;
}

export interface SubmitReviewResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitProductReview(
  input: SubmitReviewInput,
): Promise<SubmitReviewResult> {
  const config = getJudgeMeConfig();
  if (!config) {
    return { success: false, error: "Review service is not configured." };
  }

  const externalId = parseShopifyProductId(input.shopifyProductId);
  if (!externalId) {
    return { success: false, error: "Invalid product." };
  }

  if (!input.name.trim() || !input.email.trim()) {
    return { success: false, error: "Reviewer name and email are required." };
  }

  if (input.rating < 1 || input.rating > 5) {
    return { success: false, error: "Please select a rating between 1 and 5." };
  }

  if (!input.body.trim()) {
    return { success: false, error: "Please write your review." };
  }

  try {
    const response = await fetch(`${JUDGEME_API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop_domain: config.shopDomain,
        platform: "shopify",
        id: Number(externalId),
        name: input.name.trim(),
        email: input.email.trim(),
        rating: input.rating,
        title: input.title.trim(),
        body: input.body.trim(),
      }),
      cache: "no-store",
    });

    const data = (await response.json()) as {
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      return {
        success: false,
        error: data.message ?? data.error ?? "Failed to submit review.",
      };
    }

    return {
      success: true,
      message: data.message ?? "Thank you! Your review has been submitted.",
    };
  } catch {
    return {
      success: false,
      error: "Could not submit review. Please try again.",
    };
  }
}
