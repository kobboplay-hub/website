import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "cdn.judge.me",
      },
      {
        protocol: "https",
        hostname: "judgeme.imgix.net",
      },
      {
        protocol: "https",
        hostname: "review-images.judgeme.com",
      },
      {
        protocol: "https",
        hostname: "images.judgeme.com",
      },
    ],
  },
};

export default nextConfig;
