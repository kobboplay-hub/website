import { NextResponse } from "next/server";
import { getCustomerOrders } from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function GET() {
  try {
    const orders = await getCustomerOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return apiErrorResponse(error, "Failed to fetch orders");
  }
}
