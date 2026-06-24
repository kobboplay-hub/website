"use client";

import { useState } from "react";

interface ProductTabsContent {
  descriptionHtml: string;
  features: string[];
  specifications: { label: string; value: string }[];
  careInstructions: string[];
}

type TabId = "description" | "features" | "specifications" | "care";

const tabs: { id: TabId; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "features", label: "Features" },
  { id: "specifications", label: "Specifications" },
  { id: "care", label: "Care Instructions" },
];

interface ProductTabsProps {
  content: ProductTabsContent;
}

export default function ProductTabs({ content }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  return (
    <section className="bg-kobbo-cream py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-kobbo-white shadow-soft">
          <div className="flex overflow-x-auto border-b border-kobbo-beige">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-5 py-4 text-sm font-semibold transition-colors sm:px-8 ${
                  activeTab === tab.id
                    ? "border-b-2 border-kobbo-yellow text-kobbo-black"
                    : "text-kobbo-muted hover:text-kobbo-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "description" && (
              <div
                className="prose-sm max-w-none text-sm leading-relaxed text-kobbo-muted sm:text-base [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: content.descriptionHtml }}
              />
            )}

            {activeTab === "features" && (
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {content.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 rounded-xl bg-kobbo-cream px-4 py-3 text-sm text-kobbo-black"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-kobbo-yellow" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "specifications" && (
              <dl className="divide-y divide-kobbo-beige">
                {content.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <dt className="font-semibold text-kobbo-black">
                      {spec.label}
                    </dt>
                    <dd className="text-right text-kobbo-muted">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {activeTab === "care" && (
              <ul className="space-y-3">
                {content.careInstructions.map((instruction) => (
                  <li
                    key={instruction}
                    className="flex items-start gap-2.5 text-sm text-kobbo-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-kobbo-yellow" />
                    {instruction}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
