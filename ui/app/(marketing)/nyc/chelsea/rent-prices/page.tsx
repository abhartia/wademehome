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
    "Chelsea Rent Prices NYC (2026): Studio, 1BR, 2BR & 3BR by Sub-Area & Building Type | Wade Me Home",
  description:
    "Chelsea Manhattan rent prices for 2026 by unit size, sub-area (Hudson Yards / West Chelsea, Core, North Chelsea, South / Meatpacking, Penn South), and building type (luxury new-con, pre-war doorman, walkup). High Line premium, Hudson Yards tower tier, Penn South limited-equity context, and 6-year rent trend.",
  keywords: [
    "chelsea rent prices",
    "chelsea nyc rent",
    "chelsea rent prices 2026",
    "chelsea studio rent",
    "chelsea 1 bedroom rent",
    "chelsea 2 bedroom rent",
    "chelsea 3 bedroom rent",
    "average rent chelsea",
    "west chelsea rent",
    "hudson yards rent",
    "high line rent",
    "north chelsea rent",
    "south chelsea rent",
    "meatpacking district rent",
    "penn south rent",
    "ruby chelsea apartments",
    "the chelsea apartments",
    "chelsea luxury apartments",
    "chelsea pre-war rent",
    "chelsea doorman rent",
    "chelsea walkup rent",
    "chelsea net effective rent",
  ],
  openGraph: {
    title:
      "Chelsea Rent Prices NYC (2026): Studio, 1BR, 2BR & 3BR by Sub-Area & Building Type",
    description:
      "Complete Chelsea rent breakdown by unit size, sub-area, and building type, with Hudson Yards tower tier, High Line premium, Penn South context, and 6-year trend.",
    url: `${baseUrl}/nyc/chelsea/rent-prices`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/nyc/chelsea/rent-prices`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Chelsea Rent Prices NYC (2026): Studio, 1BR, 2BR & 3BR by Sub-Area & Building Type",
    description:
      "2026 Chelsea Manhattan rent prices by unit size, sub-area, building type, with Hudson Yards tower tier, Penn South limited-equity context, and 6-year trend.",
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
    mainEntityOfPage: `${baseUrl}/nyc/chelsea/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Chelsea Manhattan in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 2026 Chelsea averages are approximately $3,100 for a studio, $4,300 for a 1-bedroom, $5,800 for a 2-bedroom, and $7,800 for a 3-bedroom. West Chelsea and Hudson Yards new-construction towers (15 Hudson Yards, 35 Hudson Yards rentals, 555 Tenth, the Lantern House) routinely list 1-bedrooms at $5,400+ — well above this median. Pre-war walkups in North Chelsea (24th–30th Streets, 7th to 9th Avenues) run $3,500–$4,000 1BR, the value tier.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to live in Hudson Yards?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hudson Yards rentals (15 Hudson Yards, 35 Hudson Yards, the Lantern House at 515 W 18th, 555 Tenth, and the Eugene at 435 W 31st) list 2026 1-bedrooms at $5,200–$7,000 and 2-bedrooms at $7,500–$11,000. Studios in this tier run $4,200–$5,200. Concessions of 1–2 months free are common on initial 12-month leases, dropping net-effective 1-bedroom rent to roughly $4,800–$6,400. Hudson Yards rentals share the High Line, Hudson River Park, the 7 train at 34th-Hudson Yards, and the malls/restaurants at Hudson Yards proper.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the cheapest part of Chelsea?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "North Chelsea pre-war walkup stock — roughly 23rd–30th Streets, 7th to 9th Avenues — has the cheapest Chelsea rent. 1-bedrooms in 5-story walkups run $3,500–$4,000, vs. $4,300 Chelsea median. The trade-offs: no doorman, no gym, walk-up access, smaller landlords. The other deep-value option is Penn South, the limited-equity housing co-op at 24th–29th Streets and 8th–9th Avenues — but Penn South availability is restricted to qualified tenants and rarely lists openly.",
        },
      },
      {
        "@type": "Question",
        name: "What is the High Line premium?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Buildings with direct High Line frontage (the Standard, the Lantern House, 511 West 18th, the Daniel Libeskind 36 W 18th tower, and the new towers along 18th–19th Streets between 10th and 11th Avenues) command roughly $300–$700/month above equivalent stock one block east. A 1-bedroom in a Lantern House at $5,400 vs. an equivalent floorplate at 7th Avenue at $4,700 — the $700 spread is the High Line premium. The premium scales with view clarity and height; ground-floor units capture less of the premium than 8th-floor and above.",
        },
      },
      {
        "@type": "Question",
        name: "How has Chelsea rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chelsea 1-bedroom median rent dropped to approximately $3,400 during 2020 COVID, then climbed: ~6% in 2022, ~7% in 2023, ~3% in 2024, and ~3% annually since. Hudson Yards stock specifically followed a steeper recovery — concessions of 3 months free in 2020 disappeared by 2023. Peak-to-peak 2020–2026 is approximately +26% for the Chelsea median, +35% for Hudson Yards new-con. Google Trends shows Chelsea search demand up 38.6% year-over-year through April 2026, suggesting continued upward pressure.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments in Chelsea?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Chelsea has a substantial concentration of rent-stabilized stock. Buildings built before 1974 with 6+ units are typically stabilized; this describes most 6-story pre-war walkups and pre-war elevator buildings on 8th, 9th, and 7th Avenues between 14th and 30th Streets. New-construction Hudson Yards towers are NOT stabilized (not built pre-1974). 2026 RGB renewal caps are 3.0% (1-yr) / 4.5% (2-yr). Always ask the landlord for DHCR rent registration history.",
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
        name: "Chelsea",
        item: `${baseUrl}/nyc/chelsea`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/chelsea/rent-prices`,
      },
    ],
  },
];

export default function ChelseaRentPricesPage() {
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
              <Badge variant="outline">Chelsea</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">+38.6% YoY demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chelsea Rent Prices NYC (2026): Studio, 1BR, 2BR &amp; 3BR by
              Sub-Area &amp; Building Type
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Chelsea Manhattan — by
              unit size, by sub-area (Hudson Yards / West Chelsea, Core,
              North Chelsea, South / Meatpacking edge, Penn South), and by
              building type (luxury new-con, pre-war doorman, pre-war
              walkup). Includes the High Line premium, Hudson Yards tower
              tier, Penn South limited-equity context, 6-year trend, and
              net-effective rent math. Companion to our full{" "}
              <Link
                href="/nyc/chelsea"
                className="text-primary underline underline-offset-2"
              >
                Chelsea apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Chelsea search demand is up
              38.6% YoY — tied with Harlem for the biggest Manhattan signal
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Chelsea Rent at a Glance (2026)</CardTitle>
              <CardDescription>Average asking rents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average Studio
                  </p>
                  <p className="text-lg font-semibold">$3,100</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$4,300</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$5,800</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$7,800</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chelsea Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                From North Chelsea walkup studios to Hudson Yards 3-bedroom
                rentals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Type</TableHead>
                    <TableHead className="text-right">Low</TableHead>
                    <TableHead className="text-right">Median</TableHead>
                    <TableHead className="text-right">High</TableHead>
                    <TableHead className="text-right">Typical Sq Ft</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">400–600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">$7,000</TableCell>
                    <TableCell className="text-right">600–900</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$11,000</TableCell>
                    <TableCell className="text-right">900–1,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$6,000</TableCell>
                    <TableCell className="text-right">$7,800</TableCell>
                    <TableCell className="text-right">$15,000</TableCell>
                    <TableCell className="text-right">1,200–1,900</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom</TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                    <TableCell className="text-right">$11,500</TableCell>
                    <TableCell className="text-right">$25,000+</TableCell>
                    <TableCell className="text-right">1,700+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low-end pricing reflects North Chelsea pre-war walkup stock
                (no doorman, no elevator). High-end pricing reflects the
                Hudson Yards super-luxury rental tier (15 Hudson Yards, 35
                Hudson Yards, the Lantern House, 555 Tenth) with full
                amenity packages and Hudson River views.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chelsea Rent Prices by Sub-Area</CardTitle>
              <CardDescription>
                Sub-area placement drives Chelsea pricing — the
                14th–30th-Street, 6th–11th-Avenue grid sorts into 5 tiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Area</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hudson Yards / West Chelsea
                    </TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,400</TableCell>
                    <TableCell className="text-right">$7,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Core Chelsea (18th–25th, 6th–8th Ave)
                    </TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      North Chelsea (25th–30th)
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      South Chelsea / Meatpacking edge (14th–18th)
                    </TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Penn South (limited-equity)
                    </TableCell>
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Hudson Yards / West Chelsea
                </h3>
                <p>
                  The luxury new-construction tier. From 10th Avenue west to
                  the river, 14th to 34th Streets. Hudson Yards proper is
                  10th–11th Avenue, 30th–34th. West Chelsea / High Line
                  corridor is 18th–25th. Buildings include 15 Hudson Yards,
                  35 Hudson Yards rentals, the Lantern House, 555 Tenth,
                  the Standard residences, and the Daniel Libeskind 36 W
                  18th tower. 7 train at 34th-Hudson Yards is the workhorse.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Core Chelsea (18th–25th, 6th–8th Avenue)
                </h3>
                <p>
                  The historic Chelsea heartland. Mix of pre-war doorman
                  buildings on 8th Avenue (London Terrace), pre-war walkups
                  on 21st–24th, and post-war mid-rise on 23rd. Chelsea
                  Market on 9th and 15th. 1/C/E/F/M trains. Densest rental
                  inventory. 1-bedrooms run $4,100 median.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  North Chelsea (25th–30th)
                </h3>
                <p>
                  The value tier. Pre-war walkups on 25th–30th Streets, 7th
                  to 9th Avenues — the classic 5-story Chelsea walkup
                  building. Studios from $2,800, 1-bedrooms from $3,500. No
                  doorman, no elevator, but central Chelsea location with 1
                  / C/E at 23rd and 28th.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  South Chelsea / Meatpacking edge (14th–18th)
                </h3>
                <p>
                  The premium tier outside Hudson Yards. 14th to 18th
                  Streets, with the Meatpacking District overlap on 14th
                  Street. Standard High Line, the Wythe-style luxury
                  buildings on Washington Street. 1-bedrooms run $4,800
                  median. 1/A/C/E at 14th-8th Av, L at 14th-8th Av.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Penn South (limited-equity housing co-op)
                </h3>
                <p>
                  The Mutual Redevelopment Houses, a limited-equity
                  affordable co-op spanning 23rd–29th Streets, 8th to 9th
                  Avenues. Built 1962, ~2,800 apartments. Income-restricted
                  membership; resale at restricted prices. Rare market
                  rentals via subletting are roughly $1,900 studio /
                  $2,800 1BR / $3,800 2BR — well below market — but
                  qualifying is restricted and inventory is rare.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chelsea Rent Prices by Building Type</CardTitle>
              <CardDescription>
                The walkup vs. doorman vs. Hudson-Yards-tower spread
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building Type</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                    <TableHead className="text-right">$/sq ft / yr</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-war walkup (5-story)
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell className="text-right">$80–95</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-war doorman elevator
                    </TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$78–92</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Post-war doorman
                    </TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$6,200</TableCell>
                    <TableCell className="text-right">$82–95</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      New construction (post-2015)
                    </TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,400</TableCell>
                    <TableCell className="text-right">$7,500</TableCell>
                    <TableCell className="text-right">$98–125</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hudson Yards super-luxury
                    </TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">$9,500</TableCell>
                    <TableCell className="text-right">$120–155</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                $/sq ft annually shows the gap is bigger than headline rent
                suggests — Hudson Yards super-luxury at ~$140/sq ft/yr is
                70% over pre-war walkup at ~$85/sq ft/yr for the same square
                feet. The headline $5,400 vs. $3,800 1-bedroom is partly
                quality, partly more square footage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hudson Yards Tower Rent Tier (2026)</CardTitle>
              <CardDescription>
                Tower-by-tower 1-bedroom asking rent for the major Hudson
                Yards / West Chelsea rental buildings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">1BR Range</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      The Lantern House (515 W 18th)
                    </TableCell>
                    <TableCell>2021</TableCell>
                    <TableCell className="text-right">
                      $5,200–$7,000
                    </TableCell>
                    <TableCell>High Line frontage, Heatherwick</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      555TEN (555 10th Ave)
                    </TableCell>
                    <TableCell>2017</TableCell>
                    <TableCell className="text-right">
                      $4,800–$6,200
                    </TableCell>
                    <TableCell>Hudson Yards south, full amenity</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      The Eugene (435 W 31st)
                    </TableCell>
                    <TableCell>2017</TableCell>
                    <TableCell className="text-right">
                      $4,600–$6,000
                    </TableCell>
                    <TableCell>62 floors, 7 train at 34th HY</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      35 Hudson Yards
                    </TableCell>
                    <TableCell>2019</TableCell>
                    <TableCell className="text-right">
                      $5,800–$8,500
                    </TableCell>
                    <TableCell>
                      Equinox Hotel building, mixed condo + rental
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      One Manhattan West (401 9th Ave)
                    </TableCell>
                    <TableCell>2019</TableCell>
                    <TableCell className="text-right">
                      $4,800–$6,500
                    </TableCell>
                    <TableCell>
                      Brookfield Manhattan West, Penn Station adjacent
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      The Henry (610 W 27th)
                    </TableCell>
                    <TableCell>2018</TableCell>
                    <TableCell className="text-right">
                      $4,400–$5,600
                    </TableCell>
                    <TableCell>Kohn Pedersen Fox, full amenity</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Concessions of 1–2 months free are common at lease-up and
                during winter slow periods (Nov–Feb). A $5,400 1BR with 2
                months free has a net effective rent of ~$4,500 — closer to
                Core Chelsea pre-war doorman pricing than the headline
                suggests.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6-Year Chelsea Rent Trend (2020–2026)</CardTitle>
              <CardDescription>
                Sharp COVID dip, fast recovery led by Hudson Yards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                    <TableHead className="text-right">YoY Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2020</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">−14%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,650</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">+6%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$2,850</TableCell>
                    <TableCell className="text-right">$3,850</TableCell>
                    <TableCell className="text-right">$5,150</TableCell>
                    <TableCell className="text-right">+7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$2,950</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                    <TableCell className="text-right">+7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$5,650</TableCell>
                    <TableCell className="text-right">+3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,050</TableCell>
                    <TableCell className="text-right">$4,250</TableCell>
                    <TableCell className="text-right">$5,750</TableCell>
                    <TableCell className="text-right">+2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Peak-to-peak 2020–2026: studios +24%, 1-bedrooms +26%,
                2-bedrooms +29%. Chelsea&apos;s sharp COVID drop was steeper
                than uptown Manhattan (−14% vs. −4% in Harlem) because
                luxury new-con pricing is more cyclical. Hudson Yards
                specifically had 3 months free in 2020 — those concessions
                are gone now.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Chelsea apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your unit size, your sub-area preference
                (Hudson Yards, Core, North, South / Meatpacking, Penn
                South), and your budget — we&apos;ll surface matching live
                inventory.
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
                    href="/nyc/chelsea"
                    className="text-primary underline underline-offset-2"
                  >
                    Full Chelsea Apartment Guide
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
                    href="/nyc/chelsea/apartments-under-4000"
                    className="text-primary underline underline-offset-2"
                  >
                    Chelsea Apartments Under $4,000
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
                    href="/nyc/upper-west-side/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Upper West Side Rent Prices
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
