/**
 * Shared types for the `/buildings/<slug>` programmatic-SEO landing pages.
 *
 * The same `Tower` shape is reused across regional registries (Hudson Yards,
 * Newport JC, Hoboken). `BuildingRegion` carries the per-region links + copy
 * that vary between NYC and NJ pages — breadcrumbs, hub/rent-prices links,
 * region label, and broker-fee callout text (FARE Act for NYC, direct-leased
 * for NJ where the FARE Act does not apply).
 */

export type TransitStop = {
  /** Stop name as riders know it. */
  station: string;
  /** Subway / PATH / commuter-rail lines serving the stop. */
  lines: string;
  /** Walking distance from the building's main entrance, in minutes. */
  walkMinutes: number;
};

export type UnitMixRow = {
  type:
    | "Studio"
    | "1 Bedroom"
    | "2 Bedroom"
    | "3 Bedroom"
    | "Penthouse"
    | "Loft";
  /** Typical advertised square-foot range (e.g. "510-680"). */
  sqftRange: string;
  /** Typical asking rent range, in 2026 dollars (e.g. "$4,200-$5,200"). */
  rentRange: string;
};

export type Faq = {
  question: string;
  answer: string;
};

/**
 * Generic named-tower record used by `BuildingLandingTemplate`. Region-specific
 * narrowing (e.g. `neighborhood` allowed values) is layered on top in each
 * regional registry file.
 */
export type Tower = {
  slug: string;
  name: string;
  /** Street address INCLUDING city/state/zip — rendered in the page hero. */
  address: string;
  /** Display label for the neighborhood badge (e.g. "Chelsea", "Newport"). */
  neighborhood: string;
  yearCompleted: number;
  /**
   * Approximate residential unit count (per leasing-site fact sheets).
   * Use `0` for non-residential buildings (e.g. office towers covered to
   * absorb intent searches that conflate adjacent residential towers).
   */
  unitCount: number;
  /** Floor count (per leasing-site fact sheets). */
  floors: number;
  /** Developer / current owner-operator (publicly published). */
  developer: string;
  /** ~1-2 sentence positioning blurb shown above the page hero. */
  tagline: string;
  /** ~3-5 sentence narrative intro used in the page body. */
  description: string;
  /** ~5-9 publicly published amenity items. */
  amenities: string[];
  /** Walking-distance transit. */
  transit: TransitStop[];
  /** Typical unit mix + rent ranges. */
  unitMix: UnitMixRow[];
  /** 4-6 short tower-specific FAQs (used for both body + FAQ JSON-LD). */
  faqs: Faq[];
  /** Building hero / OG image (optional — pages render without if absent). */
  heroImage?: string;
  /**
   * UUID of the row in the `buildings` table. Pre-bootstrapped by
   * `api/scripts/bootstrap_named_towers.py` (idempotent — safe to re-run).
   * Used by the landing page to fetch live `/buildings/{id}` aggregates
   * (review count, avg rating, current owner) and to deep-link into the
   * existing `/buildings/[id]` reviews tool. Latitude / longitude are
   * stored separately so the page can call `/listings/nearby` server-side
   * without a second DB hit.
   */
  buildingId: string;
  latitude: number;
  longitude: number;
};

/**
 * Per-region copy + link configuration. Every regional registry exports one
 * of these alongside its tower array; the page shim passes both into
 * `<BuildingLandingTemplate>`.
 */
export type BuildingRegion = {
  /** Slug used in the breadcrumb second tier (e.g. "nyc"/"jersey-city"). */
  key: "nyc" | "jersey-city" | "hoboken";

  /** Used for JSON-LD PostalAddress.addressLocality. */
  city: string;
  /** Used for JSON-LD PostalAddress.addressRegion. */
  state: string;

  /** Top-tier breadcrumb link (parent of all hubs). */
  parentLabel: string;
  parentHref: string;

  /** Neighborhood hub link (Browse <hood> apartments). */
  hubLabel: string;
  hubHref: string;

  /** Rent-prices spoke under the hub. */
  rentPricesHref: string;
  rentPricesButtonLabel: string;

  /** Short label used in "Compare with Nearby Buildings" subtitle. */
  regionLabel: string;

  /** Browse-listings card copy. */
  browseTitle: string;
  browseDescription: string;
  browseHubButtonLabel: string;
  browseAggregatorPitch: string;

  /** Related-reading section copy. */
  relatedRentPricesEssay: string;
  /** "...{developer} and other ${relatedBestTimeArea} landlords..." */
  relatedBestTimeArea: string;

  /**
   * Broker-fee callout body. NYC towers reference the FARE Act + the
   * checker tool; NJ towers explain the (different) NJ status quo.
   */
  brokerFee: {
    title: string;
    subtitle: string;
    /**
     * Body paragraph. The template substitutes `{name}` → `tower.name` and
     * `{developer}` → `tower.developer` at render time.
     */
    body: string;
    toolHref: string | null;
    toolLabel: string | null;
  };
};

/**
 * Render `body` from a `BuildingRegion.brokerFee` config by substituting
 * the per-tower placeholders. Pure helper — no side effects.
 */
export function fillBrokerFeeBody(
  template: string,
  tower: Pick<Tower, "name" | "developer">,
): string {
  return template.replace(/\{name\}/g, tower.name).replace(/\{developer\}/g, tower.developer);
}
