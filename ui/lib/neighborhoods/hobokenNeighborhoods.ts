import { UNDER_PRICE_TIERS, type UnderPriceTier } from "./nycNeighborhoods";

export interface HobokenMeta {
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMiles: number;
  summary: string;
  medianStudio: number;
  medianRent1BR: number;
  medianRent2BR: number;
}

// Hoboken is one compact mile-square city served by one PATH station
// plus Hoboken Terminal. We treat it as a single area rather than
// slicing into sub-hoods the way we do for Jersey City.
export const HOBOKEN_AREA: HobokenMeta = {
  slug: "hoboken",
  name: "Hoboken",
  latitude: 40.7439,
  longitude: -74.0324,
  radiusMiles: 0.8,
  summary:
    "One-square-mile waterfront Hudson County city — Hoboken PATH (9 min to WTC, 12 min to 33rd St), NJ Transit at Hoboken Terminal, brownstone grid, walk-everywhere Washington Street, Stevens Tech anchor.",
  medianStudio: 2700,
  medianRent1BR: 3500,
  medianRent2BR: 4700,
};

export { UNDER_PRICE_TIERS };
export type { UnderPriceTier };
