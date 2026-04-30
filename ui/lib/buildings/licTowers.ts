/**
 * Long Island City named-tower registry.
 *
 * Drives the static `/buildings/<slug>` programmatic-SEO landing pages for the
 * Court Square / Hunters Point / Queens Plaza luxury rental tower stock in
 * Long Island City, Queens. Tower set was prioritized to match the highest-
 * tenant-search-intent buildings already referenced (or implied) by the
 * content agent's `/nyc/long-island-city` hub page — Skyline Tower, the
 * Hayden, Jackson Park, Linc LIC, Eagle Lofts, Sven, ALTA LIC.
 *
 * Per repo policy: no mock data, no heuristic fallbacks. Where a fact is not
 * publicly knowable (per-unit fit-out details, current concessions on
 * specific lines), it is omitted rather than invented. Year, address, floor
 * count, and headline unit count come from publicly-published leasing-site
 * fact sheets and the Wikipedia "List of tallest buildings in Queens" entry
 * for each tower; rent ranges echo the bands already used in the content
 * agent's S15 LIC rent-prices spoke and S21 LIC Tower Concession Watch.
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
 * LIC narrowing of the shared {@link Tower} type. The neighborhood field is
 * restricted to the four valid LIC sub-areas referenced on the hub page.
 */
export type LicTower = Tower & {
  neighborhood:
    | "Court Square"
    | "Hunters Point"
    | "Queens Plaza"
    | "Hallets Point";
};

/** Per-region link + copy configuration consumed by `BuildingLandingTemplate`. */
export const LIC_REGION: BuildingRegion = {
  key: "nyc",
  city: "Long Island City",
  state: "NY",
  parentLabel: "NYC",
  parentHref: "/nyc-rent-by-neighborhood",
  hubLabel: "Long Island City",
  hubHref: "/nyc/long-island-city",
  rentPricesHref: "/nyc/long-island-city/rent-prices",
  rentPricesButtonLabel: "LIC rent prices (2026)",
  regionLabel: "Long Island City",
  browseTitle: "Browse Live LIC Listings",
  browseDescription:
    "See all currently-available rentals in Long Island City — not just this building",
  browseHubButtonLabel: "Browse LIC apartments",
  browseAggregatorPitch:
    "Wade Me Home aggregates Court Square, Hunters Point, and Queens Plaza listings from multiple sources, with a chat-style AI search that filters by 7/E/M/G access, budget, and amenities in seconds.",
  relatedRentPricesEssay:
    "full LIC rent breakdown including the Court Square / Hunters Point / Hallets Point sub-area tier and the May–August 2026 hunting plan",
  relatedBestTimeArea: "Long Island City",
  brokerFee: {
    title: "No-fee under the NYC FARE Act",
    subtitle: "Landlord-side listings cannot charge tenants a broker fee",
    body: "{name} is leased directly by {developer} or by landlord-side brokers. Under New York City's FARE Act (effective June 2025), tenants cannot be charged a broker fee on landlord-side listings — so renting at {name} through any official channel is no-fee to the tenant. Most LIC luxury towers were already no-fee before the Act because institutional landlords used in-house leasing teams; the FARE Act primarily benefits renters in older walkup stock east of 21st Street.",
    toolHref: "/tools/fare-act-broker-fee-checker",
    toolLabel:
      "Check whether a specific listing should be no-fee under the FARE Act →",
  },
};

