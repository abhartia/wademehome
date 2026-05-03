import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { listingsAuthHeaders } from "@/lib/listings/listingsApi";
import { normalizePropertyDataItem } from "@/lib/properties/normalizePropertyDataItem";
import type { PropertyDataItem as ApiPropertyRow } from "@/lib/api/generated/types.gen";
import PropertyDetailsClient from "./PropertyDetailsClient";
import PropertySchema from "@/components/property/PropertySchema";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wademehome.com";

type Props = { params: Promise<{ propertyKey: string }> };

type FetchResult =
  | { kind: "ok"; property: PropertyDataItem }
  | { kind: "missing" } // listing genuinely doesn't exist (API returned 404) → render 404
  | { kind: "error" }; // transient or env failure → render the soft "Property unavailable" client shell

// Server-side, the listings API base must be a fully-qualified URL. The
// browser-facing NEXT_PUBLIC_API_BASE_URL is often a relative proxy path
// like "/_api" which fetch() can't resolve from a server component. Fall
// back through the proxy target (server-resolvable), then a dev default
// matching next.config.ts's API_PROXY_TARGET default.
function resolveServerApiBase(): string | null {
  const candidates = [
    process.env.SITEMAP_API_BASE_URL,
    process.env.NEXT_PUBLIC_API_PROXY_TARGET,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_CHAT_API_URL,
  ];
  for (const c of candidates) {
    if (c && /^https?:\/\//.test(c)) {
      return c.replace(/\/$/, "");
    }
  }
  // Dev fallback — matches the default in next.config.ts. In production the
  // deployment env is expected to set an absolute URL; we don't want to
  // silently route to localhost there.
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:8000";
  }
  return null;
}

async function fetchProperty(propertyKey: string): Promise<FetchResult> {
  // Forward the browser's cookies so the API can identify the contributor —
  // private user-added listings 404 otherwise (visibility check in
  // /listings/by-property-key). Public rows resolve either way.
  let cookieHeader = "";
  try {
    const store = await cookies();
    cookieHeader = store
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  } catch {
    // outside a request scope (build-time metadata probe) — continue anonymously
  }

  const base = resolveServerApiBase();
  if (!base) {
    // env issue (no API base configured) — not a real 404
    return { kind: "error" };
  }

  const url = `${base}/listings/by-property-key?property_key=${encodeURIComponent(propertyKey)}`;
  const headers: Record<string, string> = { ...listingsAuthHeaders() };
  if (cookieHeader) headers.cookie = cookieHeader;

  try {
    const response = await fetch(url, {
      credentials: "include",
      headers,
    });
    if (response.status === 404) {
      // Listing genuinely doesn't exist — caller should serve a real 404 so
      // Google de-indexes the URL instead of accumulating Soft 404s.
      return { kind: "missing" };
    }
    if (!response.ok) {
      // 5xx, network-level failure, etc. — keep the soft client-shell behavior
      // because the listing might still exist; do not 404.
      return { kind: "error" };
    }
    const raw = (await response.json()) as ApiPropertyRow;
    return { kind: "ok", property: normalizePropertyDataItem(raw) };
  } catch {
    return { kind: "error" };
  }
}

// A property is considered too thin to index when key SERP-ranking fields
// are all missing. Indexing thin pages just bloats Google's "Crawled —
// currently not indexed" bucket and wastes crawl budget on URLs that will
// never rank. Better to noindex them and let crawl budget go to listings
// that have actual data.
function isThinForIndexing(p: PropertyDataItem): boolean {
  const hasRent = Boolean(p.rent_range);
  const hasBedroom = Boolean(p.bedroom_range);
  const hasAddress = Boolean(p.address);
  const hasImages = (p.images_urls?.length ?? 0) > 0;
  // Require at least 2 of the 4 SERP-critical fields. Listings that satisfy
  // 0 or 1 are placeholder rows — common for newly-scraped addresses where
  // the description hasn't filled in yet.
  const filled = [hasRent, hasBedroom, hasAddress, hasImages].filter(Boolean).length;
  return filled < 2;
}

