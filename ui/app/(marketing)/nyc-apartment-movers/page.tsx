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
  title: "NYC Apartment Movers: Costs, Building Rules & How to Hire | Wade Me Home",
  description:
    "Complete guide to hiring apartment movers in NYC. Costs ($450-$2,500), COI requirements, walk-up surcharges, scam red flags, and FAQs for Manhattan, Brooklyn, and Queens moves.",
  keywords: [
    "apartment movers NYC",
    "NYC moving companies",
    "manhattan apartment movers",
    "NYC movers cost",
    "moving company NYC apartments",
    "best movers NYC",
    "NYC moving guide",
    "Brooklyn movers",
  ],
  openGraph: {
    title: "NYC Apartment Movers: Costs, Building Rules & How to Hire",
    description:
      "Complete guide to hiring apartment movers in NYC. Costs, COI requirements, walk-up surcharges, scam red flags, and FAQs.",
    url: `${baseUrl}/nyc-apartment-movers`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Movers for NYC Apartments",
    description:
      "A guide to hiring movers for New York City apartment moves, covering building requirements, costs, scam prevention, and frequently asked questions.",
    publisher: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
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
            <Badge variant="outline">Moving</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              Choosing Movers for NYC Apartments
            </h1>
            <p className="text-sm text-muted-foreground">
              Hiring movers in New York City comes with a set of
              considerations you will not encounter in most other cities.
              Buildings have strict insurance requirements, elevators need to
              be reserved, and the difference between a reputable company and
              a scam operation can be hard to spot. This guide covers what to
              look for, what to avoid, and what to expect to pay.
            </p>
          </header>

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
                    href="/nyc-rent-by-neighborhood"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Rent by Neighborhood 2026
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
