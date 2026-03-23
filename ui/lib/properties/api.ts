"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPropertyNotePropertiesNotesPropertyKeyGetOptions,
  getPropertyNotePropertiesNotesPropertyKeyGetQueryKey,
  listFavoritesPropertiesFavoritesGetOptions,
  listFavoritesPropertiesFavoritesGetQueryKey,
  readToursToursGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import {
  createTourRequestPropertiesTourRequestsPost,
  toggleFavoritePropertiesFavoritesTogglePost,
  upsertPropertyNotePropertiesNotesPropertyKeyPut,
} from "@/lib/api/generated/sdk.gen";
import type {
  FavoriteResponse,
  FavoriteToggleResponse,
  PropertyNoteGetResponse,
  PropertyNoteResponse,
  TourRequestCreate,
  TourRequestCreateResponse,
} from "@/lib/api/generated/types.gen";

export type FavoriteProperty = FavoriteResponse;

export type PropertyNote = PropertyNoteResponse;

export function usePropertyFavorites(options?: { enabled?: boolean }) {
  return useQuery({
    ...listFavoritesPropertiesFavoritesGetOptions({}),
    enabled: options?.enabled ?? true,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      propertyKey: string;
      propertyName: string;
      propertyAddress: string;
    }): Promise<FavoriteToggleResponse> => {
      const { data } = await toggleFavoritePropertiesFavoritesTogglePost({
        body: {
          property_key: input.propertyKey,
          property_name: input.propertyName,
          property_address: input.propertyAddress,
        },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listFavoritesPropertiesFavoritesGetQueryKey({}),
      });
    },
  });
}

export function usePropertyNote(propertyKey: string, options?: { enabled?: boolean }) {
  const enabled = Boolean(propertyKey) && (options?.enabled ?? true);
  return useQuery({
    ...getPropertyNotePropertiesNotesPropertyKeyGetOptions({
      path: { property_key: propertyKey },
    }),
    enabled,
  });
}

export function useUpsertPropertyNote(propertyKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: string): Promise<PropertyNoteGetResponse> => {
      const { data } = await upsertPropertyNotePropertiesNotesPropertyKeyPut({
        path: { property_key: propertyKey },
        body: { note },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: getPropertyNotePropertiesNotesPropertyKeyGetQueryKey({
          path: { property_key: propertyKey },
        }),
      });
    },
  });
}

export function useCreateTourRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: TourRequestCreate,
    ): Promise<TourRequestCreateResponse> => {
      const { data } = await createTourRequestPropertiesTourRequestsPost({
        body: payload,
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: readToursToursGetQueryKey({
          query: { limit: 200, offset: 0, sort: "created_at_desc" },
        }),
      });
    },
  });
}

export function toTourRequestPayload(
  propertyKey: string,
  property: PropertyDataItem,
): TourRequestCreate {
  return {
    property_key: propertyKey,
    property_name: property.name,
    property_address: property.address,
    property_image: property.images_urls[0] ?? null,
    property_price: formatPropertyRangeLabel(property.rent_range),
    property_beds: formatPropertyRangeLabel(property.bedroom_range),
    property_tags: property.main_amenities ?? [],
  };
}
