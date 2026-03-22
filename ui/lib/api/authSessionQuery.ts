import { meAuthMeGetQueryKey } from "@/lib/api/generated/@tanstack/react-query.gen";
import { meAuthMeGet } from "@/lib/api/generated/sdk.gen";
import type { AuthResponse } from "@/lib/api/generated/types.gen";

/** Hey API query key for `GET /auth/me` (use for invalidation). */
export function authMeQueryKey() {
  return meAuthMeGetQueryKey({});
}

export async function fetchAuthSession(signal?: AbortSignal): Promise<AuthResponse | null> {
  const r = await meAuthMeGet({ throwOnError: false, signal });
  if (!r.response?.ok) return null;
  return (r.data ?? null) as AuthResponse | null;
}
