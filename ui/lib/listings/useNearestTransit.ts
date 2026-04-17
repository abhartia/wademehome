"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { listingsFetch } from "@/lib/listings/listingsApi";

export type NearestTransitStation = {
  system: "path" | "hblr" | "nyc_subway" | "lirr" | "nj_transit_rail" | "ferry";
  station_name: string;
  lines: string[];
  latitude: number;
  longitude: number;
  distance_miles: number;
  walk_minutes: number;
};

export type NearestTransitResponse = {
  latitude: number;
  longitude: number;
  stations: NearestTransitStation[];
};

type Options = {
  enabled?: boolean;
  systems?: NearestTransitStation["system"][];
  limit?: number;
  maxWalkMinutes?: number;
};

/** Nearest PATH / HBLR / ferry stations to a given point, with walk-time
 * estimates at 3 mph + 20% detour factor. Powered by the backend
 * `/listings/nearest-transit` endpoint and the `transit_stations` table.
 *
 * Used on listing/building detail views to show "X min walk to PATH" and
 * to power transit-proximity filters for the JC market. */
export function useNearestTransit(
  latitude: number | undefined,
  longitude: number | undefined,
  options: Options = {},
) {
  const { enabled = true, systems, limit = 5, maxWalkMinutes } = options;
  const has =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);
  const canQuery = enabled && has && isApiConfigured();

  const qs = new URLSearchParams();
  if (has) {
    qs.set("latitude", String(latitude));
    qs.set("longitude", String(longitude));
  }
  if (systems && systems.length > 0) qs.set("systems", systems.join(","));
  qs.set("limit", String(limit));
  if (typeof maxWalkMinutes === "number") {
    qs.set("max_walk_minutes", String(maxWalkMinutes));
  }

  return useQuery({
    queryKey: ["nearest-transit", latitude, longitude, systems?.join(",") ?? "", limit, maxWalkMinutes ?? null],
    queryFn: () =>
      listingsFetch<NearestTransitResponse>(`/listings/nearest-transit?${qs.toString()}`),
    enabled: canQuery,
    staleTime: 60 * 60_000,
    retry: 1,
  });
}

const SYSTEM_LABELS: Record<NearestTransitStation["system"], string> = {
  path: "PATH",
  hblr: "Light Rail",
  nyc_subway: "Subway",
  lirr: "LIRR",
  nj_transit_rail: "NJ Transit",
  ferry: "Ferry",
};

export function formatTransitLabel(station: NearestTransitStation): string {
  const sys = SYSTEM_LABELS[station.system];
  return `${station.walk_minutes} min to ${station.station_name} ${sys}`;
}
