const KEY = "wdmh.pendingInviteToken";

export function setPendingInviteToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, token);
  } catch {}
}

export function consumePendingInviteToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    if (v) window.localStorage.removeItem(KEY);
    return v;
  } catch {
    return null;
  }
}

export function pendingInviteRedirectPath(): string | null {
  const token = consumePendingInviteToken();
  return token ? `/invites/accept?token=${encodeURIComponent(token)}` : null;
}
