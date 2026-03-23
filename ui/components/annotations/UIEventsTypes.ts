export type UIEventTabularPayload = {
  columns: string[];
  rows: (string | number)[][];
  query: string;
};

export enum UIEventsTypesEnum {
  PROPERTY_LISTINGS = "property_listings",
  SEARCH_HINT = "search_hint",
  SEARCH_SUMMARY = "search_summary",
  SEARCH_STATS = "search_stats",
  PROFILE_MEMORY_UPDATE = "profile_memory_update",
}

export type UIEventTypes = UIEventsTypesEnum;

export interface PropertyDataItem {
  name: string;
  address: string;
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
    limit_cap?: number | null;
    sort_note?: string | null;
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
  | UISearchStatsAnnotation
  | UIProfileMemoryUpdateAnnotation;
