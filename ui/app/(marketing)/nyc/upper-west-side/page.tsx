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

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Upper West Side Apartments: Rent Prices, Transit & Neighborhood Guide (2026) | Wade Me Home",
  description:
    "Complete guide to renting on the Upper West Side. Average rent prices by unit size, 1/2/3 subway access, pre-war vs. new construction, best blocks for renters, and practical tips for finding an apartment in one of Manhattan's most livable neighborhoods.",
  keywords: [
    "Upper West Side apartments",
    "UWS apartments",
    "Upper West Side rent",
    "UWS apartments for rent",
    "upper west side nyc rent 2026",
    "pre-war apartments upper west side",
    "family apartments UWS nyc",
    "upper west side 1 bedroom rent",
    "apartments near central park nyc",
    "upper west side studio rent",
    "UWS 2 bedroom rent",
    "moving to upper west side nyc",
    "apartments 10023 10024 10025",
  ],
  openGraph: {
    title:
      "Upper West Side Apartments: Rent Prices, Transit & Neighborhood Guide (2026)",
    description:
      "Average rent prices, 1/2/3 subway access, pre-war buildings, best blocks, and tips for finding an apartment on the Upper West Side.",
    url: `${baseUrl}/nyc/upper-west-side`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/upper-west-side` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Upper West Side Apartments: Rent Prices, Transit & Neighborhood Guide for 2026",
    description:
      "A comprehensive guide to renting an apartment on the Upper West Side of Manhattan — covering average rent prices, 1/2/3 and B/C subway access, pre-war vs. new construction buildings, neighborhood character, and practical tips for apartment hunters.",
    datePublished: "2026-04-19",
    dateModified: "2026-04-19",
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
    mainEntityOfPage: `${baseUrl}/nyc/upper-west-side`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent on the Upper West Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, studios on the Upper West Side typically range from $2,600 to $3,500 per month, one-bedrooms from $3,800 to $5,000, two-bedrooms from $5,500 to $8,000, and three-bedrooms from $7,500 to $12,000 or more. Prices are highest in newer doorman buildings within a block or two of Central Park and lowest in prewar walkups north of 100th Street toward Morningside Heights. The blocks between 72nd and 79th Street command the highest rents; north of 96th Street, prices drop meaningfully.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve the Upper West Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Upper West Side is served by the 1, 2, and 3 trains on Broadway and the B and C trains on Central Park West. The 1 train is the local, stopping at every station between 66th and 116th Streets. The 2 and 3 trains are express, stopping only at 72nd, 96th, and 110th Streets, making them significantly faster to Midtown (7 to 10 minutes from 72nd Street). The B and C trains run along Central Park West and are useful for residents on the park side of the neighborhood.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Upper West Side family-friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Upper West Side is one of the most family-friendly neighborhoods in Manhattan. It has a high concentration of good public and private schools, Riverside Park and Central Park for outdoor space, and a residential, low-key atmosphere compared to neighborhoods further downtown. Many long-term UWS residents are families who moved in decades ago, giving the neighborhood a stable community feel. Stroller culture is prominent, and the area around 77th to 89th Street is particularly popular with families. The main trade-off is that the nightlife is quieter and the restaurant scene more conservative than in the East Village or Williamsburg.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between pre-war and new construction on the UWS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pre-war buildings (built before World War II) dominate the Upper West Side streetscape. They typically have thicker walls (better soundproofing), herringbone or parquet hardwood floors, larger rooms, and classic architectural details like molded ceilings and built-in shelving. The trade-offs are older kitchens and bathrooms, window AC only (no central air), and smaller closets. New construction buildings offer modern finishes, in-unit washer/dryer, central HVAC, and amenities like gyms and rooftop decks — but at significantly higher rents. For the same budget, a pre-war one-bedroom will typically be larger than a new-construction equivalent.",
        },
      },
      {
        "@type": "Question",
        name: "Are there no-fee apartments on the Upper West Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Under NYC's FARE Act (effective January 2025), landlords must pay broker fees in most cases, not tenants. However, buildings that rent directly through their management offices or property portals often had no-fee arrangements even before the FARE Act. Many large rental buildings on the UWS — including newer luxury towers and HDFC-owned buildings — rent directly without a broker. It is worth searching both listing aggregators and calling building management offices directly, as some inventory is not broadly advertised.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Upper West Side cheaper than the Upper East Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Upper West Side and Upper East Side are priced similarly for comparable buildings and unit types. Both neighborhoods have median one-bedroom rents in the $3,800 to $5,000 range as of 2026. The UWS has slightly more rental inventory (versus co-op buildings on the UES) and more large luxury doorman rentals. The UES is historically associated with a more formal, conservative demographic and slightly more expensive restaurants, but the difference in rents between the two neighborhoods is modest. Personal preference — proximity to Central Park West vs. Fifth Avenue, restaurant scene, commute lines — usually drives the decision more than price.",
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
        name: "Upper West Side",
        item: `${baseUrl}/nyc/upper-west-side`,
      },
    ],
  },
];

export default function UpperWestSideGuidePage() {
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
              <Badge variant="secondary">Manhattan</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Upper West Side Apartments: Rent Prices, Transit &amp;
              Neighborhood Guide for 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              The Upper West Side is one of Manhattan&apos;s most livable and
              enduring neighborhoods — a place where century-old pre-war
              buildings line quiet residential blocks, Central Park is steps
              away, and the 1, 2, and 3 trains deliver you to Midtown in under
              ten minutes. It consistently attracts professionals, families, and
              academics who want a genuine Manhattan address without the chaos
              of downtown or the trendiness of Brooklyn. Rents are high by any
              measure, but within the context of Manhattan, the UWS offers
              more space per dollar than comparable neighborhoods below 59th
              Street. This guide covers everything you need to know to find and
              rent an apartment here.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Prices reflect median asking rents for
              market-rate apartments
            </p>
          </header>

          {/* ── Quick Facts ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Upper West Side at a Glance</CardTitle>
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
                  <p className="text-lg font-semibold">$2,600 &ndash; $3,500</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,800 &ndash; $5,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$5,500 &ndash; $8,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Income Needed (1BR)
                  </p>
                  <p className="text-lg font-semibold">
                    ~$152,000 &ndash; $200,000
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Subway Lines
                  </p>
                  <p className="text-lg font-semibold">1, 2, 3, B, C</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    ZIP Codes
                  </p>
                  <p className="text-lg font-semibold">10023, 10024, 10025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Neighborhood Character ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>What the Upper West Side Is Like</CardTitle>
              <CardDescription>
                Culture, character, parks, and daily life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The Upper West Side runs from 59th Street (Columbus Circle) to
                110th Street (Cathedral Parkway), bounded by Central Park to the
                east and Riverside Park and the Hudson River to the west. The
                neighborhood is defined by two major green spaces that are part
                of daily life for most residents — Central Park for morning runs
                and weekend afternoons, Riverside Park for quieter walks along
                the Hudson.
              </p>
              <p>
                The built environment is among the most architecturally
                distinctive in Manhattan. Pre-war apartment buildings dominate,
                with detailed limestone and brick facades, formal lobbies, and
                room proportions that feel generous by modern standards. Many
                of the most desirable buildings are on Central Park West
                (known for its iconic towers like the Dakota, the Beresford,
                and the San Remo) or along Riverside Drive, which parallels
                the Hudson. Broadway serves as the commercial and transit
                spine, while Columbus and Amsterdam Avenues have evolved into
                the neighborhood&apos;s main dining and shopping corridors.
              </p>
              <p>
                Cultural institutions anchor the neighborhood: Lincoln Center
                for the Performing Arts at 65th Street, the American Museum
                of Natural History and the Hayden Planetarium at 79th Street,
                the New-York Historical Society at 77th Street, and Symphony
                Space at 95th Street. Columbia University&apos;s main campus
                is at 116th Street, just above the neighborhood&apos;s
                northern boundary, bringing academic energy and a graduate
                student rental market to the upper reaches of the UWS.
              </p>
              <p>
                The overall tone is residential, family-oriented, and
                intellectually serious. The UWS has historically been home
                to writers, academics, musicians, and professionals who
                prioritize proximity to cultural institutions and green space
                over nightlife or trendiness. This is not a neighborhood for
                those seeking a vibrant bar scene or cutting-edge restaurant
                openings every week — but it is an excellent choice for those
                who want a stable, walkable Manhattan address with some of the
                best schools and parks in the city.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent Prices Table ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Rent Prices by Apartment Type (2026)</CardTitle>
              <CardDescription>
                Median asking rents across the Upper West Side
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
                    <TableCell className="text-right">$2,600 – $3,500</TableCell>
                    <TableCell className="text-right">$104k – $140k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$3,800 – $5,000</TableCell>
                    <TableCell className="text-right">$152k – $200k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$5,500 – $8,000</TableCell>
                    <TableCell className="text-right">$220k – $320k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$7,500 – $12,000+</TableCell>
                    <TableCell className="text-right">$300k – $480k+</TableCell>
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
                  Studios on the UWS range from approximately $2,600 to $3,500,
                  depending heavily on building type and exact location. A
                  pre-war walkup studio north of 100th Street can be found in
                  the $2,600 to $2,900 range. A doorman-building studio with a
                  gym and laundry near 72nd Street will run $3,200 to $3,500 or
                  higher. Expect 300 to 450 square feet in pre-war studios and
                  350 to 500 square feet in newer construction, which tends to
                  offer better closet space.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  One-Bedrooms
                </h3>
                <p>
                  The median one-bedroom asking rent is $3,800 to $5,000. Under
                  NYC&apos;s 40x income rule, qualifying for the lower end of
                  this range requires approximately $152,000 in gross annual
                  income — significantly higher than Astoria ($88k–$112k) or
                  Bushwick ($60k–$80k). Pre-war one-bedrooms in well-maintained
                  walkup buildings can dip below $3,800 north of 100th Street,
                  particularly in blocks closer to Morningside Heights. Central
                  Park West and Riverside Drive one-bedrooms in luxury doorman
                  buildings routinely ask $5,000 or more.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Two-Bedrooms &amp; Larger
                </h3>
                <p>
                  Two-bedrooms are where the UWS&apos;s pre-war stock becomes
                  particularly appealing — many apartments have genuine dining
                  rooms and large living rooms by Manhattan standards, making a
                  two-bedroom feel like what elsewhere would be a three-bedroom.
                  The $5,500 to $7,000 range gets you a pre-war two-bedroom in
                  most of the neighborhood; $7,000 to $8,000 reaches into
                  renovated or doorman buildings. Families with two children
                  often target the UWS specifically because the three-bedroom
                  stock (while expensive) exists here in larger quantities than
                  in neighborhoods further downtown. If you&apos;re looking for
                  roommates to split a two-bedroom, our{" "}
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
              <CardTitle>Upper West Side vs. Similar Neighborhoods</CardTitle>
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
                    <TableCell className="font-medium">
                      Upper West Side
                    </TableCell>
                    <TableCell className="text-right">$3,800–$5,000</TableCell>
                    <TableCell>7–15 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Pre-war, family-oriented, cultural
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Upper East Side
                    </TableCell>
                    <TableCell className="text-right">$3,500–$5,000</TableCell>
                    <TableCell>10–20 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Traditional, formal, more co-ops
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
                    <TableCell className="font-medium">Williamsburg</TableCell>
                    <TableCell className="text-right">$3,000–$4,200</TableCell>
                    <TableCell>15–30 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Trendy, L train, Brooklyn vibe
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Long Island City
                    </TableCell>
                    <TableCell className="text-right">$3,200–$4,000</TableCell>
                    <TableCell>6–10 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Luxury towers, shortest commute
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
                  <TableRow>
                    <TableCell className="font-medium">Bushwick</TableCell>
                    <TableCell className="text-right">$2,000–$2,800</TableCell>
                    <TableCell>30–40 min</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      Arts scene, lofts, Brooklyn affordable
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
              <CardDescription>Commute times from the UWS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The Upper West Side is exceptionally well-served by transit. The
                Broadway IRT corridor (1, 2, 3 trains) runs the full length of
                the neighborhood, and the Central Park West line (B, C trains)
                adds a second parallel trunk. Having two independent subway
                lines means delays on one route rarely trap you — you can walk
                one block to the other line.
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">
                    1 train (local)
                  </span>{" "}
                  — Stops at every station from 66th to 116th Streets. Connects
                  to Midtown (Times Square at 42nd Street: 10–15 min from 72nd
                  St), the Financial District (Wall Street: 30–35 min), and
                  Downtown (14th Street: 20–25 min). The 1 is the workhorse
                  line for residents living between stations — no express skips.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    2 and 3 trains (express)
                  </span>{" "}
                  — Express stops at 72nd, 96th, and 110th Streets only. From
                  72nd Street to Times Square takes just 7 to 8 minutes —
                  making a 72nd Street apartment one of the fastest Midtown
                  commutes of any neighborhood in the outer neighborhoods
                  comparison. The 2 and 3 run to Fulton Street (Financial
                  District) in about 25 minutes.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    B and C trains
                  </span>{" "}
                  — Runs along Central Park West with stops at 72nd, 81st, 86th,
                  96th, and 103rd Streets. The B train is express to Midtown
                  (47–50th Streets in 10 min); the C is local. For residents
                  on the park side of the neighborhood, the B/C trains are
                  often the faster option. The B runs weekdays only; the C runs
                  all week.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Crosstown bus (M86, M79, M72, M96)
                  </span>{" "}
                  — Select Bus Service on 86th and 79th Streets connects the
                  West Side to the East Side across Central Park, useful for
                  reaching the Upper East Side, hospitals on 68th Street, and
                  the Lexington Avenue subway lines.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Citi Bike
                  </span>{" "}
                  — Bike share stations along Broadway, Columbus, and Amsterdam
                  Avenues. Riverside Park&apos;s path connects to the Hudson
                  River Greenway, a car-free bike corridor that runs all the
                  way to Lower Manhattan — ideal for cyclists commuting downtown.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Sub-Neighborhoods ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>UWS Sub-Neighborhoods: Where to Search</CardTitle>
              <CardDescription>
                How the Upper West Side breaks down block by block
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  72nd–79th Street (Southern UWS)
                </h3>
                <p>
                  The blocks between 72nd and 79th Street represent the Upper
                  West Side&apos;s most desirable — and most expensive —
                  section. The 72nd Street express station (2/3 trains) is the
                  primary subway hub, and Central Park access via the 72nd
                  Street transverse is a major draw. This area has the highest
                  concentration of doorman buildings, the most upscale dining
                  (Levain Bakery, Caf&eacute; Luxembourg, Sarabeth&apos;s), and
                  the closest proximity to Lincoln Center. Studios start at
                  $3,000 and one-bedrooms rarely dip below $4,200 in decent
                  buildings. The section along Riverside Drive has some of the
                  most coveted apartments in the neighborhood, with Hudson
                  River views commanding significant premiums.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  79th–89th Street (Central Corridor)
                </h3>
                <p>
                  This stretch is the heart of the Upper West Side in terms of
                  neighborhood character. It contains the American Museum of
                  Natural History and Rose Center at 79th Street, the New-York
                  Historical Society, and the 81st and 86th Street B/C stations.
                  The blocks between Columbus and Amsterdam Avenues have dense
                  restaurant and bar activity along Amsterdam. Rents here are
                  slightly lower than the 72nd–79th Street zone while still
                  offering doorman buildings and good transit access. Pre-war
                  one-bedrooms in non-doorman buildings can be found for
                  $3,800 to $4,200; doorman buildings run $4,500 and up. This
                  zone is the most popular for young families given school
                  options and park proximity.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  89th–96th Street (Upper Mid-UWS)
                </h3>
                <p>
                  Between 89th and 96th Streets, the neighborhood transitions
                  to a quieter, more purely residential character. There are
                  fewer restaurants and less foot traffic, which many residents
                  prefer. The 96th Street express stop (2/3 trains) is one of
                  the fastest Midtown connections in the neighborhood — under
                  10 minutes to Times Square. Rents in this zone run
                  approximately 10 to 15 percent lower than comparable
                  apartments in the 72nd–86th Street zone, making it one
                  of the best value pockets on the UWS. Look for pre-war
                  buildings on the side streets between Broadway and
                  Riverside Drive — many have been well-maintained for decades.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  96th–110th Street (Near Columbia / Morningside Heights)
                </h3>
                <p>
                  North of 96th Street, the Upper West Side transitions toward
                  Morningside Heights, the academic neighborhood anchored by
                  Columbia University, Barnard College, and the Manhattan
                  School of Music. Rents drop noticeably here compared to
                  central UWS — studios can be found for $2,200 to $2,800,
                  and one-bedrooms from $2,800 to $3,500. The tenant base
                  includes Columbia faculty, graduate students, and long-term
                  residents who have lived in rent-stabilized units for years.
                  The 103rd and 110th Street stations on the 1 train provide
                  local access, while the 96th Street 2/3 express stop is a
                  few blocks south. Cathedral Parkway (110th Street) is the
                  effective northern boundary.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Pre-War Buildings ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Pre-War Buildings on the UWS</CardTitle>
              <CardDescription>
                What to know before renting in a classic Manhattan building
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                More than 70 percent of the Upper West Side&apos;s housing
                stock consists of pre-war buildings — structures completed
                before roughly 1940. Understanding what this means in practice
                will help you evaluate apartments during your search.
              </p>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">
                    What you get with pre-war
                  </span>
                  : High ceilings (9 to 11 feet is common, occasionally higher),
                  thick plaster walls that provide genuine sound insulation
                  between apartments, original hardwood floors with distinctive
                  parquet or herringbone patterns, large rooms with separate
                  dining rooms in many layouts, and building character that
                  modern construction simply cannot replicate. Pre-war kitchens
                  and bathrooms are typically small — a known trade-off.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Heating and cooling
                  </span>
                  : Nearly all pre-war buildings use steam heat through cast-iron
                  radiators. This system runs hot and is effectively uncontrollable
                  at the apartment level — you regulate temperature by opening
                  windows. Summers require window air conditioning units (usually
                  permitted by landlords; verify before signing). Steam heat is
                  included in rent in most pre-war buildings, which offsets the
                  higher rent versus buildings where you pay for utilities
                  separately.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Co-ops vs. rentals
                  </span>
                  : Many of the UWS&apos;s most architecturally significant
                  buildings are co-operatives (co-ops), not rentals. Co-ops
                  require board approval — interviews, financial disclosures,
                  reference letters — and many have restrictions on subletting
                  that make them impractical for renters. If you see a
                  beautiful building with low turnover and a very reasonable
                  asking price, check whether it&apos;s a co-op sublet before
                  investing time in the application.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Rent stabilization
                  </span>
                  : The UWS has one of the largest concentrations of
                  rent-stabilized units in Manhattan. Pre-war buildings
                  that contain six or more units and were built before 1974
                  frequently have stabilized apartments — though market-rate
                  units in the same building can still be expensive due to
                  vacancy deregulation over the years. If securing a
                  rent-stabilized unit is a priority, look in larger pre-war
                  walkups and read our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>{" "}
                  for how to verify status.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Renter Tips ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Apartment Hunting Tips for the Upper West Side</CardTitle>
              <CardDescription>
                Practical advice for navigating the UWS rental market
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">
                    1. Choose your subway line first, then search.
                  </span>{" "}
                  The UWS has two distinct subway corridors. Residents who
                  commute to Midtown or the Financial District should prioritize
                  proximity to the 2/3 express on Broadway (72nd or 96th Street
                  stops). Those heading to the Upper East Side, hospitals, or
                  Midtown East should consider the B/C on Central Park West
                  plus the crosstown buses. Setting your search radius around a
                  specific station will narrow down the neighborhood significantly.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    2. Visit apartments in winter for heating tests.
                  </span>{" "}
                  Pre-war steam heat is notorious for overheating apartments
                  during winter. If you visit in November through March, check
                  whether the steam heat is manageable (some apartments run at
                  85°F with windows closed). Ask whether the radiator valves
                  work. Conversely, winter is the best time to negotiate rent
                  — the UWS has meaningful seasonal price drops in November
                  through February. Read our{" "}
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
                    3. Go north of 96th for the best value.
                  </span>{" "}
                  The blocks between 96th and 110th Street offer rents 15 to
                  25 percent lower than comparable buildings in the 72nd–86th
                  Street zone, with the same 2/3 express access (from the
                  96th Street station) and the same pre-war building stock.
                  The restaurant scene is thinner, but the neighborhood is
                  genuinely pleasant. For renters whose budget tops out at
                  $3,500 for a one-bedroom, this zone is worth serious
                  consideration.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    4. Check the laundry situation before signing.
                  </span>{" "}
                  Most pre-war buildings have shared laundry in the basement
                  or subbasement — convenient but shared with the whole
                  building. In-unit washer/dryer is rare in pre-war buildings
                  and essentially requires a newer-construction unit (at a
                  significantly higher rent). If in-unit laundry is a
                  priority, narrow your search to buildings completed after
                  2000.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    5. Know your income-to-rent ratio.
                  </span>{" "}
                  At $4,000 per month for a one-bedroom, the standard 40x rule
                  requires $160,000 in gross annual income. Many UWS landlords
                  also require net worth statements, particularly in
                  higher-end buildings. If you earn below this threshold,
                  a{" "}
                  <Link
                    href="/guarantor"
                    className="text-primary underline underline-offset-2"
                  >
                    guarantor
                  </Link>{" "}
                  who earns 80x the monthly rent ($320,000 annually) can
                  co-sign your lease. Read our{" "}
                  <Link
                    href="/blog/rental-application-screening-basics"
                    className="text-primary underline underline-offset-2"
                  >
                    rental application guide
                  </Link>{" "}
                  for everything landlords check.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    6. Verify broker fees under the FARE Act.
                  </span>{" "}
                  Since January 2025, NYC&apos;s FARE Act generally shifts
                  broker fees from tenant to landlord. On a $4,500 apartment,
                  this can save you $4,500 or more. However, some buildings
                  use management-company brokers and structure fees in ways
                  that create ambiguity. Know your rights before signing. See
                  our{" "}
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
                    7. Use AI-powered search to surface unlisted inventory.
                  </span>{" "}
                  Many UWS buildings rent directly through their management
                  offices rather than major listing aggregators. Wade Me Home
                  aggregates listings across sources and lets you search by
                  natural language — just describe your ideal apartment and
                  our AI matches you with available units, including buildings
                  that don&apos;t advertise broadly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Is UWS Right for You? ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Is the Upper West Side Right for You?</CardTitle>
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
                    Value large, pre-war apartments with character over modern
                    amenities
                  </li>
                  <li>
                    Want Central Park or Riverside Park as your backyard
                  </li>
                  <li>
                    Have children and prioritize school options and safe,
                    walkable streets
                  </li>
                  <li>
                    Work in Midtown and want the fastest possible commute from a
                    residential neighborhood
                  </li>
                  <li>
                    Appreciate cultural institutions (Lincoln Center, AMNH,
                    symphony, theater)
                  </li>
                  <li>
                    Are willing to pay a Manhattan premium for stability, space,
                    and green access
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
                    Are looking for a vibrant nightlife scene or new restaurant
                    openings (head to the East Village or Williamsburg instead)
                  </li>
                  <li>
                    Need in-unit washer/dryer (rare in pre-war stock unless
                    paying premium)
                  </li>
                  <li>
                    Have a strict budget under $3,000/month for a one-bedroom
                    (consider{" "}
                    <Link
                      href="/nyc/astoria"
                      className="text-primary underline underline-offset-2"
                    >
                      Astoria
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/nyc/bushwick"
                      className="text-primary underline underline-offset-2"
                    >
                      Bushwick
                    </Link>{" "}
                    instead)
                  </li>
                  <li>
                    Work in Brooklyn or the financial district and want to avoid
                    a long commute
                  </li>
                  <li>
                    Dislike the idea of window AC and steam-heat radiators
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
                  How much is rent on the Upper West Side?
                </h3>
                <p>
                  As of early 2026: studios run $2,600 to $3,500; one-bedrooms
                  $3,800 to $5,000; two-bedrooms $5,500 to $8,000; three-bedrooms
                  $7,500 to $12,000+. North of 96th Street (near Columbia) is
                  the most affordable zone, with studios starting around $2,600
                  and one-bedrooms from $2,800. The 72nd–86th Street corridor
                  is the most expensive.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What subway lines serve the Upper West Side?
                </h3>
                <p>
                  The 1, 2, and 3 trains run along Broadway; the B and C trains
                  run along Central Park West. The 2/3 express is the fastest
                  to Midtown — 7 to 10 minutes from 72nd Street, under 10
                  minutes from 96th Street. The B train is a fast express to
                  Midtown on weekdays. The 1 train stops at every station and
                  is the workhorse local.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is the Upper West Side family-friendly?
                </h3>
                <p>
                  Yes — it&apos;s one of the most family-oriented neighborhoods
                  in Manhattan. Strong public and private school options,
                  Central Park and Riverside Park for outdoor space, and a
                  residential atmosphere that&apos;s calm by Manhattan
                  standards. Many long-term UWS residents are families.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are there rent-stabilized apartments on the Upper West Side?
                </h3>
                <p>
                  Yes. The UWS has one of the largest concentrations of
                  rent-stabilized units in Manhattan, particularly in pre-war
                  walkup buildings built before 1974. Many are occupied by
                  long-term tenants, but turnover does occur. Check our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>{" "}
                  for how to verify if an apartment is stabilized before
                  signing.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is a pre-war apartment, and are they better?
                </h3>
                <p>
                  Pre-war apartments were built before roughly 1940. On the UWS
                  they typically have high ceilings, thick plaster walls
                  (excellent soundproofing), hardwood floors, and more generous
                  room sizes than modern construction. The trade-offs are older
                  kitchens and bathrooms, window-only AC, and steam heat that
                  is sometimes too hot in winter. Many renters strongly prefer
                  pre-war for the character and space; others prefer modern
                  buildings for amenities. See our{" "}
                  <Link
                    href="#pre-war"
                    className="text-primary underline underline-offset-2"
                  >
                    pre-war buildings section above
                  </Link>{" "}
                  for the full breakdown.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is UWS cheaper than the Upper East Side?
                </h3>
                <p>
                  The two neighborhoods are priced similarly — both have median
                  one-bedroom rents of approximately $3,800 to $5,000. The UWS
                  has more rental inventory (the UES has more co-ops), which can
                  give renters slightly more options. Personal preference around
                  commute lines (1/2/3 vs. 4/5/6), park access (Riverside vs.
                  the FDR side of Central Park), and neighborhood character
                  usually drives the decision more than price.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Your Upper West Side Apartment
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI what you&apos;re looking for and it will search
                hundreds of Upper West Side listings in seconds. Describe your
                ideal apartment — size, budget, building type — and we&apos;ll
                find the matches.
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
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Apartments: Rent Prices, Transit &amp; Tips
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
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Apartments: Rent Prices &amp; Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/park-slope"
                    className="text-primary underline underline-offset-2"
                  >
                    Park Slope Apartments: Brownstones, Schools &amp; Prospect Park
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
