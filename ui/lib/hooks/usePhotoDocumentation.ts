"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/generated/client.gen";
import type {
  MoveInPhoto,
  PhotoDocumentationSummary,
  PhotoRoom,
  PhotoRoomType,
} from "@/lib/types/movein";

/* ── helpers ── */

const BASE = "/move-in/photos";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await client.get({ url: path as never, throwOnError: true });
  return (res as { data: T }).data;
}

/* ── query keys ── */

const KEYS = {
  rooms: [BASE, "rooms"] as const,
  photos: (roomId: string) => [BASE, "photos", roomId] as const,
  summary: [BASE, "summary"] as const,
};

/* ── hook ── */

export function usePhotoDocumentation() {
  const qc = useQueryClient();

  /* ── rooms ── */
  const roomsQuery = useQuery({
    queryKey: KEYS.rooms,
    queryFn: () => fetchJson<PhotoRoom[]>(`${BASE}/rooms`),
  });

  /* ── summary ── */
  const summaryQuery = useQuery({
    queryKey: KEYS.summary,
    queryFn: () => fetchJson<PhotoDocumentationSummary>(`${BASE}/summary`),
  });

  /* ── create room ── */
  const createRoomMut = useMutation({
    mutationFn: async (body: { room_type: PhotoRoomType; room_label: string }) => {
      const res = await client.post({
        url: `${BASE}/rooms` as never,
        body,
        throwOnError: true,
      });
      return (res as { data: PhotoRoom }).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.rooms });
      qc.invalidateQueries({ queryKey: KEYS.summary });
    },
  });

  /* ── patch room ── */
  const patchRoomMut = useMutation({
    mutationFn: async ({
      roomId,
      body,
    }: {
      roomId: string;
      body: { room_label?: string; sort_order?: number };
    }) => {
      const res = await client.patch({
        url: `${BASE}/rooms/${roomId}` as never,
        body,
        throwOnError: true,
      });
      return (res as { data: PhotoRoom }).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.rooms });
    },
  });

  /* ── delete room ── */
  const deleteRoomMut = useMutation({
    mutationFn: async (roomId: string) => {
      await client.delete({
        url: `${BASE}/rooms/${roomId}` as never,
        throwOnError: true,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.rooms });
      qc.invalidateQueries({ queryKey: KEYS.summary });
    },
  });

  /* ── list photos for a room ── */
  function useRoomPhotos(roomId: string | null) {
    return useQuery({
      queryKey: KEYS.photos(roomId ?? ""),
      queryFn: () => fetchJson<MoveInPhoto[]>(`${BASE}/rooms/${roomId}/photos`),
      enabled: !!roomId,
    });
  }

  /* ── upload photo ── */
  const uploadPhotoMut = useMutation({
    mutationFn: async ({
      roomId,
      file,
      note,
      capturedAt,
      latitude,
      longitude,
    }: {
      roomId: string;
      file: File;
      note?: string;
      capturedAt?: string;
      latitude?: number;
      longitude?: number;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (note) formData.append("note", note);
      if (capturedAt) formData.append("captured_at", capturedAt);
      if (latitude != null) formData.append("latitude", String(latitude));
      if (longitude != null) formData.append("longitude", String(longitude));

      const res = await client.post({
        url: `${BASE}/rooms/${roomId}/photos` as never,
        body: formData as never,
        bodySerializer: (b: unknown) => b as BodyInit,
        headers: {},  // let browser set multipart boundary
        throwOnError: true,
      });
      return (res as { data: MoveInPhoto }).data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.photos(vars.roomId) });
      qc.invalidateQueries({ queryKey: KEYS.rooms });
      qc.invalidateQueries({ queryKey: KEYS.summary });
    },
  });

  /* ── patch photo note ── */
  const patchPhotoMut = useMutation({
    mutationFn: async ({
      photoId,
      note,
    }: {
      photoId: string;
      note: string;
    }) => {
      const res = await client.patch({
        url: `${BASE}/${photoId}` as never,
        body: { note },
        throwOnError: true,
      });
      return (res as { data: MoveInPhoto }).data;
    },
    onSuccess: () => {
      // Invalidate all photo lists since we don't know the roomId
      qc.invalidateQueries({ queryKey: [BASE] });
    },
  });

  /* ── delete photo ── */
  const deletePhotoMut = useMutation({
    mutationFn: async (photoId: string) => {
      await client.delete({
        url: `${BASE}/${photoId}` as never,
        throwOnError: true,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BASE] });
    },
  });

  /* ── public API ── */

  const addRoom = useCallback(
    (roomType: PhotoRoomType, roomLabel: string) =>
      createRoomMut.mutateAsync({ room_type: roomType, room_label: roomLabel }),
    [createRoomMut],
  );

  const removeRoom = useCallback(
    (roomId: string) => deleteRoomMut.mutateAsync(roomId),
    [deleteRoomMut],
  );

  const uploadPhoto = useCallback(
    (args: Parameters<typeof uploadPhotoMut.mutateAsync>[0]) =>
      uploadPhotoMut.mutateAsync(args),
    [uploadPhotoMut],
  );

  const updatePhotoNote = useCallback(
    (photoId: string, note: string) =>
      patchPhotoMut.mutateAsync({ photoId, note }),
    [patchPhotoMut],
  );

  const removePhoto = useCallback(
    (photoId: string) => deletePhotoMut.mutateAsync(photoId),
    [deletePhotoMut],
  );

  return {
    rooms: roomsQuery.data ?? [],
    roomsLoading: roomsQuery.isLoading,
    summary: summaryQuery.data ?? null,
    addRoom,
    removeRoom,
    patchRoom: patchRoomMut.mutateAsync,
    uploadPhoto,
    uploading: uploadPhotoMut.isPending,
    updatePhotoNote,
    removePhoto,
    useRoomPhotos,
  };
}
