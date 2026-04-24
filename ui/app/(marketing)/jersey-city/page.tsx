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
    "Jersey City Apartments: Rent Prices, PATH Transit & Neighborhood Guide (2026) | Wade Me Home",
  description:
    "Complete guide to renting in Jersey City, NJ. Median rent by zip code, PATH commute times to Manhattan (WTC in 7 min from Grove Street), Downtown vs Journal Square vs Newport vs Heights, NJ renter protections, and the top JC buildings.",
  keywords: [
    "Jersey City apartments",
    "Jersey City rent",
    "JC apartments",
    "Jersey City NJ rent prices",
    "Downtown Jersey City apartments",
    "Journal Square apartments",
    "Newport Jersey City",
    "PATH train commute",
    "Jersey City vs Manhattan",
    "Jersey City luxury apartments",
    "Jersey City no fee apartments",
    "moving to Jersey City",
  ],
  openGraph: {
    title: "Jersey City Apartments: Rent Prices, PATH Transit & Guide (2026)",
    description:
      "Rent prices, PATH access, and neighborhood breakdown for Jersey City — the Manhattan-adjacent alternative where a 1BR costs $1,000/mo less than FiDi.",
    url: `${baseUrl}/jersey-city`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/jersey-city` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Jersey City Apartments: Rent Prices, PATH Transit & Neighborhood Guide for 2026",
    description:
      "A comprehensive guide to renting in Jersey City, NJ — covering Downtown, Journal Square, Newport, Exchange Place, The Heights, Bergen-Lafayette, and Greenville, with PATH commute times, real median rent, and NJ-specific renter protections.",
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
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
    mainEntityOfPage: `${baseUrl}/jersey-city`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Jersey City?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, the median asking rent across Jersey City is approximately $3,400 for all available units, $3,500 for a 1-bedroom, $3,030 for a studio, and $4,790 for a 2-bedroom. Downtown (07302) and Newport (07310) run the highest, with 1BR medians around $3,600 to $3,800. Journal Square (07306) sits in the mid-$3,200s. The Heights (07307), Bergen-Lafayette (07304), and Greenville (07305) run $2,500 to $2,800 for a 1-bedroom.",
        },
      },
      {
        "@type": "Question",
        name: "How long is the PATH commute from Jersey City to Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PATH is the fastest Manhattan link for most of Jersey City. Exchange Place to World Trade Center is about 4 minutes. Grove Street to WTC is about 7 minutes. Newport to 33rd Street in Midtown is about 18 minutes. Journal Square to 33rd Street is about 25 minutes. Peak-hour trains run every 3 to 5 minutes on weekdays. PATH fares are $3.00 per ride and accept contactless payment.",
        },
      },
      {
        "@type": "Question",
        name: "Is Jersey City cheaper than Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — often by $800 to $1,500 per month for a comparable luxury 1-bedroom. A $3,500 Downtown JC 1BR with similar finishes and amenities would rent for $4,500 to $5,000 in the Financial District and $4,200 to $4,800 in Midtown East. Because Exchange Place and Grove Street are closer to WTC by PATH than most Manhattan subway stops are by train, Jersey City captures renters who work in Lower Manhattan and don't want to pay a Manhattan address premium.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between Downtown Jersey City, Newport, and Journal Square?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Downtown (07302) is the core historic and commercial district around Grove Street and Exchange Place PATH — brownstones, new luxury towers, dense restaurants and nightlife, and the fastest Lower Manhattan commute (4 to 7 minutes to WTC). Newport (07310) is a planned waterfront development clustered around Newport PATH with large family-friendly towers, a mall, and marina access; rents are similar to Downtown but the feel is more master-planned. Journal Square (07306) is the geographic center of JC anchored by the Journal Square Transportation Center (PATH + bus terminal); it has seen a major construction wave since 2020 with new towers at significant discounts to Downtown for a slightly longer PATH ride to Manhattan.",
        },
      },
      {
        "@type": "Question",
        name: "What are NJ security deposit rules?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under the New Jersey Security Deposit Act, landlords cannot collect more than 1.5 times the monthly rent as a security deposit. The deposit must be held in a separate interest-bearing account, and the landlord must notify the tenant in writing where the deposit is held within 30 days. At the end of tenancy, the landlord must return the deposit plus any earned interest within 30 days, along with an itemized list of any deductions. If the landlord misses the deadline or makes bogus deductions, the tenant can sue for double the amount wrongfully withheld plus court costs. This is materially more tenant-protective than New York, where the cap is 1 month.",
        },
      },
      {
        "@type": "Question",
        name: "Does Jersey City have rent control?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Jersey City has a local rent control ordinance that caps annual rent increases for qualifying rental properties with 5 or more units built before 1987. The increase cap is tied to the CPI with a 4% ceiling. Newer construction (post-1987) and buildings with fewer than 5 units are exempt, which covers most of the luxury high-rises Downtown and in Newport. If you're renting an older walkup or mid-sized apartment building in The Heights or Bergen-Lafayette, there's a meaningful chance the unit is rent-controlled. Ask to see the unit's prior 12-month rent history before signing.",
        },
      },
      {
        "@type": "Question",
        name: "Is Jersey City safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Downtown, Newport, Exchange Place, and most of The Heights are generally considered safe with heavy foot traffic, active ground-floor retail, and 24-hour doorman buildings in most new towers. Journal Square has improved significantly with the construction wave but still has quieter commercial blocks that see less evening activity. Greenville and parts of Bergen-Lafayette have higher reported crime rates than the waterfront neighborhoods — not dramatically, but noticeable if you're comparing at the block level. Standard urban precautions apply citywide.",
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
        name: "Jersey City",
        item: `${baseUrl}/jersey-city`,
      },
    ],
  },
];

export default function JerseyCityGuidePage() {
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
              <Badge variant="outline">Jersey City</Badge>
              <Badge variant="secondary">New Jersey</Badge>
              <Badge variant="secondary">PATH access</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Jersey City Apartments: Rent Prices, PATH Transit &amp;
              Neighborhood Guide for 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              Jersey City is the fastest-growing rental market across the
              Hudson from Manhattan, with a 7-minute PATH ride from Grove
              Street to the World Trade Center and a median 1-bedroom rent
              roughly $1,000 per month lower than comparable Financial
              District apartments. This guide covers the seven main
              sub-neighborhoods (Downtown, Newport, Exchange Place, Journal
              Square, The Heights, Bergen-Lafayette, and Greenville), real
              median rents by ZIP, PATH and Light Rail commutes, NJ-specific
              renter protections, and tips for landing a Jersey City lease.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Rent figures are medians of active
              market-rate listings on Wade Me Home
            </p>
          </header>

          {/* ── Quick Facts ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City at a Glance</CardTitle>
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
                  <p className="text-lg font-semibold">$2,900 &ndash; $3,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,200 &ndash; $3,800</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$4,400 &ndash; $5,300</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    NJ Income Rule
                  </p>
                  <p className="text-lg font-semibold">~3x monthly rent</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    PATH Stations in JC
                  </p>
                  <p className="text-lg font-semibold">
                    JSQ, Grove, Exchange Pl, Newport
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    ZIP Codes
                  </p>
                  <p className="text-lg font-semibold">
                    07302, 07304, 07305, 07306, 07307, 07310, 07311
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Neighborhood Character ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>What Jersey City Is Like</CardTitle>
              <CardDescription>
                Waterfront towers, historic brownstones, and NJ&apos;s most
                diverse rental stock
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Jersey City sits directly across the Hudson from Lower
                Manhattan, with its waterfront edge staring straight into the
                Financial District and the World Trade Center. The city has
                roughly 300,000 residents and is the second-largest in New
                Jersey after Newark, but for renters the relevant geography
                is the eastern strip: Exchange Place, Newport, and Downtown
                along the water; Journal Square in the interior as the major
                transit hub; The Heights up on the cliff to the north; and
                Bergen-Lafayette and Greenville to the south.
              </p>
              <p>
                Housing stock ranges from 19th-century brownstones and row
                houses in the Hamilton Park and Van Vorst Park historic
                districts of Downtown, to glass-and-steel luxury towers on
                the waterfront and around Journal Square. A major
                construction wave since 2015 added more than 20,000 new
                residential units, many with the same amenity stack (gym,
                pool, coworking lounge, roof deck) as comparable Manhattan
                or Long Island City buildings at meaningfully lower rents.
              </p>
              <p>
                The waterfront promenade extends continuously from Exchange
                Place through Newport to Hoboken, with parks, marinas,
                ferries, and some of the best Manhattan skyline views in
                the metropolitan area. The Light Rail (Hudson-Bergen Light
                Rail / HBLR) connects the waterfront to Bergen-Lafayette,
                Greenville, and up to Hoboken and Weehawken, filling the
                gaps PATH doesn&apos;t cover. Most Downtown residents mix
                PATH for Manhattan, Light Rail for intra-JC and Hoboken,
                and the NY Waterway ferry for scenic Midtown commutes.
              </p>
              <p>
                The restaurant and retail scene has grown with the
                construction wave. Downtown around Grove Street has the
                densest food and nightlife, comparable to a strong
                Brooklyn neighborhood. Journal Square&apos;s dining scene
                leans South Asian and Filipino reflecting the neighborhood
                demographics. Newport is more shopping-mall-and-tower
                focused with less street-level retail. Bergen-Lafayette has
                an emerging scene around the Liberty State Park side.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent Breakdown ────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Rent Prices by Apartment Size</CardTitle>
              <CardDescription>
                Median asking rent across JC for available units on Wade Me
                Home
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Studios</h3>
                <p>
                  JC studios median around $3,030 per month citywide, with
                  Downtown and Newport typically $3,100 to $3,300 and
                  Journal Square, The Heights, and Bergen-Lafayette $2,400
                  to $2,800. Studios in new towers run 450 to 650 square
                  feet with modern finishes and in-unit laundry. Older
                  walkup studios in The Heights and Bergen-Lafayette can be
                  found below $2,200 but turn over slowly.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  One-Bedrooms
                </h3>
                <p>
                  The median 1-bedroom citywide sits around $3,500. In
                  Downtown (07302) and Newport (07310) expect $3,600 to
                  $3,800 for a new-construction 1BR with amenities. Journal
                  Square (07306) runs $3,200 to $3,500 for a comparable
                  tower apartment — a $300 to $500 monthly discount for a
                  6-minute PATH difference. The Heights (07307) and
                  Bergen-Lafayette (07304) run $2,500 to $3,000 for older
                  but often larger 1BR apartments in mid-rise or converted
                  stock.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Two-Bedrooms &amp; Family Apartments
                </h3>
                <p>
                  Two-bedrooms citywide median around $4,790 with Downtown
                  and Newport reaching $5,000 to $6,000 for new-construction
                  waterfront units. Families priced out of Manhattan often
                  prefer JC&apos;s 2BR market: more square footage per
                  dollar, on-site amenities aimed at families (playrooms,
                  pools, parks nearby), and strong public schools in
                  certain districts. Share 2BRs with a roommate and the
                  per-person cost drops to roughly $2,400 to $2,900 in
                  Downtown, which is competitive with Manhattan studios.
                  Our{" "}
                  <Link
                    href="/roommates"
                    className="text-primary underline underline-offset-2"
                  >
                    roommate matching tool
                  </Link>{" "}
                  helps find compatible housemates if you&apos;re pursuing a
                  JC share.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Concessions &amp; Net Effective Rent
                </h3>
                <p>
                  Jersey City new-construction lease-ups routinely advertise
                  net effective rent with one or two months free. A 1BR
                  listed at $3,300 net effective might be $3,575 gross with
                  one month free on a 12-month lease. NJ lease-up seasons
                  follow a similar seasonal pattern to NYC — the best
                  concessions sit on the market from late fall through
                  February. See our{" "}
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    seasonal timing guide
                  </Link>{" "}
                  for the broader metro strategy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent by ZIP ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City Rent by ZIP Code</CardTitle>
              <CardDescription>
                Median asking rent for all available units on Wade Me Home,
                by ZIP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ZIP</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Median (all)</TableHead>
                    <TableHead>p25 &ndash; p75</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">07302</TableCell>
                    <TableCell>
                      <Link
                        href="/jersey-city/downtown"
                        className="text-primary underline underline-offset-2"
                      >
                        Downtown / Grove Street
                      </Link>
                    </TableCell>
                    <TableCell>$3,640</TableCell>
                    <TableCell>$3,311 &ndash; $4,277</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">07310</TableCell>
                    <TableCell>
                      <Link
                        href="/jersey-city/newport"
                        className="text-primary underline underline-offset-2"
                      >
                        Newport
                      </Link>
                    </TableCell>
                    <TableCell>$3,606</TableCell>
                    <TableCell>$3,335 &ndash; $4,573</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">07311</TableCell>
                    <TableCell>Exchange Place</TableCell>
                    <TableCell>$3,500</TableCell>
                    <TableCell>$3,305 &ndash; $3,777</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">07306</TableCell>
                    <TableCell>
                      <Link
                        href="/jersey-city/journal-square"
                        className="text-primary underline underline-offset-2"
                      >
                        Journal Square
                      </Link>
                    </TableCell>
                    <TableCell>$3,210</TableCell>
                    <TableCell>$2,855 &ndash; $3,540</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">07307</TableCell>
                    <TableCell>The Heights</TableCell>
                    <TableCell>$2,800</TableCell>
                    <TableCell>$2,475 &ndash; $3,505</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">07304</TableCell>
                    <TableCell>Bergen-Lafayette</TableCell>
                    <TableCell>$2,610</TableCell>
                    <TableCell>$2,120 &ndash; $3,311</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">07305</TableCell>
                    <TableCell>Greenville</TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell>$2,100 &ndash; $2,750</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-3 text-xs text-muted-foreground">
                Downtown and Newport command the highest rents for
                new-construction waterfront amenity buildings. Journal
                Square offers the largest discount relative to Downtown for
                a short PATH addition (25 min vs 18 min to 33rd Street).
                The Heights and Greenville deliver the lowest rents in the
                city with Light Rail connections to the waterfront.
              </p>
            </CardContent>
          </Card>

          {/* ── Comparison Table ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City vs. Manhattan (2026 1BR Rent)</CardTitle>
              <CardDescription>
                How JC pricing compares to Manhattan neighborhoods with
                similar commutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead>1BR Median</TableHead>
                    <TableHead>Commute to WTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      JC Downtown (Grove)
                    </TableCell>
                    <TableCell>$3,600&ndash;$3,800</TableCell>
                    <TableCell>7 min PATH</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      JC Exchange Place
                    </TableCell>
                    <TableCell>$3,500&ndash;$3,800</TableCell>
                    <TableCell>4 min PATH</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">JC Newport</TableCell>
                    <TableCell>$3,500&ndash;$4,000</TableCell>
                    <TableCell>10 min PATH</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Financial District
                    </TableCell>
                    <TableCell>$4,000&ndash;$4,800</TableCell>
                    <TableCell>Walk to WTC</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tribeca</TableCell>
                    <TableCell>$5,000&ndash;$6,500</TableCell>
                    <TableCell>5 min subway</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Long Island City
                    </TableCell>
                    <TableCell>$3,200&ndash;$3,800</TableCell>
                    <TableCell>20 min subway</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hoboken</TableCell>
                    <TableCell>$3,400&ndash;$3,900</TableCell>
                    <TableCell>10 min PATH</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-3 text-xs text-muted-foreground">
                JC Exchange Place and Grove Street are structurally faster
                to the WTC than most Manhattan subway rides. For a full
                metro comparison see our{" "}
                <Link
                  href="/nyc-rent-by-neighborhood"
                  className="text-primary underline underline-offset-2"
                >
                  NYC rent by neighborhood guide
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* ── Transit ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Around: PATH, Light Rail &amp; Ferry</CardTitle>
              <CardDescription>
                Jersey City commute times and transit options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Jersey City has four PATH stations, Light Rail that
                connects every JC neighborhood to the waterfront, NY
                Waterway ferries, and direct bus routes into the Port
                Authority terminal. For Manhattan commuters, PATH is the
                primary system and the reason JC rents are what they are.
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">
                    Exchange Place PATH
                  </span>{" "}
                  &mdash; 4 minutes to World Trade Center, 15 minutes to
                  33rd Street (Midtown) with a transfer at Grove or direct
                  on the JSQ-33 line. The fastest JC station for Lower
                  Manhattan. Towers within walking distance command the
                  highest rents in the city.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Grove Street PATH
                  </span>{" "}
                  &mdash; 7 minutes to WTC, 18 minutes to 33rd Street.
                  Serves the entire Downtown core including Hamilton Park,
                  Van Vorst Park, and Paulus Hook. Surrounded by restaurants,
                  bars, and historic brownstone blocks.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Newport PATH
                  </span>{" "}
                  &mdash; 10 minutes to WTC, 13 minutes to 33rd Street.
                  Serves the planned Newport development including the
                  Newport Centre mall, marina, and the large residential
                  towers clustered along Town Square Place and Washington
                  Boulevard.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Journal Square PATH (JSQ)
                  </span>{" "}
                  &mdash; 25 minutes to 33rd Street. The major regional
                  transit hub, with bus connections to Newark, Secaucus,
                  the Hudson County suburbs, and Newark Airport. Recent
                  high-rise construction around JSQ has been the largest
                  JC construction wave in recent years.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Hudson-Bergen Light Rail
                  </span>{" "}
                  &mdash; Connects Bergen-Lafayette, Liberty State Park,
                  Harborside, Newport, Hoboken, and Weehawken. Most JC
                  residents use Light Rail to reach Newport PATH from
                  lower-rent neighborhoods south and west, or to get to
                  Hoboken. Fare is separate from PATH.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    NY Waterway Ferry
                  </span>{" "}
                  &mdash; Paulus Hook to Brookfield Place / Midtown West
                  takes 7 to 12 minutes. More scenic than PATH and a
                  genuine commute option for Downtown renters who work on
                  the Manhattan waterfront. Seasonal discounts on monthly
                  passes.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Holland Tunnel / Driving
                  </span>{" "}
                  &mdash; Direct to Tribeca in 10 minutes off-peak, 30+
                  minutes during peak hours. $18 eastbound toll. Most
                  Downtown residents don&apos;t own a car; Newport and
                  Journal Square have more parking.
                </div>
              </div>
              <p>
                PATH fare is $3.00 per ride with contactless or SmartLink.
                Monthly unlimited PATH runs roughly $100, cheaper than a
                monthly NYC subway pass. PATH runs 24/7 but overnight
                headways stretch to 30+ minutes — most returns after
                midnight rely on NJ Transit or Uber.
              </p>
            </CardContent>
          </Card>

          {/* ── Sub-Neighborhoods ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City Sub-Neighborhoods</CardTitle>
              <CardDescription>
                Where to focus your JC apartment search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  <Link
                    href="/jersey-city/downtown"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown / Grove Street (07302)
                  </Link>
                </h3>
                <p>
                  The historic and commercial core. Hamilton Park, Van
                  Vorst Park, and Paulus Hook combine 19th-century
                  brownstones with new luxury towers. Median 1BR around
                  $3,600 to $3,800. The densest restaurant and nightlife
                  scene in NJ, the shortest Lower Manhattan commute outside
                  Exchange Place, and the best walkability. The right pick
                  if you want an urban NYC-adjacent lifestyle at a $1,000+
                  discount to Manhattan.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  <Link
                    href="/jersey-city/newport"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport (07310)
                  </Link>
                </h3>
                <p>
                  A planned development built from the 1980s onwards, now
                  one of the largest waterfront master-planned communities
                  in the metro. Big luxury towers, the Newport Centre
                  mall, a marina, and park space. Median 1BR around $3,600
                  to $4,000. Family-friendly relative to Downtown, with
                  strong in-building amenities, grocery stores, and
                  elementary schools in walking distance. Less street-level
                  nightlife than Downtown but similar PATH access and
                  Hudson views.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Exchange Place (07311 &amp; parts of 07302)
                </h3>
                <p>
                  The financial district of Jersey City, with office
                  towers, the PATH station, the Harborside waterfront, and
                  a growing residential tower cluster (Sable, 99 Hudson).
                  The shortest JC commute to Lower Manhattan — 4 minutes
                  to WTC. Less residential in feel than Downtown or
                  Newport but building amenity packages are premium.
                  Median 1BR around $3,500 to $3,800.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  <Link
                    href="/jersey-city/journal-square"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square (07306)
                  </Link>
                </h3>
                <p>
                  The geographic center of JC and the major transit hub.
                  Has seen the largest construction wave of the last five
                  years with new towers at 505 Summit, 3 Journal Square,
                  Journal Squared, and the 25 Cottage Street complex. Median
                  1BR around $3,200 to $3,500 — roughly $400 to $500 below
                  Downtown for a 6-minute longer PATH ride. Strong South
                  Asian and Filipino restaurant scene. The best value in
                  JC if you don&apos;t need to be on the waterfront.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  The Heights (07307)
                </h3>
                <p>
                  Sits on the cliff north of Journal Square, connected by
                  the Palisade Avenue corridor, the 2nd Street Light Rail
                  stop, and bus routes. Mix of 19th-century homes,
                  mid-century walkups, and newer mid-rises. Median 1BR
                  around $2,800. More family-oriented and residential than
                  the waterfront, with emerging dining on Central Avenue.
                  Longer Manhattan commute (25 to 35 minutes via Light
                  Rail + PATH) but genuine savings.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Bergen-Lafayette (07304)
                </h3>
                <p>
                  South of Downtown along the edge of Liberty State Park.
                  Historic row houses and a wave of mid-rise new
                  construction since 2020. Median 1BR around $2,600 to
                  $2,800. Liberty State Park access, Light Rail to the
                  waterfront, and a slower pace than Downtown. An
                  emerging neighborhood for renters willing to trade
                  walk-to-PATH convenience for space and savings.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Greenville (07305)
                </h3>
                <p>
                  The southernmost JC neighborhood, closer to Bayonne than
                  the waterfront. Median 1BR around $2,500 — the lowest in
                  the city. Primarily older stock (rowhomes, 2- to 4-unit
                  walkups). Light Rail connects to Exchange Place in
                  about 20 minutes. Reliable value for renters prioritizing
                  square footage per dollar, with the longest commute
                  trade-off.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── NJ-Specific Renter Protections ───────── */}
          <Card>
            <CardHeader>
              <CardTitle>New Jersey Renter Protections</CardTitle>
              <CardDescription>
                NJ renter law is materially more protective than NY on
                several points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Security deposit: capped at 1.5x monthly rent.
                </span>{" "}
                Under the NJ Security Deposit Act (N.J.S.A. 46:8-19 et
                seq.), landlords cannot collect more than 1.5 times the
                monthly rent. The deposit must sit in a separate
                interest-bearing account, with the bank and account number
                disclosed to the tenant within 30 days. At the end of the
                tenancy, the landlord has 30 days to return the deposit
                plus accrued interest with an itemized deduction list.
                Missed deadlines or bogus deductions entitle the tenant to
                double damages plus attorney&apos;s fees in small claims.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Rent control applies to older multi-family buildings.
                </span>{" "}
                Jersey City&apos;s rent control ordinance caps annual
                increases for buildings with 5 or more units constructed
                before 1987. The cap is tied to CPI with a 4% ceiling.
                Luxury new construction is exempt, but a material share of
                The Heights, Bergen-Lafayette, and Journal Square stock
                may qualify. Ask for the 12-month prior rent history
                before you sign — an unusual spike could mean the unit is
                rent-controlled and the landlord is charging above the
                legal rent.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Anti-eviction protections are strong.
                </span>{" "}
                The NJ Anti-Eviction Act (N.J.S.A. 2A:18-61.1) allows
                eviction only for enumerated &ldquo;good cause&rdquo;
                reasons (non-payment, lease violations, owner occupancy in
                limited cases) and explicitly bans retaliatory eviction.
                If your landlord tries to evict within a year of a
                habitability complaint, the law presumes retaliation.
                Document complaints with certified mail.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  No Fair Act equivalent — tenants pay broker fees.
                </span>{" "}
                Unlike NYC&apos;s FARE Act, there&apos;s no statewide NJ
                ban on tenant-paid broker fees. Most luxury tower leasing
                offices are no-fee anyway (they handle leasing in-house),
                but broker-listed walkups and older stock in JC commonly
                charge 1 month or 15% annual rent as a broker fee.
                Confirm fees before touring.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Reporting bad landlords.
                </span>{" "}
                For habitability issues in buildings with 3+ units, contact
                the NJ Department of Community Affairs Bureau of Housing
                Inspection at (609) 633-6227 or the Multifamily Housing
                Complaint Line at 1-800-MULTI-70. Our{" "}
                <Link
                  href="/bad-landlord-nj-ny"
                  className="text-primary underline underline-offset-2"
                >
                  bad-landlord guide
                </Link>{" "}
                covers the full reporting process and small claims
                strategy.
              </p>
            </CardContent>
          </Card>

          {/* ── Top Buildings ─────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Top Jersey City Rental Buildings</CardTitle>
              <CardDescription>
                The largest and most-searched buildings on Wade Me Home
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  The Greyson (25 Cottage Street, Journal Square)
                </h3>
                <p>
                  The largest rental building in Jersey City with over 700
                  units across multiple towers. Avg rent ~$3,450, amenities
                  include pool, gym, co-working, and full-time concierge.
                  One of the newest JSQ lease-ups.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  505 Summit (505 Summit Avenue, Journal Square)
                </h3>
                <p>
                  350+ units overlooking Journal Square. Avg rent ~$3,875.
                  Newer construction with premium amenity stack.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  NEWPORT Towers (121 Town Square Place, Newport)
                </h3>
                <p>
                  The anchor of the Newport master-planned community. Avg
                  rent ~$4,050. Direct access to Newport PATH, the mall,
                  and the waterfront promenade.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  The BLVD Collection (425 Washington Blvd, Newport)
                </h3>
                <p>
                  A waterfront Newport complex. Avg rent ~$4,000. Premium
                  tier amenities including pool deck with skyline views.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  One Grove (215 Grove Street, Downtown)
                </h3>
                <p>
                  On top of the Grove Street PATH entrance in Downtown JC.
                  Avg rent ~$4,365 — premium for the fastest commute in
                  the city and dense street-level restaurants.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Sable (200 Greene Street, Exchange Place)
                </h3>
                <p>
                  A new Exchange Place tower with direct proximity to the
                  PATH station. Avg rent ~$3,700. 4-minute commute to the
                  World Trade Center.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Apartment Hunting Tips ─────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Apartment Hunting Tips for Jersey City</CardTitle>
              <CardDescription>
                Practical advice for landing a JC lease
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">
                    1. Confirm rent control status on older buildings.
                  </span>{" "}
                  If you&apos;re looking at a pre-1987 building with 5+
                  units, ask to see the 12-month prior rent history and
                  confirm the unit&apos;s rent-control registration with
                  the Jersey City Rent Leveling Board. A rent-controlled
                  lease is worth $100 to $500 per month long-term versus
                  an uncontrolled lease at the same nominal price.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    2. Know the 1.5x deposit cap.
                  </span>{" "}
                  NJ caps security deposit at 1.5 times monthly rent. If
                  a landlord asks for more, that&apos;s a legal violation
                  and often a signal to walk. Demand disclosure of the
                  bank and account where the deposit is held — that&apos;s
                  also required by law within 30 days of signing.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    3. Test the PATH commute before you sign.
                  </span>{" "}
                  Walking times to PATH matter more than the distance on a
                  map. Some Newport buildings look close to Newport PATH
                  but sit on the far side of Washington Boulevard, adding
                  5 to 8 minutes. Some Downtown buildings are technically
                  Paulus Hook (closer to ferry than PATH). Do a dry run at
                  your actual commute time before signing.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    4. Compare gross and net effective rent.
                  </span>{" "}
                  JC lease-ups offer aggressive concessions, especially in
                  Journal Square. A $3,300 listing net effective might
                  mean $3,575 gross with one month free. Ask for the gross
                  monthly payment you&apos;ll write a check for, and
                  confirm whether the concession resets at renewal — often
                  it doesn&apos;t, so year 2 rent can jump $300 to $400.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    5. Time your search for November through February.
                  </span>{" "}
                  JC follows the same seasonal pattern as NYC. Winter
                  lease-ups have the biggest concessions; summer turnover
                  has the worst terms. Signing in December for a February
                  move-in often captures 1 to 2 months free at the best
                  Downtown and Newport towers.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    6. NJ income rule is ~3x monthly rent, not 40x annual.
                  </span>{" "}
                  Most NJ landlords use a gross monthly income rule of 2.5
                  to 3 times rent, which is meaningfully easier to hit
                  than NYC&apos;s 40x annual. A $3,500 apartment requires
                  roughly $8,750 to $10,500 monthly income = $105,000 to
                  $126,000 annually. Combined-income leases count.
                  Guarantors in NJ typically need to show 3x to 5x rent in
                  monthly income or assets.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    7. Document photos at move-in.
                  </span>{" "}
                  NJ security deposit disputes are won or lost on
                  photographs. Take dated photos of every room, appliance,
                  and wall surface at move-in and move-out. Send them to
                  yourself by email so the EXIF timestamp is preserved.
                  This evidence converts into double-damages claims in
                  small claims court if the landlord withholds unfairly.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    8. Verify JCPath versus broker listings.
                  </span>{" "}
                  Most JC luxury towers have in-house leasing offices and
                  don&apos;t charge broker fees. Older walkup stock
                  routinely uses brokers who charge 10 to 15% of annual
                  rent. Our{" "}
                  <Link
                    href="/"
                    className="text-primary underline underline-offset-2"
                  >
                    AI listing search
                  </Link>{" "}
                  filters out fee-heavy listings if you prefer no-fee
                  leases.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Compared to ──────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>JC vs. Similar Neighborhoods</CardTitle>
              <CardDescription>
                How JC compares on price, transit, and vibe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Financial District (FiDi)
                </h3>
                <p>
                  FiDi 1-bedrooms run $4,000 to $4,800 with similar luxury
                  tower amenities. Jersey City Downtown or Exchange Place
                  1BRs at $3,500 to $3,800 deliver the same commute to
                  your FiDi office (a 7-minute PATH ride from Grove is
                  often faster than walking 4 avenues in FiDi itself).
                  Pick JC for the $800 to $1,000 monthly discount. Pick
                  FiDi if you want to live walking distance to weekend
                  nightlife in Tribeca or SoHo.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Hoboken
                </h3>
                <p>
                  Hoboken 1BRs run $3,400 to $3,900. JC Downtown is at the
                  same price point with a similar PATH commute (both hit
                  WTC in under 15 minutes). Hoboken has a more contiguous
                  residential grid, Stevens Tech, and a dense bar scene.
                  JC Downtown has more new-construction luxury tower
                  options and a more diverse population. For a first-time
                  NJ renter from Manhattan, both work; JC tends to be
                  slightly more professional-heavy and Hoboken slightly
                  more post-college.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Long Island City
                </h3>
                <p>
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    LIC
                  </Link>{" "}
                  1-bedrooms run $3,200 to $3,800, similar to JC Downtown,
                  with Grand Central accessible in 6 minutes on the 7
                  train. LIC is the Midtown counterpart to JC&apos;s
                  Downtown — same luxury tower density, same price band,
                  opposite commute targets. Pick LIC if you work in
                  Midtown, pick JC if you work Downtown or on the
                  Manhattan waterfront.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Brooklyn Heights / DUMBO
                </h3>
                <p>
                  DUMBO and Brooklyn Heights 1-bedrooms run $4,000 to
                  $5,000 with 10- to 15-minute commutes to Lower
                  Manhattan. JC Downtown matches the commute at $500 to
                  $1,000 lower rent. DUMBO has better waterfront parks
                  and a stronger art/food scene; JC has newer tower stock
                  and higher amenity density. For families needing space,
                  JC&apos;s 2BR market is often better value than
                  comparable Brooklyn.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Upper Manhattan
                </h3>
                <p>
                  Washington Heights and Inwood 1-bedrooms at $1,800 to
                  $2,200 undercut all JC neighborhoods on price, but the
                  commute to Lower Manhattan is 40+ minutes on the A
                  express. Journal Square, The Heights, and
                  Bergen-Lafayette land at $2,500 to $3,000 with a faster
                  commute to Downtown via PATH. For renters working
                  Downtown, JC&apos;s cheaper neighborhoods beat Upper
                  Manhattan on commute-adjusted cost.
                </p>
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
                  How much is rent in Jersey City?
                </h3>
                <p>
                  The citywide median is roughly $3,400 across all available
                  units on Wade Me Home. Studios median $3,030, 1-bedrooms
                  $3,500, and 2-bedrooms $4,790. Downtown and Newport run
                  the highest; Greenville and The Heights run the lowest.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How fast is the PATH to Manhattan?
                </h3>
                <p>
                  Exchange Place to WTC: 4 min. Grove Street to WTC: 7 min.
                  Newport to 33rd Street: 13 min. Journal Square to 33rd
                  Street: 25 min. Peak-hour trains run every 3 to 5
                  minutes.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is Jersey City safe?
                </h3>
                <p>
                  Downtown, Newport, Exchange Place, and most of The
                  Heights are considered safe with active foot traffic and
                  24-hour doorman buildings. Bergen-Lafayette and
                  Greenville have higher reported crime rates than the
                  waterfront; check block-level context before signing.
                  Journal Square has improved significantly in the last
                  five years.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Do I pay a broker fee in JC?
                </h3>
                <p>
                  NJ doesn&apos;t have a broker-fee ban like NYC&apos;s
                  FARE Act. Luxury towers with in-house leasing offices
                  are typically no-fee. Walkups and older buildings
                  listed by brokers commonly charge 1 month or 15% of
                  annual rent. Always confirm move-in costs line-by-line.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is there rent control in Jersey City?
                </h3>
                <p>
                  Yes — for buildings with 5+ units built before 1987. The
                  increase cap is tied to CPI with a 4% ceiling. Luxury
                  new construction is exempt. Most of Downtown&apos;s
                  brownstone stock, The Heights mid-rises, and older
                  Bergen-Lafayette buildings may qualify. Ask for the
                  12-month prior rent history before signing.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How does JC compare to Hoboken for renters?
                </h3>
                <p>
                  Both have similar price points and similar PATH
                  commutes to Lower Manhattan. Hoboken is more contiguous
                  and post-college; JC Downtown has more new-construction
                  luxury stock and a more diverse resident base. JC has
                  seven sub-neighborhoods at different price points;
                  Hoboken is more uniform. For renters wanting more
                  variety across budget bands, JC tends to win.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Your Jersey City Apartment
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI what you&apos;re looking for and it will
                search 2,500+ Jersey City listings in seconds. Filter by
                PATH station, concessions, and amenities — all in natural
                language.
              </p>
              <Button asChild size="lg">
                <Link href="/?q=Jersey%20City%20apartments%20near%20PATH">
                  Start Searching Jersey City
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related Guides ────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/jersey-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Rent Prices: Zip-Code Breakdown &amp; Trend
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/downtown"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown Jersey City: Grove Street &amp; Waterfront Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/journal-square"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Apartments: Rent, PATH &amp; New Towers
                  </Link>
                </li>
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
                    href="/jersey-city/newport"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Jersey City: Waterfront Towers &amp; Family
                    Amenities
                  </Link>
                </li>
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
                    href="/jersey-city/downtown/apartments-under-3500"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown Jersey City Apartments Under $3,500
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
                    href="/bad-landlord-nj-ny"
                    className="text-primary underline underline-offset-2"
                  >
                    Bad Landlord Guide (NJ &amp; NY)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood: Comparison
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City: Midtown-Adjacent Alternative
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken: One-Mile Waterfront Alternative Across the Hudson
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken Rent Prices: Tower &amp; Sub-Area Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Best Time to Rent (NYC/NJ Metro)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cost-of-moving-to-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Cost of Moving to NYC Metro
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
