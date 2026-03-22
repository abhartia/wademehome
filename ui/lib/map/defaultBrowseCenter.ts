/**
 * Default map center for guest browse and nearby listing queries.
 * Override with NEXT_PUBLIC_DEFAULT_BROWSE_LAT / NEXT_PUBLIC_DEFAULT_BROWSE_LNG (e.g. your primary market).
 * If unset, defaults to New York City.
 */
const DEFAULT_LAT = 40.7128;
const DEFAULT_LNG = -74.006;

function parseCoord(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function getDefaultBrowseMapCenter(): { latitude: number; longitude: number } {
  return {
    latitude: parseCoord(process.env.NEXT_PUBLIC_DEFAULT_BROWSE_LAT, DEFAULT_LAT),
    longitude: parseCoord(process.env.NEXT_PUBLIC_DEFAULT_BROWSE_LNG, DEFAULT_LNG),
  };
}

/** Evaluated at module load (Next inlines env at build time). */
export const DEFAULT_BROWSE_MAP_CENTER = getDefaultBrowseMapCenter();
