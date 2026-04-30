/**
 * Hoboken waterfront named-tower registry.
 *
 * Drives the static `/buildings/<slug>` programmatic-SEO landing pages for
 * Hoboken's named rental towers. Names + completion years are pulled from the
 * S18 `/hoboken/rent-prices` waterfront tower-rent tier table so cross-linking
 * matches the existing content. All facts are publicly-known leasing-site
 * data (address, year, developer, amenities). Per repo policy: no mock data,
 * no heuristic fallbacks.
 */
import type {
  BuildingRegion,
  Faq,
  Tower,
  TransitStop,
  UnitMixRow,
} from "./towerTypes";

export type { Faq, TransitStop, UnitMixRow };

export type HobokenTower = Tower & {
  /** Sub-area within Hoboken / immediate Port Imperial waterfront. */
  neighborhood: "Hoboken Waterfront" | "Hoboken Uptown" | "Hoboken Midtown" | "Port Imperial";
};

export const HOBOKEN_REGION: BuildingRegion = {
  key: "hoboken",
  city: "Hoboken",
  state: "NJ",
  parentLabel: "Hoboken",
  parentHref: "/hoboken",
  hubLabel: "Hoboken",
  hubHref: "/hoboken",
  rentPricesHref: "/hoboken/rent-prices",
  rentPricesButtonLabel: "Hoboken rent prices (2026)",
  regionLabel: "Hoboken waterfront",
  browseTitle: "Browse Live Hoboken Listings",
  browseDescription:
    "See all currently-available rentals in Hoboken — not just this building",
  browseHubButtonLabel: "Browse Hoboken apartments",
  browseAggregatorPitch:
    "Wade Me Home aggregates Hoboken, Newport JC, and Downtown Jersey City listings from multiple sources, with a chat-style AI search that filters by PATH/ferry access, budget, and amenities in seconds.",
  relatedRentPricesEssay:
    "full Hoboken rent breakdown including the waterfront tower-rent tier table and the PATH commute math vs Manhattan",
  relatedBestTimeArea: "Hoboken waterfront",
  brokerFee: {
    title: "Direct-leased — typically no broker fee",
    subtitle:
      "Most large Hoboken waterfront towers are leased through the developer's in-house team",
    body: "{name} is leased through {developer}'s in-house leasing team and landlord-side brokers. Most large Hoboken waterfront rentals (Toll Brothers, Bijou Properties, KRE Group) lease direct to tenants without a broker fee. The NYC FARE Act does NOT apply in New Jersey, but the practical outcome at most large Hoboken towers is the same — no fee paid by the tenant when leasing through the building's official channel.",
    toolHref: "/tools/move-in-cost-estimator",
    toolLabel:
      "Estimate full move-in cost (security, first month, movers) for a Hoboken lease →",
  },
};

