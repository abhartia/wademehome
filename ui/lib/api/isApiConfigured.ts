/** True when the UI can reach the backend (same env vars as Hey API client). */
export function isApiConfigured(): boolean {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_CHAT_API_URL ??
    "";
  return Boolean(base.trim());
}
