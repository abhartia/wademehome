/**
 * Approximate visible bounds from center + zoom before the map reports real `getBounds()`.
 * Tuned so at zoom 11 the span is roughly a city-scale browse area.
 */
export type MapBoundsLngLat = {
  west: number;
  south: number;
  east: number;
  north: number;
};

/** Map center, zoom, and visible bounds (for listing queries). */
export type BrowseMapViewport = MapBoundsLngLat & {
  latitude: number;
  longitude: number;
  zoom: number;
};

export function approximateBoundsFromCenterZoom(
  latitude: number,
  longitude: number,
  zoom: number,
): MapBoundsLngLat {
  const zFactor = 2 ** (11 - zoom);
  const latHalf = 0.055 * zFactor;
  const cosLat = Math.max(0.25, Math.cos((latitude * Math.PI) / 180));
  const lngHalf = (0.075 * zFactor) / cosLat;
  return {
    south: latitude - latHalf,
    north: latitude + latHalf,
    west: longitude - lngHalf,
    east: longitude + lngHalf,
  };
}
