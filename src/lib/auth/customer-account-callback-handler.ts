import { NextResponse } from "next/server";
import {
  absoluteRedirect,
  exchangeAuthorizationCode,
  tokenExpiresAt,
} from "@/lib/auth/customer-account-oauth";
import {
  consumeOAuthSession,
  setCustomerToken,
} from "@/lib/auth/session";
import { getCustomerAccountProfile } from "@/lib/shopify/customer-account";
import { getPathStorefront, getStorefrontPath, safeRedirectPath } from "@/lib/storefront/product-routing";
import { getRequestStorefront } from "@/lib/storefront/server";

export async function handleCustomerAccountCallback(
  request: Request,
): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  // Read before any early return so a failed sign-in still lands on the storefront it started from.
  const oauthSession = await consumeOAuthSession();
  const redirectTo = safeRedirectPath(
    oauthSession?.redirectTo,
    getStorefrontPath(await getRequestStorefront(), "/account"),
  );
  const loginPath = getStorefrontPath(getPathStorefront(redirectTo), "/login");
  const loginError = (error: string) =>
    NextResponse.redirect(absoluteRedirect(request, loginPath, { error, redirect: redirectTo }));

  if (oauthError) {
    return loginError(searchParams.get("error_description") ?? "Google sign-in was cancelled.");
  }

  if (!code || !state) {
    return loginError("Missing authentication response from Shopify.");
  }

  if (!oauthSession || oauthSession.state !== state) {
    return loginError("Your sign-in session expired. Please try again.");
  }

  try {
    const tokenData = await exchangeAuthorizationCode({
      code,
      codeVerifier: oauthSession.verifier,
      redirectUri: oauthSession.callbackUri,
    });

    const profile = await getCustomerAccountProfile(tokenData.access_token);
    if (!profile) {
      throw new Error("Signed in successfully, but we could not load your account.");
    }

    await setCustomerToken(
      tokenData.access_token,
      tokenExpiresAt(tokenData.expires_in),
      "customer_account",
    );

    return NextResponse.redirect(absoluteRedirect(request, redirectTo));
  } catch (error) {
    console.error("Shopify auth callback failed:", error);
    return loginError(
      error instanceof Error ? error.message : "Google sign-in failed. Please try again.",
    );
  }
}
