export interface NycNeighborhoodMeta {
  slug: string;
  name: string;
  borough: string;
  latitude: number;
  longitude: number;
  radiusMiles: number;
  summary: string;
  medianRent1BR: number;
  medianStudio: number;
  medianRent2BR: number;
}

export const NYC_NEIGHBORHOODS: NycNeighborhoodMeta[] = [
  {
    slug: "williamsburg",
    name: "Williamsburg",
    borough: "Brooklyn",
    latitude: 40.7136,
    longitude: -73.961,
    radiusMiles: 1.0,
    summary:
      "North Brooklyn's premier rental neighborhood — L train, waterfront towers, Bedford Avenue restaurants and retail.",
    medianStudio: 2700,
    medianRent1BR: 3400,
    medianRent2BR: 4400,
  },
  {
    slug: "greenpoint",
    name: "Greenpoint",
    borough: "Brooklyn",
    latitude: 40.7295,
    longitude: -73.9555,
    radiusMiles: 1.0,
    summary:
      "Quieter waterfront counterpart to Williamsburg — G train, NYC Ferry, McCarren Park, newer luxury towers at Greenpoint Landing.",
    medianStudio: 2400,
    medianRent1BR: 3100,
    medianRent2BR: 4300,
  },
  {
    slug: "east-village",
    name: "East Village",
    borough: "Manhattan",
    latitude: 40.7265,
    longitude: -73.9815,
    radiusMiles: 0.8,
    summary:
      "Manhattan's dense, walkable East Village — 6 train, First Avenue restaurants, Tompkins Square Park, pre-war stock.",
    medianStudio: 2600,
    medianRent1BR: 3600,
    medianRent2BR: 4800,
  },
  {
    slug: "bushwick",
    name: "Bushwick",
    borough: "Brooklyn",
    latitude: 40.6942,
    longitude: -73.9212,
    radiusMiles: 1.0,
    summary:
      "Brooklyn's best-value L-train neighborhood — Morgan and Jefferson stops, converted industrial lofts, dense nightlife and arts scene.",
    medianStudio: 2100,
    medianRent1BR: 2700,
    medianRent2BR: 3400,
  },
  {
    slug: "astoria",
    name: "Astoria",
    borough: "Queens",
    latitude: 40.772,
    longitude: -73.9195,
    radiusMiles: 1.0,
    summary:
      "Queens' most-rented neighborhood — N/W train, Ditmars nightlife, Astoria Park, large pre-war stock and mid-rise rentals.",
    medianStudio: 1950,
    medianRent1BR: 2500,
    medianRent2BR: 3200,
  },
  {
    slug: "long-island-city",
    name: "Long Island City",
    borough: "Queens",
    latitude: 40.7447,
    longitude: -73.9485,
    radiusMiles: 1.0,
    summary:
      "LIC is Queens' waterfront high-rise zone — 7/E/M/G/N/W trains, Manhattan skyline views, Hunters Point and Court Square towers.",
    medianStudio: 2900,
    medianRent1BR: 3500,
    medianRent2BR: 5200,
  },
  {
    slug: "upper-west-side",
    name: "Upper West Side",
    borough: "Manhattan",
    latitude: 40.787,
    longitude: -73.9754,
    radiusMiles: 0.8,
    summary:
      "Classic Manhattan family rental neighborhood — 1/2/3/B/C trains, Central Park and Riverside Park frontage, pre-war doorman stock.",
    medianStudio: 2400,
    medianRent1BR: 3500,
    medianRent2BR: 4800,
  },
  {
    slug: "park-slope",
    name: "Park Slope",
    borough: "Brooklyn",
    latitude: 40.671,
    longitude: -73.9799,
    radiusMiles: 0.9,
    summary:
      "Brooklyn's family and stroller hub — F/G/R trains, Prospect Park, brownstone blocks, top public schools.",
    medianStudio: 2400,
    medianRent1BR: 3200,
    medianRent2BR: 4300,
  },
];

export function getNeighborhoodBySlug(
  slug: string
): NycNeighborhoodMeta | undefined {
  return NYC_NEIGHBORHOODS.find((n) => n.slug === slug);
}

export const UNDER_PRICE_TIERS = [2000, 2500, 3000, 3500, 4000] as const;

export type UnderPriceTier = (typeof UNDER_PRICE_TIERS)[number];

export function isValidUnderPriceTier(v: number): v is UnderPriceTier {
  return (UNDER_PRICE_TIERS as readonly number[]).includes(v);
}
