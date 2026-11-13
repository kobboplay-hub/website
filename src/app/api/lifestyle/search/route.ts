import { NextRequest, NextResponse } from "next/server";

import { searchLifestyleProducts } from "@/lib/shopify/lifestyle";
import { formatPrice, getProductImageUrl } from "@/lib/shopify/types";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().slice(0, 80) ?? "";
  if (!q) return NextResponse.json({ products: [] });

  try {
    const products = await searchLifestyleProducts(q, 8);
    return NextResponse.json({
      products: products.map((product) => ({
        handle: product.handle,
        title: product.title,
        category: product.category,
        price: formatPrice(product.price, product.currencyCode),
        imageUrl: getProductImageUrl(product),
      })),
    });
  } catch (error) {
    console.error("Lifestyle search failed:", error);
    return NextResponse.json({ products: [], error: "Search failed" }, { status: 500 });
  }
}
