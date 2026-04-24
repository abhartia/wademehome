import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
    "Journal Square Apartments: Jersey City 07306 Rent Guide (2026) | Wade Me Home",
  description:
    "Everything about renting in Journal Square — the PATH transit hub, new luxury towers (The Greyson, 505 Summit, Journal Squared), South Asian dining, and $400-500 discount to Downtown JC. Median 1BR $3,140.",
  keywords: [
    "Journal Square apartments",
    "07306 apartments",
    "Journal Square Jersey City rent",
    "The Greyson Jersey City",
    "505 Summit",
    "Journal Squared",
    "Journal Square PATH",
    "India Square Jersey City",
  ],
  openGraph: {
    title: "Journal Square Apartments: Jersey City 07306 Rent Guide (2026)",
    description:
      "Rent prices, PATH transit, and neighborhood guidance for Journal Square — the cheapest PATH-adjacent submarket in JC.",
    url: `${baseUrl}/jersey-city/journal-square`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/jersey-city/journal-square` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Journal Square Apartments: Jersey City 07306 Rent Guide 2026",
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
    publisher: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    author: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    mainEntityOfPage: `${baseUrl}/jersey-city/journal-square`,
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jersey City",
        item: `${baseUrl}/jersey-city`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Journal Square",
        item: `${baseUrl}/jersey-city/journal-square`,
      },
    ],
  },
];

export default function JournalSquareGuidePage() {
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
            <div className="flex items-center gap-2">
              <Badge variant="outline">Jersey City</Badge>
              <Badge variant="secondary">Journal Square</Badge>
              <Badge variant="secondary">07306</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Journal Square Apartments: Jersey City 07306 Rent Guide for 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              Journal Square (ZIP 07306) is the geographic and transit center
              of Jersey City, anchored by the largest PATH station in the
              system. A construction wave since 2019 has delivered roughly
              3,000 new luxury-tower units — The Greyson, 505 Summit, Journal
              Squared, 3 Journal Square — at median 1BR rents of $3,140, a
              $400 to $500 discount to Downtown JC for comparable new-build
              stock. South Asian restaurants along Newark Avenue (India
              Square) give the neighborhood a distinct cultural core.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Journal Square at a Glance</CardTitle>
              <CardDescription>
                Key rent and transit numbers for 07306
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1BR Rent
                  </p>
                  <p className="text-lg font-semibold">$3,140</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median Studio Rent
                  </p>
                  <p className="text-lg font-semibold">$2,695</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2BR Rent
                  </p>
                  <p className="text-lg font-semibold">$4,150</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    PATH to WTC
                  </p>
                  <p className="text-lg font-semibold">11 minutes</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    PATH to 33rd Street
                  </p>
                  <p className="text-lg font-semibold">22 minutes</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Listings on Wade Me Home
                  </p>
                  <p className="text-lg font-semibold">1,000+ in JSQ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What Journal Square Is Like</CardTitle>
              <CardDescription>
                A transit-first neighborhood in mid-transition from
                mid-century commercial core to dense residential
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Journal Square centers on the PATH Transportation Center at
                Kennedy Boulevard and Magnolia Avenue, a 1970s brutalist
                complex that is also the western terminus of every PATH
                line. From 2019 through today, four large rental towers
                have opened within a two-block radius of the station,
                adding roughly 3,000 units and fundamentally changing the
                daytime feel of the area. Another 2,500 units are under
                construction or recently topped off.
              </p>
              <p>
                Despite the construction wave, pricing still runs $400 to
                $500 below comparable Downtown JC new-build stock.
                Journal Squared 1BR averages $3,240; a matching unit at One
                Grove Downtown runs $4,365. That discount reflects three
                things: an extra 4 to 7 minutes of PATH time to Manhattan,
                less nightlife and fewer restaurants within a 5-minute
                walk, and a street-level feel that is still catching up
                with the tower skyline.
              </p>
              <p>
                The cultural anchor is India Square along Newark Avenue
                from Tonnele to Summit — one of the densest South Asian
                grocery, restaurant, and gold/jewelry corridors on the
                East Coast. Rasoi, Chand Palace, Chowpatty, and Sri
                Ganesh&apos;s Dosa House draw diners from across the metro.
                West Side Avenue and Kennedy Boulevard carry bodegas,
                halal spots, and older pre-war walk-up rentals at $2,000
                to $2,600 for a 1BR — the cheapest PATH-adjacent rent in
                Hudson County.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Journal Square Sub-Areas</CardTitle>
              <CardDescription>
                Different blocks within 07306 behave very differently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  JSQ Transit Core (Magnolia, Cottage, Summit)
                </h3>
                <p>
                  The new-tower cluster within a 5-minute walk of the PATH
                  plaza. The Greyson (25 Cottage), 505 Summit, Journal
                  Squared (615 Pavonia), and 3 Journal Square sit here.
                  1BR runs $2,950 to $3,500 with full amenity stacks —
                  gym, roof, co-working. Best pick for commute-optimized
                  renters.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  India Square (Newark Avenue)
                </h3>
                <p>
                  Roughly Newark Avenue from Tonnele to JSQ station. Dense
                  South Asian commercial strip with walkup apartments
                  above restaurants and shops. 1BR runs $2,100 to $2,700.
                  Ground-floor kitchen/bathroom quality varies widely.
                  Best pick for renters prioritizing cuisine access over
                  amenities.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  McGinley Square (south of JSQ)
                </h3>
                <p>
                  Roughly 3 blocks south of the PATH, around St Peter&apos;s
                  University. Pre-war walk-up stock and 2-4 unit row
                  houses. 1BR runs $1,900 to $2,500. 10 to 15 minute walk
                  to PATH. Older housing quality but the cheapest
                  PATH-adjacent rent in JC.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Bergen Hill / West Side Avenue
                </h3>
                <p>
                  West of Kennedy Boulevard. Mix of older 1- and 2-family
                  homes and pre-war 6-plex walk-ups. 1BR $2,000 to $2,400.
                  No PATH walk — Light Rail at West Side Avenue or a
                  bus/Uber to JSQ PATH. Quieter residential feel but
                  meaningful transit premium over the walk-to-PATH blocks.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Hilltop / The Heights edge (Central Ave)
                </h3>
                <p>
                  The northern edge of 07306 bumping up against The
                  Heights (07307). Brownstones, 2-4 unit row houses. 1BR
                  $2,200 to $2,800. Served by the 119 bus and Central
                  Avenue corridor. Walk to JSQ PATH is 15 to 20 minutes or
                  one bus stop.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notable Buildings in Journal Square</CardTitle>
              <CardDescription>
                Large rental buildings with active availability on Wade Me
                Home
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Avg Rent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      505 Summit
                    </TableCell>
                    <TableCell>505 Summit Avenue</TableCell>
                    <TableCell>$3,874</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      The Greyson
                    </TableCell>
                    <TableCell>25 Cottage Street</TableCell>
                    <TableCell>$3,446</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Journal Squared (Tower 1)
                    </TableCell>
                    <TableCell>615 Pavonia Avenue</TableCell>
                    <TableCell>$3,240</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      3 Journal Square
                    </TableCell>
                    <TableCell>3 Journal Square</TableCell>
                    <TableCell>$3,195</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      One Journal Square
                    </TableCell>
                    <TableCell>30 Journal Square</TableCell>
                    <TableCell>$3,150</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Journal Squared (Tower 2)
                    </TableCell>
                    <TableCell>631 Pavonia Avenue</TableCell>
                    <TableCell>$3,390</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transit: Journal Square PATH Hub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Journal Square is the western terminus of every PATH line
                and the largest station in the system. Every JSQ resident
                rides a train that originates here, which means a
                guaranteed seat during morning rush — a meaningful
                quality-of-life edge over Grove Street or Exchange Place
                riders who board mid-line.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>JSQ → World Trade Center: 11 minutes (direct)</li>
                <li>JSQ → Exchange Place: 4 minutes</li>
                <li>JSQ → Grove Street: 2 minutes</li>
                <li>
                  JSQ → 33rd Street (Midtown): 22 minutes (via Hoboken
                  change, or direct JSQ-33rd overnight)
                </li>
                <li>JSQ → Newark Penn Station: 10 minutes</li>
                <li>
                  NJ Transit Bus 119 → Port Authority: 25 to 35 minutes via
                  Lincoln Tunnel (congestion-dependent)
                </li>
              </ul>
              <p>
                Monthly unlimited PATH is roughly $100. The 24/7 service
                coverage is important for overnight industries — JSQ is
                one of the most reliable late-night Manhattan-return
                neighborhoods in the metro.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Journal Square Hunters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  New-build concession math.
                </span>{" "}
                Tower leasing offices aggressively offer 1 to 2 months
                free on 13- to 14-month leases during the new-construction
                wave. A $3,400 gross 1BR with 2 months free on a 14-month
                lease is effectively $2,914/mo — competitive with older
                Hamilton Park brownstones. Always calculate net effective
                rent.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Walk-to-PATH band matters a lot.
                </span>{" "}
                Between the JSQ PATH station and the walkable new-build
                cluster sits a retail-and-bus plaza that takes 3 to 5
                minutes to cross. The Greyson, 505 Summit, and Journal
                Squared are all 5 minutes or less. Towers in the
                under-construction second wave — further up Summit Ave or
                around Beacon — stretch that to 8 to 12 minutes. Price
                the walk.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Pre-1987 rent control check for walk-ups.
                </span>{" "}
                NJ rent control applies to pre-1987 5+ unit buildings. Many
                Newark Avenue and West Side Avenue walk-ups qualify. Ask
                the landlord for the 12-month prior rent history before
                signing — a controlled $2,200 walk-up at the ceiling is
                worth noticeably more over 3 to 5 years than an
                uncontrolled $2,400 unit that can jump 8 to 12% on
                renewal.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Broker fee norms.
                </span>{" "}
                New-build towers are nearly always no-fee direct-to-leasing.
                Walk-up and brownstone listings on Newark Avenue or
                Kennedy Boulevard typically carry 10 to 15% broker fees.
                Wade Me Home shows the fee posture on each listing.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Ready to search?
                </span>{" "}
                <Link
                  href="/?q=Journal%20Square%20apartments%20near%20PATH"
                  className="text-primary underline underline-offset-2"
                >
                  Browse Journal Square listings on Wade Me Home
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/jersey-city/journal-square/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Rent Prices: Tower-by-Tower Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/journal-square/apartments-under-2500"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Apartments Under $2,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/journal-square/apartments-under-3000"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Apartments Under $3,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Main Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Rent Prices: Zip-Code Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/downtown"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown Jersey City Apartments Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/newport"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Apartments Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bad-landlord-nj-ny"
                    className="text-primary underline underline-offset-2"
                  >
                    NJ Renter Protections &amp; Bad Landlord Guide
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
