export type UIEventTabularPayload = {
  columns: string[];
  rows: (string | number)[][];
  query: string;
};

export enum UIEventsTypesEnum {
  PROPERTY_LISTINGS = "property_listings",
  SEARCH_HINT = "search_hint",
}

export type UIEventTypes = UIEventsTypesEnum;

export interface PropertyDataItem {
  name: string;
  address: string;
  amenities: string[];
  rent_range: string;
  bedroom_range: string;
  images_urls: string[];
  main_amenities: string[];
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

export type UIEventsAnnotations = UIPropertyListingAnnotation | UISearchHintAnnotation;
