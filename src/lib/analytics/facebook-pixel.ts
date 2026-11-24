export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1742549074543778";

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: unknown;
  }
}

/**
 * Ensures the fbq stub and queue exist on window even if the script has not fully downloaded yet.
 * When fbevents.js finishes loading, it processes all queued events in order.
 */
function ensureFbq(): FbqFunction | null {
  if (typeof window === "undefined") return null;

  if (!window.fbq) {
    const queueStub: FbqFunction = function (...args: unknown[]) {
      if (queueStub.callMethod) {
        queueStub.callMethod(...args);
      } else {
        queueStub.queue?.push(args);
      }
    };
    queueStub.push = queueStub;
    queueStub.loaded = true;
    queueStub.version = "2.0";
    queueStub.queue = [];
    window.fbq = queueStub;
    window._fbq = queueStub;
  }

  return window.fbq;
}

/**
 * Fires the standard PageView event.
 */
export function pageview() {
  const fbq = ensureFbq();
  if (fbq) {
    fbq("track", "PageView");
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
  const fbq = ensureFbq();
  if (!fbq) return;

  try {
    if (eventParams) {
      fbq("track", name, options, eventParams);
    } else {
      fbq("track", name, options);
    }
  } catch (err) {
    console.warn("[Meta Pixel] Event tracking failed:", name, err);
  }
}
