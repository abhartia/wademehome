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
    "Newport Jersey City Apartments: 07310 Waterfront Rent Guide (2026) | Wade Me Home",
  description:
    "Everything about renting in Newport Jersey City — LeFrak-developed waterfront towers, Newport PATH, Newport Centre Mall, and amenity-dense luxury living. Median 1BR $3,495.",
  keywords: [
    "Newport Jersey City apartments",
    "07310 apartments",
    "Newport JC rent",
    "LeFrak Newport",
    "Newport PATH",
    "Jersey City waterfront apartments",
    "Newport Centre Mall",
  ],
  openGraph: {
    title: "Newport Jersey City Apartments: Waterfront Rent Guide (2026)",
    description:
      "Rent prices, PATH access, and building-by-building guidance for Newport — the purpose-built waterfront community developed by LeFrak.",
    url: `${baseUrl}/jersey-city/newport`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/jersey-city/newport` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Newport Jersey City Apartments: 07310 Waterfront Rent Guide 2026",
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
    publisher: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    author: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    mainEntityOfPage: `${baseUrl}/jersey-city/newport`,
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
        name: "Newport",
        item: `${baseUrl}/jersey-city/newport`,
      },
    ],
  },
];

export default function NewportJerseyCityGuidePage() {
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
              <Badge variant="secondary">Newport</Badge>
              <Badge variant="secondary">07310</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Newport Jersey City Apartments: 07310 Waterfront Rent Guide for
              2026
            </h1>
            <p className="text-sm text-muted-foreground">
              Newport (ZIP 07310) is a purpose-built mixed-use community on
              the Hudson waterfront, developed by the LeFrak Organization
              beginning in the 1980s. Almost every rental building carries
              the Newport name (Shore, Pier, Marbella, Grove Pointe,
              Avora) with a common amenity philosophy and central
              management. Median 1BR runs $3,495. Newport PATH sits at the
              center, with a 6-minute ride to WTC and 14 minutes to 33rd
              Street.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Newport at a Glance</CardTitle>
              <CardDescription>
                Key rent and transit numbers for 07310
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1BR Rent
                  </p>
                  <p className="text-lg font-semibold">$3,495</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median Studio Rent
                  </p>
                  <p className="text-lg font-semibold">$2,995</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2BR Rent
                  </p>
                  <p className="text-lg font-semibold">$4,675</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    PATH to WTC
                  </p>
                  <p className="text-lg font-semibold">6 minutes</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    PATH to 33rd Street
                  </p>
                  <p className="text-lg font-semibold">14 minutes</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Listings on Wade Me Home
                  </p>
                  <p className="text-lg font-semibold">500+ in Newport</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What Newport Is Like</CardTitle>
              <CardDescription>
                A master-planned waterfront community, almost entirely
                developed by a single family-owned company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Newport was a rail yard and abandoned waterfront until the
                LeFrak Organization began master-developing the 400-acre
                site in 1986. Nearly every residential, commercial, and
                retail parcel has been planned and managed by LeFrak or
                its affiliates, which produces a rare consistency in
                Newport&apos;s rental stock: almost every building is
                full-service luxury with a similar amenity set — 24/7
                doorman, gym, pool, resident lounge — and similar
                management quality.
              </p>
              <p>
                The neighborhood is organized around Newport Centre Mall
                (~150 stores, anchored by Macy&apos;s), Newport Green Park
                on the Hudson, and the Newport PATH station. A
                waterfront promenade runs the full length of the
                neighborhood, connecting to Exchange Place to the south
                and Hoboken to the north. Newport Marina at the north end
                offers boat slips and waterfront restaurants.
              </p>
              <p>
                Compared to Downtown JC, Newport skews slightly older,
                more family-oriented, and more amenity-dense. It lacks
                Downtown&apos;s restaurant and nightlife density —
                Newport Centre Mall and waterfront chains cover most
                dining — but delivers on the amenity-forward,
                purpose-built-waterfront vibe that renters moving from
                Battery Park City or the Financial District often expect.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Newport Building Clusters</CardTitle>
              <CardDescription>
                Newport&apos;s towers cluster into three bands by
                waterfront proximity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Direct Waterfront (Shore Club, Pier A/C, Avora)
                </h3>
                <p>
                  Buildings on the Hudson-facing edge with unobstructed
                  Manhattan views. Shore Club (Washington Blvd) and Avora
                  (200 Park Lane) anchor this cluster. 1BR with direct
                  view runs $3,800 to $4,500. Interior-facing units in the
                  same buildings run $3,300 to $3,700. Closest to
                  Newport Green Park.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Mall/PATH Core (Marbella, Monaco, Grove Pointe)
                </h3>
                <p>
                  Towers clustered around Newport Centre Mall and Newport
                  PATH. Marbella (401 Washington Blvd) and Monaco (475
                  Washington Blvd) are the largest. 1BR runs $3,200 to
                  $3,800. Best pick for mall/PATH access at the expense
                  of direct waterfront view.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Northern Newport (toward Hoboken)
                </h3>
                <p>
                  Buildings including 225 Grand, The James, and Avalon
                  Cove on the northern edge toward the Hoboken line. 1BR
                  runs $3,300 to $3,900. Marina-adjacent. Slightly longer
                  PATH walk (6 to 10 minutes) but quieter, more
                  residential feel.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notable Buildings in Newport</CardTitle>
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
                    <TableCell className="font-medium">Avora</TableCell>
                    <TableCell>200 Park Lane</TableCell>
                    <TableCell>$4,245</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Shore Club
                    </TableCell>
                    <TableCell>1 Shore Lane</TableCell>
                    <TableCell>$4,050</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Monaco</TableCell>
                    <TableCell>475 Washington Blvd</TableCell>
                    <TableCell>$3,795</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marbella</TableCell>
                    <TableCell>401 Washington Blvd</TableCell>
                    <TableCell>$3,650</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Grove Pointe
                    </TableCell>
                    <TableCell>100 Christopher Columbus Dr</TableCell>
                    <TableCell>$3,540</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      225 Grand
                    </TableCell>
                    <TableCell>225 Grand Street</TableCell>
                    <TableCell>$3,485</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transit: Newport PATH &amp; Light Rail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Newport PATH serves the Hoboken–WTC and Hoboken–33rd Street
                lines — meaning a single direct ride to Midtown, unlike
                Grove Street or Exchange Place which require a Hoboken
                change. That single-ride Midtown access is the biggest
                transit difference from Downtown JC.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Newport → World Trade Center: 6 minutes</li>
                <li>Newport → 33rd Street (Midtown): 14 minutes (direct)</li>
                <li>Newport → Hoboken: 3 minutes</li>
                <li>
                  Hudson-Bergen Light Rail at Newport: connects to Hoboken
                  Terminal, Bayonne, and West Side Ave
                </li>
                <li>
                  NY Waterway Ferry at Newport Marina: 9 minutes to
                  Midtown West (39th St)
                </li>
              </ul>
              <p>
                Monthly unlimited PATH is roughly $100. Ferry is $9 per
                ride or ~$310/month unlimited — worth it for Midtown West
                commuters avoiding the PATH-to-shuttle transfer at 33rd.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Newport Hunters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Single-landlord consistency is real.
                </span>{" "}
                Because LeFrak manages most of Newport, amenity standards,
                maintenance response time, and lease terms are unusually
                consistent across buildings. If a unit at Marbella has a
                problem with the building&apos;s responsiveness, it&apos;s
                likely a portfolio issue, not a building-specific issue —
                check reviews across Newport buildings, not just the one
                you&apos;re touring.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  View premium is steep.
                </span>{" "}
                Direct Manhattan-view 1BRs run $500 to $1,200 more than
                interior-facing units in the same building. The waterfront
                promenade is free and public — if you&apos;re rarely
                sitting at home during golden hour, consider interior.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Floor matters more than you&apos;d think.
                </span>{" "}
                Newport towers go up to 50+ floors. The difference between
                a 12th-floor and 35th-floor 1BR can be $400 to $700 even
                within the same line. Views, light, and noise all scale
                with floor.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  No-fee is standard.
                </span>{" "}
                Newport buildings run direct leasing offices with no
                broker fee. If you&apos;re offered a Newport rental
                through a broker charging 10 to 15%, you can almost always
                get the same unit direct at no fee.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Concession watch.
                </span>{" "}
                LeFrak offers 1 to 2 month concessions during softer
                quarters (Dec–Feb typically). A $3,700 gross 1BR with 2
                months free on 14 months nets to roughly $3,171. Track
                posted rent history; don&apos;t pay face rent in a
                concession quarter.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Ready to search?
                </span>{" "}
                <Link
                  href="/?q=Newport%20Jersey%20City%20waterfront%20apartments"
                  className="text-primary underline underline-offset-2"
                >
                  Browse Newport listings on Wade Me Home
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
                    href="/jersey-city/newport/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Rent Prices: Tower-by-Tower Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/newport/apartments-under-3500"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Apartments Under $3,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/newport/apartments-under-4000"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Apartments Under $4,000
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
                    href="/jersey-city/journal-square"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Apartments Guide
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
