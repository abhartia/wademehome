import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

export function isSamePropertyListing(
  a: PropertyDataItem | null | undefined,
  b: PropertyDataItem | null | undefined,
): boolean {
  if (!a || !b) return false;
  // Prefer referential identity to avoid conflating distinct units that share the same
  // human-readable labels (e.g. "2 BR" / "Rent on request").
  if (a === b) return true;

  // Provider listing URL is the closest thing we have to a stable unique id.
  if (a.listing_url && b.listing_url) return a.listing_url === b.listing_url;

  const aPrimaryImage = a.images_urls?.[0] ?? null;
  const bPrimaryImage = b.images_urls?.[0] ?? null;
  return (
    a.name === b.name &&
    a.address === b.address &&
    (a.city ?? null) === (b.city ?? null) &&
    (a.state ?? null) === (b.state ?? null) &&
    (a.zip_code ?? null) === (b.zip_code ?? null) &&
    a.rent_range === b.rent_range &&
    a.bedroom_range === b.bedroom_range &&
    aPrimaryImage === bPrimaryImage
  );
}
