import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import type { PropertyDataItem as ApiPropertyRow } from "@/lib/api/generated/types.gen";

/** Map an OpenAPI listing row to the stricter UI `PropertyDataItem` shape. */
export function normalizePropertyDataItem(raw: ApiPropertyRow): PropertyDataItem {
  const latRaw = raw.latitude as unknown;
  const lngRaw = raw.longitude as unknown;
  const lat =
    typeof latRaw === "number" && Number.isFinite(latRaw)
      ? latRaw
      : typeof latRaw === "string" && latRaw.trim() !== ""
        ? Number(latRaw)
        : undefined;
  const lng =
    typeof lngRaw === "number" && Number.isFinite(lngRaw)
      ? lngRaw
      : typeof lngRaw === "string" && lngRaw.trim() !== ""
        ? Number(lngRaw)
        : undefined;
  const latitude = lat !== undefined && Number.isFinite(lat) ? lat : undefined;
  const longitude = lng !== undefined && Number.isFinite(lng) ? lng : undefined;
  return {
    ...(raw as unknown as PropertyDataItem),
    images_urls: raw.images_urls ?? [],
    latitude,
    longitude,
  };
}
