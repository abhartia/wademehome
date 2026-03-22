"use client";

import { useMutation } from "@tanstack/react-query";
import { commuteMatrixListingsCommuteMatrixPostMutation } from "@/lib/api/generated/@tanstack/react-query.gen";
import type { CommuteMatrixResponse } from "@/lib/api/generated/types.gen";

export type { CommuteMatrixResponse };

export type LatLng = { latitude: number; longitude: number };

export function useCommuteMatrix() {
  return useMutation({
    ...commuteMatrixListingsCommuteMatrixPostMutation(),
  });
}
