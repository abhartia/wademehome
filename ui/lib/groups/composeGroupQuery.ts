import type { GroupPreferences, GroupResponse } from "@/lib/groups/api";

function bedroomsLabel(
  minBeds: number | null | undefined,
  maxBeds: number | null | undefined,
): string | null {
  const lo = typeof minBeds === "number" ? minBeds : null;
  const hi = typeof maxBeds === "number" ? maxBeds : null;
  const fmt = (n: number) => (n === 0 ? "studio" : `${n} bed`);
  if (lo !== null && hi !== null) {
    if (lo === hi) return fmt(lo);
    return `${fmt(lo)} – ${fmt(hi)}`;
  }
  if (lo !== null) return `${fmt(lo)}+`;
  if (hi !== null) return `up to ${fmt(hi)}`;
  return null;
}

export function composeGroupQuery(
  group: Pick<GroupResponse, "name" | "preferences"> | null | undefined,
): string | null {
  if (!group) return null;
  const prefs: GroupPreferences = group.preferences;
  const parts: string[] = [];

  if (prefs.preferred_cities && prefs.preferred_cities.length > 0) {
    parts.push(`city: ${prefs.preferred_cities[0]}`);
  }
  const hasMinRent = typeof prefs.min_rent_usd === "number";
  const hasMaxRent = typeof prefs.max_rent_usd === "number";
  if (hasMinRent && hasMaxRent) {
    parts.push(`budget: $${prefs.min_rent_usd}–$${prefs.max_rent_usd}`);
  } else if (hasMaxRent) {
    parts.push(`budget: up to $${prefs.max_rent_usd}`);
  } else if (hasMinRent) {
    parts.push(`budget: at least $${prefs.min_rent_usd}`);
  }
  const beds = bedroomsLabel(prefs.min_beds, prefs.max_beds);
  if (beds) parts.push(`bedrooms: ${beds}`);

  if (prefs.preferred_neighborhoods && prefs.preferred_neighborhoods.length > 0) {
    parts.push(
      `priorities: ${prefs.preferred_neighborhoods.slice(0, 3).join(", ")}`,
    );
  }
  if (prefs.dealbreakers && prefs.dealbreakers.length > 0) {
    parts.push(`avoid: ${prefs.dealbreakers.slice(0, 3).join(", ")}`);
  }
  if (prefs.notes && prefs.notes.trim().length > 0) {
    parts.push(`notes: ${prefs.notes.trim()}`);
  }

  if (parts.length === 0) return null;
  return `Find listings for group "${group.name}". ${parts.join(" · ")}`;
}
