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

/**
 * True when the map center is still near the configured default (user has not panned to another region).
 * Used so browser geolocation can update the viewport after the initial map callback, which otherwise races ahead of getCurrentPosition.
 */
const DEFAULT_BROWSE_MATCH_EPS_DEG = 0.15;

export function isApproxDefaultBrowseCenter(center: {
  latitude: number;
  longitude: number;
}): boolean {
  const d = DEFAULT_BROWSE_MAP_CENTER;
  return (
    Math.abs(center.latitude - d.latitude) < DEFAULT_BROWSE_MATCH_EPS_DEG &&
    Math.abs(center.longitude - d.longitude) < DEFAULT_BROWSE_MATCH_EPS_DEG
  );
}