export const HOBOKEN_TOWERS: HobokenTower[] = [
  {
    slug: "maxwell-place",
    buildingId: "10d1e899-31ed-4f4b-911e-fb50d7395863",
    latitude: 40.7544,
    longitude: -74.0247,
    name: "Maxwell Place",
    address: "1125 Maxwell Ln, Hoboken, NJ 07030",
    neighborhood: "Hoboken Waterfront",
    yearCompleted: 2008,
    unitCount: 832,
    floors: 11,
    developer: "Toll Brothers",
    tagline:
      "Toll Brothers' Hoboken-uptown waterfront community — the largest residential complex on the Hoboken waterfront.",
    description:
      "Maxwell Place is a Toll Brothers waterfront rental and condominium community at 1100 and 1125 Maxwell Lane on the northern edge of the Hoboken waterfront, completed in stages from 2007-2010. With approximately 832 residences across multiple buildings, Maxwell Place is the largest residential complex on the Hoboken waterfront. The community is built on the former Maxwell House coffee plant site (the original Maxwell House factory was demolished and replaced with this development). Amenities include two outdoor pools, a fitness center, a screening room, and a private waterfront promenade. Maxwell Place is approximately 14 minutes' walk to the Hoboken PATH/Terminal — one of the longest waterfront walks in Hoboken — but the NY Waterway Ferry at 14th Street is just 3 minutes away for direct Midtown service.",
    amenities: [
      "Two outdoor swimming pools",
      "Fitness center with yoga and Pilates studios",
      "Screening room and resident lounge",
      "Private waterfront promenade",
      "Children's playroom",
      "24-hour doorman and concierge",
      "On-site garage parking",
      "Direct access to NY Waterway Ferry at 14th Street",
    ],
    transit: [
      { station: "NY Waterway Ferry — 14th Street", lines: "Ferry to Midtown / Battery Park City", walkMinutes: 3 },
      { station: "Hoboken PATH/Terminal", lines: "PATH (HOB-WTC, HOB-33)", walkMinutes: 14 },
      { station: "9th St Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 6 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "550-700", rentRange: "$2,900-$3,400" },
      { type: "1 Bedroom", sqftRange: "750-1,000", rentRange: "$3,500-$4,400" },
      { type: "2 Bedroom", sqftRange: "1,100-1,500", rentRange: "$4,800-$6,200" },
      { type: "3 Bedroom", sqftRange: "1,500-1,900", rentRange: "$6,500-$8,500" },
    ],
    faqs: [
      {
        question: "Where is Maxwell Place located?",
        answer:
          "Maxwell Place is at 1100 and 1125 Maxwell Lane on the northern Hoboken waterfront, on the former Maxwell House coffee plant site. The 14th Street NY Waterway Ferry is a 3-minute walk; Hoboken PATH/Terminal is approximately 14 minutes' walk south along the waterfront.",
      },
      {
        question: "When was Maxwell Place built?",
        answer:
          "Maxwell Place was developed by Toll Brothers and built in stages from 2007 to 2010, with the rental tower at 1125 Maxwell Lane completing in 2008. The community contains approximately 832 residences across multiple buildings — both rentals and condos.",
      },
      {
        question: "What does it cost to rent at Maxwell Place?",
        answer:
          "2026 asking rents at Maxwell Place typically run $2,900-$3,400 for a studio, $3,500-$4,400 for a 1-bedroom, $4,800-$6,200 for a 2-bedroom, and $6,500-$8,500 for a 3-bedroom. Toll Brothers and individual condo owners have historically offered concessions of 1-2 months free on initial leases at the rental component.",
      },
      {
        question: "How is the commute from Maxwell Place to Manhattan?",
        answer:
          "Maxwell Place is one of the few Hoboken buildings where the ferry is faster than PATH. The 14th Street NY Waterway Ferry (3 min walk) reaches Midtown West (39th Street) in 8 minutes and Battery Park City (Brookfield Place) in 8 minutes. The PATH at Hoboken Terminal is a 14-minute walk south but adds the JSQ-33 line for direct service to Midtown East via 33rd Street.",
      },
      {
        question: "Is Maxwell Place a no-fee building?",
        answer:
          "Toll Brothers leases the rental component of Maxwell Place directly through its in-house leasing team — no broker fee is paid by the tenant. The condo component is typically rented by individual owners; broker arrangements vary by listing. Verify with the leasing office or the listing agent before signing.",
      },
    ],
  },
  {
    slug: "hudson-tea",
    buildingId: "8df7b091-e3a5-4d68-b96f-c3a399b1a0b7",
    latitude: 40.7556,
    longitude: -74.0259,
    name: "Hudson Tea",
    address: "1500 Hudson St, Hoboken, NJ 07030",
    neighborhood: "Hoboken Uptown",
    yearCompleted: 2002,
    unitCount: 524,
    floors: 8,
    developer: "Tarragon Realty (now SamPro Holdings)",
    tagline:
      "The Lipton Tea factory conversion at the north end of Hoboken — converted to luxury rentals and condos in 2002.",
    description:
      "Hudson Tea is a 524-residence luxury rental and condo conversion at 1500 Hudson Street in uptown Hoboken, originally constructed as the Lipton Tea factory in the early 1900s and converted in 2002. The building's industrial heritage gives it some of the largest layouts in Hoboken — exposed brick, 12-foot ceilings, and oversized windows are standard. Amenities include an outdoor pool, a fitness center, and a resident lounge. Hudson Tea sits approximately 12 minutes from the Hoboken PATH/Terminal and 4 minutes from the 14th Street NY Waterway Ferry, with direct walking access to Sinatra Drive and the waterfront promenade.",
    amenities: [
      "Outdoor swimming pool with sundeck",
      "Fitness center",
      "Resident lounge with original industrial details",
      "Children's playroom",
      "Garage parking",
      "Bicycle storage",
      "Direct access to Hudson River waterfront walkway",
      "On-site grocery and retail",
    ],
    transit: [
      { station: "NY Waterway Ferry — 14th Street", lines: "Ferry to Midtown / Battery Park City", walkMinutes: 4 },
      { station: "Hoboken PATH/Terminal", lines: "PATH (HOB-WTC, HOB-33)", walkMinutes: 12 },
      { station: "9th St Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 5 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "550-700", rentRange: "$2,800-$3,300" },
      { type: "1 Bedroom", sqftRange: "750-1,050", rentRange: "$3,400-$4,300" },
      { type: "2 Bedroom", sqftRange: "1,100-1,500", rentRange: "$4,600-$6,000" },
      { type: "Loft", sqftRange: "1,200-1,800", rentRange: "$5,500-$7,500" },
    ],
    faqs: [
      {
        question: "Where is Hudson Tea located?",
        answer:
          "Hudson Tea is at 1500 Hudson Street in uptown Hoboken, on the former Lipton Tea factory site at the north end of the city. The 14th Street NY Waterway Ferry is a 4-minute walk; the Hoboken PATH/Terminal is approximately 12 minutes' walk south.",
      },
      {
        question: "What was Hudson Tea before it was apartments?",
        answer:
          "Hudson Tea was originally the Lipton Tea (Hudson Tea) factory, built in the early 1900s. The building was converted to a 524-residence luxury rental and condo community in 2002. Many units retain original industrial details — exposed brick, 12-foot ceilings, and oversized windows.",
      },
      {
        question: "What does it cost to rent at Hudson Tea?",
        answer:
          "2026 asking rents at Hudson Tea typically run $2,800-$3,300 for a studio, $3,400-$4,300 for a 1-bedroom, $4,600-$6,000 for a 2-bedroom, and $5,500-$7,500 for a loft. Loft units (with original industrial details) often command 10-15% premiums over standard 2-bedrooms of comparable square footage.",
      },
      {
        question: "What amenities does Hudson Tea have?",
        answer:
          "Hudson Tea includes an outdoor swimming pool with sundeck, a fitness center, a resident lounge with original industrial details, a children's playroom, garage parking, and bicycle storage. The building has direct walking access to the Hudson River waterfront walkway and on-site grocery and retail.",
      },
      {
        question: "How are the layouts at Hudson Tea?",
        answer:
          "Because Hudson Tea is a converted factory rather than purpose-built residential, layouts are some of the largest in Hoboken. Exposed brick, 12-foot ceilings, and oversized windows are standard. 1-bedrooms run 750-1,050 sq ft (versus 600-800 in newer buildings) and lofts can reach 1,800 sq ft.",
      },
    ],
  },
  {
    slug: "1100-maxwell",
    buildingId: "76f309ea-1af0-4425-a098-94393322fef6",
    latitude: 40.7541,
    longitude: -74.0250,
    name: "1100 Maxwell",
    address: "1100 Maxwell Ln, Hoboken, NJ 07030",
    neighborhood: "Hoboken Waterfront",
    yearCompleted: 2007,
    unitCount: 387,
    floors: 11,
    developer: "Toll Brothers",
    tagline:
      "The first phase of Toll Brothers' Maxwell Place community — completed 2007 on the northern Hoboken waterfront.",
    description:
      "1100 Maxwell is the first-phase residential building of Toll Brothers' Maxwell Place community at the northern edge of the Hoboken waterfront, completed in 2007. With approximately 387 residences across 11 floors, the building shares the Maxwell Place amenity ecosystem (two outdoor pools, fitness center, screening room, private waterfront promenade) with the slightly newer 1125 Maxwell Lane building. Sited on the former Maxwell House coffee plant, 1100 Maxwell offers some of the closest waterfront-walkway access of any Hoboken rental and is directly across from the 14th Street ferry stop for fast Midtown service.",
    amenities: [
      "Shared access to Maxwell Place amenity package",
      "Two outdoor swimming pools (community-wide)",
      "Fitness center with yoga and Pilates studios",
      "Screening room and resident lounge",
      "Children's playroom",
      "Private waterfront promenade",
      "24-hour doorman and concierge",
      "On-site garage parking",
    ],
    transit: [
      { station: "NY Waterway Ferry — 14th Street", lines: "Ferry to Midtown / Battery Park City", walkMinutes: 3 },
      { station: "Hoboken PATH/Terminal", lines: "PATH (HOB-WTC, HOB-33)", walkMinutes: 14 },
      { station: "9th St Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 6 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "550-700", rentRange: "$2,800-$3,300" },
      { type: "1 Bedroom", sqftRange: "750-1,000", rentRange: "$3,400-$4,300" },
      { type: "2 Bedroom", sqftRange: "1,100-1,500", rentRange: "$4,700-$6,000" },
      { type: "3 Bedroom", sqftRange: "1,500-1,900", rentRange: "$6,300-$8,200" },
    ],
    faqs: [
      {
        question: "Where is 1100 Maxwell located?",
        answer:
          "1100 Maxwell is at 1100 Maxwell Lane on the northern Hoboken waterfront, on the former Maxwell House coffee plant site. It is the first-phase building of Toll Brothers' Maxwell Place community. The 14th Street NY Waterway Ferry is a 3-minute walk; Hoboken PATH/Terminal is 14 minutes' walk.",
      },
      {
        question: "How is 1100 Maxwell different from 1125 Maxwell Lane?",
        answer:
          "1100 Maxwell (completed 2007) is the first-phase building; 1125 Maxwell Lane (completed 2008) is the second phase. Both are part of Toll Brothers' Maxwell Place community and share amenities. The two buildings are very similar in finishes and layouts; pricing is typically within 3-5% of each other for comparable unit sizes.",
      },
      {
        question: "What does it cost to rent at 1100 Maxwell?",
        answer:
          "2026 asking rents at 1100 Maxwell typically run $2,800-$3,300 for a studio, $3,400-$4,300 for a 1-bedroom, $4,700-$6,000 for a 2-bedroom, and $6,300-$8,200 for a 3-bedroom. Concessions of 1-2 months free have been common on initial leases.",
      },
      {
        question: "What amenities does 1100 Maxwell have?",
        answer:
          "1100 Maxwell shares the full Maxwell Place amenity package — two outdoor swimming pools, a fitness center with yoga and Pilates studios, a screening room, a resident lounge, a children's playroom, a private waterfront promenade, 24-hour doorman service, and on-site garage parking.",
      },
      {
        question: "Is the 14th Street ferry faster than PATH from Maxwell?",
        answer:
          "Yes. From 1100 Maxwell, the 14th Street ferry (3 min walk) reaches Midtown West (39th Street) in 8 minutes and Battery Park City in 8 minutes. The PATH at Hoboken Terminal is a 14-minute walk south, then the train. Total ferry door-to-Midtown is about 12 minutes; PATH door-to-FiDi is about 21 minutes.",
      },
    ],
  },
  {
    slug: "1300-adams",
    buildingId: "7b9dfaf3-938f-4eee-bbe9-0b36612b4599",
    latitude: 40.7445,
    longitude: -74.0316,
    name: "1300 Adams",
    address: "1300 Adams St, Hoboken, NJ 07030",
    neighborhood: "Hoboken Midtown",
    yearCompleted: 2018,
    unitCount: 102,
    floors: 11,
    developer: "Bijou Properties",
    tagline:
      "Bijou Properties' contemporary midtown-Hoboken rental, completed 2018 with rooftop pool and skyline views.",
    description:
      "1300 Adams is a Bijou Properties rental at 1300 Adams Street in midtown Hoboken, completed in 2018. The 11-story building sits on the western edge of central Hoboken, three blocks from the Hudson-Bergen Light Rail and walking distance to the Hoboken PATH/Terminal. Amenities include a rooftop pool with skyline views, a state-of-the-art fitness center, and a resident lounge. Bijou is a Hoboken-focused developer whose portfolio (including The Vine and 1450 Washington) targets a contemporary tenant looking for newer construction at slightly off-waterfront pricing.",
    amenities: [
      "Rooftop pool with Manhattan skyline views",
      "State-of-the-art fitness center",
      "Resident lounge and co-working space",
      "Outdoor grilling terrace",
      "24-hour doorman",
      "On-site garage parking",
      "Bicycle storage",
      "Pet friendly with pet wash",
    ],
    transit: [
      { station: "9th St Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 6 },
      { station: "Hoboken PATH/Terminal", lines: "PATH (HOB-WTC, HOB-33)", walkMinutes: 13 },
      { station: "NY Waterway Ferry — 14th Street", lines: "Ferry to Midtown / Battery Park City", walkMinutes: 9 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "480-600", rentRange: "$2,700-$3,200" },
      { type: "1 Bedroom", sqftRange: "650-850", rentRange: "$3,300-$4,000" },
      { type: "2 Bedroom", sqftRange: "950-1,250", rentRange: "$4,400-$5,600" },
      { type: "3 Bedroom", sqftRange: "1,300-1,600", rentRange: "$5,800-$7,400" },
    ],
    faqs: [
      {
        question: "Where is 1300 Adams located?",
        answer:
          "1300 Adams is at 1300 Adams Street in midtown Hoboken, three blocks from the 9th Street Hudson-Bergen Light Rail and approximately 13 minutes' walk from the Hoboken PATH/Terminal. The 14th Street NY Waterway Ferry is a 9-minute walk.",
      },
      {
        question: "Who developed 1300 Adams?",
        answer:
          "1300 Adams was developed by Bijou Properties, a Hoboken-focused developer whose portfolio also includes The Vine at 900 Monroe Street and 1450 Washington Street. The building was completed in 2018.",
      },
      {
        question: "What does it cost to rent at 1300 Adams?",
        answer:
          "2026 asking rents at 1300 Adams typically run $2,700-$3,200 for a studio, $3,300-$4,000 for a 1-bedroom, $4,400-$5,600 for a 2-bedroom, and $5,800-$7,400 for a 3-bedroom. Pricing runs roughly 5-10% below the waterfront towers (Maxwell Place, Hudson Tea) reflecting the off-waterfront location.",
      },
      {
        question: "What amenities does 1300 Adams have?",
        answer:
          "1300 Adams includes a rooftop pool with Manhattan skyline views, a state-of-the-art fitness center, a resident lounge with co-working space, an outdoor grilling terrace, 24-hour doorman service, on-site garage parking, bicycle storage, and a pet wash.",
      },
      {
        question: "How is the commute from 1300 Adams?",
        answer:
          "The 9th Street Hudson-Bergen Light Rail (6 min walk) connects to the PATH at Hoboken Terminal in 4 minutes; total door-to-FiDi via PATH is approximately 22 minutes. The 14th Street ferry (9 min walk) is faster to Midtown West (about 18 minutes door-to-desk) but slower to FiDi.",
      },
    ],
  },
  {
    slug: "the-vine",
    buildingId: "070bfc34-8b84-4c89-a9d1-48478a780cf9",
    latitude: 40.7470,
    longitude: -74.0345,
    name: "The Vine",
    address: "900 Monroe St, Hoboken, NJ 07030",
    neighborhood: "Hoboken Midtown",
    yearCompleted: 2014,
    unitCount: 135,
    floors: 11,
    developer: "Bijou Properties",
    tagline:
      "Bijou Properties' midtown-Hoboken rental at 9th and Monroe — completed 2014, LEED Platinum.",
    description:
      "The Vine is a Bijou Properties rental at 900 Monroe Street in midtown Hoboken, completed in 2014 as one of the city's first LEED Platinum residential buildings. The 11-story building sits at the corner of 9th and Monroe, two blocks from the 9th Street Hudson-Bergen Light Rail and walking distance to the Hoboken PATH/Terminal. Amenities include a rooftop pool, a fitness center, and a resident lounge. The Vine paired with Bijou's later 1300 Adams (2018) and 1450 Washington (2020) anchors the contemporary midtown-Hoboken value tier — newer construction and amenities at 5-10% below waterfront pricing.",
    amenities: [
      "Rooftop pool with sundeck and skyline views",
      "Fitness center with yoga studio",
      "Resident lounge",
      "Children's playroom",
      "Outdoor grilling area",
      "24-hour doorman",
      "On-site garage parking",
      "LEED Platinum certified",
    ],
    transit: [
      { station: "9th St Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 4 },
      { station: "Hoboken PATH/Terminal", lines: "PATH (HOB-WTC, HOB-33)", walkMinutes: 14 },
      { station: "NY Waterway Ferry — 14th Street", lines: "Ferry to Midtown / Battery Park City", walkMinutes: 7 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "470-580", rentRange: "$2,700-$3,100" },
      { type: "1 Bedroom", sqftRange: "640-820", rentRange: "$3,300-$4,000" },
      { type: "2 Bedroom", sqftRange: "950-1,250", rentRange: "$4,400-$5,600" },
      { type: "3 Bedroom", sqftRange: "1,300-1,600", rentRange: "$5,800-$7,300" },
    ],
    faqs: [
      {
        question: "Where is The Vine located?",
        answer:
          "The Vine is at 900 Monroe Street in midtown Hoboken, at the corner of 9th and Monroe. The 9th Street Hudson-Bergen Light Rail is a 4-minute walk; the Hoboken PATH/Terminal is approximately 14 minutes' walk.",
      },
      {
        question: "Is The Vine a green building?",
        answer:
          "Yes. The Vine was completed in 2014 by Bijou Properties as one of the first LEED Platinum residential buildings in Hoboken. The certification reflects energy-efficient mechanical systems, a green roof, and water-conservation fixtures throughout.",
      },
      {
        question: "What does it cost to rent at The Vine?",
        answer:
          "2026 asking rents at The Vine typically run $2,700-$3,100 for a studio, $3,300-$4,000 for a 1-bedroom, $4,400-$5,600 for a 2-bedroom, and $5,800-$7,300 for a 3-bedroom. Pricing runs roughly 5-10% below waterfront towers reflecting the midtown location.",
      },
      {
        question: "What amenities does The Vine have?",
        answer:
          "The Vine includes a rooftop pool with sundeck and skyline views, a fitness center with yoga studio, a resident lounge, a children's playroom, an outdoor grilling area, 24-hour doorman service, and on-site garage parking. The building is LEED Platinum certified.",
      },
      {
        question: "Who else does Bijou Properties operate in Hoboken?",
        answer:
          "Bijou Properties' Hoboken portfolio includes The Vine (900 Monroe), 1300 Adams Street (2018), and 1450 Washington Street (2020). All three target the contemporary midtown-Hoboken value tier — newer construction at slightly off-waterfront pricing. The Vine is the oldest of the three but pioneered the LEED Platinum standard for the portfolio.",
      },
    ],
  },
  {
    slug: "w-residences-hoboken",
    buildingId: "ebd791eb-ea27-41ed-8444-4ebcd6e402f3",
    latitude: 40.7374,
    longitude: -74.0291,
    name: "W Residences Hoboken",
    address: "225 River St, Hoboken, NJ 07030",
    neighborhood: "Hoboken Waterfront",
    yearCompleted: 2009,
    unitCount: 40,
    floors: 22,
    developer: "Applied Development",
    tagline:
      "The W Hoboken hotel-condo tower at the foot of the Hoboken waterfront — luxury condos with hotel-tier amenity access.",
    description:
      "The W Residences Hoboken is a 22-story luxury hotel-condominium tower at 225 River Street, completed in 2009 by Applied Development. The lower floors house the W Hoboken hotel; the upper floors are 40 luxury condominium residences. Residents have access to the W Hoboken's hotel-tier amenities including a fitness center, in-room dining, valet parking, and concierge service. The W Residences sits at the southern edge of the Hoboken waterfront, immediately adjacent to the Hoboken PATH/Terminal — making it the closest residential building to the PATH on the entire waterfront. Rental availability varies (the building is condo-owned), but units typically command waterfront premium pricing reflecting the hotel-tier service level.",
    amenities: [
      "Hotel-tier fitness center",
      "In-room dining service from W hotel",
      "Concierge and valet parking",
      "24-hour doorman",
      "Hotel restaurant and bar (Halifax)",
      "Walking distance to Hoboken PATH/Terminal",
      "Direct access to Hoboken waterfront walkway",
      "Hotel-tier housekeeping available",
    ],
    transit: [
      { station: "Hoboken PATH/Terminal", lines: "PATH (HOB-WTC, HOB-33)", walkMinutes: 2 },
      { station: "Hoboken Terminal Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 2 },
      { station: "Hoboken Terminal Ferry", lines: "NY Waterway Ferry to Midtown / Battery Park City", walkMinutes: 3 },
      { station: "Hoboken Terminal NJT", lines: "NJ Transit (Main, Bergen Lines)", walkMinutes: 2 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "650-800", rentRange: "$3,800-$4,500" },
      { type: "1 Bedroom", sqftRange: "850-1,100", rentRange: "$4,600-$5,800" },
      { type: "2 Bedroom", sqftRange: "1,200-1,600", rentRange: "$6,500-$8,500" },
      { type: "Penthouse", sqftRange: "2,000+", rentRange: "$11,000+" },
    ],
    faqs: [
      {
        question: "Where are the W Residences Hoboken?",
        answer:
          "The W Residences Hoboken are at 225 River Street, at the southern edge of the Hoboken waterfront immediately adjacent to the Hoboken PATH/Terminal. PATH, NJ Transit, the Hudson-Bergen Light Rail, and NY Waterway Ferry are all within a 2-3 minute walk — the most transit-dense residential location on the entire Hoboken waterfront.",
      },
      {
        question: "Are the W Residences a hotel or apartments?",
        answer:
          "The W Residences are 40 luxury condominium residences on the upper floors of the W Hoboken hotel-condominium tower. Residents have access to W hotel-tier amenities including in-room dining, valet parking, fitness center, and concierge service. The lower floors of the building remain a W-branded hotel.",
      },
      {
        question: "Can you rent at the W Residences?",
        answer:
          "The W Residences are condo-owned, so rental availability depends on individual owners listing their units. When available, 2026 asking rents typically run $3,800-$4,500 for a studio, $4,600-$5,800 for a 1-bedroom, $6,500-$8,500 for a 2-bedroom, and $11,000+ for a penthouse. Pricing is at the top of the Hoboken waterfront tier reflecting the hotel-tier service level.",
      },
      {
        question: "What amenities do W Residences tenants get?",
        answer:
          "W Residences tenants have access to the W hotel's hotel-tier fitness center, in-room dining, valet parking, concierge service, and the on-site Halifax restaurant and bar. Hotel-tier housekeeping is available as a paid service. The building has 24-hour doorman service.",
      },
      {
        question: "How fast is the commute from the W Residences?",
        answer:
          "The W Residences have the fastest commute of any Hoboken waterfront building. PATH at Hoboken Terminal (2 min walk) reaches the World Trade Center in 11 minutes. NJ Transit (2 min walk) connects to all Bergen and Pascack Valley line destinations. Total door-to-desk to FiDi is approximately 14 minutes.",
      },
    ],
  },
  {
    slug: "nine-on-the-hudson",
    buildingId: "49ee0163-1d62-4251-a7dd-c1c5e720c2de",
    latitude: 40.7717,
    longitude: -74.0146,
    name: "Nine on the Hudson",
    address: "9 Avenue at Port Imperial, West New York, NJ 07093",
    neighborhood: "Port Imperial",
    yearCompleted: 2019,
    unitCount: 278,
    floors: 17,
    developer: "K. Hovnanian / Roseland Residential",
    tagline:
      "K. Hovnanian's Port Imperial luxury condo-rental tower — completed 2019 with the largest direct-Manhattan-view amenity deck in NJ.",
    description:
      "Nine on the Hudson is a 17-story, 278-residence luxury condominium and rental tower at 9 Avenue at Port Imperial in West New York, NJ — directly north of the Hoboken city line on the Port Imperial waterfront. Completed in 2019, the building offers some of the most contemporary finishes on the Hudson waterfront and a 60,000-square-foot indoor/outdoor amenity program with a 75-foot pool, a sky lounge, and direct Hudson River frontage. Nine on the Hudson sits at the Port Imperial NY Waterway Ferry terminal — a 1-minute walk gives direct ferry service to Midtown West (39th Street) in 9 minutes. While West New York is technically separate from Hoboken, residents typically consider Nine on the Hudson part of the Hoboken/Port Imperial waterfront cluster.",
    amenities: [
      "75-foot indoor pool",
      "Sky lounge with floor-to-ceiling Manhattan views",
      "60,000 sq ft of indoor/outdoor amenities",
      "Two-story fitness center with yoga studio",
      "Children's playroom and screening room",
      "Outdoor sundeck and grilling terrace",
      "24-hour doorman and valet",
      "Direct access to Port Imperial Ferry terminal",
      "On-site garage parking",
    ],
    transit: [
      { station: "Port Imperial Ferry", lines: "NY Waterway Ferry to Midtown / Battery Park City", walkMinutes: 1 },
      { station: "Port Imperial Light Rail", lines: "Hudson-Bergen Light Rail", walkMinutes: 4 },
      { station: "Hoboken PATH/Terminal", lines: "PATH (HOB-WTC, HOB-33)", walkMinutes: 25 },
    ],
    unitMix: [
      { type: "1 Bedroom", sqftRange: "750-1,000", rentRange: "$3,800-$4,800" },
      { type: "2 Bedroom", sqftRange: "1,100-1,500", rentRange: "$5,200-$6,800" },
      { type: "3 Bedroom", sqftRange: "1,500-2,000", rentRange: "$7,500-$10,000" },
      { type: "Penthouse", sqftRange: "2,500+", rentRange: "$15,000+" },
    ],
    faqs: [
      {
        question: "Where is Nine on the Hudson located?",
        answer:
          "Nine on the Hudson is at 9 Avenue at Port Imperial in West New York, NJ — directly north of the Hoboken city line on the Port Imperial waterfront. The Port Imperial NY Waterway Ferry terminal is a 1-minute walk and the Port Imperial Hudson-Bergen Light Rail stop is 4 minutes.",
      },
      {
        question: "Is Nine on the Hudson in Hoboken?",
        answer:
          "Technically no — Nine on the Hudson is in West New York, NJ (the municipality directly north of Hoboken on the Hudson waterfront). However, residents typically consider the building part of the Hoboken/Port Imperial waterfront cluster because it shares ferry access, the Hudson-Bergen Light Rail, and the same Manhattan-skyline orientation as the Hoboken waterfront towers.",
      },
      {
        question: "What does it cost to rent at Nine on the Hudson?",
        answer:
          "2026 asking rents at Nine on the Hudson typically run $3,800-$4,800 for a 1-bedroom, $5,200-$6,800 for a 2-bedroom, and $7,500-$10,000 for a 3-bedroom. Penthouse units start around $15,000/month. Pricing is at the top of the Hudson waterfront tier (NJ side) reflecting the 2019 completion year and contemporary finishes.",
      },
      {
        question: "How is the commute from Nine on the Hudson?",
        answer:
          "The Port Imperial Ferry (1 min walk) is the fastest option — direct service to Midtown West (39th Street) in 9 minutes and Battery Park City in 11 minutes. PATH access requires a 25-minute walk to Hoboken PATH/Terminal or a Light Rail transfer. The building is best suited to ferry commuters working in Midtown.",
      },
      {
        question: "What amenities does Nine on the Hudson have?",
        answer:
          "Nine on the Hudson has approximately 60,000 square feet of indoor and outdoor amenities — a 75-foot indoor pool, a sky lounge with floor-to-ceiling Manhattan views, a two-story fitness center with yoga studio, a children's playroom, a screening room, an outdoor sundeck and grilling terrace, 24-hour doorman and valet service, and on-site garage parking.",
      },
    ],
  },
];

/** Convenience: lookup by slug. Returns undefined if not in registry. */
export function getHobokenTowerBySlug(slug: string): HobokenTower | undefined {
  return HOBOKEN_TOWERS.find((t) => t.slug === slug);
}

/** Convenience: every Hoboken tower except the one with this slug. */
export function getOtherHobokenTowers(slug: string): HobokenTower[] {
  return HOBOKEN_TOWERS.filter((t) => t.slug !== slug);
}
