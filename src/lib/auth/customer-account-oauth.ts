import { createHash, randomBytes } from "crypto";

export interface OpenIdConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in?: number;
  id_token?: string;
  token_type?: string;
}

const LOCALHOST_PATTERN = /localhost|127\.0\.0\.1/i;

/**
 * Resolves the public site URL for OAuth callbacks.
 * On Vercel/production, uses the actual request host — not a stale localhost env.
 */
export function resolveRequestBaseUrl(request: Request): string {
  const explicitCallback = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL?.trim();
  if (explicitCallback) {
    return explicitCallback
      .replace(/\/api\/auth\/callback\/?$/, "")
      .replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost.split(",")[0].trim()}`.replace(
      /\/$/,
      "",
    );
  }

  const requestOrigin = new URL(request.url).origin.replace(/\/$/, "");
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (configured && !LOCALHOST_PATTERN.test(configured)) {
    return configured;
  }

  if (requestOrigin && !LOCALHOST_PATTERN.test(requestOrigin)) {
    return requestOrigin;
  }

  if (configured) return configured;
  return requestOrigin || "http://localhost:3000";
}

export function getSiteBaseUrl(fallbackOrigin?: string): string {
  const explicitCallback = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL?.trim();
  if (explicitCallback) {
    return explicitCallback
      .replace(/\/api\/auth\/callback\/?$/, "")
      .replace(/\/$/, "");
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured && !LOCALHOST_PATTERN.test(configured)) {
    return configured;
  }

  if (fallbackOrigin && !LOCALHOST_PATTERN.test(fallbackOrigin)) {
    return fallbackOrigin.replace(/\/$/, "");
  }

  if (configured) return configured;
  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function getCustomerAccountCallbackUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, "")}/api/auth/callback`;
}

export function resolveCustomerAccountCallbackUrl(request: Request): string {
  return getCustomerAccountCallbackUrl(resolveRequestBaseUrl(request));
}

export function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function generateOAuthState(): string {
  return randomBytes(16).toString("base64url");
}

function getClientId(): string {
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
  if (!clientId) {
    throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID is not configured.");
  }
  return clientId;
}

function getShopDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error("SHOPIFY_STORE_DOMAIN is not configured.");
  }
  return domain;
}

/**
 * Shopify hosted Customer Account login (Google / email on Shopify UI).
 */
export function buildShopifyHostedLoginUrl(options: {
  state: string;
  codeChallenge: string;
  redirectUri: string;
}): string {
  const clientId = getClientId();
  const loginUrl = new URL(
    `https://shopify.com/authentication/${clientId}/login`,
  );

  loginUrl.searchParams.set("client_id", clientId);
  loginUrl.searchParams.set("response_type", "code");
  loginUrl.searchParams.set("redirect_uri", options.redirectUri);
  loginUrl.searchParams.set("scope", "openid email customer-account-api:full");
  loginUrl.searchParams.set("state", options.state);
  loginUrl.searchParams.set("code_challenge", options.codeChallenge);
  loginUrl.searchParams.set("code_challenge_method", "S256");
  loginUrl.searchParams.set("region_country", "IN");

  return loginUrl.toString();
}

export function absoluteRedirect(
  request: Request,
  pathname: string,
  searchParams?: Record<string, string>,
): URL {
  const baseUrl = resolveRequestBaseUrl(request);
  const url = new URL(pathname, baseUrl);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

export async function fetchOpenIdConfiguration(): Promise<OpenIdConfiguration> {
  const response = await fetch(
    `https://${getShopDomain()}/.well-known/openid-configuration`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to load Shopify authentication configuration.");
  }

  return response.json() as Promise<OpenIdConfiguration>;
}

export async function exchangeAuthorizationCode(options: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<TokenResponse> {
  const openIdConfig = await fetchOpenIdConfiguration();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: getClientId(),
    redirect_uri: options.redirectUri,
    code: options.code,
    code_verifier: options.codeVerifier,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const clientSecret = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET;
  if (clientSecret) {
    const credentials = Buffer.from(`${getClientId()}:${clientSecret}`).toString(
      "base64",
    );
    headers.Authorization = `Basic ${credentials}`;
  }

  const response = await fetch(openIdConfig.token_endpoint, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Shopify token exchange failed: ${response.status} ${errorText}`,
    );
  }

  return response.json() as Promise<TokenResponse>;
}

export function tokenExpiresAt(expiresIn?: number): string {
  if (!expiresIn || expiresIn <= 0) {
    return new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString();
  }
  return new Date(Date.now() + expiresIn * 1000).toISOString();
}
