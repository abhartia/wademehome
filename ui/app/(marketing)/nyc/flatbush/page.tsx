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
    "Apartments for Rent in Flatbush, Brooklyn (2026): Rent Prices, B/Q Subway & PLG / Ditmas Park Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in Flatbush, Brooklyn. Median rent by unit size, B/Q/2/5 subway access, Prospect-Lefferts Gardens vs Ditmas Park vs Flatbush core vs East Flatbush, the cheapest 1BR median of any Brooklyn neighborhood with direct B/Q Manhattan access.",
  keywords: [
    "flatbush apartments",
    "flatbush apartments for rent",
    "flatbush brooklyn apartments",
    "flatbush rent",
    "flatbush rent prices 2026",
    "flatbush studio rent",
    "flatbush 1 bedroom rent",
    "flatbush 2 bedroom rent",
    "prospect lefferts gardens apartments",
    "PLG apartments",
    "ditmas park apartments",
    "kensington apartments brooklyn",
    "east flatbush apartments",
    "apartments 11226",
    "apartments 11225",
    "apartments 11218",
    "apartments 11203",
    "B train Brooklyn apartments",
    "Q train Brooklyn apartments",
    "flatbush no fee apartments",
    "moving to flatbush",
    "ditmas park victorian houses",
    "PLG brownstone rentals",
  ],
  openGraph: {
    title:
      "Apartments for Rent in Flatbush, Brooklyn (2026): Rent Prices, Subway & PLG / Ditmas Park Guide",
    description:
      "2026 rent prices, B/Q/2/5 subway access, sub-area breakdown, and apartment-hunting tips for Flatbush — Brooklyn's deepest value tier south of Prospect Park.",
    url: `${baseUrl}/nyc/flatbush`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/flatbush` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in Flatbush, Brooklyn (2026): Rent Prices, B/Q Subway & PLG / Ditmas Park Guide",
    description:
      "A 2026 guide to renting in Flatbush, Brooklyn — rent prices by unit size, B/Q/2/5 subway access, sub-area differences (PLG, Ditmas Park, Flatbush core, Kensington, East Flatbush), Victorian housing stock, and tips for apartment hunters.",
    datePublished: "2026-04-25",
    dateModified: "2026-04-25",
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
    mainEntityOfPage: `${baseUrl}/nyc/flatbush`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Flatbush?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, median rent in Flatbush runs approximately $1,800 for a studio, $2,300 for a 1-bedroom, $3,100 for a 2-bedroom, and $4,000 for a 3-bedroom. This is the lowest 1-bedroom median of any Brooklyn neighborhood with direct B/Q Manhattan subway access. Prospect-Lefferts Gardens commands a 15–20% premium over the Flatbush core for prox to Prospect Park; Ditmas Park commands a 20–30% premium for the freestanding Victorian house stock.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve Flatbush?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Flatbush is served by the B/Q on Brighton Beach Line (Prospect Park, Parkside Avenue, Church Avenue, Beverley Road, Cortelyou Road, Newkirk Avenue, Avenue H, Avenue J, Avenue M), and the 2/5 on the Nostrand Avenue Line (Beverley Road, Newkirk Avenue, Flatbush Av-Brooklyn College). The Q express is a 28-minute ride from Cortelyou Road to Times Square; the 2/5 is a 35-minute ride from Newkirk to Wall Street. The B express skips Beverley, Cortelyou, and Newkirk.",
        },
      },
      {
        "@type": "Question",
        name: "What is Prospect-Lefferts Gardens?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Prospect-Lefferts Gardens (PLG) is the northernmost Flatbush sub-area, directly south of Prospect Park, between Empire Boulevard and Clarkson Avenue, Flatbush Avenue to New York Avenue. It contains a small landmarked historic district with preserved 1900s rowhouses, a Q-train commute that's 22 minutes to Union Square, and 1-bedrooms at $2,500–$2,900 — competitive with Crown Heights but cheaper. The PLG name distinguishes the prox-to-park premium from the larger Flatbush identity.",
        },
      },
      {
        "@type": "Question",
        name: "What makes Ditmas Park different?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ditmas Park is a small landmarked enclave inside Flatbush, roughly Cortelyou Road to Avenue H, Coney Island Ave to Ocean Ave. It's known for its freestanding Victorian and Queen Anne houses (built 1900–1915) — the only neighborhood in Brooklyn with a substantial intact stock of single-family detached houses. Most are owner-occupied, but rental units do exist either as legal 2-family conversions or accessory units. Apartment-style rental stock in Ditmas Park is concentrated in pre-war 6-story buildings on Ocean Avenue and around the Cortelyou Road Q stop. Median 1BR is approximately $2,500.",
        },
      },
      {
        "@type": "Question",
        name: "Is Flatbush a safe neighborhood?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Flatbush varies meaningfully by sub-area. PLG and Ditmas Park have crime rates roughly comparable to Park Slope per NYPD CompStat. The Flatbush core (around Church Avenue and Flatbush Avenue) and East Flatbush show higher rates of property crime and some violent crime, with year-over-year declines. As anywhere in NYC, walk your target blocks at night, check the precinct (66th, 67th, 70th depending on sub-area) on CompStat, and weight subway-line proximity heavily.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Flatbush rising on Brooklyn rental searches in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Two factors: (1) Flatbush's 1BR median ($2,300) is roughly 15% below Bed-Stuy and 30% below Crown Heights with the same Q-train Manhattan access — renters priced out of north Brooklyn are pushing into PLG and Ditmas Park as the next value tier; (2) Ditmas Park's Victorian house stock has zero substitutes in NYC, drawing search volume from renters who specifically want detached or semi-detached single-family-feel housing. Rising-related queries on Google Trends include 'PLG apartments' and 'ditmas park rentals' both up year-over-year.",
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
        name: "Flatbush",
        item: `${baseUrl}/nyc/flatbush`,
      },
    ],
  },
];

export default function FlatbushPage() {
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
              <Badge variant="secondary">Brooklyn, NY</Badge>
              <Badge variant="outline">B/Q · 2/5</Badge>
              <Badge className="bg-emerald-600">Brooklyn value tier</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in Flatbush, Brooklyn (2026): Rent Prices,
              Subway &amp; PLG / Ditmas Park Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Flatbush is Brooklyn&apos;s deepest value tier south of
              Prospect Park. The 2026 1-bedroom median ($2,300) is roughly
              15% below Bed-Stuy and 30% below Crown Heights with the same
              Q-train Manhattan access. Ditmas Park&apos;s Victorian house
              stock — freestanding 1900s detached houses — has no substitute
              elsewhere in NYC. Prospect-Lefferts Gardens (PLG) sits directly
              against Prospect Park with a 22-minute Q to Union Square.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 25, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Flatbush"
            latitude={40.6429}
            longitude={-73.9618}
            radiusMiles={1.4}
            limit={6}
            searchQuery="Flatbush apartments"
          />

          <Card>
            <CardHeader>
              <CardTitle>Flatbush Rent Prices by Unit Size (2026)</CardTitle>
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
                    <TableCell>$1,800</TableCell>
                    <TableCell>$1,500 – $2,200</TableCell>
                    <TableCell>$72,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>$2,300</TableCell>
                    <TableCell>$1,900 – $2,900</TableCell>
                    <TableCell>$92,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>$3,100</TableCell>
                    <TableCell>$2,500 – $3,900</TableCell>
                    <TableCell>$124,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>$4,000</TableCell>
                    <TableCell>$3,200 – $5,200</TableCell>
                    <TableCell>$160,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Prospect-Lefferts Gardens (PLG) commands a 15–20% premium for
                Prospect Park proximity. Ditmas Park&apos;s Victorian-house
                rentals (rare) command 20–30% premiums. East Flatbush, south
                of Avenue H, runs 10–15% below the median.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flatbush Sub-Areas</CardTitle>
              <CardDescription>
                Flatbush is one of NYC&apos;s biggest neighborhoods (~3.5
                sq mi) — these are the five functional sub-areas renters
                shop separately
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
                      Prospect-Lefferts Gardens (PLG)
                    </TableCell>
                    <TableCell>$2,650</TableCell>
                    <TableCell>
                      Empire–Clarkson, Flatbush–New York Ave
                    </TableCell>
                    <TableCell>
                      Park-adjacent, Caribbean restaurants, Q at Parkside
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Ditmas Park
                    </TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell>
                      Cortelyou–Ave H, Coney Island–Ocean Ave
                    </TableCell>
                    <TableCell>
                      Victorian houses, Q at Cortelyou, landmarked
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Flatbush Core
                    </TableCell>
                    <TableCell>$2,200</TableCell>
                    <TableCell>
                      Clarkson–Cortelyou, Flatbush–Nostrand
                    </TableCell>
                    <TableCell>
                      Pre-war 6-story walkups, Q + 2/5 corridor
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Kensington / Parkside
                    </TableCell>
                    <TableCell>$2,400</TableCell>
                    <TableCell>
                      Church–Caton, Coney Island–Ocean Pkwy
                    </TableCell>
                    <TableCell>
                      F train at Church/Ditmas, slightly quieter
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East Flatbush
                    </TableCell>
                    <TableCell>$2,000</TableCell>
                    <TableCell>
                      Linden–Foster, Nostrand–E 98th
                    </TableCell>
                    <TableCell>
                      Cheapest sub-area, 2/5 at Newkirk, B6 SBS
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flatbush Transit</CardTitle>
              <CardDescription>
                Three subway corridors plus the F at Kensington — Flatbush
                is more transit-rich than people expect
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Q (Brighton Beach Line):</strong> The Flatbush
                workhorse. Cortelyou Road to Times Square in 28 minutes; the
                Q skips Beverley/Cortelyou/Newkirk in B-express service. The
                Q is the only Manhattan-direct line for the western half of
                Flatbush.
              </p>
              <p>
                <strong>B (Brighton Beach Express):</strong> Rush-hour
                express version of the Q. Cortelyou to Times Square in 22
                minutes. Doesn&apos;t run weekends or late nights.
              </p>
              <p>
                <strong>2/5 (Nostrand Avenue Line):</strong> The eastern
                Flatbush line. Newkirk Avenue to Wall Street in 35 minutes
                on the 2 (the 2 runs local in Brooklyn but express in
                Manhattan).
              </p>
              <p>
                <strong>F (Church Avenue, Ditmas Avenue):</strong> The
                Kensington edge of Flatbush is on the F. Church Avenue F is
                a 30-minute ride to West 4th.
              </p>
              <p>
                <strong>B6 / B41 / B44 SBS / B49:</strong> Bus network is
                strong. The B44 SBS on Nostrand and the B41 on Flatbush
                Avenue are the workhorses for crossing the neighborhood.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The Ditmas Park Victorian Market</CardTitle>
              <CardDescription>
                The only NYC neighborhood with a substantial intact stock of
                freestanding 1900s detached houses — what renting one means
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Ditmas Park (and the adjacent Prospect Park South historic
                district) contains roughly 600–800 freestanding Victorian
                and Queen Anne houses built 1900–1915, plus a smaller
                concentration of Tudors and Foursquares. Most are
                owner-occupied single-family. Rental stock is limited but
                does exist:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Garden-floor / English-basement units</strong> in
                  legally-converted Victorians: $2,000–$2,800 1BR with
                  back-yard access
                </li>
                <li>
                  <strong>Pre-war 6-story buildings on Ocean Avenue</strong>
                  : $2,200–$2,900 1BR (most rental supply concentrates here)
                </li>
                <li>
                  <strong>Cortelyou Road mid-rise stock</strong>: $2,300–
                  $3,100 1BR (closest to the Q stop)
                </li>
                <li>
                  <strong>Two-family Victorian top-floor units</strong>:
                  $2,800–$3,800 (rare on market, often word-of-mouth)
                </li>
              </ul>
              <p>
                Trade-offs vs. a north-Brooklyn pre-war: smaller landlords,
                slower maintenance, often shared-laundry. Upside: the only
                rental experience in NYC where a wraparound porch and
                detached-house quiet are realistic at sub-$3,000.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flatbush Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Q-stop choice = rent tier.</strong> Parkside
                  Avenue (PLG) commands 15–20% over Cortelyou Road, which
                  commands 10% over Newkirk Avenue. Walk the actual block
                  to your target Q stop before signing.
                </li>
                <li>
                  <strong>Ditmas Park Victorian rentals are rare and
                  word-of-mouth.</strong> The freestanding-house rental
                  stock turns over slowly. Walk the Ditmas Park / Prospect
                  Park South historic district blocks and look for &ldquo;For
                  Rent&rdquo; signs in windows; the listings sites under-cover
                  this stock.
                </li>
                <li>
                  <strong>Pre-1974, 6+ unit Flatbush walkups are commonly
                  rent-stabilized.</strong> Ocean Avenue, Bedford Avenue,
                  and Newkirk Avenue have substantial 6-story pre-war stock.
                  2026 RGB renewal caps are 3.0% (1-yr) / 4.5% (2-yr). Ask
                  for DHCR registration.
                </li>
                <li>
                  <strong>PLG vs. Crown Heights — pick the
                  park.</strong> PLG sits directly against Prospect Park
                  with the Q at Parkside; Crown Heights sits half a mile
                  east with the 2/3/4/5 at Franklin/Eastern Pkwy. PLG runs
                  $200–$400/month cheaper for a comparable 1BR — and the
                  park access is better.
                </li>
                <li>
                  <strong>The B express is rush-only.</strong> A Cortelyou
                  Road B&Q listing pitched on a 22-minute Manhattan commute
                  is true on weekday rush only — weekends, evenings, and
                  late-nights are the 28-minute Q. Plan around the Q.
                </li>
                <li>
                  <strong>Caribbean restaurants are an underrated
                  amenity.</strong> Flatbush Avenue and Nostrand Avenue from
                  Empire to Avenue H are the densest Caribbean restaurant
                  corridor in NYC. Renting on these blocks means roti, jerk,
                  and oxtail within walking distance.
                </li>
                <li>
                  <strong>FARE Act applies.</strong> When the landlord hires
                  the broker, the tenant doesn&apos;t pay. Confirm on every
                  listing — see our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act guide
                  </Link>
                  .
                </li>
                <li>
                  <strong>Avenue H and below = quieter and cheaper, but
                  longer commute.</strong> Avenue J, Avenue M, and Brooklyn
                  College stops on the Q add 4–10 minutes to Manhattan but
                  drop rent another 10–20% for comparable stock. Worth
                  considering if you&apos;re on a budget and don&apos;t
                  commute daily.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live Flatbush apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge which Flatbush sub-area (PLG, Ditmas Park,
                Flatbush core, Kensington, East Flatbush), which subway, and
                your budget — we&apos;ll surface matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Flatbush+apartments">
                  Search Flatbush Apartments
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
                    href="/nyc/flatbush/apartments-under-2000"
                    className="text-primary underline underline-offset-2"
                  >
                    Flatbush Apartments Under $2,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/flatbush/apartments-under-2500"
                    className="text-primary underline underline-offset-2"
                  >
                    Flatbush Apartments Under $2,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/flatbush/apartments-under-3000"
                    className="text-primary underline underline-offset-2"
                  >
                    Flatbush Apartments Under $3,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/park-slope"
                    className="text-primary underline underline-offset-2"
                  >
                    Park Slope Guide (next stop on Q)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bed-stuy"
                    className="text-primary underline underline-offset-2"
                  >
                    Bed-Stuy Guide (Brooklyn brownstone alternative)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Guide (north Brooklyn value)
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
