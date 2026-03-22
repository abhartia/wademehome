"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { geocodeAddressListingsGeocodePostOptions } from "@/lib/api/generated/@tanstack/react-query.gen";
import type { GeocodeResponse } from "@/lib/api/generated/types.gen";

export type { GeocodeResponse };

export function useListingGeocode(address: string, options?: { enabled?: boolean }) {
  const trimmed = address.trim();
  const enabled =
    Boolean(trimmed) &&
    (options?.enabled ?? true) &&
    isApiConfigured();

  return useQuery({
    ...geocodeAddressListingsGeocodePostOptions({
      body: { address: trimmed },
    }),
    enabled,
    staleTime: 24 * 60 * 60_000,
    retry: 1,
  });
}
