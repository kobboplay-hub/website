import { NextResponse } from "next/server";
import {
  getShopProductsByCursor,
  SHOP_PRODUCTS_PER_PAGE,
  type ShopSortOption,
} from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";

const validSorts: ShopSortOption[] = [
  "featured",
  "price-asc",
  "price-desc",
  "alpha",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const sortRaw = searchParams.get("sort") ?? "featured";
    const sort = validSorts.includes(sortRaw as ShopSortOption)
      ? (sortRaw as ShopSortOption)
      : "featured";
    const after = searchParams.get("cursor");
    const firstRaw = Number.parseInt(
      searchParams.get("first") ?? String(SHOP_PRODUCTS_PER_PAGE),
      10,
    );
    const first = Math.min(
      50,
      Math.max(1, Number.isFinite(firstRaw) ? firstRaw : SHOP_PRODUCTS_PER_PAGE),
    );

    const result = await getShopProductsByCursor(
      first,
      q,
      sort,
      after && after.length > 0 ? after : null,
    );

    let reviewSummaries = {};
    if (result.products.length > 0) {
      reviewSummaries = await getProductReviewSummaries(
        result.products.map((product) => product.id),
      );
    }

    return NextResponse.json({
      products: result.products,
      endCursor: result.endCursor,
      hasNextPage: result.hasNextPage,
      reviewSummaries,
    });
  } catch (error) {
    console.error("Shop products API failed:", error);
    return NextResponse.json(
      { error: "Failed to load products. Please try again." },
      { status: 500 },
    );
  }
}
