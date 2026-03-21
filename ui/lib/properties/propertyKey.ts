import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildPropertyKey(property: PropertyDataItem): string {
  const name = slugify(property.name || "property");
  const address = slugify(property.address || "address");
  const lat = typeof property.latitude === "number" ? property.latitude.toFixed(4) : "na";
  const lng =
    typeof property.longitude === "number" ? property.longitude.toFixed(4) : "na";

  // Note: when lng is negative, concatenation produces three hyphens (e.g. 40.7---74.0), matching Python resolver.
  return `${name}--${address}--${lat}--${lng}`;
}
