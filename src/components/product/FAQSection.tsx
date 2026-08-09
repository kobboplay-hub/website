"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ProductFAQ } from "@/data/faqs";

interface FAQSectionProps {
  faqs: ProductFAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section className="bg-kobbo-cream py-8 sm:py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-center text-2xl font-extrabold text-kobbo-black sm:text-3xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-6 overflow-hidden rounded-2xl border border-kobbo-beige bg-kobbo-white sm:mt-8">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `product-faq-panel-${index}`;
            const buttonId = `product-faq-button-${index}`;

            return (
              <div
                key={`${index}-${faq.question}`}
                className={
                  index > 0 ? "border-t border-kobbo-beige" : undefined
                }
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-kobbo-cream/60 sm:gap-4 sm:px-5 sm:py-5"
                >
                  <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-kobbo-black sm:text-base">
                    {faq.question}
                  </span>
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-kobbo-beige text-kobbo-black"
                    aria-hidden
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    )}
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-4 pb-4 text-sm leading-relaxed text-kobbo-muted sm:px-5 sm:pb-5">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
