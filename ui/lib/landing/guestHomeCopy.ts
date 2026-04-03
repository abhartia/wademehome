/** Shared copy for guest home: server HTML, metadata, JSON-LD, and client sidebar (keep in sync). */

export const GUEST_HOME_H1 = "Search rentals and get through tours, paperwork, and move-in";

export const GUEST_HOME_LEAD =
  "Wade Me Home helps you find a place, book tours, and get through applications and move-in without losing track in a pile of tabs and attachments. Search on a map, describe what you want in your own words, and keep the messy parts in one workspace.";

export const GUEST_HOME_BULLETS = [
  "Sample homes show up on the map around a default browse area so you can get oriented before you commit to a search.",
  "Type a short query to pull live listings; search reads what you mean, not only checkbox filters.",
  "A free account is not just for this apartment hunt: it keeps your context while you live in the unit and picks back up when you move again, so every future search starts easier.",
  "When you need them, use clear steps for tours, roommates, guarantors, and move-in instead of guessing what comes next or which form goes where.",
] as const;

/** ~155–160 characters for meta description. */
export const GUEST_HOME_META_DESCRIPTION =
  "Wade Me Home: map search, AI-assisted listings, and tours through move-in. Your account supports your whole stay and your next move, not only this search.";

/* ── Move-in tab copy ── */

export const GUEST_MOVEIN_H1 = "Set up utilities, compare vendors, and move in without the chaos";

export const GUEST_MOVEIN_LEAD =
  "Compare real electricity, gas, internet, and moving providers by state. Track every move-in task in one checklist and document your apartment's condition to protect your security deposit.";

export const GUEST_MOVEIN_META_DESCRIPTION =
  "Wade Me Home: compare utility providers, book movers, and document move-in condition. Free tools for renters setting up a new apartment.";

export function guestHomeSiteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wademehome.com";
}
