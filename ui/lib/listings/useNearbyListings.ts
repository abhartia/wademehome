"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { normalizePropertyDataItem } from "@/lib/properties/normalizePropertyDataItem";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { getNearbyListingsListingsNearbyGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";
import type { NearbyListingsResponse as ApiNearbyListingsResponse } from "@/lib/api/generated/types.gen";

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
    properties: Array.isArray(data.properties)
      ? data.properties.map((p) => normalizePropertyDataItem(p))
      : [],
  };
}

export const DEFAULT_NEARBY_RADIUS_MILES = 15;
export const DEFAULT_NEARBY_LIMIT = 50;

export function useNearbyListings(options: {
  latitude: number;
  longitude: number;
  radiusMiles?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const {
    latitude,
    longitude,
    radiusMiles = DEFAULT_NEARBY_RADIUS_MILES,
    limit = DEFAULT_NEARBY_LIMIT,
    enabled = true,
  } = options;

  const coordsOk =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  return useQuery({
    ...getNearbyListingsListingsNearbyGetOptions({
      query: {
        latitude,
        longitude,
        radius_miles: radiusMiles,
        limit,
      },
    }),
    enabled: enabled && isApiConfigured() && coordsOk,
    select: normalizeNearby,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
