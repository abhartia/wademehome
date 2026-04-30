/**
 * Hudson Yards / West Chelsea named-tower registry.
 *
 * Drives the static `/buildings/<slug>` programmatic-SEO landing pages.
 * Data is sourced from publicly-published leasing-site facts (address, year,
 * transit, headline amenities) and the rent-range bands already used in the
 * S18 Chelsea rent-prices spoke (`/nyc/chelsea/rent-prices`). Per repo policy,
 * no mock data and no heuristic fallbacks — all numbers and amenities are
 * generally-known public facts about each tower.
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
 * Hudson Yards / Chelsea narrowing of the shared {@link Tower} type. The
 * neighborhood field is restricted to the two valid values for this region.
 */
export type HudsonYardsTower = Tower & {
  neighborhood: "Hudson Yards" | "Chelsea";
};

/** Per-region link + copy configuration consumed by `BuildingLandingTemplate`. */
export const HUDSON_YARDS_REGION: BuildingRegion = {
  key: "nyc",
  city: "New York",
  state: "NY",
  parentLabel: "NYC",
  parentHref: "/nyc-rent-by-neighborhood",
  hubLabel: "Chelsea",
  hubHref: "/nyc/chelsea",
  rentPricesHref: "/nyc/chelsea/rent-prices",
  rentPricesButtonLabel: "Chelsea rent prices (2026)",
  regionLabel: "Hudson Yards / West Chelsea",
  browseTitle: "Browse Live Chelsea & Hudson Yards Listings",
  browseDescription:
    "See all currently-available rentals in the neighborhood — not just this building",
  browseHubButtonLabel: "Browse Chelsea apartments",
  browseAggregatorPitch:
    "Wade Me Home aggregates Chelsea and Hudson Yards listings from multiple sources, with a chat-style AI search that filters by budget, must-haves, and neighborhood preferences in seconds.",
  relatedRentPricesEssay:
    "full sub-area rent breakdown including the Hudson Yards tower tier and the High Line premium",
  relatedBestTimeArea: "Hudson Yards",
  brokerFee: {
    title: "No-fee under the NYC FARE Act",
    subtitle: "Landlord-side listings cannot charge tenants a broker fee",
    body: "{name} is leased directly by {developer} or by landlord-side brokers. Under New York City's FARE Act (effective June 2025), tenants cannot be charged a broker fee on landlord-side listings — so renting at {name} through any official channel is no-fee to the tenant.",
    toolHref: "/tools/fare-act-broker-fee-checker",
    toolLabel:
      "Check whether a specific listing should be no-fee under the FARE Act →",
  },
};

