import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();

    if (!customer) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    return apiErrorResponse(error, "Failed to fetch customer");
  }
}
