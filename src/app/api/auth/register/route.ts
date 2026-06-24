import { NextResponse } from "next/server";
import { registerCustomer } from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const customer = await registerCustomer({
      firstName,
      lastName,
      email,
      password,
    });

    return NextResponse.json({ customer });
  } catch (error) {
    return apiErrorResponse(error, "Registration failed");
  }
}
