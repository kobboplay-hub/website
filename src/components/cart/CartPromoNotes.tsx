import { Clock, Sparkles } from "lucide-react";
import {
  ESTIMATED_DELIVERY_LABEL,
  ONLINE_PAYMENT_OFFER,
} from "@/data/checkout-display";

interface CartPromoNotesProps {
  showDelivery?: boolean;
  showPaymentOffer?: boolean;
  compact?: boolean;
}

export default function CartPromoNotes({
  showDelivery = true,
  showPaymentOffer = true,
  compact = false,
}: CartPromoNotesProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-2.5"}>
      {showDelivery && (
        <p
          className={`flex items-center gap-1.5 text-kobbo-muted ${
            compact ? "text-[11px]" : "text-xs"
          }`}
        >
          <Clock className="h-3.5 w-3.5 shrink-0 text-kobbo-black/60" />
          {ESTIMATED_DELIVERY_LABEL}
        </p>
      )}
      {showPaymentOffer && (
        <p
          className={`inline-flex items-center gap-1.5 rounded-full bg-kobbo-yellow/15 px-2.5 py-1 font-medium text-kobbo-black ${
            compact ? "text-[10px]" : "text-[11px]"
          }`}
        >
          <Sparkles className="h-3 w-3 shrink-0 text-kobbo-yellow" />
          {ONLINE_PAYMENT_OFFER}
        </p>
      )}
    </div>
  );
}
