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
  {
    slug: "harlem",
    name: "Harlem",
    borough: "Manhattan",
    latitude: 40.8116,
    longitude: -73.9465,
    radiusMiles: 1.2,
    summary:
      "Manhattan's biggest value tier — 2/3/A/B/C/D trains, Central Park North, brownstones, Columbia and City College anchors, fastest-improving rental demand in uptown Manhattan.",
    medianStudio: 1900,
    medianRent1BR: 2600,
    medianRent2BR: 3500,
  },
  {
    slug: "chelsea",
    name: "Chelsea",
    borough: "Manhattan",
    latitude: 40.7465,
    longitude: -74.0014,
    radiusMiles: 0.7,
    summary:
      "Manhattan's walk-everywhere core — 1/C/E/F/M trains, High Line, Hudson Yards edge, Chelsea Market, luxury new-construction towers mixed with pre-war walkups.",
    medianStudio: 3100,
    medianRent1BR: 4300,
    medianRent2BR: 5800,
  },
  {
    slug: "lower-east-side",
    name: "Lower East Side",
    borough: "Manhattan",
    latitude: 40.7186,
    longitude: -73.9879,
    radiusMiles: 0.7,
    summary:
      "Manhattan's tenement-core south of Houston — F/J/M/Z trains, Essex Crossing new luxury, Orchard/Ludlow nightlife, Two Bridges waterfront, the largest pre-war walkup district below 14th.",
    medianStudio: 2500,
    medianRent1BR: 3400,
    medianRent2BR: 4700,
  },
  {
    slug: "bed-stuy",
    name: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    latitude: 40.6872,
    longitude: -73.9418,
    radiusMiles: 1.2,
    summary:
      "Brooklyn's biggest brownstone neighborhood — A/C/G/J/M/Z trains, Stuyvesant Heights landmark district, hundreds of pre-1900 brownstone blocks, the largest concentration of rent-stabilized 2-4 unit walkups in the borough.",
    medianStudio: 1950,
    medianRent1BR: 2700,
    medianRent2BR: 3500,
  },
  {
    slug: "flatbush",
    name: "Flatbush",
    borough: "Brooklyn",
    latitude: 40.6429,
    longitude: -73.9618,
    radiusMiles: 1.4,
    summary:
      "Brooklyn's deepest value tier south of Prospect Park — B/Q/2/5 trains, Prospect-Lefferts Gardens, Ditmas Park Victorian district, the lowest 1BR median of any Brooklyn neighborhood with direct Manhattan subway access.",
    medianStudio: 1800,
    medianRent1BR: 2300,
    medianRent2BR: 3100,
  },
  {
    slug: "forest-hills",
    name: "Forest Hills",
    borough: "Queens",
    latitude: 40.7196,
    longitude: -73.8448,
    radiusMiles: 1.0,
    summary:
      "Central Queens' commuter-luxury neighborhood — E/F/M/R express trains 12 minutes to Midtown, Forest Hills Gardens Tudor district, Austin Street retail spine, deep pre-war stabilized stock and 1930s art-deco doorman buildings.",
    medianStudio: 1850,
    medianRent1BR: 2400,
    medianRent2BR: 3300,
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
