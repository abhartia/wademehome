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
  title: "NYC Apartment Moving Checklist 2026 | Wade Me Home",
  description:
    "Week-by-week moving checklist for NYC apartments. From giving notice to your landlord through your first week in your new place, every step covered.",
  openGraph: {
    title: "NYC Apartment Moving Checklist 2026 | Wade Me Home",
    description:
      "Week-by-week moving checklist for NYC apartments. From giving notice to your landlord through your first week in your new place, every step covered.",
    url: `${baseUrl}/nyc-moving-checklist`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "NYC Apartment Moving Checklist 2026",
  description:
    "A comprehensive week-by-week guide to moving into a New York City apartment, from giving notice through settling in.",
  step: [
    {
      "@type": "HowToStep",
      name: "8 Weeks Before Your Move",
      text: "Give notice to your current landlord, start apartment search, get pre-approved documents ready.",
    },
    {
      "@type": "HowToStep",
      name: "4 Weeks Before Your Move",
      text: "Book movers with NYC-required COI, get quotes, schedule internet transfer, file USPS mail forwarding.",
    },
    {
      "@type": "HowToStep",
      name: "1 Week Before Your Move",
      text: "Reserve building elevator, confirm key handoff, pack essentials bag, notify doorman or super.",
    },
    {
      "@type": "HowToStep",
      name: "Moving Day",
      text: "Take condition photos, check smoke detectors, test locks, meet the super.",
    },
    {
      "@type": "HowToStep",
      name: "First Week in Your New Apartment",
      text: "Change address on IDs, update voter registration, set up utilities, explore the neighborhood.",
    },
  ],
};

