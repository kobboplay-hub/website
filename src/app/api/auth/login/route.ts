import { NextResponse } from "next/server";
import { loginCustomer } from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const customer = await loginCustomer(email, password);
    return NextResponse.json({ customer });
  } catch (error) {
    return apiErrorResponse(error, "Login failed");
  }
}
