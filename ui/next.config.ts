import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: { root: __dirname },
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
    ],
  },
};

export default nextConfig;