export default function NYCMovingChecklistPage() {
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
              { "@type": "ListItem", position: 3, name: "NYC Moving Checklist", item: `${baseUrl}/nyc-moving-checklist` },
            ],
          }),
        }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <Badge variant="outline">Moving guide</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              NYC Apartment Moving Checklist (2026)
            </h1>
            <p className="text-sm text-muted-foreground">
              Moving in New York is not like moving anywhere else. Between
              building rules, elevator reservations, certificates of insurance,
              and the general chaos of coordinating anything in a city of eight
              million people, having a week-by-week plan is not optional. This
              checklist walks through every phase of a NYC apartment move so
              nothing slips through the cracks.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>8 Weeks Before Your Move</CardTitle>
              <CardDescription>
                Give notice, start searching, get your paperwork in order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Most NYC leases require 30 to 60 days written notice before you
                vacate. Check your lease for the exact clause and send your
                notice via certified mail or the method your landlord specifies.
                If you are on a month-to-month arrangement, 30 days is standard,
                but some buildings require more. Missing the notice window can
                mean you owe an extra month of rent, so treat this step as
                non-negotiable.
              </p>
              <p>
                Start your apartment search now. In most of NYC, apartments hit
                the market 30 to 45 days before availability, which means the
                best inventory for your target move-in date will start appearing
                around this time. Bookmark listings, set up alerts, and get
                familiar with neighborhoods you are considering. If you are
                working with a broker, this is the time to meet with them so
                they understand your requirements before the rush.
              </p>
              <p>
                Gather your application documents early. You will need recent pay
                stubs (typically three months), your most recent tax return, two
                to three months of bank statements, an employment verification
                letter, a government-issued photo ID, and references from prior
                landlords. Having these ready in a single folder means you can
                apply the same day you see a place you like, which makes a real
                difference in a competitive market.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4 Weeks Before</CardTitle>
              <CardDescription>
                Lock in movers, utilities, and mail forwarding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Book your movers now. Four weeks is the minimum lead time for
                most reputable NYC moving companies, and during peak season (May
                through September) you may need six weeks or more. Many NYC
                buildings require a Certificate of Insurance (COI) from your
                moving company naming the building or management company as an
                additional insured. Ask your new building&apos;s management office
                what they need, and pass those details to your movers immediately
                so the COI arrives before moving day.
              </p>
              <p>
                Get at least three in-person or video estimates. Hourly rates in
                NYC typically range from $150 to $250 per hour for a two- to
                three-person crew, and most companies have a two- to four-hour
                minimum. Ask about stair surcharges if you are in a walk-up,
                long carry fees if the truck cannot park near your entrance, and
                whether the estimate is binding or non-binding. A binding
                estimate locks the price; a non-binding one can increase.
              </p>
              <p>
                Schedule your internet transfer or new installation. ISPs in NYC
                often have one- to three-week lead times for technician visits,
                and self-install kits are not always available in older buildings.
                File your USPS mail forwarding online at usps.com, which takes
                seven to ten business days to activate. Notify your bank, credit
                cards, subscriptions, and employer of your upcoming address
                change.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1 Week Before</CardTitle>
              <CardDescription>
                Building logistics and final preparations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Reserve the freight or service elevator at your new building. In
                many doorman buildings, elevator reservations fill up fast,
                especially on weekends and the first and last days of the month.
                Contact the management office or super to confirm your time
                slot, the loading dock or entrance your movers should use, and
                any restricted hours. Some buildings only allow moves between
                9 AM and 5 PM on weekdays, which can affect your planning.
              </p>
              <p>
                Confirm the key handoff plan with your new landlord or
                management company. Will you pick up keys from a leasing office,
                meet the super at the apartment, or get them from a lockbox? If
                your move-in time is early morning, make sure someone will
                actually be available. Also confirm the elevator reservation at
                your current building if applicable, so your movers can load out
                smoothly.
              </p>
              <p>
                Pack an essentials bag with everything you will need for the
                first 24 hours: phone charger, medications, toiletries, a change
                of clothes, basic cleaning supplies, paper towels, toilet paper,
                a shower curtain, and any important documents. If you have pets,
                arrange for them to stay with a friend or at a boarding facility
                on moving day. Notify your current doorman or super of your
                move-out date and time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moving Day</CardTitle>
              <CardDescription>
                Document everything and verify the basics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Before you bring a single box into your new apartment, walk
                through every room and take detailed condition photos. Photograph
                walls, floors, ceilings, appliances, fixtures, windows, and any
                existing damage. These photos are your protection when it comes
                time to get your security deposit back. Send a set to your
                landlord or management company the same day and keep your own
                timestamped copies. This step takes fifteen minutes and can save
                you thousands.
              </p>
              <p>
                Check that all smoke detectors and carbon monoxide detectors are
                present and functioning. NYC law requires them in specific
                locations, and your landlord is responsible for providing
                working units at move-in. Test every lock on every door,
                including the deadbolt. Run water in every faucet and flush
                every toilet to check for leaks or slow drains. Turn on the
                stove and oven to make sure gas is flowing. Open and close
                every window.
              </p>
              <p>
                Meet the building super if you have not already. They are often
                the single most useful person to know in your building. They
                handle maintenance requests, package deliveries, building
                access issues, and a dozen other things you will need help with
                over the course of your lease. Introduce yourself, get their
                phone number, and ask about trash and recycling schedules,
                laundry room hours, and any building rules specific to your
                unit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>First Week</CardTitle>
              <CardDescription>
                Settle in and update your records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Update your address on your driver&apos;s license or state ID. In
                New York, you are legally required to update your address with
                the DMV within ten days of moving. You can do this online at the
                NY DMV website. While you are at it, update your voter
                registration at the NYC Board of Elections website so you are
                registered at your new address before the next election.
              </p>
              <p>
                Set up your utilities if they were not transferred automatically.
                In most of NYC, electricity is through Con Edison, and gas may
                be through Con Ed or National Grid depending on your borough.
                Call or go online to put the account in your name with your
                move-in date. If the previous tenant left an outstanding
                balance, it is not your responsibility, but you may need to
                provide your lease to prove you are a new tenant.
              </p>
              <p>
                Take time to explore your new neighborhood. Find the nearest
                grocery store, pharmacy, laundromat (if your building does not
                have laundry), subway entrance, and urgent care. Figure out
                which restaurants deliver to your address and download any
                building-specific apps your management company uses for
                maintenance requests or package notifications. The first week
                is also a good time to note anything in the apartment that needs
                repair and submit maintenance requests while everything is
                fresh.
              </p>
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
                    href="/blog/utilities-internet-move-in"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Setting Up Utilities and Internet
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
                    href="/blog/security-deposits-move-in-fees"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Security Deposits and Move-In Fees
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
                    href="/nyc-apartment-movers"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Apartment Movers Comparison
                  </Link>
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
                    NYC Rent by Neighborhood
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Start your move with Wade Me Home
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
