/**
 * Astoria named-tower registry.
 *
 * Drives the static `/buildings/<slug>` programmatic-SEO landing pages for
 * the Halletts Point waterfront / Astoria Heights / Astoria West luxury
 * rental tower stock in Astoria, Queens. Tower set was prioritized to match
 * the highest-tenant-search-intent buildings already referenced (or
 * implied) by the content agent's `/nyc/astoria` hub page Concession Watch
 * table — Hallets Point Towers 1-3 (Durst), Astoria West (Cape Advisors),
 * and Astoria Lights (Heatherwood).
 *
 * Per repo policy: no mock data, no heuristic fallbacks. Where a fact is
 * not publicly knowable (per-unit fit-out details, current concessions on
 * specific lines), it is omitted rather than invented. Year, address,
 * floor count, and headline unit count come from publicly-published
 * leasing-site fact sheets and developer portfolio pages; rent ranges
 * echo the bands used in the content agent's `/nyc/astoria` rent-prices
 * spoke and S22 Astoria 2026 Concession Watch.
 *
 * Multi-tower precedent (S6 Edge / Northside Piers, S8 Jackson Park): a
 * complex with 2-3+ individual towers under one developer with unified
 * amenity programming is modeled as ONE building row at the canonical
 * Phase 1 address; body text + FAQs explicitly describe all towers and
 * their phasing. This keeps the dedupe layer clean while preserving the
 * tenant-search-intent for the brand name.
 */
import type {
  BuildingRegion,
  Faq,
  Tower,
  TransitStop,
  UnitMixRow,
} from "./towerTypes";

export type { Faq, TransitStop, UnitMixRow };

/**
 * Astoria narrowing of the shared {@link Tower} type. The neighborhood
 * field is restricted to the valid Astoria sub-areas referenced on the
 * hub page.
 */
export type AstoriaTower = Tower & {
  neighborhood:
    | "Halletts Point"
    | "Astoria Heights"
    | "Astoria Waterfront"
    | "Ditmars"
    | "Steinway"
    | "Broadway";
};

/** Per-region link + copy configuration consumed by `BuildingLandingTemplate`. */
export const ASTORIA_REGION: BuildingRegion = {
  key: "nyc",
  city: "Astoria",
  state: "NY",
  parentLabel: "NYC",
  parentHref: "/nyc-rent-by-neighborhood",
  hubLabel: "Astoria",
  hubHref: "/nyc/astoria",
  rentPricesHref: "/nyc/astoria/rent-prices",
  rentPricesButtonLabel: "Astoria rent prices (2026)",
  regionLabel: "Astoria",
  browseTitle: "Browse Live Astoria Listings",
  browseDescription:
    "See all currently-available rentals in Astoria — not just this building",
  browseHubButtonLabel: "Browse Astoria apartments",
  browseAggregatorPitch:
    "Wade Me Home aggregates Halletts Point, Astoria Heights, Ditmars, and Steinway listings from multiple sources, with a chat-style AI search that filters by N/W/R/M access, budget, and amenities in seconds.",
  relatedRentPricesEssay:
    "full Astoria rent breakdown including the Ditmars vs Broadway vs Steinway block guide and the May–August 2026 hunting plan",
  relatedBestTimeArea: "Astoria",
  brokerFee: {
    title: "No-fee under the NYC FARE Act",
    subtitle: "Landlord-side listings cannot charge tenants a broker fee",
    body: "{name} is leased directly by {developer} or by landlord-side brokers. Under New York City's FARE Act (effective June 2025), tenants cannot be charged a broker fee on landlord-side listings — so renting at {name} through any official channel is no-fee to the tenant. Most Astoria new-construction towers were already no-fee before the Act because institutional landlords used in-house leasing teams; the FARE Act primarily benefits renters in older Astoria walkup stock along Ditmars, Broadway, and Steinway.",
    toolHref: "/tools/fare-act-broker-fee-checker",
    toolLabel:
      "Check whether a specific listing should be no-fee under the FARE Act →",
  },
};

