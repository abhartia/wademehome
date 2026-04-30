import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { NeighborhoodLiveListings } from "@/components/neighborhoods/NeighborhoodLiveListings";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Apartments for Rent in the Financial District (FiDi), NYC (2026): Rent Prices, Subway & Office-Conversion Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in the Financial District (FiDi), Lower Manhattan. Rent prices by unit size, all-borough subway access (4/5/2/3/J/Z/R/W/A/C/E + PATH + ferries), office-to-residential conversion stock (70 Pine, 100 Wall, 25 Water), Battery Park City vs Seaport vs Stone Street micro-zones, no-fee inventory, and FARE Act notes.",
  keywords: [
    "financial district apartments",
    "fidi apartments",
    "fidi apartments for rent",
    "financial district apartments for rent",
    "fidi rent prices",
    "fidi rent 2026",
    "financial district rent",
    "downtown manhattan apartments",
    "lower manhattan apartments",
    "10004 apartments",
    "10005 apartments",
    "10006 apartments",
    "10038 apartments",
    "wall street apartments",
    "battery park city apartments",
    "south street seaport apartments",
    "stone street apartments",
    "70 pine apartments",
    "100 wall apartments",
    "25 water apartments",
    "office conversion apartments nyc",
    "downtown nyc no fee apartments",
    "fidi luxury apartments",
    "fidi 1 bedroom rent",
    "fidi 2 bedroom rent",
    "fidi studio rent",
    "fidi vs tribeca",
    "fidi vs jersey city",
    "wfc apartments",
    "fidi 4 5 train apartments",
    "fidi PATH apartments",
    "fidi staten island ferry apartments",
    "fidi commute manhattan",
    "fidi family apartments",
  ],
  openGraph: {
    title:
      "Apartments for Rent in the Financial District (FiDi), NYC (2026): Rent Prices, Subway & Conversion Guide",
    description:
      "2026 rent prices, subway access, office-conversion stock, Battery Park City + Seaport context, and apartment-hunting tips for the Financial District.",
    url: `${baseUrl}/nyc/financial-district`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/financial-district` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in the Financial District (FiDi), NYC (2026): Rent Prices, Subway & Office-Conversion Guide",
    description:
      "A 2026 guide to renting in the Financial District — rent by unit size, subway access across all five boroughs + PATH + ferries, the office-to-residential conversion wave, sub-zone breakdown, no-fee inventory, and apartment-hunting tips for FiDi.",
    datePublished: "2026-04-27",
    dateModified: "2026-04-27",
    publisher: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
    author: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
    mainEntityOfPage: `${baseUrl}/nyc/financial-district`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in the Financial District (FiDi)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, median asking rent in FiDi runs roughly $3,000 for a studio, $4,000 for a 1-bedroom, $5,500 for a 2-bedroom, and $7,500 for a 3-bedroom. Per-square-foot, FiDi runs $65–$90/sq ft annually — well below Tribeca and SoHo (which run $90–$140) but above the Upper East Side and most of Brooklyn. Trophy office-conversion buildings (70 Pine, 25 Water, 180 Water) clear $5,000–$7,500 for a 1-bedroom and full-floor 3-bedrooms list at $15K–$30K.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve the Financial District?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FiDi has the densest transit in NYC. The 4/5 stop at Bowling Green, Wall Street, and Fulton Street; the 2/3 at Wall Street and Fulton Street; the R/W at Whitehall, Rector, Cortlandt, and City Hall; the A/C at Fulton; the J/Z at Broad Street and Fulton; the 1 at Rector Street and South Ferry; the E at WTC. Plus the PATH (Hoboken, Newark, Jersey City via WTC), the Staten Island Ferry from Whitehall (free), the East River Ferry at Pier 11, and the Governors Island Ferry. Eleven subway lines plus three ferry routes plus PATH within walking distance — no other neighborhood comes close.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Financial District a good place to live?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FiDi has shifted dramatically in the last decade from a weekday-only office district to a 24/7 residential neighborhood. The South Street Seaport and Stone Street historic districts anchor evening and weekend activity, the Battery Park City greenway and esplanade provide miles of riverfront park, and the office-to-residential conversion wave (over 8 million sq ft of office space converted to apartments since 2010) has added meaningful resident density. Trade-offs are quieter weekend foot traffic outside the Seaport / Stone Street zones, fewer mom-and-pop retailers than the East Village or West Village, and a school zone (PS 89, PS 343) that fills quickly. The neighborhood is excellent for finance, legal, and tech workers commuting to FiDi, Brooklyn, or Jersey City; couples and families looking for new-construction luxury at sub-Tribeca pricing; and renters who prioritize transit density over a downtown 'scene.'",
        },
      },
      {
        "@type": "Question",
        name: "What are FiDi's office-to-residential conversion buildings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FiDi has the largest office-to-residential conversion stock in the country. The flagship conversions include: 70 Pine Street (1932 Cities Service Tower, converted 2016, 644 units, art deco lobby), 100 Wall Street (2017 conversion, 410 units), 25 Water Street (the 2024–2025 conversion of 4 New York Plaza, 1,300 units when fully delivered — the largest office-to-residential conversion in U.S. history), 180 Water Street (1971 office tower converted 2017, 573 units), 20 Broad Street (next to NYSE, 2018 conversion, 533 units), 116 John Street (2014 conversion). The conversion product is consistently characterized by oversized floor plates (giving residential layouts a deeper-than-typical Manhattan footprint), high ceilings, double-glazed historic windows, and full amenity packages (gym, pool, lounge, roof deck, often 24/7 doorman). Conversion stock typically runs 5–10% below comparable purpose-built new-construction in the same submarket.",
        },
      },
      {
        "@type": "Question",
        name: "Battery Park City vs Seaport vs Stone Street — which is right for me?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Battery Park City (west of West Street, north to Chambers) is the planned-community zone — quietest, most family-oriented, with the best parks, the river esplanade, and PS 89 / PS 234. Rents run a 5–10% premium over the FiDi core for comparable square footage. The Seaport (east of Pearl Street, south of the Brooklyn Bridge) is the 'going-out' zone — restored cobblestones, the Tin Building, the Howard Hughes Pier 17 entertainment complex. Newer rental towers there (One Seaport Residences, the Howard Hughes towers) lease at the upper end of FiDi pricing. Stone Street + Hanover Square is the cocktail-bar / restaurant cluster — very 'live where you go out' but limited residential inventory; most apartments here are smaller pre-war or boutique conversions. The FiDi core (Wall to Maiden Lane) is where most office-conversion luxury sits and where most renters end up; it offers the best square-foot-per-dollar in lower Manhattan.",
        },
      },
      {
        "@type": "Question",
        name: "Are there no-fee apartments in FiDi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — FiDi has one of the highest concentrations of no-fee apartments in Manhattan because office-conversion buildings and large rental towers nearly all use in-house leasing offices rather than third-party brokers. Under NYC's FARE Act (effective 2025-06-11), landlord-side broker fees are illegal anyway, so virtually 100% of FiDi inventory is now no-fee from the renter's perspective. The exception is owner sub-leases of condo units (a small share of FiDi inventory), where sub-lease rules vary by building.",
        },
      },
      {
        "@type": "Question",
        name: "How does FiDi compare to Jersey City Downtown for renters?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FiDi and Jersey City Downtown (07302) are direct competitors for the same finance/tech worker pool — both are PATH-linked to Midtown and FiDi via the same line. JC Downtown rents run roughly 15–25% below FiDi for comparable square footage in newer buildings ($3,100 1BR in JC vs $4,000 in FiDi typically). The trade-off is a 10-minute PATH commute back into Manhattan whenever you want to be there, plus the 07302 zip moves you out of the NYC tax base into NJ's. For renters whose office is in FiDi, staying in FiDi removes the daily commute friction and unlocks Manhattan amenities; for renters with flexible workplace and a $500–$1,000/month sensitivity, JC Downtown is the smarter spend.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "NYC",
        item: `${baseUrl}/nyc-rent-by-neighborhood`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Financial District",
        item: `${baseUrl}/nyc/financial-district`,
      },
    ],
  },
];

export default function FinancialDistrictPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Manhattan, NY</Badge>
              <Badge variant="outline">
                4/5 · 2/3 · J/Z · R/W · A/C/E · 1 · PATH · Ferries
              </Badge>
              <Badge className="bg-emerald-600">
                Luxury tier · office conversion
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in the Financial District (FiDi), NYC (2026):
              Rent Prices, Subway &amp; Office-Conversion Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              The Financial District has reinvented itself over the last decade
              from a weekday office monoculture into one of the densest mixed-use
              residential neighborhoods in Manhattan. Over 8 million square feet
              of office space has converted to apartments since 2010 — the
              largest office-to-residential conversion wave in the United
              States. FiDi now offers Tribeca-adjacent location and best-in-NYC
              transit density at 25–40% lower rent per square foot than its
              loft-conversion neighbors.
            </p>
            <p className="text-xs text-muted-foreground">
              Reviewed 2026-04-27 &middot; Prices reflect median asking rents
              for market-rate apartments
            </p>
          </header>

          {/* Live listings */}
          <NeighborhoodLiveListings
            neighborhoodName="Financial District"
            latitude={40.7074}
            longitude={-74.0113}
            radiusMiles={0.6}
            limit={6}
            searchQuery="Financial District apartments"
          />

          {/* At a glance */}
          <Card>
            <CardHeader>
              <CardTitle>FiDi at a Glance</CardTitle>
              <CardDescription>
                Key numbers for apartment hunters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median Studio Rent
                  </p>
                  <p className="text-lg font-semibold">$2,800 – $3,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,700 – $4,300</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$5,200 – $6,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Income Needed (1BR @ 40x)
                  </p>
                  <p className="text-lg font-semibold">~$148,000 – $172,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Subway + PATH Lines
                  </p>
                  <p className="text-lg font-semibold">
                    11 subway + PATH + 3 ferry
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    ZIP Codes
                  </p>
                  <p className="text-lg font-semibold">
                    10004, 10005, 10006, 10038
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rent prices */}
          <Card>
            <CardHeader>
              <CardTitle>FiDi Rent Prices by Unit Size (2026)</CardTitle>
              <CardDescription>
                Median asking rent across the office-conversion + new-con
                building stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Size</TableHead>
                      <TableHead>Conversion / New-Con</TableHead>
                      <TableHead>Pre-War / Boutique</TableHead>
                      <TableHead>Trophy Tier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Studio</TableCell>
                      <TableCell>$2,800 – $3,200</TableCell>
                      <TableCell>$2,400 – $2,800</TableCell>
                      <TableCell>$3,800 – $4,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">1-Bedroom</TableCell>
                      <TableCell>$3,700 – $4,300</TableCell>
                      <TableCell>$3,200 – $3,700</TableCell>
                      <TableCell>$5,000 – $7,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2-Bedroom</TableCell>
                      <TableCell>$5,200 – $6,000</TableCell>
                      <TableCell>$4,500 – $5,200</TableCell>
                      <TableCell>$7,500 – $12,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">3-Bedroom</TableCell>
                      <TableCell>$7,500 – $9,500</TableCell>
                      <TableCell>$6,500 – $7,500</TableCell>
                      <TableCell>$15,000 – $30,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Conversion / new-con accounts for the majority of FiDi rental
                inventory. Battery Park City typically commands a 5–10%
                premium over the FiDi core for comparable square footage.
              </p>
            </CardContent>
          </Card>

          {/* Sub-zones */}
          <Card>
            <CardHeader>
              <CardTitle>FiDi Sub-Zones</CardTitle>
              <CardDescription>
                Where the neighborhood splits — five distinct micro-markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone</TableHead>
                      <TableHead>Character</TableHead>
                      <TableHead>1BR Rent</TableHead>
                      <TableHead>Best For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Battery Park City
                      </TableCell>
                      <TableCell>
                        Planned community, river esplanade, family-oriented
                      </TableCell>
                      <TableCell>$4,000 – $4,800</TableCell>
                      <TableCell>Families, quiet weekenders</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">FiDi Core</TableCell>
                      <TableCell>
                        Office conversions, dense subway, weekday workforce
                      </TableCell>
                      <TableCell>$3,700 – $4,300</TableCell>
                      <TableCell>
                        Finance/tech workers, transit maximalists
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Seaport</TableCell>
                      <TableCell>
                        Cobblestones, Tin Building, Pier 17 entertainment
                      </TableCell>
                      <TableCell>$4,200 – $5,200</TableCell>
                      <TableCell>
                        Going-out scene, waterfront, new-con towers
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Stone Street / Hanover
                      </TableCell>
                      <TableCell>
                        Cocktail bars + restaurants, boutique inventory
                      </TableCell>
                      <TableCell>$3,400 – $4,000</TableCell>
                      <TableCell>
                        Pre-war boutique, walk to night-life
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Two Bridges / South of Wall
                      </TableCell>
                      <TableCell>
                        Quieter, transitional, value tier
                      </TableCell>
                      <TableCell>$3,100 – $3,700</TableCell>
                      <TableCell>
                        Best square-foot-per-dollar in FiDi
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Office conversion buildings */}
          <Card>
            <CardHeader>
              <CardTitle>FiDi Office-Conversion Trophy Stock</CardTitle>
              <CardDescription>
                The buildings that defined the largest office-to-residential
                wave in U.S. history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Building</TableHead>
                      <TableHead>Year Converted</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>1BR Asking Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        70 Pine Street
                      </TableCell>
                      <TableCell>2016</TableCell>
                      <TableCell>644</TableCell>
                      <TableCell>$4,200 – $5,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        100 Wall Street
                      </TableCell>
                      <TableCell>2017</TableCell>
                      <TableCell>410</TableCell>
                      <TableCell>$3,800 – $4,800</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        25 Water Street (4 NY Plaza)
                      </TableCell>
                      <TableCell>2024 – 2025</TableCell>
                      <TableCell>1,300 (largest in U.S.)</TableCell>
                      <TableCell>$3,800 – $5,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        180 Water Street
                      </TableCell>
                      <TableCell>2017</TableCell>
                      <TableCell>573</TableCell>
                      <TableCell>$3,700 – $4,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        20 Broad Street
                      </TableCell>
                      <TableCell>2018</TableCell>
                      <TableCell>533</TableCell>
                      <TableCell>$4,000 – $5,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        116 John Street
                      </TableCell>
                      <TableCell>2014</TableCell>
                      <TableCell>418</TableCell>
                      <TableCell>$3,500 – $4,200</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Conversion stock typically runs 5–10% below purpose-built
                new-construction at comparable amenity tiers because the
                deeper floor plates create some interior bedrooms that
                don&apos;t hit the rent comp of windowed bedrooms.
              </p>
            </CardContent>
          </Card>

          {/* Transit */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Around: Subway, PATH &amp; Ferries</CardTitle>
              <CardDescription>
                FiDi has the densest transit infrastructure in NYC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">4/5</span>{" "}
                  — Bowling Green, Wall Street, Fulton Street. Express to
                  Grand Central in 8 min, 86th St UES in 18 min.
                </div>
                <div>
                  <span className="font-semibold text-foreground">2/3</span>{" "}
                  — Wall Street, Fulton Street. Direct to Park Slope and
                  Crown Heights in 12–18 min.
                </div>
                <div>
                  <span className="font-semibold text-foreground">R/W</span>{" "}
                  — Whitehall, Rector, Cortlandt, City Hall. Local but
                  best-spaced FiDi coverage.
                </div>
                <div>
                  <span className="font-semibold text-foreground">A/C</span>{" "}
                  — Fulton Street. Express to West Village (4 stops) and
                  Inwood/Washington Hts.
                </div>
                <div>
                  <span className="font-semibold text-foreground">J/Z</span>{" "}
                  — Broad Street, Fulton Street. Direct LIE-corridor to
                  Williamsburg and Bushwick.
                </div>
                <div>
                  <span className="font-semibold text-foreground">1</span> —
                  Rector Street, South Ferry. To Tribeca, Chelsea, UWS.
                </div>
                <div>
                  <span className="font-semibold text-foreground">E</span> —
                  WTC. To Midtown West (8th Ave) and Queens.
                </div>
                <div>
                  <span className="font-semibold text-foreground">PATH</span>{" "}
                  — WTC station. Direct to Hoboken (8 min), Newport (5 min),
                  Grove Street (7 min), Newark Penn (20 min).
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Staten Island Ferry
                  </span>{" "}
                  — Whitehall, free, every 15–30 min, 25 min crossing.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    East River Ferry
                  </span>{" "}
                  — Pier 11. To DUMBO, Williamsburg, LIC, the Rockaways.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hunting tips */}
          <Card>
            <CardHeader>
              <CardTitle>FiDi Apartment-Hunting Tips</CardTitle>
              <CardDescription>
                Tactics for the office-conversion + new-con tower market
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Confirm whether bedrooms are windowed.
                </span>{" "}
                Office conversions have deeper floor plates than purpose-built
                residential, so some 2BR layouts have an interior or
                pseudo-windowed second bedroom. NYC law requires every legally
                designated bedroom to have a window meeting code, but
                marketing photos can obscure orientation. Always verify
                in-person or with a floor plan.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Ask about weekend doorman coverage.
                </span>{" "}
                Some FiDi conversions have full 24/7 doorman; others scale
                down to concierge-only on weekends, when the daytime workforce
                isn&apos;t there. If you receive packages, prefer 24/7
                coverage.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Net-effective math is everywhere.
                </span>{" "}
                FiDi conversion buildings list net-effective rents almost
                universally. Always confirm the gross figure (the renewal
                anchor) before signing.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  School zones fill quickly.
                </span>{" "}
                If you have school-age kids, PS 89 (Battery Park City) and PS
                343 (the Peck Slip School in the Seaport) are both popular and
                often at-capacity. Lease specifically inside the zone you
                want and confirm with the DOE before signing.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Battery Park City has its own ground-lease quirk.
                </span>{" "}
                BPC buildings sit on Battery Park City Authority ground
                leases, which expire mid-century. This affects condo pricing
                meaningfully but rarely affects renters — just be aware that
                some condo boards have stricter sub-lease restrictions on BPC
                inventory.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Stone Street + Hanover Square are louder Thursday–Saturday.
                </span>{" "}
                The cocktail-bar zone has heavy weekend foot traffic and
                outdoor seating noise on a few specific blocks. Tour at peak
                hours (9 PM Friday) before signing if quiet matters.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Compare Jersey City Downtown if budget-sensitive.
                </span>{" "}
                A $4,000 FiDi 1-bedroom is comparable to a $3,100 JC Downtown
                1-bedroom in a similar new-construction tower. The FiDi
                premium pays for daily commute friction removal — only worth
                it if your office is actually in FiDi or Midtown.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Check FARE Act compliance in writing.
                </span>{" "}
                FiDi inventory should be 100% no-fee post-FARE Act. If a
                broker tries to charge a tenant-side fee, the unit is either
                represented by your broker (legal) or the broker is breaking
                NYC law (refuse).
              </p>
            </CardContent>
          </Card>

          {/* Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>FiDi vs. Tribeca vs. Jersey City Downtown</CardTitle>
              <CardDescription>
                The three direct competitors for downtown-office workers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>FiDi</TableHead>
                      <TableHead>Tribeca</TableHead>
                      <TableHead>JC Downtown (07302)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">1BR median</TableCell>
                      <TableCell>$3,700–$4,300</TableCell>
                      <TableCell>$11,500</TableCell>
                      <TableCell>$3,100–$3,700</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">$/sq ft</TableCell>
                      <TableCell>$65–$90</TableCell>
                      <TableCell>$90–$140</TableCell>
                      <TableCell>$50–$70</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Subway lines
                      </TableCell>
                      <TableCell>11 + PATH + ferries</TableCell>
                      <TableCell>8 + PATH</TableCell>
                      <TableCell>PATH only</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Building stock
                      </TableCell>
                      <TableCell>Office conversion + new-con</TableCell>
                      <TableCell>Loft conversion + trophy</TableCell>
                      <TableCell>Purpose-built new-con</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Tax base</TableCell>
                      <TableCell>NY (city + state)</TableCell>
                      <TableCell>NY (city + state)</TableCell>
                      <TableCell>NJ (no NYC tax)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Weekend foot traffic
                      </TableCell>
                      <TableCell>Moderate (Seaport + BPC)</TableCell>
                      <TableCell>Light</TableCell>
                      <TableCell>Light</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Related */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <Link
                  href="/nyc/financial-district/rent-prices"
                  className="text-primary underline underline-offset-2"
                >
                  FiDi rent prices
                </Link>{" "}
                &mdash; full breakdown by unit size, sub-zone, and building tier
                (office-conversion vs. pre-war loft vs. trophy new-con).
              </p>
              <p>
                <Link
                  href="/nyc/tribeca"
                  className="text-primary underline underline-offset-2"
                >
                  Tribeca apartments
                </Link>{" "}
                &mdash; FiDi&apos;s loft-conversion neighbor, the city&apos;s
                top luxury tier.
              </p>
              <p>
                <Link
                  href="/nyc/soho"
                  className="text-primary underline underline-offset-2"
                >
                  SoHo apartments
                </Link>{" "}
                &mdash; cast-iron historic district just north of Tribeca.
              </p>
              <p>
                <Link
                  href="/jersey-city/downtown"
                  className="text-primary underline underline-offset-2"
                >
                  Jersey City Downtown apartments
                </Link>{" "}
                &mdash; the cross-river value alternative for FiDi-bound
                workers.
              </p>
              <p>
                <Link
                  href="/nyc/luxury-apartments"
                  className="text-primary underline underline-offset-2"
                >
                  NYC luxury apartments
                </Link>{" "}
                &mdash; the citywide luxury tier map.
              </p>
              <p>
                <Link
                  href="/nyc/no-fee-apartments"
                  className="text-primary underline underline-offset-2"
                >
                  NYC no-fee apartments
                </Link>{" "}
                &mdash; FARE Act post-2025 inventory.
              </p>
              <p>
                <Link
                  href="/nyc-rent-by-neighborhood"
                  className="text-primary underline underline-offset-2"
                >
                  NYC rent by neighborhood
                </Link>{" "}
                &mdash; full citywide rent comparison.
              </p>
              <p>
                <Link
                  href="/best-time-to-rent-nyc"
                  className="text-primary underline underline-offset-2"
                >
                  Best time to rent in NYC
                </Link>{" "}
                &mdash; month-by-month strategy for FiDi conversions.
              </p>
              <p>
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="text-primary underline underline-offset-2"
                >
                  NYC FARE Act broker fee ban
                </Link>{" "}
                &mdash; what changed in 2025.
              </p>
            </CardContent>
          </Card>

          <Separator />
          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/">Find your FiDi apartment with Wade Me Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
