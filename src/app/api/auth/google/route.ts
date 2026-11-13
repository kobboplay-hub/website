import { NextResponse } from "next/server";
import {
  absoluteRedirect,
  buildShopifyHostedLoginUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  generateOAuthState,
  resolveCustomerAccountCallbackUrl,
} from "@/lib/auth/customer-account-oauth";
import { setOAuthSession, clearCustomerToken } from "@/lib/auth/session";
import { getPathStorefront, getStorefrontPath, safeRedirectPath } from "@/lib/storefront/product-routing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = safeRedirectPath(searchParams.get("redirect"));
  const loginPath = getStorefrontPath(getPathStorefront(redirectTo), "/login");

  try {
    const callbackUri = resolveCustomerAccountCallbackUrl(request);

    // Clear any existing Kobbo session so login/sign-up always starts fresh
    await clearCustomerToken();

    const state = generateOAuthState();
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);

    await setOAuthSession({
      state,
      verifier,
      redirectTo,
      callbackUri,
    });

    const loginUrl = await buildShopifyHostedLoginUrl({
      state,
      codeChallenge: challenge,
      redirectUri: callbackUri,
    });

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Google sign-in redirect failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Google sign-in is unavailable right now.";
    return NextResponse.redirect(
      absoluteRedirect(request, loginPath, { error: message, redirect: redirectTo }),
    );
  }
}
