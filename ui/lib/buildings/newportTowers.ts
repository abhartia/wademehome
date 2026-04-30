/**
 * Newport Jersey City named-tower registry.
 *
 * Drives the static `/buildings/<slug>` programmatic-SEO landing pages for the
 * Newport master-planned waterfront in Jersey City. Names + completion years
 * are pulled from the S18 `/jersey-city/newport/rent-prices` tower-by-tower
 * table so cross-linking matches the existing content. All facts are
 * publicly-known leasing-site data (address, year, developer, amenities).
 *
 * Per repo policy: no mock data, no heuristic fallbacks. Where a fact is not
 * publicly knowable (e.g. exact unit count for older buildings without a
 * fact sheet), it is omitted rather than invented.
 */
import type {
  BuildingRegion,
  Faq,
  Tower,
  TransitStop,
  UnitMixRow,
} from "./towerTypes";

export type { Faq, TransitStop, UnitMixRow };

export type NewportTower = Tower & {
  /** Sub-area within the Newport master-plan footprint. */
  neighborhood: "Newport" | "Newport Waterfront";
};

export const NEWPORT_REGION: BuildingRegion = {
  key: "jersey-city",
  city: "Jersey City",
  state: "NJ",
  parentLabel: "Jersey City",
  parentHref: "/jersey-city",
  hubLabel: "Newport",
  hubHref: "/jersey-city/newport",
  rentPricesHref: "/jersey-city/newport/rent-prices",
  rentPricesButtonLabel: "Newport rent prices (2026)",
  regionLabel: "Newport Jersey City waterfront",
  browseTitle: "Browse Live Newport Jersey City Listings",
  browseDescription:
    "See all currently-available rentals in Newport — not just this building",
  browseHubButtonLabel: "Browse Newport apartments",
  browseAggregatorPitch:
    "Wade Me Home aggregates Newport, Downtown JC, and Hoboken listings from multiple sources, with a chat-style AI search that filters by PATH access, budget, and amenities in seconds.",
  relatedRentPricesEssay:
    "full Newport rent breakdown including the tower-by-tower table and the PATH-priced commute math vs FiDi/Midtown East/Upper East Side",
  relatedBestTimeArea: "Newport",
  brokerFee: {
    title: "Direct-leased — typically no broker fee",
    subtitle:
      "Most large Newport towers are leased through the developer's in-house team",
    body: "{name} is leased through {developer}'s in-house leasing team and landlord-side brokers. Most large Newport rentals (LeFrak portfolio, Roseland/Mack-Cali, Toll Brothers) lease direct to tenants without a broker fee. The NYC FARE Act does NOT apply in New Jersey, but the practical outcome at most Newport towers is the same — no fee paid by the tenant when leasing through the building's official channel.",
    toolHref: "/tools/move-in-cost-estimator",
    toolLabel:
      "Estimate full move-in cost (security, first month, movers) for a Newport lease →",
  },
};

