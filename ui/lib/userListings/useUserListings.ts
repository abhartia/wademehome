"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/generated/client.gen";
import { listFavoritesPropertiesFavoritesGetQueryKey, readToursToursGetQueryKey } from "@/lib/api/generated/@tanstack/react-query.gen";

export type Visibility = "private" | "public";

export interface PrefillFields {
  name: string | null;
  address: string | null;
  unit: string | null;
  price: string | null;
  beds: string | null;
  baths: string | null;
  image_url: string | null;
  source_host: string | null;
}

export interface ParseUrlResponse {
  prefill: PrefillFields;
  parsed: boolean;
}

export interface DedupeMatch {
  property_key: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  distance_meters: number;
  score: number;
  is_user_contributed: boolean;
}

export interface DedupeCheckResponse {
  matches: DedupeMatch[];
}

export interface CreateUserListingBody {
  name: string;
  address: string;
  unit: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  latitude: number | null;
  longitude: number | null;
  price: string | null;
  beds: string | null;
  baths: string | null;
  source_url: string | null;
  image_url: string | null;
}

export interface CreateUserListingResponse {
  property_key: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  visibility: Visibility;
}

export interface DuplicateConflictDetail {
  code: "duplicate" | "public_duplicate";
  message: string;
  match: DedupeMatch;
}

export class DuplicateListingError extends Error {
  detail: DuplicateConflictDetail;
  constructor(detail: DuplicateConflictDetail) {
    super(detail.message);
    this.detail = detail;
    this.name = "DuplicateListingError";
  }
}

async function rawPost<T>(url: string, body: unknown): Promise<T> {
  const res = await client.post({ url: url as never, body, throwOnError: false });
  if (res.error) {
    const err = res.error as { detail?: unknown };
    const detail = err?.detail;
    if (
      detail &&
      typeof detail === "object" &&
      "code" in detail &&
      (detail as DuplicateConflictDetail).code
    ) {
      throw new DuplicateListingError(detail as DuplicateConflictDetail);
    }
    const msg =
      typeof detail === "string"
        ? detail
        : "Request failed. Please try again.";
    throw new Error(msg);
  }
  return (res as { data: T }).data;
}

async function rawPatch<T>(url: string, body: unknown): Promise<T> {
  const res = await client.patch({ url: url as never, body, throwOnError: false });
  if (res.error) {
    const err = res.error as { detail?: unknown };
    const detail = err?.detail;
    if (
      detail &&
      typeof detail === "object" &&
      "code" in detail &&
      (detail as DuplicateConflictDetail).code
    ) {
      throw new DuplicateListingError(detail as DuplicateConflictDetail);
    }
    const msg =
      typeof detail === "string"
        ? detail
        : "Request failed. Please try again.";
    throw new Error(msg);
  }
  return (res as { data: T }).data;
}

async function rawDelete(url: string): Promise<void> {
  const res = await client.delete({ url: url as never, throwOnError: false });
  if (res.error) {
    const msg =
      typeof (res.error as { detail?: unknown })?.detail === "string"
        ? ((res.error as { detail?: string }).detail as string)
        : "Request failed";
    throw new Error(msg);
  }
}

export function useParseListingUrl() {
  return useMutation({
    mutationFn: async (url: string): Promise<ParseUrlResponse> => {
      return rawPost<ParseUrlResponse>("/user-listings/parse-url", { url });
    },
  });
}

export function useDedupeCheck() {
  return useMutation({
    mutationFn: async (input: {
      latitude: number;
      longitude: number;
      address: string;
      unit: string | null;
    }): Promise<DedupeCheckResponse> => {
      return rawPost<DedupeCheckResponse>("/user-listings/dedupe-check", input);
    },
  });
}

export function useCreateUserListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      body: CreateUserListingBody,
    ): Promise<CreateUserListingResponse> => {
      return rawPost<CreateUserListingResponse>("/user-listings", body);
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: readToursToursGetQueryKey({
            query: { limit: 200, offset: 0, sort: "created_at_desc" },
          }),
        }),
        qc.invalidateQueries({
          queryKey: listFavoritesPropertiesFavoritesGetQueryKey({}),
        }),
      ]);
    },
  });
}

export function useSetUserListingVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      propertyKey: string;
      visibility: Visibility;
    }): Promise<CreateUserListingResponse> => {
      return rawPatch<CreateUserListingResponse>(
        `/user-listings/${encodeURIComponent(input.propertyKey)}/visibility`,
        { visibility: input.visibility },
      );
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

export function useDeleteUserListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (propertyKey: string): Promise<void> => {
      await rawDelete(`/user-listings/${encodeURIComponent(propertyKey)}`);
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: readToursToursGetQueryKey({
            query: { limit: 200, offset: 0, sort: "created_at_desc" },
          }),
        }),
        qc.invalidateQueries({
          queryKey: listFavoritesPropertiesFavoritesGetQueryKey({}),
        }),
      ]);
    },
  });
}