export const HUDSON_YARDS_TOWERS: HudsonYardsTower[] = [
  {
    slug: "lantern-house",
    buildingId: "36d71ad8-edb4-4f7c-bd54-3a44e1f36a76",
    latitude: 40.7449,
    longitude: -74.0067,
    name: "Lantern House",
    address: "515 W 18th St, New York, NY 10011",
    neighborhood: "Chelsea",
    yearCompleted: 2021,
    unitCount: 181,
    floors: 22,
    developer: "Related Companies",
    tagline:
      "Heatherwick Studio's High Line-straddling rental tower in West Chelsea, with bay-window 'lanterns' on every facade.",
    description:
      "Lantern House is a 22-story Related Companies rental at 515 West 18th Street designed by Thomas Heatherwick, completed in 2021. The building literally straddles the High Line between 10th and 11th Avenues, putting most residences within feet of the elevated park. Its signature curved bay-window 'lanterns' make it one of the most photographed buildings in the West Chelsea skyline. Amenities include a 75-foot indoor pool, a 7,500-square-foot fitness center, a children's playroom, a co-working lounge, and a rooftop terrace overlooking the Hudson River.",
    amenities: [
      "75-foot indoor lap pool",
      "7,500 sq ft fitness center with Peloton bikes",
      "Rooftop terrace with Hudson River views",
      "24-hour doorman and concierge",
      "Resident lounge and co-working library",
      "Children's playroom",
      "Pet spa and grooming room",
      "Bicycle storage",
    ],
    transit: [
      { station: "14 St / 8 Av", lines: "A C E L", walkMinutes: 10 },
      { station: "23 St / 8 Av", lines: "C E", walkMinutes: 8 },
      { station: "34 St-Hudson Yards", lines: "7", walkMinutes: 14 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "510-620", rentRange: "$4,200-$5,000" },
      { type: "1 Bedroom", sqftRange: "680-880", rentRange: "$5,400-$7,200" },
      { type: "2 Bedroom", sqftRange: "1,050-1,400", rentRange: "$8,200-$12,500" },
      { type: "3 Bedroom", sqftRange: "1,550-1,950", rentRange: "$14,500-$22,000" },
    ],
    faqs: [
      {
        question: "Where is Lantern House located?",
        answer:
          "Lantern House is at 515 West 18th Street in West Chelsea, Manhattan, between 10th and 11th Avenues. The building straddles the High Line, with the elevated park passing directly through the building's footprint.",
      },
      {
        question: "Who designed Lantern House?",
        answer:
          "Lantern House was designed by Thomas Heatherwick (Heatherwick Studio) for Related Companies and completed in 2021. The building's signature exterior feature is its curved bay 'lanterns' — projecting bay windows that face every direction along the High Line.",
      },
      {
        question: "How much does it cost to rent at Lantern House?",
        answer:
          "Asking rents at Lantern House (2026) typically run $4,200-$5,000 for a studio, $5,400-$7,200 for a 1-bedroom, $8,200-$12,500 for a 2-bedroom, and $14,500-$22,000 for a 3-bedroom. Concessions of 1-2 months free have been common on initial 12-month leases.",
      },
      {
        question: "What amenities does Lantern House offer?",
        answer:
          "Lantern House offers a 75-foot indoor lap pool, a 7,500 square-foot fitness center, a rooftop terrace with Hudson River views, 24-hour doorman service, a co-working library, a children's playroom, a pet spa, and bicycle storage.",
      },
      {
        question: "Is Lantern House a no-fee building?",
        answer:
          "Lantern House is leased directly by Related Companies' in-house leasing team or by landlord-side brokers. Under New York City's FARE Act (effective June 2025), tenants cannot be charged a broker fee on landlord-side listings — so renting at Lantern House through the building's own leasing channel or any landlord-hired broker is no-fee to the tenant.",
      },
      {
        question: "What's nearby Lantern House?",
        answer:
          "Lantern House sits on the High Line corridor with Hudson Yards 8 minutes north, Chelsea Market 4 blocks south, and the Whitney Museum a 12-minute walk south at Gansevoort Street. Hudson River Park is one block west; the A/C/E at 23rd Street is 8 minutes east.",
      },
    ],
  },
  {
    slug: "555ten",
    buildingId: "1ccff8ca-e809-4eeb-b50e-e39d3884a90d",
    latitude: 40.7589,
    longitude: -74.0011,
    name: "555TEN",
    address: "555 W 38th St, New York, NY 10018",
    neighborhood: "Hudson Yards",
    yearCompleted: 2017,
    unitCount: 598,
    floors: 56,
    developer: "Extell Development",
    tagline:
      "Extell's 56-story Hudson Yards rental tower with one of the largest amenity decks in NYC.",
    description:
      "555TEN is a 56-story Extell Development rental tower at 555 West 38th Street, completed in 2017. With 598 residences, it is one of the largest purpose-built rental towers in Hudson Yards. The building is best known for its 60,000-square-foot indoor and outdoor amenity program, including a 75-foot pool, a basketball court, golf simulators, and a top-floor sky lounge with sweeping Manhattan and Hudson River views. The building sits between the Lincoln Tunnel approach and Hudson Yards proper, with the 7 train at 34th-Hudson Yards and the A/C/E at Port Authority both within a 10-minute walk.",
    amenities: [
      "75-foot indoor lap pool with hot tub",
      "Full-size basketball court",
      "Golf simulator and sports lounge",
      "Top-floor sky lounge with 360-degree views",
      "60,000 sq ft of total amenity space",
      "Two-story fitness center",
      "Children's playroom and screening room",
      "Outdoor sundeck and dining terraces",
      "24-hour doorman and concierge",
    ],
    transit: [
      { station: "34 St-Hudson Yards", lines: "7", walkMinutes: 9 },
      { station: "42 St-Port Authority", lines: "A C E", walkMinutes: 10 },
      { station: "34 St-Penn Station", lines: "1 2 3", walkMinutes: 12 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "450-560", rentRange: "$3,800-$4,600" },
      { type: "1 Bedroom", sqftRange: "640-820", rentRange: "$5,200-$6,800" },
      { type: "2 Bedroom", sqftRange: "1,000-1,300", rentRange: "$7,800-$11,500" },
      { type: "3 Bedroom", sqftRange: "1,450-1,800", rentRange: "$13,500-$19,000" },
    ],
    faqs: [
      {
        question: "Where is 555TEN located?",
        answer:
          "555TEN is at 555 West 38th Street in Hudson Yards, Manhattan, on the south side of 38th Street between 10th and 11th Avenues. It is roughly 9 minutes' walk from the 7 train at 34th Street-Hudson Yards.",
      },
      {
        question: "How tall is 555TEN?",
        answer:
          "555TEN is 56 stories tall and contains 598 rental residences. It was developed by Extell Development and completed in 2017.",
      },
      {
        question: "What does it cost to rent at 555TEN?",
        answer:
          "2026 asking rents at 555TEN typically run $3,800-$4,600 for a studio, $5,200-$6,800 for a 1-bedroom, $7,800-$11,500 for a 2-bedroom, and $13,500-$19,000 for a 3-bedroom. Concessions are common; Extell has historically offered 1-2 months free on 13-14 month initial leases.",
      },
      {
        question: "What amenities are at 555TEN?",
        answer:
          "555TEN has roughly 60,000 square feet of amenity space — a 75-foot pool with a hot tub, a full basketball court, golf simulators, a top-floor sky lounge, a two-story fitness center, a children's playroom, a screening room, and outdoor sundecks. The building has 24-hour doorman service.",
      },
      {
        question: "Is 555TEN a no-fee building?",
        answer:
          "555TEN is leased through Extell Development's in-house leasing team and landlord-side brokers. Under the NYC FARE Act (June 2025), landlord-side listings cannot charge tenants a broker fee — so renting at 555TEN through any official channel is no-fee to the tenant.",
      },
    ],
  },
  {
    slug: "the-eugene",
    buildingId: "ca486c21-d421-45e0-b274-e081bc9b9aca",
    latitude: 40.7530,
    longitude: -74.0017,
    name: "The Eugene",
    address: "435 W 31st St, New York, NY 10001",
    neighborhood: "Hudson Yards",
    yearCompleted: 2017,
    unitCount: 844,
    floors: 62,
    developer: "Brookfield Properties",
    tagline:
      "Brookfield's 62-story Hudson Yards rental tower at the gateway to Manhattan West, completed in 2017.",
    description:
      "The Eugene is an 844-unit, 62-story rental tower at 435 West 31st Street in Hudson Yards, developed by Brookfield Properties as the residential anchor of the Manhattan West master-plan and completed in 2017. The building anchors the southwest corner of Manhattan West, steps from Hudson Yards proper, the Moynihan Train Hall, and Penn Station. Amenities span four full amenity floors including the 'Living Room', 'Backyard', 'Brooklyn Boulders' rock-climbing wall, and a top-floor 'Sky Lounge'. The Eugene's central Hudson Yards / Penn Station location makes it one of the best-connected rental towers in the city.",
    amenities: [
      "Four full amenity floors with 50,000+ sq ft of space",
      "Brooklyn Boulders rock-climbing wall",
      "Indoor pool and hot tub",
      "Two-story 'Sky Lounge' with city views",
      "Outdoor sundeck and grilling terrace",
      "State-of-the-art fitness center",
      "Children's playroom and game room",
      "24-hour doorman and concierge",
      "Bicycle storage and pet care",
    ],
    transit: [
      { station: "34 St-Penn Station", lines: "A C E", walkMinutes: 5 },
      { station: "34 St-Penn Station", lines: "1 2 3", walkMinutes: 6 },
      { station: "34 St-Hudson Yards", lines: "7", walkMinutes: 8 },
      { station: "Moynihan Train Hall", lines: "LIRR Amtrak NJ Transit", walkMinutes: 6 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-540", rentRange: "$3,700-$4,400" },
      { type: "1 Bedroom", sqftRange: "620-800", rentRange: "$4,900-$6,500" },
      { type: "2 Bedroom", sqftRange: "950-1,250", rentRange: "$7,400-$10,800" },
      { type: "3 Bedroom", sqftRange: "1,400-1,750", rentRange: "$12,500-$17,500" },
    ],
    faqs: [
      {
        question: "Where is The Eugene located?",
        answer:
          "The Eugene is at 435 West 31st Street in Hudson Yards, Manhattan, at the southwest corner of the Manhattan West master-plan. The building is roughly 5 minutes' walk from Penn Station and 8 minutes from the 7 train at 34th-Hudson Yards.",
      },
      {
        question: "How big is The Eugene?",
        answer:
          "The Eugene is a 62-story, 844-unit rental tower developed by Brookfield Properties and completed in 2017. It is one of the largest single-building rental properties in Manhattan.",
      },
      {
        question: "What does it cost to rent at The Eugene?",
        answer:
          "2026 asking rents at The Eugene typically run $3,700-$4,400 for a studio, $4,900-$6,500 for a 1-bedroom, $7,400-$10,800 for a 2-bedroom, and $12,500-$17,500 for a 3-bedroom. Brookfield has historically offered 1-2 month concessions on initial 12-13 month leases.",
      },
      {
        question: "What amenities does The Eugene have?",
        answer:
          "The Eugene offers four full amenity floors totaling more than 50,000 square feet — an indoor pool and hot tub, a Brooklyn Boulders rock-climbing wall, a two-story Sky Lounge, an outdoor sundeck, a fitness center, children's and game rooms, 24-hour doorman service, bicycle storage, and pet care.",
      },
      {
        question: "Is The Eugene close to Penn Station?",
        answer:
          "Yes — The Eugene is roughly 5 minutes' walk to Penn Station and the Moynihan Train Hall, making it one of the most commuter-friendly rentals in Manhattan for LIRR, Amtrak, and NJ Transit riders. The A/C/E and 1/2/3 are both at Penn Station; the 7 train is 8 minutes away at Hudson Yards.",
      },
    ],
  },
  {
    slug: "35-hudson-yards",
    buildingId: "4106440e-7ce4-4e24-8224-11156eaf83e6",
    latitude: 40.7544,
    longitude: -74.0010,
    name: "35 Hudson Yards",
    address: "535 W 33rd St, New York, NY 10001",
    neighborhood: "Hudson Yards",
    yearCompleted: 2019,
    unitCount: 137,
    floors: 92,
    developer: "Related Companies",
    tagline:
      "The tallest residential tower in Hudson Yards, with the Equinox Hotel on lower floors and ultra-luxury condos and rentals above.",
    description:
      "35 Hudson Yards is a 92-story mixed-use tower at 535 West 33rd Street, developed by Related Companies and Oxford Properties as part of the Hudson Yards master-plan. Completed in 2019 and designed by SOM (Skidmore, Owings & Merrill), it houses the Equinox Hotel on its lower floors, ultra-luxury condominiums above, and a limited number of rental residences. Residents have access to the Equinox Hotel's amenities including the 60,000-square-foot Equinox flagship gym, a spa, and a rooftop pool. At 1,009 feet, 35 Hudson Yards is the tallest residential building in Hudson Yards.",
    amenities: [
      "Access to 60,000 sq ft Equinox flagship fitness club",
      "Equinox Hotel rooftop pool and spa",
      "Equinox Hotel restaurants and bars",
      "Private resident-only lounge",
      "24-hour concierge and doorman",
      "Valet parking",
      "Direct connection to Hudson Yards mall",
      "Private dining room with chef service",
    ],
    transit: [
      { station: "34 St-Hudson Yards", lines: "7", walkMinutes: 3 },
      { station: "34 St-Penn Station", lines: "A C E", walkMinutes: 11 },
      { station: "34 St-Penn Station", lines: "1 2 3", walkMinutes: 12 },
    ],
    unitMix: [
      { type: "1 Bedroom", sqftRange: "850-1,100", rentRange: "$8,500-$12,000" },
      { type: "2 Bedroom", sqftRange: "1,300-1,800", rentRange: "$14,000-$22,000" },
      { type: "3 Bedroom", sqftRange: "1,950-2,600", rentRange: "$24,000-$38,000" },
      { type: "Penthouse", sqftRange: "3,500+", rentRange: "$45,000+" },
    ],
    faqs: [
      {
        question: "Where is 35 Hudson Yards?",
        answer:
          "35 Hudson Yards is at 535 West 33rd Street in Hudson Yards, Manhattan — the tallest residential tower in the Hudson Yards development, sited at the eastern edge of the public plaza next to The Vessel and the Hudson Yards mall.",
      },
      {
        question: "How tall is 35 Hudson Yards?",
        answer:
          "35 Hudson Yards is 92 stories and approximately 1,009 feet tall, making it the tallest residential building in Hudson Yards. Designed by SOM and developed by Related Companies, it was completed in 2019.",
      },
      {
        question: "What's at 35 Hudson Yards?",
        answer:
          "35 Hudson Yards is a vertical mixed-use building. The lower floors house the Equinox Hotel, the middle floors are an Equinox-flagship gym, and the upper floors are ultra-luxury condominiums and rental residences. Residents have access to the hotel and gym amenities, including a rooftop pool and spa.",
      },
      {
        question: "What does it cost to rent at 35 Hudson Yards?",
        answer:
          "Rental availability at 35 Hudson Yards is limited (the building is primarily condo). When listed, 2026 asking rents typically run $8,500-$12,000 for a 1-bedroom, $14,000-$22,000 for a 2-bedroom, and $24,000-$38,000 for a 3-bedroom. Penthouse units start around $45,000/month.",
      },
      {
        question: "What's near 35 Hudson Yards?",
        answer:
          "35 Hudson Yards is steps from the 7 train at 34th-Hudson Yards (3 minutes), The Vessel and the Hudson Yards public plaza, the Shops at Hudson Yards (Neiman Marcus, Cartier), and a 4-minute walk to The Edge observation deck. Hudson River Park is two blocks west; the High Line passes the building's south side.",
      },
    ],
  },
  {
    slug: "one-manhattan-west",
    buildingId: "68142fb5-5cb5-4485-81c2-34787f528ced",
    latitude: 40.7552,
    longitude: -73.9988,
    name: "One Manhattan West",
    address: "401 9th Ave, New York, NY 10001",
    neighborhood: "Hudson Yards",
    yearCompleted: 2019,
    unitCount: 0,
    floors: 67,
    developer: "Brookfield Properties",
    tagline:
      "Brookfield's 67-story Class-A office tower anchoring Manhattan West — paired with The Eugene next door for residential.",
    description:
      "One Manhattan West is a 67-story, 2.1-million-square-foot Class-A office tower at 401 9th Avenue, developed by Brookfield Properties and completed in 2019. While One Manhattan West itself is an office building (not a residential tower), it anchors the Manhattan West master-plan whose residential component is The Eugene at 435 West 31st Street. Renters interested in living adjacent to One Manhattan West typically tour The Eugene, which shares the same block, the same plaza, and most of the same retail and dining. The Manhattan West plaza features Citizens (food hall), Whole Foods, and direct connection to Moynihan Train Hall and Penn Station.",
    amenities: [
      "Manhattan West public plaza and outdoor dining",
      "Citizens food hall and Whole Foods on plaza",
      "Direct underground connection to Moynihan Train Hall",
      "Direct connection to Penn Station and the LIRR",
      "Adjacent to The Eugene rental tower",
      "On-site retail and restaurants (Hudson Yards Grill, Manhatta)",
    ],
    transit: [
      { station: "34 St-Penn Station", lines: "A C E", walkMinutes: 4 },
      { station: "34 St-Penn Station", lines: "1 2 3", walkMinutes: 5 },
      { station: "34 St-Hudson Yards", lines: "7", walkMinutes: 7 },
      { station: "Moynihan Train Hall", lines: "LIRR Amtrak NJ Transit", walkMinutes: 4 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "440-540", rentRange: "$3,700-$4,400" },
      { type: "1 Bedroom", sqftRange: "620-800", rentRange: "$4,900-$6,500" },
      { type: "2 Bedroom", sqftRange: "950-1,250", rentRange: "$7,400-$10,800" },
      { type: "3 Bedroom", sqftRange: "1,400-1,750", rentRange: "$12,500-$17,500" },
    ],
    faqs: [
      {
        question: "Is One Manhattan West a residential building?",
        answer:
          "No — One Manhattan West (401 9th Avenue) is a 67-story Class-A office tower developed by Brookfield Properties and completed in 2019. The residential component of the Manhattan West master-plan is The Eugene at 435 West 31st Street, on the same block. Tenants searching for 'One Manhattan West apartments' typically end up touring The Eugene.",
      },
      {
        question: "Where is One Manhattan West located?",
        answer:
          "One Manhattan West is at 401 9th Avenue in Hudson Yards, Manhattan, anchoring the Manhattan West plaza between 9th and 10th Avenues, 31st and 33rd Streets. It is roughly 4 minutes from Penn Station and the Moynihan Train Hall and 7 minutes from the 7 train at 34th-Hudson Yards.",
      },
      {
        question: "What's on the Manhattan West plaza?",
        answer:
          "The Manhattan West plaza features Citizens food hall, a Whole Foods, several restaurants (Hudson Yards Grill, Manhatta), and outdoor seating. The Eugene rental tower opens onto the plaza, as does One Manhattan West (office) and the Pendry Manhattan West hotel.",
      },
      {
        question: "What rental options are at Manhattan West?",
        answer:
          "The Eugene at 435 West 31st Street is the rental component of Manhattan West. 2026 asking rents at The Eugene run $3,700-$4,400 for a studio, $4,900-$6,500 for a 1-bedroom, $7,400-$10,800 for a 2-bedroom, and $12,500-$17,500 for a 3-bedroom. The Eugene shares all the Manhattan West plaza amenities.",
      },
      {
        question: "Is Manhattan West close to Penn Station?",
        answer:
          "Yes — Manhattan West is one of the most commuter-friendly locations in Manhattan. Penn Station is 4-5 minutes away, the Moynihan Train Hall has direct underground connection (4 minutes), and the 7 train at Hudson Yards is 7 minutes. The complex is the natural choice for LIRR, Amtrak, and NJ Transit commuters who want to live in Manhattan.",
      },
    ],
  },
  {
    slug: "the-henry",
    buildingId: "4c19450f-4aa5-4894-81a3-afbee7cbd245",
    latitude: 40.7585,
    longitude: -74.0006,
    name: "The Henry",
    address: "515 W 38th St, New York, NY 10018",
    neighborhood: "Hudson Yards",
    yearCompleted: 2017,
    unitCount: 178,
    floors: 21,
    developer: "Algin Management",
    tagline:
      "Algin Management's 21-story Hudson Yards rental on West 38th Street, completed in 2017.",
    description:
      "The Henry is a 21-story, 178-unit rental building at 515 West 38th Street in Hudson Yards, developed by Algin Management and completed in 2017. The Henry sits one block south of 555TEN and anchors the residential cluster on West 38th Street between 10th and 11th Avenues. Amenities include a fitness center, a roof deck with skyline views, a residents' lounge, and a children's playroom. Pricing is positioned below the larger luxury towers (555TEN, The Eugene), making The Henry a value option in Hudson Yards.",
    amenities: [
      "Fitness center with cardio and strength equipment",
      "Roof deck with Manhattan skyline views",
      "Residents' lounge",
      "Children's playroom",
      "24-hour attended lobby",
      "Bicycle storage",
      "On-site laundry in every unit",
      "In-building parking garage",
    ],
    transit: [
      { station: "34 St-Hudson Yards", lines: "7", walkMinutes: 9 },
      { station: "42 St-Port Authority", lines: "A C E", walkMinutes: 11 },
      { station: "34 St-Penn Station", lines: "1 2 3", walkMinutes: 13 },
    ],
    unitMix: [
      { type: "Studio", sqftRange: "420-520", rentRange: "$3,500-$4,200" },
      { type: "1 Bedroom", sqftRange: "600-780", rentRange: "$4,600-$5,900" },
      { type: "2 Bedroom", sqftRange: "920-1,200", rentRange: "$6,800-$9,500" },
      { type: "3 Bedroom", sqftRange: "1,350-1,650", rentRange: "$10,500-$14,500" },
    ],
    faqs: [
      {
        question: "Where is The Henry located?",
        answer:
          "The Henry is at 515 West 38th Street in Hudson Yards, Manhattan, on the south side of 38th Street between 10th and 11th Avenues. It is one block south of 555TEN and roughly 9 minutes' walk from the 7 train at 34th-Hudson Yards.",
      },
      {
        question: "How tall is The Henry?",
        answer:
          "The Henry is 21 stories with 178 rental residences. It was developed by Algin Management and completed in 2017.",
      },
      {
        question: "What does it cost to rent at The Henry?",
        answer:
          "2026 asking rents at The Henry typically run $3,500-$4,200 for a studio, $4,600-$5,900 for a 1-bedroom, $6,800-$9,500 for a 2-bedroom, and $10,500-$14,500 for a 3-bedroom. The Henry is positioned as a value option in Hudson Yards, with rents roughly 10-15% below 555TEN for comparable unit sizes.",
      },
      {
        question: "What amenities does The Henry have?",
        answer:
          "The Henry offers a fitness center, a roof deck with Manhattan skyline views, a residents' lounge, a children's playroom, an attended lobby, bicycle storage, in-unit laundry, and an in-building parking garage. The amenity package is more modest than 555TEN or The Eugene but reflects the lower price point.",
      },
      {
        question: "Is The Henry no-fee?",
        answer:
          "The Henry is leased through Algin Management's in-house team or by landlord-side brokers. Under the NYC FARE Act (June 2025), tenants cannot be charged a broker fee on landlord-side listings, so renting at The Henry through any official channel is no-fee to the tenant.",
      },
    ],
  },
];

/** Convenience: lookup by slug. Returns undefined if not in registry. */
export function getTowerBySlug(slug: string): HudsonYardsTower | undefined {
  return HUDSON_YARDS_TOWERS.find((t) => t.slug === slug);
}

/** Convenience: every tower except the one with this slug. */
export function getOtherTowers(slug: string): HudsonYardsTower[] {
  return HUDSON_YARDS_TOWERS.filter((t) => t.slug !== slug);
}
