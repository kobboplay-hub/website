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

function safeRedirectPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }
  return value;
}

export async function handleCustomerAccountCallback(
  request: Request,
): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    const description =
      searchParams.get("error_description") ?? "Google sign-in was cancelled.";
    return NextResponse.redirect(
      absoluteRedirect(request, "/login", { error: description }),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      absoluteRedirect(request, "/login", {
        error: "Missing authentication response from Shopify.",
      }),
    );
  }

  const oauthSession = await consumeOAuthSession();
  if (!oauthSession || oauthSession.state !== state) {
    return NextResponse.redirect(
      absoluteRedirect(request, "/login", {
        error: "Your sign-in session expired. Please try again.",
      }),
    );
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

    return NextResponse.redirect(
      absoluteRedirect(request, safeRedirectPath(oauthSession.redirectTo)),
    );
  } catch (error) {
    console.error("Shopify auth callback failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Google sign-in failed. Please try again.";
    return NextResponse.redirect(
      absoluteRedirect(request, "/login", { error: message }),
    );
  }
}
