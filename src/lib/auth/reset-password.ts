export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

export function getPasswordResetEmailLink(): string {
  const siteUrl = getSiteUrl();
  return `${siteUrl}/reset-password?reset_url={{ customer.reset_password_url | url_encode }}`;
}

export function parseShopifyResetUrl(
  rawUrl: string,
): { resetUrl: string; customerId?: string; resetToken?: string } | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const resetUrl = url.toString();

    const legacyMatch = url.pathname.match(
      /\/account\/reset\/([^/]+)\/([^/]+)/,
    );
    if (legacyMatch) {
      return {
        resetUrl,
        customerId: legacyMatch[1],
        resetToken: legacyMatch[2],
      };
    }

    return { resetUrl };
  } catch {
    return null;
  }
}
