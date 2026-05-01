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
import { RentStabilizationChecker } from "@/components/rent-stab/RentStabilizationChecker";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Park Slope Apartments: Rent Prices, Transit & Neighborhood Guide (2026) | Wade Me Home",
  description:
    "Complete guide to renting in Park Slope, Brooklyn. Average rent by unit size, F/G/2/3/R subway access, brownstones vs. new construction, North vs. South Slope, school district 15, and practical tips for finding an apartment in Brooklyn's premier family neighborhood.",
  keywords: [
    "Park Slope apartments",
    "Park Slope Brooklyn rent",
    "Park Slope apartments for rent",
    "Park Slope rent prices 2026",
    "brownstone apartments Park Slope",
    "family apartments Park Slope",
    "Park Slope 1 bedroom rent",
    "Park Slope 2 bedroom rent",
    "North Slope vs South Slope",
    "apartments near Prospect Park",
    "moving to Park Slope Brooklyn",
    "apartments 11215 11217 11238",
    "Park Slope studios rent",
  ],
  openGraph: {
    title:
      "Park Slope Apartments: Rent Prices, Transit & Neighborhood Guide (2026)",
    description:
      "Average rent, subway access, brownstones, North vs. South Slope, and apartment-hunting tips for Brooklyn's premier family neighborhood.",
    url: `${baseUrl}/nyc/park-slope`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/park-slope` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Park Slope Apartments: Rent Prices, Transit & Neighborhood Guide for 2026",
    description:
      "A comprehensive guide to renting an apartment in Park Slope, Brooklyn — covering average rent prices, F/G/2/3/R subway access, brownstone vs. new construction buildings, North vs. South Slope dynamics, schools, and practical tips for apartment hunters.",
    datePublished: "2026-04-19",
    dateModified: "2026-04-30",
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
    mainEntityOfPage: `${baseUrl}/nyc/park-slope`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Park Slope?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, studios in Park Slope typically range from $2,200 to $2,900 per month, one-bedrooms from $2,800 to $3,900, two-bedrooms from $3,800 to $5,500, and three-bedrooms from $5,200 to $8,000 or more. North Slope (north of 9th Street, closer to Atlantic Avenue) commands the highest rents due to express subway access and proximity to Barclays Center. South Slope (south of 9th Street, toward Prospect Park South) is typically 10 to 20 percent more affordable with a similar brownstone streetscape.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve Park Slope?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Park Slope is served by the F and G trains on Fourth Avenue, the R train on Fourth Avenue, and the 2 and 3 express trains at Grand Army Plaza and Bergen Street. The 2/3 express from Grand Army Plaza reaches Manhattan in about 20 to 25 minutes (Wall Street in 25 min, Times Square in 30 min). The F train from 7th Avenue or 15th Street–Prospect Park runs through Manhattan via Brooklyn-Manhattan crossover. The G train is the only non-Manhattan line but connects Park Slope directly to Williamsburg, Greenpoint, and Long Island City.",
        },
      },
      {
        "@type": "Question",
        name: "Is Park Slope family-friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Park Slope is widely considered one of NYC's most family-friendly neighborhoods. It sits within District 15 public schools (including the nationally recognized PS 321), has Prospect Park as its eastern border (585 acres of meadows, forest, playgrounds, and a zoo), and has a dense concentration of family-oriented services: pediatricians, children's bookstores, playgrounds, and weekend activities. The stroller culture is prominent, especially on 7th Avenue. The trade-off versus Manhattan family neighborhoods like the Upper West Side is a longer commute and less access to major cultural institutions — though Brooklyn Museum, BAM, and Prospect Park's own programming partially offset this.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between North Slope and South Slope?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "North Slope refers to the blocks roughly from Flatbush Avenue to 9th Street, closer to Atlantic Avenue, Barclays Center, and downtown Brooklyn. It has faster commutes via the 2/3 express at Grand Army Plaza, more nightlife and restaurants on 5th and 7th Avenues, and higher rents. South Slope is roughly 9th Street to Prospect Expressway, extending toward Greenwood Cemetery and Windsor Terrace. It has a quieter residential feel, more family-heavy demographics, slightly more affordable rents (10 to 20 percent less), and relies more on the F/G trains at 7th Avenue and 15th Street–Prospect Park. Both share the brownstone streetscape and Prospect Park access.",
        },
      },
      {
        "@type": "Question",
        name: "Are brownstones better than new construction in Park Slope?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on priorities. Brownstones (typically 3 to 5 story townhouses converted into floor-through apartments) offer high ceilings, original details (molded plaster, pocket doors, fireplaces), larger rooms, and the architectural character that defines the neighborhood. Trade-offs: no elevator, shared outdoor space, older kitchens and bathrooms, no in-unit laundry in most cases, and heating via radiators. New construction (concentrated along Fourth Avenue after 2010 rezoning) offers in-unit washer/dryer, central HVAC, elevators, gyms, and modern finishes — but with smaller room proportions and higher rents per square foot. For most Park Slope renters, the brownstone experience is the draw; new construction makes sense primarily for those prioritizing amenities.",
        },
      },
      {
        "@type": "Question",
        name: "How does Park Slope compare to Williamsburg for renters?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Park Slope and Williamsburg both offer Brooklyn brownstones and converted industrial stock, but target different renters. Park Slope skews family, residential, and quieter, with Prospect Park as the anchor and stroller culture along 7th Avenue. Williamsburg skews younger, with more nightlife, Manhattan-facing waterfront towers, and the L train as its primary Manhattan connection. Rent for a one-bedroom is similar ($2,800 to $3,900 in Park Slope vs. $3,000 to $4,200 in Williamsburg). Williamsburg has better immediate restaurant and bar density; Park Slope has better long-term livability. Our Williamsburg guide covers the comparison in detail.",
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
        name: "NYC Neighborhoods",
        item: `${baseUrl}/nyc-rent-by-neighborhood`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Park Slope",
        item: `${baseUrl}/nyc/park-slope`,
      },
    ],
  },
];

export default function ParkSlopeGuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {/* ── Header ────────────────────────────────── */}
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">NYC Neighborhoods</Badge>
              <Badge variant="secondary">Brooklyn</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Park Slope Apartments: Rent Prices, Transit &amp; Neighborhood
              Guide for 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              Park Slope is Brooklyn&apos;s definitive family neighborhood — a
              dense grid of 19th-century brownstones wrapping the western edge
              of Prospect Park, served by five subway lines, anchored by one of
              New York&apos;s best public school districts, and home to a
              stable, often multi-generational community. Rents are among the
              highest in Brooklyn, but for renters who want tree-lined streets,
              park access, and space in a unit that feels like a home rather
              than a box, Park Slope delivers. This guide covers everything
              you need to know about renting here.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Prices reflect median asking rents for
              market-rate apartments
            </p>
          </header>

          {/* ── Quick Facts ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Park Slope at a Glance</CardTitle>
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
                  <p className="text-lg font-semibold">$2,200 &ndash; $2,900</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$2,800 &ndash; $3,900</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,800 &ndash; $5,500</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Income Needed (1BR)
                  </p>
                  <p className="text-lg font-semibold">
                    ~$112,000 &ndash; $156,000
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Subway Lines
                  </p>
                  <p className="text-lg font-semibold">F, G, R, 2, 3</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    ZIP Codes
                  </p>
                  <p className="text-lg font-semibold">11215, 11217, 11238</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Live Listings ─────────────────────────── */}
          <NeighborhoodLiveListings
            neighborhoodName="Park Slope"
            latitude={40.6710}
            longitude={-73.9799}
            radiusMiles={0.9}
            limit={6}
            searchQuery="Park Slope Brooklyn apartments"
          />

          {/* ── Neighborhood Character ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>What Park Slope Is Like</CardTitle>
              <CardDescription>
                Culture, character, parks, and daily life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Park Slope sits on the western flank of Prospect Park, sloping
                down toward Fourth Avenue and Gowanus. The neighborhood extends
                roughly from Flatbush Avenue in the north to Prospect
                Expressway in the south, and from Prospect Park West on the
                east to Fourth Avenue on the west — an area of roughly 0.7
                square miles densely packed with brownstones, corner
                restaurants, and family-run shops.
              </p>
              <p>
                The streetscape is the defining feature. Long, uninterrupted
                rows of 19th-century Italianate and Romanesque Revival
                brownstones line the numbered side streets between Prospect
                Park West and 7th Avenue. Stoops are active social spaces;
                tree-lined blocks create a genuine canopy in summer; the
                architecture has been continuously preserved thanks to the
                Park Slope Historic District designation. The commercial
                spines are 5th Avenue (younger, trendier, more bars and
                restaurants), 7th Avenue (family-oriented, more traditional
                shops), and Flatbush Avenue (transit-dense, with Barclays
                Center anchoring its northern end).
              </p>
              <p>
                Prospect Park, designed by the same team that created Central
                Park, defines the eastern edge of the neighborhood. At 585
                acres, it is a genuine daily amenity — with meadows, forests,
                a lake, the Brooklyn Botanic Garden, Prospect Park Zoo, the
                Audubon Center boathouse, and over a dozen playgrounds.
                Brooklyn residents often consider it superior to Central Park
                for everyday use due to lower tourist density and more
                wide-open green space.
              </p>
              <p>
                The demographic skews toward families with school-age children,
                mid- to late-career professionals, and long-term residents.
                There are fewer 20-somethings than in Williamsburg or Bushwick,
                and the neighborhood has a reputation for stability — many
                residents have lived on the same block for decades, sometimes
                in rent-stabilized brownstone apartments. The trade-off is
                that the nightlife scene is less vibrant than younger
                Brooklyn neighborhoods, though 5th Avenue between Union and
                9th Streets has a solid cluster of bars, wine shops, and
                late-night restaurants.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent Prices Table ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Rent Prices by Apartment Type (2026)</CardTitle>
              <CardDescription>
                Median asking rents across Park Slope
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Type</TableHead>
                    <TableHead className="text-right">Rent Range</TableHead>
                    <TableHead className="text-right">Income Needed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$2,200 – $2,900</TableCell>
                    <TableCell className="text-right">$88k – $116k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,800 – $3,900</TableCell>
                    <TableCell className="text-right">$112k – $156k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$3,800 – $5,500</TableCell>
                    <TableCell className="text-right">$152k – $220k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$5,200 – $8,000+</TableCell>
                    <TableCell className="text-right">$208k – $320k+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                Income requirements based on NYC&apos;s standard 40x monthly
                rent rule. For 2BR+ apartments, many landlords accept combined
                household income from two applicants.
              </p>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Studios</h3>
                <p>
                  Studios are the rarest unit type in Park Slope — the
                  brownstone stock is predominantly laid out as one- and
                  two-bedroom floor-throughs. True studios ($2,200 to $2,900)
                  are most common in newer Fourth Avenue construction and in a
                  handful of larger pre-war co-ops. Expect 400 to 550 square
                  feet in new-construction studios and smaller (300 to 400 sq
                  ft) in converted brownstone efficiencies.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  One-Bedrooms
                </h3>
                <p>
                  One-bedrooms run $2,800 to $3,900. Under NYC&apos;s 40x
                  income rule, qualifying for the lower end requires about
                  $112,000 in gross annual income — noticeably less than the
                  Upper West Side ($152k) but more than Astoria ($88k) or
                  Bushwick ($80k). Brownstone one-bedrooms tend to be
                  generously proportioned — a $3,200 brownstone 1BR in Park
                  Slope is often the same square footage as a $4,000 new-
                  construction unit in Downtown Brooklyn. North Slope (closer
                  to Grand Army Plaza) commands $200 to $400 more than
                  comparable units in South Slope.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Two-Bedrooms &amp; Larger
                </h3>
                <p>
                  Two-bedrooms are the most common unit type in the
                  brownstone stock — many buildings contain exactly two
                  floor-through two-bedrooms. Expect $3,800 to $5,500, with
                  South Slope running closer to the floor and North Slope or
                  renovated units running higher. Three-bedrooms are
                  relatively scarce as rentals (often held by owners as
                  primary residences) but do exist and run $5,200 to $8,000+.
                  Families considering Park Slope specifically for District 15
                  schools should prioritize two- and three-bedroom hunts
                  early — inventory thins fast in the spring rental season.
                  If you&apos;re looking for roommates to split a two-bedroom,
                  our{" "}
                  <Link
                    href="/roommates"
                    className="text-primary underline underline-offset-2"
                  >
                    roommate matching tool
                  </Link>{" "}
                  can help find compatible housemates.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── vs. Neighbors Table ───────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Park Slope vs. Similar Neighborhoods</CardTitle>
              <CardDescription>
                Rent and commute comparison for 1-bedroom apartments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead className="text-right">1BR Rent</TableHead>
                    <TableHead>Midtown Commute</TableHead>
                    <TableHead className="hidden sm:table-cell">Character</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Park Slope</TableCell>
                    <TableCell className="text-right">$2,800–$3,900</TableCell>
                    <TableCell>25–35 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Brownstones, family, Prospect Park
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Williamsburg</TableCell>
                    <TableCell className="text-right">$3,000–$4,200</TableCell>
                    <TableCell>15–30 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Trendy, L train, Brooklyn vibe
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bushwick</TableCell>
                    <TableCell className="text-right">$2,000–$2,800</TableCell>
                    <TableCell>30–40 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Arts scene, lofts, affordable
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Upper West Side
                    </TableCell>
                    <TableCell className="text-right">$3,800–$5,000</TableCell>
                    <TableCell>7–15 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Pre-war, family, Central Park
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">East Village</TableCell>
                    <TableCell className="text-right">$3,500–$4,200</TableCell>
                    <TableCell>15–25 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Younger, nightlife, walkup-heavy
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Long Island City
                    </TableCell>
                    <TableCell className="text-right">$3,200–$4,000</TableCell>
                    <TableCell>6–10 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Luxury towers, fastest commute
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Astoria</TableCell>
                    <TableCell className="text-right">$2,200–$2,800</TableCell>
                    <TableCell>20–25 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Best value Queens, diverse food
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ── Transit ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Around: Subway &amp; Transit</CardTitle>
              <CardDescription>Commute times from Park Slope</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Park Slope is served by five subway lines along three corridors,
                making it one of the best-connected neighborhoods in Brooklyn.
                The 2/3 express at Grand Army Plaza (north end) is the fastest
                line to Manhattan; the F/G trains at 7th Avenue, 15th Street,
                and Fourth Avenue serve the central and southern parts of the
                neighborhood; the R train runs down Fourth Avenue with multiple
                stops. For most residents, walking to two different subway
                lines is feasible — a meaningful redundancy against delays.
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">
                    2 and 3 trains (express)
                  </span>{" "}
                  — From Grand Army Plaza or Bergen Street, the 2/3 express
                  reaches Wall Street in ~20 minutes, Times Square in ~30
                  minutes, and 72nd Street / Upper West Side in ~35 minutes.
                  This is the fastest line to Manhattan from Park Slope. The
                  Grand Army Plaza station is at the northeast corner of the
                  neighborhood; Bergen Street is slightly further north,
                  technically in Prospect Heights but walkable from North
                  Slope blocks.
                </div>
                <div>
                  <span className="font-semibold text-foreground">F train</span>{" "}
                  — Stops at 7th Avenue (Park Place), 15th Street–Prospect
                  Park, and Fort Hamilton Parkway. Runs through Manhattan via
                  the 6th Avenue line (Bryant Park, Rockefeller Center, W 4th
                  Street). Midtown in ~30 minutes from 7th Ave. The F is the
                  workhorse line for most central and South Slope residents.
                </div>
                <div>
                  <span className="font-semibold text-foreground">G train</span>{" "}
                  — Shares the 7th Avenue, 15th Street, and Fort Hamilton
                  stops with the F. The only non-Manhattan line, it runs
                  north to Williamsburg, Greenpoint, and Long Island City
                  (terminates at Court Square). Essential if you work in
                  Brooklyn or Queens; irrelevant if you commute to Manhattan.
                </div>
                <div>
                  <span className="font-semibold text-foreground">R train</span>{" "}
                  — Runs down Fourth Avenue with stops at Union Street, 9th
                  Street, Prospect Avenue, and 25th Street. Local line to
                  Manhattan via the Broadway line (reaches 34th Street in
                  ~35 minutes). Slower than the 2/3 or F, but useful if your
                  destination is along Broadway in Manhattan (Herald Square,
                  Union Square, City Hall area).
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Citi Bike &amp; Prospect Park loop
                  </span>{" "}
                  — Bike share stations are dense throughout the neighborhood,
                  and the Prospect Park loop (3.35 miles) is a dedicated
                  car-free path shared with runners. Bike commutes to
                  Downtown Brooklyn (~15 min) and Manhattan via the
                  Manhattan Bridge (~25 min to SoHo) are practical year-round.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Buses (B63, B67, B68, B69)
                  </span>{" "}
                  — The B63 runs the length of 5th Avenue and is useful for
                  north-south trips within the neighborhood. The B67, B68,
                  and B69 connect to Bay Ridge, Kensington, and Downtown
                  Brooklyn respectively.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Sub-Neighborhoods ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Park Slope Sub-Neighborhoods: Where to Search</CardTitle>
              <CardDescription>
                How Park Slope breaks down block by block
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  North Slope (Flatbush Ave to 9th Street)
                </h3>
                <p>
                  North Slope is the most desirable and most expensive zone,
                  anchored by Grand Army Plaza and the 2/3 express. The blocks
                  between Flatbush and 9th Street, closer to Prospect Park West,
                  contain some of the neighborhood&apos;s finest brownstones —
                  wide, ornate, and well-preserved. Commercial density along
                  5th and 7th Avenues is highest here (Union Hall, Bar Toto,
                  Al di Là, Cafe Regular). Proximity to Barclays Center,
                  Atlantic Terminal, and the express subway adds roughly $300
                  to $500 per month to one-bedroom rents versus South Slope.
                  Tenant base: mid-career professionals, young families, and
                  long-term residents in rent-stabilized units.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Central Slope (9th Street to 15th Street)
                </h3>
                <p>
                  The middle stretch of the neighborhood, centered on the 7th
                  Avenue F/G stop, has the most family-heavy demographic and
                  some of the strongest school catchment areas (PS 321 at 7th
                  Avenue and 1st Street is District 15&apos;s flagship
                  elementary school). This is where the stroller density is
                  most visible along 7th Avenue, and where the stable,
                  residential tone of Park Slope is most pronounced. Rents
                  here are comparable to North Slope for brownstone units but
                  typically $100 to $200 lower. Excellent balance of transit,
                  schools, and walkable retail.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  South Slope (15th Street to Prospect Expressway)
                </h3>
                <p>
                  South Slope, often called &quot;Sloper&apos;s South&quot; by
                  locals, extends toward Windsor Terrace and Greenwood
                  Cemetery. The streetscape is similar to central Park Slope
                  (brownstones, tree-lined blocks) but with a quieter, less
                  commercial feel. The 15th Street–Prospect Park and Fort
                  Hamilton F/G stops serve this zone. Rents run 10 to 20
                  percent lower than North Slope for comparable units —
                  one-bedrooms in the $2,800 to $3,400 range are
                  routinely available, and 5th Avenue&apos;s southern
                  stretches have the neighborhood&apos;s densest cluster of
                  affordable family restaurants. This is the best-value pocket
                  of Park Slope.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Fourth Avenue Corridor (new construction)
                </h3>
                <p>
                  Fourth Avenue has been the target of Park Slope&apos;s
                  post-2010 rezoning, which allowed taller, denser residential
                  buildings where previously only two-story commercial stock
                  existed. The result: a line of new mid- and high-rise
                  apartment buildings with amenities (gyms, rooftops,
                  doorman service, in-unit laundry) that brownstones cannot
                  match. This zone has the highest concentration of
                  studios, the most reliable availability for renters on a
                  tight timeline, and the deepest rent concessions in the
                  neighborhood. Trade-off: Fourth Avenue itself is a busy
                  traffic artery, so lower-floor units on the avenue side
                  experience road noise. Buildings set back from the avenue
                  (or with units facing the side streets) avoid this.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Brownstones ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Brownstone Apartments: What to Know</CardTitle>
              <CardDescription>
                Before renting in a classic Park Slope brownstone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Park Slope&apos;s defining housing stock is the brownstone —
                typically a 3 to 5 story Italianate or Romanesque Revival
                townhouse built between 1870 and 1910, converted over the
                decades into 2 to 4 apartments. Most are owned by individual
                landlords (often the family that lives on one floor),
                which creates a very different dynamic than renting from a
                large management company.
              </p>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">
                    What you get with a brownstone
                  </span>
                  : High ceilings (often 10 to 12 feet on the parlor floor),
                  original architectural details (molded plaster, pocket
                  doors, marble mantles, stained glass in hallways), hardwood
                  floors, large rooms, and often a share of backyard access
                  (usually the ground-floor tenant). Floor-through units
                  occupy an entire floor and feel like a house — no shared
                  hallways within the unit.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Trade-offs
                  </span>
                  : No elevator (walkup required — a fifth-floor apartment is
                  a real consideration with kids or groceries), older kitchens
                  and bathrooms in most units, heating via radiators (hot in
                  winter, uncontrollable by tenant), and no in-unit laundry in
                  the majority of cases. Basement units can have moisture
                  issues; top-floor units can be hot in summer without
                  in-unit AC.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Owner dynamics
                  </span>
                  : With a small-landlord brownstone, you are renting from an
                  individual, not a company. This can mean more flexibility
                  (they may negotiate more readily), more personal screening
                  (they often meet tenants before approving), and sometimes
                  less formal processes (handshake lease renewals at below
                  market rates for good tenants). It can also mean slower
                  repairs, less professional maintenance, and more variable
                  landlord experience. Read our{" "}
                  <Link
                    href="/blog/rental-application-screening-basics"
                    className="text-primary underline underline-offset-2"
                  >
                    rental application guide
                  </Link>{" "}
                  for what to expect.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Rent stabilization
                  </span>
                  : Park Slope has a meaningful stock of rent-stabilized
                  brownstone apartments — typically in buildings with six or
                  more units built before 1974. Many have long-term tenants
                  paying well below market, but occasional turnover occurs.
                  Read our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>{" "}
                  for how to verify stabilization status before signing, or
                  run a specific Park Slope address through the eligibility
                  checker below.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Embedded Rent-Stabilization Checker ────── */}
          <RentStabilizationChecker />

          {/* ── Schools ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Schools: District 15</CardTitle>
              <CardDescription>
                Why families move to Park Slope specifically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Park Slope falls within NYC public school District 15, which
                consistently ranks among the strongest districts in the city.
                For many renters with school-age children, District 15
                catchment is the primary reason to choose Park Slope over
                neighborhoods like Williamsburg, Bushwick, or Crown Heights.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Elementary schools
                </span>
                : PS 321 William Penn (7th Avenue &amp; 1st Street) is the
                district&apos;s flagship — perennially ranked as one of the
                top public elementary schools in NYC, with long waitlists and
                significant impact on rents in its immediate zone. PS 107
                John W. Kimball (8th Avenue &amp; 13th Street) and PS 39 Henry
                Bristow (6th Avenue &amp; 8th Street) are also strong
                District 15 options with variable zone boundaries. Zoning is
                specific — verify the catchment for any apartment you are
                considering before signing if schools matter.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Middle schools
                </span>
                : District 15 operates a unified middle school choice system
                (no traditional zoning). MS 51, MS 88, and MS 839 are popular
                options. The system is merit-based and open to all District
                15 students, which is one reason the district is considered
                progressive relative to much of NYC.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Private &amp; charter options
                </span>
                : Berkeley Carroll, Saint Ann&apos;s (in Brooklyn Heights but
                drawing from Park Slope), and a range of charter schools also
                serve the neighborhood. Pre-K and daycare options are dense —
                the stroller culture along 7th Avenue is a direct
                visualization of this.
              </p>
            </CardContent>
          </Card>

          {/* ── Renter Tips ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Apartment Hunting Tips for Park Slope</CardTitle>
              <CardDescription>
                Practical advice for navigating the Park Slope rental market
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">
                    1. Decide North Slope vs. South Slope early.
                  </span>{" "}
                  The $300 to $500 difference in monthly rent for a
                  one-bedroom is real, and the trade-off is genuine (express
                  subway access and restaurant density vs. quieter streets
                  and better value). Walk both zones before committing your
                  search to one.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    2. Consider the brownstone vs. new construction trade-off.
                  </span>{" "}
                  In-unit washer/dryer, elevators, and central air are rare
                  in brownstones and standard in Fourth Avenue new
                  construction. If these amenities are non-negotiable, focus
                  your search along Fourth Avenue or a handful of post-2010
                  buildings deeper in the neighborhood. If they aren&apos;t,
                  brownstones offer more space and character for the same
                  rent.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    3. Search during winter for seasonal discounts.
                  </span>{" "}
                  Park Slope has a pronounced seasonal cycle — peak demand in
                  May through August (families relocating before school
                  starts) and deep discounts in November through February.
                  Winter searches can save $200 to $400 per month. Read our{" "}
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    best time to rent guide
                  </Link>{" "}
                  for the full seasonal breakdown.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    4. Verify school zoning before signing if it matters.
                  </span>{" "}
                  PS 321&apos;s catchment boundary is narrower than most
                  renters assume — parts of 1st through 4th Streets between
                  6th and 8th Avenues are in zone, but surrounding blocks may
                  not be. The NYC DOE school finder is authoritative; double-
                  check for the exact address before signing a lease if
                  schools are a decision factor.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    5. Ask about heating and radiator control.
                  </span>{" "}
                  Brownstone heating is notoriously uneven — front apartments
                  can be freezing while back apartments are 85°F. Ask the
                  landlord whether radiator valves work and what temperature
                  the building typically runs in January. If visiting in
                  winter, touch the radiators during the walkthrough.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    6. Use your FARE Act rights.
                  </span>{" "}
                  Since January 2025, NYC&apos;s FARE Act shifts broker fees
                  from tenant to landlord in most cases. On a $3,500
                  apartment, this is a $3,500 savings up front. Confirm fee
                  responsibility in writing before touring. See our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act explainer
                  </Link>
                  .
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    7. Check for small-landlord red flags.
                  </span>{" "}
                  Individual brownstone landlords are often excellent, but a
                  small minority are difficult (slow repairs, disputes over
                  deposits). Ask current or former tenants if possible, check
                  the building in the{" "}
                  <Link
                    href="/bad-landlord-nj-ny"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC HPD bad landlord database
                  </Link>
                  , and note how the landlord handles the screening process —
                  it often predicts how they&apos;ll handle the tenancy.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    8. Use AI-powered search to see what&apos;s actually
                    available.
                  </span>{" "}
                  Brownstone listings often rent within days and through
                  informal channels — lawn signs, word-of-mouth in the
                  neighborhood. Wade Me Home aggregates listings from
                  multiple sources. Describe your ideal apartment in plain
                  language and our AI surfaces matching units, including
                  some that don&apos;t show up on larger aggregators.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Is Park Slope Right for You? ──────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Is Park Slope Right for You?</CardTitle>
              <CardDescription>
                Honest pros and cons for renters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Strong fit if you:
                </h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    Have children or plan to, and prioritize District 15
                    public schools
                  </li>
                  <li>
                    Value brownstone architecture, tree-lined streets, and
                    low-key residential character
                  </li>
                  <li>
                    Want Prospect Park as your daily green space
                  </li>
                  <li>
                    Work in Downtown Brooklyn, Manhattan, or Long Island City
                    (via the G)
                  </li>
                  <li>
                    Appreciate long-term neighborhood stability over
                    fast-changing trends
                  </li>
                  <li>
                    Are willing to trade Manhattan nightlife access for more
                    space and quieter streets
                  </li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Not a great fit if you:
                </h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    Are primarily focused on nightlife, new restaurants, or
                    proximity to the Manhattan party scene (consider{" "}
                    <Link
                      href="/nyc/williamsburg"
                      className="text-primary underline underline-offset-2"
                    >
                      Williamsburg
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/nyc/east-village"
                      className="text-primary underline underline-offset-2"
                    >
                      East Village
                    </Link>{" "}
                    instead)
                  </li>
                  <li>
                    Have a strict budget under $2,500 for a one-bedroom
                    (consider{" "}
                    <Link
                      href="/nyc/bushwick"
                      className="text-primary underline underline-offset-2"
                    >
                      Bushwick
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/nyc/astoria"
                      className="text-primary underline underline-offset-2"
                    >
                      Astoria
                    </Link>
                    )
                  </li>
                  <li>
                    Need the fastest possible Midtown commute (consider{" "}
                    <Link
                      href="/nyc/long-island-city"
                      className="text-primary underline underline-offset-2"
                    >
                      Long Island City
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/nyc/upper-west-side"
                      className="text-primary underline underline-offset-2"
                    >
                      Upper West Side
                    </Link>
                    )
                  </li>
                  <li>
                    Require in-unit washer/dryer and an elevator (rare
                    outside Fourth Avenue new construction)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* ── FAQ ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How much is rent in Park Slope?
                </h3>
                <p>
                  As of early 2026: studios run $2,200 to $2,900; one-bedrooms
                  $2,800 to $3,900; two-bedrooms $3,800 to $5,500;
                  three-bedrooms $5,200 to $8,000+. South Slope is typically
                  10 to 20 percent cheaper than North Slope for comparable
                  units. Fourth Avenue new construction commands a premium
                  per square foot but includes amenities brownstones lack.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What subway lines serve Park Slope?
                </h3>
                <p>
                  F, G, R, 2, and 3. The 2/3 express from Grand Army Plaza is
                  the fastest to Manhattan (Wall Street in ~20 min, Times
                  Square in ~30 min). The F runs through central Park Slope
                  via 7th Avenue, 15th Street, and Fort Hamilton. The G
                  connects to Williamsburg, Greenpoint, and LIC. The R runs
                  down Fourth Avenue.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is Park Slope family-friendly?
                </h3>
                <p>
                  Yes — it&apos;s widely considered Brooklyn&apos;s premier
                  family neighborhood. District 15 public schools (including
                  PS 321), Prospect Park, dense pediatric and family
                  services, and a stable residential character all make it a
                  top choice for families. Stroller culture is prominent on
                  7th Avenue.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What&apos;s the difference between North Slope and South
                  Slope?
                </h3>
                <p>
                  North Slope (Flatbush Ave to 9th Street) has express subway
                  access, more restaurants and nightlife, and higher rents
                  (~$300–$500/month more for a 1BR). South Slope (9th Street
                  to Prospect Expressway) is quieter, more family-oriented,
                  and better value. Both share the brownstone streetscape
                  and Prospect Park access.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are there rent-stabilized apartments in Park Slope?
                </h3>
                <p>
                  Yes. Many pre-1974 brownstones with six or more units contain
                  rent-stabilized apartments, though turnover is low. Check our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>{" "}
                  for how to verify a unit&apos;s status before signing.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How does Park Slope compare to Williamsburg?
                </h3>
                <p>
                  Park Slope is more residential and family-heavy; Williamsburg
                  is younger with more nightlife and Manhattan-facing luxury
                  towers. Rents for a one-bedroom are similar ($2,800–$3,900
                  in Park Slope vs. $3,000–$4,200 in Williamsburg). Park Slope
                  has Prospect Park; Williamsburg has the East River
                  waterfront and the L train. Our{" "}
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg guide
                  </Link>{" "}
                  covers the comparison in detail.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Your Park Slope Apartment
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI what you&apos;re looking for and it will search
                hundreds of Park Slope listings in seconds. Describe your
                ideal apartment — brownstone or new construction, North or
                South Slope, budget, bedroom count — and we&apos;ll find the
                matches.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related Guides ────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related NYC Renting Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/park-slope/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Park Slope Rent Prices: School-Zone &amp; Brownstone Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/park-slope/apartments-under-3500"
                    className="text-primary underline underline-offset-2"
                  >
                    Park Slope Apartments Under $3,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/park-slope/apartments-under-4000"
                    className="text-primary underline underline-offset-2"
                  >
                    Park Slope Apartments Under $4,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Apartments: Rent Prices &amp; Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Apartments: Rent Prices &amp; Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side"
                    className="text-primary underline underline-offset-2"
                  >
                    Upper West Side Apartments: Rent, Transit &amp; Pre-War Buildings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Apartments: Rent Prices, Transit &amp; Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/astoria"
                    className="text-primary underline underline-offset-2"
                  >
                    Astoria Apartments: Rent, Transit &amp; Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City (LIC) Apartments: Rent, Transit &amp; Towers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood: Prices &amp; Comparison
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Best Time to Rent an Apartment in NYC (Month-by-Month)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cost-of-moving-to-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Cost of Moving to NYC: Full Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent Stabilization Explained
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC FARE Act: Broker Fee Ban Explained
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
