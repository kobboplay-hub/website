import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";

    if (!email.trim()) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const result = await subscribeToNewsletter(email);

    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error, "Subscription failed");
  }
}
