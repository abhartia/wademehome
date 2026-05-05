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
    "Sunnyside Apartments (May 2026): +66.7% YoY Demand, Rent Prices, 7-Train Commute Guide | Wade Me Home",
  description:
    "Sunnyside Queens apartment search demand surged +66.7% YoY in May 2026 — the strongest single-week riser in our Queens watch. May 2026 rent by unit size, 7-train Express to Grand Central in 9 minutes, Sunnyside Gardens historic district, the LIC-spillover dynamic at $1,200–$1,500/month savings, plus the Sunnyside Yards rezoning watch.",
  keywords: [
    "sunnyside apartments",
    "sunnyside apartments for rent",
    "sunnyside queens apartments",
    "apartments for rent in sunnyside",
    "sunnyside rent",
    "sunnyside rent prices 2026",
    "sunnyside rent prices May 2026",
    "sunnyside apartments May 2026",
    "Sunnyside Gardens apartments",
    "Sunnyside Queens 11104",
    "apartments 11104",
    "sunnyside studio rent",
    "sunnyside 1 bedroom rent",
    "sunnyside 2 bedroom rent",
    "sunnyside 3 bedroom rent",
    "Sunnyside vs Long Island City",
    "Sunnyside vs Astoria",
    "Sunnyside 7 train apartments",
    "Sunnyside Greenpoint Avenue",
    "Sunnyside 46th Street 7 train",
    "Sunnyside Bliss Street",
    "no fee Sunnyside apartments",
    "Sunnyside Yards rezoning",
    "Sunnyside Queens 2026 demand surge",
    "Sunnyside apartments 66% YoY",
    "moving to Sunnyside Queens",
    "Sunnyside vs Woodside",
    "Sunnyside Court Square commute",
    "Sunnyside Grand Central commute",
    "Sunnyside Hunter College commute",
  ],
  openGraph: {
    title:
      "Sunnyside Apartments (May 2026): +66.7% YoY Demand, Rent Prices, 7-Train Commute Guide",
    description:
      "Sunnyside Queens apartment search just surged +66.7% YoY — the strongest Queens riser of May 2026. Rent prices, 7-train Express commute, Sunnyside Gardens, and the LIC-spillover dynamic.",
    url: `${baseUrl}/nyc/sunnyside`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/sunnyside` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Sunnyside Apartments (May 2026): +66.7% YoY Demand, Rent Prices & 7-Train Commute Guide",
    description:
      "A May 2026 guide to renting in Sunnyside, Queens — covering the +66.7% YoY demand surge, rent by unit size, the 7-train Express commute (9 min to Grand Central), Sunnyside Gardens historic district, and how Sunnyside compares to LIC and Astoria rent-for-minute.",
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
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
    mainEntityOfPage: `${baseUrl}/nyc/sunnyside`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Sunnyside Queens?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of May 2026, the median asking rent in Sunnyside is approximately $1,800 for a studio, $2,300 for a one-bedroom, $2,900 for a two-bedroom, and $3,800 for a three-bedroom. Sunnyside Gardens (the historic-district co-op stock between Skillman Avenue and Roosevelt Avenue, 43rd to 49th Streets) sits at the top of each range — $2,500 for a 1BR with garden access — while the larger pre-war elevator buildings on Queens Boulevard and 39th Avenue run closer to the median. The LIC border (43rd Street and below) trades 10–15% above the Sunnyside median because it inherits LIC pricing pressure.",
        },
      },
      {
        "@type": "Question",
        name: "How long is the 7 train from Sunnyside to Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "From the Sunnyside core (40th Street – Lowery, 46th Street – Bliss, 52nd Street – Lincoln Avenue stations on the 7), you reach Grand Central in 9 minutes and Times Square / 42nd Street in 11 minutes via the 7 Express, or Court Square in 4 minutes if you transfer to the E/M/R/G. The 7 Local adds 4–6 minutes for the Hudson Yards extension. Sunnyside is one of the fastest Queens commutes to Midtown East — for a comparable 1-bedroom rent gap of $1,200–$1,500/month vs Manhattan, the time-value math is decisively favorable.",
        },
      },
      {
        "@type": "Question",
        name: "What is Sunnyside Gardens?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sunnyside Gardens is a 1924–1928 planned garden-city community in central Sunnyside, designed by Clarence Stein and Henry Wright on Lewis Mumford's regional planning principles. It is roughly 16 blocks bounded by Skillman Avenue, 43rd Street, 52nd Street and Barnett Avenue, with shared private courtyards behind the rowhouses. The district was designated a New York City historic district in 2007. Most Sunnyside Gardens stock is owner-occupied two-family rowhouses with rare rental availability, but when units do come up they typically rent at a 10–20% premium over the broader Sunnyside median because of the garden access and architectural integrity.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Sunnyside apartment search up so much in May 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sunnyside apartment search demand on Google Trends jumped to +66.7% YoY in early May 2026 — the strongest single-week riser among the Queens neighborhoods we track, well ahead of Astoria (+26.5%) and Long Island City (+8.8%). Three forces are converging. First, the LIC spillover: at $3,200–$3,800 for an LIC 1BR, renters priced out of LIC's lease-up towers are extending the search 8–12 minutes further on the 7 train, where Sunnyside 1BRs run $2,200–$2,500. Second, the FARE Act-driven Manhattan rotation has pushed cohorts into outer-borough neighborhoods with strong subway access, and Sunnyside's 9-minute Grand Central commute is among the best per-dollar deals in the city. Third, the Sunnyside Yards rezoning conversation has put the neighborhood on the cultural map, with major news outlets covering the rezoning debate through Q1 2026.",
        },
      },
      {
        "@type": "Question",
        name: "Sunnyside vs Long Island City — which is better in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LIC has the new-construction high-rises with full amenity packages (gym, roof, package room, doorman) at $3,200–$3,800 for a 1BR. Sunnyside has older pre-war and post-war low-rise stock — typically no doorman, smaller buildings, walk-up or single-elevator — at $2,100–$2,500 for a 1BR. The trade is roughly $1,100/month for the amenity stack. The 7 train ride is 4–6 minutes longer from Sunnyside than from LIC's Court Square. For value-per-dollar, Sunnyside wins decisively — the rent gap covers a year of groceries and most of a vacation. For first-time NYC renters who haven't lived without a doorman, LIC removes friction. Sunnyside Gardens is a separate consideration: garden-access two-family rentals there are unique stock with no LIC equivalent, and worth a 10–20% premium over the Sunnyside median if you can land one.",
        },
      },
      {
        "@type": "Question",
        name: "Are there no-fee apartments in Sunnyside under the FARE Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The FARE Act applies to all five boroughs, including Queens, so any Sunnyside rental where the broker was hired by the landlord is no-fee for the tenant by default. Sunnyside has a higher share of small-landlord one-to-six-unit buildings than the LIC tower stock, so the listing-source check is more important: if the listing is on StreetEasy, RentHop, or Zillow with a broker shown, confirm in writing that the broker represents the landlord. The handful of larger management companies in Sunnyside (Bayrock Capital, Stellar Management mid-rise) lease through their own offices and are reliably no-fee. The brownstone walkup tier above Skillman Avenue is mixed — verify per-listing.",
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
        name: "Sunnyside",
        item: `${baseUrl}/nyc/sunnyside`,
      },
    ],
  },
];

export default function SunnysidePage() {
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
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Sunnyside</Badge>
              <Badge variant="secondary">Queens</Badge>
              <Badge variant="default">+66.7% YoY demand</Badge>
              <Badge variant="default">7 Express to Grand Central 9 min</Badge>
              <Badge variant="outline">Updated 2026-05-04</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Sunnyside Queens Apartments: May 2026 Rent Prices, 7-Train
              Commute &amp; Demand Surge Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Sunnyside apartment search demand surged to{" "}
              <span className="font-semibold text-foreground">
                +66.7% YoY in early May 2026
              </span>{" "}
              — the strongest single-week riser among the Queens
              neighborhoods this analytics pipeline tracks, well ahead of{" "}
              <Link
                href="/nyc/astoria"
                className="text-primary underline underline-offset-2"
              >
                Astoria (+26.5%)
              </Link>{" "}
              and{" "}
              <Link
                href="/nyc/long-island-city"
                className="text-primary underline underline-offset-2"
              >
                Long Island City (+8.8%)
              </Link>
              . The driver: LIC-spillover renters extending the 7-train
              search 8–12 minutes further to land 1-bedrooms at $2,200–
              $2,500 instead of $3,200–$3,800. This guide covers May 2026
              rent by unit size, the 7-Express commute math, the Sunnyside
              Gardens historic district, and how Sunnyside compares to LIC
              and Astoria rent-for-minute.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed May 4, 2026 &middot; Median rent figures
              reflect May 2026 active listings on the major aggregators
            </p>
          </header>

          {/* ── Live Listings ─────────────────────────── */}
          <NeighborhoodLiveListings
            neighborhoodName="Sunnyside"
            latitude={40.7409}
            longitude={-73.9217}
            radiusMiles={0.7}
            limit={6}
            searchQuery="Sunnyside Queens apartments"
          />

          {/* ── Demand Surge Card ─────────────────────── */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>
                Why Sunnyside apartments just hit +66.7% YoY (May 2026
                Demand Surge)
              </CardTitle>
              <CardDescription>
                The strongest Queens riser of the week — what is driving it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>The LIC spillover.</strong> LIC 1BRs at $3,200–
                  $3,800 in the lease-up towers (Long Island City Towers,
                  TF Cornerstone Hunter&apos;s Point, Watermark) have
                  pushed the price-conscious cohort 8–12 minutes further
                  east on the 7 train. Sunnyside 1BRs at $2,200–$2,500
                  represent a $1,000–$1,400/month delta — roughly $13,000
                  per year — for a 4-to-6-minute commute extension. The
                  math is decisive.
                </li>
                <li>
                  <strong>The FARE Act Manhattan rotation extends to
                  Queens.</strong> Manhattan-priced-out renters who
                  initially rotated to{" "}
                  <Link
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/nyc/upper-west-side"
                    className="text-primary underline underline-offset-2"
                  >
                    Upper West Side
                  </Link>{" "}
                  are now extending the search to outer-borough neighborhoods
                  with strong subway access. Sunnyside&apos;s 9-minute
                  Grand Central commute is among the best per-dollar deals
                  in the city.
                </li>
                <li>
                  <strong>Sunnyside Yards rezoning watch.</strong> The
                  Sunnyside Yards master plan conversation continued
                  through Q1 2026 with major news outlets covering the
                  rezoning debate. Cultural visibility translates to
                  search volume — the same dynamic we saw with Greenpoint
                  in 2025 (eventual +245.9% YoY).
                </li>
                <li>
                  <strong>Memorial Day compression on a 14-month lease
                  cycle.</strong> Sunnyside is on the standard NYC
                  14-month-lease lockstep. Memorial Day (May 25) is when
                  small-landlord asking rents reset 4–6% higher and any
                  remaining 0.5-month concessions expire. Locking a
                  pre-Memorial-Day Sunnyside lease this week saves both
                  the rent reset and any FARE Act-disputed broker fee.
                </li>
                <li>
                  <strong>The 7 Express at 46th-Bliss.</strong> The 7
                  Express stops at Queensboro Plaza, Court Square, 5th Ave,
                  Grand Central, 5th Ave-Bryant Park, Times Square, Hudson
                  Yards. The pickup point in Sunnyside is 46th Street –
                  Bliss (during AM rush 7:00–10:00 and PM 4:00–7:00).
                  That 9-minute Grand Central ride beats every Brooklyn
                  neighborhood and most upper-Manhattan ones.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Sunnyside median rent by unit size (May 2026)</CardTitle>
              <CardDescription>
                Active asking rents on the major aggregators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit size</TableHead>
                    <TableHead>Median asking</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>vs LIC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell>$1,800</TableCell>
                    <TableCell>$1,500 – $2,200</TableCell>
                    <TableCell>-32%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-bedroom</TableCell>
                    <TableCell>$2,300</TableCell>
                    <TableCell>$2,000 – $2,800</TableCell>
                    <TableCell>-34%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-bedroom</TableCell>
                    <TableCell>$2,900</TableCell>
                    <TableCell>$2,500 – $3,500</TableCell>
                    <TableCell>-31%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-bedroom</TableCell>
                    <TableCell>$3,800</TableCell>
                    <TableCell>$3,300 – $4,500</TableCell>
                    <TableCell>-29%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                Sunnyside Gardens (43rd–52nd Streets between Skillman and
                Barnett) sits at the top of each range — garden-access
                rowhouse rentals are rare but command a 10–20% premium
                over the broader Sunnyside median.
              </p>
            </CardContent>
          </Card>

          {/* ── Sub-area Tier ─────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Sunnyside sub-area tiers</CardTitle>
              <CardDescription>
                Where in Sunnyside the rent and commute math actually pencils
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-area</TableHead>
                    <TableHead>1BR asking</TableHead>
                    <TableHead>Closest 7 stop</TableHead>
                    <TableHead>Vibe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      LIC border (39th – 43rd, north of Queens Blvd)
                    </TableCell>
                    <TableCell>$2,500 – $2,800</TableCell>
                    <TableCell>40th – Lowery</TableCell>
                    <TableCell>Pre-war elevator, LIC overflow</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Sunnyside Gardens (43rd – 52nd, Skillman to Barnett)
                    </TableCell>
                    <TableCell>$2,400 – $2,800</TableCell>
                    <TableCell>46th – Bliss</TableCell>
                    <TableCell>Historic rowhouse, garden access</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Queens Blvd corridor (39th – 50th)
                    </TableCell>
                    <TableCell>$2,200 – $2,500</TableCell>
                    <TableCell>40th, 46th, 52nd</TableCell>
                    <TableCell>Larger pre-war elevator</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      South Sunnyside (south of Queens Blvd, 39th – 46th)
                    </TableCell>
                    <TableCell>$2,100 – $2,400</TableCell>
                    <TableCell>40th, 46th</TableCell>
                    <TableCell>Smaller walkup, value tier</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Woodside-adjacent (52nd – 58th)
                    </TableCell>
                    <TableCell>$2,000 – $2,300</TableCell>
                    <TableCell>52nd – Lincoln Ave</TableCell>
                    <TableCell>Edge of Sunnyside, 7 still 11 min</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ── 7 train commute ─────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Sunnyside to Manhattan: 7-train commute reference</CardTitle>
              <CardDescription>
                Express vs. Local times from each Sunnyside stop to the major
                Manhattan destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sunnyside stop</TableHead>
                    <TableHead>Court Square</TableHead>
                    <TableHead>Grand Central</TableHead>
                    <TableHead>Hudson Yards</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      40th – Lowery
                    </TableCell>
                    <TableCell>3 min (Local)</TableCell>
                    <TableCell>9 min (Express)</TableCell>
                    <TableCell>14 min (Local)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      46th – Bliss
                    </TableCell>
                    <TableCell>4 min (Local)</TableCell>
                    <TableCell>9 min (Express)</TableCell>
                    <TableCell>15 min (Local)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      52nd – Lincoln Ave
                    </TableCell>
                    <TableCell>5 min (Local)</TableCell>
                    <TableCell>11 min (Express)</TableCell>
                    <TableCell>16 min (Local)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                7 Express runs AM 7:00–10:00 and PM 4:00–7:00 from Flushing
                heading west; Court Square transfer to E/M/R/G adds 4 min.
                Off-peak, only the Local runs — add 4–6 min to Manhattan
                destinations.
              </p>
            </CardContent>
          </Card>

          {/* ── CTA ────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Ready to find a Sunnyside apartment?
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI concierge your budget, sub-area preference
                (Gardens, Queens Blvd corridor, LIC border), and 7-train
                target — we&apos;ll surface only FARE Act-compliant
                Sunnyside listings.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Sunnyside+Queens+apartments">
                  Search Sunnyside apartments
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                <li>
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/astoria"
                    className="text-primary underline underline-offset-2"
                  >
                    Astoria Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/no-fee-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC No-Fee Apartments Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC FARE Act: Full Timeline + Refund Guide
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
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood
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
