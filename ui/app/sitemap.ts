import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog/articles";
import { listingsFetch } from "@/lib/listings/listingsApi";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wademehome.com";

async function fetchPropertyKeys(): Promise<string[]> {
  // The listings API is reachable at build time only when both a fully
  // qualified base URL is configured AND the backend is online. Relative
  // bases like "/_api" work for in-browser requests but not during
  // `next build`, where there is no Next.js app server to proxy through.
  // Skip in those cases so CI doesn't hang waiting for a host that doesn't
  // exist — property URLs are added to the sitemap when the runtime pulls
  // fresh data on subsequent rebuilds.
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_CHAT_API_URL ??
    "";
  if (!apiBase || apiBase.startsWith("/")) return [];

  try {
    const data = await listingsFetch<{ keys: string[] }>(
      "/listings/sitemap-keys",
      { signal: AbortSignal.timeout(15_000) },
    );
    return data.keys ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/for-property-managers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc-moving-checklist`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc-apartment-search-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc-apartment-movers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc-move-in-cleaning`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vendors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc-rent-by-neighborhood`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc/east-village`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc/east-village/rent-prices`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/nyc/williamsburg`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc/williamsburg/rent-prices`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/nyc/greenpoint`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc/astoria`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc/astoria/rent-prices`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/nyc/long-island-city`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc/long-island-city/rent-prices`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/nyc/bushwick`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc/upper-west-side`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nyc/park-slope`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jersey-city`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jersey-city/downtown`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jersey-city/journal-square`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jersey-city/newport`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cost-of-moving-to-nyc`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/best-time-to-rent-nyc`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bad-landlord-nj-ny`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = blogArticles.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const propertyKeys = await fetchPropertyKeys();
  const propertyEntries: MetadataRoute.Sitemap = propertyKeys.map((key) => ({
    url: `${baseUrl}/properties/${encodeURIComponent(key)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogEntries, ...propertyEntries];
}
