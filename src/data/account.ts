export function formatOrderDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatOrderStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getOrderStatusStyle(status: string): string {
  const normalized = status.toUpperCase();

  if (
    normalized.includes("FULFILLED") ||
    normalized.includes("DELIVERED") ||
    normalized === "PAID"
  ) {
    return "bg-kobbo-green/15 text-kobbo-green";
  }

  if (
    normalized.includes("PARTIAL") ||
    normalized.includes("SHIPPED") ||
    normalized.includes("IN_TRANSIT")
  ) {
    return "bg-blue-100 text-blue-700";
  }

  if (
    normalized.includes("PENDING") ||
    normalized.includes("UNFULFILLED") ||
    normalized.includes("PROCESSING")
  ) {
    return "bg-kobbo-yellow/30 text-kobbo-black";
  }

  if (
    normalized.includes("CANCEL") ||
    normalized.includes("REFUND") ||
    normalized.includes("VOID")
  ) {
    return "bg-red-100 text-red-600";
  }

  return "bg-kobbo-beige text-kobbo-black";
}
