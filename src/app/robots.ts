import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/storefront/lifestyle-seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API endpoints and payment steps are not pages.
      disallow: ["/api/", "/checkout/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
