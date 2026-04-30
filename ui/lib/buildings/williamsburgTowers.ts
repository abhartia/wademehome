/**
 * Williamsburg waterfront named-tower registry.
 *
 * Drives the static `/buildings/<slug>` programmatic-SEO landing pages for the
 * Williamsburg / North Williamsburg / South Williamsburg waterfront luxury
 * tower stock. Tower names + headline rent ranges come from the content
 * agent's S20-b Williamsburg Waterfront Tower-by-Tower Tier table on
 * `/nyc/williamsburg`, so cross-linking from the hub spoke to these landings
 * lands cleanly into a pre-existing reference table.
 *
 * Per repo policy: no mock data, no heuristic fallbacks. Where a fact is not
 * publicly knowable (exact resident-only amenities at a condo with mixed
 * rental inventory), it is omitted rather than invented. The 8th building in
 * the hub table ("Williamsburg Greenwich") was deliberately NOT bootstrapped
 * — it does not appear to map to a verifiable real building, so we skip it
 * rather than ship an invented building row.
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
 * Williamsburg narrowing of the shared {@link Tower} type. The neighborhood
 * field is restricted to the three valid sub-areas for this region.
 */
export type WilliamsburgTower = Tower & {
  neighborhood:
    | "Williamsburg Waterfront"
    | "North Williamsburg"
    | "South Williamsburg";
};

/** Per-region link + copy configuration consumed by `BuildingLandingTemplate`. */
export const WILLIAMSBURG_REGION: BuildingRegion = {
  key: "nyc",
  city: "Brooklyn",
  state: "NY",
  parentLabel: "NYC",
  parentHref: "/nyc-rent-by-neighborhood",
  hubLabel: "Williamsburg",
  hubHref: "/nyc/williamsburg",
  rentPricesHref: "/nyc/williamsburg/rent-prices",
  rentPricesButtonLabel: "Williamsburg rent prices (2026)",
  regionLabel: "Williamsburg waterfront",
  browseTitle: "Browse Live Williamsburg Listings",
  browseDescription:
    "See all currently-available rentals on the Williamsburg waterfront — not just this building",
  browseHubButtonLabel: "Browse Williamsburg apartments",
  browseAggregatorPitch:
    "Wade Me Home aggregates Williamsburg waterfront and interior listings from multiple sources, with a chat-style AI search that filters by L-train access, budget, and amenities in seconds.",
  relatedRentPricesEssay:
    "full Williamsburg rent breakdown including the waterfront tower-by-tower tier and the North/South/East block guide",
  relatedBestTimeArea: "Williamsburg",
  brokerFee: {
    title: "No-fee under the NYC FARE Act",
    subtitle: "Landlord-side listings cannot charge tenants a broker fee",
    body: "{name} is leased directly by {developer} or by landlord-side brokers. Under New York City's FARE Act (effective June 2025), tenants cannot be charged a broker fee on landlord-side listings — so renting at {name} through any official channel is no-fee to the tenant. Williamsburg waterfront towers were largely no-fee even before the Act because institutional landlords used in-house leasing teams; the FARE Act primarily benefits renters in older walkup stock east of Bedford.",
    toolHref: "/tools/fare-act-broker-fee-checker",
    toolLabel:
      "Check whether a specific listing should be no-fee under the FARE Act →",
  },
};

