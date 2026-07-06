"use client";

import { useState } from "react";

const TRUNCATE_LENGTH = 200;

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = description.trim();
  const needsTruncate = trimmed.length > TRUNCATE_LENGTH;

  if (!trimmed) return null;

  const displayText =
    expanded || !needsTruncate
      ? trimmed
      : trimmed.slice(0, TRUNCATE_LENGTH).trimEnd();

  return (
    <div className="mt-3 sm:mt-4">
      <p className="text-sm leading-relaxed text-kobbo-muted sm:text-base">
        {displayText}
        {!expanded && needsTruncate ? "…" : ""}
      </p>
      {needsTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm font-semibold text-kobbo-black underline decoration-kobbo-yellow decoration-2 underline-offset-4 transition-colors hover:text-kobbo-muted"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}
