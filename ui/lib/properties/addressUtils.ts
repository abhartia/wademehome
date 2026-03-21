const ZIP_RE = /\b(\d{5})\b/;

export function extractZipFromAddress(address: string): string | null {
  const m = ZIP_RE.exec(address?.trim() ?? "");
  return m ? m[1] : null;
}

export function mapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function appleMapsUrl(address: string): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
}