export const LIC_TOWERS: LicTower[] = [
  {
    slug: "skyline-tower",
    buildingId: "82d0c716-a86c-4463-87e0-49dcd0b39523",
    latitude: 40.7475,
    longitude: -73.9462,
    name: "Skyline Tower",
    address: "23-15 44th Dr, Long Island City, NY 11101",
    neighborhood: "Court Square",
    yearCompleted: 2021,
    unitCount: 802,
    floors: 67,
    developer: "FSA Capital / Risland US / United Construction & Development",
    tagline:
      "67-story Court Square condominium tower — at 778 ft, the tallest residential building in Queens.",
    description:
      "Skyline Tower at 23-15 44th Drive is a 67-story Court Square condominium tower completed in 2021 by a partnership of FSA Capital, Risland US Holdings, and United Construction & Development. At 778 feet, it was the tallest residential building in Queens at the time of completion (now matched and overtaken by other Court Square towers under construction). The tower's 802 condominium residences are arranged across studios through 3-bedroom layouts, with skyline views of Manhattan to the west and the Citi Tower (One Court Square) directly across the street. Skyline Tower is sold rather than leased — but a substantial pool of investor-owned units is rented through individual owners, so available rental inventory is constant if uneven. The tower's amenity floor on the 22nd story spans 75,000 square feet and remains one of the largest amenity programs in any Queens building.",
    amenities: [
      "75,000 sq ft amenity floor on the 22nd floor",
      "Indoor swimming pool with spa and sauna",
      "Multi-level fitness center with yoga and Peloton studio",
      "Children's playroom and library",
      "Co-working lounge and business center",
      "Outdoor terrace with Manhattan skyline views",
      "24-hour doorman and concierge",
      "On-site garage parking and bicycle storage",
    ],
    transit: [
      { station: "Court Sq", lines: "7 E M G", walkMinutes: 3 },
      { station: "Queens Plaza", lines: "E M R", walkMinutes: 8 },
      { station: "Hunterspoint Av", lines: "7 LIRR", walkMinutes: 9 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-580", rentRange: "$3,200-$3,800" },
      { type: "1 Bedroom", sqftRange: "650-880", rentRange: "$3,800-$4,600" },
      { type: "2 Bedroom", sqftRange: "1,000-1,400", rentRange: "$5,500-$7,200" },
      { type: "3 Bedroom", sqftRange: "1,500-1,900", rentRange: "$8,500-$11,000" },
    ],
    faqs: [
      {
        question: "Where is Skyline Tower located?",
        answer:
          "Skyline Tower is at 23-15 44th Drive in Court Square, Long Island City, Queens — directly across 44th Drive from One Court Square (the former Citicorp building). The Court Square station with 7, E, M, and G service is a 3-minute walk; Hunterspoint Avenue (7 + LIRR Main Line) is a 9-minute walk.",
      },
      {
        question: "How tall is Skyline Tower?",
        answer:
          "Skyline Tower is 67 stories and 778 feet tall — at the time of its 2021 completion, it was the tallest residential building in Queens. It remains one of the three tallest Queens residential towers along with Sven (29-59 Northern Blvd, 762 ft) and The Orchard (27-48 Jackson Ave, 811 ft, topping out 2024).",
      },
      {
        question: "Is Skyline Tower a rental or a condominium?",
        answer:
          "Skyline Tower is a condominium — units are sold rather than leased by the building. Rental availability comes from individual owners listing their units through third-party brokers. Pricing varies more unit-to-unit than at dedicated rental towers; verify the listing source and broker-fee structure under the FARE Act before signing.",
      },
      {
        question: "What does it cost to rent at Skyline Tower?",
        answer:
          "When investor-owned units are available at Skyline Tower, 2026 asking rents typically run $3,200-$3,800 for a studio, $3,800-$4,600 for a 1-bedroom, $5,500-$7,200 for a 2-bedroom, and $8,500-$11,000 for a 3-bedroom. Higher floors with direct Manhattan skyline views command meaningful premiums (often $300-$600/month over equivalent lower-floor units).",
      },
      {
        question: "What is the amenity floor at Skyline Tower?",
        answer:
          "Skyline Tower's signature amenity is a 75,000-square-foot floor on the 22nd story containing an indoor pool with spa and sauna, a multi-level fitness center with separate yoga and Peloton studios, a children's playroom and library, a co-working lounge, and an outdoor terrace with Manhattan skyline views. It remains one of the largest single-floor amenity programs in any Queens building.",
      },
      {
        question: "How does Skyline Tower compare to Jackson Park?",
        answer:
          "Skyline Tower (2021, 67 stories, condominium) and Jackson Park (2018-2019, 3 towers, dedicated rental) are the two anchor luxury developments in Court Square. Skyline Tower commands a height and views premium but trades it for the lease-by-lease pricing variability of investor-owned condo inventory; Jackson Park offers the consistent leasing operation and amenity reliability of a Tishman Speyer rental but tops out at 53 stories. Both are within a 5-minute walk of the Court Square 7/E/M/G station.",
      },
    ],
  },
  {
    slug: "sven",
    buildingId: "9b92ca11-b839-4079-94d7-be9ddbd3226d",
    latitude: 40.7508,
    longitude: -73.9408,
    name: "Sven",
    address: "29-59 Northern Blvd, Long Island City, NY 11101",
    neighborhood: "Queens Plaza",
    yearCompleted: 2021,
    unitCount: 958,
    floors: 64,
    developer: "Durst Organization",
    tagline:
      "Durst's 64-story Queens Plaza rental — 762 ft, 958 residences, 22,000 sq ft public park at the base.",
    description:
      "Sven is a 64-story Durst Organization rental tower at 29-59 Northern Boulevard in Queens Plaza, completed in 2021. The 762-foot tower contains 958 residences across studios through 3-bedrooms (with a 30% allocation to NYC affordable housing under the MIH program) and is one of the three tallest residential buildings in Queens. The development includes Sven Park, a 22,000-square-foot publicly-accessible plaza at the base with seating, plantings, and direct access from Queens Plaza North to 41st Avenue. Sven sits directly above the convergence of the N, W, E, M, R, and 7 trains at the Queens Plaza / Queensboro Plaza complex — one of the deepest transit nodes in the city outside Manhattan.",
    amenities: [
      "Rooftop pool deck with Manhattan skyline views",
      "Sky lounge and resident library on a top-floor amenity level",
      "Multi-level fitness center with separate yoga studio",
      "Children's playroom and game room",
      "Co-working lounge with private workrooms",
      "On-site Sven Park (22,000 sq ft public plaza)",
      "24-hour doorman and concierge",
      "Bicycle storage and pet spa",
    ],
    transit: [
      { station: "Queens Plaza", lines: "E M R", walkMinutes: 1 },
      { station: "Queensboro Plaza", lines: "N W 7", walkMinutes: 2 },
      { station: "Court Sq", lines: "7 E M G", walkMinutes: 6 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-580", rentRange: "$3,000-$3,600" },
      { type: "1 Bedroom", sqftRange: "620-820", rentRange: "$3,600-$4,400" },
      { type: "2 Bedroom", sqftRange: "950-1,300", rentRange: "$5,200-$6,800" },
      { type: "3 Bedroom", sqftRange: "1,400-1,750", rentRange: "$8,000-$10,500" },
    ],
    faqs: [
      {
        question: "Where is Sven located?",
        answer:
          "Sven is at 29-59 Northern Boulevard in Queens Plaza, Long Island City. The Queens Plaza station (E/M/R) is a 1-minute walk and the Queensboro Plaza station (N/W/7) is a 2-minute walk. The Court Square 7/E/M/G station is a 6-minute walk for direct G access into Brooklyn.",
      },
      {
        question: "When was Sven built?",
        answer:
          "Sven was completed in 2021 by The Durst Organization, the same family-owned developer behind 1 World Trade Center, the Durst-managed 1133 Sixth Avenue, and several Manhattan rental towers. The 64-story building is 762 feet tall and is the second-tallest residential building in Queens by some height measures (close to Skyline Tower at 778 ft).",
      },
      {
        question: "How many apartments are at Sven?",
        answer:
          "Sven has 958 total residences. Approximately 30% of the units are allocated to NYC affordable housing under the Mandatory Inclusionary Housing (MIH) program; the remainder is leased at market rate. As a dedicated rental tower (not a condominium), all market-rate units are leased through Durst's in-house leasing team.",
      },
      {
        question: "What is Sven Park?",
        answer:
          "Sven Park is a 22,000-square-foot publicly-accessible plaza at the base of the tower, with seating, ornamental plantings, and direct connection from Queens Plaza North through to 41st Avenue. It is one of the largest privately-owned-public-space (POPS) plazas built in Queens in the past decade, providing weather-protected pedestrian transit between the subway and the Queensboro Bridge bike path.",
      },
      {
        question: "Is Sven a no-fee building?",
        answer:
          "Yes — Durst leases Sven through its in-house leasing team, so no broker fee is paid by the tenant on direct leases. Under the NYC FARE Act (effective June 2025), landlord-side listings cannot charge tenants broker fees regardless. If a third-party broker represents the tenant under a separate buyer-broker agreement, that agreement governs.",
      },
      {
        question: "How does Sven compare to ALTA LIC?",
        answer:
          "Sven (64 stories, 958 units, 2021) and ALTA LIC (44 stories, 467 units, 2018) are both market-rate-plus-affordable rental towers along Northern Boulevard in the Queens Plaza sub-area. Sven is taller and newer with a more contemporary amenity program (rooftop pool, sky lounge), and sits closer to the Queens Plaza E/M/R entrance. ALTA LIC sits roughly 35 blocks west on the same boulevard and prices roughly 8-15% below Sven at comparable unit sizes.",
      },
    ],
  },
  {
    slug: "jackson-park",
    buildingId: "9f08153d-8c49-4d77-82c3-143bb096f10e",
    latitude: 40.7472,
    longitude: -73.9446,
    name: "Jackson Park",
    address: "28-10 Jackson Ave, Long Island City, NY 11101",
    neighborhood: "Court Square",
    yearCompleted: 2018,
    unitCount: 1871,
    floors: 53,
    developer: "Tishman Speyer",
    tagline:
      "Tishman Speyer's 3-tower Court Square rental complex — 1,871 residences across 47-, 53-, and 54-story towers, completed 2018-2019.",
    description:
      "Jackson Park is a three-tower Tishman Speyer rental complex spanning a full Court Square block, completed in waves between 2018 and 2019. The three towers — 28-10 Jackson Avenue (Tower 1, 47 stories), 28-30 Jackson Avenue (Tower 2, 54 stories), and 28-34 Jackson Avenue (Tower 3, 53 stories) — contain a combined 1,871 residences, making Jackson Park the largest single rental development in Queens history at its delivery. The three towers share a 1.6-acre privately-owned park designed by Hollander Design at the center of the block, plus 50,000+ square feet of indoor amenity space split across the towers. Tishman Speyer leases Jackson Park through its in-house team; the building was meaningfully concession-heavy through its 2018-2020 lease-up window and has settled into a steady-state rental operation since.",
    amenities: [
      "1.6-acre Hollander-designed private park between the towers",
      "50,000+ sq ft of shared indoor amenities across three towers",
      "Indoor swimming pool with spa",
      "Multi-level fitness center with private training studio",
      "Resident lounge, library, and business center",
      "Children's playroom and game room",
      "Half-court basketball and indoor sports court",
      "24-hour doorman and concierge in each tower",
    ],
    transit: [
      { station: "Court Sq", lines: "7 E M G", walkMinutes: 2 },
      { station: "Queens Plaza", lines: "E M R", walkMinutes: 7 },
      { station: "Hunterspoint Av", lines: "7 LIRR", walkMinutes: 10 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-580", rentRange: "$3,100-$3,700" },
      { type: "1 Bedroom", sqftRange: "640-860", rentRange: "$3,700-$4,500" },
      { type: "2 Bedroom", sqftRange: "950-1,300", rentRange: "$5,300-$6,900" },
      { type: "3 Bedroom", sqftRange: "1,400-1,750", rentRange: "$8,200-$10,800" },
    ],
    faqs: [
      {
        question: "Where is Jackson Park located?",
        answer:
          "Jackson Park is a three-tower complex on Jackson Avenue in Court Square, Long Island City. Tower 1 is at 28-10 Jackson Avenue, Tower 2 at 28-30 Jackson Avenue, and Tower 3 at 28-34 Jackson Avenue. The Court Square 7/E/M/G station is a 2-minute walk; Queens Plaza (E/M/R) is a 7-minute walk; Hunterspoint Avenue (7 + LIRR) is a 10-minute walk.",
      },
      {
        question: "How many towers are at Jackson Park?",
        answer:
          "Jackson Park has three towers — 28-10 Jackson Avenue (47 stories, completed 2018), 28-30 Jackson Avenue (54 stories, completed 2018), and 28-34 Jackson Avenue (53 stories, completed 2019). The combined complex contains 1,871 residences and was Tishman Speyer's largest residential delivery in Queens.",
      },
      {
        question: "What does it cost to rent at Jackson Park?",
        answer:
          "2026 asking rents at Jackson Park typically run $3,100-$3,700 for a studio, $3,700-$4,500 for a 1-bedroom, $5,300-$6,900 for a 2-bedroom, and $8,200-$10,800 for a 3-bedroom. Concessions of 1-2 months free that ran through the 2018-2020 lease-up have largely tapered, but selective concessions still appear on individual lines that turn over slowly.",
      },
      {
        question: "What is the park at Jackson Park?",
        answer:
          "Jackson Park's central park is a 1.6-acre Hollander Design-curated private green space between the three towers, with paved walking paths, ornamental plantings, seating, and a dog run accessible to residents. It is the largest privately-owned park at any LIC rental complex and is a defining amenity that distinguishes Jackson Park from competing Court Square towers like Skyline Tower and Eagle Lofts.",
      },
      {
        question: "Is Jackson Park a no-fee building?",
        answer:
          "Yes — Tishman Speyer leases Jackson Park through its in-house leasing team, so no broker fee is paid by the tenant on direct leases. Under the NYC FARE Act (effective June 2025), landlord-side listings cannot charge tenants broker fees regardless of channel.",
      },
      {
        question: "How does Jackson Park compare to The Hayden?",
        answer:
          "Jackson Park (2018-2019, 3 towers, 1,871 units, Court Square) and The Hayden (2017, 50 stories, ~974 units, Hunters Point) are Tishman Speyer's two large LIC rental developments. Jackson Park is closer to the Court Square 7/E/M/G transit hub and operates as a single integrated complex with a private park; The Hayden sits four blocks west toward Hunters Point with closer access to the East River waterfront and Gantry Plaza State Park, but trades off the 7-train walk time and the multi-tower amenity scale. Both buildings share Tishman Speyer's leasing operation and amenity-program quality.",
      },
    ],
  },
  {
    slug: "the-hayden",
    buildingId: "a41ca402-ba52-4bee-859b-5617fd762165",
    latitude: 40.7456,
    longitude: -73.9532,
    name: "The Hayden",
    address: "43-25 Hunter St, Long Island City, NY 11101",
    neighborhood: "Hunters Point",
    yearCompleted: 2017,
    unitCount: 974,
    floors: 50,
    developer: "Tishman Speyer",
    tagline:
      "Tishman Speyer's 50-story Hunters Point rental — Tishman Speyer's first LIC delivery, predecessor to Jackson Park.",
    description:
      "The Hayden at 43-25 Hunter Street is a 50-story Tishman Speyer rental tower completed in 2017 — the developer's first major LIC delivery and the predecessor to the larger Jackson Park complex four blocks east. The 509-foot tower contains approximately 974 residences across studios through 3-bedrooms, with floor-to-ceiling windows facing the East River and direct skyline views from the upper floors. The Hayden's amenity program — including a rooftop pool, a screening room, and a fitness center with East River views — established the template that Tishman Speyer scaled up at Jackson Park. The building sits between Court Square and the Hunters Point waterfront, closer to Gantry Plaza State Park than to the Court Square 7/E/M/G station but still inside walking distance to both.",
    amenities: [
      "Rooftop pool deck with Manhattan skyline views",
      "Multi-level fitness center with East River views",
      "Screening room and game room",
      "Resident lounge and library",
      "Co-working lounge",
      "Children's playroom",
      "24-hour doorman and concierge",
      "Bicycle storage and on-site parking",
    ],
    transit: [
      { station: "Vernon Blvd-Jackson Av", lines: "7", walkMinutes: 5 },
      { station: "Court Sq", lines: "7 E M G", walkMinutes: 8 },
      { station: "Hunters Point South Ferry", lines: "NYC Ferry East River", walkMinutes: 9 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "430-560", rentRange: "$3,000-$3,600" },
      { type: "1 Bedroom", sqftRange: "620-820", rentRange: "$3,500-$4,300" },
      { type: "2 Bedroom", sqftRange: "920-1,250", rentRange: "$5,000-$6,500" },
      { type: "3 Bedroom", sqftRange: "1,350-1,700", rentRange: "$7,800-$10,000" },
    ],
    faqs: [
      {
        question: "Where is The Hayden located?",
        answer:
          "The Hayden is at 43-25 Hunter Street in Hunters Point, Long Island City — between Court Square and the East River waterfront. The Vernon Boulevard-Jackson Avenue station on the 7 train is a 5-minute walk; the Court Square 7/E/M/G station is an 8-minute walk; the NYC Ferry's Hunters Point South stop is a 9-minute walk.",
      },
      {
        question: "When was The Hayden built?",
        answer:
          "The Hayden was completed in 2017 by Tishman Speyer as the developer's first major rental delivery in Long Island City. The 50-story building is 509 feet tall with approximately 974 residences and predates the larger 3-tower Jackson Park complex (2018-2019) by Tishman Speyer four blocks east at 28-10 Jackson Avenue.",
      },
      {
        question: "What does it cost to rent at The Hayden?",
        answer:
          "2026 asking rents at The Hayden typically run $3,000-$3,600 for a studio, $3,500-$4,300 for a 1-bedroom, $5,000-$6,500 for a 2-bedroom, and $7,800-$10,000 for a 3-bedroom. Pricing runs roughly 3-7% below Jackson Park at comparable unit sizes, reflecting the marginally older construction and the slightly longer walk to the Court Square transit hub. East River-facing units command floor and view premiums.",
      },
      {
        question: "Is The Hayden a no-fee building?",
        answer:
          "Yes — Tishman Speyer leases The Hayden through its in-house leasing team, so no broker fee is paid by the tenant on direct leases. The NYC FARE Act (June 2025) reinforces this — landlord-side listings cannot charge tenants broker fees regardless of the channel.",
      },
      {
        question: "How is the commute from The Hayden?",
        answer:
          "The Hayden's primary transit is the Vernon Boulevard-Jackson Avenue 7 train station (5 minutes), which reaches Grand Central in 6 minutes and Times Square-42nd Street in 9 minutes. The Court Square 7/E/M/G station (8 minutes) adds the E and M for direct service to Manhattan's 53rd Street corridor (Lexington-53rd, Fifth Avenue-53rd, 7th Avenue-53rd) and the G for Brooklyn. The NYC Ferry's Hunters Point South dock (9 minutes) runs to East 34th Street and Wall Street.",
      },
    ],
  },
  {
    slug: "linc-lic",
    buildingId: "eab4df8a-6db5-4fa3-957c-ed7a3c6cf116",
    latitude: 40.7497,
    longitude: -73.9436,
    name: "Linc LIC",
    address: "43-10 Crescent St, Long Island City, NY 11101",
    neighborhood: "Court Square",
    yearCompleted: 2013,
    unitCount: 709,
    floors: 41,
    developer: "Related Companies",
    tagline:
      "Related's 41-story Court Square rental — completed 2013 as one of LIC's earliest post-rezoning luxury towers, 709 residences.",
    description:
      "Linc LIC at 43-10 Crescent Street is a 41-story Related Companies rental tower completed in 2013 — one of the earliest post-2008-rezoning luxury rental deliveries in Court Square. The 429-foot building contains 709 residences across studios through 3-bedrooms and helped establish Crescent Street as a luxury rental corridor between Queens Plaza and Court Square. As one of LIC's most established rental towers, Linc LIC carries a rental operation refined over more than a decade, with reliable amenity quality but a less contemporary amenity program than the post-2018 stock at Jackson Park, Skyline Tower, or Sven. Pricing typically tracks 5-12% below the newest LIC towers at comparable unit sizes, making Linc LIC the most common Court Square 'value tier' option for renters who prioritize transit access and unit footprint over the newest amenity bells.",
    amenities: [
      "Rooftop terrace with Manhattan skyline views",
      "Multi-level fitness center with yoga studio",
      "Resident lounge and library",
      "Children's playroom",
      "Outdoor courtyard with seating",
      "24-hour doorman and concierge",
      "On-site garage parking",
      "Bicycle storage",
    ],
    transit: [
      { station: "Queens Plaza", lines: "E M R", walkMinutes: 4 },
      { station: "Court Sq", lines: "7 E M G", walkMinutes: 5 },
      { station: "Queensboro Plaza", lines: "N W 7", walkMinutes: 5 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "420-560", rentRange: "$2,900-$3,500" },
      { type: "1 Bedroom", sqftRange: "600-820", rentRange: "$3,400-$4,200" },
      { type: "2 Bedroom", sqftRange: "900-1,250", rentRange: "$4,800-$6,300" },
      { type: "3 Bedroom", sqftRange: "1,300-1,650", rentRange: "$7,500-$9,500" },
    ],
    faqs: [
      {
        question: "Where is Linc LIC located?",
        answer:
          "Linc LIC is at 43-10 Crescent Street in Court Square, Long Island City — equidistant between the Queens Plaza E/M/R station (4 minutes) and the Court Square 7/E/M/G station (5 minutes). The Queensboro Plaza N/W/7 station is also 5 minutes away. This puts Linc LIC inside the densest transit node in Queens with six different subway lines within a 5-minute walk.",
      },
      {
        question: "When was Linc LIC built?",
        answer:
          "Linc LIC was completed in 2013 by Related Companies as one of the earliest post-rezoning luxury rental towers in Court Square. The 41-story building is 429 feet tall with 709 residences. It predates the 2017-2021 wave of taller Court Square towers (The Hayden 2017, Jackson Park 2018-2019, Skyline Tower 2021) and offers a more established rental operation than the newer stock.",
      },
      {
        question: "What does it cost to rent at Linc LIC?",
        answer:
          "2026 asking rents at Linc LIC typically run $2,900-$3,500 for a studio, $3,400-$4,200 for a 1-bedroom, $4,800-$6,300 for a 2-bedroom, and $7,500-$9,500 for a 3-bedroom. Pricing runs roughly 5-12% below the newest LIC towers like Jackson Park or Skyline Tower at comparable unit sizes, reflecting the older amenity package while preserving competitive transit access and unit footprints.",
      },
      {
        question: "Is Linc LIC a no-fee building?",
        answer:
          "Yes — Related Companies leases Linc LIC through its in-house leasing team, so no broker fee is paid by the tenant on direct leases. Under the NYC FARE Act (June 2025), landlord-side listings cannot charge tenants broker fees regardless of channel. As one of Related's longest-running LIC rentals, Linc LIC has had a stable in-house leasing operation for more than a decade.",
      },
      {
        question: "How does Linc LIC compare to Eagle Lofts?",
        answer:
          "Linc LIC (2013, 41 stories, 709 units, Crescent Street) and Eagle Lofts (2018, 55 stories, ~790 units, Queens Plaza South) are both Court Square / Queens Plaza luxury rentals at similar price points. Eagle Lofts is taller and newer with a more contemporary amenity program; Linc LIC offers a more established rental operation and slightly lower asking rents at comparable unit sizes. Both sit within a 5-minute walk of the Queens Plaza E/M/R station and the Court Square 7/E/M/G station.",
      },
    ],
  },
  {
    slug: "eagle-lofts",
    buildingId: "56bf182c-982f-4c11-bf67-6900d6af2244",
    latitude: 40.7491,
    longitude: -73.9442,
    name: "Eagle Lofts",
    address: "43-22 Queens St, Long Island City, NY 11101",
    neighborhood: "Court Square",
    yearCompleted: 2018,
    unitCount: 790,
    floors: 55,
    developer: "Rockrose Development",
    tagline:
      "Rockrose's 55-story Court Square rental — converted Eagle Electric factory base topped by a glass tower, 790 residences.",
    description:
      "Eagle Lofts at 43-22 Queens Street is a 55-story Rockrose Development rental tower completed in 2018 — a vertical addition built atop the converted Eagle Electric Manufacturing Company factory base that gives the building its name. The 598-foot tower contains approximately 790 residences across loft-style studios through 3-bedrooms, with the lower floors featuring exposed industrial brick and 11+ ft ceilings inherited from the original factory and the upper floors offering glass-curtain-wall layouts with skyline views. Rockrose has operated the Linc LIC pattern of a steady, reliable LIC rental operation here, with concession-driven pricing common during heavy turnover months. The building's mid-block Queens Street location places it within walking distance of both the Queens Plaza and Court Square transit hubs, making it one of the better-connected mid-2010s LIC rentals.",
    amenities: [
      "Rooftop pool deck with Manhattan skyline views",
      "Lower-floor industrial-loft units with original brick + 11+ ft ceilings",
      "Multi-level fitness center with yoga studio",
      "Resident lounge with co-working space",
      "Children's playroom",
      "Outdoor terrace and BBQ area",
      "24-hour doorman and concierge",
      "Bicycle storage and pet spa",
    ],
    transit: [
      { station: "Court Sq", lines: "7 E M G", walkMinutes: 4 },
      { station: "Queens Plaza", lines: "E M R", walkMinutes: 5 },
      { station: "Hunterspoint Av", lines: "7 LIRR", walkMinutes: 9 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-600", rentRange: "$3,000-$3,600" },
      { type: "1 Bedroom", sqftRange: "620-840", rentRange: "$3,500-$4,300" },
      { type: "2 Bedroom", sqftRange: "920-1,250", rentRange: "$5,000-$6,500" },
      { type: "3 Bedroom", sqftRange: "1,350-1,700", rentRange: "$7,800-$10,000" },
      { type: "Loft", sqftRange: "700-1,100", rentRange: "$4,200-$6,000" },
    ],
    faqs: [
      {
        question: "Where is Eagle Lofts located?",
        answer:
          "Eagle Lofts is at 43-22 Queens Street in Court Square, Long Island City. The Court Square 7/E/M/G station is a 4-minute walk and the Queens Plaza E/M/R station is a 5-minute walk. The Hunterspoint Avenue station (7 + LIRR Main Line) is a 9-minute walk for direct LIRR service to Penn Station.",
      },
      {
        question: "What is the history of the Eagle Lofts building?",
        answer:
          "Eagle Lofts was built in 2018 by Rockrose Development atop the converted Eagle Electric Manufacturing Company factory at 43-22 Queens Street — a Long Island City industrial landmark dating to the 1920s. The 55-story tower preserves the original factory base, where lower-floor loft units feature original exposed-brick walls, original beam ceilings 11+ ft tall, and oversized industrial windows. The upper-floor units (above the converted factory base) are glass-curtain-wall with conventional ceiling heights.",
      },
      {
        question: "What does it cost to rent at Eagle Lofts?",
        answer:
          "2026 asking rents at Eagle Lofts typically run $3,000-$3,600 for a studio, $3,500-$4,300 for a 1-bedroom, $5,000-$6,500 for a 2-bedroom, $7,800-$10,000 for a 3-bedroom, and $4,200-$6,000 for the original-factory-base loft layouts. Loft units carry a small premium reflecting the original-brick + high-ceiling character that does not exist in any new-construction LIC tower.",
      },
      {
        question: "Is Eagle Lofts a no-fee building?",
        answer:
          "Yes — Rockrose Development leases Eagle Lofts through its in-house leasing team, so no broker fee is paid by the tenant on direct leases. Under the NYC FARE Act (June 2025), landlord-side listings cannot charge tenants broker fees regardless of channel.",
      },
      {
        question: "Are Eagle Lofts loft units true lofts?",
        answer:
          "The lower-floor loft units at Eagle Lofts (within the converted Eagle Electric factory base) are true loft conversions with 11+ ft exposed-beam ceilings, original brick walls, and oversized industrial windows. Upper-floor units above the factory base are conventional new-construction layouts with standard ceiling heights and glass-curtain-wall facades. When searching for the loft character, filter listings by 'loft' or specifically request the lower-floor inventory.",
      },
    ],
  },
  {
    slug: "alta-lic",
    buildingId: "b1403f9c-38e3-4433-9a42-fefd403ebd2b",
    latitude: 40.7546,
    longitude: -73.9329,
    name: "ALTA LIC",
    address: "29-22 Northern Blvd, Long Island City, NY 11101",
    neighborhood: "Queens Plaza",
    yearCompleted: 2018,
    unitCount: 467,
    floors: 44,
    developer: "Sky Management",
    tagline:
      "Sky Management's 44-story Northern Boulevard rental — 485 ft, 467 residences, completed 2018.",
    description:
      "ALTA LIC at 29-22 Northern Boulevard is a 44-story Sky Management rental tower completed in 2018, anchoring the Queens Plaza sub-area along Northern Boulevard west of Sven. The 485-foot tower contains 467 residences across studios through 2-bedrooms, with floor-to-ceiling windows facing the Manhattan skyline to the west and the LIC industrial corridor to the east. ALTA LIC's amenity program runs to a rooftop terrace, fitness center, and resident lounge — a modest package compared to the 50,000+ sq ft programs at neighboring Sven and Jackson Park, but reflected in the building's pricing, which typically tracks 8-15% below those towers at comparable unit sizes. The building's primary transit advantage is the Queensboro Plaza station (N/W/7) at a 4-minute walk plus the Queens Plaza station (E/M/R) at 5 minutes — six subway lines within a 5-minute walk.",
    amenities: [
      "Rooftop terrace with Manhattan skyline views",
      "Fitness center",
      "Resident lounge",
      "Children's playroom",
      "Co-working space",
      "24-hour doorman and concierge",
      "Bicycle storage",
      "On-site parking",
    ],
    transit: [
      { station: "Queensboro Plaza", lines: "N W 7", walkMinutes: 4 },
      { station: "Queens Plaza", lines: "E M R", walkMinutes: 5 },
      { station: "39 Av-Dutch Kills", lines: "N W", walkMinutes: 8 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "420-560", rentRange: "$2,800-$3,300" },
      { type: "1 Bedroom", sqftRange: "600-800", rentRange: "$3,300-$4,000" },
      { type: "2 Bedroom", sqftRange: "900-1,200", rentRange: "$4,600-$6,000" },
    ],
    faqs: [
      {
        question: "Where is ALTA LIC located?",
        answer:
          "ALTA LIC is at 29-22 Northern Boulevard in the Queens Plaza sub-area of Long Island City. The Queensboro Plaza N/W/7 station is a 4-minute walk and the Queens Plaza E/M/R station is a 5-minute walk — six subway lines within a 5-minute radius. The Northern Boulevard frontage gives the building heavy west-facing exposure for Manhattan skyline views.",
      },
      {
        question: "When was ALTA LIC built?",
        answer:
          "ALTA LIC was completed in 2018 by Sky Management. The 44-story building is 485 feet tall with 467 residences across studios through 2-bedrooms.",
      },
      {
        question: "What does it cost to rent at ALTA LIC?",
        answer:
          "2026 asking rents at ALTA LIC typically run $2,800-$3,300 for a studio, $3,300-$4,000 for a 1-bedroom, and $4,600-$6,000 for a 2-bedroom. Pricing runs roughly 8-15% below neighboring Sven and Jackson Park at comparable unit sizes, reflecting the smaller amenity program. Higher-floor west-facing units with direct Manhattan skyline views command $200-$400/month premiums.",
      },
      {
        question: "Is ALTA LIC a no-fee building?",
        answer:
          "Yes — Sky Management leases ALTA LIC through landlord-side channels, so under the NYC FARE Act (June 2025) tenants cannot be charged a broker fee on official listings. Verify the listing source and broker representation before signing — if a third-party broker represents the tenant under a separate buyer-broker agreement, that agreement governs.",
      },
      {
        question: "How does ALTA LIC compare to Sven?",
        answer:
          "ALTA LIC (44 stories, 467 units, 2018) and Sven (64 stories, 958 units, 2021) are both Northern Boulevard rentals in the Queens Plaza sub-area, separated by roughly 30 blocks east-west on the same boulevard. Sven is taller, newer, larger, and has a more elaborate amenity program (rooftop pool, sky lounge, on-site Sven Park); ALTA LIC offers a smaller amenity package and prices roughly 8-15% below Sven at comparable unit sizes. Both sit within a 5-minute walk of the Queensboro Plaza N/W/7 and Queens Plaza E/M/R stations.",
      },
    ],
  },
];

/** Convenience: lookup by slug. Returns undefined if not in registry. */
export function getLicTowerBySlug(slug: string): LicTower | undefined {
  return LIC_TOWERS.find((t) => t.slug === slug);
}

/** Convenience: every LIC tower except the one with this slug. */
export function getOtherLicTowers(slug: string): LicTower[] {
  return LIC_TOWERS.filter((t) => t.slug !== slug);
}
