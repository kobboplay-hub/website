import type { Metadata } from "next";

/** EDITABLE: Site-wide SEO defaults */
export const SITE_NAME = "Kobbo";
export const SITE_TAGLINE = "More Than Toys.";
export const DEFAULT_DESCRIPTION =
  "Educational toys, creative kits and games designed for growing children. Shop premium toys at Kobbo.";

export function buildPageTitle(page?: string): string {
  if (page) return `${page} | ${SITE_NAME} | ${SITE_TAGLINE}`;
  return `${SITE_NAME} | ${SITE_TAGLINE}`;
}

export function buildMetadata(
  title: string,
  description = DEFAULT_DESCRIPTION,
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export const homeMetadata = buildMetadata(
  buildPageTitle(),
  "Toys that grow curious minds. Educational toys, creative kits and games for growing children.",
);

export const shopMetadata = buildMetadata(
  buildPageTitle("Shop Toys"),
  "Explore playful, skill-building toys curated for little minds.",
);

export const searchMetadata = buildMetadata(
  buildPageTitle("Search"),
  "Search Kobbo toys by name and discover educational play essentials.",
);

export function productMetadata(title: string, description?: string): Metadata {
  return buildMetadata(
    buildPageTitle(title),
    description ?? DEFAULT_DESCRIPTION,
  );
}

export function policyMetadata(title: string, description: string): Metadata {
  return buildMetadata(buildPageTitle(title), description);
}
