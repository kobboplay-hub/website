"""Extract clean policies from client prompt using exact line slices and emit src/data/policies.ts."""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Master\Desktop\shopify")
RAW_PROMPT = ROOT / "client_prompt_raw.txt"
OUT_TS = ROOT / "src" / "data" / "policies.ts"

with open(RAW_PROMPT, "r", encoding="utf-8") as f:
    raw_lines = f.readlines()

def clean_text(s: str) -> str:
    s = s.replace("\ufffd", "—").replace("'", "'").replace("'", "'").replace('"', '"').replace('"', '"')
    return re.sub(r'\s+', ' ', s).strip()

def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').strip()

# 1. Privacy Policy (lines 65 to 104)
priv_raw = [clean_text(l) for l in raw_lines[65:104] if clean_text(l)]
priv_intro = priv_raw[0] if priv_raw else ""
priv_sections = []
current_sec = None

for line in priv_raw[1:]:
    if re.match(r'^[0-9]+\.\s+', line) or "Questions & Contact" in line:
        if current_sec:
            priv_sections.append(current_sec)
        current_sec = {"title": line, "blocks": []}
    else:
        if current_sec is None:
            current_sec = {"title": "General", "blocks": []}
        current_sec["blocks"].append({"type": "paragraph", "text": line})

if current_sec:
    priv_sections.append(current_sec)

# 2. Return & Refund Policy (lines 105 to 122)
ret_raw = [clean_text(l) for l in raw_lines[105:122] if clean_text(l)]
ret_sections = []
current_sec = None

for line in ret_raw:
    if line in ["Return Policy", "Refund Policy"]:
        if current_sec:
            ret_sections.append(current_sec)
        current_sec = {"title": line, "blocks": []}
    else:
        if current_sec is None:
            current_sec = {"title": "Return Policy", "blocks": []}
        if "refunds will be transferred" in line.lower() or "refunds will be initiated" in line.lower():
            current_sec["blocks"].append({"type": "bullet", "text": line})
        else:
            current_sec["blocks"].append({"type": "paragraph", "text": line})

if current_sec:
    ret_sections.append(current_sec)

# 3. Cancellation Policy (lines 122 to 131)
canc_raw = [clean_text(l) for l in raw_lines[122:131] if clean_text(l)]
canc_sections = []
current_sec = None

CANC_HEADINGS = ["Cancellation Policy", "Need to cancel your order?", "Before your order is dispatched", "After your order has been dispatched"]

for line in canc_raw:
    if line in CANC_HEADINGS:
        if current_sec:
            canc_sections.append(current_sec)
        current_sec = {"title": line, "blocks": []}
    else:
        if current_sec is None:
            current_sec = {"title": "Need to cancel your order?", "blocks": []}
        current_sec["blocks"].append({"type": "paragraph", "text": line})

if current_sec:
    canc_sections.append(current_sec)

# Also append Cancellation to Return & Refund sections
ret_sections.extend(canc_sections)

# 4. Shipping Policy (lines 132 to 154)
ship_raw = [clean_text(l) for l in raw_lines[132:154] if clean_text(l)]
ship_intro = ""
ship_sections = []
current_sec = None

KNOWN_SHIP_HEADINGS = [
    "Shipping Costs", "Domestic Shipping", "Dispatch Time", "Change of Delivery Address",
    "Out of Stock Items", "Delivery Delays", "Tracking Your Order", "Damaged Parcels", "Lost Parcels"
]

for line in ship_raw:
    if line == "Shipping Policy":
        continue
    if "We want your Kobbo order to reach you safely" in line:
        ship_intro = line
        continue
    if line in KNOWN_SHIP_HEADINGS:
        if current_sec:
            ship_sections.append(current_sec)
        current_sec = {"title": line, "blocks": []}
    else:
        if current_sec is None:
            current_sec = {"title": "Shipping Details", "blocks": []}
        current_sec["blocks"].append({"type": "paragraph", "text": line})

if current_sec:
    ship_sections.append(current_sec)

# 5. Terms of Service (lines 156 to 257)
terms_raw = [clean_text(l) for l in raw_lines[156:257] if clean_text(l)]
terms_sections = []
current_sec = None

for line in terms_raw:
    if "Yes. I" in line or line == "Terms of Service":
        continue
    if line == "OVERVIEW" or line.startswith("SECTION "):
        if current_sec:
            terms_sections.append(current_sec)
        title = "Overview" if line == "OVERVIEW" else line
        current_sec = {"title": title, "blocks": []}
    else:
        if current_sec is None:
            current_sec = {"title": "Overview", "blocks": []}
        if line.startswith("•") or line.startswith("-") or (len(line) > 3 and line[0].isdigit() and line[1] == ")"):
            current_sec["blocks"].append({"type": "bullet", "text": line.lstrip("•- ")})
        else:
            current_sec["blocks"].append({"type": "paragraph", "text": line})

if current_sec:
    terms_sections.append(current_sec)

# Helper to render sections to TS
def render_sections_ts(sections):
    out = []
    for s in sections:
        blocks_ts = []
        for b in s["blocks"]:
            blocks_ts.append(f'          {{ type: "{b["type"]}", text: "{esc(b["text"])}" }},')
        rendered_blocks = "\n".join(blocks_ts)
        out.append(f'    {{\n      title: "{esc(s["title"])}",\n      blocks: [\n{rendered_blocks}\n      ],\n    }},')
    return "\n".join(out)

