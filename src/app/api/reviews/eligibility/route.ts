import { NextResponse } from "next/server";
import { getReviewEligibility } from "@/lib/review-eligibility";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productHandle = searchParams.get("productHandle");
  const productId = searchParams.get("productId");

  if (!productHandle) {
    return NextResponse.json(
      { eligible: false, reason: "invalid_product" },
      { status: 400 },
    );
  }

  const result = await getReviewEligibility(
    productHandle,
    productId ?? undefined,
  );

  if (result.reason === "not_authenticated") {
    return NextResponse.json(
      { eligible: false, reason: result.reason },
      { status: 401 },
    );
  }

  return NextResponse.json({
    eligible: result.eligible,
    reason: result.reason,
  });
}
