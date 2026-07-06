import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/shopify";
import { formatPrice, getProductImageUrl } from "@/lib/shopify/types";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProducts(q, 8);

    return NextResponse.json({
      products: products.map((product) => ({
        handle: product.handle,
        title: product.title,
        price: formatPrice(product.price, product.currencyCode),
        imageUrl: getProductImageUrl(product),
      })),
    });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ products: [], error: "Search failed" }, { status: 500 });
  }
}
