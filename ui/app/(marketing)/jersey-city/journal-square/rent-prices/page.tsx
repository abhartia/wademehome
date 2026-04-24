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
    "Journal Square Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Tower | Wade Me Home",
  description:
    "Journal Square, Jersey City rent prices for 2026 by unit size and tower. Journal Squared, 90 Columbus, 25 Senate Place, Hudson Exchange, and the new construction wave — with PATH to Manhattan times, discount vs Downtown JC, and net-effective rent math.",
  keywords: [
    "journal square rent prices",
    "journal square jersey city rent",
    "journal square apartments rent",
    "journal square rent",
    "07306 rent",
    "journal square studio rent",
    "journal square 1 bedroom rent",
    "journal square 2 bedroom rent",
    "journal squared rent",
    "90 columbus jersey city rent",
    "25 senate place rent",
    "hudson exchange rent",
    "journal square vs downtown jersey city rent",
    "journal square vs newport rent",
    "journal square path commute",
    "mcginley square rent",
    "the bristol jersey city rent",
  ],
  openGraph: {
    title:
      "Journal Square Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Tower",
    description:
      "Complete Journal Square rent price breakdown by tower, with PATH commute context, discount vs Downtown JC, and concession math.",
    url: `${baseUrl}/jersey-city/journal-square/rent-prices`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/jersey-city/journal-square/rent-prices`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Journal Square Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Tower",
    description:
      "2026 Journal Square, Jersey City rent prices by unit size and tower with PATH commute context, discount vs Downtown JC, and concession-adjusted net effective rent math.",
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
    mainEntityOfPage: `${baseUrl}/jersey-city/journal-square/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Journal Square in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Journal Square (07306) averages approximately $2,700 for a studio, $3,200 for a 1-bedroom, $4,400 for a 2-bedroom, and $5,800 for a 3-bedroom in 2026. This is roughly $500–$600/month cheaper than Downtown Jersey City and Newport. The new-construction wave since 2020 (Journal Squared, 90 Columbus, Hudson Exchange, 25 Senate Place) has expanded supply meaningfully while absorbing Manhattan-displaced demand.",
        },
      },
      {
        "@type": "Question",
        name: "How long is the PATH commute from Journal Square to Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Journal Square PATH to 33rd Street Midtown is approximately 25 minutes. Journal Square to World Trade Center is 13 minutes (direct on the JSQ-33rd line with a transfer at Exchange Place, or direct on the JSQ-WTC line during most hours). Trains run every 4–8 minutes during peak hours — a shade less frequent than Newport or Grove Street but still commutable.",
        },
      },
      {
        "@type": "Question",
        name: "Is Journal Square cheaper than Newport or Downtown Jersey City?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Journal Square runs roughly $500–$600/month cheaper than Newport (07310) and Downtown JC (07302) on comparable 1-bedrooms. The tradeoff is a 5–7 minute longer PATH commute to Midtown Manhattan (25 min vs 18 min from Newport, 22 min from Grove Street). If you work in Midtown, the commute difference is marginal. If you work at WTC, the difference is bigger (13 min from JSQ vs 4 min from Exchange Place).",
        },
      },
      {
        "@type": "Question",
        name: "What new buildings are in Journal Square?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Journal Square's post-2020 construction wave includes: Journal Squared (615 Pavonia Ave, 3-tower complex delivering 2017, 2021, 2024) — the largest cluster of new rental supply in JC; 90 Columbus (90 Christopher Columbus Dr, 2017) — first luxury tower of the cycle; 25 Senate Place (2020) — mid-sized boutique luxury; Hudson Exchange (250 10th Street, 2023) — newer mid-rise rentals; The Bristol (155 Christopher Columbus Dr, 2020). Most deliver 1-bedrooms in the $2,900–$3,500 range and 2-bedrooms in the $4,000–$5,000 range — all well below Newport and Downtown pricing.",
        },
      },
      {
        "@type": "Question",
        name: "What about Journal Square concessions and net-effective rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Journal Square offers some of the deepest concessions in the JC market because supply growth has outpaced demand growth in several recent quarters. In winter months it is common to see 2 months free on a 13-month lease at Journal Squared or Hudson Exchange on a $3,300 1-bedroom — net effective $2,792 (15.4% discount). Always ask for net-effective and gross quotes in writing, and model year-2 renewal at gross + 3–6%.",
        },
      },
      {
        "@type": "Question",
        name: "Is Journal Square safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Journal Square is a dense transit-oriented urban core. The immediate PATH plaza is well-lit and trafficked 18–20 hours a day. The surrounding blocks vary — McGinley Square (to the south) is quieter residential; the blocks west of Summit Ave have more nighttime activity. Newer buildings (Journal Squared towers, 90 Columbus, Hudson Exchange) all have 24-hour doormen and interior amenity spaces. Check the specific tower address and walk it during both day and evening hours before signing.",
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
        name: "Journal Square",
        item: `${baseUrl}/jersey-city/journal-square`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/jersey-city/journal-square/rent-prices`,
      },
    ],
  },
];

export default function JournalSquareRentPricesPage() {
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
              <Badge variant="outline">Journal Square</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">07306</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Journal Square Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR
              by Tower
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Journal Square, Jersey
              City (zip 07306) — by unit size and by specific new-construction
              tower (Journal Squared, 90 Columbus, 25 Senate Place, Hudson
              Exchange, The Bristol), with PATH commute context and discount
              math vs Newport and Downtown Jersey City. Companion reference
              to our full{" "}
              <Link
                href="/jersey-city/journal-square"
                className="text-primary underline underline-offset-2"
              >
                Journal Square guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Journal Square is the most
              supply-heavy JC zip code — deepest concessions, most negotiation
              leverage
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Journal Square Rent at a Glance (2026)</CardTitle>
              <CardDescription>Average asking rents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average Studio
                  </p>
                  <p className="text-lg font-semibold">$2,700</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$4,400</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$5,800</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Journal Square Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Range across the post-2017 new-construction wave
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
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">420–540</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">580–720</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                    <TableCell className="text-right">850–1,100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$7,500</TableCell>
                    <TableCell className="text-right">1,100–1,450</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low-end pricing reflects older pre-war mid-rise stock in
                McGinley Square and non-amenity buildings on Summit Avenue.
                High-end pricing reflects Journal Squared Tower III and
                Hudson Exchange premium corner units. The median is weighted
                toward the post-2017 new-construction towers — the segment
                that grew the most during the Journal Square construction
                wave.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Journal Square Rent Prices by Tower</CardTitle>
              <CardDescription>
                Tower-by-tower price breakdown with year delivered
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
                      Journal Squared I (615 Pavonia)
                    </TableCell>
                    <TableCell className="text-right">$2,750</TableCell>
                    <TableCell className="text-right">$3,250</TableCell>
                    <TableCell className="text-right">$4,450</TableCell>
                    <TableCell className="text-right">2017</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Journal Squared II
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,550</TableCell>
                    <TableCell className="text-right">2021</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Journal Squared III
                    </TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell className="text-right">2024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      90 Columbus (90 Christopher Columbus Dr)
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">2017</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      25 Senate Place
                    </TableCell>
                    <TableCell className="text-right">$2,650</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">2020</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hudson Exchange (250 10th St)
                    </TableCell>
                    <TableCell className="text-right">$2,850</TableCell>
                    <TableCell className="text-right">$3,350</TableCell>
                    <TableCell className="text-right">$4,550</TableCell>
                    <TableCell className="text-right">2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      The Bristol (155 Christopher Columbus Dr)
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,150</TableCell>
                    <TableCell className="text-right">$4,350</TableCell>
                    <TableCell className="text-right">2020</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Journal Squared (615 Pavonia Avenue)
                </h3>
                <p>
                  The flagship Journal Square development — three towers
                  delivering 2017, 2021, and 2024. Each tower has
                  progressively better amenities (newest cohort has coworking,
                  outdoor pool, pet spa, and roof terraces with Manhattan
                  views). Direct passage to the Journal Square
                  Transportation Center PATH plaza through an interior
                  connector — genuinely weather-proof commute access.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  90 Columbus
                </h3>
                <p>
                  The first new-construction tower of the modern Journal
                  Square cycle. Studios from $2,700, 1-bedrooms from $3,200.
                  Full amenities, walk to PATH under 5 minutes. Tends to
                  offer strong concessions because the 2017 vintage now
                  competes with newer 2024 supply at Journal Squared III.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  25 Senate Place &amp; The Bristol
                </h3>
                <p>
                  Value picks within Journal Square. 25 Senate is a boutique
                  luxury tower (Studios from $2,650, 1BRs from $3,100) with
                  slightly smaller amenity set but well-maintained. The
                  Bristol sits one block further from PATH but has larger
                  floorplates on 1- and 2-bedrooms.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Hudson Exchange
                </h3>
                <p>
                  Newer (2023) mid-rise stock at 250 10th Street. Studios
                  from $2,850, 1-bedrooms from $3,350. Walk to PATH is 8–10
                  minutes — slightly further than Journal Squared or 90
                  Columbus but offset by newer building quality and
                  amenities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Journal Square Discount vs. Newport &amp; Downtown JC
              </CardTitle>
              <CardDescription>
                What you save for the extra PATH minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comparison</TableHead>
                    <TableHead className="text-right">Journal Sq</TableHead>
                    <TableHead className="text-right">Newport</TableHead>
                    <TableHead className="text-right">Downtown JC</TableHead>
                    <TableHead className="text-right">JSQ Discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Studio median
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$3,250</TableCell>
                    <TableCell className="text-right">−$550</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1BR median</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">−$575</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2BR median</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">$5,100</TableCell>
                    <TableCell className="text-right">$5,300</TableCell>
                    <TableCell className="text-right">−$800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      PATH to 33rd St
                    </TableCell>
                    <TableCell className="text-right">25 min</TableCell>
                    <TableCell className="text-right">18 min</TableCell>
                    <TableCell className="text-right">22 min</TableCell>
                    <TableCell className="text-right">+7 / +3 min</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                The Journal Square 1-bedroom discount is roughly $575/month
                vs. Newport, or $6,900/year. You pay for that in 7 extra
                commute minutes to 33rd Street (round-trip: 14 min/day × 220
                workdays = 51 hours/year). That prices commute time at
                roughly $135/hour — well above most renters&apos; hourly
                wage, which makes Journal Square a strong value play for
                most Manhattan-bound commuters.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent in Journal Square</CardTitle>
              <CardDescription>
                The concession-heavy corner of the Jersey City market
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
                    <TableCell className="font-medium">$3,200</TableCell>
                    <TableCell>1 mo (12-mo)</TableCell>
                    <TableCell className="text-right">$2,933</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,200</TableCell>
                    <TableCell>2 mo (13-mo)</TableCell>
                    <TableCell className="text-right">$2,708</TableCell>
                    <TableCell className="text-right">15.4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,400 (JSQ III)</TableCell>
                    <TableCell>1 mo (12-mo)</TableCell>
                    <TableCell className="text-right">$3,117</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,400 (JSQ III)</TableCell>
                    <TableCell>2 mo (13-mo)</TableCell>
                    <TableCell className="text-right">$2,877</TableCell>
                    <TableCell className="text-right">15.4%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Journal Square concessions have been the deepest in the JC
                market since 2023, when Journal Squared III and Hudson
                Exchange delivered simultaneously. Historical norm: 1 month
                free on a 12-month lease in peak season (April–July), 2
                months free on a 13-month lease in November–February. The
                2026 spring cycle may see concessions shrink given the
                +34% YoY demand surge — start your search 2–3 weeks earlier
                than you would have in 2024 or 2025.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search Journal Square Apartments Under Your Budget
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget, unit size, and tower preferences — our
                AI will surface Journal Square, Jersey City inventory
                matching your rent cap across Journal Squared, 90 Columbus,
                25 Senate Place, Hudson Exchange, and The Bristol.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Journal Square &amp; JC Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/jersey-city/journal-square"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square: Full Neighborhood Guide
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
                    href="/jersey-city/newport/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Rent Prices Breakdown
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
                <li>
                  <Link
                    href="/blog/negotiating-rent-and-lease-terms"
                    className="text-primary underline underline-offset-2"
                  >
                    Negotiating Rent &amp; Lease Terms
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
