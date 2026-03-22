"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { getMarketSnapshotListingsMarketSnapshotGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";
import type { MarketSnapshotResponse } from "@/lib/api/generated/types.gen";

export type { MarketSnapshotResponse };

export function useMarketSnapshot(
  params: { zip?: string; city?: string; state?: string; address?: string },
  options?: { enabled?: boolean },
) {
  const hasZip = Boolean(params.zip?.trim());
  const hasCityState = Boolean(params.city?.trim() && params.state?.trim());
  const hasAddrFallback = Boolean(params.address?.trim());
  const enabled =
    (options?.enabled ?? true) &&
    isApiConfigured() &&
    (hasZip || hasCityState || hasAddrFallback);

  return useQuery({
    ...getMarketSnapshotListingsMarketSnapshotGetOptions({
      query: {
        zip: params.zip?.trim() || null,
        city: params.city?.trim() || null,
        state: params.state?.trim() || null,
        address: params.address?.trim() || null,
      },
    }),
    enabled,
    staleTime: 10 * 60_000,
    retry: 1,
  });
}
