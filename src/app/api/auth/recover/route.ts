import { NextResponse } from "next/server";
import { recoverPassword } from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    await recoverPassword(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, "Password recovery failed");
  }
}
