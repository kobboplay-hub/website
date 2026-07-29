import { CustomerApiError } from "./customer-errors";

interface CachedAdminToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: CachedAdminToken | null = null;

function getShopDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  if (!domain) {
    throw new CustomerApiError(
      "Newsletter signup is temporarily unavailable. Please try again later.",
    );
  }
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * Resolves an Admin API access token.
 *
 * Preferred (Shopify Dev Dashboard 2026+):
 *   SHOPIFY_ADMIN_CLIENT_ID + SHOPIFY_ADMIN_CLIENT_SECRET
 *   → client_credentials grant (token auto-refreshed every ~24h)
 *
 * Optional fallback (legacy permanent token):
 *   SHOPIFY_ADMIN_API_TOKEN
 */
export async function getAdminAccessToken(): Promise<string> {
  const staticToken = process.env.SHOPIFY_ADMIN_API_TOKEN?.trim();
  if (staticToken) return staticToken;

  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new CustomerApiError(
      "Newsletter signup is temporarily unavailable. Please try again later.",
    );
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  const domain = getShopDomain();
  const response = await fetch(
    `https://${domain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      // ignore
    }
    console.error("Shopify Admin token exchange failed:", response.status, detail);
    throw new CustomerApiError(
      "Newsletter signup is temporarily unavailable. Please try again later.",
    );
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!data.access_token) {
    throw new CustomerApiError(
      "Newsletter signup is temporarily unavailable. Please try again later.",
    );
  }

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 86399) * 1000,
  };

  return cachedToken.accessToken;
}

export function getAdminShopDomain(): string {
  return getShopDomain();
}
