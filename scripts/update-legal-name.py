from pathlib import Path

path = Path(r"C:\Users\Master\Desktop\shopify\src\data\policies.ts")
text = path.read_text(encoding="utf-8")

replacements = [
    (
        "owned and operated by Unisphere",
        "owned and operated by Ruchi Ashok Shah, trading as Unisphere",
    ),
    (
        "A brand owned by Unisphere",
        "A brand owned by Ruchi Ashok Shah, trading as Unisphere",
    ),
    (
        "owned by Unisphere",
        "owned by Ruchi Ashok Shah, trading as Unisphere",
    ),
    (
        "operated by Unisphere",
        "operated by Ruchi Ashok Shah, trading as Unisphere",
    ),
    (
        "How Kobbo (Unisphere) collects",
        "How Kobbo (Unisphere / Ruchi Ashok Shah) collects",
    ),
    (
        "exclusive property of Unisphere",
        "exclusive property of Ruchi Ashok Shah, trading as Unisphere",
    ),
    (
        "belonging to Unisphere",
        "belonging to Ruchi Ashok Shah, trading as Unisphere",
    ),
    (
        "Kobbo, Unisphere, its directors",
        "Kobbo, Unisphere (Ruchi Ashok Shah), its directors",
    ),
    (
        "hold harmless Unisphere, Kobbo",
        "hold harmless Ruchi Ashok Shah (trading as Unisphere), Kobbo",
    ),
    (
        "where Unisphere's registered office is situated",
        "where the registered office of Ruchi Ashok Shah, trading as Unisphere, is situated",
    ),
    (
        "Brand: Kobbo Legal Entity: Unisphere Website: www.kobbo.in Customer Support: support@kobbo.in",
        "Brand: Kobbo Trade Name: Unisphere Legal Name: Ruchi Ashok Shah Website: www.kobbo.in Customer Support: support@kobbo.in",
    ),
]

for old, new in replacements:
    count = text.count(old)
    if count == 0:
        print("MISSING:", old[:90])
    else:
        text = text.replace(old, new)
        print(f"OK ({count}):", old[:70])

path.write_text(text, encoding="utf-8")
print("done. Unisphere mentions:", text.count("Unisphere"))
print("Ruchi mentions:", text.count("Ruchi Ashok Shah"))
