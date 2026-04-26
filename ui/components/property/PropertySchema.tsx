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

function hasAmenityMatch(
  amenities: string[] | undefined,
  patterns: RegExp[],
): boolean {
  if (!amenities?.length) return false;
  return amenities.some((a) => patterns.some((re) => re.test(a)));
}

/**
 * Per-property FAQPage JSON-LD assembled from the property's actual fields.
 * Returns null if there isn't enough data to answer at least 2 questions
 * truthfully — Google requires non-trivial FAQPage content.
 *
 * No invented data: each Q/A pair only emits when the source row has the
 * relevant field. Questions about pets, parking, and laundry derive from the
 * amenities list with pattern matching, and emit only on a match.
 */
function buildFaqPage(
  property: PropertyDataItem,
): Record<string, unknown> | null {
  type QA = { name: string; answer: string };
  const qas: QA[] = [];

  if (property.rent_range) {
    qas.push({
      name: `What is the rent at ${property.name}?`,
      answer: `Current asking rent at ${property.name} is ${property.rent_range}${
        property.bedroom_range ? ` for ${property.bedroom_range}` : ""
      }${
        property.address ? `, located at ${property.address}` : ""
      }. Rent ranges reflect the active inventory across available units and update as the landlord changes pricing.`,
    });
  }

  if (property.address || property.city) {
    const fullAddr = [
      property.address,
      property.city,
      property.state,
      property.zip_code,
    ]
      .filter(Boolean)
      .join(", ");
    qas.push({
      name: `Where is ${property.name} located?`,
      answer: `${property.name} is located at ${fullAddr}.`,
    });
  }

  if (property.bedroom_range) {
    qas.push({
      name: `What floor plans does ${property.name} offer?`,
      answer: `${property.name} offers ${property.bedroom_range}${
        property.rent_range ? ` with asking rent of ${property.rent_range}` : ""
      }. Specific layouts and availability vary by unit and lease term.`,
    });
  }

  // Combine main_amenities + amenities for matching, dedupe.
  const allAmenities = Array.from(
    new Set([
      ...(property.main_amenities ?? []),
      ...(property.amenities ?? []),
    ]),
  );

  const petPatterns = [/\bpet\b/i, /\bpets\b/i, /\bdog\b/i, /\bcat\b/i, /pet[- ]friendly/i];
  if (hasAmenityMatch(allAmenities, petPatterns)) {
    qas.push({
      name: `Is ${property.name} pet friendly?`,
      answer: `${property.name} lists pet-friendly accommodations among its amenities. Specific pet policies — including weight limits, breed restrictions, and pet rent — are set by the landlord and confirmed at lease signing.`,
    });
  }

  const parkingPatterns = [/\bparking\b/i, /\bgarage\b/i];
  if (hasAmenityMatch(allAmenities, parkingPatterns)) {
    qas.push({
      name: `Does ${property.name} have parking?`,
      answer: `${property.name} lists parking among its amenities. Parking availability, monthly cost, and assignment (deeded vs. waitlist) are confirmed at lease signing.`,
    });
  }

  const laundryPatterns = [
    /\bin[- ]unit laundry\b/i,
    /\bin[- ]unit washer\b/i,
    /\bwasher.{0,20}dryer\b/i,
    /\blaundry in (unit|building)\b/i,
    /\bw\/d\b/i,
  ];
  if (hasAmenityMatch(allAmenities, laundryPatterns)) {
    qas.push({
      name: `Does ${property.name} have laundry?`,
      answer: `${property.name} lists laundry among its amenities. Specific configuration — in-unit washer/dryer vs. shared building laundry vs. nearby laundromat — is confirmed at touring.`,
    });
  }

  const doormanPatterns = [/\bdoorman\b/i, /\bconcierge\b/i];
  if (hasAmenityMatch(allAmenities, doormanPatterns)) {
    qas.push({
      name: `Does ${property.name} have a doorman?`,
      answer: `${property.name} includes doorman or concierge service among its amenities. Hours of coverage (24-hour vs. part-time) are confirmed at touring.`,
    });
  }

  const gymPatterns = [/\bgym\b/i, /\bfitness\b/i];
  if (hasAmenityMatch(allAmenities, gymPatterns)) {
    qas.push({
      name: `Does ${property.name} have a gym?`,
      answer: `${property.name} includes an on-site fitness center among its amenities. Equipment selection and access (24-hour fob vs. attended hours) are confirmed at touring.`,
    });
  }

  if (property.concessions) {
    qas.push({
      name: `Are there any move-in concessions at ${property.name}?`,
      answer: `${property.name} is currently advertising: ${property.concessions}. Concession terms (months free, OP, application fee credits) typically require a specific lease term and may change with availability.`,
    });
  }

  // Require at least 2 Q/A pairs for a meaningful FAQPage.
  if (qas.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map(({ name, answer }) => ({
      "@type": "Question",
      name,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
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

  const faq = buildFaqPage(property);
  if (faq) entries.push(faq);

  if (entries.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entries) }}
    />
  );
}