export const WILLIAMSBURG_TOWERS: WilliamsburgTower[] = [
  {
    slug: "one-domino-square",
    buildingId: "1f5cd972-6ef8-4b5f-9896-a72159261a01",
    latitude: 40.7136,
    longitude: -73.9683,
    name: "One Domino Square",
    address: "8 Domino Sq, Brooklyn, NY 11211",
    neighborhood: "Williamsburg Waterfront",
    yearCompleted: 2024,
    unitCount: 374,
    floors: 41,
    developer: "Two Trees Management",
    tagline:
      "Two Trees' SHoP-designed 41-story tower at the heart of the Domino Park master-plan — the highest-tier 2024 lease-up on the Williamsburg waterfront.",
    description:
      "One Domino Square is a 41-story Two Trees Management rental tower at 8 Domino Square, completed in 2024 as the residential anchor of the Domino Park master-plan on the former Domino Sugar Refinery site. Designed by SHoP Architects, the tower frames Domino Park to the west and the East River and Manhattan skyline beyond. With approximately 374 residences ranging from studios to 4-bedrooms (plus a small affordable-housing allocation under the city's MIH program), One Domino Square shipped with one of the most contemporary amenity programs on the waterfront — a rooftop pool with skyline views, a co-working lounge, and direct connection to Domino Park's two miles of riverfront promenade. Lease-up concessions ran 1-2 months free during the 2024-2025 lease-up phase.",
    amenities: [
      "Rooftop swimming pool with Manhattan skyline views",
      "Sky lounge with East River panorama",
      "State-of-the-art fitness center with yoga + Peloton studio",
      "Co-working lounge and private workrooms",
      "Children's playroom and game room",
      "24-hour doorman and concierge",
      "Direct access to Domino Park (two miles of riverfront promenade)",
      "Bicycle storage and pet spa",
    ],
    transit: [
      { station: "Marcy Av", lines: "J M Z", walkMinutes: 12 },
      { station: "Bedford Av", lines: "L", walkMinutes: 14 },
      { station: "South Williamsburg Ferry", lines: "NYC Ferry East River + South Brooklyn", walkMinutes: 6 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "450-600", rentRange: "$3,800-$4,500" },
      { type: "1 Bedroom", sqftRange: "650-850", rentRange: "$5,000-$5,800" },
      { type: "2 Bedroom", sqftRange: "950-1,300", rentRange: "$7,000-$9,000" },
      { type: "3 Bedroom", sqftRange: "1,400-1,800", rentRange: "$11,000-$14,500" },
    ],
    faqs: [
      {
        question: "Where is One Domino Square located?",
        answer:
          "One Domino Square is at 8 Domino Square in South Williamsburg, Brooklyn, on the East River waterfront within the Domino Park master-plan. The Marcy Avenue J/M/Z station is a 12-minute walk and the Bedford Avenue L station is a 14-minute walk; the South Williamsburg NYC Ferry stop on the river is a 6-minute walk to direct boats to Wall Street and East 34th Street.",
      },
      {
        question: "When was One Domino Square built?",
        answer:
          "One Domino Square was completed in 2024 by Two Trees Management as the third major residential building of the Domino Park master-plan (after 325 Kent and 260 Kent). The 41-story tower was designed by SHoP Architects and contains approximately 374 residences with a small share allocated to NYC affordable housing under the MIH program.",
      },
      {
        question: "What does it cost to rent at One Domino Square?",
        answer:
          "2026 asking rents at One Domino Square typically run $3,800-$4,500 for a studio, $5,000-$5,800 for a 1-bedroom, $7,000-$9,000 for a 2-bedroom, and $11,000-$14,500 for a 3-bedroom. As a 2024 lease-up, concessions ran 1-2 months free on 13-month leases through 2025; 2026 leases continue to see selective concessions on higher-floor inventory. Net effective rent is typically 6-12% below asking after concessions.",
      },
      {
        question: "Is One Domino Square a no-fee building?",
        answer:
          "Two Trees leases One Domino Square through its in-house leasing team — no broker fee is paid by the tenant on direct leases. Under the NYC FARE Act (June 2025), landlord-side listings cannot charge tenant broker fees regardless. If a third-party broker represents the tenant under a separate buyer-broker agreement, that agreement governs.",
      },
      {
        question: "What is the difference between One Domino Square and 325 Kent?",
        answer:
          "Both buildings are part of Two Trees' Domino Park master-plan but represent different generations: 325 Kent (2018) is a 16-story SHoP-designed copper-clad rental on the original Domino site, while One Domino Square (2024) is a 41-story tower with a more contemporary amenity program (rooftop pool, sky lounge, co-working). One Domino Square commands roughly a 10-15% premium at comparable unit sizes due to newer construction and higher floors with skyline views.",
      },
      {
        question: "How is the commute from One Domino Square?",
        answer:
          "Three transit options serve the building. The Marcy Avenue J/M/Z (12 min walk) reaches Lower Manhattan via the Williamsburg Bridge in 5 minutes. The Bedford Avenue L (14 min walk) reaches Manhattan's 14th Street corridor in 6 minutes. NYC Ferry's South Williamsburg dock (6 min walk) runs East River and South Brooklyn routes directly to Wall Street and East 34th Street.",
      },
    ],
  },
  {
    slug: "325-kent",
    buildingId: "4d985a86-63a1-4604-85c5-f2450ad9ef37",
    latitude: 40.7142,
    longitude: -73.9678,
    name: "325 Kent",
    address: "325 Kent Ave, Brooklyn, NY 11249",
    neighborhood: "Williamsburg Waterfront",
    yearCompleted: 2018,
    unitCount: 522,
    floors: 16,
    developer: "Two Trees Management",
    tagline:
      "Two Trees' first SHoP-designed Domino Park rental — copper-clad facade and a hole-in-the-middle courtyard, completed 2018.",
    description:
      "325 Kent is a 16-story Two Trees Management rental at 325 Kent Avenue, completed in 2018 as the first new-construction residential building of the Domino Park master-plan. Designed by SHoP Architects with a distinctive copper-clad facade and a square hole cut through the middle of the building (the courtyard above), 325 Kent contains approximately 522 residences with a 30% allocation to NYC affordable housing. It was the first major waterfront tower to deliver under the Domino redevelopment and remains one of the most architecturally recognizable buildings on the Williamsburg shoreline. Direct connection to Domino Park puts the riverfront promenade and dog runs at the front door.",
    amenities: [
      "Outdoor swimming pool with sundeck",
      "Indoor and outdoor fitness center",
      "Resident lounge and library",
      "Children's playroom",
      "Co-working space",
      "24-hour doorman and concierge",
      "Direct access to Domino Park",
      "Bicycle storage and pet wash",
    ],
    transit: [
      { station: "Marcy Av", lines: "J M Z", walkMinutes: 12 },
      { station: "Bedford Av", lines: "L", walkMinutes: 13 },
      { station: "South Williamsburg Ferry", lines: "NYC Ferry East River + South Brooklyn", walkMinutes: 5 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-580", rentRange: "$3,500-$4,100" },
      { type: "1 Bedroom", sqftRange: "620-820", rentRange: "$4,500-$5,400" },
      { type: "2 Bedroom", sqftRange: "900-1,200", rentRange: "$6,200-$7,800" },
      { type: "3 Bedroom", sqftRange: "1,300-1,600", rentRange: "$9,500-$12,000" },
    ],
    faqs: [
      {
        question: "Where is 325 Kent located?",
        answer:
          "325 Kent is at 325 Kent Avenue in South Williamsburg, Brooklyn, on the East River waterfront within the Domino Park master-plan. The Marcy Avenue J/M/Z station is a 12-minute walk; the South Williamsburg NYC Ferry stop on the river is a 5-minute walk.",
      },
      {
        question: "When was 325 Kent built?",
        answer:
          "325 Kent was completed in 2018 by Two Trees Management as the first new-construction residential building in the Domino Park master-plan. The 16-story tower was designed by SHoP Architects and contains approximately 522 residences, with roughly 30% allocated to NYC affordable housing under the MIH program.",
      },
      {
        question: "What does it cost to rent at 325 Kent?",
        answer:
          "2026 asking rents at 325 Kent typically run $3,500-$4,100 for a studio, $4,500-$5,400 for a 1-bedroom, $6,200-$7,800 for a 2-bedroom, and $9,500-$12,000 for a 3-bedroom. 325 Kent typically prices 8-15% below One Domino Square at comparable unit sizes, reflecting the older construction and lower-floor positioning. Concessions are less common than at active lease-ups but still appear on units with longer-than-30-day vacancies.",
      },
      {
        question: "Is 325 Kent a no-fee building?",
        answer:
          "Two Trees leases 325 Kent directly through its in-house leasing team — no broker fee is paid by the tenant on direct leases. Under the NYC FARE Act (June 2025), landlord-side listings cannot charge tenant broker fees regardless of the channel.",
      },
      {
        question: "What is the architectural significance of 325 Kent?",
        answer:
          "325 Kent's most distinctive feature is the square hole cut through the middle of the building — a design move by SHoP Architects that creates a courtyard several stories above the ground and frames a window of sky and skyline visible from Kent Avenue. The copper-clad facade has weathered to a deep brown patina, making the building visually distinct from the glass-curtain-wall standard of newer waterfront towers like One Domino Square or 260 Kent.",
      },
    ],
  },
  {
    slug: "260-kent",
    buildingId: "1d75193f-22c2-47ca-a646-b86204602319",
    latitude: 40.7152,
    longitude: -73.9659,
    name: "260 Kent",
    address: "260 Kent Ave, Brooklyn, NY 11249",
    neighborhood: "Williamsburg Waterfront",
    yearCompleted: 2025,
    unitCount: 250,
    floors: 22,
    developer: "Two Trees Management",
    tagline:
      "Bjarke Ingels Group's 22-story Domino Park rental — completed 2025 with sculptural balconies and direct river views.",
    description:
      "260 Kent is a 22-story Two Trees Management rental tower at 260 Kent Avenue, completed in 2025 as the BIG-designed (Bjarke Ingels Group) addition to the Domino Park master-plan. The building's signature feature is a stepped, sculptural facade with private balconies on most residences — a deliberate contrast to the glass-curtain-wall language of One Domino Square and the copper-clad geometry of 325 Kent. With approximately 250 residences directly facing Domino Park and the East River, 260 Kent commands some of the most direct skyline views in the Williamsburg waterfront stock. As a 2025 lease-up, concessions of 1-2 months free run on initial 13-month leases through the early 2026 lease-up phase.",
    amenities: [
      "Rooftop pool deck with East River views",
      "BIG-designed sky lounge",
      "Fitness center with private training studio",
      "Co-working space and library",
      "Children's playroom",
      "Outdoor sculpture garden (BIG-curated)",
      "24-hour doorman and concierge",
      "Direct access to Domino Park and riverfront promenade",
    ],
    transit: [
      { station: "Bedford Av", lines: "L", walkMinutes: 11 },
      { station: "Marcy Av", lines: "J M Z", walkMinutes: 14 },
      { station: "South Williamsburg Ferry", lines: "NYC Ferry East River + South Brooklyn", walkMinutes: 4 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "470-620", rentRange: "$3,900-$4,600" },
      { type: "1 Bedroom", sqftRange: "680-880", rentRange: "$4,800-$5,700" },
      { type: "2 Bedroom", sqftRange: "1,000-1,400", rentRange: "$7,200-$9,500" },
      { type: "3 Bedroom", sqftRange: "1,500-1,900", rentRange: "$11,500-$15,000" },
    ],
    faqs: [
      {
        question: "Where is 260 Kent located?",
        answer:
          "260 Kent is at 260 Kent Avenue in Williamsburg, Brooklyn, directly on the East River waterfront within the northern half of the Domino Park master-plan. The Bedford Avenue L station is an 11-minute walk and the South Williamsburg NYC Ferry stop is a 4-minute walk.",
      },
      {
        question: "When was 260 Kent built?",
        answer:
          "260 Kent was completed in 2025 by Two Trees Management as the third and most-recent residential building in the Domino Park master-plan. The 22-story tower was designed by Bjarke Ingels Group (BIG) and contains approximately 250 residences. It is currently in active lease-up.",
      },
      {
        question: "What does it cost to rent at 260 Kent?",
        answer:
          "2026 asking rents at 260 Kent typically run $3,900-$4,600 for a studio, $4,800-$5,700 for a 1-bedroom, $7,200-$9,500 for a 2-bedroom, and $11,500-$15,000 for a 3-bedroom. As a 2025 lease-up, concessions of 1-2 months free run on initial 13-month leases through early 2026; net effective rent is typically 8-15% below asking on lease-up units.",
      },
      {
        question: "What architectural firm designed 260 Kent?",
        answer:
          "260 Kent was designed by Bjarke Ingels Group (BIG), the Danish-American firm also known for the VIA 57 West tetrahedron in Manhattan and the Two World Trade Center proposal. The building's signature feature is a stepped, sculptural facade with private balconies on most residences — visually distinct from SHoP's adjacent 325 Kent (copper-clad) and One Domino Square (glass curtain wall).",
      },
      {
        question: "Is 260 Kent worth the lease-up premium?",
        answer:
          "260 Kent's lease-up concessions (1-2 months free on a 13-month lease) often bring net effective rent within 5-10% of comparable units at the older 325 Kent next door, while delivering a more contemporary amenity program (rooftop pool, BIG-designed sky lounge) and private balconies that do not exist in the 2018 stock. For renters prioritizing river-facing private outdoor space, 260 Kent's lease-up window is the rare cycle in which a new BIG building rents at a price competitive with the older Domino stock.",
      },
    ],
  },
  {
    slug: "the-william-vale",
    buildingId: "08bc9bfe-0977-4f6a-ab78-2e6a865d042d",
    latitude: 40.7220,
    longitude: -73.9605,
    name: "The William Vale",
    address: "111 N 12th St, Brooklyn, NY 11249",
    neighborhood: "North Williamsburg",
    yearCompleted: 2017,
    unitCount: 60,
    floors: 22,
    developer: "Riverside Developers",
    tagline:
      "Riverside's mixed-use 22-story tower in North Williamsburg combining a hotel, residential condos, and the city's largest hotel rooftop pool.",
    description:
      "The William Vale at 111 North 12th Street is a 22-story Riverside Developers mixed-use tower completed in 2017, combining a 183-key boutique hotel (operated by Arlo Hotels), approximately 60 residential condominium units, two restaurants (Westlight on the rooftop, Leuca on the ground floor), and the largest hotel rooftop pool in New York City. The residential portion shares the hotel's amenity package — including 24-hour concierge service and access to Westlight's panoramic Manhattan skyline rooftop. Most residential inventory is sold as condos rather than rented; rental availability appears intermittently when individual owners list units for lease, typically commanding a premium over comparable rental towers because of the hotel-grade amenity access.",
    amenities: [
      "Westlight rooftop bar with 360° Manhattan skyline views",
      "Largest hotel rooftop pool in NYC (shared with hotel guests)",
      "Hotel-grade concierge and 24-hour doorman",
      "On-site dining (Leuca restaurant by Andrew Carmellini)",
      "Fitness center",
      "Garden courtyard with public art installations",
      "Bicycle storage",
      "Walking distance to Domino Park and Bushwick Inlet Park",
    ],
    transit: [
      { station: "Bedford Av", lines: "L", walkMinutes: 7 },
      { station: "Nassau Av", lines: "G", walkMinutes: 12 },
      { station: "North Williamsburg Ferry", lines: "NYC Ferry East River", walkMinutes: 8 },
    ],
    unitMix: [
      { type: "1 Bedroom", sqftRange: "650-850", rentRange: "$4,200-$5,000" },
      { type: "2 Bedroom", sqftRange: "1,000-1,400", rentRange: "$6,500-$8,500" },
      { type: "3 Bedroom", sqftRange: "1,500-1,900", rentRange: "$10,000-$13,000" },
      { type: "Penthouse", sqftRange: "2,200+", rentRange: "$18,000+" },
    ],
    faqs: [
      {
        question: "Where is The William Vale located?",
        answer:
          "The William Vale is at 111 North 12th Street in North Williamsburg, Brooklyn, between Bushwick Inlet Park and the Berry Street commercial corridor. The Bedford Avenue L station is a 7-minute walk; the North Williamsburg NYC Ferry stop is an 8-minute walk.",
      },
      {
        question: "Is The William Vale a hotel, a condo, or a rental?",
        answer:
          "The William Vale is all three. The 22-story tower combines a 183-key boutique hotel operated by Arlo Hotels with approximately 60 residential condominium units. Most residential units are owner-occupied or owner-rented; available rentals appear intermittently as individual owners list units for lease. There is no large pool of dedicated rental inventory the way there is at One Domino Square or 325 Kent.",
      },
      {
        question: "What does it cost to rent at The William Vale?",
        answer:
          "When residential units are available at The William Vale, 2026 asking rents typically run $4,200-$5,000 for a 1-bedroom, $6,500-$8,500 for a 2-bedroom, $10,000-$13,000 for a 3-bedroom, and $18,000+ for the upper-floor penthouse layouts. Pricing runs roughly 10-20% above purpose-built waterfront rentals (325 Kent, One Domino Square) at comparable unit sizes, reflecting the hotel-grade amenity access.",
      },
      {
        question: "What is Westlight at The William Vale?",
        answer:
          "Westlight is the rooftop bar and restaurant on the 22nd floor of The William Vale, with 360° views of the Manhattan skyline, the East River, and Brooklyn. It is open to the public; residents have priority access through the building's lobby. The William Vale is also home to Leuca, an Andrew Carmellini-led ground-floor Italian restaurant.",
      },
      {
        question: "Does The William Vale have a pool residents can use?",
        answer:
          "Yes — The William Vale has the largest hotel rooftop pool in New York City, located on a deck above the lobby level. Residents share access with hotel guests; the pool is open seasonally (typically May through October) and is a featured amenity for both rental and condo residents.",
      },
    ],
  },
  {
    slug: "184-kent",
    buildingId: "1085b69a-3f88-43d0-ba65-5dfb74e611fd",
    latitude: 40.7180,
    longitude: -73.9617,
    name: "184 Kent",
    address: "184 Kent Ave, Brooklyn, NY 11249",
    neighborhood: "Williamsburg Waterfront",
    yearCompleted: 2010,
    unitCount: 338,
    floors: 8,
    developer: "Cayuga Capital Management",
    tagline:
      "Williamsburg's signature pre-war factory conversion — Cass Gilbert's 1913 Austin, Nichols & Co. warehouse turned 338-unit loft rental in 2010.",
    description:
      "184 Kent is an 8-story 338-unit loft rental at 184 Kent Avenue, converted from the 1913 Austin, Nichols & Co. warehouse designed by Cass Gilbert (the architect of the Woolworth Building). The conversion was completed in 2010 by Cayuga Capital Management and remains the defining pre-war factory conversion of the Williamsburg waterfront. Lofts feature 11-13 ft ceilings, oversized industrial windows facing the East River, exposed concrete columns, and floor plans that run noticeably larger than equivalent new-construction units across the street at 325 Kent or 260 Kent. The building does not have the rooftop-pool/sky-lounge amenity package of the post-2018 stock; instead it offers a 24-hour doorman, fitness center, resident lounge, and direct East River views from the upper floors.",
    amenities: [
      "11-13 ft ceiling heights with original industrial windows",
      "24-hour doorman and concierge",
      "Fitness center",
      "Resident lounge with Manhattan skyline views",
      "Children's playroom",
      "On-site garage parking (limited)",
      "Bicycle storage",
      "Walking distance to Domino Park and Bushwick Inlet Park",
    ],
    transit: [
      { station: "Bedford Av", lines: "L", walkMinutes: 9 },
      { station: "Marcy Av", lines: "J M Z", walkMinutes: 14 },
      { station: "North Williamsburg Ferry", lines: "NYC Ferry East River", walkMinutes: 7 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "550-750", rentRange: "$3,500-$4,200" },
      { type: "1 Bedroom", sqftRange: "800-1,100", rentRange: "$4,200-$5,200" },
      { type: "2 Bedroom", sqftRange: "1,200-1,500", rentRange: "$5,800-$7,200" },
      { type: "Loft", sqftRange: "900-1,400", rentRange: "$5,000-$7,000" },
    ],
    faqs: [
      {
        question: "Where is 184 Kent located?",
        answer:
          "184 Kent is at 184 Kent Avenue in Williamsburg, Brooklyn, on the East River waterfront between North 3rd and North 4th Streets. The Bedford Avenue L station is a 9-minute walk; the North Williamsburg NYC Ferry stop is a 7-minute walk.",
      },
      {
        question: "What is the history of 184 Kent?",
        answer:
          "184 Kent occupies the former Austin, Nichols & Co. warehouse, designed in 1913 by Cass Gilbert (architect of the Woolworth Building) for the grocery-distribution company Austin, Nichols & Co. The 8-story warehouse was converted to 338 rental lofts in 2010 by Cayuga Capital Management and is one of the largest pre-war factory conversions on the Williamsburg waterfront.",
      },
      {
        question: "What does it cost to rent at 184 Kent?",
        answer:
          "2026 asking rents at 184 Kent typically run $3,500-$4,200 for a studio, $4,200-$5,200 for a 1-bedroom, $5,800-$7,200 for a 2-bedroom, and $5,000-$7,000 for the larger loft layouts. Pricing runs roughly 10-15% below 325 Kent at comparable unit sizes, reflecting the older amenity package, but unit footprints are noticeably larger and ceiling heights are higher than any post-2018 waterfront new-construction.",
      },
      {
        question: "Are 184 Kent units true lofts?",
        answer:
          "Yes — 184 Kent units are true loft conversions of the original Austin, Nichols warehouse, with 11-13 ft ceilings, oversized industrial windows, exposed concrete columns, and open floor plans. Layouts typically include a kitchen island, an open living area, and either an enclosed bedroom (for one-bedrooms) or a flex sleeping space (for studios and lofts). Floor-plan variation is significant unit-to-unit because the building is a conversion rather than a new build.",
      },
      {
        question: "Does 184 Kent have a pool or rooftop?",
        answer:
          "184 Kent does not have a swimming pool or a rooftop deck — the conversion focused on preserving the warehouse's exterior and structural character rather than adding the post-2015 amenity layer common at One Domino Square or The Edge. Amenities are limited to a 24-hour doorman, fitness center, resident lounge, children's playroom, and on-site garage parking. For pool access, neighboring buildings or Williamsburg public-pool facilities are walking distance.",
      },
    ],
  },
  {
    slug: "the-edge",
    buildingId: "eeb75a1d-2bde-4d24-af38-d8db057b55fb",
    latitude: 40.7193,
    longitude: -73.9648,
    name: "The Edge",
    address: "22 N 6th St, Brooklyn, NY 11249",
    neighborhood: "North Williamsburg",
    yearCompleted: 2010,
    unitCount: 565,
    floors: 40,
    developer: "Douglaston Development",
    tagline:
      "Douglaston's twin 40-story towers at North 6th Street — the original wave of post-2010 Williamsburg waterfront luxury, with ~565 residences in Tower I.",
    description:
      "The Edge is a Douglaston Development twin-tower complex on the North Williamsburg waterfront, completed in 2010. Tower I at 22 North 6th Street stands 40 stories tall with approximately 565 residences; Tower II at 34 North 7th Street is also 40 stories with another ~466 residences. Together the complex contains over 1,000 condo + rental units, making The Edge one of the largest post-2010 residential developments on the East River. The buildings define the original wave of luxury Williamsburg towers — predating Domino Park's redevelopment by roughly 8 years. Amenities are extensive: an indoor pool, a residents-only fitness center, multiple resident lounges, and direct waterfront access. Most units are owner-occupied condos, but a significant rental pool is operated through individual owner listings and a limited Douglaston-managed rental block.",
    amenities: [
      "Indoor swimming pool with adjacent sundeck",
      "Multi-level residents-only fitness center",
      "Resident lounges with Manhattan skyline views",
      "Children's playroom and game room",
      "Outdoor courtyard and gardens",
      "24-hour doorman and concierge",
      "On-site garage parking",
      "Direct access to East River waterfront promenade",
    ],
    transit: [
      { station: "Bedford Av", lines: "L", walkMinutes: 5 },
      { station: "Marcy Av", lines: "J M Z", walkMinutes: 12 },
      { station: "North Williamsburg Ferry", lines: "NYC Ferry East River", walkMinutes: 4 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "480-620", rentRange: "$3,300-$3,900" },
      { type: "1 Bedroom", sqftRange: "650-880", rentRange: "$3,800-$4,600" },
      { type: "2 Bedroom", sqftRange: "1,000-1,300", rentRange: "$5,500-$7,000" },
      { type: "3 Bedroom", sqftRange: "1,400-1,800", rentRange: "$8,500-$11,000" },
    ],
    faqs: [
      {
        question: "Where is The Edge located?",
        answer:
          "The Edge is a twin-tower complex in North Williamsburg, Brooklyn. Tower I (the South Tower) is at 22 North 6th Street; Tower II (the North Tower) is at 34 North 7th Street. The Bedford Avenue L station is a 5-minute walk and the North Williamsburg NYC Ferry stop is a 4-minute walk — among the closest L-train and ferry access of any waterfront tower.",
      },
      {
        question: "How many units are at The Edge?",
        answer:
          "The Edge consists of two 40-story towers with a combined ~1,031 residences (approximately 565 in Tower I and 466 in Tower II). Most units are owner-occupied condominiums; a portion are rented out by individual owners or through a Douglaston-managed rental block. The complex was completed in 2010.",
      },
      {
        question: "What does it cost to rent at The Edge?",
        answer:
          "When rental units are available at The Edge, 2026 asking rents typically run $3,300-$3,900 for a studio, $3,800-$4,600 for a 1-bedroom, $5,500-$7,000 for a 2-bedroom, and $8,500-$11,000 for a 3-bedroom. Because most rental inventory is owner-listed rather than building-managed, pricing varies more unit-to-unit than at dedicated rental towers like One Domino Square or 325 Kent.",
      },
      {
        question: "What is the difference between The Edge and Northside Piers?",
        answer:
          "The Edge (22 N 6th St / 34 N 7th St, 2010, twin 40-story towers) and Northside Piers (1 N 4th Pl / 2 N 6th St / 4 N 5th Pl, 2009-2014, three 30-story towers) are the two main pre-Domino-redevelopment waterfront luxury complexes in North Williamsburg. The Edge towers are taller (40 stories vs 30) and slightly newer, while Northside Piers offers more horizontal spread across three buildings with separate amenity programs. Both are predominantly condominium with mixed rental inventory.",
      },
      {
        question: "Are The Edge units rentals or condos?",
        answer:
          "The Edge is predominantly a condominium — most units are owner-occupied. Rental inventory is operated by individual owners through third-party listing services or by a limited Douglaston-managed rental block. Expect more lease-by-lease pricing variation than at purpose-built rentals; verify listing source and broker fee under FARE Act before signing.",
      },
    ],
  },
  {
    slug: "northside-piers",
    buildingId: "15b3d0b9-83cc-4909-b186-6bb7f37a7478",
    latitude: 40.7172,
    longitude: -73.9637,
    name: "Northside Piers",
    address: "1 N 4th Pl, Brooklyn, NY 11249",
    neighborhood: "North Williamsburg",
    yearCompleted: 2010,
    unitCount: 449,
    floors: 30,
    developer: "Toll Brothers / L+M Development Partners",
    tagline:
      "Three 30-story towers built in waves from 2009-2014 — the first major waterfront luxury complex to deliver in Williamsburg post-rezoning.",
    description:
      "Northside Piers is a three-tower complex on the North Williamsburg waterfront developed by Toll Brothers City Living and L+M Development Partners. Tower I (1 North 4th Place) opened in 2009; Tower II (2 North 6th Street) opened in 2010; Tower III (4 North 5th Place) opened in 2014. The three towers contain a combined 449 residences across condominium and rental ownership, with a shared amenity park and direct access to the East River. Northside Piers was the first major waterfront luxury complex to deliver in Williamsburg following the 2005 rezoning, predating both The Edge and the Domino Park master-plan. Amenities are extensive: an indoor pool, fitness center, resident lounges, a screening room, and 30,000+ sq ft of shared outdoor space across the three towers.",
    amenities: [
      "Indoor swimming pool with sauna",
      "Multi-level fitness center",
      "Resident lounges and library",
      "Screening room and game room",
      "Children's playroom",
      "30,000+ sq ft of shared outdoor courtyards and gardens",
      "24-hour doorman and concierge",
      "On-site garage parking",
    ],
    transit: [
      { station: "Bedford Av", lines: "L", walkMinutes: 7 },
      { station: "Marcy Av", lines: "J M Z", walkMinutes: 13 },
      { station: "North Williamsburg Ferry", lines: "NYC Ferry East River", walkMinutes: 5 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "470-600", rentRange: "$3,200-$3,800" },
      { type: "1 Bedroom", sqftRange: "650-850", rentRange: "$3,800-$4,500" },
      { type: "2 Bedroom", sqftRange: "950-1,250", rentRange: "$5,300-$6,800" },
      { type: "3 Bedroom", sqftRange: "1,350-1,700", rentRange: "$8,000-$10,500" },
    ],
    faqs: [
      {
        question: "Where is Northside Piers located?",
        answer:
          "Northside Piers is a three-tower complex in North Williamsburg, Brooklyn. Tower I is at 1 North 4th Place, Tower II is at 2 North 6th Street, and Tower III is at 4 North 5th Place. The Bedford Avenue L station is a 7-minute walk; the North Williamsburg NYC Ferry stop is a 5-minute walk.",
      },
      {
        question: "When were the Northside Piers towers built?",
        answer:
          "Northside Piers was built in waves over five years. Tower I opened in 2009, Tower II in 2010, and Tower III in 2014. Each tower is 30 stories. The complex was the first major waterfront luxury delivery in Williamsburg following the 2005 rezoning that opened the East River shoreline to high-density residential development.",
      },
      {
        question: "What does it cost to rent at Northside Piers?",
        answer:
          "When rental units are available at Northside Piers, 2026 asking rents typically run $3,200-$3,800 for a studio, $3,800-$4,500 for a 1-bedroom, $5,300-$6,800 for a 2-bedroom, and $8,000-$10,500 for a 3-bedroom. Pricing runs roughly 5-10% below The Edge at comparable unit sizes, reflecting the slightly older construction in Towers I and II. Tower III (2014) commands a small premium over the older two towers.",
      },
      {
        question: "Are Northside Piers units rentals or condos?",
        answer:
          "Northside Piers is predominantly a condominium — most of the 449 residences are owner-occupied. Rental inventory is operated by individual owners through third-party listing services. Building-managed rental availability is limited; expect lease-by-lease pricing variation similar to The Edge.",
      },
      {
        question: "How does Northside Piers compare to One Domino Square?",
        answer:
          "Northside Piers (2009-2014, 30-story, predominantly condo) represents the first wave of Williamsburg waterfront luxury and is positioned in North Williamsburg adjacent to Bushwick Inlet Park. One Domino Square (2024, 41-story, dedicated rental) is part of the newer Domino Park master-plan in South Williamsburg with a more contemporary amenity program. Northside Piers prices roughly 25-35% below One Domino Square at comparable unit sizes, reflecting the older construction and condo-rental mixed inventory model.",
      },
    ],
  },
];

/** Convenience: lookup by slug. Returns undefined if not in registry. */
export function getWilliamsburgTowerBySlug(
  slug: string,
): WilliamsburgTower | undefined {
  return WILLIAMSBURG_TOWERS.find((t) => t.slug === slug);
}

/** Convenience: every Williamsburg tower except the one with this slug. */
export function getOtherWilliamsburgTowers(slug: string): WilliamsburgTower[] {
  return WILLIAMSBURG_TOWERS.filter((t) => t.slug !== slug);
}
