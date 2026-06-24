import { NextResponse } from "next/server";
import { CustomerApiError } from "@/lib/shopify/customer";

export function apiErrorResponse(error: unknown, fallback = "Request failed") {
  if (error instanceof CustomerApiError) {
    const status =
      error.message === "Not authenticated" || error.code === "UNIDENTIFIED_CUSTOMER"
        ? 401
        : 400;
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ error: fallback }, { status: 500 });
}
