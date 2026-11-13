import type { Metadata } from "next";

import { buildMetadata } from "@/data/seo";
import { lifestyleSeo } from "@/data/lifestyle";
import { getProductImageUrl, type Product } from "@/lib/shopify/types";
import { getProductPath } from "./product-routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.kobbo.in";

interface LifestyleMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string; width?: number; height?: number } | null;
  noIndex?: boolean;
}

export function lifestyleMetadata({ title, description, path, image, noIndex }: LifestyleMetadataInput): Metadata {
  const base = buildMetadata(title, description);
  const images = image
    ? [{ url: image.url, alt: image.alt, width: image.width, height: image.height }]
    : base.openGraph?.images;

  return {
    ...base,
    applicationName: "Kobbo Lifestyle",
    alternates: { canonical: path },
    openGraph: {
      ...base.openGraph,
      siteName: "Kobbo Lifestyle",
      url: path,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image.url] : ["/kobbo-icon.png"],
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

export const lifestyleHomeMetadata = lifestyleMetadata({
  title: lifestyleSeo.title,
  description: lifestyleSeo.description,
  path: "/lifestyle",
});

export function lifestyleProductMetadata(product: Product): Metadata {
  const description = (product.seo.description || product.description || lifestyleSeo.description)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const imageUrl = getProductImageUrl(product);

  return lifestyleMetadata({
    title: `${product.seo.title || product.title} | Kobbo Lifestyle`,
    description,
    path: getProductPath(product),
    image: imageUrl
      ? {
          url: imageUrl,
          alt: product.featuredImage?.altText || product.title,
          width: product.featuredImage?.width,
          height: product.featuredImage?.height,
        }
      : null,
  });
}
