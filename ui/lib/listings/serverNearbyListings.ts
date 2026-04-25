import { listingsFetch } from "@/lib/listings/listingsApi";
import type { NearbyListingsResponse as ApiNearbyListingsResponse } from "@/lib/api/generated/types.gen";

export type ServerNearbyListingsParams = {
  latitude: number;
  longitude: number;
  radiusMiles: number;
  maxRent?: number;
  minRent?: number;
  limit?: number;
};

function isApiBaseConfigured(): boolean {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_CHAT_API_URL ??
    "";
  // listingsFetch requires an absolute URL when called from the server
  // (no Next.js proxy is available during build / SSG). A relative or
  // empty base means the caller should skip server-side fetch and rely
  // on the client-side TanStack Query path instead.
  return Boolean(apiBase) && !apiBase.startsWith("/");
}

export async function fetchNearbyListingsServer(
  params: ServerNearbyListingsParams,
): Promise<ApiNearbyListingsResponse | null> {
  if (!isApiBaseConfigured()) return null;

  const qs = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    radius_miles: String(params.radiusMiles),
    limit: String(params.limit ?? 50),
  });
  if (typeof params.minRent === "number") qs.set("min_rent", String(params.minRent));
  if (typeof params.maxRent === "number") qs.set("max_rent", String(params.maxRent));

  try {
    return await listingsFetch<ApiNearbyListingsResponse>(
      `/listings/nearby?${qs.toString()}`,
      { signal: AbortSignal.timeout(10_000) },
    );
  } catch {
    return null;
  }
}
