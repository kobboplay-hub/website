import { cookies } from "next/headers";

export const CUSTOMER_TOKEN_COOKIE = "kobbo_customer_token";
export const CUSTOMER_AUTH_PROVIDER_COOKIE = "kobbo_customer_auth_provider";
export const OAUTH_STATE_COOKIE = "kobbo_oauth_state";
export const OAUTH_VERIFIER_COOKIE = "kobbo_oauth_verifier";
export const OAUTH_REDIRECT_COOKIE = "kobbo_oauth_redirect";

export type CustomerAuthProvider = "storefront" | "customer_account";

export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

export async function getCustomerAuthProvider(): Promise<CustomerAuthProvider> {
  const cookieStore = await cookies();
  const provider = cookieStore.get(CUSTOMER_AUTH_PROVIDER_COOKIE)?.value;
  return provider === "customer_account" ? "customer_account" : "storefront";
}

export async function setCustomerToken(
  accessToken: string,
  expiresAt: string,
  provider: CustomerAuthProvider = "storefront",
): Promise<void> {
  const cookieStore = await cookies();
  const expiresDate = new Date(expiresAt);
  const maxAge = Math.max(
    0,
    Math.floor((expiresDate.getTime() - Date.now()) / 1000),
  );

  cookieStore.set(CUSTOMER_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24 * 14,
  });

  cookieStore.set(CUSTOMER_AUTH_PROVIDER_COOKIE, provider, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24 * 14,
  });
}

export async function clearCustomerToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
  cookieStore.delete(CUSTOMER_AUTH_PROVIDER_COOKIE);
}

export async function setOAuthSession(values: {
  state: string;
  verifier: string;
  redirectTo: string;
}): Promise<void> {
  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
  };

  cookieStore.set(OAUTH_STATE_COOKIE, values.state, options);
  cookieStore.set(OAUTH_VERIFIER_COOKIE, values.verifier, options);
  cookieStore.set(OAUTH_REDIRECT_COOKIE, values.redirectTo, options);
}

export async function consumeOAuthSession(): Promise<{
  state: string;
  verifier: string;
  redirectTo: string;
} | null> {
  const cookieStore = await cookies();
  const state = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  const verifier = cookieStore.get(OAUTH_VERIFIER_COOKIE)?.value;
  const redirectTo = cookieStore.get(OAUTH_REDIRECT_COOKIE)?.value ?? "/account";

  cookieStore.delete(OAUTH_STATE_COOKIE);
  cookieStore.delete(OAUTH_VERIFIER_COOKIE);
  cookieStore.delete(OAUTH_REDIRECT_COOKIE);

  if (!state || !verifier) return null;

  return { state, verifier, redirectTo };
}

export async function requireCustomerToken(): Promise<string> {
  const token = await getCustomerToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  return token;
}
