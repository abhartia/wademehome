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
    "Best Time to Rent an Apartment in NYC (2026): Month-by-Month Guide",
  description:
    "When should you start apartment hunting in NYC? See how rent prices, inventory, and competition shift month-by-month. Save $200-500/month by timing your move right.",
  keywords: [
    "best time to rent apartment NYC",
    "when to start looking for apartment NYC",
    "NYC rental season",
    "best month to rent NYC",
    "NYC apartment hunting timeline",
    "cheapest month to rent NYC",
    "NYC rent prices by month",
    "winter apartment hunting NYC",
    "summer apartment hunting NYC",
    "when do NYC leases start",
    "NYC rental market timing",
    "off-season apartment NYC",
  ],
  openGraph: {
    title:
      "Best Time to Rent an Apartment in NYC (2026): Month-by-Month Guide",
    description:
      "How rent prices, inventory, and competition shift month-by-month in NYC. Time your move to save hundreds per month.",
    url: `${baseUrl}/best-time-to-rent-nyc`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/best-time-to-rent-nyc` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Best Time to Rent an Apartment in NYC (2026): Month-by-Month Guide",
    description:
      "A complete month-by-month breakdown of the NYC rental market — when prices peak, when inventory floods, and when smart renters lock in deals.",
    datePublished: "2026-04-16",
    dateModified: "2026-04-16",
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
    mainEntityOfPage: `${baseUrl}/best-time-to-rent-nyc`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best month to rent an apartment in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "January and February are the cheapest months to sign a lease in NYC. Median asking rents drop 5% to 10% from their summer peak, landlord concessions (free months, paid broker fees) become common, and you face significantly less competition. The trade-off is much lower inventory — about 40% to 50% fewer active listings than peak summer months. If you have flexible timing and care more about price than selection, target a January or February move-in.",
        },
      },
      {
        "@type": "Question",
        name: "What is the most expensive time to rent in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "June, July, and August are the peak rental season in NYC. Asking rents are typically 5% to 10% above the annual average, bidding wars are common in popular neighborhoods, and apartments often rent within 24 to 72 hours of listing. The summer surge is driven by college graduations, corporate relocations, families moving before the school year, and the natural turnover of one-year leases that began the previous summer.",
        },
      },
      {
        "@type": "Question",
        name: "How early should I start looking for an apartment in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In NYC, start your active search 30 to 45 days before your target move-in date. Most NYC landlords list apartments only when they become available within that window, and few will hold an apartment for more than 30 days. Beginning earlier than 45 days mostly serves to get familiar with neighborhoods and price points; you generally cannot lock in a specific apartment two or three months ahead. Have your documents (pay stubs, bank statements, ID, references) ready before you start touring so you can apply within hours of finding the right place.",
        },
      },
      {
        "@type": "Question",
        name: "Is it cheaper to rent in NYC in winter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — apartments leased in November through February are typically 5% to 10% cheaper than the same units leased in June through August. On a $3,500 one-bedroom, that translates to $175 to $350 per month, or $2,100 to $4,200 over a one-year lease. Landlords are also far more likely to offer concessions like one or two months free, broker fees waived, or flexible move-in dates during winter. The catch is that overall inventory is much lower, so you may have fewer options that fit your specific criteria.",
        },
      },
      {
        "@type": "Question",
        name: "Why do most NYC leases start on the 1st of the month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NYC landlords overwhelmingly prefer leases that start on the 1st of the month because it simplifies rent collection, building accounting, and turnover scheduling. Mid-month start dates are possible but uncommon — landlords usually require you to pay prorated rent for the partial month plus a full first month, which increases your upfront cash requirement. If you need to move mid-month, ask the landlord whether they would accept a free 'gap week' in exchange for a 13-month lease, which some will agree to in slow seasons.",
        },
      },
      {
        "@type": "Question",
        name: "When does NYC rental inventory peak?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Active rental inventory in NYC peaks in June, July, and August, with roughly 30% to 50% more listings than in January and February. This is because most one-year leases originally signed during the summer surge come due then, creating a large turnover wave. Inventory also has a smaller secondary peak in September as recent graduates and new transplants move in for fall. Listings turn over fastest in summer too — the median time-on-market for a desirable apartment in June can be under 14 days.",
        },
      },
      {
        "@type": "Question",
        name: "Are there really 'no fee' apartments in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, and they are far more common than they used to be. Under the FARE Act that took effect in June 2025, landlord-side brokers can no longer charge tenants a fee, so any apartment listed by a broker hired by the landlord is effectively no-fee. Additionally, many large management companies (Stonehenge, Glenwood, Related, etc.) and individual landlords list directly without using a broker. You may still owe a tenant-side fee if you hire your own broker to help you search, but you are not obligated to do so.",
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
        name: "Best Time to Rent in NYC",
        item: `${baseUrl}/best-time-to-rent-nyc`,
      },
    ],
  },
];

export default function BestTimeToRentNycPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">NYC Rentals</Badge>
              <Badge variant="secondary">Seasonal Guide</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Best Time to Rent an Apartment in NYC: A Month-by-Month Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              The NYC rental market follows a predictable annual cycle. Rents
              peak in June through August, when demand from graduates and
              relocating professionals collides with the largest wave of
              one-year lease turnovers. Prices bottom out in January and
              February, when inventory is thin but landlords are far more
              willing to negotiate. Knowing where you are in the cycle can
              save you $2,000 to $4,000 over a one-year lease on the same
              apartment. This guide walks through every month of the year:
              what inventory looks like, what prices are doing, who you are
              competing against, and what your negotiating leverage is.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Based on multi-year median asking
              rent and inventory patterns across Manhattan, Brooklyn, and
              Queens
            </p>
          </header>

          {/* TL;DR */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Answer</CardTitle>
              <CardDescription>If you only read one paragraph</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Cheapest month to sign:
                </span>{" "}
                <strong>January or February</strong> &mdash; rents 5% to 10%
                below summer peak, more concessions, far less competition.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Best selection:
                </span>{" "}
                <strong>June, July, August</strong> &mdash; up to 50% more
                listings, but you pay top dollar and apartments rent in 24 to
                72 hours.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Best balance of price + selection:
                </span>{" "}
                <strong>October and November</strong> &mdash; inventory is
                still strong from the September wave, prices have softened
                from summer, and competition has eased.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Start active search:
                </span>{" "}
                30 to 45 days before your target move-in date. Earlier than
                that mostly helps with neighborhood research, not securing a
                specific apartment.
              </p>
            </CardContent>
          </Card>

          {/* Seasonal Pricing Table */}
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Price &amp; Inventory Index</CardTitle>
              <CardDescription>
                Relative to the annual average for each metric
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Median Rent</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Competition</TableHead>
                      <TableHead>Negotiating Power</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">January</TableCell>
                      <TableCell>-7% to -10%</TableCell>
                      <TableCell>Very Low</TableCell>
                      <TableCell>Very Low</TableCell>
                      <TableCell>High</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">February</TableCell>
                      <TableCell>-5% to -8%</TableCell>
                      <TableCell>Low</TableCell>
                      <TableCell>Low</TableCell>
                      <TableCell>High</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">March</TableCell>
                      <TableCell>-3% to -5%</TableCell>
                      <TableCell>Building</TableCell>
                      <TableCell>Moderate</TableCell>
                      <TableCell>Moderate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">April</TableCell>
                      <TableCell>-1% to -3%</TableCell>
                      <TableCell>Building</TableCell>
                      <TableCell>Rising</TableCell>
                      <TableCell>Moderate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">May</TableCell>
                      <TableCell>+2% to +5%</TableCell>
                      <TableCell>High</TableCell>
                      <TableCell>High</TableCell>
                      <TableCell>Low</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">June</TableCell>
                      <TableCell>+5% to +8%</TableCell>
                      <TableCell>Peak</TableCell>
                      <TableCell>Peak</TableCell>
                      <TableCell>Very Low</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">July</TableCell>
                      <TableCell>+7% to +10%</TableCell>
                      <TableCell>Peak</TableCell>
                      <TableCell>Peak</TableCell>
                      <TableCell>Very Low</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">August</TableCell>
                      <TableCell>+5% to +8%</TableCell>
                      <TableCell>High</TableCell>
                      <TableCell>High</TableCell>
                      <TableCell>Low</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">September</TableCell>
                      <TableCell>+2% to +4%</TableCell>
                      <TableCell>Strong</TableCell>
                      <TableCell>Moderate</TableCell>
                      <TableCell>Moderate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">October</TableCell>
                      <TableCell>0% to -2%</TableCell>
                      <TableCell>Strong</TableCell>
                      <TableCell>Easing</TableCell>
                      <TableCell>Moderate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">November</TableCell>
                      <TableCell>-3% to -5%</TableCell>
                      <TableCell>Moderate</TableCell>
                      <TableCell>Low</TableCell>
                      <TableCell>High</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">December</TableCell>
                      <TableCell>-5% to -8%</TableCell>
                      <TableCell>Low</TableCell>
                      <TableCell>Very Low</TableCell>
                      <TableCell>High</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Percentages reflect typical median asking rent variation
                relative to the 12-month average for the same unit type and
                neighborhood. Actual swings vary by submarket &mdash; ultra
                high-end Manhattan and luxury new construction show smaller
                seasonality than market-rate Brooklyn and Queens walkups.
              </p>
            </CardContent>
          </Card>

          {/* Why the cycle exists */}
          <Card>
            <CardHeader>
              <CardTitle>Why the NYC Rental Cycle Exists</CardTitle>
              <CardDescription>
                Three forces that shape every year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Lease anniversary effect.
                </span>{" "}
                The dominant lease term in NYC is 12 months. A landlord who
                signs a tenant in July gets a tenant whose lease comes due in
                July of the following year. Because the bulk of leases are
                signed in summer, the bulk of turnovers also happen in summer
                &mdash; creating a self-reinforcing wave that compresses both
                supply and demand into the same months.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Academic and family schedules.
                </span>{" "}
                Tens of thousands of students graduate from NYC universities
                in May and June, and another wave arrives in late August for
                the new academic year. Families with school-age children
                concentrate moves in summer to align with the school
                calendar. International transplants and corporate relocations
                also cluster in the summer because of school timing and
                fiscal-year hiring cycles.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Weather and logistics.
                </span>{" "}
                Moving in NYC is a physical undertaking &mdash; walkups,
                narrow staircases, and street parking all favor warm,
                long-daylight months. Movers raise rates 30% to 50% in summer
                because they can. Building managers schedule fewer move-ins
                in winter to avoid weather damage to common areas. The
                practical friction of winter moves further compresses
                activity into June through September.
              </p>
            </CardContent>
          </Card>

          {/* Month-by-Month Detail */}
          <h2 className="pt-2 text-2xl font-semibold tracking-tight">
            Month-by-Month Breakdown
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>January &amp; February: The Sweet Spot for Bargain Hunters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                These are the cheapest months to lock in a lease. Asking
                rents are 5% to 10% below the annual average, and concessions
                are at their most generous. It is common to see &quot;1 month
                free on a 13-month lease&quot;, &quot;broker fee paid by
                owner&quot;, or &quot;reduced security deposit&quot; offers
                in this window. Landlords are motivated because vacant
                apartments cost them money during the slowest demand
                months.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  The catch:
                </span>{" "}
                inventory is roughly 40% to 50% lower than the summer peak.
                Many of the most desirable apartments are not on the market,
                because landlords with leases ending in winter often offer
                aggressive renewal discounts to keep tenants in place rather
                than market the unit during slow season. Be flexible on
                neighborhood and unit type, and you can find excellent
                deals.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Best for:
                </span>{" "}
                renters with flexible timing, single professionals not tied
                to a school calendar, anyone prioritizing monthly cost over
                amenities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>March &amp; April: The Awakening</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The market starts shaking off winter. Inventory builds week
                over week as landlords begin listing summer-vacating units
                early to test pricing. Prices are still 1% to 5% below the
                annual average through April, and you can still find
                concessions on units that have been on the market more than
                three weeks.
              </p>
              <p>
                Spring is also when relocating professionals begin scoping
                NYC for a summer move. If you can sign in March or early
                April for a May 1 move-in, you often get the best of both
                worlds &mdash; meaningful selection plus pre-summer pricing.
                Brokers and landlords are hungry to fill before peak
                arrives.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Best for:
                </span>{" "}
                renters who want better selection than winter without paying
                summer prices. Especially good for one-bedroom and
                two-bedroom shoppers in Brooklyn and Queens.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>May: The Tipping Point</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                May is the inflection month. By the second week of May,
                pricing has crossed above the annual average and the
                competitive dynamic flips. Apartments listed in early May
                often sit for 7 to 14 days; the same apartments listed in
                late May often sit for under 5 days. Concessions
                disappear.
              </p>
              <p>
                If you must move in summer, May is the right time to start
                actively touring. Have your documents ready
                (see our{" "}
                <Link
                  href="/blog/rental-application-screening-basics"
                  className="text-primary underline underline-offset-2"
                >
                  rental application checklist
                </Link>
                ) so you can submit within hours of finding the right
                apartment. Hesitation in late May routinely means losing
                apartments to other applicants.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>June, July, August: Peak Season</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The most expensive and most competitive months. Rents hit
                +5% to +10% over the annual average, and the most desirable
                apartments rent within 24 to 72 hours of listing. Bidding
                wars (offering above asking, prepaying multiple months,
                waiving contingencies) become common in popular neighborhoods
                like the East Village, Williamsburg, the West Village, and
                Park Slope.
              </p>
              <p>
                Inventory is at its peak &mdash; 30% to 50% more listings
                than winter &mdash; but so is demand, and listings turn over
                fast. The pace requires a different strategy: do all your
                neighborhood and budget work before May, get pre-qualified
                with documents on hand, and be ready to apply same-day. Tour
                multiple apartments per day during your search week.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Best for:
                </span>{" "}
                renters with inflexible timing (job start date, school year,
                visa start), anyone prioritizing maximum selection, families
                aligning with the school calendar.
              </p>
              <p>
                For more on apartment hunting tactics in a hot market, see
                our{" "}
                <Link
                  href="/nyc-apartment-search-guide"
                  className="text-primary underline underline-offset-2"
                >
                  NYC apartment search guide
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>September: The Mini-Wave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                September brings a smaller, secondary surge driven by
                graduate students, late-arriving transplants, and renters
                who deliberately delayed their search to avoid August
                competition. Inventory remains strong &mdash; many summer
                listings that did not rent get repriced and re-listed
                &mdash; while pricing has eased modestly from August.
              </p>
              <p>
                For renters who can be flexible by 30 to 60 days, September
                is often a smarter choice than peak summer. You see
                substantially more reasonable pricing than July, and the
                inventory carryover from a busy summer means you have real
                options to compare.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>October &amp; November: The Best Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Many experienced NYC renters consider October and November
                the optimal months to lease. By mid-October, summer demand
                has faded but a meaningful share of summer inventory is
                still on the market &mdash; usually because it was
                aggressively priced or had a less obvious flaw the landlord
                has now reduced rent or added concessions to overcome.
              </p>
              <p>
                Pricing settles back to the annual average in October and
                drops 3% to 5% below average by November. Landlords become
                noticeably more responsive to negotiation, especially on
                units that have been listed for over 30 days. Concessions
                begin reappearing in November, particularly on luxury and
                new-development inventory.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Best for:
                </span>{" "}
                renters who can plan ahead a quarter or two, anyone who
                wants a balance of price and selection, anyone targeting
                luxury or new-development inventory at a discount.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>December: The Quiet Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                December is the slowest month of the year. Holiday travel
                and the upcoming year-end pull renters out of the market,
                and few people want to coordinate a December 15 or January 1
                move during the holidays. Listings that have been on the
                market since November and are now into December represent
                the best leverage situations of the entire year &mdash;
                landlords genuinely worried about losing two more months of
                rent to vacancy will agree to terms they would never
                consider in season.
              </p>
              <p>
                If you can move during the second half of December or
                early January, and you can stomach a wintertime move, this
                is when the most aggressive deals get done. Many landlords
                will agree to a 15-month lease structured as 1 month free
                upfront and 14 months paid &mdash; effectively reducing the
                first year by ~7% while preserving the headline rent for
                future renewals.
              </p>
            </CardContent>
          </Card>

          {/* Recommended Search Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Apartment-Hunting Timeline</CardTitle>
              <CardDescription>
                Working backwards from your target move-in date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  90 days out: Decide on neighborhoods and budget
                </h3>
                <p>
                  Use rent comparisons across boroughs to set realistic
                  expectations. Read neighborhood guides (
                  <Link
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village
                  </Link>
                  ,{" "}
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg
                  </Link>
                  ,{" "}
                  <Link
                    href="/nyc/astoria"
                    className="text-primary underline underline-offset-2"
                  >
                    Astoria
                  </Link>
                  ). Run the math on your full move-in cost using our{" "}
                  <Link
                    href="/cost-of-moving-to-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC move-in cost calculator
                  </Link>
                  .
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  60 days out: Get your finances in order
                </h3>
                <p>
                  Pull your credit report, gather your last two pay stubs
                  and most recent W-2 or tax return, line up bank
                  statements, identify references and a guarantor if
                  needed. NYC landlords typically require proof of income at
                  40x the monthly rent, so verify you meet that bar or
                  arrange a guarantor early. If you need a guarantor
                  service, set that up now.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  30 to 45 days out: Begin active touring
                </h3>
                <p>
                  Most NYC apartments are listed only when they are
                  available within 30 days. Schedule 4 to 8 tours per week
                  during your active search window. Aim to tour 8 to 15
                  apartments before applying. Start chatting with our{" "}
                  <Link
                    href="/"
                    className="text-primary underline underline-offset-2"
                  >
                    AI apartment search assistant
                  </Link>{" "}
                  to filter listings against your budget, neighborhoods,
                  and must-haves.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Days 1 to 14 of search: Apply within hours of finding the
                  right apartment
                </h3>
                <p>
                  In peak season especially, hesitation costs you the
                  apartment. Have your application packet ready as a single
                  PDF you can send within 30 minutes of touring. Application
                  fees in NYC are capped at $20 by state law &mdash; do not
                  pay more than that to apply.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  After approval: Lease review and move-in coordination
                </h3>
                <p>
                  Read every clause &mdash; especially renewal terms, late
                  fee policies, broker fee terms, and any rider documents.
                  Coordinate movers 2 to 3 weeks before your move date
                  using our{" "}
                  <Link
                    href="/nyc-apartment-movers"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC moving company comparison
                  </Link>{" "}
                  and run through the{" "}
                  <Link
                    href="/nyc-moving-checklist"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC moving checklist
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Strategy by Renter Type */}
          <Card>
            <CardHeader>
              <CardTitle>Pick a Strategy Based on Who You Are</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Recent grad starting a new job in summer
                </h3>
                <p>
                  You are arriving at the worst possible moment for the
                  rental market, but you have no choice. Compensate by
                  expanding the neighborhoods you consider &mdash; Astoria,
                  Long Island City, Bushwick, Crown Heights, Washington
                  Heights, and Sunnyside all offer better value than
                  Williamsburg, the East Village, or the West Village. Get
                  your guarantor sorted early, line up roommates well in
                  advance, and do all your tours in a focused 10-day
                  sprint.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Flexible professional with remote work
                </h3>
                <p>
                  Aim for a January or February move-in, even if your lease
                  ends in summer. Sublet for the gap or stay with friends.
                  The 5% to 10% you save on annual rent will more than
                  cover bridge costs.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Couple upgrading from a studio to a 1-bedroom
                </h3>
                <p>
                  Target a fall move-in (October or November). Inventory
                  for one-bedrooms is strongest then post-summer carryover,
                  prices are at the annual average or slightly below, and
                  you have leverage to ask for paint, appliance upgrades,
                  or a slightly later move-in.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Family moving with school-age kids
                </h3>
                <p>
                  Summer is non-negotiable for school timing, so accept
                  that. Compensate by starting research earlier: locking in
                  a school district by April, touring in May or early June,
                  applying same-day. Two- and three-bedroom inventory in
                  family-friendly neighborhoods (UWS, Park Slope, Forest
                  Hills, Astoria) goes fast in summer.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Roommate situation forming new
                </h3>
                <p>
                  If everyone has flexibility, target a fall or winter
                  move-in for the best per-person economics. Two-bedroom
                  inventory holds up better than studio inventory in
                  shoulder seasons. Use our{" "}
                  <Link
                    href="/roommates"
                    className="text-primary underline underline-offset-2"
                  >
                    roommate matching tool
                  </Link>{" "}
                  to find compatible housemates before you start touring
                  &mdash; landlords prefer to see all roommates pre-formed
                  on the application.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What to negotiate by season */}
          <Card>
            <CardHeader>
              <CardTitle>What to Negotiate, by Season</CardTitle>
              <CardDescription>
                Your leverage shifts with the calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Season</TableHead>
                      <TableHead>Realistic Asks</TableHead>
                      <TableHead>Likely Outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Winter (Nov-Feb)
                      </TableCell>
                      <TableCell>
                        1-2 months free, broker fee waived, reduced
                        security deposit, 13-15 month term, paint &amp;
                        appliance upgrades
                      </TableCell>
                      <TableCell>Most accepted; landlords motivated</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Spring (Mar-Apr)
                      </TableCell>
                      <TableCell>
                        1 month free or rent reduction, paint &amp;
                        appliance upgrades, free storage, free parking
                      </TableCell>
                      <TableCell>Selectively accepted</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Summer (May-Aug)
                      </TableCell>
                      <TableCell>
                        Paint or minor repairs only; rare exceptions on
                        long-vacant units
                      </TableCell>
                      <TableCell>
                        Most concessions rejected; you are the one
                        competing
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Fall (Sep-Oct)
                      </TableCell>
                      <TableCell>
                        Free month on long-vacant units, paint, broker fee
                        negotiation
                      </TableCell>
                      <TableCell>Frequently accepted by November</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                For more detail on negotiation tactics, see our guide on{" "}
                <Link
                  href="/blog/negotiating-rent-and-lease-terms"
                  className="text-primary underline underline-offset-2"
                >
                  negotiating rent and lease terms
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* Net Effective vs Gross Rent */}
          <Card>
            <CardHeader>
              <CardTitle>
                Net Effective vs Gross Rent: A Critical NYC Concept
              </CardTitle>
              <CardDescription>
                Especially relevant in winter and shoulder seasons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Most NYC concessions take the form of free months rather
                than reduced headline rent. A landlord would rather list an
                apartment at $4,000 with one month free (net effective
                $3,667) than list it at $3,667 outright, because the
                headline rent affects future rent increases and the value
                of the building.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Why it matters:
                </span>{" "}
                when your lease ends, the renewal will reference the
                $4,000 gross rent, not the $3,667 net effective. If the
                landlord offers a 4% renewal increase, that is 4% on
                $4,000 = $4,160, not 4% on $3,667 = $3,814. You can be
                paying $346 more per month on renewal than the actual rent
                you experienced in year one.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  How to handle it:
                </span>{" "}
                in seasons when you have leverage (winter, fall), push for
                rent reduction in addition to or instead of free months.
                Even a $200 reduction in gross rent compounds for every
                future year you stay. If the landlord refuses, ask them to
                cap the renewal increase in writing as a lease addendum.
              </p>
            </CardContent>
          </Card>

          {/* Related Guides */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <Link
                  href="/nyc-rent-by-neighborhood"
                  className="text-primary underline underline-offset-2"
                >
                  NYC rent prices by neighborhood
                </Link>{" "}
                &mdash; what you&apos;ll pay in every borough.
              </p>
              <p>
                <Link
                  href="/cost-of-moving-to-nyc"
                  className="text-primary underline underline-offset-2"
                >
                  Cost of moving to NYC
                </Link>{" "}
                &mdash; full upfront-cost breakdown.
              </p>
              <p>
                <Link
                  href="/nyc-apartment-search-guide"
                  className="text-primary underline underline-offset-2"
                >
                  NYC apartment search guide
                </Link>{" "}
                &mdash; tactics for finding the right place.
              </p>
              <p>
                <Link
                  href="/nyc-moving-checklist"
                  className="text-primary underline underline-offset-2"
                >
                  NYC moving checklist
                </Link>{" "}
                &mdash; what to do, week by week.
              </p>
              <p>
                <Link
                  href="/nyc-apartment-movers"
                  className="text-primary underline underline-offset-2"
                >
                  Best NYC moving companies
                </Link>{" "}
                &mdash; book early in summer.
              </p>
              <p>
                <Link
                  href="/nyc/long-island-city"
                  className="text-primary underline underline-offset-2"
                >
                  Long Island City (LIC) apartments
                </Link>{" "}
                &mdash; the NYC neighborhood with the deepest winter rent concessions.
              </p>
              <p>
                <Link
                  href="/nyc/bushwick"
                  className="text-primary underline underline-offset-2"
                >
                  Bushwick apartments
                </Link>{" "}
                &mdash; Brooklyn&apos;s best value neighborhood, with strong winter discounts.
              </p>
              <p>
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="text-primary underline underline-offset-2"
                >
                  NYC FARE Act broker fee ban
                </Link>{" "}
                &mdash; understand who pays the broker fee.
              </p>
              <p>
                <Link
                  href="/blog/nyc-rent-stabilization-guide"
                  className="text-primary underline underline-offset-2"
                >
                  NYC rent stabilization explained
                </Link>{" "}
                &mdash; check if your apartment qualifies.
              </p>
              <p>
                <Link
                  href="/bad-landlord-nj-ny"
                  className="text-primary underline underline-offset-2"
                >
                  Bad landlord in NJ or NY?
                </Link>{" "}
                &mdash; how to vet a landlord before you sign.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle>Find Your NYC Apartment with AI</CardTitle>
              <CardDescription>
                Tell us your timing, budget, and neighborhoods &mdash; we&apos;ll
                surface listings that fit, in seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
