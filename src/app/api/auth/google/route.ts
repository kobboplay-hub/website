import { NextResponse } from "next/server";
import {
  absoluteRedirect,
  buildShopifyHostedLoginUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  generateOAuthState,
  getCustomerAccountCallbackUrl,
} from "@/lib/auth/customer-account-oauth";
import { setOAuthSession } from "@/lib/auth/session";

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }
  return value;
}

export async function GET(request: Request) {
  const requestOrigin = new URL(request.url).origin;

  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = safeRedirectPath(searchParams.get("redirect"));

    const state = generateOAuthState();
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);

    await setOAuthSession({
      state,
      verifier,
      redirectTo,
    });

    const loginUrl = buildShopifyHostedLoginUrl({
      state,
      codeChallenge: challenge,
      redirectUri: getCustomerAccountCallbackUrl(requestOrigin),
    });

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Google sign-in redirect failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Google sign-in is unavailable right now.";
    return NextResponse.redirect(
      absoluteRedirect(request, "/login", { error: message }),
    );
  }
}
