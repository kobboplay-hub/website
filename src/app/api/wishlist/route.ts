import { NextResponse } from "next/server";
import { getProductByHandle } from "@/lib/shopify";
import { getDefaultMerchandiseId } from "@/lib/shopify/cart";
import { getProductImageUrl } from "@/lib/shopify/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const handles = Array.isArray(body.handles) ? body.handles : [];

    if (handles.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const products = await Promise.all(
      handles.map((handle: string) => getProductByHandle(handle)),
    );

    const items = products
      .filter((product) => product !== null)
      .map((product) => ({
        id: product!.id,
        handle: product!.handle,
        title: product!.title,
        price: product!.price,
        currencyCode: product!.currencyCode,
        image: getProductImageUrl(product!),
        merchandiseId: getDefaultMerchandiseId(product!),
        availableForSale: product!.availableForSale,
      }));

    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch wishlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
