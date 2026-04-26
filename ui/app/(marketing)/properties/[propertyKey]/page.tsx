import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { listingsFetch } from "@/lib/listings/listingsApi";
import { normalizePropertyDataItem } from "@/lib/properties/normalizePropertyDataItem";
import type { PropertyDataItem as ApiPropertyRow } from "@/lib/api/generated/types.gen";
import PropertyDetailsClient from "./PropertyDetailsClient";
import PropertySchema from "@/components/property/PropertySchema";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wademehome.com";

type Props = { params: Promise<{ propertyKey: string }> };

async function fetchProperty(propertyKey: string): Promise<PropertyDataItem | null> {
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
  try {
    const raw = await listingsFetch<ApiPropertyRow>(
      `/listings/by-property-key?property_key=${encodeURIComponent(propertyKey)}`,
      cookieHeader ? { headers: { cookie: cookieHeader } } : undefined,
    );
    return normalizePropertyDataItem(raw);
  } catch {
    return null;
  }
}

function humanizeSlug(slug: string): string {
  return slug.replace(/-+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyKey } = await params;
  const decoded = decodeURIComponent(propertyKey);
  const property = await fetchProperty(decoded);

  if (!property) {
    const parts = decoded.split("--");
    const name = parts[0] ? humanizeSlug(parts[0]) : "Property";
    return {
      title: `${name} | Wade Me Home`,
      description: `View rental listing for ${name} on Wade Me Home.`,
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
  const property = await fetchProperty(decoded);

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
