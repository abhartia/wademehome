const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_CHAT_API_URL ?? "";

export function getListingsApiBase(): string {
  return API_BASE.replace(/\/$/, "");
}

export function listingsAuthHeaders(): Record<string, string> {
  const token = process.env.NEXT_PUBLIC_CHAT_API_TOKEN;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function listingsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getListingsApiBase();
  if (!base) {
    throw new Error("Listings API base URL is not configured");
  }
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const method = (init?.method ?? "GET").toUpperCase();
  const headers: Record<string, string> = { ...listingsAuthHeaders() };
  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }
  Object.assign(headers, init?.headers as Record<string, string> | undefined);
  const response = await fetch(url, {
    credentials: "include",
    headers,
    ...init,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}
