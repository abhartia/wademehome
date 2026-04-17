"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPropertyNotePropertiesNotesPropertyKeyGetOptions,
  getPropertyNotePropertiesNotesPropertyKeyGetQueryKey,
  listFavoritesPropertiesFavoritesGetOptions,
  listFavoritesPropertiesFavoritesGetQueryKey,
  listCommentedPropertiesPropertiesCommentedGetOptions,
  listCommentedPropertiesPropertiesCommentedGetQueryKey,
  listGroupNotesPropertiesGroupNotesPropertyKeyGetOptions,
  listGroupNotesPropertiesGroupNotesPropertyKeyGetQueryKey,
  listReactionsPropertiesReactionsPropertyKeyGetOptions,
  listReactionsPropertiesReactionsPropertyKeyGetQueryKey,
  readToursToursGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import {
  createGroupNotePropertiesGroupNotesPost,
  createTourRequestPropertiesTourRequestsPost,
  deleteGroupNotePropertiesGroupNotesNoteIdDelete,
  toggleFavoritePropertiesFavoritesTogglePost,
  toggleReactionPropertiesReactionsTogglePost,
  upsertPropertyNotePropertiesNotesPropertyKeyPut,
} from "@/lib/api/generated/sdk.gen";
import type {
  CommentedPropertyResponse,
  FavoriteResponse,
  FavoriteToggleResponse,
  GroupNoteResponse,
  PropertyNoteGetResponse,
  PropertyNoteResponse,
  ReactionToggleResponse,
  TourRequestCreate,
  TourRequestCreateResponse,
} from "@/lib/api/generated/types.gen";

export type FavoriteProperty = FavoriteResponse;

export type PropertyNote = PropertyNoteResponse;

export type GroupNote = GroupNoteResponse;

export type CommentedProperty = CommentedPropertyResponse;

export type ReactionKind = "thumbs_up" | "thumbs_down" | "heart";

export function usePropertyFavorites(options?: {
  enabled?: boolean;
  groupId?: string | null;
}) {
  const groupId = options?.groupId ?? null;
  const query = groupId ? { group_id: groupId } : undefined;
  return useQuery({
    ...listFavoritesPropertiesFavoritesGetOptions({ query }),
    enabled: options?.enabled ?? true,
  });
}

export function useToggleFavorite(options?: { groupId?: string | null }) {
  const groupId = options?.groupId ?? null;
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
          group_id: groupId ?? null,
        },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listFavoritesPropertiesFavoritesGetQueryKey({
          query: groupId ? { group_id: groupId } : undefined,
        }),
      });
      // Also invalidate personal list so UI indicators update after scope switch.
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

export function useGroupPropertyNotes(
  propertyKey: string,
  groupId: string | null,
  options?: { enabled?: boolean },
) {
  const enabled =
    Boolean(propertyKey) && Boolean(groupId) && (options?.enabled ?? true);
  return useQuery({
    ...listGroupNotesPropertiesGroupNotesPropertyKeyGetOptions({
      path: { property_key: propertyKey },
      query: { group_id: groupId ?? "" },
    }),
    enabled,
  });
}

export function useAddGroupPropertyNote(propertyKey: string, groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: string): Promise<GroupNoteResponse> => {
      const { data } = await createGroupNotePropertiesGroupNotesPost({
        body: {
          group_id: groupId,
          property_key: propertyKey,
          note,
        },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listGroupNotesPropertiesGroupNotesPropertyKeyGetQueryKey({
          path: { property_key: propertyKey },
          query: { group_id: groupId },
        }),
      });
      await qc.invalidateQueries({
        queryKey: listCommentedPropertiesPropertiesCommentedGetQueryKey({
          query: { group_id: groupId },
        }),
      });
    },
  });
}

export function useDeleteGroupPropertyNote(propertyKey: string, groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: string): Promise<void> => {
      await deleteGroupNotePropertiesGroupNotesNoteIdDelete({
        path: { note_id: noteId },
        throwOnError: true,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listGroupNotesPropertiesGroupNotesPropertyKeyGetQueryKey({
          path: { property_key: propertyKey },
          query: { group_id: groupId },
        }),
      });
      await qc.invalidateQueries({
        queryKey: listCommentedPropertiesPropertiesCommentedGetQueryKey({
          query: { group_id: groupId },
        }),
      });
    },
  });
}

export function useCommentedProperties(
  groupId: string | null,
  options?: { enabled?: boolean },
) {
  const enabled = Boolean(groupId) && (options?.enabled ?? true);
  return useQuery({
    ...listCommentedPropertiesPropertiesCommentedGetOptions({
      query: { group_id: groupId ?? "" },
    }),
    enabled,
  });
}

export function usePropertyReactions(
  propertyKey: string,
  groupId: string | null,
  options?: { enabled?: boolean },
) {
  const enabled =
    Boolean(propertyKey) && Boolean(groupId) && (options?.enabled ?? true);
  return useQuery({
    ...listReactionsPropertiesReactionsPropertyKeyGetOptions({
      path: { property_key: propertyKey },
      query: { group_id: groupId ?? "" },
    }),
    enabled,
  });
}

export function useToggleReaction(propertyKey: string, groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reaction: ReactionKind): Promise<ReactionToggleResponse> => {
      const { data } = await toggleReactionPropertiesReactionsTogglePost({
        body: {
          group_id: groupId,
          property_key: propertyKey,
          reaction,
        },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listReactionsPropertiesReactionsPropertyKeyGetQueryKey({
          path: { property_key: propertyKey },
          query: { group_id: groupId },
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
    request_message: null,
  };
}
