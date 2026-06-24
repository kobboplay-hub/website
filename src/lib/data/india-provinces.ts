export const INDIA_PROVINCES = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CH", name: "Chandigarh" },
  { code: "CG", name: "Chhattisgarh" },
  { code: "DN", name: "Dadra and Nagar Haveli" },
  { code: "DD", name: "Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LA", name: "Ladakh" },
  { code: "LD", name: "Lakshadweep" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OR", name: "Odisha" },
  { code: "PY", name: "Puducherry" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
] as const;

export function isIndiaCountry(country: string): boolean {
  const normalized = country.trim().toLowerCase();
  return normalized === "india" || normalized === "in";
}

export function normalizeCountry(country: string): string {
  return isIndiaCountry(country) ? "India" : country.trim();
}

export function normalizeIndianProvince(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const upper = trimmed.toUpperCase();
  const byCode = INDIA_PROVINCES.find((p) => p.code === upper);
  if (byCode) return byCode.code;

  const lower = trimmed.toLowerCase();
  const byName = INDIA_PROVINCES.find((p) => p.name.toLowerCase() === lower);
  if (byName) return byName.code;

  const partial = INDIA_PROVINCES.find((p) =>
    p.name.toLowerCase().includes(lower),
  );
  if (partial) return partial.code;

  return null;
}

export function getIndianProvinceName(code: string | null | undefined): string {
  if (!code) return "";
  const match = INDIA_PROVINCES.find(
    (p) => p.code === code.toUpperCase() || p.name.toLowerCase() === code.toLowerCase(),
  );
  return match?.name ?? code;
}
