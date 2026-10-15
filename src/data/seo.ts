import type { Metadata } from "next";

/** EDITABLE: Site-wide SEO defaults */
export const SITE_NAME = "Kobbo";
export const SITE_TAGLINE = "More Than Toys.";
export const DEFAULT_DESCRIPTION =
  "Educational toys, creative kits and games designed for growing children. Shop premium toys at Kobbo.";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.kobbo.in";

export function buildPageTitle(page?: string): string {
  if (page) return `${page} | ${SITE_NAME} | ${SITE_TAGLINE}`;
  return `${SITE_NAME} | ${SITE_TAGLINE}`;
}

export function buildMetadata(
  title: string,
  description = DEFAULT_DESCRIPTION,
): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: SITE_NAME,
    icons: {
      icon: [{ url: "/kobbo-icon.png", type: "image/png", sizes: "1024x1024" }],
      apple: [{ url: "/kobbo-icon.png", sizes: "1024x1024", type: "image/png" }],
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      images: [
        {
          url: "/kobbo-icon.png",
          width: 1024,
          height: 1024,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/kobbo-icon.png"],
    },
  };
}

export const homeMetadata = buildMetadata(
  "Kobbo | Stage-Based Play for Your Child’s Developing Brain",
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

/** Shop by Age listing — `ageGroupName` comes from the Shopify metaobject */
export function ageGroupMetadata(ageGroupName: string, path: string): Metadata {
  const base = buildMetadata(
    buildPageTitle(`${ageGroupName} Play Kits`),
    `Shop age-appropriate Kobbo play kits for ${ageGroupName}.`,
  );
  return {
    ...base,
    alternates: { canonical: path },
    openGraph: { ...base.openGraph, url: path },
  };
}

export function policyMetadata(title: string, description: string): Metadata {
  return buildMetadata(buildPageTitle(title), description);
}