export const ASTORIA_TOWERS: AstoriaTower[] = [
  {
    slug: "hallets-point",
    buildingId: "f92ae66e-0ce4-40cb-a454-5465fb582e42",
    latitude: 40.7798,
    longitude: -73.9293,
    name: "Hallets Point",
    address: "10 Halletts Point, Astoria, NY 11102",
    neighborhood: "Halletts Point",
    yearCompleted: 2018,
    unitCount: 405,
    floors: 22,
    developer: "Durst Organization",
    tagline:
      "Durst's Halletts Point waterfront master plan — Phase 1 (Eagle West) opened 2018, 22 stories, 405 residences anchoring a 7-building, 2,400-unit campus.",
    description:
      "Hallets Point at 10 Halletts Point is the canonical address for The Durst Organization's seven-building rental master plan on the Halletts Point peninsula in Astoria, Queens — the largest single-developer rental campus on the Astoria waterfront. Phase 1 (Eagle West) opened in 2018 as a 22-story, 405-unit rental tower, with subsequent phases (Tower 2 / Eagle East, Tower 3, and the Phase 4-7 buildings) extending the master plan toward a planned 2,400+ residences when the campus is complete. The Halletts Point peninsula is bounded on three sides by the East River, with direct access to a new 2-acre waterfront park, the Halletts Cove ferry stop, and a renovated Astoria Houses retail corridor anchored by a Durst-built supermarket. Durst leases all phases through its in-house leasing team — no broker fee on direct leases — and the campus operates a unified amenity program across the towers.",
    amenities: [
      "2-acre waterfront park with East River esplanade access",
      "Halletts Cove NYC Ferry stop on-site",
      "Pool deck with Manhattan skyline views",
      "Multi-level fitness center",
      "Resident lounge and co-working space",
      "Children's playroom and game room",
      "On-site supermarket and retail corridor",
      "24-hour doorman and concierge",
      "Bicycle storage and on-site parking",
    ],
    transit: [
      {
        station: "Halletts Cove Ferry",
        lines: "NYC Ferry Astoria route",
        walkMinutes: 2,
      },
      { station: "Astoria Blvd", lines: "N W", walkMinutes: 14 },
      { station: "30 Av", lines: "N W", walkMinutes: 16 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-560", rentRange: "$2,800-$3,300" },
      {
        type: "1 Bedroom",
        sqftRange: "620-820",
        rentRange: "$3,100-$3,800",
      },
      {
        type: "2 Bedroom",
        sqftRange: "920-1,200",
        rentRange: "$4,400-$5,800",
      },
      {
        type: "3 Bedroom",
        sqftRange: "1,300-1,650",
        rentRange: "$6,400-$8,500",
      },
    ],
    faqs: [
      {
        question: "Where is Hallets Point located?",
        answer:
          "Hallets Point sits on the Halletts Point peninsula in northwest Astoria, Queens — bounded on three sides by the East River and on the south by Astoria Houses. The canonical address is 10 Halletts Point. The Halletts Cove NYC Ferry stop is on-site (2 minutes), and the nearest subway is the Astoria Blvd N/W station at roughly a 14-minute walk through the peninsula.",
      },
      {
        question: "How many towers are at Hallets Point?",
        answer:
          "The Durst Organization's Halletts Point master plan calls for seven rental buildings totaling 2,400+ residences when complete. Phase 1 (Eagle West, 22 stories, 405 units) opened in 2018; subsequent phases (Eagle East / Tower 2, Tower 3, and Phases 4-7) extend the campus along the peninsula. The towers share a unified amenity program, on-site park, and ferry stop.",
      },
      {
        question: "Is Hallets Point a no-fee building?",
        answer:
          "Yes — The Durst Organization leases Hallets Point through its in-house leasing team, so no broker fee is paid by the tenant on direct leases. Under the NYC FARE Act (effective June 2025), landlord-side listings cannot charge tenants broker fees regardless of channel.",
      },
      {
        question: "What does it cost to rent at Hallets Point?",
        answer:
          "2026 asking rents at Hallets Point typically run $2,800-$3,300 for a studio, $3,100-$3,800 for a 1-bedroom, $4,400-$5,800 for a 2-bedroom, and $6,400-$8,500 for a 3-bedroom. The waterfront tier of Astoria typically posts 1 month free + waived application fee on lease-up units; verify the current concession on each specific listing before signing.",
      },
      {
        question: "How is the commute from Hallets Point?",
        answer:
          "The fastest commute is the on-site Halletts Cove ferry stop (NYC Ferry Astoria route) — Astoria to East 34th Street takes ~24 minutes, and Astoria to Wall Street takes ~38 minutes. The Astoria Blvd N/W station is the nearest subway at ~14 minutes through the peninsula; the N/W trains reach Times Square in about 25 minutes from Astoria Blvd. The peninsula's only road egress connects to Astoria Boulevard and the RFK Bridge approach, so cars typically use the Hoyt Avenue / 21st Street corridor.",
      },
      {
        question: "How does Hallets Point compare to Astoria West?",
        answer:
          "Hallets Point (Durst, master plan, 22 stories Phase 1, 2018+) and Astoria West (Cape Advisors, 28 stories, 2018) are both Astoria new-construction rental towers from the same era but with very different transit profiles. Hallets Point sits on the waterfront with on-site ferry but a 14-minute walk to the N/W; Astoria West sits inland near 30th Avenue with closer subway access but no waterfront amenity. Pricing at the two towers is similar — Astoria West runs slightly higher for 1-bedrooms reflecting the closer subway position.",
      },
    ],
  },
  {
    slug: "astoria-west",
    buildingId: "8629e5e6-c85a-4907-9da3-66605fc9ae99",
    latitude: 40.7689,
    longitude: -73.9356,
    name: "Astoria West",
    address: "30-77 Vernon Blvd, Astoria, NY 11102",
    neighborhood: "Astoria Waterfront",
    yearCompleted: 2018,
    unitCount: 244,
    floors: 28,
    developer: "Cape Advisors",
    tagline:
      "Cape Advisors' 28-story Vernon Boulevard rental — 244 mixed-income residences with East River views and a 30 Av N/W subway commute.",
    description:
      "Astoria West at 30-77 Vernon Boulevard is a 28-story Cape Advisors rental tower completed in 2018 — the tallest residential building on the Astoria side of the East River outside the Halletts Point master plan and one of the few Astoria towers tall enough to deliver direct unobstructed Manhattan skyline views from the upper floors. The tower contains 244 residences mixed across studios through 2-bedrooms, including a 30% allocation to NYC affordable housing under the Mandatory Inclusionary Housing program. The building sits a 9-minute walk south of the 30 Av N/W subway station and a 7-minute walk west to the Astoria-Hunters Point border, putting it in walking distance of both the Astoria entertainment corridor along 30th Avenue and the Hunters Point waterfront park system. Astoria West's amenity program runs to a rooftop terrace, fitness center, and resident lounge — modest by Hallets Point standards but appropriate to the smaller unit count.",
    amenities: [
      "Rooftop terrace with Manhattan skyline views",
      "Multi-level fitness center",
      "Resident lounge with co-working space",
      "Children's playroom",
      "On-site retail at street level",
      "24-hour doorman",
      "Bicycle storage",
      "Cold-storage package room",
    ],
    transit: [
      { station: "30 Av", lines: "N W", walkMinutes: 9 },
      { station: "Broadway", lines: "N W", walkMinutes: 12 },
      {
        station: "Vernon Blvd-Jackson Av",
        lines: "7",
        walkMinutes: 14,
      },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "420-560", rentRange: "$2,700-$3,200" },
      {
        type: "1 Bedroom",
        sqftRange: "600-800",
        rentRange: "$3,100-$3,800",
      },
      {
        type: "2 Bedroom",
        sqftRange: "900-1,200",
        rentRange: "$4,300-$5,600",
      },
    ],
    faqs: [
      {
        question: "Where is Astoria West located?",
        answer:
          "Astoria West is at 30-77 Vernon Boulevard in the Astoria Waterfront sub-area of Astoria, Queens — between 31st Avenue to the south and the 30th Avenue corridor to the north. The 30 Av N/W subway station is a 9-minute walk; the Broadway N/W station is a 12-minute walk; the 7 train at Vernon Boulevard-Jackson Avenue (technically in Hunters Point / LIC) is a 14-minute walk south.",
      },
      {
        question: "When was Astoria West built?",
        answer:
          "Astoria West was completed in 2018 by Cape Advisors. The 28-story tower contains 244 residences and was one of the tallest Astoria-side rental deliveries of the 2010s development wave outside The Durst Organization's Halletts Point master plan.",
      },
      {
        question: "What does it cost to rent at Astoria West?",
        answer:
          "2026 asking rents at Astoria West typically run $2,700-$3,200 for a studio, $3,100-$3,800 for a 1-bedroom, and $4,300-$5,600 for a 2-bedroom. Approximately 30% of the units are allocated to NYC affordable housing under the Mandatory Inclusionary Housing program; market-rate inventory turns over more frequently and shows the broader rent range above.",
      },
      {
        question: "Is Astoria West a no-fee building?",
        answer:
          "Yes — Cape Advisors leases Astoria West through landlord-side channels, so under the NYC FARE Act (effective June 2025) tenants cannot be charged a broker fee on official listings. Verify the listing source before signing — if a third-party broker represents the tenant under a separate buyer-broker agreement, that agreement governs.",
      },
      {
        question: "How is the commute from Astoria West?",
        answer:
          "The 30 Av N/W subway station (9 minutes) reaches Times Square in about 22 minutes and Union Square in about 27 minutes. The N and W trains run on an elevated line along 31st Street, which is one of the more reliable subway lines in NYC. For Brooklyn or Lower Manhattan, the Vernon Boulevard-Jackson Avenue 7 train (14 minutes south) plus a transfer typically beats the Astoria N/W routing.",
      },
      {
        question: "How does Astoria West compare to Astoria Lights?",
        answer:
          "Astoria West (28 stories, 244 units, 2018, Cape Advisors) and Astoria Lights (multi-building, ~480 units, 2017-2018, Heatherwood) are both new-construction Astoria rentals from the same wave but very different in scale and character. Astoria West is a single tall tower with skyline views and a smaller resident community; Astoria Lights is a sprawling mid-rise courtyard community with a much larger amenity footprint and a quieter Astoria Heights position. Pricing at the two communities is comparable for studios and 1-bedrooms; 2-bedrooms at Astoria Lights typically run slightly lower per square foot reflecting the lower-rise construction.",
      },
    ],
  },
  {
    slug: "astoria-lights",
    buildingId: "970daabb-461f-4aa6-8741-22272bfd11cb",
    latitude: 40.7789,
    longitude: -73.9377,
    name: "Astoria Lights",
    address: "30-21 12th St, Astoria, NY 11102",
    neighborhood: "Astoria Heights",
    yearCompleted: 2017,
    unitCount: 480,
    floors: 7,
    developer: "Heatherwood Communities",
    tagline:
      "Heatherwood's multi-building Astoria Heights rental community — 480 residences across four mid-rise buildings with a courtyard amenity core.",
    description:
      "Astoria Lights at 30-21 12th Street is a Heatherwood Communities multi-building rental community completed in 2017-2018 — four mid-rise buildings (each 7 stories) arranged around a central courtyard amenity core in the Astoria Heights sub-area. The community contains approximately 480 residences across studios through 2-bedrooms and is one of the larger single-developer rental footprints in Astoria Heights, distinct from the high-rise waterfront stock at Halletts Point and Astoria West. Heatherwood operates an integrated leasing team and amenity program across all four buildings, with a courtyard-style outdoor amenity (firepits, grills, outdoor kitchen), a pool, and a fitness center shared across the community. The location is a 7-minute walk to the Astoria Boulevard N/W station and 12 minutes to the 30 Av N/W station, with Astoria Heights' more residential street character offering a quieter alternative to the 30th Avenue and Broadway commercial corridors.",
    amenities: [
      "Central courtyard with firepits, grills, and outdoor kitchen",
      "Outdoor swimming pool",
      "Multi-level fitness center",
      "Resident clubroom and co-working lounge",
      "Children's playroom",
      "Pet spa",
      "On-site garage parking",
      "Bicycle storage",
      "24-hour package concierge",
    ],
    transit: [
      { station: "Astoria Blvd", lines: "N W", walkMinutes: 7 },
      { station: "30 Av", lines: "N W", walkMinutes: 12 },
      { station: "Broadway", lines: "N W", walkMinutes: 15 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-580", rentRange: "$2,500-$3,000" },
      {
        type: "1 Bedroom",
        sqftRange: "620-820",
        rentRange: "$2,900-$3,500",
      },
      {
        type: "2 Bedroom",
        sqftRange: "920-1,200",
        rentRange: "$4,000-$5,200",
      },
    ],
    faqs: [
      {
        question: "Where is Astoria Lights located?",
        answer:
          "Astoria Lights is at 30-21 12th Street in the Astoria Heights sub-area of Astoria, Queens — north of 30th Avenue and east of 21st Street, in a quieter residential pocket between the Astoria Houses to the west and the Triborough Bridge approach to the north. The Astoria Boulevard N/W station is a 7-minute walk; the 30 Av N/W station is a 12-minute walk; the Broadway N/W station is a 15-minute walk.",
      },
      {
        question: "How many buildings are at Astoria Lights?",
        answer:
          "Astoria Lights is composed of four 7-story buildings arranged around a central courtyard amenity core, with approximately 480 residences in total across the community. Heatherwood operates a single integrated leasing team across all four buildings; the amenity programming (pool, fitness center, courtyard) is shared community-wide.",
      },
      {
        question: "What does it cost to rent at Astoria Lights?",
        answer:
          "2026 asking rents at Astoria Lights typically run $2,500-$3,000 for a studio, $2,900-$3,500 for a 1-bedroom, and $4,000-$5,200 for a 2-bedroom. Pricing typically tracks 5-10% below the Astoria waterfront tier (Hallets Point, Astoria West) at comparable unit sizes — a reflection of the Astoria Heights inland position and the lower-rise construction trade-off against the waterfront amenity.",
      },
      {
        question: "Is Astoria Lights a no-fee building?",
        answer:
          "Yes — Heatherwood Communities leases Astoria Lights through its in-house leasing team, so no broker fee is paid by the tenant on direct leases. Under the NYC FARE Act (effective June 2025), landlord-side listings cannot charge tenants broker fees regardless of channel.",
      },
      {
        question: "How is the commute from Astoria Lights?",
        answer:
          "The Astoria Boulevard N/W subway station (7 minutes) is the closest subway and reaches Times Square in about 26 minutes. Astoria Boulevard is the second-to-last stop on the Astoria-bound line, so seats are usually available for the morning Manhattan-bound commute. The 30 Av and Broadway stations (12-15 minutes) are alternatives if those are closer to the destination.",
      },
      {
        question: "How does Astoria Lights compare to Hallets Point?",
        answer:
          "Astoria Lights (Heatherwood, multi-building, 7 stories, 480 units, 2017-2018) and Hallets Point (Durst, master plan, 22+ stories, 2018+) are both Astoria-area new-construction rental communities but represent very different positions in the Astoria stack. Hallets Point sits on the waterfront with skyline views and an on-site ferry stop but with a 14-minute walk to the subway; Astoria Lights sits inland in Astoria Heights with closer subway access but no waterfront amenity. Pricing at Astoria Lights typically tracks 8-12% below Hallets Point at comparable unit sizes.",
      },
    ],
  },
];

/** Convenience: lookup by slug. Returns undefined if not in registry. */
export function getAstoriaTowerBySlug(
  slug: string,
): AstoriaTower | undefined {
  return ASTORIA_TOWERS.find((t) => t.slug === slug);
}

/** Convenience: every Astoria tower except the one with this slug. */
export function getOtherAstoriaTowers(slug: string): AstoriaTower[] {
  return ASTORIA_TOWERS.filter((t) => t.slug !== slug);
}
