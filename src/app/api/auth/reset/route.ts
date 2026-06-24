import { NextResponse } from "next/server";
import {
  resetCustomerPassword,
  resetCustomerPasswordByUrl,
} from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, resetUrl, customerId, resetToken } = body;

    if (!password || password.length < 5) {
      return NextResponse.json(
        { error: "Password must be at least 5 characters." },
        { status: 400 },
      );
    }

    let customer;

    if (resetUrl) {
      customer = await resetCustomerPasswordByUrl(resetUrl, password);
    } else if (customerId && resetToken) {
      customer = await resetCustomerPassword(customerId, resetToken, password);
    } else {
      return NextResponse.json(
        { error: "Invalid or expired reset link." },
        { status: 400 },
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    return apiErrorResponse(error, "Password reset failed");
  }
}
