import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

type Props = {
  property: PropertyDataItem;
  propertyKey: string;
  baseUrl: string;
};

/**
 * Parses a numeric lower-bound out of a `rent_range` string like
 * "$2,000-$2,500", "$2000 - $2500", or "$1,950/mo".
 * Returns `null` if no parseable number is present.
 *
 * NOTE: This is a parser, not a heuristic fallback. It does not invent a
 * price when the field is missing — it only extracts what is already in
 * the source string. When the source has nothing, callers must omit the
 * Offer entry entirely (see assembly below).
 */
function parseLowerRent(rentRange: string | null | undefined): number | null {
  if (!rentRange) return null;
  const matches = rentRange.match(/\d[\d,]*/g);
  if (!matches || matches.length === 0) return null;
  const nums = matches
    .map((m) => Number(m.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length === 0) return null;
  return Math.min(...nums);
}

function buildApartment(
  property: PropertyDataItem,
  pageUrl: string,
): Record<string, unknown> | null {
  // Apartment requires at minimum a name. Address fields are highly
  // recommended but optional per schema.org — we still emit the entry
  // when only `name` + (geo OR address line) is present.
  if (!property.name) return null;

  const apartment: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: property.name,
    url: pageUrl,
  };

  if (property.address) {
    apartment.address = {
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
    typeof property.longitude === "number" &&
    Number.isFinite(property.latitude) &&
    Number.isFinite(property.longitude)
  ) {
    apartment.geo = {
      "@type": "GeoCoordinates",
      latitude: property.latitude,
      longitude: property.longitude,
    };
  }

  // numberOfRooms — derive only from explicit `bedroom_range` lower bound
  // (e.g. "1-3 bedrooms" -> 1). No invented data.
  if (property.bedroom_range) {
    const m = property.bedroom_range.match(/\d+/);
    if (m) {
      const rooms = Number(m[0]);
      if (Number.isFinite(rooms) && rooms > 0) {
        apartment.numberOfRooms = rooms;
      }
    }
  }

  // floorSize — PropertyDataItem does not currently expose square_feet, so
  // we omit floorSize unless/until the field is added upstream. (Per the
  // task brief: skip rather than fabricate.)

  if (property.amenities?.length) {
    apartment.amenityFeature = property.amenities.slice(0, 20).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    }));
  }

  if (property.images_urls?.length) {
    apartment.image = property.images_urls.slice(0, 4);
  }

  return apartment;
}

function buildOffer(
  property: PropertyDataItem,
  pageUrl: string,
): Record<string, unknown> | null {
  const lowerRent = parseLowerRent(property.rent_range);
  if (lowerRent === null) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    price: lowerRent,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: pageUrl,
    validFrom: new Date().toISOString(),
  };
}

function buildBreadcrumb(
  property: PropertyDataItem,
  pageUrl: string,
  baseUrl: string,
): Record<string, unknown> | null {
  if (!property.name) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Search",
        item: `${baseUrl}/search`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.name,
        item: pageUrl,
      },
    ],
  };
}

/**
 * Server component (no "use client") that emits a single
 * <script type="application/ld+json"> tag containing an array of
 * JSON-LD entries (Apartment, Offer, BreadcrumbList) for a property.
 *
 * Designed to be additive next to any existing JSON-LD on the page —
 * Google merges multiple JSON-LD blocks per page.
 */
export default function PropertySchema({
  property,
  propertyKey,
  baseUrl,
}: Props) {
  const trimmedBase = baseUrl.replace(/\/$/, "");
  const pageUrl = `${trimmedBase}/properties/${encodeURIComponent(propertyKey)}`;

  const entries: Record<string, unknown>[] = [];

  const apartment = buildApartment(property, pageUrl);
  if (apartment) entries.push(apartment);

  const offer = buildOffer(property, pageUrl);
  if (offer) entries.push(offer);

  const breadcrumb = buildBreadcrumb(property, pageUrl, trimmedBase);
  if (breadcrumb) entries.push(breadcrumb);

  if (entries.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entries) }}
    />
  );
}