function humanizeSlug(slug: string): string {
  return slug.replace(/-+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyKey } = await params;
  const decoded = decodeURIComponent(propertyKey);
  const result = await fetchProperty(decoded);

  if (result.kind === "missing") {
    // Listing rotated out — call notFound() so the response is served with
    // a real 404 status and Google de-indexes the URL within ~30 days.
    // Calling notFound() from generateMetadata is required (in addition to
    // the page component) for the status code to be set correctly.
    notFound();
  }

  if (result.kind === "error") {
    // Transient or env error — keep the soft "Property" stub but noindex
    // it so Google doesn't classify the page as Soft 404 if our API is
    // briefly unreachable when Googlebot crawls.
    const parts = decoded.split("--");
    const name = parts[0] ? humanizeSlug(parts[0]) : "Property";
    return {
      title: `${name} | Wade Me Home`,
      description: `View rental listing for ${name} on Wade Me Home.`,
      robots: { index: false, follow: true },
    };
  }

  const { property } = result;

  // If the listing is real but too thin to be SERP-useful, mark it
  // noindex while keeping the page accessible to product traffic.
  // This addresses GSC's "Crawled — currently not indexed" bucket
  // (~148 pages today): Google fetches, sees thin content, declines.
  // Telling it ourselves up-front saves crawl budget for real listings.
  if (isThinForIndexing(property)) {
    return {
      title: property.name
        ? `${property.name} | Wade Me Home`
        : `Property | Wade Me Home`,
      description: property.address
        ? `Listing at ${property.address} on Wade Me Home. View details, photos, and floor plans.`
        : `View rental listing on Wade Me Home.`,
      robots: { index: false, follow: true },
    };
  }

  // Title: building name + bedroom + rent + city — the four fields a renter
  // is searching for. Keep under ~60 chars where possible so Google doesn't
  // truncate. The pipe-separated form is what wins SERP click attention on
  // address-style long-tail queries.
  const titleParts: string[] = [property.name];
  if (property.bedroom_range) titleParts.push(property.bedroom_range);
  if (property.rent_range) titleParts.push(`${property.rent_range}/mo`);
  if (property.city) {
    const cityState = property.state
      ? `${property.city}, ${property.state}`
      : property.city;
    titleParts.push(cityState);
  }
  titleParts.push("Wade Me Home");
  const title = titleParts.join(" | ");

  // Description: lead with rent + bedroom + address (the ranking-query fields),
  // then top amenities (which often contain the click-driving differentiators
  // — "in-unit washer/dryer", "doorman", "pet friendly"), then concession if
  // present (the highest-CTR snippet element when available — "1 month free"
  // dramatically lifts SERP CTR vs a plain blue link).
  const descSentences: string[] = [];

  // Lead sentence: rent + bedroom + address — answers the searcher's
  // immediate question on the SERP without requiring a click.
  const leadParts: string[] = [];
  if (property.rent_range && property.bedroom_range) {
    leadParts.push(
      `${property.bedroom_range} from ${property.rent_range}/mo at ${property.name}`,
    );
  } else if (property.rent_range) {
    leadParts.push(`${property.name} from ${property.rent_range}/mo`);
  } else {
    leadParts.push(`Rent ${property.name}`);
  }
  if (property.address) {
    const fullAddr = property.city
      ? `${property.address}, ${property.city}${
          property.state ? `, ${property.state}` : ""
        }${property.zip_code ? ` ${property.zip_code}` : ""}`
      : property.address;
    leadParts.push(`located at ${fullAddr}`);
  }
  descSentences.push(`${leadParts.join(", ")}.`);

  // Concession line — when available, this is the strongest CTR element.
  if (property.concessions) {
    descSentences.push(`Current concession: ${property.concessions}.`);
  }

  // Amenity line — surface up to 5 main amenities.
  if (property.main_amenities?.length) {
    descSentences.push(
      `Amenities include ${property.main_amenities.slice(0, 5).join(", ")}.`,
    );
  }

  // Action close — gives the searcher a reason to click ("see photos",
  // "tour", "available").
  if (property.available_date) {
    descSentences.push(`Available ${property.available_date}.`);
  }
  descSentences.push(
    `View photos, floor plans and tour ${property.name} on Wade Me Home.`,
  );

  // Cap description at ~300 chars (Google typically truncates around 160–200,
  // but allows up to ~320 for long-tail queries — full text helps rich
  // snippet generation).
  let description = descSentences.join(" ");
  if (description.length > 300) {
    description = description.slice(0, 297) + "...";
  }

  const images = property.images_urls?.length
    ? [{ url: property.images_urls[0], width: 1200, height: 630, alt: property.name }]
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title: property.name,
      description,
      type: "website",
      url: `${baseUrl}/properties/${encodeURIComponent(decoded)}`,
      siteName: "Wade Me Home",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: property.name,
      description,
      images: images?.map((i) => i.url),
    },
    robots: { index: true, follow: true },
  };
}

function buildJsonLd(property: PropertyDataItem, propertyKey: string) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: property.name,
    url: `${baseUrl}/properties/${encodeURIComponent(propertyKey)}`,
  };

  if (property.address) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: property.address,
      ...(property.city ? { addressLocality: property.city } : {}),
      ...(property.state ? { addressRegion: property.state } : {}),
      ...(property.zip_code ? { postalCode: property.zip_code } : {}),
      addressCountry: "US",
    };
  }

  if (
    typeof property.latitude === "number" &&
    typeof property.longitude === "number"
  ) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: property.latitude,
      longitude: property.longitude,
    };
  }

  if (property.images_urls?.length) {
    jsonLd.image = property.images_urls.slice(0, 6);
  }

  if (property.amenities?.length) {
    jsonLd.amenityFeature = property.amenities.slice(0, 20).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    }));
  }

  return jsonLd;
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { propertyKey } = await params;
  const decoded = decodeURIComponent(propertyKey);
  const result = await fetchProperty(decoded);

  // The listing is gone — return a real 404 status so Google de-indexes
  // the URL within its normal cycle (~30 days) instead of indefinitely
  // counting it as a Soft 404. This was the largest single bucket in
  // GSC's "Why pages aren't indexed" report (217 pages on 2026-05-03).
  if (result.kind === "missing") {
    notFound();
  }

  const property = result.kind === "ok" ? result.property : null;

  return (
    <>
      {property ? (
        <>
          <PropertySchema
            property={property}
            propertyKey={decoded}
            baseUrl={baseUrl}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildJsonLd(property, decoded)),
            }}
          />
        </>
      ) : null}
      <PropertyDetailsClient propertyKey={decoded} initialProperty={property} />
    </>
  );
}
