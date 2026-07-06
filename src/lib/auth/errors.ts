import { NextResponse } from "next/server";
import { CustomerApiError } from "@/lib/shopify/customer";
import { mapAuthErrorMessage } from "@/lib/auth/messages";

export function apiErrorResponse(error: unknown, fallback = "Request failed") {
  if (error instanceof CustomerApiError) {
    const status =
      error.message === "Not authenticated" || error.code === "UNIDENTIFIED_CUSTOMER"
        ? 401
        : 400;
    return NextResponse.json(
      {
        error: mapAuthErrorMessage(error.message, error.code),
        code: error.code,
      },
      { status },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: mapAuthErrorMessage(error.message) },
      { status: 500 },
    );
  }

  return NextResponse.json({ error: fallback }, { status: 500 });
}
