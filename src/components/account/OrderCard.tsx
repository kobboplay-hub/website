"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify/types";
import { parseShopifyProductId } from "@/lib/judgeme";
import { formatOrderDate } from "@/data/account";
import OrderStatusPanel from "@/components/account/OrderStatusPanel";
import OrderLineItemReview from "@/components/account/OrderLineItemReview";
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
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-kobbo-beige sm:h-[72px] sm:w-[72px]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="72px"
                        className="object-cover"
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
  linkLabel: string;
}

export function SummaryCard({ title, value, href, linkLabel }: SummaryCardProps) {
  return (
    <div className="rounded-2xl bg-kobbo-white p-5 shadow-soft">
      <p className="text-sm text-kobbo-muted">{title}</p>
      <p className="font-heading mt-1 text-2xl font-extrabold text-kobbo-black">
        {value}
      </p>
      <Link
        href={href}
        className="mt-3 inline-block text-sm font-semibold text-kobbo-black hover:underline"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}
