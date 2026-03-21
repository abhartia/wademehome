import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

export function isSamePropertyListing(
  a: PropertyDataItem | null | undefined,
  b: PropertyDataItem | null | undefined,
): boolean {
  if (!a || !b) return false;
  return (
    a.name === b.name &&
    a.address === b.address &&
    a.rent_range === b.rent_range &&
    a.bedroom_range === b.bedroom_range
  );
}
