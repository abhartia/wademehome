"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { normalizePropertyDataItem } from "@/lib/properties/normalizePropertyDataItem";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { getNearbyListingsListingsNearbyGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";
import type { NearbyListingsResponse as ApiNearbyListingsResponse } from "@/lib/api/generated/types.gen";
import type { MapBoundsLngLat } from "@/lib/map/approximateBrowseBounds";

/** Nearby listings payload with UI `PropertyDataItem` rows (stricter than OpenAPI). */
export type NearbyListingsResponse = Omit<
  ApiNearbyListingsResponse,
  "properties"
> & {
  properties: PropertyDataItem[];
};

function normalizeNearby(data: ApiNearbyListingsResponse): NearbyListingsResponse {
  return {
    ...data,
    used_global_nearest_fallback: Boolean(data.used_global_nearest_fallback),
    used_bbox: Boolean(data.used_bbox),
    properties: Array.isArray(data.properties)
      ? data.properties.map((p) => normalizePropertyDataItem(p))
      : [],
  };
}

export const DEFAULT_NEARBY_RADIUS_MILES = 15;
export const DEFAULT_NEARBY_LIMIT = 50;
const COORD_PRECISION = 4;

function stableCoord(value: number): number {
  const scale = 10 ** COORD_PRECISION;
  return Math.round(value * scale) / scale;
}

function stableBounds(bounds: MapBoundsLngLat): MapBoundsLngLat {
  return {
    west: stableCoord(bounds.west),
    south: stableCoord(bounds.south),
    east: stableCoord(bounds.east),
    north: stableCoord(bounds.north),
  };
}

function boundsFinite(b: MapBoundsLngLat): boolean {
  return (
    Number.isFinite(b.west) &&
    Number.isFinite(b.south) &&
    Number.isFinite(b.east) &&
    Number.isFinite(b.north) &&
    b.south < b.north &&
    b.west < b.east
  );
}

type UseNearbyListingsOptions =
  | {
      mode: "bbox";
      bounds: MapBoundsLngLat;
      limit?: number;
      enabled?: boolean;
    }
  | {
      mode: "radius";
      latitude: number;
      longitude: number;
      radiusMiles?: number;
      limit?: number;
      enabled?: boolean;
    };

export function useNearbyListings(options: UseNearbyListingsOptions) {
  const limit = options.limit ?? DEFAULT_NEARBY_LIMIT;
  const enabled = options.enabled ?? true;
  const normalizedBounds = options.mode === "bbox" ? stableBounds(options.bounds) : null;
  const normalizedLat = options.mode === "radius" ? stableCoord(options.latitude) : null;
  const normalizedLng = options.mode === "radius" ? stableCoord(options.longitude) : null;

  const queryKeyPayload =
    options.mode === "bbox"
      ? {
          query: {
            west: normalizedBounds!.west,
            south: normalizedBounds!.south,
            east: normalizedBounds!.east,
            north: normalizedBounds!.north,
            limit,
          },
        }
      : {
          query: {
            latitude: normalizedLat!,
            longitude: normalizedLng!,
            radius_miles: options.radiusMiles ?? DEFAULT_NEARBY_RADIUS_MILES,
            limit,
          },
        };

  const coordsOk =
    options.mode === "bbox"
      ? boundsFinite(normalizedBounds!)
      : Number.isFinite(normalizedLat) && Number.isFinite(normalizedLng);

  return useQuery({
    ...getNearbyListingsListingsNearbyGetOptions(queryKeyPayload),
    enabled: enabled && isApiConfigured() && coordsOk,
    select: normalizeNearby,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
