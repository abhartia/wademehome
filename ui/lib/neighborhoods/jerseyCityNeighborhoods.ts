import { UNDER_PRICE_TIERS, type UnderPriceTier } from "./nycNeighborhoods";

export interface JcNeighborhoodMeta {
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

export const JC_NEIGHBORHOODS: JcNeighborhoodMeta[] = [
  {
    slug: "downtown",
    name: "Downtown Jersey City",
    latitude: 40.7178,
    longitude: -74.0431,
    radiusMiles: 0.7,
    summary:
      "07302 waterfront core — Grove Street PATH, Exchange Place, Paulus Hook brownstones, walk-everywhere restaurants and nightlife.",
    medianStudio: 3100,
    medianRent1BR: 3700,
    medianRent2BR: 5200,
  },
  {
    slug: "newport",
    name: "Newport",
    latitude: 40.7269,
    longitude: -74.0345,
    radiusMiles: 0.5,
    summary:
      "07310 waterfront high-rise zone — Newport PATH, full-service towers, Hudson River skyline views, Newport Centre mall.",
    medianStudio: 3300,
    medianRent1BR: 3750,
    medianRent2BR: 5100,
  },
  {
    slug: "journal-square",
    name: "Journal Square",
    latitude: 40.7334,
    longitude: -74.0627,
    radiusMiles: 0.6,
    summary:
      "07306 transit hub — Journal Square PATH (33rd/WTC), deepest concession market, new high-rises at Journal Squared and 90 Columbus.",
    medianStudio: 2700,
    medianRent1BR: 3200,
    medianRent2BR: 4400,
  },
];

export function getJcNeighborhoodBySlug(
  slug: string
): JcNeighborhoodMeta | undefined {
  return JC_NEIGHBORHOODS.find((n) => n.slug === slug);
}

export { UNDER_PRICE_TIERS };
export type { UnderPriceTier };
