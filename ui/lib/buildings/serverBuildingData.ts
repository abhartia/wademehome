/**
 * Server-side data loader for the `/buildings/<slug>` programmatic landing
 * pages. Fetches the live building record (review aggregates, current owner)
 * and currently-listed units near the building from the FastAPI backend.
 *
 * All fetches are best-effort: if `NEXT_PUBLIC_API_BASE_URL` is unset (build
 * time without a configured backend) or the backend is down, this returns
 * an empty payload and the calling page renders the static portion only.
 * No mock data, no heuristic fallbacks (per global user rules).
 */

import { listingsFetch } from "@/lib/listings/listingsApi";
import { fetchNearbyListingsServer } from "@/lib/listings/serverNearbyListings";
import type {
  BuildingDetailResponse,
  NearbyListingsResponse,
} from "@/lib/api/generated/types.gen";

export type BuildingLiveData = {
  detail: BuildingDetailResponse | null;
  nearby: NearbyListingsResponse | null;
};

function isApiBaseConfigured(): boolean {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_CHAT_API_URL ??
    "";
  return Boolean(apiBase) && !apiBase.startsWith("/");
}

export async function fetchBuildingDetailServer(
  buildingId: string,
): Promise<BuildingDetailResponse | null> {
  if (!isApiBaseConfigured()) return null;
  try {
    return await listingsFetch<BuildingDetailResponse>(
      `/buildings/${encodeURIComponent(buildingId)}`,
      { signal: AbortSignal.timeout(10_000) },
    );
  } catch {
    return null;
  }
}

/**
 * Fetch the building record and nearby live listings in parallel. The radius
 * is intentionally tight (default 0.05 mi ≈ 80 m) so the result captures
 * units in this specific tower rather than the surrounding hood. The
 * `/listings/nearby` endpoint dedupes one listing per building, so the
 * unit-level results are surfaced via property keys that map back to this
 * building.
 */
export async function fetchBuildingLiveData(opts: {
  buildingId: string;
  latitude: number;
  longitude: number;
  radiusMiles?: number;
}): Promise<BuildingLiveData> {
  // Default radius: 0.1 mi ≈ 160m. Tight enough to feel "at this building"
  // for SEO context, wide enough that West Chelsea / Hudson Yards towers
  // (where exact-building unit availability is sparse on any given day)
  // surface a few real listings rather than always being empty.
  const radius = opts.radiusMiles ?? 0.1;
  const [detail, nearby] = await Promise.all([
    fetchBuildingDetailServer(opts.buildingId),
    fetchNearbyListingsServer({
      latitude: opts.latitude,
      longitude: opts.longitude,
      radiusMiles: radius,
      limit: 12,
    }),
  ]);
  return { detail, nearby };
}
