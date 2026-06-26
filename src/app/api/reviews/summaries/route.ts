import { NextResponse } from "next/server";
import { getProductReviewSummaries } from "@/lib/judgeme";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productIds = Array.isArray(body.productIds) ? body.productIds : [];

    if (productIds.length === 0) {
      return NextResponse.json({ summaries: {} });
    }

    const summaries = await getProductReviewSummaries(productIds);
    return NextResponse.json({ summaries });
  } catch {
    return NextResponse.json({ summaries: {} });
  }
}
