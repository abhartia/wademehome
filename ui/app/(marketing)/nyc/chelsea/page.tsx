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
    "Apartments for Rent in Chelsea, NYC (2026): Rent Prices, High Line & Neighborhood Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in Chelsea, Manhattan. Median rent by unit size, 1/C/E/F/M train access, High Line / Hudson Yards / Chelsea Market context, sub-area breakdown (West Chelsea / Core / Flatiron edge), luxury new-construction vs pre-war walkups, and what Chelsea rent actually buys.",
  keywords: [
    "Chelsea apartments",
    "Chelsea apartments for rent",
    "apartments for rent in Chelsea",
    "Chelsea rent",
    "Chelsea NYC rent",
    "Chelsea rent prices 2026",
    "Chelsea studio rent",
    "Chelsea 1 bedroom rent",
    "Chelsea 2 bedroom rent",
    "Chelsea 3 bedroom rent",
    "West Chelsea apartments",
    "Hudson Yards apartments",
    "apartments near the High Line",
    "apartments 10011",
    "apartments 10001",
    "Chelsea luxury apartments",
    "Chelsea Market apartments",
    "Chelsea no fee apartments",
    "moving to Chelsea",
    "Chelsea doorman apartments",
  ],
  openGraph: {
    title:
      "Apartments for Rent in Chelsea, NYC (2026): Rent Prices, High Line & Guide",
    description:
      "2026 rent prices, subway access, High Line context, and sub-area breakdown for Chelsea — Manhattan's walk-everywhere core at +38.6% YoY search demand.",
    url: `${baseUrl}/nyc/chelsea`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/chelsea` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in Chelsea, NYC (2026): Rent Prices, High Line & Neighborhood Guide",
    description:
      "A comprehensive 2026 guide to renting an apartment in Chelsea, Manhattan — covering rent prices by unit size, subway lines, West Chelsea / Core / Flatiron edge differences, luxury new-construction vs pre-war walkups, and practical hunting tips.",
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
    mainEntityOfPage: `${baseUrl}/nyc/chelsea`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Chelsea?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, median rent in Chelsea is approximately $3,100 for a studio, $4,300 for a 1-bedroom, $5,800 for a 2-bedroom, and $8,500 for a 3-bedroom. Chelsea is among the top 5 most expensive Manhattan neighborhoods by median. West Chelsea / Hudson Yards luxury new-construction (Hudson Yards towers, 500 W 30th, 520 W 28th) can push 1BR rents to $6,000–$8,000. Pre-war walkups in 20s/West Side and the Chelsea core run $3,400–$4,000 for a 1BR.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve Chelsea?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chelsea is one of Manhattan's best-served transit neighborhoods. The 1 train on 7th Avenue (14th, 18th, 23rd, 28th Streets) is the spine. The C/E runs on 8th Avenue (14th, 23rd). The F/M runs at 14th & 6th and 23rd & 6th. The L at 14th crosses the neighborhood east-west. The A/C/E at Penn Station (34th St) is the northern edge. The 2/3 at 14th St and 7th Ave is one block from Chelsea. Most Chelsea apartments are within a 5-minute walk of at least three subway lines.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between Chelsea and West Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chelsea runs 14th Street to roughly 30th Street, 6th Avenue to the Hudson. The West Village is below 14th Street to Houston, 6th Avenue to the Hudson. Chelsea is more commercial and has more modern development (Hudson Yards, High Line, Chelsea Market); the West Village is more historic and has stricter landmark rules preventing new construction. Rent-wise they're comparable — Chelsea 1BR median $4,300 vs West Village $4,500 — but Chelsea has substantially more inventory of newer luxury rentals. If you want a doorman high-rise: Chelsea. If you want a walk-up brownstone on a quiet tree-lined street: West Village.",
        },
      },
      {
        "@type": "Question",
        name: "Is Chelsea a good neighborhood for couples or families?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chelsea works well for working couples and young families in larger 2BR / 3BR apartments, especially in West Chelsea luxury towers with doorman, gym, and proximity to PS 33 / PS 11. It's less family-oriented than Park Slope or Upper West Side — the neighborhood skews single and couple under 40, the nightlife density is high, and 3-bedroom rental inventory is thin outside of Hudson Yards. For families prioritizing schools and open space, UWS or Park Slope deliver more at the same rent. For families prioritizing walkability, High Line access, and Chelsea Market — Chelsea wins.",
        },
      },
      {
        "@type": "Question",
        name: "What is the FARE Act and does it apply in Chelsea?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The FARE Act (Fairness in Apartment Rental Expenses Act) took effect December 2024 in NYC and applies in Chelsea like everywhere else in the five boroughs. The law requires that when a broker is hired by the landlord to market a rental, the landlord (not the tenant) pays the broker fee. Chelsea — especially West Chelsea luxury towers that advertise directly — was already largely no-fee before FARE, but the FARE Act ended tenant-pays-broker on most of the smaller walkup and pre-war Chelsea inventory that used to come with 1-month-rent fees. Read our FARE Act guide for when you can and cannot be charged a fee.",
        },
      },
      {
        "@type": "Question",
        name: "Is Chelsea rent going up in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Google Trends shows 'chelsea apartments' search demand up 38.6% year-over-year through April 2026, tied with Harlem for the biggest Manhattan uptick. The drivers are Hudson Yards leasing absorption, High Line-adjacent new construction completing, and general Manhattan return-to-office demand concentrating in walk-everywhere neighborhoods. Expect 4–7% rent growth in Chelsea through 2026. Concessions at West Chelsea new-construction have trimmed from 2 months free in 2024 to 1 month free or zero by Q1 2026.",
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
        name: "Chelsea",
        item: `${baseUrl}/nyc/chelsea`,
      },
    ],
  },
];

export default function ChelseaPage() {
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
              <Badge variant="outline">1 · C/E · F/M · L</Badge>
              <Badge variant="outline">+38.6% YoY demand</Badge>
              <Badge variant="outline">High Line</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in Chelsea, NYC (2026): Rent Prices, High
              Line &amp; Neighborhood Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Chelsea is Manhattan&apos;s walk-everywhere core — four subway
              lines within a five-minute walk of anywhere in the
              neighborhood, the High Line running its western edge, Chelsea
              Market and Hudson Yards at its southwest corner, and the
              densest luxury new-construction pipeline in Manhattan south of
              Central Park. Google Trends shows Chelsea apartment demand up
              38.6% year-over-year, tied with Harlem for the strongest
              Manhattan signal in 2026.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 24, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Chelsea"
            latitude={40.7465}
            longitude={-74.0014}
            radiusMiles={0.7}
            limit={6}
            searchQuery="Chelsea apartments"
          />

          <Card>
            <CardHeader>
              <CardTitle>Chelsea Rent Prices by Unit Size (2026)</CardTitle>
              <CardDescription>
                Median asking rent, typical range, income needed (40× rule)
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
                    <TableCell>$3,100</TableCell>
                    <TableCell>$2,600 – $3,800</TableCell>
                    <TableCell>$124,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>$4,300</TableCell>
                    <TableCell>$3,400 – $6,000</TableCell>
                    <TableCell>$172,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>$5,800</TableCell>
                    <TableCell>$4,500 – $9,000</TableCell>
                    <TableCell>$232,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>$8,500</TableCell>
                    <TableCell>$6,500 – $14,000</TableCell>
                    <TableCell>$340,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                West Chelsea / Hudson Yards luxury new-construction
                (15 Hudson Yards, 35 Hudson Yards rentals, 500 W 30th, 520 W
                28th, One West End) prices 20–40% above these medians.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chelsea Sub-Areas</CardTitle>
              <CardDescription>
                Chelsea&apos;s 1BR rent varies $3,400–$6,000 depending on
                which corner you pick
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
                      West Chelsea / Hudson Yards
                    </TableCell>
                    <TableCell>$5,400</TableCell>
                    <TableCell>
                      10th Ave–Hudson, 14th–30th
                    </TableCell>
                    <TableCell>
                      Luxury glass towers, High Line, Hudson Yards retail
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Chelsea Core
                    </TableCell>
                    <TableCell>$4,100</TableCell>
                    <TableCell>
                      7th–10th Ave, 14th–23rd
                    </TableCell>
                    <TableCell>
                      Pre-war walkups, brownstone blocks, main retail
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Chelsea North
                    </TableCell>
                    <TableCell>$3,800</TableCell>
                    <TableCell>
                      6th–8th Ave, 23rd–30th
                    </TableCell>
                    <TableCell>
                      Flatiron-adjacent office spillover, mid-rise residential
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Chelsea South / Meatpacking Edge
                    </TableCell>
                    <TableCell>$4,800</TableCell>
                    <TableCell>
                      Hudson–9th Ave, 14th–17th
                    </TableCell>
                    <TableCell>
                      Meatpacking nightlife, Apple HQ, small footprint
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Penn South (ltd-equity co-ops, limited rental)
                    </TableCell>
                    <TableCell>$2,800</TableCell>
                    <TableCell>
                      8th–9th Ave, 23rd–29th
                    </TableCell>
                    <TableCell>
                      Rare rental at below-market via family subleases
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chelsea Transit</CardTitle>
              <CardDescription>
                Four subway lines and the L cross Chelsea — no apartment is
                more than a 5-minute walk from at least three lines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>1 (7th Ave):</strong> The Chelsea spine. 14th, 18th,
                23rd, 28th streets. 14th to Times Square in 5 stops / 8 min.
              </p>
              <p>
                <strong>C/E (8th Ave):</strong> 14th and 23rd streets. E
                express runs Queens-bound; A/C/E stack at 14th St for a
                fast Penn Station / WTC link.
              </p>
              <p>
                <strong>F/M (6th Ave):</strong> 14th and 23rd. Connects to
                Midtown and to Queens / Bryant Park.
              </p>
              <p>
                <strong>L (14th St):</strong> Union Square to 8th Avenue,
                then under the East River to Williamsburg / Bushwick. Useful
                for crossing town fast and for Brooklyn commuters landing in
                Chelsea.
              </p>
              <p>
                <strong>7 at 34th-Hudson Yards:</strong> Chelsea&apos;s
                northwest corner is inside the 7-train&apos;s 34th
                St–Hudson Yards terminal — useful for Midtown-East and
                Queens (Long Island City, Flushing) access without a
                transfer.
              </p>
              <p>
                <strong>PATH at 14th & 6th or 23rd & 6th:</strong> Direct
                Chelsea link to Hoboken, Jersey City Newport, and Exchange
                Place. A Chelsea resident can reach Hoboken in ~10 minutes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Luxury New-Construction vs Pre-War Walkups</CardTitle>
              <CardDescription>
                Chelsea has two parallel rental markets with very different
                unit economics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>1BR Range</TableHead>
                    <TableHead>$/sq ft (monthly)</TableHead>
                    <TableHead>What You Get</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      West Chelsea luxury (post-2015)
                    </TableCell>
                    <TableCell>$5,500–$8,000</TableCell>
                    <TableCell>$7.00–$9.00</TableCell>
                    <TableCell>
                      Doorman, gym, roof, concierge, in-unit W/D, Hudson views
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Post-war doorman (1960s–1990s)
                    </TableCell>
                    <TableCell>$4,000–$5,500</TableCell>
                    <TableCell>$5.50–$7.00</TableCell>
                    <TableCell>
                      Doorman, some amenities, standard 1BR layout
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-war elevator (1920s–1940s)
                    </TableCell>
                    <TableCell>$3,800–$4,700</TableCell>
                    <TableCell>$5.00–$6.20</TableCell>
                    <TableCell>
                      Character details, elevator, no doorman, older finishes
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-war walk-up (1880s–1920s)
                    </TableCell>
                    <TableCell>$3,400–$4,200</TableCell>
                    <TableCell>$4.50–$5.80</TableCell>
                    <TableCell>
                      4–6 story walk-up, smaller layouts, lots of character,
                      often rent-stabilized
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Brownstone conversion (rent-stabilized pocket)
                    </TableCell>
                    <TableCell>$3,200–$4,000</TableCell>
                    <TableCell>$4.20–$5.50</TableCell>
                    <TableCell>
                      Floor-through, original details, walk-up, small landlord
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chelsea Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>
                    West Chelsea towers are the concession market.
                  </strong>{" "}
                  Hudson Yards area rental towers still offer 1 month free
                  on 13-month leases for many layouts. At $6,000 gross with
                  1 mo free, net-effective is $5,538.
                </li>
                <li>
                  <strong>The pre-war walkup is Chelsea&apos;s bargain.</strong>{" "}
                  A 1BR pre-war walkup on W 20th or W 19th runs $3,600–$4,200
                  — $1,500+/mo cheaper than the luxury tower two blocks
                  west. You lose the gym, you keep the walk-everywhere.
                </li>
                <li>
                  <strong>Rent stabilization concentrates in walkups.</strong>{" "}
                  6+ unit pre-1974 buildings in Chelsea are likely
                  rent-stabilized. Year-2 is RGB-capped (3.0% / 4.5% for
                  2026). Ask every landlord on every walkup.
                </li>
                <li>
                  <strong>The High Line is a noise multiplier.</strong> The
                  High Line shuts down at 10pm but daytime foot traffic is
                  high. Apartments directly on the High Line between 14th
                  and 30th can be loud on weekends. Ask about window
                  placement.
                </li>
                <li>
                  <strong>FARE Act: confirm on every listing.</strong> Most
                  West Chelsea luxury buildings were already no-fee; FARE
                  Act closed the loophole on smaller agent-marketed
                  walk-ups. If any listing says &quot;fee paid by tenant&quot;
                  in 2026 Chelsea, ask why.
                </li>
                <li>
                  <strong>
                    Compare to East Village at the same rent.
                  </strong>{" "}
                  Chelsea $4,300 1BR vs East Village $3,600 1BR low end.
                  Chelsea buys you doorman + nicer finishes and the High
                  Line; East Village buys you subway variety + cheaper
                  dining.
                </li>
                <li>
                  <strong>2-bedroom inventory is thin outside Hudson Yards.</strong>{" "}
                  If you need a 2BR under $5,500, you&apos;ll likely be
                  looking at a pre-war walkup or post-war non-doorman — and
                  the latter is thin in Chelsea. Consider UWS or West
                  Village at the same price.
                </li>
                <li>
                  <strong>Penn South occasionally surfaces sublets.</strong>{" "}
                  The Mutual Redevelopment Houses co-op (Penn South) is
                  limited-equity but occasionally has family-subletted
                  rentals at well-below-market. Hard to find but worth
                  flagging to your concierge.
                </li>
                <li>
                  <strong>Time your search.</strong> Chelsea summer (June–
                  Aug) has the most inventory and the firmest pricing.
                  December–February has fewer listings but more concession
                  flexibility on West Chelsea new-con. See our{" "}
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    best time to rent guide
                  </Link>
                  .
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live Chelsea apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge which Chelsea sub-area (West Chelsea
                luxury, Core walkup, Flatiron edge), your budget, and
                doorman preference — we&apos;ll surface real listings.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Chelsea+apartments">
                  Search Chelsea Apartments
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                <li>
                  <Link
                    href="/nyc/chelsea/apartments-under-4000"
                    className="text-primary underline underline-offset-2"
                  >
                    Chelsea Apartments Under $4,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/chelsea/apartments-under-3500"
                    className="text-primary underline underline-offset-2"
                  >
                    Chelsea Apartments Under $3,500
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
                    href="/nyc/east-village/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Rent Prices
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
                    href="/nyc/harlem"
                    className="text-primary underline underline-offset-2"
                  >
                    Harlem Guide
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
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act &amp; Broker Fees
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent Stabilization
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
