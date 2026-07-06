import { NextResponse } from "next/server";
import {
  resolveCustomerAccountCallbackUrl,
  resolveRequestBaseUrl,
} from "@/lib/auth/customer-account-oauth";

/** Safe production check — confirms Vercel picked up auth env vars (no secrets exposed). */
export async function GET(request: Request) {
  const clientId =
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?.trim() ||
    process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?.trim();

  const callbackUrl = resolveCustomerAccountCallbackUrl(request);
  const siteOrigin = resolveRequestBaseUrl(request);

  return NextResponse.json({
    clientIdSet: Boolean(clientId),
    clientIdPreview: clientId ? `${clientId.slice(0, 8)}…` : null,
    clientIdLooksValid: clientId ? !/^\d+$/.test(clientId) : false,
    callbackUrl,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    shopifySetup: {
      callbackUrlPaste: callbackUrl,
      javascriptOriginPaste: siteOrigin,
      note:
        "Add these EXACT values in Shopify Admin → Headless → Customer Account API → Application setup (below Credentials). No trailing slash.",
    },
  });
}