ts_content = f'''/**
 * Policy & FAQ page content — Official Kobbo brand policies.
 * Purged of any former legal entities. 100% Kobbo.
 */

import {{ legalEntity, footerBrand }} from "./footer";

export type PolicyBlock =
  | {{ type: "paragraph"; text: string }}
  | {{ type: "bullet"; text: string }}
  | {{ type: "subtitle"; text: string }};

export interface PolicySection {{
  title: string;
  /** @deprecated Prefer blocks; kept for simple FAQ/contact pages */
  paragraphs?: string[];
  bullets?: string[];
  blocks?: PolicyBlock[];
}}

export interface PolicyPageContent {{
  title: string;
  description: string;
  lastUpdated?: string;
  intro?: string;
  sections: PolicySection[];
}}

export const faqsPageContent: PolicyPageContent = {{
  title: "Frequently Asked Questions",
  description: "Quick answers about Kobbo developmental play kits, shipping, and order support.",
  sections: [
    {{
      title: "What age groups are Kobbo Play Kits designed for?",
      blocks: [
        {{
          type: "paragraph",
          text: "Kobbo Play Kits are specifically tailored for two crucial developmental windows: Year 2 (24–36 Months) with The Little Explorer Kit, and Year 3–5 (36–60 Months) with The Tinker Kit. Each kit is matched to child development milestones.",
        }},
      ],
    }},
    {{
      title: "How long does delivery take?",
      blocks: [
        {{
          type: "paragraph",
          text: "Orders are usually dispatched within 5 business days from our warehouse. Domestic shipping across India typically takes 7–15 days from dispatch. You will receive a tracking link once your kit ships.",
        }},
      ],
    }},
    {{
      title: "What is your return and refund policy?",
      blocks: [
        {{
          type: "paragraph",
          text: "As opened or used products cannot be resold, we do not accept returns or exchanges once an order has been delivered. However, if any product reaches you damaged, broken, or with missing parts, Kobbo provides full replacement or refund support when reported within 24–48 hours with an unboxing video.",
        }},
      ],
    }},
    {{
      title: "Can I cancel my order?",
      blocks: [
        {{
          type: "paragraph",
          text: "Yes, you can request cancellation within 5–6 hours of placing the order before dispatch. For prepaid orders, eligible refunds are returned to the original payment method within 15 days.",
        }},
      ],
    }},
    {{
      title: "Are shipping charges applicable?",
      blocks: [
        {{
          type: "paragraph",
          text: "We provide free shipping across India on all orders.",
        }},
      ],
    }},
    {{
      title: "How do I contact Kobbo customer support?",
      blocks: [
        {{
          type: "paragraph",
          text: "You can reach us at hello@kobbo.in or call/WhatsApp our customer care team at +91 8329195232.",
        }},
      ],
    }},
  ],
}};

export const contactPageContent: PolicyPageContent = {{
  title: "Contact Us",
  description: "Have a question about our play kits or your order? We're here to help.",
  sections: [
    {{
      title: "Email Support",
      blocks: [{{ type: "paragraph", text: footerBrand.email }}],
    }},
    {{
      title: "Customer Care Phone",
      blocks: [{{ type: "paragraph", text: footerBrand.phone }}],
    }},
    {{
      title: "Website",
      blocks: [{{ type: "paragraph", text: "www.kobbo.in" }}],
    }},
    {{
      title: "Brand",
      blocks: [
        {{
          type: "paragraph",
          text: legalEntity.ownershipLine,
        }},
      ],
    }},
  ],
}};

export const shippingPolicyContent: PolicyPageContent = {{
  title: "Shipping Policy",
  description: "We provide free shipping across India on all orders. Learn about dispatch times and tracking.",
  intro: "{esc(ship_intro)}",
  sections: [
{render_sections_ts(ship_sections)}
  ],
}};

export const returnPolicyContent: PolicyPageContent = {{
  title: "Return & Refund Policy",
  description: "Quality assurance, transit replacement support, and refund terms for Kobbo orders.",
  sections: [
{render_sections_ts(ret_sections)}
  ],
}};

export const cancellationPolicyContent: PolicyPageContent = {{
  title: "Cancellation Policy",
  description: "Information on cancelling your Kobbo order before or after dispatch.",
  sections: [
{render_sections_ts(canc_sections)}
  ],
}};

export const privacyPolicyContent: PolicyPageContent = {{
  title: "Privacy Policy",
  description: "How Kobbo collects, uses, and safeguards your personal information.",
  intro: "{esc(priv_intro)}",
  sections: [
{render_sections_ts(priv_sections)}
  ],
}};

export const termsPolicyContent: PolicyPageContent = {{
  title: "Terms of Service",
  description: "Terms and conditions governing your use of Kobbo website and services.",
  sections: [
{render_sections_ts(terms_sections)}
  ],
}};
'''

# Sanity assertion
if "Heena" in ts_content:
    raise ValueError("Found Heena in generated TS!")

with open(OUT_TS, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Emitted {OUT_TS} successfully. Length: {len(ts_content)}")
print(f"  Privacy sections: {len(priv_sections)}")
print(f"  Return sections: {len(ret_sections)}")
print(f"  Cancellation sections: {len(canc_sections)}")
print(f"  Shipping sections: {len(ship_sections)}")
print(f"  Terms sections: {len(terms_sections)}")
