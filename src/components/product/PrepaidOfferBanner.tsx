import { Gift, Sparkles } from "lucide-react";

interface PrepaidOfferBannerProps {
  variant: "top" | "bottom" | "sticky";
  className?: string;
}

export default function PrepaidOfferBanner({
  variant,
  className = "",
}: PrepaidOfferBannerProps) {
  if (variant === "top") {
    return (
      <div
        className={`relative mt-3.5 overflow-hidden rounded-2xl border-2 border-amber-300/85 bg-gradient-to-br from-[#FFF9E6] via-[#FFF3D0] to-[#FFEBB5] p-3 shadow-xs transition-all sm:p-3.5 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-kobbo-yellow text-kobbo-black shadow-xs ring-2 ring-amber-300/50">
            <Gift className="size-5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-md bg-kobbo-black px-1.5 py-0.5 font-heading text-[10px] font-black uppercase tracking-wider text-kobbo-yellow">
                SPECIAL OFFER
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900">
                <Sparkles className="size-3 text-amber-600" />
                Prepaid Savings
              </span>
            </div>
            <p className="font-heading mt-0.5 text-sm font-extrabold leading-snug text-kobbo-black sm:text-base">
              ₹150 OFF on Prepaid Orders + A FREE GIFT 🎁
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-kobbo-black/75 sm:text-xs">
              Automatic discount on UPI &amp; Cards • Free surprise developmental gift inside
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "bottom") {
    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border-2 border-amber-300/90 bg-gradient-to-r from-[#FFF6D8] via-[#FFEDB8] to-[#FFF6D8] px-4 py-3 text-center shadow-soft transition-all hover:border-amber-400 sm:py-3.5 ${className}`}
      >
        <div className="flex items-center justify-center gap-2">
          <span
            className="text-xl transition-transform duration-300 group-hover:scale-110 sm:text-2xl"
            role="img"
            aria-label="Gift"
          >
            🎁
          </span>
          <p className="font-heading text-base font-extrabold leading-snug tracking-tight text-kobbo-black sm:text-lg">
            ₹150 OFF on Prepaid Orders + A FREE GIFT
          </p>
          <span
            className="text-xl transition-transform duration-300 group-hover:scale-110 sm:text-2xl"
            role="img"
            aria-label="Gift"
          >
            🎁
          </span>
        </div>
        <p className="mt-1 text-[11px] font-semibold text-kobbo-black/75 sm:text-xs">
          Automatic ₹150 discount at checkout • No promo code needed
        </p>
      </div>
    );
  }

  if (variant === "sticky") {
    return (
      <div
        className={`flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 px-3 py-1 text-center font-heading text-[11px] font-extrabold text-kobbo-black ${className}`}
      >
        <span>⚡ ₹150 OFF on Prepaid Orders + A FREE GIFT 🎁</span>
      </div>
    );
  }

  return null;
}
