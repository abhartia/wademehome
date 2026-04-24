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
    "Newport Jersey City Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Tower | Wade Me Home",
  description:
    "Newport Jersey City rent prices for 2026 by unit size and tower. Newport Tower, 70 Greene, Portofino, The Avenue Collection, James Monroe, Crystal Point, and Aquablu — with PATH to Manhattan times, net-effective rent math, and comparison to Downtown JC and Midtown Manhattan.",
  keywords: [
    "newport jersey city rent prices",
    "newport rent",
    "newport jc rent",
    "newport apartments rent",
    "newport tower jersey city rent",
    "07310 rent",
    "newport studio rent",
    "newport 1 bedroom rent",
    "newport 2 bedroom rent",
    "newport 3 bedroom rent",
    "newport waterfront rent",
    "70 greene street jersey city rent",
    "portofino jersey city rent",
    "james monroe newport rent",
    "aquablu newport rent",
    "newport pavonia jersey city",
    "newport vs downtown jersey city rent",
    "newport vs manhattan rent",
    "newport path commute",
    "newport net effective rent",
  ],
  openGraph: {
    title:
      "Newport Jersey City Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Tower",
    description:
      "Complete Newport Jersey City rent price breakdown by tower, with PATH commute context, net-effective rent math, and comparison to Downtown JC and Midtown.",
    url: `${baseUrl}/jersey-city/newport/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/jersey-city/newport/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Newport Jersey City Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Tower",
    description:
      "2026 Newport Jersey City rent prices by unit size and tower, with PATH commute context, historical rent trends, and concession-adjusted net effective rent math.",
    datePublished: "2026-04-23",
    dateModified: "2026-04-23",
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
    mainEntityOfPage: `${baseUrl}/jersey-city/newport/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Newport, Jersey City in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Newport (07310) averages approximately $3,300 for a studio, $3,750 for a 1-bedroom, $5,100 for a 2-bedroom, and $7,000 for a 3-bedroom in 2026. Newport is the most expensive JC zip code alongside Downtown (07302), reflecting the waterfront doorman tower supply (Newport Tower, 70 Greene, Portofino, James Monroe, Crystal Point, Aquablu).",
        },
      },
      {
        "@type": "Question",
        name: "How long is the PATH commute from Newport to Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Newport PATH to 33rd Street Midtown is approximately 18 minutes. Newport to World Trade Center is 9 minutes (transfer at Exchange Place). Peak-hour trains run every 3–5 minutes. Newport sits on the Hoboken-WTC line and the Journal Square-33rd Street line with reliable headways in both directions.",
        },
      },
      {
        "@type": "Question",
        name: "Is Newport cheaper than Downtown Jersey City?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Newport and Downtown Jersey City are roughly equivalent in price — within $50–$100/month on comparable 1-bedrooms. Downtown (07302) has a wider price distribution because it includes pre-war brownstones and older mid-rise stock alongside waterfront luxury. Newport (07310) is almost entirely 1990s–2020s doorman high-rise, so the price distribution is tighter. If you want brownstone charm at a lower monthly cost, look at Downtown interior blocks. If you want a full-amenity tower with marina and mall, Newport is the cleaner pick.",
        },
      },
      {
        "@type": "Question",
        name: "What are the biggest rental towers in Newport?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Newport's core rental inventory includes: Newport Tower (550 Washington Blvd, 1986) — the waterfront anchor with marina views; 70 Greene (2004) — large floorplates and full amenities; Portofino (1 2nd Street, 2003) — family-friendly with large 2BRs; The James Monroe (1 James Monroe Dr, 2004) — budget-friendly within Newport; Crystal Point (2 2nd Street, 2010) — waterfront views north; Aquablu (225 2nd Street, 2017) — newest Newport tower with updated amenities. Prices run from $3,500 (James Monroe 1BR) to $4,500+ (Aquablu 1BR).",
        },
      },
      {
        "@type": "Question",
        name: "How much do I save renting Newport vs Midtown Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Newport 1-bedroom at $3,750 rents for $4,500–$5,000 in Midtown East and $4,800–$5,500 in Murray Hill for comparable amenity-building stock. That is $750–$1,250/month in savings, or $9,000–$15,000/year. The PATH commute to 33rd Street (18 min) is comparable to many Midtown East subway rides. The trade-off is a second transit fare if you want MTA subway access on top of PATH ($30–$60/month effective cross-system cost).",
        },
      },
      {
        "@type": "Question",
        name: "What about Newport concessions and net effective rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Newport towers compete aggressively on concessions during November–February. Common offers: 1 month free on a 12-month lease on a $3,800 1-bedroom — net effective $3,483 (8.3% discount). 2 months free on a 13-month lease is not unusual — net effective $3,215 (15.4% discount). Always ask the leasing office to quote both the gross and net-effective rent in writing, and compare year-two renewal terms — gross rent resets higher at renewal.",
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Newport",
        item: `${baseUrl}/jersey-city/newport`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/jersey-city/newport/rent-prices`,
      },
    ],
  },
];

export default function NewportRentPricesPage() {
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
              <Badge variant="outline">Newport</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">07310</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Newport Jersey City Rent Prices (2026): Studio, 1BR, 2BR &amp;
              3BR by Tower
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Newport, Jersey City
              (zip 07310) — by unit size and by specific waterfront tower
              (Newport Tower, 70 Greene, Portofino, James Monroe, Crystal
              Point, Aquablu), with PATH commute context, net-effective
              rent math, and comparison to Downtown JC and Midtown
              Manhattan. Companion reference to our full{" "}
              <Link
                href="/jersey-city/newport"
                className="text-primary underline underline-offset-2"
              >
                Newport neighborhood guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Newport is one of the two
              peak-price Jersey City zip codes alongside Downtown JC (07302)
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Newport Rent at a Glance (2026)</CardTitle>
              <CardDescription>Average asking rents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average Studio
                  </p>
                  <p className="text-lg font-semibold">$3,300</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,750</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$5,100</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$7,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Newport Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range across the Newport tower lineup
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
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">480–600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">650–820</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">$5,100</TableCell>
                    <TableCell className="text-right">$6,700</TableCell>
                    <TableCell className="text-right">950–1,250</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$5,900</TableCell>
                    <TableCell className="text-right">$7,000</TableCell>
                    <TableCell className="text-right">$9,500</TableCell>
                    <TableCell className="text-right">1,200–1,600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Newport rent distribution is tighter than Downtown JC because
                the stock is almost entirely 1990s–2020s doorman high-rise.
                The low end reflects James Monroe and older Newport Tower
                inventory; the high end reflects Aquablu (2017) and waterfront
                corner units at Portofino and Crystal Point.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Newport Rent Prices by Tower</CardTitle>
              <CardDescription>
                Tower-by-tower price breakdown with year built
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tower</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1BR</TableHead>
                    <TableHead className="text-right">2BR</TableHead>
                    <TableHead className="text-right">Built</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Newport Tower (550 Washington)
                    </TableCell>
                    <TableCell className="text-right">$3,250</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$5,050</TableCell>
                    <TableCell className="text-right">1986</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      70 Greene Street
                    </TableCell>
                    <TableCell className="text-right">$3,350</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">2004</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Portofino (1 2nd St)
                    </TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">$5,400</TableCell>
                    <TableCell className="text-right">2003</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      James Monroe (1 James Monroe Dr)
                    </TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell className="text-right">2004</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Crystal Point (2 2nd St)
                    </TableCell>
                    <TableCell className="text-right">$3,450</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">$5,300</TableCell>
                    <TableCell className="text-right">2010</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Aquablu (225 2nd St)
                    </TableCell>
                    <TableCell className="text-right">$3,550</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">$5,600</TableCell>
                    <TableCell className="text-right">2017</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Newport Tower (550 Washington Boulevard)
                </h3>
                <p>
                  The original Newport tower — the 1986 waterfront anchor
                  with marina frontage and direct Newport Mall access via
                  the overpass. Older interiors but large floorplates.
                  Studios from $3,100, 1BRs $3,700, 2BRs $5,050. Renovated
                  units rent toward the top of the Newport Tower range.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  70 Greene Street &amp; Portofino
                </h3>
                <p>
                  Mid-2000s vintage with the largest floorplates in Newport.
                  Portofino in particular has family-sized 2- and
                  3-bedrooms that trade at a premium to comparable Newport
                  Tower units. Full amenity packages: doorman, gym, pool,
                  playrooms, outdoor terraces.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  The James Monroe
                </h3>
                <p>
                  The value pick in Newport. 2004 vintage, smaller
                  floorplates, less waterfront-centric. Studios from
                  $2,900, 1BRs from $3,400. If your priority is Newport
                  access at the lowest monthly cost, James Monroe is the
                  cleanest entry point.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Crystal Point &amp; Aquablu
                </h3>
                <p>
                  The newest Newport rentals. Crystal Point (2010) has
                  northward Hudson views and a strong amenity deck.
                  Aquablu (2017) is the most recent and carries the highest
                  rents in Newport — Studios $3,550, 1BRs $4,100+. Amenities
                  include rooftop pool, coworking, and pet spa.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Newport PATH Commute &amp; Rent-for-Time Math
              </CardTitle>
              <CardDescription>
                What your Newport 1BR buys in Manhattan-equivalent commute
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead className="text-right">Door-to-door</TableHead>
                    <TableHead className="text-right">Subway equiv. time</TableHead>
                    <TableHead className="text-right">Newport 1BR equiv. subway hood</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      World Trade Center
                    </TableCell>
                    <TableCell className="text-right">13 min</TableCell>
                    <TableCell className="text-right">15–20 min</TableCell>
                    <TableCell className="text-right">FiDi 1BR $4,400+</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      33rd St / Herald Square
                    </TableCell>
                    <TableCell className="text-right">22 min</TableCell>
                    <TableCell className="text-right">25–30 min</TableCell>
                    <TableCell className="text-right">Midtown East 1BR $4,500+</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Union Square / 14th St
                    </TableCell>
                    <TableCell className="text-right">26 min</TableCell>
                    <TableCell className="text-right">30–35 min</TableCell>
                    <TableCell className="text-right">UES 1BR $4,100+</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Grand Central (via transfer)
                    </TableCell>
                    <TableCell className="text-right">32 min</TableCell>
                    <TableCell className="text-right">30–35 min</TableCell>
                    <TableCell className="text-right">Murray Hill 1BR $4,200+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                A Newport 1-bedroom at $3,750 with a 13-min door-to-door
                WTC commute competes with FiDi 1-bedrooms at $4,400+ on a
                commute-quality-adjusted basis. The savings is $650/month,
                $7,800/year. The catch: PATH does not cover the MTA, so
                add a $132/month MTA pass if you also need subway access
                for non-work travel.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent in Newport</CardTitle>
              <CardDescription>
                Newport-specific concession math for 2026
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gross Rent</TableHead>
                    <TableHead>Free Months</TableHead>
                    <TableHead className="text-right">Net Effective</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">$3,800</TableCell>
                    <TableCell>1 mo (12-mo lease)</TableCell>
                    <TableCell className="text-right">$3,483</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,800</TableCell>
                    <TableCell>2 mo (13-mo lease)</TableCell>
                    <TableCell className="text-right">$3,215</TableCell>
                    <TableCell className="text-right">15.4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$4,100 (Aquablu)</TableCell>
                    <TableCell>1 mo (12-mo)</TableCell>
                    <TableCell className="text-right">$3,758</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$4,100 (Aquablu)</TableCell>
                    <TableCell>2 mo (13-mo)</TableCell>
                    <TableCell className="text-right">$3,469</TableCell>
                    <TableCell className="text-right">15.4%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Concessions in Newport are deepest in November–February.
                Spring 2026 leasing (April–June) will likely see fewer
                concessions given the +34% YoY demand signal Google Trends
                is flashing — plan to move fast on listings you like.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search Newport Apartments Under Your Budget
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget, unit size, and tower preferences — our
                AI will surface Newport, Jersey City inventory matching
                your rent cap across Newport Tower, 70 Greene, Portofino,
                James Monroe, Crystal Point, and Aquablu.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Newport &amp; JC Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/jersey-city/newport"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Jersey City: Full Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Rent Prices (All Zip Codes)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/journal-square/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Rent Prices Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/downtown"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown Jersey City Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Best Time to Rent in NYC &amp; Jersey City
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bad-landlord-nj-ny"
                    className="text-primary underline underline-offset-2"
                  >
                    NJ vs NY Landlord Protections
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
