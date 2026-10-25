import { getCustomerToken } from "@/lib/auth/session";
import {
  getCurrentCustomer,
  getCustomerProductReviewPurchaseStatus,
} from "@/lib/shopify/customer";
import {
  customerHasReviewedProduct,
  isJudgeMeConfigured,
  parseShopifyProductId,
} from "@/lib/judgeme";
import { getProductByHandle } from "@/lib/shopify";

export type ReviewEligibilityReason =
  | "eligible"
  | "not_authenticated"
  | "not_purchased"
  | "payment_pending"
  | "not_fulfilled"
  | "already_reviewed"
  | "judgeme_unavailable"
  | "invalid_product"
  | "error";

export interface ReviewEligibilityResult {
  eligible: boolean;
  reason: ReviewEligibilityReason;
}

export async function getReviewEligibility(
  productHandle: string,
  productId?: string,
): Promise<ReviewEligibilityResult> {
  if (!productHandle) {
    return { eligible: false, reason: "invalid_product" };
  }

  if (!isJudgeMeConfigured()) {
    return { eligible: false, reason: "judgeme_unavailable" };
  }

  const token = await getCustomerToken();
  if (!token) {
    return { eligible: false, reason: "not_authenticated" };
  }

  try {
    const customer = await getCurrentCustomer(token);
    if (!customer) {
      return { eligible: false, reason: "not_authenticated" };
    }

    const product = await getProductByHandle(productHandle);
    if (!product || (productId &&
      parseShopifyProductId(productId) !== parseShopifyProductId(product.id))) {
      return { eligible: false, reason: "invalid_product" };
    }

    const purchaseStatus = await getCustomerProductReviewPurchaseStatus(
      productHandle,
      product.id,
    );

    if (purchaseStatus === "not_purchased") {
      return { eligible: false, reason: "not_purchased" };
    }

    if (purchaseStatus === "payment_pending") {
      return { eligible: false, reason: "payment_pending" };
    }

    if (purchaseStatus === "not_fulfilled") {
      return { eligible: false, reason: "not_fulfilled" };
    }

    const alreadyReviewed = await customerHasReviewedProduct(
      product.id,
      customer.email,
    );

    if (alreadyReviewed) {
      return { eligible: false, reason: "already_reviewed" };
    }

    return { eligible: true, reason: "eligible" };
  } catch {
    return { eligible: false, reason: "error" };
  }
}

export function getReviewEligibilityMessage(
  reason: ReviewEligibilityReason,
): string | null {
  switch (reason) {
    case "already_reviewed":
      return "You've already shared your review for this toy.";
    case "not_fulfilled":
      return "You can leave a review once your order is delivered.";
    case "payment_pending":
      return "You can leave a review after your payment is confirmed.";
    case "not_purchased":
      return "Only customers who purchased this toy can leave a review.";
    default:
      return null;
  }
}
