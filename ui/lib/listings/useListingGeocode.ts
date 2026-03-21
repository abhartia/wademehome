"use client";

import { useQuery } from "@tanstack/react-query";

import { getListingsApiBase, listingsFetch } from "./listingsApi";

export type GeocodeResponse = { latitude: number; longitude: number };

async function geocodeAddress(address: string): Promise<GeocodeResponse> {
  const base = getListingsApiBase();
  if (!base) {
    throw new Error("Listings API base URL is not configured");
  }
  return listingsFetch<GeocodeResponse>(`${base}/listings/geocode`, {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}

export function useListingGeocode(address: string, options?: { enabled?: boolean }) {
  const trimmed = address.trim();
  const enabled = Boolean(trimmed) && (options?.enabled ?? true) && Boolean(getListingsApiBase());

  return useQuery({
    queryKey: ["listing-geocode", trimmed],
    queryFn: () => geocodeAddress(trimmed),
    enabled,
    staleTime: 24 * 60 * 60_000,
    retry: 1,
  });
}
