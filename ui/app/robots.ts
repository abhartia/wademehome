import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wademehome.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/property-manager/",
          "/admin/",
          "/login",
          "/profile",
          "/onboarding",
          "/search",
          "/app",
          "/tours",
          "/lease",
          "/move-in",
          "/roommates",
          "/guarantor",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
