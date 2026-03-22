"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { poiNearbyListingsPoiNearbyGetQueryKey } from "@/lib/api/generated/@tanstack/react-query.gen";
import { poiNearbyListingsPoiNearbyGet } from "@/lib/api/generated/sdk.gen";
import type { PoiHit, PoiNearbyResponse } from "@/lib/api/generated/types.gen";

export type { PoiHit };

export type PoiNearbyResult = PoiNearbyResponse & {
  /** Present when the API returns 503 (e.g. POI provider not configured). */
  service_unavailable?: boolean;
};

export function usePoiNearby(
  latitude: number | undefined,
  longitude: number | undefined,
  options?: { enabled?: boolean },
) {
  const has =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);
  const enabled =
    (options?.enabled ?? true) && has && isApiConfigured();

  return useQuery({
    queryKey: poiNearbyListingsPoiNearbyGetQueryKey({
      query: { latitude: latitude!, longitude: longitude! },
    }),
    queryFn: async ({ signal }) => {
      const res = await poiNearbyListingsPoiNearbyGet({
        query: { latitude: latitude!, longitude: longitude! },
        throwOnError: false,
        signal,
      });
      if (res.response?.status === 503) {
        return {
          latitude: latitude!,
          longitude: longitude!,
          items: [],
          service_unavailable: true,
        } satisfies PoiNearbyResult;
      }
      if (!res.response?.ok) {
        throw new Error(
          `POI nearby failed: ${res.response?.status ?? "unknown"}`,
        );
      }
      return {
        ...res.data!,
        service_unavailable: false,
      } satisfies PoiNearbyResult;
    },
    enabled,
    staleTime: 30 * 60_000,
    retry: 1,
  });
}
