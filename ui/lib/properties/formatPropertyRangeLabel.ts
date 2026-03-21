const RANGE_SPLIT = /^(.+?)\s*[-–—]\s*(.+)$/u;

function parseLeadingMoneyValue(part: string): number | null {
  const normalized = part.replace(/,/g, "").trim();
  const m = normalized.match(/^\$?\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function normalizeBedroomComparable(part: string): string {
  const t = part.trim().toLowerCase();
  if (t === "studio") return "studio";
  return t.replace(/\s*(br|bedrooms?)\s*$/i, "").trim();
}

function preferBedroomLabel(a: string, b: string): string {
  const hasBedWord = (x: string) => /\b(br|bedrooms?)\b/i.test(x);
  if (hasBedWord(b) && !hasBedWord(a)) return b.trim();
  if (hasBedWord(a) && !hasBedWord(b)) return a.trim();
  return a.trim();
}

function polishBedroomLabel(s: string): string {
  return s.replace(/^1\s+bedrooms\b/i, "1 bedroom");
}

/** If we collapsed a bedroom count but the label is a bare number, add readable units. */
function expandCollapsedBedroomLabel(preferred: string, comparable: string): string {
  if (/\b(br|bedrooms?)\b/i.test(preferred)) return preferred;
  if (comparable === "studio") return "Studio";
  if (!/^\d+$/.test(comparable)) return preferred;
  const n = Number(comparable);
  if (!Number.isFinite(n) || n > 12) return preferred;
  if (n === 0) return "Studio";
  if (n === 1) return "1 bedroom";
  return `${n} bedrooms`;
}

function formatCollapsedBedroom(sameOrPreferred: string, comparable: string): string {
  return polishBedroomLabel(expandCollapsedBedroomLabel(sameOrPreferred, comparable));
}

/** Collapse ranges whose endpoints are the same (e.g. `$2k-$2k`, `2-2 BR`). */
export function formatPropertyRangeLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return value;

  const m = trimmed.match(RANGE_SPLIT);
  if (!m) return value;

  const rawA = m[1].trim();
  const rawB = m[2].trim();

  if (rawA === rawB) {
    const same = rawA;
    const comparable = normalizeBedroomComparable(same);
    return formatCollapsedBedroom(same, comparable);
  }

  const ba = normalizeBedroomComparable(rawA);
  const bb = normalizeBedroomComparable(rawB);
  if (ba !== "" && ba === bb) {
    const preferred = preferBedroomLabel(rawA, rawB);
    return formatCollapsedBedroom(preferred, ba);
  }

  const pa = parseLeadingMoneyValue(rawA);
  const pb = parseLeadingMoneyValue(rawB);
  if (pa !== null && pb !== null && pa === pb) return rawA;

  return value;
}
