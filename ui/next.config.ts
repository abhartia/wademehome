import type { NextConfig } from "next";

const API_PROXY_TARGET =
  process.env.NEXT_PUBLIC_API_PROXY_TARGET ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  // Official Docker / Azure App Service pattern: minimal runtime via `.next/standalone`.
  output: "standalone",
  // Root for Turbopack when using `npm run dev:turbo` (optional; webpack is default for `npm run dev`).
  turbopack: {
    root: __dirname,
  },
  // Proxy API calls through the Next.js dev server so the session cookie is
  // first-party to the UI origin (cross-port localhost cookies are unreliable
  // in modern Chrome — set on :8000 → not sent to :52459, breaking middleware
  // auth checks). The UI hits `/_api/...` and Next forwards to the API.
  async rewrites() {
    return [
      { source: "/_api/:path*", destination: `${API_PROXY_TARGET}/:path*` },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
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
      {
        protocol: "https",
        hostname: "*.scene7.com",
      },
    ],
  },
};

export default nextConfig;
