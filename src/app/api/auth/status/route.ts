import { NextResponse } from "next/server";
import { resolveCustomerAccountCallbackUrl } from "@/lib/auth/customer-account-oauth";

/** Safe production check — confirms Vercel picked up auth env vars (no secrets exposed). */
export async function GET(request: Request) {
  const clientId =
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?.trim() ||
    process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?.trim();

  return NextResponse.json({
    clientIdSet: Boolean(clientId),
    clientIdPreview: clientId ? `${clientId.slice(0, 8)}…` : null,
    clientIdLooksValid: clientId ? !/^\d+$/.test(clientId) : false,
    callbackUrl: resolveCustomerAccountCallbackUrl(request),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  });
}
