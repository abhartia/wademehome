"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { normalizePropertyDataItem } from "@/lib/properties/normalizePropertyDataItem";
import { useQuery } from "@tanstack/react-query";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { getListingByPropertyKeyListingsByPropertyKeyGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";

export function usePropertyByKey(propertyKey: string, options?: { enabled?: boolean }) {
  const enabled =
    Boolean(propertyKey) &&
    (options?.enabled ?? true) &&
    isApiConfigured();

  return useQuery({
    ...getListingByPropertyKeyListingsByPropertyKeyGetOptions({
      query: { property_key: propertyKey },
    }),
    enabled,
    select: (row): PropertyDataItem => normalizePropertyDataItem(row),
    staleTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if (error instanceof Error && /404|not found/i.test(error.message))
        return false;
      return failureCount < 2;
    },
  });
}
