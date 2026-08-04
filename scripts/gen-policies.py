"""Parse Kobbo policy PDFs into structured JSON for the site."""
from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader

DOWNLOADS = Path(r"C:\Users\Master\Downloads")
OUT = Path(r"C:\Users\Master\Desktop\shopify\.tmp-policies.json")

PATHS = {
    "shipping": DOWNLOADS / "KOBBO Shipping.pdf",
    "cancellation": DOWNLOADS / "CANCELLATION POLICY kobbo (1).pdf",
    "return": DOWNLOADS / "RETURN kobbo.pdf",
    "privacy": DOWNLOADS / "Privacy policy .pdf",
    "terms": DOWNLOADS / "Terms & Conditions.pdf",
}

KNOWN_SUBTITLES = {
    "Personal Information",
    "Payment Information",
    "Technical Information",
    "Cookies & Tracking Technologies",
}


def extract(path: Path) -> str:
    reader = PdfReader(str(path))
    text = "\n".join((p.extract_text() or "") for p in reader.pages)
    text = text.replace("\uf0b7", "•").replace("\u2022", "•")
    text = text.replace("\ufffd", "•")
    text = re.sub(r"A V AILABILITY", "AVAILABILITY", text)
    text = re.sub(r"GRIEV ANCE", "GRIEVANCE", text)
    # OCR/pdf dash artifacts between digits
    text = re.sub(r"(\d)\s*[•]\s*(\d)", r"\1–\2", text)
    text = text.replace("\u2013", "–").replace("\u2014", "—")
    return text


def title_case_heading(raw: str) -> str:
    if not raw.isupper():
        return raw.strip()
    title = raw.strip().title()
    fixes = [
        ("Ip ", "IP "),
        ("Dpdp", "DPDP"),
        ("Cod", "COD"),
        ("Inr", "INR"),
        ("Sms", "SMS"),
        ("Cvv", "CVV"),
        ("Upi", "UPI"),
        ("Faq", "FAQ"),
    ]
    for a, b in fixes:
        title = title.replace(a, b)
    return title


def reflow_body(lines: list[str]) -> list[tuple[str, str]]:
    """Reflow PDF-wrapped lines; keep bullet continuations on the same item."""
    items: list[tuple[str, str]] = []
    kind: str | None = None
    buf = ""

    def flush() -> None:
        nonlocal kind, buf
        if kind and buf:
            items.append((kind, re.sub(r"\s+", " ", buf).strip()))
        kind = None
        buf = ""

    for ln in lines:
        s = ln.strip()
        if not s:
            flush()
            continue
        if s in KNOWN_SUBTITLES:
            flush()
            items.append(("s", s))
            continue
        if s.startswith("•") or s.startswith("- ") or s.startswith("– "):
            flush()
            kind = "b"
            buf = re.sub(r"^[•\-–]\s*", "", s)
            continue

        # Wrap continuation for unfinished bullets (PDF line breaks mid-sentence).
        if (
            kind == "b"
            and buf
            and not re.search(r'[.!?]"?\s*$', buf)
            and s[:1].islower()
            and len(s.split()) <= 6
        ):
            buf = f"{buf} {s}".strip()
            continue

        if kind == "p" and buf:
            buf = f"{buf} {s}".strip()
        else:
            flush()
            kind = "p"
            buf = s
    flush()
    return items


def parse_numbered(text: str) -> dict:
    m = re.search(r"Last Updated:\s*([0-9\-./]+)", text, re.I)
    last_updated = m.group(1).strip() if m else None

    parts = re.split(r"\n(?=\d+\.\s+)", text)
    header_lines = [ln.strip() for ln in parts[0].splitlines() if ln.strip()]
    intro_lines: list[str] = []
    past_meta = False
    for ln in header_lines:
        if re.match(r"Last Updated", ln, re.I):
            past_meta = True
            continue
        upperish = ln.isupper() or "POLICY" in ln.upper() or ln.startswith("TERMS")
        if not past_meta and (upperish or ln.startswith("For Kobbo")):
            continue
        past_meta = True
        intro_lines.append(ln)
    intro = re.sub(r"\s+", " ", " ".join(intro_lines)).strip() or None

    sections = []
    for part in parts[1:]:
        lines = part.splitlines()
        title_line = lines[0].strip()
        tm = re.match(r"(\d+)\.\s+(.*)", title_line)
        if not tm:
            continue
        num, raw_title = tm.group(1), tm.group(2).strip()
        title = f"{num}. {title_case_heading(raw_title)}"
        mixed = []
        for kind, val in reflow_body(lines[1:]):
            if kind == "s":
                mixed.append({"type": "subtitle", "text": val})
            elif kind == "p":
                mixed.append({"type": "paragraph", "text": val})
            else:
                mixed.append({"type": "bullet", "text": val})
        sections.append({"title": title, "blocks": mixed})

    return {"lastUpdated": last_updated, "intro": intro, "sections": sections}


def parse_cancellation(text: str) -> dict:
    text = re.sub(r"CANCELLATION POLICY\s*", "", text, count=1, flags=re.I)
    headings = [
        "Before Dispatch",
        "After Dispatch",
        "Cancellation by Kobbo",
        "COD Orders",
    ]
    # Insert markers
    working = text
    for h in headings:
        working = re.sub(rf"(?m)^{re.escape(h)}\s*$", f"\n### {h}\n", working)
    chunks = re.split(r"\n### ", working)
    intro = re.sub(r"\s+", " ", chunks[0]).strip() or None
    sections = []
    for chunk in chunks[1:]:
        lines = chunk.splitlines()
        title = lines[0].strip()
        mixed = []
        for kind, val in reflow_body(lines[1:]):
            mixed.append(
                {"type": "paragraph" if kind == "p" else "bullet", "text": val}
            )
        sections.append({"title": title, "blocks": mixed})
    return {"lastUpdated": None, "intro": intro, "sections": sections}


def main() -> None:
    result = {}
    for name, path in PATHS.items():
        text = extract(path)
        if name == "cancellation":
            result[name] = parse_cancellation(text)
        else:
            result[name] = parse_numbered(text)
        print(name, "sections", len(result[name]["sections"]))
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
