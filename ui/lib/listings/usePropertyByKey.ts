"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { useQuery } from "@tanstack/react-query";

import { getListingsApiBase, listingsFetch } from "./listingsApi";

async function fetchPropertyByKey(propertyKey: string): Promise<PropertyDataItem> {
  const base = getListingsApiBase();
  if (!base) {
    throw new Error("Listings API base URL is not configured");
  }
  const url = `${base}/listings/by-property-key?property_key=${encodeURIComponent(propertyKey)}`;
  return listingsFetch<PropertyDataItem>(url, { method: "GET" });
}

export function usePropertyByKey(propertyKey: string, options?: { enabled?: boolean }) {
  const enabled = Boolean(propertyKey) && (options?.enabled ?? true);

  return useQuery({
    queryKey: ["listing-by-key", propertyKey],
    queryFn: () => fetchPropertyByKey(propertyKey),
    enabled,
    staleTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if (error instanceof Error && /404|not found/i.test(error.message)) return false;
      return failureCount < 2;
    },
  });
}
