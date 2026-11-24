"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/facebook-pixel";

interface PurchaseTrackerProps {
  orderNumber: string | null;
  totalPaise: number | null;
  paymentMethod: string | null;
}

export default function PurchaseTracker({
  orderNumber,
  totalPaise,
  paymentMethod,
}: PurchaseTrackerProps) {
  useEffect(() => {
    if (!orderNumber) return;

    // Prevent double counting if the customer refreshes the confirmation page
    const storageKey = `kobbo_fb_tracked_${orderNumber}`;
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem(storageKey)) return;
      } catch {
        // Ignore storage exceptions
      }
    }

    const valueInRupees = totalPaise !== null && totalPaise > 0 ? totalPaise / 100 : undefined;

    const eventData: Record<string, unknown> = {
      currency: "INR",
      content_type: "product",
      order_id: orderNumber,
      payment_method: paymentMethod ?? "online",
    };

    if (valueInRupees !== undefined) {
      eventData.value = valueInRupees;
    }

    trackEvent("Purchase", eventData, {
      eventID: `order_${orderNumber}`, // Deduplication key with CAPI
    });

    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {
      // Ignore storage exceptions
    }
  }, [orderNumber, totalPaise, paymentMethod]);

  return null;
}
