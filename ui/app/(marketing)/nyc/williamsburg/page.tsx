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
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Williamsburg Apartments: Rent Prices, Transit & Tips (2026) | Wade Me Home",
  description:
    "Complete guide to renting in Williamsburg, Brooklyn. Average rent prices by unit size, L train and subway access, best streets for renters, lease tips, and how to find deals in NYC's most popular Brooklyn neighborhood.",
  keywords: [
    "Williamsburg apartments",
    "Williamsburg Brooklyn rent",
    "Williamsburg apartment hunting",
    "moving to Williamsburg NYC",
    "Williamsburg rent prices 2026",
    "Williamsburg Brooklyn rentals",
    "apartments near Bedford Avenue",
    "Williamsburg studios for rent",
    "Williamsburg 1 bedroom rent",
    "affordable Williamsburg apartments",
    "South Williamsburg apartments",
    "North Williamsburg apartments",
  ],
  openGraph: {
    title: "Williamsburg Apartments: Rent Prices, Transit & Tips (2026)",
    description:
      "Average rent prices, subway access, best streets, and tips for finding an apartment in Williamsburg, Brooklyn.",
    url: `${baseUrl}/nyc/williamsburg`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/williamsburg` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Williamsburg Apartments: Rent Prices, Transit & Tips for 2026",
    description:
      "A comprehensive guide to renting an apartment in Williamsburg, Brooklyn — covering average rent prices, L train and subway access, neighborhood character, and practical tips for apartment hunters.",
    datePublished: "2026-04-14",
    dateModified: "2026-04-14",
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
    mainEntityOfPage: `${baseUrl}/nyc/williamsburg`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Williamsburg, Brooklyn?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, the median asking rent for a one-bedroom apartment in Williamsburg is approximately $3,000 to $3,800 per month. Studios typically range from $2,400 to $3,000, while two-bedrooms cost $3,800 to $5,000. North Williamsburg near the waterfront tends to be the most expensive, while South Williamsburg and areas east of the BQE are more affordable.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve Williamsburg?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The L train is Williamsburg's primary subway line, with stations at Bedford Avenue, Lorimer Street, and Graham Avenue. The Bedford Avenue station is one of the busiest in Brooklyn and connects to Manhattan's 14th Street corridor in about 5 minutes. The G train stops at Metropolitan Avenue-Lorimer Street, connecting to Greenpoint, Fort Greene, and Downtown Brooklyn without going through Manhattan. The J, M, and Z trains serve the southern edge of Williamsburg at Marcy Avenue and Hewes Street.",
        },
      },
      {
        "@type": "Question",
        name: "Is Williamsburg a good neighborhood for young professionals?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Williamsburg is one of the most popular Brooklyn neighborhoods for professionals in their mid-20s to mid-30s. It offers a high concentration of restaurants, bars, coffee shops, boutiques, and cultural venues. The waterfront parks along the East River provide green space with Manhattan skyline views. The main trade-off is cost — Williamsburg is now one of the most expensive neighborhoods in Brooklyn, rivaling parts of Manhattan. If you want a similar vibe at lower prices, consider Bushwick or Bed-Stuy.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between North and South Williamsburg?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "North Williamsburg (roughly north of Grand Street to the Greenpoint border) is the area most people picture — trendy restaurants, boutique shops along Bedford Avenue, waterfront parks, and new luxury developments. Rents here are the highest in the neighborhood. South Williamsburg (south of the Williamsburg Bridge) has a large Hasidic Jewish community, a more residential feel, and noticeably lower rents — often $300 to $600 less per month for comparable units. East Williamsburg, beyond the BQE, blends into Bushwick and offers the most affordable options.",
        },
      },
      {
        "@type": "Question",
        name: "When is the best time to find apartments in Williamsburg?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best time to find deals in Williamsburg is during winter, from November through February. Landlords are more likely to offer concessions like one or two months free rent during this period. Avoid the peak rental season from May through September, when competition from college graduates and relocating professionals drives prices up and units move within days. Listings in popular Williamsburg buildings can attract dozens of applications, so have your documents ready before you start searching.",
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
        name: "Williamsburg",
        item: `${baseUrl}/nyc/williamsburg`,
      },
    ],
  },
];

export default function WilliamsburgGuidePage() {
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
              <Badge variant="outline">NYC Neighborhoods</Badge>
              <Badge variant="secondary">Brooklyn</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Williamsburg Apartments: Rent Prices, Transit &amp; Tips for 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              Williamsburg is the most searched Brooklyn neighborhood on every
              major listing site, consistently drawing renters with its mix of
              waterfront parks, an acclaimed restaurant scene, and direct L-train
              access to Manhattan. This guide covers average rents, subway
              options, the best blocks to search, and practical tactics for
              landing an apartment here.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Prices reflect median asking rents for
              market-rate apartments
            </p>
          </header>

          {/* ── Quick Facts ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Williamsburg at a Glance</CardTitle>
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
                  <p className="text-lg font-semibold">$2,400 &ndash; $3,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,000 &ndash; $3,800</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,800 &ndash; $5,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Income Needed (1BR)
                  </p>
                  <p className="text-lg font-semibold">~$120,000 &ndash; $152,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Subway Lines
                  </p>
                  <p className="text-lg font-semibold">L, G, J, M, Z</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    ZIP Codes
                  </p>
                  <p className="text-lg font-semibold">11211, 11249, 11206</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Neighborhood Character ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>What Williamsburg Is Like</CardTitle>
              <CardDescription>
                Culture, food, waterfront, and daily life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Williamsburg stretches along the East River waterfront in
                northern Brooklyn, roughly bounded by the Brooklyn-Queens
                Expressway to the east, Greenpoint to the north, and the
                Williamsburg Bridge to the south. Over the past 15 years it
                has transformed from an industrial and artist enclave into
                one of Brooklyn&apos;s most expensive and desirable rental
                markets, with new luxury towers along the waterfront mixed
                with converted loft buildings and pre-war walkups on the
                interior streets.
              </p>
              <p>
                Bedford Avenue is the neighborhood&apos;s commercial spine,
                lined with independent coffee shops, vintage stores, restaurants,
                and bars. The waterfront along Kent Avenue and the East River
                State Park (now Marsha P. Johnson State Park) offers green space,
                a weekend food market, and some of the best Manhattan skyline
                views in the city. Domino Park, built on the site of the former
                Domino Sugar Refinery, is a popular spot for picnics and
                sunsets.
              </p>
              <p>
                The dining scene spans everything from Michelin-recognized
                tasting menus and inventive ramen spots to late-night pizza
                slices and classic Polish diners that predate the neighborhood&apos;s
                transformation. Nightlife ranges from dive bars and live music
                venues on the side streets to rooftop cocktail bars in the new
                waterfront developments.
              </p>
              <p>
                The main trade-offs are price and crowding. Williamsburg is now
                priced comparably to many Manhattan neighborhoods, and Bedford
                Avenue can feel overwhelmingly busy on weekends. If you want
                similar Brooklyn energy at lower rents, Bushwick and Bed-Stuy
                are the go-to alternatives, both reachable in 10 to 15 minutes
                by train.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent Breakdown ────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Rent Prices by Apartment Size</CardTitle>
              <CardDescription>
                What to expect across different unit types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Studios</h3>
                <p>
                  Williamsburg studios typically range from $2,400 to $3,000 per
                  month. The most affordable options are in older walkups on
                  side streets east of Bedford Avenue and in South Williamsburg
                  below Grand Street. Studios in the newer waterfront buildings
                  along Kent Avenue and Wythe Avenue can reach $3,200 or higher,
                  but often include amenities like a gym, rooftop deck, and
                  in-unit laundry. Expect about 350 to 500 square feet depending
                  on building age.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  One-Bedrooms
                </h3>
                <p>
                  The median one-bedroom sits around $3,000 to $3,800. Under
                  NYC&apos;s 40x income rule, you need to earn roughly $120,000 to
                  $152,000 annually to qualify without a guarantor. The best
                  value is in South Williamsburg and on blocks east of the BQE,
                  where one-bedrooms can dip below $2,800 for walkup units.
                  Waterfront and newly constructed buildings on the north side
                  command $3,800 to $4,500 for a one-bedroom with modern
                  finishes.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Two-Bedrooms &amp; Shares
                </h3>
                <p>
                  Two-bedrooms range from $3,800 to $5,000, making the per-person
                  cost for roommates roughly $1,900 to $2,500 — competitive
                  with studio rents for solo renters. Roommate situations are
                  very common in Williamsburg, especially in the larger converted
                  loft apartments that are unique to the neighborhood. If you are
                  open to sharing, our{" "}
                  <Link
                    href="/roommates"
                    className="text-primary underline underline-offset-2"
                  >
                    roommate matching tool
                  </Link>{" "}
                  can help you find compatible housemates.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Transit ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Around: Subway &amp; Transit</CardTitle>
              <CardDescription>
                Commute times from Williamsburg
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The L train is the lifeline of Williamsburg. It connects the
                neighborhood directly to Manhattan&apos;s 14th Street corridor
                — Union Square, Chelsea, and the Meatpacking District — in
                about 5 to 10 minutes. However, Williamsburg has more subway
                options than many people realize.
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">L train</span>{" "}
                  — Bedford Avenue, Lorimer Street, and Graham Avenue stations.
                  Your fastest route to Union Square (5 minutes), Chelsea (8
                  minutes), and the East Village (3 minutes). Runs frequently
                  but can get extremely crowded during rush hours.
                </div>
                <div>
                  <span className="font-semibold text-foreground">G train</span>{" "}
                  — Metropolitan Avenue-Lorimer Street station. Connects to
                  Greenpoint (3 minutes), Fort Greene and Downtown Brooklyn (15
                  minutes), and Prospect Park (20 minutes). The G is the only
                  NYC subway line that stays entirely within Brooklyn and Queens
                  — useful for Brooklyn-to-Brooklyn commutes.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    J, M, Z trains
                  </span>{" "}
                  — Marcy Avenue station on the southern edge. These trains
                  cross the Williamsburg Bridge to the Lower East Side and
                  continue to Midtown via the Nassau Street line. A good
                  alternative to the L for commuters heading to the Financial
                  District or Chinatown.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    NYC Ferry
                  </span>{" "}
                  — The North Williamsburg and South Williamsburg ferry stops
                  connect to DUMBO, Wall Street/Pier 11, and Midtown East
                  (34th Street). The ferry is slower than the subway but far
                  more scenic, and fares are the same as a MetroCard swipe.
                </div>
              </div>
              <p>
                Citi Bike is extremely popular in Williamsburg, with stations
                on nearly every block. The Williamsburg Bridge bike path is a
                15-minute ride to the Lower East Side, making cycling a
                practical commute option for many residents.
              </p>
            </CardContent>
          </Card>

          {/* ── Best Streets & Micro-Neighborhoods ────── */}
          <Card>
            <CardHeader>
              <CardTitle>Best Blocks &amp; Micro-Neighborhoods</CardTitle>
              <CardDescription>
                Where to focus your apartment search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  North Williamsburg (Waterfront &amp; Bedford)
                </h3>
                <p>
                  The area between the Greenpoint border and Grand Street,
                  especially the blocks along Bedford Avenue, Berry Street, and
                  the waterfront. This is the most expensive and most
                  sought-after section, home to the majority of new luxury
                  developments. Rents are at or above the neighborhood median.
                  You get the best restaurant access, waterfront parks, and
                  proximity to the Bedford Avenue L station. The trade-off is
                  high foot traffic and weekend crowds.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  South Williamsburg (Below Grand Street)
                </h3>
                <p>
                  South of Grand Street toward the Williamsburg Bridge. This
                  area has a distinct character from the north side — a large
                  Hasidic Jewish community, more residential blocks, and
                  noticeably lower rents. One-bedrooms here are often $300 to
                  $600 less per month than comparable units north of Grand.
                  The Marcy Avenue J/M/Z station provides subway access, and
                  the South Williamsburg ferry stop connects to lower Manhattan.
                  Ideal for renters who want Williamsburg&apos;s location without
                  North Williamsburg prices.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  East Williamsburg (Beyond the BQE)
                </h3>
                <p>
                  East of the Brooklyn-Queens Expressway, Williamsburg blends
                  into Bushwick. This area features converted industrial lofts,
                  artist studios, and some of the most affordable rents in the
                  Williamsburg ZIP code. Studios can start below $2,200 and
                  one-bedrooms below $2,600. The Montrose Avenue and Graham
                  Avenue L stations serve this area. The trade-off is a less
                  polished streetscape and fewer dining options compared to the
                  waterfront, but the gap is closing as new restaurants and
                  shops continue to open.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Wythe Avenue &amp; Kent Avenue Corridor
                </h3>
                <p>
                  The waterfront strip has the newest building stock in
                  Williamsburg, including several large-scale developments with
                  full amenity packages (doorman, gym, rooftop, coworking space).
                  Rents are the highest here — expect $3,500 or more for a
                  studio — but you get modern finishes, building-managed
                  maintenance, and direct access to waterfront parks. This
                  corridor is popular with professionals relocating from
                  Manhattan who want apartment amenities comparable to what they
                  had in doorman buildings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Apartment Hunting Tips ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Apartment Hunting Tips for Williamsburg</CardTitle>
              <CardDescription>
                Practical advice from NYC renters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">
                    1. Have your documents ready before you start looking.
                  </span>{" "}
                  Williamsburg apartments move fast, especially in the prime
                  North Williamsburg area. Prepare your application package in
                  advance: two recent pay stubs, tax returns, bank statements,
                  a photo ID, and a reference letter from a previous landlord.
                  Our{" "}
                  <Link
                    href="/blog/rental-application-screening-basics"
                    className="text-primary underline underline-offset-2"
                  >
                    rental application guide
                  </Link>{" "}
                  walks through everything landlords look for.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    2. Look south and east for the best value.
                  </span>{" "}
                  North Williamsburg gets most of the attention, but South
                  Williamsburg and East Williamsburg offer significantly lower
                  rents. A one-bedroom in South Williamsburg can be $400 to
                  $600 cheaper per month than a comparable unit on Bedford
                  Avenue, and you still have subway and ferry access.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    3. Search during winter for concessions.
                  </span>{" "}
                  November through February is when Williamsburg landlords are
                  most likely to offer one or two months free rent, especially
                  in the newer waterfront buildings with higher vacancy rates.
                  These concessions effectively lower your monthly cost by 8%
                  to 16% over the lease term. Check our{" "}
                  <Link
                    href="/blog/negotiating-rent-and-lease-terms"
                    className="text-primary underline underline-offset-2"
                  >
                    lease negotiation guide
                  </Link>{" "}
                  for tactics that work in NYC.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    4. Watch out for scams on no-fee listings.
                  </span>{" "}
                  Williamsburg&apos;s popularity makes it a target for rental
                  scams, especially on Craigslist and Facebook Marketplace.
                  Never send money before seeing an apartment in person, and
                  verify that the person showing the unit is authorized by the
                  building management. Read our{" "}
                  <Link
                    href="/blog/nyc-apartment-scams"
                    className="text-primary underline underline-offset-2"
                  >
                    apartment scams guide
                  </Link>{" "}
                  to protect yourself.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    5. Know your rights under the FARE Act.
                  </span>{" "}
                  As of 2025, NYC&apos;s FARE Act shifted broker fees from tenants
                  to landlords in most cases. This can save you $3,000 to
                  $5,000 on a Williamsburg apartment. Learn more in our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act explainer
                  </Link>
                  .
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    6. Use AI-powered search to find unlisted inventory.
                  </span>{" "}
                  Many Williamsburg buildings, especially mid-size walkups and
                  newer developments, list directly through their property
                  management portals rather than major listing sites. Wade Me
                  Home aggregates these listings and lets you search by natural
                  language — just describe what you want and our AI finds
                  matching apartments.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Compared to Other Neighborhoods ──────── */}
          <Card>
            <CardHeader>
              <CardTitle>Williamsburg vs. Similar Neighborhoods</CardTitle>
              <CardDescription>
                How Williamsburg compares on price, transit, and vibe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. East Village
                </h3>
                <p>
                  The{" "}
                  <Link
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village
                  </Link>{" "}
                  in Manhattan has a similar cultural density and nightlife
                  scene. One-bedrooms there run $3,500 to $4,000 — slightly
                  higher than Williamsburg — and apartments tend to be smaller.
                  The L train connects the two neighborhoods in about 5 minutes.
                  Choose the East Village if being in Manhattan matters to you;
                  choose Williamsburg for more space and waterfront access.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Greenpoint
                </h3>
                <p>
                  Greenpoint sits just north of Williamsburg and shares the G
                  train. Rents are similar for newer buildings but slightly
                  lower for walkups. Greenpoint is quieter and more
                  residential, with a distinct Polish heritage and a growing
                  restaurant scene along Franklin Street. If you want a
                  neighborhood that feels less hectic than Williamsburg but
                  still walkable, Greenpoint is worth considering.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Bushwick
                </h3>
                <p>
                  Bushwick is the budget alternative to Williamsburg, with
                  one-bedrooms starting around $2,000 to $2,500. The arts and
                  food scene is growing rapidly, and the L and M trains
                  provide subway access. The commute to Manhattan is about 10
                  to 15 minutes longer than from Williamsburg. If price is
                  your top priority, Bushwick offers the best value within
                  easy reach of the Williamsburg scene.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. DUMBO
                </h3>
                <p>
                  DUMBO (Down Under the Manhattan Bridge Overpass) is a compact,
                  waterfront neighborhood with stunning bridge views and some
                  of Brooklyn&apos;s highest rents — one-bedrooms regularly
                  exceed $4,000. It appeals to a similar demographic as
                  waterfront Williamsburg but feels more corporate and less
                  neighborhood-like. Williamsburg offers more variety in
                  building types, price ranges, and nightlife.
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
                  How much is rent in Williamsburg, Brooklyn?
                </h3>
                <p>
                  The median asking rent for a one-bedroom is approximately
                  $3,000 to $3,800 per month as of early 2026. Studios start
                  around $2,400 to $3,000, and two-bedrooms range from $3,800
                  to $5,000. North Williamsburg near the waterfront is the
                  most expensive; South Williamsburg and areas east of the BQE
                  are more affordable.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What subway lines serve Williamsburg?
                </h3>
                <p>
                  The L train (Bedford Avenue, Lorimer Street, Graham Avenue),
                  G train (Metropolitan Avenue-Lorimer Street), and J/M/Z
                  trains (Marcy Avenue). The NYC Ferry also connects
                  Williamsburg to DUMBO, Wall Street, and Midtown East.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is Williamsburg safe?
                </h3>
                <p>
                  Williamsburg is generally considered safe and has seen
                  significant decreases in crime over the past decade as the
                  neighborhood has developed. The most trafficked areas along
                  Bedford Avenue, the waterfront, and near subway stations
                  are well-lit and busy at most hours. Standard NYC precautions
                  apply — be aware of your surroundings on quieter industrial
                  blocks, especially late at night east of the BQE.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are there rent-stabilized apartments in Williamsburg?
                </h3>
                <p>
                  Some older pre-war buildings in Williamsburg contain
                  rent-stabilized units, but they are less common than in
                  Manhattan neighborhoods like the East Village. The majority
                  of Williamsburg&apos;s newer construction is market-rate. If
                  finding a rent-stabilized unit is a priority, focus on
                  older walkup buildings and check our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>{" "}
                  for how to identify them.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the difference between North and South Williamsburg?
                </h3>
                <p>
                  North Williamsburg (north of Grand Street) has the trendy
                  restaurants, boutiques, waterfront parks, and luxury
                  developments that define the neighborhood&apos;s reputation.
                  Rents are highest here. South Williamsburg (south of the
                  Williamsburg Bridge) is more residential, with a large
                  Hasidic community and notably lower rents — often $300 to
                  $600 less per month for comparable units.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Your Williamsburg Apartment
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI what you&apos;re looking for and it will search
                hundreds of Williamsburg listings in seconds. No browsing, no
                filters — just describe your ideal apartment.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related Guides ────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related NYC Renting Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Apartments: Rent Prices, Transit &amp; Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/astoria"
                    className="text-primary underline underline-offset-2"
                  >
                    Astoria Apartments: Rent Prices, Transit &amp; Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City (LIC) Apartments: Towers &amp; Waterfront
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood: Prices, Commutes &amp; Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-apartment-search-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Apartment Search Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-moving-checklist"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Moving Checklist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-apartment-scams"
                    className="text-primary underline underline-offset-2"
                  >
                    How to Spot NYC Apartment Scams
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC FARE Act: Broker Fee Ban Explained
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
