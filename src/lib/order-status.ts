const PAID_FINANCIAL_STATUSES = new Set(["PAID", "PARTIALLY_PAID"]);
const FULFILLED_STATUSES = new Set(["FULFILLED", "PARTIALLY_FULFILLED"]);
const INVALID_FINANCIAL_STATUSES = new Set(["VOIDED", "REFUNDED"]);

export interface OrderStatusDetail {
  label: string;
  value: string;
  description: string;
  isComplete: boolean;
  isPending: boolean;
  isIssue: boolean;
}

export function isOrderPaid(financialStatus: string): boolean {
  return PAID_FINANCIAL_STATUSES.has(financialStatus.toUpperCase());
}

export function isOrderFulfilled(fulfillmentStatus: string): boolean {
  return FULFILLED_STATUSES.has(fulfillmentStatus.toUpperCase());
}

export function isOrderReviewable(
  financialStatus: string,
  fulfillmentStatus: string,
): boolean {
  const financial = financialStatus.toUpperCase();
  if (INVALID_FINANCIAL_STATUSES.has(financial)) return false;
  return isOrderPaid(financial) && isOrderFulfilled(fulfillmentStatus);
}

export function getPaymentStatusDetail(
  financialStatus: string,
): OrderStatusDetail {
  const normalized = financialStatus.toUpperCase();

  if (PAID_FINANCIAL_STATUSES.has(normalized)) {
    return {
      label: "Payment",
      value: normalized === "PARTIALLY_PAID" ? "Partially paid" : "Paid",
      description: "Your payment has been received.",
      isComplete: true,
      isPending: false,
      isIssue: false,
    };
  }

  if (INVALID_FINANCIAL_STATUSES.has(normalized)) {
    return {
      label: "Payment",
      value: formatStatusLabel(financialStatus),
      description: "This order is no longer active.",
      isComplete: false,
      isPending: false,
      isIssue: true,
    };
  }

  return {
    label: "Payment",
    value: formatStatusLabel(financialStatus),
    description: "We're waiting for your payment to be confirmed.",
    isComplete: false,
    isPending: true,
    isIssue: false,
  };
}

export function getDeliveryStatusDetail(
  fulfillmentStatus: string,
): OrderStatusDetail {
  const normalized = fulfillmentStatus.toUpperCase();

  if (FULFILLED_STATUSES.has(normalized)) {
    return {
      label: "Delivery",
      value: normalized === "PARTIALLY_FULFILLED" ? "Partially delivered" : "Delivered",
      description: "Your order has been delivered.",
      isComplete: true,
      isPending: false,
      isIssue: false,
    };
  }

  if (
    normalized.includes("CANCEL") ||
    normalized.includes("RESTOCKED")
  ) {
    return {
      label: "Delivery",
      value: formatStatusLabel(fulfillmentStatus),
      description: "This order was not completed.",
      isComplete: false,
      isPending: false,
      isIssue: true,
    };
  }

  return {
    label: "Delivery",
    value: formatStatusLabel(fulfillmentStatus),
    description: "Your order is being prepared or on its way.",
    isComplete: false,
    isPending: true,
    isIssue: false,
  };
}

function formatStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
