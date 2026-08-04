"""Generate src/data/policies.ts from .tmp-policies.json + keep FAQs/contact."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Master\Desktop\shopify")
DATA = ROOT / ".tmp-policies.json"
OUT = ROOT / "src" / "data" / "policies.ts"

META = {
    "shipping": {
        "export": "shippingPolicyContent",
        "title": "Shipping Policy",
        "description": "How Kobbo packs and delivers orders across India — free shipping, timelines, and tracking.",
    },
    "cancellation": {
        "export": "cancellationPolicyContent",
        "title": "Cancellation Policy",
        "description": "When you can cancel a Kobbo order, and when cancellations are handled by us.",
    },
    "return": {
        "export": "returnPolicyContent",
        "title": "Return, Refund & Replacement Policy",
        "description": "7-day easy returns, free replacements for eligible issues, and how refunds work.",
    },
    "privacy": {
        "export": "privacyPolicyContent",
        "title": "Privacy Policy",
        "description": "How Kobbo (Unisphere) collects, uses, and protects your personal information.",
    },
    "terms": {
        "export": "termsPolicyContent",
        "title": "Terms & Conditions",
        "description": "Terms governing your use of www.kobbo.in and purchases from Kobbo.",
    },
}


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def block_ts(block: dict) -> str:
    return (
        f'          {{ type: "{block["type"]}", text: "{esc(block["text"])}" }}'
    )


def section_ts(sec: dict) -> str:
    blocks = ",\n".join(block_ts(b) for b in sec["blocks"])
    return (
        f'    {{\n'
        f'      title: "{esc(sec["title"])}",\n'
        f'      blocks: [\n{blocks}\n'
        f'      ],\n'
        f'    }}'
    )


def page_ts(key: str, data: dict) -> str:
    meta = META[key]
    last = data.get("lastUpdated")
    intro = data.get("intro")
    sections = ",\n".join(section_ts(s) for s in data["sections"])
    lines = [
        f"export const {meta['export']}: PolicyPageContent = {{",
        f'  title: "{esc(meta["title"])}",',
        f'  description: "{esc(meta["description"])}",',
    ]
    if last:
        lines.append(f'  lastUpdated: "{esc(last)}",')
    if intro:
        lines.append(f'  intro: "{esc(intro)}",')
    lines.append(f"  sections: [\n{sections}\n  ],")
    lines.append("};")
    return "\n".join(lines)


HEADER = '''/**
 * Policy & FAQ page content — sourced from Kobbo legal PDFs (updated 04-08-2026).
 */

export type PolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullet"; text: string }
  | { type: "subtitle"; text: string };

export interface PolicySection {
  title: string;
  /** @deprecated Prefer blocks; kept for simple FAQ/contact pages */
  paragraphs?: string[];
  bullets?: string[];
  blocks?: PolicyBlock[];
}

export interface PolicyPageContent {
  title: string;
  description: string;
  lastUpdated?: string;
  intro?: string;
  sections: PolicySection[];
}

export const faqsPageContent: PolicyPageContent = {
  title: "Frequently Asked Questions",
  description: "Quick answers about shopping, delivery and returns at Kobbo.",
  sections: [
    {
      title: "What age group are Kobbo toys suitable for?",
      blocks: [
        {
          type: "paragraph",
          text: "Each product page lists recommended age ranges. Always supervise younger children during play.",
        },
      ],
    },
    {
      title: "How long does delivery take?",
      blocks: [
        {
          type: "paragraph",
          text: "Metro cities typically take 2–5 business days; most other locations 3–7 business days. Remote areas may take 5–10 business days. See our Shipping Policy for details.",
        },
      ],
    },
    {
      title: "Can I return a product?",
      blocks: [
        {
          type: "paragraph",
          text: "Yes. Eligible items can be returned within 7 calendar days of delivery if unused and in original packaging. See our Return Policy for full conditions.",
        },
      ],
    },
    {
      title: "Is cash on delivery available?",
      blocks: [
        {
          type: "paragraph",
          text: "COD availability depends on your pin code and is shown at checkout. Kobbo may restrict COD for repeated refusals or failed delivery attempts.",
        },
      ],
    },
    {
      title: "How do I contact customer care?",
      blocks: [
        {
          type: "paragraph",
          text: "Email support@kobbo.in. We aim to respond within a reasonable timeframe on business days.",
        },
      ],
    },
  ],
};

export const contactPageContent: PolicyPageContent = {
  title: "Customer Care",
  description: "We're here to help with orders, products and returns.",
  sections: [
    {
      title: "Email",
      blocks: [{ type: "paragraph", text: "support@kobbo.in" }],
    },
    {
      title: "Website",
      blocks: [{ type: "paragraph", text: "www.kobbo.in" }],
    },
    {
      title: "Brand",
      blocks: [
        {
          type: "paragraph",
          text: "Kobbo is a brand owned and operated by Unisphere.",
        },
      ],
    },
  ],
};

'''


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    # Light cleanup: strip trailing spaces / fix double spaces in texts
    for page in data.values():
        if page.get("intro"):
            page["intro"] = re.sub(r"\s+", " ", page["intro"]).strip()
        for sec in page["sections"]:
            for b in sec["blocks"]:
                b["text"] = re.sub(r"\s+", " ", b["text"]).strip()
                # Capitalize bullet first letter if needed for display consistency leave as-is

    parts = [HEADER]
    for key in ("shipping", "cancellation", "return", "privacy", "terms"):
        parts.append(page_ts(key, data[key]))
        parts.append("")

    OUT.write_text("\n".join(parts).rstrip() + "\n", encoding="utf-8")
    print("wrote", OUT, "chars", OUT.stat().st_size)


if __name__ == "__main__":
    main()
