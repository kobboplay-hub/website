import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCustomerToken } from "@/lib/auth/session";
import { apiErrorResponse } from "@/lib/auth/errors";
import { getCurrentCustomer } from "@/lib/shopify/customer";
import { submitProductReview } from "@/lib/judgeme";
import { getReviewEligibility } from "@/lib/review-eligibility";
import { getProductByHandle } from "@/lib/shopify";

export async function POST(request: Request) {
  const token = await getCustomerToken();
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const productId = typeof body.productId === "string" ? body.productId : "";
    const productHandle =
      typeof body.productHandle === "string" ? body.productHandle : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const reviewBody = typeof body.body === "string" ? body.body.trim() : "";
    const rating = Number(body.rating);

    if (!productId || !productHandle) {
      return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    }

    const customer = await getCurrentCustomer(token);
    if (!customer) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const product = await getProductByHandle(productHandle);
    const eligibility = await getReviewEligibility(
      productHandle,
      productId,
      product?.title,
    );

    if (!eligibility.eligible) {
      const messages: Record<string, string> = {
        already_reviewed: "You have already reviewed this product.",
        not_fulfilled:
          "You can leave a review once your order has been delivered.",
        payment_pending:
          "You can leave a review after your payment is confirmed.",
        not_purchased: "You can only review products you have purchased.",
        judgeme_unavailable: "Review service is temporarily unavailable.",
      };

      return NextResponse.json(
        {
          error:
            messages[eligibility.reason] ??
            "You are not eligible to review this product.",
        },
        { status: 403 },
      );
    }

    const reviewerName =
      [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim() ||
      customer.email;

    const result = await submitProductReview({
      shopifyProductId: productId,
      name: reviewerName,
      email: customer.email,
      rating,
      title,
      body: reviewBody,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Failed to submit review." },
        { status: 400 },
      );
    }

    revalidatePath(`/products/${productHandle}`);

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to submit review");
  }
}
