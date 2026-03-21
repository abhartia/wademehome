"use client";

import { useQuery } from "@tanstack/react-query";

import { getListingsApiBase, listingsAuthHeaders } from "./listingsApi";

export type PoiHit = {
  category: string;
  count: number;
  nearest_name: string | null;
  nearest_latitude: number | null;
  nearest_longitude: number | null;
  /** Meters from the listing pin to the nearest POI in this category (when known). */
  nearest_distance_meters?: number | null;
};

export type PoiNearbyResponse = {
  latitude: number;
  longitude: number;
  items: PoiHit[];
  /** True when the API is up but POI search is not configured (e.g. missing MAPBOX_ACCESS_TOKEN). */
  service_unavailable?: boolean;
};

async function fetchPoiNearby(latitude: number, longitude: number): Promise<PoiNearbyResponse> {
  const base = getListingsApiBase();
  if (!base) {
    throw new Error("Listings API base URL is not configured");
  }
  const url = new URL(`${base}/listings/poi-nearby`);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: listingsAuthHeaders(),
  });
  if (response.status === 503) {
    return {
      latitude,
      longitude,
      items: [],
      service_unavailable: true,
    };
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  const data = (await response.json()) as Omit<PoiNearbyResponse, "service_unavailable">;
  return { ...data, service_unavailable: false };
}

export function usePoiNearby(
  latitude: number | undefined,
  longitude: number | undefined,
  options?: { enabled?: boolean },
) {
  const has = typeof latitude === "number" && typeof longitude === "number" && Number.isFinite(latitude) && Number.isFinite(longitude);
  const enabled = (options?.enabled ?? true) && has && Boolean(getListingsApiBase());

  return useQuery({
    queryKey: ["listings-poi-nearby", latitude, longitude],
    queryFn: () => fetchPoiNearby(latitude as number, longitude as number),
    enabled,
    staleTime: 30 * 60_000,
    retry: 1,
  });
}
