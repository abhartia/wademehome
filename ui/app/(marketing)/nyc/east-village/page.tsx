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
    "East Village Apartments: Rent Prices, Transit & Tips (2026) | Wade Me Home",
  description:
    "Everything you need to rent an apartment in the East Village, Manhattan. Average rent prices, subway lines, best streets, lease tips, and how to find deals in one of NYC's most in-demand neighborhoods.",
  keywords: [
    "East Village apartments",
    "East Village rent",
    "East Village apartment hunting",
    "moving to East Village NYC",
    "East Village rent prices 2026",
    "East Village Manhattan rentals",
    "apartments near Tompkins Square Park",
    "East Village studios for rent",
    "East Village 1 bedroom rent",
    "affordable East Village apartments",
  ],
  openGraph: {
    title: "East Village Apartments: Rent Prices, Transit & Tips (2026)",
    description:
      "Average rent prices, subway access, best streets, and tips for finding an apartment in the East Village.",
    url: `${baseUrl}/nyc/east-village`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/east-village` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "East Village Apartments: Rent Prices, Transit & Tips for 2026",
    description:
      "A comprehensive guide to renting an apartment in the East Village, Manhattan — covering average rent prices, subway access, neighborhood character, and practical tips for apartment hunters.",
    datePublished: "2026-04-13",
    dateModified: "2026-04-13",
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
    mainEntityOfPage: `${baseUrl}/nyc/east-village`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a one-bedroom apartment cost in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, the median asking rent for a one-bedroom apartment in the East Village is approximately $3,500 to $4,000 per month. Studios typically start around $2,500 to $3,000, while two-bedrooms range from $4,500 to $5,500. Prices vary significantly based on the specific block, building amenities, and whether the unit is in a walkup or elevator building.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The East Village is served by several subway lines. The L train stops at First Avenue and Third Avenue, providing quick access to Brooklyn and Union Square. The 6 train runs along the western edge at Astor Place. The F and M trains stop at Second Avenue (Houston Street). The N, R, and W trains are accessible at 8th Street-NYU. Most of Manhattan and Brooklyn is reachable within 20 to 30 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Is the East Village a good neighborhood for young professionals?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The East Village is one of the most popular neighborhoods in NYC for young professionals aged 22 to 35. It offers a dense concentration of restaurants, bars, live music venues, and independent shops. The neighborhood has a strong community feel despite being in Manhattan, with regular events in Tompkins Square Park and a thriving local business scene. The main trade-off is price — expect to pay a premium compared to outer-borough neighborhoods with similar energy like Williamsburg or Bushwick.",
        },
      },
      {
        "@type": "Question",
        name: "What is the income requirement to rent in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most East Village landlords follow the standard NYC 40x rule: your annual gross income must be at least 40 times the monthly rent. For a $3,500 one-bedroom, that means you need to earn at least $140,000 per year. If your income falls short, you can use a guarantor who earns at least 80 times the monthly rent, or use a guarantor service like Rhino or TheGuarantor.",
        },
      },
      {
        "@type": "Question",
        name: "When is the best time to look for apartments in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best time to find deals in the East Village is during winter months, from November through February. Inventory is lower, but landlords are more likely to offer concessions like one or two months free rent. Avoid the peak season from May through September, especially around August and September when competition from students and new graduates is highest. Listings in the East Village typically move within days, so be prepared to act fast regardless of season.",
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
        name: "East Village",
        item: `${baseUrl}/nyc/east-village`,
      },
    ],
  },
];

export default function EastVillageGuidePage() {
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
              <Badge variant="secondary">Manhattan</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              East Village Apartments: Rent Prices, Transit &amp; Tips for 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              The East Village is one of the most in-demand neighborhoods in New
              York City, with apartment searches surging nearly 46% year over
              year according to StreetEasy. This guide covers what you need to
              know before renting here — from average prices and subway access to
              the best blocks and lease negotiation tactics.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Prices reflect median asking rents for
              market-rate apartments
            </p>
          </header>

          {/* ── Quick Facts ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village at a Glance</CardTitle>
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
                  <p className="text-lg font-semibold">$2,700 &ndash; $3,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,500 &ndash; $4,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$4,500 &ndash; $5,500</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Income Needed (1BR)
                  </p>
                  <p className="text-lg font-semibold">~$140,000 &ndash; $160,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Subway Lines
                  </p>
                  <p className="text-lg font-semibold">L, 6, F, M, N, R, W</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    ZIP Codes
                  </p>
                  <p className="text-lg font-semibold">10003, 10009</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Neighborhood Character ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>What the East Village Is Like</CardTitle>
              <CardDescription>
                Culture, food, nightlife, and daily life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The East Village sits between 14th Street and Houston Street,
                roughly from the Bowery east to the East River. It has one of the
                highest densities of restaurants, bars, and independent shops per
                block in all of Manhattan. The neighborhood is known for its mix
                of old-school NYC character — walk-up tenements, community
                gardens, and long-running dive bars — alongside newer luxury
                developments and craft cocktail spots.
              </p>
              <p>
                Tompkins Square Park is the neighborhood&apos;s green anchor, hosting
                farmers markets, live music, and community events throughout the
                year. The surrounding blocks (Avenues A and B) are among the most
                desirable for renters who want to be close to the action without
                living directly on a major commercial strip.
              </p>
              <p>
                The food scene ranges from legendary cheap eats — think dollar
                dumplings on St. Marks Place, late-night pizza on First Avenue,
                and the iconic Veselka diner — to Michelin-starred restaurants
                scattered along quieter side streets. For nightlife, the
                neighborhood offers everything from jazz clubs and comedy shows
                to rooftop bars and underground music venues.
              </p>
              <p>
                The main trade-off is noise and space. The East Village is loud,
                especially on weekend nights along Avenue A, St. Marks Place, and
                Second Avenue. Apartments tend to be smaller and older than what
                you would find in newer buildings in Long Island City or Downtown
                Brooklyn. If you prioritize space and quiet over walkability and
                culture density, consider neighborhoods like Sunnyside or Windsor
                Terrace instead.
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
                  East Village studios typically range from $2,500 to $3,200 per
                  month. The most affordable options are in pre-war walkups on
                  blocks east of Avenue A, especially along Avenues C and D.
                  Studios in newer or recently renovated elevator buildings near
                  Astor Place or Union Square can reach $3,500 or higher. Expect
                  about 300 to 450 square feet. Many studios in the area feature
                  exposed brick, original hardwood floors, and compact
                  kitchenettes.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  One-Bedrooms
                </h3>
                <p>
                  The median one-bedroom hovers around $3,500 to $4,000. Under
                  the 40x income rule, you need to earn roughly $140,000 to
                  $160,000 annually to qualify without a guarantor. The best
                  value tends to be on the eastern blocks between Avenues B and
                  D, where rents can dip below $3,200 for a walk-up unit. One-
                  bedrooms closer to Third Avenue or in newer luxury builds
                  regularly exceed $4,200.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Two-Bedrooms &amp; Shares
                </h3>
                <p>
                  Two-bedrooms range from $4,500 to $5,500, making the per-person
                  cost for roommates roughly $2,250 to $2,750 — often cheaper
                  than renting a studio solo. Shared apartments are extremely
                  common in the East Village, especially among renters in their
                  20s and early 30s. If you are open to roommates, our{" "}
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
                Commute times from the East Village
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The East Village has solid subway access, though coverage varies
                by block. The western side of the neighborhood (near Third
                Avenue) is well served, while the eastern edge near Avenue D
                requires a longer walk to the nearest station.
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">L train</span>{" "}
                  — First Avenue and Third Avenue stations. Your fastest route to
                  Union Square (2 minutes), Chelsea/Meatpacking (5 minutes), and
                  Williamsburg/Bushwick in Brooklyn (10 to 15 minutes).
                </div>
                <div>
                  <span className="font-semibold text-foreground">6 train</span>{" "}
                  — Astor Place station at the neighborhood&apos;s western edge.
                  Direct access to Midtown East (15 minutes), Grand Central (12
                  minutes), and the Upper East Side (20 minutes).
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    F and M trains
                  </span>{" "}
                  — Second Avenue station (at Houston). Connects to the Lower
                  East Side, West Village, and Midtown. The F continues to
                  Brooklyn (Carroll Gardens, Park Slope).
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    N, R, W trains
                  </span>{" "}
                  — 8th Street-NYU station. Direct to SoHo, Canal Street, and
                  Downtown Brooklyn (15 minutes).
                </div>
              </div>
              <p>
                Citi Bike stations are plentiful throughout the East Village, and
                many residents bike along the protected lanes on First and Second
                Avenues. The M14A and M14D buses run crosstown along 14th Street
                for access to the West Side.
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
                  Alphabet City (Avenues A through D)
                </h3>
                <p>
                  The eastern stretch of the East Village, between Avenue A and
                  the FDR Drive. This area offers the most affordable rents in
                  the neighborhood, with studios starting under $2,500 on
                  Avenues C and D. The trade-off is a longer walk to the subway
                  (10 to 15 minutes to the L or 6). Community gardens, local
                  bodegas, and a quieter residential feel distinguish this area
                  from the busier western blocks.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Tompkins Square Area (7th to 10th Streets, A to B)
                </h3>
                <p>
                  The heart of the neighborhood. This is the most walkable and
                  lively section, with Tompkins Square Park as the anchor. Rents
                  here are at the neighborhood median or slightly above. Expect
                  strong foot traffic, excellent restaurant options on every
                  block, and noise on weekend nights. Ideal for renters who
                  prioritize walkability and community over quiet.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  St. Marks Place &amp; Astor Place Corridor
                </h3>
                <p>
                  The western commercial strip. St. Marks Place (8th Street
                  between Third Avenue and Avenue A) is the busiest, loudest
                  block in the East Village — famous for its mix of shops, food
                  stalls, and nightlife. Apartments directly on St. Marks are
                  noisy but relatively affordable. The blocks just north and
                  south (9th and 7th Streets) offer a good balance of access and
                  livability.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Stuyvesant Town Border (14th Street Edge)
                </h3>
                <p>
                  The northern boundary of the East Village sits along 14th
                  Street, adjacent to Stuyvesant Town. This area offers easy
                  access to the L train, Union Square, and Trader Joe&apos;s. Rents
                  are slightly higher due to the newer building stock along 13th
                  and 14th Streets, but you get more square footage and modern
                  amenities compared to the older walk-ups further south.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Apartment Hunting Tips ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Apartment Hunting Tips for the East Village</CardTitle>
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
                  East Village apartments move fast — often within 24 to 48 hours
                  of listing. Prepare your application package in advance: two
                  recent pay stubs, tax returns, bank statements, a photo ID,
                  and a reference letter from a previous landlord. Our{" "}
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
                    2. Consider walk-ups east of Avenue A for the best value.
                  </span>{" "}
                  The biggest price drops in the East Village happen as you move
                  east. A fifth-floor walkup on Avenue C can be $500 to $800
                  cheaper per month than a similar unit near Third Avenue. If you
                  are comfortable with stairs and a longer subway walk, Alphabet
                  City offers genuine value.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    3. Search during winter for concessions.
                  </span>{" "}
                  November through February is when landlords are most likely to
                  offer one or two months free rent. These concessions
                  effectively lower your monthly cost by 8% to 16% over the
                  lease term. Check our{" "}
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
                  The East Village&apos;s popularity makes it a target for rental
                  scams. Never send money before seeing an apartment in person,
                  and verify that the person showing you the unit is authorized
                  by the building. Read our{" "}
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
                  As of 2025, NYC&apos;s FARE Act shifted broker fees from tenants to
                  landlords in most cases. This can save you $3,000 to $6,000 on
                  an East Village apartment. Learn more in our{" "}
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
                  Many smaller East Village landlords list directly through
                  property management portals rather than major listing sites.
                  Wade Me Home aggregates these listings and lets you search by
                  natural language — just describe what you want and our AI finds
                  matching apartments.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Compared to Other Neighborhoods ──────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village vs. Similar Neighborhoods</CardTitle>
              <CardDescription>
                How the East Village compares on price, transit, and vibe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. West Village
                </h3>
                <p>
                  The West Village is quieter, more residential, and significantly
                  more expensive (median one-bedroom: $4,200 to $5,000). The East
                  Village offers a similar density of restaurants and nightlife at
                  roughly 15% to 25% lower rents, with better L-train access to
                  Brooklyn.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Lower East Side
                </h3>
                <p>
                  The LES (below Houston Street) has a similar gritty energy and
                  nightlife scene, with slightly lower rents — roughly $200 to
                  $400 less per month. The trade-off is fewer subway options and
                  a longer commute to Midtown. If you work south of 34th Street,
                  the LES is worth considering.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs.{" "}
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg
                  </Link>
                </h3>
                <p>
                  Williamsburg in Brooklyn offers a similar cultural scene with
                  more space for the price. One-bedrooms average $3,000 to
                  $3,800, and apartments tend to be larger. The L train connects
                  the two neighborhoods in about 10 minutes. The main difference
                  is that Williamsburg feels more spread out and residential,
                  while the East Village is dense and walking-centric.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Bushwick
                </h3>
                <p>
                  Bushwick is the budget alternative, with one-bedrooms starting
                  around $2,000 to $2,500. The arts and food scene is growing
                  fast, but the commute to Manhattan is 30 to 45 minutes. If
                  price is your top priority and you work remotely or in
                  Brooklyn, Bushwick is hard to beat.
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
                  How much does a one-bedroom apartment cost in the East Village?
                </h3>
                <p>
                  The median asking rent for a one-bedroom is approximately
                  $3,500 to $4,000 per month as of early 2026. Studios start
                  around $2,500 to $3,000, and two-bedrooms range from $4,500 to
                  $5,500. Prices vary significantly based on block, building
                  type, and amenities.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What subway lines serve the East Village?
                </h3>
                <p>
                  The L train (First Avenue, Third Avenue), 6 train (Astor
                  Place), F and M trains (Second Avenue at Houston), and N, R, W
                  trains (8th Street-NYU). Most of Manhattan and Brooklyn is
                  reachable within 20 to 30 minutes.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is the East Village safe?
                </h3>
                <p>
                  The East Village is generally considered safe by NYC standards.
                  The area around Tompkins Square Park and the commercial
                  corridors are well-trafficked at all hours. As with any dense
                  urban neighborhood, standard precautions apply — be aware of
                  your surroundings, especially late at night on quieter blocks
                  east of Avenue B.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are there rent-stabilized apartments in the East Village?
                </h3>
                <p>
                  Yes. Many of the pre-war walkups in the East Village contain
                  rent-stabilized units, especially in buildings with six or more
                  units built before 1974. These units offer regulated rent
                  increases and stronger tenant protections. Learn more in our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>
                  .
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  When is the best time to look for apartments in the East
                  Village?
                </h3>
                <p>
                  Winter months (November through February) offer the best deals,
                  with landlords more willing to offer free months and other
                  concessions. Avoid the May-through-September peak season when
                  competition is highest.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Your East Village Apartment
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI what you&apos;re looking for and it will search
                hundreds of East Village listings in seconds. No browsing, no
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
                <li>
                  <Link
                    href="/blog/broker-fees-and-upfront-costs"
                    className="text-primary underline underline-offset-2"
                  >
                    Understanding Broker Fees &amp; Upfront Costs
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
