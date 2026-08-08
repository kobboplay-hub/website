import { Sparkles } from "lucide-react";
import { ONLINE_PAYMENT_OFFER } from "@/data/checkout-display";

interface CartPromoNotesProps {
  showPaymentOffer?: boolean;
  compact?: boolean;
}

export default function CartPromoNotes({
  showPaymentOffer = true,
  compact = false,
}: CartPromoNotesProps) {
  if (!showPaymentOffer) return null;

  return (
    <div className={compact ? "space-y-2" : "space-y-2.5"}>
      <p
        className={`inline-flex items-center gap-1.5 rounded-full bg-kobbo-yellow/15 px-2.5 py-1 font-medium text-kobbo-black ${
          compact ? "text-[10px]" : "text-[11px]"
        }`}
      >
        <Sparkles className="h-3 w-3 shrink-0 text-kobbo-yellow" />
        {ONLINE_PAYMENT_OFFER}
      </p>
    </div>
  );
}
