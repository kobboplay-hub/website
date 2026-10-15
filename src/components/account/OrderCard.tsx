"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify/types";
import { parseShopifyProductId } from "@/lib/judgeme";
import { formatOrderDate } from "@/data/account";
import OrderStatusPanel from "@/components/account/OrderStatusPanel";
import OrderLineItemReview from "@/components/account/OrderLineItemReview";
import type { LucideIcon } from "lucide-react";
import type { CustomerOrder } from "@/lib/shopify/customer-types";

interface OrderCardProps {
  order: CustomerOrder;
  reviewedProductIds: Record<string, boolean>;
  onReviewSubmitted: (productId: string) => void;
}

export default function OrderCard({
  order,
  reviewedProductIds,
  onReviewSubmitted,
}: OrderCardProps) {
  const itemCount = order.lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <article className="overflow-hidden rounded-2xl bg-kobbo-white shadow-soft">
      <div className="border-b border-kobbo-beige px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-heading text-lg font-extrabold text-kobbo-black">
              Order #{order.orderNumber}
            </p>
            <p className="mt-0.5 text-sm text-kobbo-muted">
              Placed on {formatOrderDate(order.processedAt)} · {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <p className="font-heading text-lg font-extrabold text-kobbo-black sm:text-right">
            {formatPrice(order.totalPrice, order.currencyCode)}
          </p>
        </div>
      </div>

      <div className="border-b border-kobbo-beige bg-kobbo-white px-4 py-4 sm:px-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-kobbo-muted">
          Order status
        </p>
        <OrderStatusPanel
          financialStatus={order.financialStatus}
          fulfillmentStatus={order.fulfillmentStatus}
        />
      </div>

      <div className="px-4 py-4 sm:px-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-kobbo-muted">
          Items in this order
        </p>
        <ul className="space-y-4">
          {order.lineItems.map((item, index) => {
            const productKey = item.productId
              ? parseShopifyProductId(item.productId)
              : null;
            const alreadyReviewed = productKey
              ? (reviewedProductIds[productKey] ?? false)
              : false;
            const canShowReview =
              Boolean(item.productHandle && item.productId);

            return (
              <li
                key={`${order.id}-${index}`}
                className="flex flex-col gap-3 rounded-2xl border border-kobbo-beige bg-kobbo-cream/40 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-kobbo-white sm:h-[72px] sm:w-[72px]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="72px"
                        className="object-contain p-1"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.productHandle ? (
                      <Link
                        href={`/products/${item.productHandle}`}
                        className="line-clamp-2 font-medium text-kobbo-black hover:underline"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <p className="line-clamp-2 font-medium text-kobbo-black">
                        {item.title}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-kobbo-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                {canShowReview && (
                  <div className="flex shrink-0 sm:justify-end">
                    <OrderLineItemReview
                      order={order}
                      productId={item.productId!}
                      productHandle={item.productHandle!}
                      productTitle={item.title}
                      alreadyReviewed={alreadyReviewed}
                      onReviewSubmitted={() =>
                        onReviewSubmitted(item.productId!)
                      }
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  href: string;
  linkLabel?: string;
  icon?: LucideIcon;
}

export function SummaryCard({
  title,
  value,
  href,
  linkLabel = "View",
  icon: Icon,
}: SummaryCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-2xl border border-kobbo-beige/70 bg-kobbo-white p-3 shadow-soft transition-all hover:border-kobbo-yellow hover:shadow-soft-lg active:scale-[0.98] sm:p-5"
    >
      <div className="flex items-center justify-between gap-1">
        {Icon ? (
          <span className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-kobbo-yellow/20 text-kobbo-black transition-colors group-hover:bg-kobbo-yellow">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
          </span>
        ) : <span />}
        <span className="flex items-center gap-0.5 text-[10px] font-bold text-kobbo-muted transition-colors group-hover:text-kobbo-black sm:text-xs">
          <span>{linkLabel}</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
      <div className="mt-2.5 sm:mt-3">
        <p className="font-heading text-lg font-extrabold text-kobbo-black sm:text-2xl lg:text-3xl">
          {value}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-kobbo-muted sm:text-sm">
          {title}
        </p>
      </div>
    </Link>
  );
}
