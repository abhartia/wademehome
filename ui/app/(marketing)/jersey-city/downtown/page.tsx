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
    "Downtown Jersey City Apartments: Grove Street, Paulus Hook & Hamilton Park Rent Guide (2026) | Wade Me Home",
  description:
    "Everything about renting in Downtown Jersey City — Grove Street and Exchange Place PATH access, brownstone and luxury tower rent, restaurant density, and NJ renter protections. Median 1BR $3,640.",
  keywords: [
    "Downtown Jersey City apartments",
    "Grove Street apartments",
    "Paulus Hook apartments",
    "Hamilton Park Jersey City",
    "Van Vorst Park",
    "07302 apartments",
    "Downtown JC rent",
    "Exchange Place apartments",
    "Jersey City brownstone rent",
  ],
  openGraph: {
    title: "Downtown Jersey City Apartments: Rent, PATH & Neighborhood Guide (2026)",
    description:
      "Rent prices, PATH access, and block-level guidance for Downtown Jersey City — Grove Street, Paulus Hook, Hamilton Park, Van Vorst Park.",
    url: `${baseUrl}/jersey-city/downtown`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/jersey-city/downtown` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Downtown Jersey City Apartments: Grove Street, Paulus Hook & Hamilton Park Rent Guide 2026",
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
    publisher: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    author: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    mainEntityOfPage: `${baseUrl}/jersey-city/downtown`,
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
        name: "Downtown",
        item: `${baseUrl}/jersey-city/downtown`,
      },
    ],
  },
];

export default function DowntownJerseyCityGuidePage() {
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
              <Badge variant="secondary">Downtown</Badge>
              <Badge variant="secondary">07302</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Downtown Jersey City Apartments: Grove Street, Paulus Hook &amp;
              Hamilton Park Rent Guide for 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              Downtown Jersey City (ZIP 07302) is the historic and commercial
              core of the city, anchored by Grove Street and Exchange Place
              PATH stations. A 7-minute PATH ride from Grove Street puts you at
              the World Trade Center — faster than most Manhattan subway
              commutes to the same destination. Median 1-bedroom rent is
              $3,640, compared to $4,000+ for comparable units in the Financial
              District or Tribeca.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Downtown JC at a Glance</CardTitle>
              <CardDescription>
                Key rent and transit numbers for 07302
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1BR Rent
                  </p>
                  <p className="text-lg font-semibold">$3,535</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median Studio Rent
                  </p>
                  <p className="text-lg font-semibold">$3,050</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2BR Rent
                  </p>
                  <p className="text-lg font-semibold">$4,500</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    PATH to WTC (Grove St)
                  </p>
                  <p className="text-lg font-semibold">7 minutes</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    PATH to WTC (Exchange Pl)
                  </p>
                  <p className="text-lg font-semibold">4 minutes</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Listings on Wade Me Home
                  </p>
                  <p className="text-lg font-semibold">600+ Downtown</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What Downtown Jersey City Is Like</CardTitle>
              <CardDescription>
                The urban core of the city, with historic brownstones and new
                luxury towers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Downtown JC runs from the Hudson waterfront west to roughly
                Marin Boulevard, and north from Liberty State Park to about
                the 14th Street viaduct that separates it from The Heights.
                Within that footprint sit five historic or distinct
                sub-districts: Paulus Hook at the southeast waterfront,
                Exchange Place around the PATH station, Van Vorst Park and
                Hamilton Park as designated historic districts with dense
                brownstone stock, and the Newport-adjacent northern strip
                along 10th through 16th Streets with newer construction.
              </p>
              <p>
                The neighborhood mixes four housing types. 19th-century row
                houses and brownstones dominate Hamilton Park and Van Vorst
                Park, many converted into 2- to 4-unit rentals at $2,800 to
                $3,800 for a 1BR. Mid-rise condo conversions and
                boutique-scale new construction fill in along Grove Street,
                Newark Avenue, and the numbered cross streets, typically in
                the $3,200 to $4,000 range. Full-service luxury towers cluster
                at the waterfront (Paulus Hook, Harborside) and along
                Columbus Drive, running $3,600 to $5,500 for a 1BR with full
                amenity stack. A small amount of older walkup stock on the
                Kennedy Boulevard edge offers true $2,400-$2,800 1BR deals
                but turns over slowly.
              </p>
              <p>
                Grove Street and Newark Avenue form the dining and nightlife
                core, with restaurant density comparable to a strong
                Brooklyn neighborhood. The pedestrian plaza on Newark Avenue
                is closed to cars weekends and hosts outdoor seating, bars,
                and live music. Hamilton Park and Van Vorst Park both have
                their eponymous parks as neighborhood centers, with weekend
                farmers markets and a more residential feel a block off
                Grove. Paulus Hook feels the most gentrified-waterfront, with
                narrow cobblestone streets, upscale condos, and the ferry
                landing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Downtown JC Sub-Areas</CardTitle>
              <CardDescription>
                Which Downtown block band fits your search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Paulus Hook (southeast waterfront)
                </h3>
                <p>
                  Cobblestone streets, upscale row-house conversions and
                  waterfront condos. Closest to the NY Waterway ferry at
                  Paulus Hook, with a 7-minute scenic ride to Brookfield
                  Place. Median 1BR around $3,700 to $4,200 depending on
                  Hudson view. Quieter than Grove Street at night, with a
                  more residential feel.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Exchange Place &amp; Harborside
                </h3>
                <p>
                  The financial and tower district of Downtown JC. PATH
                  station with a 4-minute ride to WTC. Towers including 99
                  Hudson, Sable, 50 Columbus, 70 Columbus, and 90 Columbus
                  run $3,500 to $4,500 for a 1BR. Heavy weekday office
                  energy, quieter weekends. Best pick if commute to Lower
                  Manhattan is your top priority.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Hamilton Park Historic District
                </h3>
                <p>
                  Bounded by 8th, 10th, Jersey, and Erie Streets. Dense
                  brownstone and row-house stock, many converted into 2- to
                  4-unit buildings. 1BR runs $2,900 to $3,600 depending on
                  building quality and renovation level. Park at the center
                  is a weekend gathering spot with farmers market and dog
                  runs. Restaurants along Jersey Avenue. Roughly 10-minute
                  walk to Grove Street PATH.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Van Vorst Park Historic District
                </h3>
                <p>
                  Bounded roughly by Grand Street, Barrow, Montgomery, and
                  Jersey Avenue. Similar brownstone character to Hamilton
                  Park but slightly more expensive for Grove Street
                  proximity. 1BR runs $3,100 to $3,800. 5-minute walk to
                  Grove Street PATH. Van Vorst Park itself is smaller but
                  has a strong neighborhood association.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Grove Street Corridor
                </h3>
                <p>
                  The restaurant and nightlife spine. New construction towers
                  including One Grove, Grove Pointe, and the 70-90 Columbus
                  Drive cluster. 1BR runs $3,600 to $4,500 with full amenity
                  stacks. Loud on weekends, genuinely walkable. Best pick if
                  you want an urban night scene without Manhattan prices.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Northern Downtown (10th to 16th Streets)
                </h3>
                <p>
                  The newest construction wave, bordering Newport. Buildings
                  like Embankment House (270 10th St) and 9/50/88 Regent
                  Street offer newer stock at a slight discount to Paulus
                  Hook and Exchange Place — 1BR around $3,400 to $3,800. A
                  bit further from Grove Street nightlife but close to
                  Newport amenities and Newport PATH.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notable Buildings in Downtown JC</CardTitle>
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
                    <TableCell className="font-medium">One Grove</TableCell>
                    <TableCell>215 Grove Street</TableCell>
                    <TableCell>$4,365</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">90 Columbus</TableCell>
                    <TableCell>90 Christopher Columbus Dr</TableCell>
                    <TableCell>$4,195</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      88 Regent Street
                    </TableCell>
                    <TableCell>88 Regent Street</TableCell>
                    <TableCell>$3,967</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      9 Regent Street (The Zenith)
                    </TableCell>
                    <TableCell>9 Regent Street</TableCell>
                    <TableCell>$3,754</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Embankment House
                    </TableCell>
                    <TableCell>270 10th Street</TableCell>
                    <TableCell>$3,679</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">70 Columbus</TableCell>
                    <TableCell>70 Christopher Columbus Dr</TableCell>
                    <TableCell>$3,660</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      50 Regent Street
                    </TableCell>
                    <TableCell>50 Regent Street</TableCell>
                    <TableCell>$3,625</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">50 Columbus</TableCell>
                    <TableCell>50 Christopher Columbus Dr</TableCell>
                    <TableCell>$3,534</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transit: Grove Street &amp; Exchange Place PATH</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Downtown has two of the four JC PATH stations — Grove Street
                and Exchange Place — plus the Paulus Hook ferry landing.
                Grove Street serves the Newark-WTC and Hoboken-33rd Street
                lines with service every 3 to 5 minutes weekdays, 7 to 10
                minutes weekends. Exchange Place serves the WTC and Midtown
                lines with similar frequency.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Exchange Place → World Trade Center: 4 minutes</li>
                <li>Grove Street → World Trade Center: 7 minutes</li>
                <li>Grove Street → 33rd Street (Midtown): 18 minutes</li>
                <li>
                  Paulus Hook Ferry → Brookfield Place: 7 minutes (daytime
                  only)
                </li>
                <li>
                  NJ Transit Bus → Port Authority: 25 to 35 minutes via
                  Lincoln Tunnel (congestion-dependent)
                </li>
              </ul>
              <p>
                Both PATH stations are inside the 24/7 network, though
                overnight headways stretch to 30+ minutes. Monthly unlimited
                PATH is roughly $100, cheaper than a monthly NYC subway
                pass.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Downtown JC Hunters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Historic district rent-control check.
                </span>{" "}
                Pre-1987 buildings with 5+ units in Hamilton Park, Van Vorst
                Park, and the Grove Street corridor may be rent-controlled.
                Ask for the 12-month prior rent history. A unit at the
                controlled ceiling is worth materially more over a multi-year
                stay than the same nominal rent uncontrolled.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Walk-to-PATH matters block by block.
                </span>{" "}
                Grove Street PATH serves most of Hamilton Park and Van Vorst
                Park within a 10-minute walk, but the far west end of Hamilton
                Park (Coles, Monmouth Streets) adds another 5 to 8 minutes.
                Paulus Hook residents are closer to the ferry than to a PATH
                station — budget for a $10/day ferry commute or the Exchange
                Place walk.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Waterfront view premium.
                </span>{" "}
                Hudson view 1BRs on the Downtown waterfront run $3,800 to
                $5,500. Non-view 1BRs in the same building can be $600 to
                $1,000 cheaper. The view is real but evaluate how often
                you&apos;ll actually be sitting inside looking at it versus
                walking the waterfront promenade for free.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Broker fees still apply.
                </span>{" "}
                NJ has no equivalent to NYC&apos;s FARE Act. Luxury tower
                leasing offices are typically no-fee but Hamilton Park
                brownstone listings often carry a 10 to 15% broker fee.
                Clarify before you tour.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Ready to search?
                </span>{" "}
                <Link
                  href="/?q=Downtown%20Jersey%20City%20apartments%20near%20Grove%20Street%20PATH"
                  className="text-primary underline underline-offset-2"
                >
                  Browse Downtown Jersey City listings on Wade Me Home
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
                    href="/jersey-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Main Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/journal-square"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Apartments Guide
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
