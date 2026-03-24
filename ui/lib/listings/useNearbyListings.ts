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

  const queryKeyPayload =
    options.mode === "bbox"
      ? {
          query: {
            west: options.bounds.west,
            south: options.bounds.south,
            east: options.bounds.east,
            north: options.bounds.north,
            limit,
          },
        }
      : {
          query: {
            latitude: options.latitude,
            longitude: options.longitude,
            radius_miles: options.radiusMiles ?? DEFAULT_NEARBY_RADIUS_MILES,
            limit,
          },
        };

  const coordsOk =
    options.mode === "bbox"
      ? boundsFinite(options.bounds)
      : Number.isFinite(options.latitude) && Number.isFinite(options.longitude);

  return useQuery({
    ...getNearbyListingsListingsNearbyGetOptions(queryKeyPayload),
    enabled: enabled && isApiConfigured() && coordsOk,
    select: normalizeNearby,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
