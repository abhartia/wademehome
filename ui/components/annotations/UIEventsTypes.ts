export type UIEventTabularPayload = {
  columns: string[];
  rows: (string | number)[][];
  query: string;
};

export enum UIEventsTypesEnum {
  PROPERTY_LISTINGS = "property_listings",
  SEARCH_HINT = "search_hint",
  SEARCH_SUMMARY = "search_summary",
  SEARCH_PLAN = "search_plan",
  SEARCH_STATS = "search_stats",
  SEARCH_FILTER_BREAKDOWN = "search_filter_breakdown",
  PROFILE_MEMORY_UPDATE = "profile_memory_update",
}

export type UIEventTypes = UIEventsTypesEnum;

export interface PropertyDataItem {
  name: string;
  address: string;
  /** Original listing page URL scraped from the provider site (if available). */
  listing_url?: string | null;
  /** From listings row (e.g. units.parquet city) when available. */
  city?: string | null;
  state?: string | null;
  /** From listings row (e.g. zipcode / zip / postal_code). */
  zip_code?: string | null;
  amenities: string[];
  rent_range: string;
  bedroom_range: string;
  images_urls: string[];
  main_amenities: string[];
  /** One-line explanation of why this row matched the user's query (optional). */
  match_reason?: string | null;
  /** Dynamic validation phase from backend search stream. */
  validation_status?: "candidate" | "validating" | "confirmed" | "rejected" | null;
  validation_explanation?: string | null;
  validation_confidence?: number | null;
  latitude?: number;
  longitude?: number;
}

export interface UIPropertyListingAnnotation {
  type: UIEventsTypesEnum.PROPERTY_LISTINGS;
  data: {
    properties: PropertyDataItem[]
  }
}

export interface UISearchHintAnnotation {
  type: UIEventsTypesEnum.SEARCH_HINT;
  data: {
    suggest_account: boolean;
    reason?: string | null;
  };
}

export interface UISearchSummaryAnnotation {
  type: UIEventsTypesEnum.SEARCH_SUMMARY;
  data: {
    headline: string;
    bullets: string[];
  };
}

export interface UISearchStatsAnnotation {
  type: UIEventsTypesEnum.SEARCH_STATS;
  data: {
    returned_count: number;
    matched_count?: number | null;
    limit_cap?: number | null;
    sort_note?: string | null;
    parse_ms?: number | null;
    embed_ms?: number | null;
    db_ms?: number | null;
    breakdown_ms?: number | null;
    amenity_ms?: number | null;
    validation_ms?: number | null;
    total_ms?: number | null;
    semantic_candidates?: number | null;
    amenity_scored_count?: number | null;
    db_budget_exhausted?: boolean | null;
    amenity_budget_exhausted?: boolean | null;
    breakdown_deferred?: boolean | null;
    breakdown_ready?: boolean | null;
    breakdown_budget_exhausted?: boolean | null;
    validated_kept_count?: number | null;
    validated_dropped_count?: number | null;
    validation_cache_hits?: number | null;
    validation_cache_misses?: number | null;
    validation_completed_count?: number | null;
    validation_pending_count?: number | null;
    validation_budget_exhausted?: boolean | null;
  };
}

export interface UISearchPlanAnnotation {
  type: UIEventsTypesEnum.SEARCH_PLAN;
  data: {
    summary_headline: string;
    summary_bullets: string[];
  };
}

export interface UISearchFilterBreakdownAnnotation {
  type: UIEventsTypesEnum.SEARCH_FILTER_BREAKDOWN;
  data: {
    criteria: Array<{
      key: string;
      label: string;
      excluded_count: number;
      matched_count: number;
      eligible_without_this_rule?: number;
    }>;
  };
}

export interface UIProfileMemoryUpdateAnnotation {
  type: UIEventsTypesEnum.PROFILE_MEMORY_UPDATE;
  data: {
    patch: Record<string, unknown>;
    updated_fields: string[];
  };
}

export type UIEventsAnnotations =
  | UIPropertyListingAnnotation
  | UISearchHintAnnotation
  | UISearchSummaryAnnotation
  | UISearchPlanAnnotation
  | UISearchStatsAnnotation
  | UISearchFilterBreakdownAnnotation
  | UIProfileMemoryUpdateAnnotation;
