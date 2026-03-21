"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { useQuery } from "@tanstack/react-query";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_CHAT_API_URL ?? "";

export type NearbyListingsResponse = {
  properties: PropertyDataItem[];
  total_in_radius: number;
  radius_miles: number;
  limit: number;
  used_global_nearest_fallback: boolean;
};

function normalizePropertyItem(raw: PropertyDataItem): PropertyDataItem {
  const latRaw = raw.latitude as unknown;
  const lngRaw = raw.longitude as unknown;
  const lat =
    typeof latRaw === "number" && Number.isFinite(latRaw)
      ? latRaw
      : typeof latRaw === "string" && latRaw.trim() !== ""
        ? Number(latRaw)
        : undefined;
  const lng =
    typeof lngRaw === "number" && Number.isFinite(lngRaw)
      ? lngRaw
      : typeof lngRaw === "string" && lngRaw.trim() !== ""
        ? Number(lngRaw)
        : undefined;
  const latitude = lat !== undefined && Number.isFinite(lat) ? lat : undefined;
  const longitude = lng !== undefined && Number.isFinite(lng) ? lng : undefined;
  return { ...raw, latitude, longitude };
}

async function fetchNearbyListings(params: {
  latitude: number;
  longitude: number;
  radiusMiles: number;
  limit: number;
}): Promise<NearbyListingsResponse> {
  if (!API_BASE) {
    return {
      properties: [],
      total_in_radius: 0,
      radius_miles: params.radiusMiles,
      limit: params.limit,
      used_global_nearest_fallback: false,
    };
  }

  const url = new URL(`${API_BASE.replace(/\/$/, "")}/listings/nearby`);
  url.searchParams.set("latitude", String(params.latitude));
  url.searchParams.set("longitude", String(params.longitude));
  url.searchParams.set("radius_miles", String(params.radiusMiles));
  url.searchParams.set("limit", String(params.limit));

  const headers: Record<string, string> = {};
  const token = process.env.NEXT_PUBLIC_CHAT_API_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Nearby listings request failed: ${response.status}`);
  }

  const data = (await response.json()) as NearbyListingsResponse;
  return {
    ...data,
    used_global_nearest_fallback: Boolean(data.used_global_nearest_fallback),
    properties: Array.isArray(data.properties)
      ? data.properties.map((p) => normalizePropertyItem(p))
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

  return useQuery({
    queryKey: ["listings-nearby", latitude, longitude, radiusMiles, limit],
    queryFn: () => fetchNearbyListings({ latitude, longitude, radiusMiles, limit }),
    enabled,
    staleTime: 60_000,
  });
}
