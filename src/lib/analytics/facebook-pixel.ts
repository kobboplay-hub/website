export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1742549074543778";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Fires the standard PageView event.
 */
export function pageview() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

/**
 * Fires custom or standard Meta Pixel events.
 * @param name Event name (e.g. 'Purchase', 'AddToCart', 'InitiateCheckout', 'ViewContent')
 * @param options Event properties (value, currency, content_name, etc.)
 * @param eventParams Optional event configuration (e.g. { eventID } for CAPI deduplication)
 */
export function trackEvent(
  name: string,
  options: Record<string, unknown> = {},
  eventParams?: Record<string, unknown>,
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (eventParams) {
      window.fbq("track", name, options, eventParams);
    } else {
      window.fbq("track", name, options);
    }
  }
}