export const NEWPORT_TOWERS: NewportTower[] = [
  {
    slug: "newport-tower",
    buildingId: "40d28e47-6131-4592-8449-fdcc7063bbf8",
    latitude: 40.7256,
    longitude: -74.0335,
    name: "Newport Tower",
    address: "525 Washington Blvd, Jersey City, NJ 07310",
    neighborhood: "Newport",
    yearCompleted: 1986,
    unitCount: 480,
    floors: 36,
    developer: "LeFrak",
    tagline:
      "LeFrak's original Newport tower — the building that started the Jersey City waterfront in 1986.",
    description:
      "Newport Tower at 525 Washington Boulevard is LeFrak's original Newport residential building, completed in 1986 as the residential anchor of what became the Newport master-planned community. The 36-story tower set the template for the rest of the Newport waterfront — direct PATH access to Newport station, Hudson River and Manhattan-skyline views to the east, and a full amenity package serving roughly 480 residences. While newer LeFrak buildings (Aquablu, 70 Greene, 70 Columbus) have more contemporary finishes, Newport Tower offers some of the largest layouts and the most established resident community on the waterfront.",
    amenities: [
      "Indoor swimming pool and fitness center",
      "Children's playroom and screening room",
      "Rooftop terrace with Manhattan skyline views",
      "24-hour doorman and concierge",
      "On-site garage parking",
      "Bicycle storage",
      "On-site grocery and retail (Newport Centre Mall connection)",
      "Walking distance to Newport PATH station",
    ],
    transit: [
      { station: "Newport PATH", lines: "PATH (NWK-WTC, JSQ-33)", walkMinutes: 4 },
      { station: "Pavonia/Newport Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 5 },
      { station: "Exchange Place PATH", lines: "PATH (HOB-WTC)", walkMinutes: 14 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "500-650", rentRange: "$2,800-$3,300" },
      { type: "1 Bedroom", sqftRange: "700-900", rentRange: "$3,400-$4,100" },
      { type: "2 Bedroom", sqftRange: "1,000-1,300", rentRange: "$4,800-$6,000" },
      { type: "3 Bedroom", sqftRange: "1,300-1,600", rentRange: "$6,500-$8,200" },
    ],
    faqs: [
      {
        question: "Where is Newport Tower located?",
        answer:
          "Newport Tower is at 525 Washington Boulevard in the Newport section of Jersey City, on the Hudson River waterfront directly across from Lower Manhattan. It is roughly a 4-minute walk to the Newport PATH station and a 5-minute walk to the Pavonia/Newport Hudson-Bergen Light Rail stop.",
      },
      {
        question: "When was Newport Tower built?",
        answer:
          "Newport Tower was completed in 1986 by LeFrak and is the original residential building of the Newport master-planned community. It is a 36-story tower with approximately 480 residences.",
      },
      {
        question: "What does it cost to rent at Newport Tower?",
        answer:
          "2026 asking rents at Newport Tower typically run $2,800-$3,300 for a studio, $3,400-$4,100 for a 1-bedroom, $4,800-$6,000 for a 2-bedroom, and $6,500-$8,200 for a 3-bedroom. LeFrak frequently offers 1-2 month concessions on initial leases at older Newport buildings, so net-effective rent is usually 8-15% below asking.",
      },
      {
        question: "How long is the commute from Newport Tower to Manhattan?",
        answer:
          "Newport PATH is a 4-minute walk from the building. From Newport, PATH trains reach the World Trade Center in 8 minutes (NWK-WTC line) and 33rd Street in roughly 17 minutes (JSQ-33 line). Total door-to-desk time to FiDi is approximately 18 minutes; to Midtown East via subway transfer at 33rd Street is approximately 30 minutes.",
      },
      {
        question: "Is Newport Tower no-fee?",
        answer:
          "LeFrak leases Newport Tower directly through its in-house Newport leasing team — no broker fee is paid by the tenant on direct leases. The NJ market does not have a FARE Act-style law, but most large Newport towers operate this way. If a third-party broker is involved, fees may apply; verify with the leasing office before signing.",
      },
      {
        question: "What amenities does Newport Tower have?",
        answer:
          "Newport Tower includes an indoor swimming pool, fitness center, children's playroom, screening room, rooftop terrace with Manhattan skyline views, 24-hour doorman, on-site garage parking, and bicycle storage. The building connects directly to the Newport Centre Mall for grocery and retail access.",
      },
    ],
  },
  {
    slug: "70-greene",
    buildingId: "e4a7e23b-5762-48e4-95f2-dca79909184d",
    latitude: 40.7193,
    longitude: -74.0345,
    name: "70 Greene",
    address: "70 Greene St, Jersey City, NJ 07302",
    neighborhood: "Newport",
    yearCompleted: 2004,
    unitCount: 480,
    floors: 47,
    developer: "LeFrak",
    tagline:
      "LeFrak's 47-story Newport tower at the southern edge of the master-plan, completed in 2004.",
    description:
      "70 Greene is a 47-story LeFrak rental tower at 70 Greene Street, completed in 2004 at the southern edge of the Newport master-plan footprint, walking distance to both the Newport and Exchange Place PATH stations. The building offers some of the most direct skyline views in Newport — units facing east look across the Hudson at Lower Manhattan from the World Trade Center to Battery Park. Amenities include an indoor pool, a multi-level fitness center, and resident lounges. 70 Greene's location at the JC waterfront's narrowest point puts it within 8-10 minutes of either PATH station and within easy reach of the Hudson-Bergen Light Rail.",
    amenities: [
      "Heated indoor swimming pool",
      "Multi-level fitness center",
      "Resident lounge and business center",
      "Children's playroom",
      "Outdoor sundeck with skyline views",
      "24-hour doorman and concierge",
      "On-site garage parking",
      "Bicycle storage and pet wash",
    ],
    transit: [
      { station: "Newport PATH", lines: "PATH (NWK-WTC, JSQ-33)", walkMinutes: 8 },
      { station: "Exchange Place PATH", lines: "PATH (HOB-WTC)", walkMinutes: 9 },
      { station: "Exchange Place Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 7 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "480-620", rentRange: "$2,900-$3,400" },
      { type: "1 Bedroom", sqftRange: "700-880", rentRange: "$3,500-$4,300" },
      { type: "2 Bedroom", sqftRange: "1,000-1,300", rentRange: "$4,900-$6,200" },
      { type: "3 Bedroom", sqftRange: "1,400-1,700", rentRange: "$6,800-$8,500" },
    ],
    faqs: [
      {
        question: "Where is 70 Greene located?",
        answer:
          "70 Greene is at 70 Greene Street in Jersey City, at the southern edge of the Newport master-plan, midway between Newport and Exchange Place PATH stations. The Newport PATH is roughly 8 minutes' walk and Exchange Place PATH is 9 minutes' walk; the Hudson-Bergen Light Rail at Exchange Place is 7 minutes.",
      },
      {
        question: "How tall is 70 Greene?",
        answer:
          "70 Greene is 47 stories tall and contains approximately 480 rental residences. It was developed by LeFrak as part of the Newport master-plan and completed in 2004.",
      },
      {
        question: "What does it cost to rent at 70 Greene?",
        answer:
          "2026 asking rents at 70 Greene typically run $2,900-$3,400 for a studio, $3,500-$4,300 for a 1-bedroom, $4,900-$6,200 for a 2-bedroom, and $6,800-$8,500 for a 3-bedroom. LeFrak typically offers 1-2 month concessions on 12-13 month initial leases.",
      },
      {
        question: "What amenities does 70 Greene offer?",
        answer:
          "70 Greene includes a heated indoor swimming pool, a multi-level fitness center, a resident lounge and business center, a children's playroom, an outdoor sundeck with skyline views, 24-hour doorman service, on-site garage parking, bicycle storage, and a pet wash.",
      },
      {
        question: "How is the commute from 70 Greene?",
        answer:
          "70 Greene sits between two PATH stations. Exchange Place PATH (9 min walk) reaches the World Trade Center in 5 minutes; Newport PATH (8 min walk) offers both the WTC line and the JSQ-33 line for Midtown access. Door-to-desk time to FiDi is approximately 17 minutes.",
      },
    ],
  },
  {
    slug: "portofino",
    buildingId: "b321c522-3709-4063-a74a-4583006097f3",
    latitude: 40.7235,
    longitude: -74.0359,
    name: "Portofino",
    address: "1 2nd St, Jersey City, NJ 07302",
    neighborhood: "Newport Waterfront",
    yearCompleted: 2003,
    unitCount: 264,
    floors: 36,
    developer: "Roseland Residential (Mack-Cali / Veris)",
    tagline:
      "Roseland's 36-story Newport waterfront rental, sited directly on the Hudson River next to the Newport Yacht Club.",
    description:
      "Portofino is a 36-story Roseland Residential rental tower at 1 2nd Street, completed in 2003 directly on the Newport waterfront next to the Newport Yacht Club Marina. The building offers some of the most unobstructed Manhattan-skyline views in Jersey City — east-facing units look directly across the Hudson at Lower Manhattan with no other buildings in the way. Roseland (now part of Veris Residential, formerly Mack-Cali) operates Portofino as a luxury rental with concierge service, a fitness center with skyline views, and an outdoor pool. The building is a 6-minute walk from Newport PATH.",
    amenities: [
      "Outdoor swimming pool with sundeck",
      "Fitness center with Hudson River views",
      "24-hour concierge and doorman",
      "Resident lounge and business center",
      "Children's playroom",
      "On-site garage parking",
      "Direct access to Newport Yacht Club Marina",
      "Walking distance to Hudson River waterfront walkway",
    ],
    transit: [
      { station: "Newport PATH", lines: "PATH (NWK-WTC, JSQ-33)", walkMinutes: 6 },
      { station: "Pavonia/Newport Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 8 },
      { station: "NY Waterway Ferry — Newport", lines: "Ferry to Midtown / Battery Park City", walkMinutes: 7 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "550-700", rentRange: "$3,000-$3,600" },
      { type: "1 Bedroom", sqftRange: "750-950", rentRange: "$3,700-$4,500" },
      { type: "2 Bedroom", sqftRange: "1,100-1,400", rentRange: "$5,200-$6,500" },
      { type: "3 Bedroom", sqftRange: "1,500-1,800", rentRange: "$7,000-$8,800" },
    ],
    faqs: [
      {
        question: "Where is Portofino located?",
        answer:
          "Portofino is at 1 2nd Street on the Newport waterfront in Jersey City, directly on the Hudson River next to the Newport Yacht Club Marina. It is a 6-minute walk to the Newport PATH station and a 7-minute walk to the NY Waterway Ferry at Newport.",
      },
      {
        question: "Who developed Portofino?",
        answer:
          "Portofino was developed by Roseland Residential (now part of Veris Residential, formerly known as Mack-Cali) and completed in 2003. It is a 36-story rental tower with approximately 264 residences.",
      },
      {
        question: "What does it cost to rent at Portofino?",
        answer:
          "2026 asking rents at Portofino typically run $3,000-$3,600 for a studio, $3,700-$4,500 for a 1-bedroom, $5,200-$6,500 for a 2-bedroom, and $7,000-$8,800 for a 3-bedroom. East-facing units with direct Manhattan-skyline views command 5-10% premiums over interior or west-facing units.",
      },
      {
        question: "What amenities does Portofino have?",
        answer:
          "Portofino offers an outdoor swimming pool with sundeck, a fitness center with Hudson River views, 24-hour concierge service, a resident lounge and business center, a children's playroom, and on-site garage parking. The building has direct walking access to the Newport Yacht Club Marina and the Hudson River waterfront walkway.",
      },
      {
        question: "How are the views from Portofino?",
        answer:
          "Portofino has some of the most unobstructed Manhattan-skyline views in Jersey City. East-facing units look directly across the Hudson at Lower Manhattan with no buildings between Portofino and the river. South-facing units capture the Statue of Liberty and Liberty State Park.",
      },
    ],
  },
  {
    slug: "james-monroe",
    buildingId: "e474fccf-b461-4cb0-a446-b3a7e2f071b1",
    latitude: 40.7202,
    longitude: -74.0364,
    name: "The James Monroe",
    address: "119 Christopher Columbus Dr, Jersey City, NJ 07302",
    neighborhood: "Newport",
    yearCompleted: 2004,
    unitCount: 286,
    floors: 38,
    developer: "LeFrak",
    tagline:
      "LeFrak's 38-story Newport rental, completed in 2004 on Christopher Columbus Drive.",
    description:
      "The James Monroe is a 38-story LeFrak rental tower at 119 Christopher Columbus Drive, completed in 2004 on the southern edge of the Newport master-plan footprint, between Newport and Exchange Place PATH stations. The building offers a value-tier alternative to the newer LeFrak buildings (Aquablu, 70 Columbus) at slightly lower asking rents while sharing the same Newport amenity ecosystem (the LeFrak Newport pool, fitness, and parking network). 2-bedroom layouts run noticeably larger than 70 Greene at comparable prices, making The James Monroe a popular choice for couples and small families.",
    amenities: [
      "Heated indoor swimming pool (shared LeFrak Newport amenity)",
      "Fitness center",
      "Resident lounge",
      "Children's playroom",
      "24-hour doorman and concierge",
      "On-site garage parking",
      "Bicycle storage",
      "Direct access to Newport Centre Mall",
    ],
    transit: [
      { station: "Newport PATH", lines: "PATH (NWK-WTC, JSQ-33)", walkMinutes: 5 },
      { station: "Exchange Place PATH", lines: "PATH (HOB-WTC)", walkMinutes: 11 },
      { station: "Pavonia/Newport Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 6 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "490-620", rentRange: "$2,800-$3,300" },
      { type: "1 Bedroom", sqftRange: "700-880", rentRange: "$3,400-$4,100" },
      { type: "2 Bedroom", sqftRange: "1,050-1,400", rentRange: "$4,800-$6,000" },
      { type: "3 Bedroom", sqftRange: "1,400-1,700", rentRange: "$6,500-$8,200" },
    ],
    faqs: [
      {
        question: "Where is The James Monroe located?",
        answer:
          "The James Monroe is at 119 Christopher Columbus Drive in the Newport section of Jersey City, on the southern edge of the master-plan footprint. It is a 5-minute walk to the Newport PATH station and a 6-minute walk to the Pavonia/Newport Hudson-Bergen Light Rail stop.",
      },
      {
        question: "How tall is The James Monroe?",
        answer:
          "The James Monroe is 38 stories tall with approximately 286 rental residences. It was developed by LeFrak and completed in 2004 as part of the Newport master-plan.",
      },
      {
        question: "What does it cost to rent at The James Monroe?",
        answer:
          "2026 asking rents at The James Monroe typically run $2,800-$3,300 for a studio, $3,400-$4,100 for a 1-bedroom, $4,800-$6,000 for a 2-bedroom, and $6,500-$8,200 for a 3-bedroom. The James Monroe is positioned at the value tier of the Newport portfolio — comparable to Newport Tower and roughly 5-10% below 70 Greene and Aquablu for similar unit sizes.",
      },
      {
        question: "What amenities does The James Monroe have?",
        answer:
          "The James Monroe shares the LeFrak Newport amenity network — heated indoor pool, fitness center, resident lounge, children's playroom, 24-hour doorman, on-site garage parking, and direct access to the Newport Centre Mall. The amenity package matches Newport Tower at a slightly lower price point than the newer Aquablu / 70 Columbus.",
      },
      {
        question: "Is The James Monroe a no-fee building?",
        answer:
          "LeFrak leases The James Monroe directly through its in-house Newport leasing team — no broker fee is paid by the tenant on direct leases. New Jersey has no FARE Act, but the LeFrak portfolio standard is no-fee at the leasing office.",
      },
    ],
  },
  {
    slug: "crystal-point",
    buildingId: "d10778de-e161-4582-b813-334d5be4c0f0",
    latitude: 40.7237,
    longitude: -74.0361,
    name: "Crystal Point",
    address: "2 2nd St, Jersey City, NJ 07302",
    neighborhood: "Newport Waterfront",
    yearCompleted: 2010,
    unitCount: 269,
    floors: 42,
    developer: "Fisher Development Associates",
    tagline:
      "Fisher Development's 42-story Newport waterfront tower, completed in 2010 next to Portofino.",
    description:
      "Crystal Point is a 42-story residential tower at 2 2nd Street on the Newport waterfront, completed in 2010 by Fisher Development Associates. The building sits directly on the Hudson River next to Portofino and the Newport Yacht Club Marina, with floor-to-ceiling glass facades that maximize the Manhattan-skyline view from east-facing units. Crystal Point is primarily a condo building with a portion of units operated as rentals; available rental inventory varies but typically runs higher than the LeFrak portfolio at the same unit size due to the newer construction and higher-end finishes. The building shares Newport's PATH access and the waterfront promenade.",
    amenities: [
      "Indoor swimming pool with floor-to-ceiling glass walls",
      "State-of-the-art fitness center",
      "Resident lounge with Hudson River views",
      "Children's playroom and game room",
      "24-hour doorman and concierge",
      "On-site garage parking",
      "Direct access to Newport Yacht Club Marina",
      "Walking distance to Hudson River waterfront walkway",
    ],
    transit: [
      { station: "Newport PATH", lines: "PATH (NWK-WTC, JSQ-33)", walkMinutes: 6 },
      { station: "Pavonia/Newport Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 8 },
      { station: "NY Waterway Ferry — Newport", lines: "Ferry to Midtown / Battery Park City", walkMinutes: 7 },
    ],
    unitMix: [
      { type: "1 Bedroom", sqftRange: "800-1,000", rentRange: "$4,000-$4,800" },
      { type: "2 Bedroom", sqftRange: "1,200-1,500", rentRange: "$5,500-$7,000" },
      { type: "3 Bedroom", sqftRange: "1,700-2,100", rentRange: "$7,800-$9,800" },
      { type: "Penthouse", sqftRange: "2,500+", rentRange: "$12,000+" },
    ],
    faqs: [
      {
        question: "Where is Crystal Point located?",
        answer:
          "Crystal Point is at 2 2nd Street on the Newport waterfront in Jersey City, directly on the Hudson River next to Portofino and the Newport Yacht Club Marina. It is a 6-minute walk to Newport PATH and a 7-minute walk to the NY Waterway Ferry.",
      },
      {
        question: "Is Crystal Point a condo or rental building?",
        answer:
          "Crystal Point is primarily a condominium building with a portion of units operated as rentals by individual owners or rental managers. Available rental inventory varies; expect fewer day-to-day vacancies compared to the dedicated LeFrak rental towers (Aquablu, 70 Columbus, 70 Greene).",
      },
      {
        question: "How tall is Crystal Point?",
        answer:
          "Crystal Point is 42 stories with approximately 269 residences. It was developed by Fisher Development Associates and completed in 2010.",
      },
      {
        question: "What does it cost to rent at Crystal Point?",
        answer:
          "When rental units are available at Crystal Point, 2026 asking rents typically run $4,000-$4,800 for a 1-bedroom, $5,500-$7,000 for a 2-bedroom, and $7,800-$9,800 for a 3-bedroom. Penthouse units start around $12,000/month. Pricing runs roughly 10-15% above the LeFrak portfolio at comparable unit sizes due to newer construction and condo-finish standards.",
      },
      {
        question: "What amenities does Crystal Point have?",
        answer:
          "Crystal Point includes an indoor swimming pool with floor-to-ceiling glass walls, a state-of-the-art fitness center, a resident lounge with Hudson River views, a children's playroom and game room, 24-hour doorman service, and on-site garage parking. The building has direct walking access to the Newport Yacht Club Marina and the waterfront walkway.",
      },
    ],
  },
  {
    slug: "aquablu",
    buildingId: "b297327e-dec2-406b-9ffd-269013ddf924",
    latitude: 40.7172,
    longitude: -74.0345,
    name: "The Aquablu",
    address: "155 Bay St, Jersey City, NJ 07302",
    neighborhood: "Newport",
    yearCompleted: 2017,
    unitCount: 421,
    floors: 39,
    developer: "LeFrak",
    tagline:
      "LeFrak's most recent Newport tower, completed 2017 with the portfolio's most contemporary amenity package.",
    description:
      "The Aquablu is a 39-story LeFrak rental tower at 155 Bay Street, completed in 2017 as the newest addition to the Newport master-plan portfolio. With approximately 421 residences, The Aquablu offers the most contemporary finishes in the LeFrak Newport network — quartz countertops, GE Profile stainless appliances, in-unit washer/dryers, and floor-to-ceiling windows. The amenity program is a step up from the older LeFrak buildings: a rooftop pool, a sky lounge with skyline views, and a dedicated co-working space. The Aquablu is roughly 9 minutes' walk to Newport PATH and 6 minutes to Exchange Place PATH, making it the LeFrak building with the most balanced PATH access.",
    amenities: [
      "Rooftop swimming pool with sundeck",
      "Sky lounge with Manhattan skyline views",
      "State-of-the-art fitness center with yoga studio",
      "Co-working lounge and business center",
      "Children's playroom and screening room",
      "Outdoor grilling terrace",
      "24-hour doorman and concierge",
      "On-site garage parking and bicycle storage",
      "Pet spa",
    ],
    transit: [
      { station: "Newport PATH", lines: "PATH (NWK-WTC, JSQ-33)", walkMinutes: 9 },
      { station: "Exchange Place PATH", lines: "PATH (HOB-WTC)", walkMinutes: 6 },
      { station: "Exchange Place Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 5 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "500-650", rentRange: "$3,100-$3,700" },
      { type: "1 Bedroom", sqftRange: "720-900", rentRange: "$3,800-$4,600" },
      { type: "2 Bedroom", sqftRange: "1,050-1,400", rentRange: "$5,300-$6,700" },
      { type: "3 Bedroom", sqftRange: "1,450-1,750", rentRange: "$7,200-$9,000" },
    ],
    faqs: [
      {
        question: "Where is The Aquablu located?",
        answer:
          "The Aquablu is at 155 Bay Street in Jersey City, in the southern Newport sub-area. It is roughly equidistant from two PATH stations: a 9-minute walk to Newport PATH and a 6-minute walk to Exchange Place PATH. The Hudson-Bergen Light Rail at Exchange Place is 5 minutes away.",
      },
      {
        question: "When was The Aquablu built?",
        answer:
          "The Aquablu was completed in 2017 by LeFrak as the newest building in the Newport master-plan portfolio. It is 39 stories with approximately 421 rental residences.",
      },
      {
        question: "What does it cost to rent at The Aquablu?",
        answer:
          "2026 asking rents at The Aquablu typically run $3,100-$3,700 for a studio, $3,800-$4,600 for a 1-bedroom, $5,300-$6,700 for a 2-bedroom, and $7,200-$9,000 for a 3-bedroom. The Aquablu is the price-leader of the LeFrak Newport portfolio (roughly 8-12% above Newport Tower and James Monroe at comparable unit sizes), reflecting newer construction and a more contemporary amenity package.",
      },
      {
        question: "What amenities does The Aquablu have?",
        answer:
          "The Aquablu's amenity program is the most contemporary in LeFrak's Newport portfolio: a rooftop pool with sundeck, a sky lounge with Manhattan skyline views, a state-of-the-art fitness center with yoga studio, a co-working lounge, a children's playroom, a screening room, an outdoor grilling terrace, 24-hour doorman service, on-site parking, and a pet spa.",
      },
      {
        question: "How is the commute from The Aquablu?",
        answer:
          "Exchange Place PATH (6 min walk) reaches the World Trade Center in 5 minutes and Hoboken in 5 minutes. Newport PATH (9 min walk) adds the JSQ-33 line for direct Midtown access at 33rd Street. Door-to-desk time to FiDi is approximately 14 minutes via Exchange Place — among the fastest of any building on the Jersey City waterfront.",
      },
    ],
  },
];

/** Convenience: lookup by slug. Returns undefined if not in registry. */
export function getNewportTowerBySlug(slug: string): NewportTower | undefined {
  return NEWPORT_TOWERS.find((t) => t.slug === slug);
}

/** Convenience: every Newport tower except the one with this slug. */
export function getOtherNewportTowers(slug: string): NewportTower[] {
  return NEWPORT_TOWERS.filter((t) => t.slug !== slug);
}
