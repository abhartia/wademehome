import type { Metadata } from "next";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { listingsFetch } from "@/lib/listings/listingsApi";
import { normalizePropertyDataItem } from "@/lib/properties/normalizePropertyDataItem";
import type { PropertyDataItem as ApiPropertyRow } from "@/lib/api/generated/types.gen";
import PropertyDetailsClient from "./PropertyDetailsClient";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wademehome.com";

type Props = { params: Promise<{ propertyKey: string }> };

async function fetchProperty(propertyKey: string): Promise<PropertyDataItem | null> {
  try {
    const raw = await listingsFetch<ApiPropertyRow>(
      `/listings/by-property-key?property_key=${encodeURIComponent(propertyKey)}`,
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

  const title = `${property.name} | ${property.rent_range || "Rental"} | Wade Me Home`;
  const descParts = [
    `Rent ${property.name} at ${property.address}.`,
    property.bedroom_range ? `${property.bedroom_range}.` : null,
    property.rent_range ? `${property.rent_range}/mo.` : null,
    property.main_amenities?.length
      ? `Amenities: ${property.main_amenities.slice(0, 4).join(", ")}.`
      : null,
  ].filter(Boolean);
  const description = descParts.join(" ");

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd(property, decoded)),
          }}
        />
      ) : null}
      <PropertyDetailsClient propertyKey={decoded} initialProperty={property} />
    </>
  );
}
