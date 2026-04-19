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
  title: "NYC Rent Prices by Neighborhood (2026): What You'll Pay in Every Borough",
  description:
    "Compare average apartment rent in 20+ NYC neighborhoods for 2026. Manhattan, Brooklyn, Queens & Bronx costs side-by-side with subway commute times, income requirements, and money-saving tips.",
  keywords: [
    "NYC rent by neighborhood",
    "average rent NYC 2026",
    "cheapest neighborhoods NYC",
    "best neighborhoods to rent NYC",
    "Manhattan rent prices",
    "Brooklyn rent prices",
    "Queens rent prices",
    "affordable apartments NYC",
    "NYC neighborhood guide renters",
    "rent prices New York City",
  ],
  openGraph: {
    title: "NYC Rent Prices by Neighborhood (2026): What You'll Pay in Every Borough",
    description:
      "Compare average apartment rent in 20+ NYC neighborhoods for 2026. Manhattan, Brooklyn, Queens & Bronx costs side-by-side with subway commute times.",
    url: `${baseUrl}/nyc-rent-by-neighborhood`,
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "NYC Rent Prices by Neighborhood (2026): What You'll Pay in Every Borough",
    description:
      "A comprehensive guide to average rent prices in every major NYC neighborhood for 2026, including commute times, income requirements, and practical tips for renters.",
    datePublished: "2026-04-10",
    dateModified: "2026-04-15",
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
    mainEntityOfPage: `${baseUrl}/nyc-rent-by-neighborhood`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in NYC in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The median asking rent across all NYC boroughs is approximately $4,400 per month as of early 2026. Manhattan is the most expensive borough with a median of $5,000, followed by Brooklyn at $4,150. Queens and the Bronx offer lower medians, typically ranging from $1,800 to $2,800 depending on the neighborhood.",
        },
      },
      {
        "@type": "Question",
        name: "What income do I need to rent an apartment in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most NYC landlords require annual gross income of at least 40 times the monthly rent. For a $2,500 apartment, that means $100,000 per year. For the median Manhattan one-bedroom at roughly $4,500, you would need about $180,000. If your income falls short, a guarantor who earns 80 times the rent can co-sign your lease.",
        },
      },
      {
        "@type": "Question",
        name: "What are the cheapest neighborhoods to rent in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Among neighborhoods with good transit access, the most affordable options include Bushwick in Brooklyn (one-bedrooms from around $1,500), Ridgewood on the Brooklyn-Queens border (around $2,000 to $2,400), Washington Heights and Inwood in upper Manhattan (around $1,800 to $2,200), and parts of the Bronx like Fordham and Kingsbridge (around $1,500 to $1,900).",
        },
      },
      {
        "@type": "Question",
        name: "Is it cheaper to rent in Brooklyn or Queens?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "On average, Queens is cheaper than Brooklyn. Popular Queens neighborhoods like Astoria, Jackson Heights, and Sunnyside have median one-bedroom rents between $2,000 and $2,800, while comparable Brooklyn neighborhoods like Park Slope, Williamsburg, and Cobble Hill range from $2,800 to $3,800. However, some Brooklyn neighborhoods like Bushwick and East New York are priced similarly to outer Queens areas.",
        },
      },
      {
        "@type": "Question",
        name: "When is the cheapest time to rent in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Winter months (November through February) are typically the cheapest time to sign a lease in NYC. Inventory is lower, but landlords are more willing to offer concessions like free months or reduced broker fees to fill vacancies. The most expensive and competitive time is May through September, especially around the September rush when students and new graduates flood the market.",
        },
      },
    ],
  },
];

export default function NYCRentByNeighborhoodPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
              { "@type": "ListItem", position: 2, name: "Guides", item: `${baseUrl}/blog` },
              { "@type": "ListItem", position: 3, name: "NYC Rent by Neighborhood", item: `${baseUrl}/nyc-rent-by-neighborhood` },
            ],
          }),
        }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <Badge variant="outline">NYC Renting</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              NYC Rent by Neighborhood: Prices, Commutes &amp; Tips for 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              Finding an apartment in New York City starts with knowing what you
              can afford and where that budget goes furthest. This guide breaks
              down average rent prices across Manhattan, Brooklyn, Queens, and
              the Bronx so you can compare neighborhoods by price, commute, and
              livability before you start searching.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Prices reflect median asking rents for
              market-rate apartments
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>The NYC Rent Landscape in 2026</CardTitle>
              <CardDescription>
                Record-high prices and historically low inventory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The NYC rental market in 2026 is one of the tightest in recent
                memory. Inventory has dropped for more than a year straight as
                current tenants hold onto their leases, making available
                apartments scarce. The citywide median asking rent sits at
                approximately $4,400 per month, with Manhattan hitting a record
                median of $5,000.
              </p>
              <p>
                Under the standard 40x income rule that most NYC landlords use,
                qualifying for a median one-bedroom in Manhattan now requires an
                annual income of roughly $180,000. Even in more affordable
                boroughs, the math is challenging for many renters. Understanding
                the price differences between neighborhoods is the first step
                toward finding an apartment that fits your budget without
                sacrificing the things that matter to you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manhattan Neighborhoods</CardTitle>
              <CardDescription>
                The most expensive borough, with wide variation by area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Manhattan rents vary dramatically from neighborhood to
                neighborhood. The most expensive areas are along the southern
                half of the island: Hudson Yards, Tribeca, SoHo, and the
                Financial District command median one-bedroom rents of $4,000 to
                $5,500 or more. Midtown and the Upper East and West Sides range
                from $3,000 to $4,500 depending on how close you are to Central
                Park and transit.
              </p>
              <p>
                For renters seeking value within Manhattan, the upper reaches of
                the island offer significant savings. Washington Heights
                (one-bedrooms around $1,800 to $2,200) and Inwood ($1,700 to
                $2,100) have the lowest rents in the borough while maintaining
                express subway access to Midtown in under 30 minutes on the A
                train. East Harlem ($2,000 to $2,600) and Hamilton Heights
                ($2,200 to $2,800) offer a middle ground between price and
                proximity.
              </p>
              <p>
                The tradeoff in upper Manhattan is generally longer commute
                times and fewer dining and nightlife options compared to
                downtown. However, these neighborhoods have strong community
                character, excellent parks (Fort Tryon, Riverside), and a
                growing restaurant scene that makes them worth considering for
                renters who prioritize space and savings. For a deep dive into
                one of Manhattan&apos;s hottest rental markets, see our{" "}
                <Link
                  href="/nyc/east-village"
                  className="text-primary underline underline-offset-2"
                >
                  East Village neighborhood guide
                </Link>{" "}
                or our{" "}
                <Link
                  href="/nyc/upper-west-side"
                  className="text-primary underline underline-offset-2"
                >
                  Upper West Side guide
                </Link>{" "}
                for the uptown Manhattan family market.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brooklyn Neighborhoods</CardTitle>
              <CardDescription>
                From budget-friendly to Manhattan-priced, depending on where you
                look
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Brooklyn&apos;s median rent has risen to $4,150, but that number
                masks enormous variation.{" "}
                <Link
                  href="/nyc/williamsburg"
                  className="text-primary underline underline-offset-2"
                >
                  Williamsburg
                </Link>
                , DUMBO, Brooklyn Heights,
                and Cobble Hill are priced at or above many Manhattan
                neighborhoods, with one-bedrooms ranging from $3,200 to $4,500.
                Park Slope and Carroll Gardens sit in a similar range. These
                neighborhoods offer walkable streets, excellent restaurants, and
                short commutes to Lower Manhattan.
              </p>
              <p>
                The sweet spot for many renters is the band of neighborhoods
                just south and east of Williamsburg.{" "}
                <Link
                  href="/nyc/bushwick"
                  className="text-primary underline underline-offset-2"
                >
                  Bushwick
                </Link>{" "}
                offers some of the best value in the borough (one-bedrooms from
                $2,400 to $3,300) with L and M train access and a vibrant arts
                scene. Bed-Stuy ($2,000 to $2,800) has beautiful brownstones
                and multiple subway lines. Crown Heights ($2,200 to $3,000)
                sits along the 2/3/4/5 lines with a direct shot to Midtown.
              </p>
              <p>
                Further out, neighborhoods like Sunset Park ($1,800 to $2,400),
                Bay Ridge ($1,700 to $2,300), and Flatbush ($1,800 to $2,500)
                offer even lower rents. Commute times are longer (40 to 60
                minutes to Midtown), but these areas have strong cultural
                identity, diverse food scenes, and a more residential feel that
                many renters prefer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Queens Neighborhoods</CardTitle>
              <CardDescription>
                The best value-to-transit ratio in NYC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Queens is where many renters find the best balance between
                affordability and transit access.{" "}
                <Link
                  href="/nyc/astoria"
                  className="text-primary underline underline-offset-2"
                >
                  Astoria
                </Link>{" "}
                ($2,200 to $2,800 for
                a one-bedroom) is the most popular entry point: it sits on the
                N/W lines with a 20-minute ride to Midtown, has a thriving
                restaurant scene, and offers significantly more space than
                comparable Brooklyn neighborhoods at the same price.
              </p>
              <p>
                <Link
                  href="/nyc/long-island-city"
                  className="text-primary underline underline-offset-2"
                >
                  Long Island City
                </Link>{" "}
                ($3,200 to $3,800 in new construction) has the shortest commute
                in Queens (one stop from Midtown on the 7 or E/M) and modern
                luxury buildings, but prices reflect the convenience. Sunnyside
                ($2,000 to $2,500) and Woodside ($1,800 to $2,300) sit one and
                two stops further on the 7 line and offer substantially lower
                rents.
              </p>
              <p>
                Jackson Heights ($1,800 to $2,400) is one of the most
                culturally diverse neighborhoods in the world, with incredible
                food and solid transit on the 7, E, F, M, and R lines. Forest
                Hills ($2,000 to $2,700) has a suburban feel with express E/F
                access. Further out, Flushing ($1,600 to $2,200) is a major
                destination in its own right with world-class dining and the 7
                train to Midtown in about 40 minutes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The Bronx</CardTitle>
              <CardDescription>
                The most affordable borough with improving transit connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The Bronx offers the lowest rents of any NYC borough while still
                being connected by subway. The South Bronx, particularly Mott
                Haven and Port Morris, has seen significant development in
                recent years, with new construction bringing modern apartments
                at rents ($1,800 to $2,500 for a one-bedroom) well below
                comparable buildings in Brooklyn. The 6 train connects to
                Midtown in about 25 minutes.
              </p>
              <p>
                Established neighborhoods like Fordham ($1,500 to $1,900),
                Kingsbridge ($1,600 to $2,000), and Riverdale ($1,800 to
                $2,400) offer solid value further north. Riverdale in particular
                has a more suburban character with pre-war buildings, parks, and
                good schools. Commute times to Midtown range from 35 to 50
                minutes depending on the subway line.
              </p>
              <p>
                The main tradeoff in the Bronx is perception versus reality.
                Many neighborhoods have lower crime rates than commonly assumed,
                and the borough has seen sustained investment in parks, cultural
                institutions, and infrastructure. For renters priced out of
                Manhattan and Brooklyn, the Bronx offers genuine affordability
                with real subway access.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jersey City (PATH to Manhattan)</CardTitle>
              <CardDescription>
                $400 to $1,000 cheaper than Manhattan for the same PATH-train
                commute
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                If your job is in the Financial District or Midtown and you
                are open to crossing the Hudson, Jersey City is the single
                biggest rent arbitrage in the metro. A 1BR at a new tower in{" "}
                <Link
                  href="/jersey-city/downtown"
                  className="text-primary underline underline-offset-2"
                >
                  Downtown Jersey City
                </Link>{" "}
                runs $3,500 to $4,500 — the same unit specs in Tribeca or
                Battery Park City run $5,500 to $7,000. PATH trains from
                Grove Street and Exchange Place hit the World Trade Center in
                4 to 7 minutes, faster than most Manhattan subway rides to
                the same building.
              </p>
              <p>
                <Link
                  href="/jersey-city/journal-square"
                  className="text-primary underline underline-offset-2"
                >
                  Journal Square
                </Link>{" "}
                ($2,950 to $3,500 for a new-tower 1BR) is the cheapest
                PATH-adjacent submarket, with a construction wave since 2019
                delivering the Greyson, 505 Summit, and Journal Squared.{" "}
                <Link
                  href="/jersey-city/newport"
                  className="text-primary underline underline-offset-2"
                >
                  Newport
                </Link>{" "}
                ($3,300 to $4,500) is LeFrak&apos;s master-planned
                amenity-dense waterfront with direct PATH service to 33rd
                Street — the only JC submarket with a single-ride Midtown
                commute.
              </p>
              <p>
                Renter protections differ from NYC. NJ caps security deposits
                at 1.5 months (tighter than NY), the NJ Anti-Eviction Act
                requires cause for non-renewal after year one, and pre-1987
                buildings with 5+ units are rent-controlled under the JC
                ordinance. See the{" "}
                <Link
                  href="/jersey-city"
                  className="text-primary underline underline-offset-2"
                >
                  full Jersey City guide
                </Link>{" "}
                for rent breakdowns, transit math, and building-level data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The 40x Rule and What You Actually Need</CardTitle>
              <CardDescription>
                How income requirements shape where you can rent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Nearly every landlord in NYC uses the 40x rule: your annual
                gross income must be at least 40 times the monthly rent. This
                means a $2,000 apartment requires $80,000 in income, and a
                $3,500 apartment requires $140,000. Combined income from
                co-tenants on a joint lease counts, which is why roommate
                situations are common even among working professionals.
              </p>
              <p>
                If your income falls short, a guarantor can co-sign your lease.
                Most landlords require guarantors to earn 80 times the monthly
                rent. If you do not have a family member who qualifies, third-party
                guarantor services exist specifically for the NYC market. Budget
                a few hundred dollars for the annual fee.
              </p>
              <p>
                Self-employed renters face additional scrutiny. Expect to
                provide two years of tax returns, bank statements, and possibly
                a CPA letter. Some landlords accept 50x or 60x income for
                self-employed applicants to account for income variability. If
                your freelance income is strong but irregular, having a
                guarantor ready can speed up the application process.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timing Your Search</CardTitle>
              <CardDescription>
                When prices peak, when deals appear, and how fast you need to
                move
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The NYC rental market has a distinct seasonal pattern. Peak
                season runs from May through September, driven by lease
                expirations, job relocations, and the September student rush.
                During these months, desirable apartments often receive multiple
                applications within hours of listing. Concessions are rare, and
                landlords have maximum leverage.
              </p>
              <p>
                Winter months (November through February) are the off-season.
                Fewer apartments are listed, but landlords work harder to fill
                vacancies. Free months of rent, reduced broker fees, and lower
                asking prices are all more common. If your move-in date is
                flexible, targeting January or February can save you a month or
                more of rent over the life of a lease.
              </p>
              <p>
                Regardless of season, speed matters in NYC. Most market-rate
                apartments are rented within a few days of listing. Have your
                documents ready (pay stubs, tax returns, bank statements, photo
                ID, reference letters) before you start touring. Be prepared to
                submit an application the same day you see a place you like.
                Hesitation in this market means the apartment goes to someone
                else.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground">
                  What is the average rent in NYC in 2026?
                </h3>
                <p className="mt-1">
                  The citywide median asking rent is approximately $4,400. Manhattan
                  has the highest median at $5,000, Brooklyn follows at $4,150, and
                  Queens and the Bronx are significantly lower depending on the
                  neighborhood. One-bedroom apartments range from about $1,500 in the
                  most affordable areas to over $5,000 in premium locations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  What income do I need to rent in NYC?
                </h3>
                <p className="mt-1">
                  Most landlords require annual gross income of 40 times the monthly
                  rent. A $2,500 apartment requires $100,000 in income. If your income
                  is lower, a guarantor earning 80 times the rent can co-sign. Roommate
                  situations allow combined incomes to meet the threshold.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  What are the cheapest neighborhoods to rent in NYC?
                </h3>
                <p className="mt-1">
                  Neighborhoods with one-bedroom rents under $2,000 include Bushwick
                  and East New York in Brooklyn, Washington Heights and Inwood in
                  Manhattan, Jackson Heights and Flushing in Queens, and Fordham and
                  Kingsbridge in the Bronx. All have subway access to Midtown within
                  30 to 50 minutes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Is it cheaper to rent in Brooklyn or Queens?
                </h3>
                <p className="mt-1">
                  On average, Queens is cheaper. Popular Queens neighborhoods like
                  Astoria, Sunnyside, and Jackson Heights are $500 to $1,000 less per
                  month than comparable Brooklyn neighborhoods like Williamsburg and
                  Park Slope. However, budget Brooklyn neighborhoods like Bushwick can
                  be priced similarly to outer Queens.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  When is the cheapest time to rent in NYC?
                </h3>
                <p className="mt-1">
                  Winter months (November through February) typically offer the best
                  deals. Landlords are more willing to offer concessions like one or
                  two free months, reduced broker fees, or lower asking rents to fill
                  vacancies during the slow season.
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Related guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <Link
                    href="/nyc-apartment-search-guide"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    How to Find an Apartment in NYC
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/rent-budget-from-take-home-pay"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    How Much Rent Can I Afford?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/broker-fees-and-upfront-costs"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Broker Fees and Upfront Costs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/guarantors-and-co-signers"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Guarantors: Who Qualifies and How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-moving-checklist"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Moving Checklist 2026
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/neighborhood-research-for-renters"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    How to Research a Neighborhood Before Renting
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Rent Stabilization Explained
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Best Time to Rent in NYC: Month-by-Month Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/east-village"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    East Village: Rent Prices, Transit &amp; Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Williamsburg: Rent Prices, Transit &amp; Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bushwick"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Bushwick: Rent Prices, Transit &amp; Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/astoria"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Astoria: Rent Prices, Transit &amp; Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/long-island-city"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Long Island City (LIC): Luxury Towers &amp; Waterfront Rent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Upper West Side: Rent Prices, Pre-War Buildings &amp; Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Jersey City: PATH-to-Manhattan Rent &amp; Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/downtown"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Downtown Jersey City: Grove Street &amp; Exchange Place
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/journal-square"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Journal Square: Cheapest PATH-Adjacent Submarket
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/newport"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Newport: LeFrak Waterfront &amp; Direct Midtown PATH
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cost-of-moving-to-nyc"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    How Much Does It Cost to Move to NYC? (2026)
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Search NYC apartments with Wade Me Home
              </Link>
            </Button>
          </div>

          <Separator />
          <p className="text-xs text-muted-foreground">
            Looking for a specific apartment?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Try AI-powered apartment search
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
