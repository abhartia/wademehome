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
  title: "NYC Apartment Movers (2026): Costs, COI Rules & How to Hire | Wade Me Home",
  description:
    "2026 guide to hiring apartment movers in NYC. Studio $450–$900, 1BR $800–$1,500, 2BR $1,200–$2,500. COI requirements, walk-up flight surcharges, peak-season pricing, scam red flags, and step-by-step booking timeline for Manhattan, Brooklyn, and Queens.",
  keywords: [
    "apartment movers NYC",
    "NYC moving companies",
    "manhattan apartment movers",
    "NYC movers cost",
    "moving company NYC apartments",
    "best movers NYC",
    "NYC moving guide",
    "Brooklyn movers",
    "NYC moving cost 2026",
    "studio movers NYC cost",
    "1 bedroom movers NYC cost",
    "2 bedroom movers NYC cost",
    "NYC walk-up moving cost",
    "COI for NYC apartment building",
    "moving certificate of insurance NYC",
    "movers NYC peak season",
    "summer movers NYC",
    "Queens apartment movers",
    "NJ to NYC movers",
    "long distance NYC movers cost",
    "NYC moving day checklist",
    "NYC mover deposit",
    "movers NYC tip",
    "USDOT NYC mover",
  ],
  openGraph: {
    title: "NYC Apartment Movers (2026): Costs, COI Rules & How to Hire",
    description:
      "2026 guide to hiring apartment movers in NYC. Costs by apartment size, COI requirements, walk-up surcharges, peak-season pricing, scam red flags, and booking timeline.",
    url: `${baseUrl}/nyc-apartment-movers`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc-apartment-movers` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "NYC Apartment Movers (2026): Costs, COI Rules & How to Hire",
    description:
      "A 2026 guide to hiring movers for New York City apartment moves, covering building requirements, costs by apartment size, peak-season pricing, scam prevention, and frequently asked questions.",
    datePublished: "2026-04-17",
    dateModified: "2026-04-27",
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
    mainEntityOfPage: `${baseUrl}/nyc-apartment-movers`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When should I book movers in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Book at least 4 to 6 weeks in advance. During peak season (May through September), 6 to 8 weeks is safer. First and last days of the month are the busiest and book up fastest.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to tip movers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tipping is customary but not mandatory. A common range is $20 to $40 per mover for a half-day job and $40 to $60 per mover for a full-day job. Tip more for walk-ups, heavy items, or exceptional service.",
        },
      },
      {
        "@type": "Question",
        name: "What about walk-up buildings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Walk-ups typically incur a stair surcharge, usually $50 to $75 per flight above the first floor. Moving out of a fifth-floor walk-up with a full one-bedroom of furniture can easily add $200 or more to the total cost.",
        },
      },
      {
        "@type": "Question",
        name: "Should I get moving insurance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Basic carrier liability (included by law) covers only $0.60 per pound per item, which means a 50-pound TV is covered for $30 regardless of its value. Full-value protection costs more but covers the actual replacement cost of damaged items.",
        },
      },
      {
        "@type": "Question",
        name: "What is a Certificate of Insurance (COI)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A COI is a document from the moving company's insurer naming your building as an additional insured. Many NYC buildings require this before allowing movers into the building. Ask your building management for the specific requirements and give your movers at least a week to provide it.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to move a studio in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A studio move within the five boroughs typically runs $450 to $900 in 2026. The low end assumes a two-person crew, a 3-hour minimum at $150/hr, ground-floor pickup and delivery, and no large furniture. The high end reflects a fifth-floor walk-up move with stair surcharges, packing materials, and a longer carry from the truck. Studios usually do not need a third mover, which keeps the hourly rate lower than a one-bedroom move.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to move a 1-bedroom in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A one-bedroom move within the five boroughs typically runs $800 to $1,500 in 2026. Most companies dispatch a three-person crew at $200 to $250/hr with a 4-hour minimum. Add $50 to $75 per flight for walk-ups (both pickup and delivery), $100 to $200 for long carries beyond 75 feet from the truck, and $50 to $100 for materials. Inter-borough moves (Manhattan to Brooklyn, Queens to Manhattan, etc.) run on the higher end of the range due to traffic and bridge tolls.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to move a 2-bedroom in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A two-bedroom move within the five boroughs typically runs $1,200 to $2,500 in 2026. Plan on a three-to-four-person crew, a 5-to-7-hour job at $250 to $350/hr, plus standard surcharges for stairs, long carries, and materials. Two-bedrooms with a piano, oversized art, or a heavy sectional couch can push the total to $2,500 to $3,500 depending on the specialty handling required.",
        },
      },
      {
        "@type": "Question",
        name: "Are NYC movers more expensive in summer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — NYC mover hourly rates run 20% to 35% higher in May through August, and the most-reviewed companies book up 4 to 6 weeks in advance for the first and last days of each month. Off-peak (October through February) rates can drop 10% to 20% below the annual average, and you can usually book a reputable company with 1 to 2 weeks of lead time. A mid-month weekday move in winter is the cheapest combination of variables available.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to reserve the elevator before my NYC move?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In most doorman or elevator buildings, yes. Building management requires the freight elevator to be reserved in advance, and there are usually fixed move-in windows (commonly 9 AM to 5 PM weekdays, with shorter Saturday hours and no Sunday or holiday moves). Reserve as soon as your lease is signed — popular buildings on the 1st of the month can be booked out 30+ days. There may be a refundable elevator deposit ($300 to $500 is typical) plus a non-refundable move-in fee from the building.",
        },
      },
      {
        "@type": "Question",
        name: "Should I tip NYC movers in cash or by card?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cash is preferred and more common in NYC. Plan to give the cash directly to each mover at the end of the job, not to the foreman to distribute. Standard ranges are $20 to $40 per mover for a half-day job and $40 to $60 per mover for a full-day move; tip on the higher end for fifth-floor walk-ups, oversized items, or exceptional service. Some companies allow card-based tips on the final invoice, but distribution to individual crew members is often slower or partial.",
        },
      },
      {
        "@type": "Question",
        name: "What does a moving 'long carry' fee mean in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A long carry fee is charged when the moving truck cannot park within a certain distance of the building entrance, typically 75 feet. In Manhattan especially, double-parking the truck and walking everything down a long block or through a service entrance is common, and the fee covers the extra labor time. Expect $100 to $200 per long carry; ask your mover whether the entrance situation at both ends would trigger one before signing the binding estimate.",
        },
      },
    ],
  },
];

export default function NYCApartmentMoversPage() {
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
              { "@type": "ListItem", position: 3, name: "NYC Apartment Movers", item: `${baseUrl}/nyc-apartment-movers` },
            ],
          }),
        }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Moving</Badge>
              <Badge variant="secondary">2026 Pricing</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              NYC Apartment Movers (2026): Costs, COI Rules &amp; How to Hire
            </h1>
            <p className="text-sm text-muted-foreground">
              Hiring movers in New York City comes with a set of
              considerations you will not encounter in most other cities.
              Buildings have strict insurance requirements, elevators need to
              be reserved, peak-season hourly rates run 20–35% above winter,
              and the difference between a reputable company and a scam
              operation can be hard to spot. This guide covers 2026 costs by
              apartment size, COI and elevator-reservation rules, walk-up
              flight surcharges, scam red flags, and a step-by-step booking
              timeline.
            </p>
            <p className="text-xs text-muted-foreground">
              Reviewed 2026-04-27 &middot; Pricing reflects NYC market rates as
              of late April 2026, before the May–August peak surcharge cycle.
            </p>
          </header>

          {/* Cost by apartment size */}
          <Card>
            <CardHeader>
              <CardTitle>NYC Mover Cost by Apartment Size (2026)</CardTitle>
              <CardDescription>
                Local move within the five boroughs, ground-floor to
                ground-floor baseline; add surcharges for stairs, long
                carries, and peak season
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Apartment Size</TableHead>
                      <TableHead>Crew</TableHead>
                      <TableHead>Hourly Rate</TableHead>
                      <TableHead>Typical Job Length</TableHead>
                      <TableHead>Typical Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Studio</TableCell>
                      <TableCell>2 movers</TableCell>
                      <TableCell>$150 – $200</TableCell>
                      <TableCell>3 – 4 hrs</TableCell>
                      <TableCell>$450 – $900</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">1-Bedroom</TableCell>
                      <TableCell>3 movers</TableCell>
                      <TableCell>$200 – $250</TableCell>
                      <TableCell>4 – 5 hrs</TableCell>
                      <TableCell>$800 – $1,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2-Bedroom</TableCell>
                      <TableCell>3 – 4 movers</TableCell>
                      <TableCell>$250 – $350</TableCell>
                      <TableCell>5 – 7 hrs</TableCell>
                      <TableCell>$1,200 – $2,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">3-Bedroom</TableCell>
                      <TableCell>4 – 5 movers</TableCell>
                      <TableCell>$350 – $450</TableCell>
                      <TableCell>7 – 10 hrs</TableCell>
                      <TableCell>$2,200 – $4,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        NJ &harr; NYC (1BR)
                      </TableCell>
                      <TableCell>3 movers</TableCell>
                      <TableCell>flat $1,200 – $2,200</TableCell>
                      <TableCell>full-day</TableCell>
                      <TableCell>$1,200 – $2,200</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Studios usually skip the third mover; 2BR and larger benefit
                from a third or fourth mover to keep job length manageable.
                Long-distance and inter-state moves are quoted as flat-rate
                rather than hourly.
              </p>
            </CardContent>
          </Card>

          {/* Peak-season surcharge table */}
          <Card>
            <CardHeader>
              <CardTitle>Peak-Season Hourly Rate Surcharge</CardTitle>
              <CardDescription>
                What you actually pay each month relative to the annual
                average — book early and ideally off-peak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Hourly Rate vs. Avg</TableHead>
                      <TableHead>Lead Time to Book</TableHead>
                      <TableHead>Cancellation Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">January</TableCell>
                      <TableCell>-15% to -20%</TableCell>
                      <TableCell>1 week</TableCell>
                      <TableCell>Low</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">February</TableCell>
                      <TableCell>-10% to -15%</TableCell>
                      <TableCell>1 week</TableCell>
                      <TableCell>Low</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">March / April</TableCell>
                      <TableCell>-5% to baseline</TableCell>
                      <TableCell>2 weeks</TableCell>
                      <TableCell>Low</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">May</TableCell>
                      <TableCell>+10% to +20%</TableCell>
                      <TableCell>4 weeks</TableCell>
                      <TableCell>Moderate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">June</TableCell>
                      <TableCell>+25% to +35%</TableCell>
                      <TableCell>6 weeks</TableCell>
                      <TableCell>High</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">July / August</TableCell>
                      <TableCell>+20% to +30%</TableCell>
                      <TableCell>6 – 8 weeks</TableCell>
                      <TableCell>High</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">September</TableCell>
                      <TableCell>+10% to +15%</TableCell>
                      <TableCell>3 – 4 weeks</TableCell>
                      <TableCell>Moderate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Oct – Dec</TableCell>
                      <TableCell>baseline to -10%</TableCell>
                      <TableCell>2 weeks</TableCell>
                      <TableCell>Low</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                The 1st and last days of each month book up first regardless
                of season. Mid-month weekday moves are cheaper and more
                reliable in every season; if your lease lets you push your
                move-in by a week, you can save 10% or more.
              </p>
            </CardContent>
          </Card>

          {/* Walk-up flight surcharge */}
          <Card>
            <CardHeader>
              <CardTitle>Walk-Up Flight Surcharges</CardTitle>
              <CardDescription>
                Per-flight fees and what they add to a typical move
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Walk-Up Floor</TableHead>
                      <TableHead>Per-Flight Fee</TableHead>
                      <TableHead>Studio Add</TableHead>
                      <TableHead>1BR Add</TableHead>
                      <TableHead>2BR Add</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">2nd floor</TableCell>
                      <TableCell>$50 – $75</TableCell>
                      <TableCell>$50</TableCell>
                      <TableCell>$75</TableCell>
                      <TableCell>$100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">3rd floor</TableCell>
                      <TableCell>$50 – $75 / flight</TableCell>
                      <TableCell>$100</TableCell>
                      <TableCell>$150</TableCell>
                      <TableCell>$200</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">4th floor</TableCell>
                      <TableCell>$50 – $75 / flight</TableCell>
                      <TableCell>$150</TableCell>
                      <TableCell>$225</TableCell>
                      <TableCell>$300</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">5th floor</TableCell>
                      <TableCell>$50 – $75 / flight</TableCell>
                      <TableCell>$200</TableCell>
                      <TableCell>$300</TableCell>
                      <TableCell>$400</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">6th floor +</TableCell>
                      <TableCell>$60 – $100 / flight</TableCell>
                      <TableCell>$250+</TableCell>
                      <TableCell>$400+</TableCell>
                      <TableCell>$550+</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Surcharges apply at <em>both</em> the pickup and the
                destination. A 4th-floor East Village walkup to a 4th-floor
                Williamsburg walkup is two sets of flight surcharges, not one.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choosing Movers for NYC Apartments</CardTitle>
              <CardDescription>
                Building rules make NYC moves different
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Before you compare moving companies, find out what your
                building requires. Most managed buildings in NYC need a
                Certificate of Insurance (COI) from the moving company,
                listing the building or management company as an additional
                insured party. Some buildings also require proof of workers&apos;
                compensation coverage. Without these documents, your movers
                may be turned away at the door on moving day.
              </p>
              <p>
                Elevator reservations are another building-specific
                requirement. In doorman and concierge buildings, the freight
                elevator must be booked in advance, and there may be specific
                windows for move-ins (often 9 AM to 5 PM weekdays, or 9 AM to
                1 PM Saturdays). Some buildings ban moves on Sundays and
                holidays entirely. Ask your building management for the rules
                and reserve your slot as soon as your lease is signed.
              </p>
              <p>
                If you are moving into or out of a walk-up, factor that into
                your mover selection. Not all moving crews are willing to
                handle a fifth-floor walk-up, and those that are will charge
                a per-flight stair surcharge. Be upfront about the number of
                flights during the estimate so the quoted price reflects
                reality. Also consider the width of the stairwell and
                doorways. Narrow pre-war staircases can make it impossible to
                move large furniture without disassembly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What to Ask Before Hiring</CardTitle>
              <CardDescription>
                Vetting questions that separate good movers from bad ones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Every legitimate interstate moving company has a USDOT number
                registered with the Federal Motor Carrier Safety Administration.
                For local moves within New York State, movers should be licensed
                with the NY Department of Transportation. Ask for their license
                number and verify it online before signing anything. If they
                cannot provide a license number, walk away.
              </p>
              <p>
                Ask whether the estimate is binding or non-binding. A binding
                estimate means the price you are quoted is the price you pay,
                regardless of how long the move takes. A non-binding estimate
                is a guess, and the final cost can be higher. For most NYC
                apartment moves, an hourly rate with a minimum number of hours
                is standard, but make sure you understand what is included.
                Does the quote cover packing materials? Furniture disassembly
                and reassembly? Wrapping for mattresses and mirrors?
              </p>
              <p>
                Insist on an in-person or video estimate for any move larger
                than a studio. Phone estimates based on a verbal description
                of your belongings are notoriously inaccurate. A reputable
                mover will want to see what they are moving before committing
                to a price. During the estimate, point out any items that
                require special handling: pianos, antiques, oversized artwork,
                or anything particularly fragile.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NYC Moving Costs</CardTitle>
              <CardDescription>
                What to budget for a local NYC move
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                For a local move within the five boroughs, expect to pay $150
                to $250 per hour for a crew of two to three movers and a truck.
                Most companies have a minimum of two to four hours. A typical
                one-bedroom apartment move takes three to five hours, putting
                the total in the $450 to $1,250 range depending on the company,
                the distance, and any complications like stairs or long
                carries from the truck to the entrance.
              </p>
              <p>
                Stair surcharges typically run $50 to $75 per flight above the
                first floor, applied at both the pickup and delivery locations.
                Long carry fees kick in when the truck cannot park within a
                certain distance of the building entrance, usually 75 feet.
                In Manhattan, where double parking the truck and running
                everything down a long hallway is common, these fees add up.
                Some companies also charge extra for moves before 8 AM or after
                6 PM.
              </p>
              <p>
                The total cost of a NYC move often surprises people. Between
                the movers themselves, tips, packing materials, and incidental
                fees, a straightforward one-bedroom move can easily run $800 to
                $1,500. Two-bedrooms range from $1,200 to $2,500. Factor these
                costs into your moving budget alongside the security deposit,
                first month&apos;s rent, and any broker fee.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Red Flags and Scam Prevention</CardTitle>
              <CardDescription>
                How to avoid the worst-case scenario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Moving scams are a real problem, and NYC is not exempt. Common
                red flags include an unusually low estimate designed to win your
                business (bait-and-switch pricing), a demand for a large cash
                deposit upfront, no physical office address, and a refusal to
                provide a written estimate or USDOT number. If anything feels
                off during the estimate process, trust your instincts and get
                quotes from other companies.
              </p>
              <p>
                One of the worst scams involves movers loading your belongings
                onto the truck and then demanding a much higher price before
                they will deliver. Your furniture is effectively held hostage.
                Protect yourself by getting a binding written estimate, paying
                by credit card rather than cash (so you can dispute charges),
                and reading recent reviews on multiple platforms. A company
                with no online presence or exclusively five-star reviews on a
                single platform is suspicious.
              </p>
              <p>
                No-shows are another common issue. Some estimates suggest that
                over a quarter of budget movers fail to show up on the
                scheduled date. To protect yourself, confirm your booking a
                week before and again the day before the move. Have a backup
                plan in case your movers do not show: the name of another
                company you vetted, a friend with a truck, or a flexible
                enough timeline that you can reschedule without losing your
                elevator reservation.
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
                  When should I book movers?
                </h3>
                <p className="mt-1">
                  Book at least four to six weeks in advance. During peak season
                  (May through September), six to eight weeks is safer. The
                  first and last days of the month are the busiest and fill up
                  fastest. If you have flexibility, a mid-month weekday move
                  will be easier to book and may be cheaper.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Do I need to tip movers?
                </h3>
                <p className="mt-1">
                  Tipping is customary but not required. A common range is $20
                  to $40 per mover for a half-day job and $40 to $60 per mover
                  for a full-day move. If your movers carried everything up five
                  flights or handled your grandmother&apos;s antique dresser with
                  care, tip on the higher end. Cash is standard.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  What about walk-up buildings?
                </h3>
                <p className="mt-1">
                  Walk-ups are a fact of life in much of NYC. Most movers charge
                  a per-flight stair surcharge, typically $50 to $75 per flight
                  above the ground floor. A full one-bedroom move out of a
                  fifth-floor walk-up can add $200 or more. Make sure you
                  disclose the floor and stair situation during the estimate so
                  there are no surprises.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Should I get moving insurance?
                </h3>
                <p className="mt-1">
                  Basic carrier liability (required by law) covers only $0.60
                  per pound per item. That means your 10-pound laptop is covered
                  for $6. Full-value protection, which covers the actual
                  replacement cost or repair of damaged items, is an add-on that
                  typically costs a few hundred dollars. If you own anything
                  valuable or irreplaceable, it is worth the extra cost. Also
                  check whether your renters insurance policy covers belongings
                  in transit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  What is a Certificate of Insurance (COI)?
                </h3>
                <p className="mt-1">
                  A COI is a document from the moving company&apos;s insurer that
                  names your building (or its management company) as an
                  additional insured. Many NYC buildings require this before
                  allowing movers into the building. Ask your building
                  management for the exact requirements (insured name, address,
                  minimum coverage amounts) and give your movers at least a
                  week to provide it. Some movers charge a small fee for
                  additional COIs.
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
                    href="/best-time-to-rent-nyc"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Best Time to Rent in NYC (2026)
                  </Link>{" "}
                  &mdash; sync your apartment search with mover availability
                </li>
                <li>
                  <Link
                    href="/cost-of-moving-to-nyc"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Full NYC Move-In Cost Breakdown (2026)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-moving-checklist"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Moving Checklist
                  </Link>{" "}
                  &mdash; week-by-week move-out and move-in tasks
                </li>
                <li>
                  <Link
                    href="/nyc-move-in-cleaning"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Move-In Cleaning Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Rent by Neighborhood (2026)
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
                    href="/blog/move-in-day-documentation"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Move-In Day Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC FARE Act Broker Fee Ban
                  </Link>{" "}
                  &mdash; how the 2025 broker-fee law changes the move-in
                  budget
                </li>
                <li>
                  <Link
                    href="/tools/move-in-cost-estimator"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Move-In Cost Estimator
                  </Link>{" "}
                  &mdash; interactive total move-in cost (rent + deposit +
                  movers)
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Plan your move with Wade Me Home
              </Link>
            </Button>
          </div>

          <Separator />
          <p className="text-xs text-muted-foreground">
            Looking for a place to rent?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Start on the home page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
