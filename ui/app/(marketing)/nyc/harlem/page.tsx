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
    "Apartments for Rent in Harlem, NYC (2026): Rent Prices, Subway & Neighborhood Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in Harlem, Manhattan. Median rent by unit size, 2/3/A/B/C/D train access, Central Harlem vs West Harlem vs East Harlem vs Hamilton Heights, brownstone stock, Columbia / City College context, and why Harlem search demand is up 38.6% year-over-year.",
  keywords: [
    "Harlem apartments",
    "Harlem apartments for rent",
    "apartments for rent in Harlem",
    "Harlem rent",
    "Harlem rent prices 2026",
    "Harlem studio rent",
    "Harlem 1 bedroom rent",
    "Harlem 2 bedroom rent",
    "Harlem 3 bedroom rent",
    "Central Harlem apartments",
    "West Harlem apartments",
    "East Harlem apartments",
    "Hamilton Heights apartments",
    "South Harlem apartments",
    "Harlem brownstone apartments",
    "apartments 10026",
    "apartments 10027",
    "apartments 10030",
    "apartments near Columbia University",
    "apartments near City College",
    "2 train Harlem apartments",
    "Harlem no fee apartments",
    "moving to Harlem",
    "Harlem Manhattan apartments",
  ],
  openGraph: {
    title:
      "Apartments for Rent in Harlem, NYC (2026): Rent Prices, Subway & Neighborhood Guide",
    description:
      "2026 rent prices, subway access, sub-area breakdown, and apartment-hunting tips for Harlem — Manhattan's fastest-improving rental market at +38.6% YoY search demand.",
    url: `${baseUrl}/nyc/harlem`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/harlem` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in Harlem, NYC (2026): Rent Prices, Subway & Neighborhood Guide",
    description:
      "A comprehensive 2026 guide to renting an apartment in Harlem, Manhattan — covering rent prices by unit size, 2/3/A/B/C/D train access, Central/West/East Harlem and Hamilton Heights differences, brownstone stock, and practical tips for apartment hunters.",
    datePublished: "2026-04-24",
    dateModified: "2026-04-24",
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
    mainEntityOfPage: `${baseUrl}/nyc/harlem`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Harlem?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, median rent in Harlem is approximately $1,900 for a studio, $2,600 for a 1-bedroom, $3,500 for a 2-bedroom, and $4,500 for a 3-bedroom. Harlem has the widest price spread of any Manhattan neighborhood — Central Harlem brownstones above 125th Street run 15–25% below the neighborhood median, while South Harlem (110th–125th) and Hamilton Heights new-construction can run close to Upper West Side prices. West Harlem near Columbia, Hamilton Heights, East Harlem, and Sugar Hill each price differently.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve Harlem?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Harlem is served by the 2/3 express (Lenox Ave — 110th, 116th, 125th, 135th Streets), the A/B/C/D on St. Nicholas / Central Park West (110th, 116th, 125th, 135th, 145th, 155th), the 1 local on Broadway (Columbia / Hamilton Heights), the 4/5/6 on Lexington (East Harlem — 103rd, 110th, 116th, 125th), and the Metro-North Harlem line at 125th Street (fast commuter rail to Grand Central, 10 minutes). For most Harlem residents, the 2/3 express is the fastest Manhattan route: 125th Street to 42nd Street is about 14 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Is Harlem a safe neighborhood?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Harlem's safety has improved substantially over the past 20 years and is now broadly comparable to other mid-priced Manhattan neighborhoods. Crime statistics (NYPD CompStat) show Harlem precincts (28th, 32nd, 25th) with rates in line with lower Manhattan on property crime, slightly higher on some violent crime categories but dropping year-over-year. As with anywhere in NYC, blocks vary — walk your target blocks at night before signing, especially in East Harlem east of Lexington Avenue and in pocket areas of Central Harlem east of Lenox.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between Central, West, and East Harlem?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Central Harlem (roughly 5th Ave to St. Nicholas Ave, 110th–145th) is the historic cultural core — brownstone blocks, 125th Street commercial corridor, Apollo Theater, 2/3 and A/B/C/D access. West Harlem / Hamilton Heights (St. Nicholas west to Riverside, 125th–155th) sits up on the hill — 1 train on Broadway, Columbia's Manhattanville campus, City College, newer conversions mixed with pre-war walkups. East Harlem / El Barrio (5th Ave east to FDR, 96th–125th) is Lexington line (4/5/6) driven with the largest Puerto Rican and Mexican communities in Manhattan, older tenement stock, some newer mixed-income development. South Harlem / SoHa (110th–125th, Central Park to St. Nicholas) is effectively an extension of UWS pricing — the new-construction and doorman stock here prices close to UWS below 110th.",
        },
      },
      {
        "@type": "Question",
        name: "Is Harlem good for students?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Harlem is the closest affordable neighborhood for students at Columbia University (Morningside campus), the Manhattanville extension, City College / CCNY, and Teachers College. West Harlem / Hamilton Heights in particular (Broadway to Amsterdam, 125th–155th) is where most Columbia graduate students and City College students rent. A 1-bedroom in Hamilton Heights runs $2,400–$3,100 vs. $3,500+ in Morningside Heights proper, for the same 1 or A train access.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Harlem rent rising in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Google Trends shows 'harlem apartments' search demand up 38.6% year-over-year through April 2026 — the fastest-improving demand signal for any Manhattan neighborhood tracked. The drivers are: (1) Columbia's Manhattanville campus fully online and drawing graduate students, (2) South Harlem new construction filling with UWS-priced-out renters (East Harlem $3,800 1BRs that would be $4,800 at 96th Street), (3) general Manhattan rent pressure pushing renters north of 96th for the first time, and (4) East Harlem rezoning delivering new rental towers with concessions. Expect 5–8% rent growth in Harlem through 2026 if demand sustains.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "NYC", item: `${baseUrl}/nyc-rent-by-neighborhood` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Harlem",
        item: `${baseUrl}/nyc/harlem`,
      },
    ],
  },
];

export default function HarlemPage() {
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
              <Badge variant="outline">2/3 · A/B/C/D · 4/5/6 · 1</Badge>
              <Badge variant="outline">+38.6% YoY demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in Harlem, NYC (2026): Rent Prices, Subway
              &amp; Neighborhood Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Harlem is Manhattan&apos;s fastest-improving rental market in
              2026. Rent remains 30–50% below neighborhoods south of 96th
              Street with directly comparable subway access, brownstone stock
              that doesn&apos;t exist anywhere else in Manhattan, and a
              cultural density no other uptown neighborhood matches. Google
              Trends puts Harlem search demand up 38.6% year-over-year —
              tied with Chelsea for the biggest uptown signal.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 24, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Harlem"
            latitude={40.8116}
            longitude={-73.9465}
            radiusMiles={1.2}
            limit={6}
            searchQuery="Harlem apartments"
          />

          {/* ── Rent Table ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Harlem Rent Prices by Unit Size (2026)</CardTitle>
              <CardDescription>
                Median asking rent, typical range, and income needed (40× rule)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Size</TableHead>
                    <TableHead>Median Rent</TableHead>
                    <TableHead>Typical Range</TableHead>
                    <TableHead>Income Needed (40×)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell>$1,900</TableCell>
                    <TableCell>$1,600 – $2,400</TableCell>
                    <TableCell>$76,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>$2,600</TableCell>
                    <TableCell>$2,100 – $3,400</TableCell>
                    <TableCell>$104,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>$3,500</TableCell>
                    <TableCell>$2,800 – $4,800</TableCell>
                    <TableCell>$140,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>$4,500</TableCell>
                    <TableCell>$3,500 – $6,500</TableCell>
                    <TableCell>$180,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                South Harlem new-construction (110th–120th, St. Nicholas to
                Central Park North) runs $1,000+/month above these medians
                and prices comparable to the Upper West Side at 96th Street.
              </p>
            </CardContent>
          </Card>

          {/* ── Sub-Areas ───────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Harlem Sub-Areas</CardTitle>
              <CardDescription>
                Harlem is a 2.5 sq mi neighborhood — these are the five
                functional sub-areas renters shop separately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Area</TableHead>
                    <TableHead>1BR Median</TableHead>
                    <TableHead>Boundaries</TableHead>
                    <TableHead>Character</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      South Harlem / SoHa
                    </TableCell>
                    <TableCell>$3,400</TableCell>
                    <TableCell>
                      110th–125th, Central Park North to St. Nicholas
                    </TableCell>
                    <TableCell>
                      UWS-priced-out new construction, doorman stock
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Central Harlem
                    </TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell>
                      125th–145th, 5th Ave to St. Nicholas
                    </TableCell>
                    <TableCell>
                      Brownstone core, 2/3 + A/B/C/D, 125th St corridor
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East Harlem / El Barrio
                    </TableCell>
                    <TableCell>$2,400</TableCell>
                    <TableCell>
                      96th–125th, 5th Ave to FDR
                    </TableCell>
                    <TableCell>
                      Lexington line, older stock, rezoning new builds
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      West Harlem / Morningside
                    </TableCell>
                    <TableCell>$2,800</TableCell>
                    <TableCell>
                      110th–125th, Morningside to Riverside
                    </TableCell>
                    <TableCell>
                      Columbia grad students, 1 train, prewar 6-story
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hamilton Heights / Sugar Hill
                    </TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell>
                      135th–155th, Edgecombe to Riverside
                    </TableCell>
                    <TableCell>
                      Pre-war stock on the hill, 1 + A/B/C/D, CCNY adjacent
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ── Transit ────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Harlem Transit</CardTitle>
              <CardDescription>
                Five subway lines plus Metro-North make Harlem one of the
                best-connected neighborhoods north of 96th Street
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>2/3 express (Lenox Ave):</strong> The fastest Harlem
                to Midtown/Downtown connection. 125th Street to Times Square
                in about 14 minutes, to Wall Street in about 25. Runs every
                4–6 minutes at peak.
              </p>
              <p>
                <strong>A/B/C/D (St. Nicholas Ave / CPW):</strong> The A and
                D are express — 125th to Columbus Circle in 7 minutes on the
                A. The B and C are local. Great for UWS commuting.
              </p>
              <p>
                <strong>4/5/6 (Lexington Ave):</strong> East Harlem&apos;s
                line. 125th Street to Grand Central in 10 minutes on the 4/5
                express. The 6 local hits every stop between 96th and 125th
                in East Harlem.
              </p>
              <p>
                <strong>1 (Broadway):</strong> West Harlem and Hamilton
                Heights. 125th Street to Columbus Circle in 12 minutes.
                Serves Columbia University directly.
              </p>
              <p>
                <strong>Metro-North Harlem/New Haven/Hudson:</strong> 125th
                Street station is a 10-minute ride to Grand Central — often
                faster than the 4/5 when trains are running. If your office
                is in Midtown East and you live in East Harlem, Metro-North
                usually beats the subway.
              </p>
            </CardContent>
          </Card>

          {/* ── Brownstone Market ──────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>The Harlem Brownstone Market</CardTitle>
              <CardDescription>
                Harlem has more rent-available brownstone stock than any
                other Manhattan neighborhood — here&apos;s what that means
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Central Harlem and Hamilton Heights contain most of
                Manhattan&apos;s remaining rent-available brownstones —
                4-story, ~20&apos; wide townhouses built 1890–1910, often
                split into 2–4 rental units by small owners. You can rent a
                parlor-floor 1-bedroom in a Central Harlem brownstone for
                about the same rent as a 400-sq-ft studio in Midtown.
              </p>
              <p>
                Floor-through typology (numbers are rough 2026 medians):
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Garden / Ground floor:</strong> $2,000–$2,800 for
                  a 1BR with private back-yard access, often lower ceilings
                </li>
                <li>
                  <strong>Parlor (2nd floor):</strong> $2,500–$3,400 for the
                  full floor with the 11-ft ceilings and original details
                </li>
                <li>
                  <strong>Top floor (3rd/4th):</strong> $2,300–$3,000, often
                  skylights, 4-story walkup
                </li>
                <li>
                  <strong>Duplex:</strong> $3,200–$4,500 for 2-floor units
                  combining parlor + one adjacent floor
                </li>
              </ul>
              <p>
                Trade-offs vs. a doorman building: smaller landlords, slower
                maintenance response, rarely in-unit laundry (usually
                basement share), no gym/rooftop. Upside: bigger rooms,
                original millwork, rent increases smaller than institutional
                landlords, stronger human relationship.
              </p>
            </CardContent>
          </Card>

          {/* ── Hunting Tips ───────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Harlem Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Know which subway line you need.</strong> A
                  Central Harlem block at Lenox + 125th is a 14-min commute
                  to Times Square. The same block on the same day, if you
                  work at Grand Central, is a 20-minute walk/transfer. Match
                  street to line.
                </li>
                <li>
                  <strong>
                    Rent-stabilized stock concentrates here.
                  </strong>{" "}
                  Many Harlem brownstones and walkups are rent-stabilized
                  (typically 6+ units, built before 1974). 2026 RGB renewal
                  caps are 3.0% for 1-year and 4.5% for 2-year leases — so
                  year-2 is capped. Ask the landlord on every unit.
                </li>
                <li>
                  <strong>Central Harlem has real brownstones.</strong>{" "}
                  Walk the block before signing. The classic Central Harlem
                  blocks (Hancock Pl, 119th between Lenox/5th, Astor Row,
                  Strivers&apos; Row 138th/139th) are preserved; other
                  blocks have more mixed stock.
                </li>
                <li>
                  <strong>South Harlem is UWS pricing with a new zip.</strong>{" "}
                  New buildings south of 125th on Central Park North or
                  Morningside routinely hit $3,800–$4,800 1BR — often
                  cheaper than 96th-110th UWS equivalents but not a bargain
                  in absolute terms.
                </li>
                <li>
                  <strong>East Harlem rezoning = concessions.</strong>{" "}
                  Several post-2020 rental towers east of 3rd Avenue offer
                  1–2 months free. These are real UWS-quality amenities at
                  $3,000–$3,600 1BR — the best value in Manhattan at that
                  tier.
                </li>
                <li>
                  <strong>Hamilton Heights for Columbia students.</strong>{" "}
                  A walkup 1BR on Broadway at 137th is $2,300–$2,700 — 1
                  train to Morningside in 3 stops. Do the same walkup below
                  116th and it&apos;s $3,500+.
                </li>
                <li>
                  <strong>
                    Metro-North 125th St is underrated for Midtown-East
                    commuters.
                  </strong>{" "}
                  10 minutes to Grand Central, same $2.90 CityTicket on
                  weekends, beats the 4/5 when you hit disrupted service.
                </li>
                <li>
                  <strong>
                    FARE Act (Dec 2024) means landlord pays broker on
                    non-owner brokered listings.
                  </strong>{" "}
                  Confirm who pays the fee on every listing — if a listing
                  is marketed by the landlord&apos;s agent, the tenant
                  should not be paying a fee. See our FARE Act guide.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          {/* ── CTA ─────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live Harlem apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge which Harlem sub-area (Central / West /
                East / Hamilton Heights), which subway, and your budget —
                we&apos;ll surface matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Harlem+apartments">
                  Search Harlem Apartments
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ─────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                <li>
                  <Link
                    href="/nyc/harlem/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Harlem Rent Prices: Sub-Area &amp; Brownstone-Tier
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/harlem/apartments-under-2500"
                    className="text-primary underline underline-offset-2"
                  >
                    Harlem Apartments Under $2,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/harlem/apartments-under-3000"
                    className="text-primary underline underline-offset-2"
                  >
                    Harlem Apartments Under $3,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/harlem/apartments-under-2000"
                    className="text-primary underline underline-offset-2"
                  >
                    Harlem Apartments Under $2,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side"
                    className="text-primary underline underline-offset-2"
                  >
                    Upper West Side Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    UWS Rent Prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent Stabilization Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act &amp; Broker Fees
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
