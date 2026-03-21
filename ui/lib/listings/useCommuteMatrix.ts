"use client";

import { useMutation } from "@tanstack/react-query";

import { getListingsApiBase, listingsFetch } from "./listingsApi";

export type LatLng = { latitude: number; longitude: number };

export type CommuteMatrixResponse = {
  origin_latitude: number;
  origin_longitude: number;
  legs: { label: string; minutes: number | null; distance_meters: number | null }[];
};

async function postCommuteMatrix(body: {
  origin: LatLng;
  destinations: LatLng[];
  labels: string[];
}): Promise<CommuteMatrixResponse> {
  const base = getListingsApiBase();
  if (!base) {
    throw new Error("Listings API base URL is not configured");
  }
  return listingsFetch<CommuteMatrixResponse>(`${base}/listings/commute-matrix`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function useCommuteMatrix() {
  return useMutation({
    mutationFn: postCommuteMatrix,
  });
}
