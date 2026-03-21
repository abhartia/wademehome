"use client";

import { useQuery } from "@tanstack/react-query";

import { getListingsApiBase, listingsFetch } from "./listingsApi";

export type MarketSnapshotResponse = {
  scope: string;
  zip: string | null;
  city: string | null;
  state: string | null;
  sample_size: number;
  median_rent: number | null;
  p25_rent: number | null;
  p75_rent: number | null;
  bedroom_mix: Record<string, number>;
};

async function fetchMarketSnapshot(params: {
  zip?: string;
  city?: string;
  state?: string;
  address?: string;
}): Promise<MarketSnapshotResponse> {
  const base = getListingsApiBase();
  if (!base) {
    throw new Error("Listings API base URL is not configured");
  }
  const url = new URL(`${base}/listings/market-snapshot`);
  if (params.zip?.trim()) url.searchParams.set("zip", params.zip.trim());
  if (params.city?.trim()) url.searchParams.set("city", params.city.trim());
  if (params.state?.trim()) url.searchParams.set("state", params.state.trim());
  if (params.address?.trim()) url.searchParams.set("address", params.address.trim());
  return listingsFetch<MarketSnapshotResponse>(url.toString(), { method: "GET" });
}

export function useMarketSnapshot(
  params: { zip?: string; city?: string; state?: string; address?: string },
  options?: { enabled?: boolean },
) {
  const hasZip = Boolean(params.zip?.trim());
  const hasCityState = Boolean(params.city?.trim() && params.state?.trim());
  const hasAddrFallback = Boolean(params.address?.trim());
  const enabled =
    (options?.enabled ?? true) &&
    Boolean(getListingsApiBase()) &&
    (hasZip || hasCityState || hasAddrFallback);

  return useQuery({
    queryKey: [
      "listings-market-snapshot",
      params.zip ?? "",
      params.city ?? "",
      params.state ?? "",
      params.address ?? "",
    ],
    queryFn: () => fetchMarketSnapshot(params),
    enabled,
    staleTime: 10 * 60_000,
    retry: 1,
  });
}
