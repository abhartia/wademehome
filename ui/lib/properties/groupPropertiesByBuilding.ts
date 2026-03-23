import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

export type BuildingPropertyGroup = {
  key: string;
  latitude: number | null;
  longitude: number | null;
  units: PropertyDataItem[];
};

export function buildingGroupKey(property: PropertyDataItem): string {
  if (typeof property.latitude === "number" && typeof property.longitude === "number") {
    return `geo:${property.latitude.toFixed(5)},${property.longitude.toFixed(5)}`;
  }
  const name = property.name.toLowerCase().trim().replace(/\s+/g, " ");
  const address = property.address.toLowerCase().trim().replace(/\s+/g, " ");
  return `addr:${name}|${address}`;
}

/**
 * Groups listings that share the same map pin (5dp lat/lng) or, without coords,
 * the same normalized name + address. Preserves first-seen building order.
 */
export function groupPropertiesByBuilding(
  properties: PropertyDataItem[],
): BuildingPropertyGroup[] {
  const groups: BuildingPropertyGroup[] = [];
  const keyToIndex = new Map<string, number>();

  for (const property of properties) {
    const key = buildingGroupKey(property);
    let idx = keyToIndex.get(key);
    if (idx === undefined) {
      idx = groups.length;
      keyToIndex.set(key, idx);
      groups.push({
        key,
        latitude: typeof property.latitude === "number" ? property.latitude : null,
        longitude: typeof property.longitude === "number" ? property.longitude : null,
        units: [property],
      });
    } else {
      groups[idx].units.push(property);
    }
  }

  return groups;
}
