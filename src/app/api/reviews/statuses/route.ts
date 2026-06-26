import { NextResponse } from "next/server";
import { getCustomerToken } from "@/lib/auth/session";
import { getCurrentCustomer } from "@/lib/shopify/customer";
import {
  customerHasReviewedProduct,
  isJudgeMeConfigured,
  parseShopifyProductId,
} from "@/lib/judgeme";

interface ReviewStatusItem {
  productId: string;
  productHandle: string;
}

export async function POST(request: Request) {
  if (!isJudgeMeConfigured()) {
    return NextResponse.json({ statuses: {} });
  }

  const token = await getCustomerToken();
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const customer = await getCurrentCustomer(token);
    if (!customer) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const items: ReviewStatusItem[] = Array.isArray(body.items)
      ? body.items.filter(
          (item: ReviewStatusItem) => item?.productId && item?.productHandle,
        )
      : [];

    const uniqueItems = [
      ...new Map(
        items.map((item) => [parseShopifyProductId(item.productId), item]),
      ).values(),
    ];

    const results = await Promise.all(
      uniqueItems.map(async (item) => {
        const key = parseShopifyProductId(item.productId);
        const alreadyReviewed = await customerHasReviewedProduct(
          item.productId,
          customer.email,
        );
        return [key, { alreadyReviewed }] as const;
      }),
    );

    return NextResponse.json({
      statuses: Object.fromEntries(results),
    });
  } catch {
    return NextResponse.json({ statuses: {} });
  }
}
