import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

const STORAGE_KEY = "wademehome_property_cache";

type PropertyCache = Record<string, PropertyDataItem>;

function readCache(): PropertyCache {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as PropertyCache;
  } catch {
    return {};
  }
}

export function cacheProperty(propertyKey: string, property: PropertyDataItem): void {
  if (typeof window === "undefined") return;
  const cache = readCache();
  cache[propertyKey] = property;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
}

export function getCachedProperty(propertyKey: string): PropertyDataItem | null {
  const cache = readCache();
  return cache[propertyKey] ?? null;
}
