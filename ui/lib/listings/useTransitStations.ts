"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { listingsFetch } from "@/lib/listings/listingsApi";

export type TransitSystem =
  | "path"
  | "hblr"
  | "nyc_subway"
  | "lirr"
  | "nj_transit_rail"
  | "nj_transit_bus"
  | "ferry";

export type TransitStationPoint = {
  system: TransitSystem;
  station_name: string;
  lines: string[];
  latitude: number;
  longitude: number;
  borough: string | null;
};

export type TransitStationsResponse = {
  stations: TransitStationPoint[];
  total: number;
};

type Options = {
  enabled?: boolean;
  systems?: TransitSystem[];
  bbox?: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
  limit?: number;
};

export function useTransitStations(options: Options = {}) {
  const { enabled = true, systems, bbox, limit = 2000 } = options;
  const canQuery = enabled && isApiConfigured();

  const qs = new URLSearchParams();
  if (systems && systems.length > 0) qs.set("systems", systems.join(","));
  if (bbox) {
    qs.set("west", String(bbox.west));
    qs.set("south", String(bbox.south));
    qs.set("east", String(bbox.east));
    qs.set("north", String(bbox.north));
  }
  qs.set("limit", String(limit));

  return useQuery({
    queryKey: [
      "transit-stations",
      systems?.join(",") ?? "",
      bbox ? `${bbox.west},${bbox.south},${bbox.east},${bbox.north}` : "",
      limit,
    ],
    queryFn: () =>
      listingsFetch<TransitStationsResponse>(
        `/listings/transit-stations?${qs.toString()}`,
      ),
    enabled: canQuery,
    staleTime: 24 * 60 * 60_000,
    retry: 1,
  });
}

export const TRANSIT_SYSTEM_LABELS: Record<TransitSystem, string> = {
  path: "PATH",
  hblr: "Light Rail",
  nyc_subway: "Subway",
  lirr: "LIRR",
  nj_transit_rail: "NJT Rail",
  nj_transit_bus: "NJT Bus",
  ferry: "Ferry",
};

/** Distinct brand colors per transit system for map markers. */
export const TRANSIT_SYSTEM_COLORS: Record<TransitSystem, string> = {
  path: "#D93A2C", // PATH red
  hblr: "#F68B1F", // HBLR orange
  nyc_subway: "#0039A6", // MTA NYC Subway blue
  lirr: "#00985F", // LIRR green
  nj_transit_rail: "#6D1B7B", // NJT rail purple
  nj_transit_bus: "#9CA3AF", // bus slate (quieter; many markers)
  ferry: "#00A8E1", // ferry teal
};
