"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatPrice } from "@/lib/shopify/types";
import {
  formatOrderDate,
  formatOrderStatus,
  getOrderStatusStyle,
} from "@/data/account";
import type { CustomerOrder } from "@/lib/shopify/customer-types";

interface OrderCardProps {
  order: CustomerOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const itemCount = order.lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <div className="rounded-2xl bg-kobbo-white p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading font-bold text-kobbo-black">
            Order #{order.orderNumber}
          </p>
          <p className="mt-0.5 text-sm text-kobbo-muted">
            {formatOrderDate(order.processedAt)} · {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusStyle(order.fulfillmentStatus)}`}
          >
            {formatOrderStatus(order.fulfillmentStatus)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusStyle(order.financialStatus)}`}
          >
            {formatOrderStatus(order.financialStatus)}
          </span>
          <span className="font-bold text-kobbo-black">
            {formatPrice(order.totalPrice, order.currencyCode)}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 rounded-full border-2 border-kobbo-beige px-4 py-2 text-xs font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow"
          >
            {expanded ? (
              <>
                Hide Details <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                View Details <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-kobbo-beige pt-4">
          <ul className="space-y-3">
            {order.lineItems.map((item, index) => (
              <li
                key={`${order.id}-${index}`}
                className="flex items-center gap-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-kobbo-beige">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  {item.productHandle ? (
                    <Link
                      href={`/products/${item.productHandle}`}
                      className="font-medium text-kobbo-black hover:underline"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <p className="font-medium text-kobbo-black">{item.title}</p>
                  )}
                  <p className="text-sm text-kobbo-muted">Qty: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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
