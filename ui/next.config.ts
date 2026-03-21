import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Root for Turbopack when using `npm run dev:turbo` (optional; webpack is default for `npm run dev`).
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.equityapartments.com",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
