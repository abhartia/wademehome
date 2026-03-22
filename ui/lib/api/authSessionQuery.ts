import { meAuthMeGetQueryKey } from "@/lib/api/generated/@tanstack/react-query.gen";
import { meAuthMeGet } from "@/lib/api/generated/sdk.gen";
import type { AuthResponse } from "@/lib/api/generated/types.gen";

/** Hey API query key for `GET /auth/me` (use for invalidation). */
export function authMeQueryKey() {
  return meAuthMeGetQueryKey({});
}

/**
 * Thrown when /auth/me is not a valid session. We must throw (not return null) so TanStack Query
 * enters `isError` and does not keep showing the previous success `data` after a 401.
 */
export class AuthSessionError extends Error {
  override readonly name = "AuthSessionError";
}

export async function fetchAuthSession(signal?: AbortSignal): Promise<AuthResponse> {
  const r = await meAuthMeGet({ throwOnError: false, signal });
  if (!r.response?.ok) {
    throw new AuthSessionError(
      r.response?.status === 401 ? "unauthorized" : `http_${String(r.response?.status ?? "?")}`,
    );
  }
  const parsed = (r.data ?? null) as AuthResponse | null;
  if (
    !parsed?.user?.id ||
    typeof parsed.user.id !== "string" ||
    !parsed.user.id.length ||
    typeof parsed.user.email !== "string" ||
    !parsed.user.email.length
  ) {
    throw new AuthSessionError("invalid_shape");
  }
  return parsed;
}
