import { NextResponse } from "next/server";
import {
  getShopProductsByCursor,
  parseShopSort,
  SHOP_PRODUCTS_PER_PAGE,
} from "@/lib/shopify";
import { getProductReviewSummaries } from "@/lib/judgeme";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const sort = parseShopSort(searchParams.get("sort"));
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

    // Don't block product loading on slow Judge.me responses
    let reviewSummaries: Record<string, unknown> = {};
    if (result.products.length > 0) {
      try {
        reviewSummaries = await Promise.race([
          getProductReviewSummaries(result.products.map((product) => product.id)),
          new Promise<Record<string, never>>((resolve) => {
            setTimeout(() => resolve({}), 2500);
          }),
        ]);
      } catch {
        reviewSummaries = {};
      }
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
