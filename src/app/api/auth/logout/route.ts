import { NextResponse } from "next/server";
import { logoutCustomer } from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function POST() {
  try {
    await logoutCustomer();
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, "Logout failed");
  }
}
