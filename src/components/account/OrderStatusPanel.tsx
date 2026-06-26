import { CheckCircle2, Clock, CreditCard, Package, XCircle } from "lucide-react";
import {
  getDeliveryStatusDetail,
  getPaymentStatusDetail,
} from "@/lib/order-status";

interface OrderStatusPanelProps {
  financialStatus: string;
  fulfillmentStatus: string;
}

function StatusIcon({
  detail,
}: {
  detail: ReturnType<typeof getPaymentStatusDetail>;
}) {
  if (detail.isIssue) {
    return <XCircle className="h-4 w-4 text-red-500" />;
  }
  if (detail.isComplete) {
    return <CheckCircle2 className="h-4 w-4 text-kobbo-green" />;
  }
  return <Clock className="h-4 w-4 text-kobbo-black" />;
}

function StatusBlock({
  icon: Icon,
  detail,
}: {
  icon: typeof CreditCard;
  detail: ReturnType<typeof getPaymentStatusDetail>;
}) {
  return (
    <div className="rounded-2xl bg-kobbo-cream/80 p-3.5 sm:p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            detail.isComplete
              ? "bg-kobbo-green/15"
              : detail.isIssue
                ? "bg-red-100"
                : "bg-kobbo-yellow/30"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              detail.isComplete
                ? "text-kobbo-green"
                : detail.isIssue
                  ? "text-red-500"
                  : "text-kobbo-black"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-kobbo-muted">
              {detail.label}
            </p>
            <StatusIcon detail={detail} />
          </div>
          <p className="mt-0.5 font-heading text-sm font-bold text-kobbo-black">
            {detail.value}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-kobbo-muted">
            {detail.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderStatusPanel({
  financialStatus,
  fulfillmentStatus,
}: OrderStatusPanelProps) {
  const payment = getPaymentStatusDetail(financialStatus);
  const delivery = getDeliveryStatusDetail(fulfillmentStatus);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <StatusBlock icon={CreditCard} detail={payment} />
      <StatusBlock icon={Package} detail={delivery} />
    </div>
  );
}
