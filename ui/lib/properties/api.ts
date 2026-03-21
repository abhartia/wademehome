"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_CHAT_API_URL ?? "";

export type FavoriteProperty = {
  property_key: string;
  property_name: string;
  property_address: string;
  created_at: string;
};

export type PropertyNote = {
  property_key: string;
  note: string;
  updated_at: string;
};

type TourRequestPayload = {
  property_key: string;
  property_name: string;
  property_address: string;
  property_image?: string | null;
  property_price?: string | null;
  property_beds?: string | null;
  property_tags?: string[];
  requested_date?: string | null;
  requested_time?: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function usePropertyFavorites(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["property-favorites"],
    queryFn: () => request<{ favorites: FavoriteProperty[] }>("/properties/favorites"),
    enabled: options?.enabled ?? true,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      propertyKey: string;
      propertyName: string;
      propertyAddress: string;
    }) =>
      request<{ favorited: boolean }>("/properties/favorites/toggle", {
        method: "POST",
        body: JSON.stringify({
          property_key: input.propertyKey,
          property_name: input.propertyName,
          property_address: input.propertyAddress,
        }),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["property-favorites"] });
    },
  });
}

export function usePropertyNote(propertyKey: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["property-note", propertyKey],
    queryFn: () => request<{ note: PropertyNote | null }>(`/properties/notes/${propertyKey}`),
    enabled: Boolean(propertyKey) && (options?.enabled ?? true),
  });
}

export function useUpsertPropertyNote(propertyKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (note: string) =>
      request<{ note: PropertyNote }>(`/properties/notes/${propertyKey}`, {
        method: "PUT",
        body: JSON.stringify({ note }),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["property-note", propertyKey] });
    },
  });
}

export function useCreateTourRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TourRequestPayload) =>
      request<{ id: string }>("/properties/tour-requests", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tour-requests"] });
    },
  });
}

export function toTourRequestPayload(propertyKey: string, property: PropertyDataItem) {
  return {
    property_key: propertyKey,
    property_name: property.name,
    property_address: property.address,
    property_image: property.images_urls[0] ?? null,
    property_price: formatPropertyRangeLabel(property.rent_range),
    property_beds: formatPropertyRangeLabel(property.bedroom_range),
    property_tags: property.main_amenities ?? [],
  } satisfies TourRequestPayload;
}
