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
  title: "NYC Move-In Cleaning Services Guide | Wade Me Home",
  description:
    "Everything about move-in cleaning for NYC apartments. Professional cleaning costs, what is included, building access rules, and a DIY checklist.",
  openGraph: {
    title: "NYC Move-In Cleaning Services Guide | Wade Me Home",
    description:
      "Everything about move-in cleaning for NYC apartments. Professional cleaning costs, what is included, building access rules, and a DIY checklist.",
    url: `${baseUrl}/nyc-move-in-cleaning`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "NYC Move-In Cleaning Services Guide",
    description:
      "A comprehensive guide to move-in cleaning for New York City apartments, covering professional services, costs, building considerations, and DIY options.",
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
        name: "How far in advance should I book a move-in cleaning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Book at least one to two weeks in advance, especially if you are moving during peak season (May through September). Last-minute bookings are possible but may cost more and limit your choice of cleaning companies.",
        },
      },
      {
        "@type": "Question",
        name: "Is move-in cleaning different from regular cleaning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. A move-in deep clean covers areas that regular cleaning skips: inside cabinets and closets, behind and under appliances, window tracks, baseboard details, and full bathroom sanitization. It is more thorough and takes longer because the apartment is empty and every surface is accessible.",
        },
      },
      {
        "@type": "Question",
        name: "Do I clean before or after movers arrive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Clean before movers arrive whenever possible. An empty apartment is much easier to deep clean, and you want to unpack into a clean space. If timing does not allow it, at minimum clean the kitchen and bathroom before the movers show up, and do the rest after.",
        },
      },
    ],
  },
];

export default function NYCMoveInCleaningPage() {
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
            <Badge variant="outline">Cleaning</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              NYC Move-In Cleaning Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              You signed the lease, you have the keys, and now you are staring
              at an apartment that looks clean from the hallway but reveals
              grime the moment you open a cabinet. Move-in cleaning is one of
              the most overlooked parts of a NYC apartment move, and getting it
              right makes the difference between unpacking into a fresh start
              and discovering the previous tenant&apos;s leftovers for weeks.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Why Deep-Clean Before Unpacking</CardTitle>
              <CardDescription>
                Start fresh in your new space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Even in buildings where management does a turnover cleaning
                between tenants, the standard is often a quick surface wipe
                rather than a genuine deep clean. Cabinets may have crumbs in
                the corners, bathroom grout may be discolored, and the inside
                of the oven likely has not been touched. In older NYC
                buildings, apartments can turn over quickly, and the cleaning
                crew may have had a single day (or less) to work.
              </p>
              <p>
                Cleaning an empty apartment is dramatically easier than
                cleaning around furniture. Once your boxes and bed frame are
                in place, you are never going to pull the refrigerator out to
                clean behind it or scrub the back of every closet shelf. The
                window between getting the keys and the movers arriving is your
                best (and possibly only) chance to start completely clean.
              </p>
              <p>
                Document the apartment&apos;s condition before and after cleaning.
                Take photos of any stains, damage, or uncleanliness you find
                before you start. These protect you when it comes time to get
                your security deposit back, because anything that was dirty or
                damaged when you moved in should not be held against you at
                move-out. A timestamped photo set sent to your landlord on day
                one is worth its weight in gold.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What Professional Move-In Cleaning Includes</CardTitle>
              <CardDescription>
                More than just vacuuming and mopping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                A professional move-in deep clean covers the kitchen
                thoroughly: inside the oven, behind and under the refrigerator,
                the range hood and exhaust fan, inside all cabinets and
                drawers, the dishwasher interior, and every countertop surface.
                In NYC kitchens, where space is tight and grease builds up
                fast, this alone can take an hour or more.
              </p>
              <p>
                Bathrooms get full sanitization: toilet, tub, shower walls and
                door, sink, vanity, mirrors, grout lines, and tile. In older
                buildings with decades-old grout, professional cleaners can
                often make a meaningful difference in appearance and hygiene
                that casual scrubbing cannot. The bathroom exhaust fan and any
                accessible ductwork are also cleaned.
              </p>
              <p>
                The rest of the apartment gets attention too: all windows
                (interior side), window sills and tracks, baseboards and trim,
                light fixtures and switch plates, inside all closets, radiator
                covers, door frames, and all floor surfaces. Some services also
                include interior wall wiping and light fixture cleaning for an
                additional fee. The goal is that every surface you or your
                belongings will touch has been cleaned.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NYC-Specific Considerations</CardTitle>
              <CardDescription>
                Building access and scheduling logistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                In doorman and concierge buildings, you may need to notify
                management in advance that a cleaning crew will be coming.
                Some buildings require the cleaning company to provide a
                Certificate of Insurance (COI), just like movers. Ask your
                building management office about their policy when you pick up
                your keys. If a COI is needed, give your cleaning company at
                least a few days to provide one.
              </p>
              <p>
                Service elevator rules can affect scheduling. If your building
                requires the service elevator for large equipment (carpet
                cleaners, floor machines), you may need to reserve it
                separately from your moving day reservation. Some buildings
                restrict cleaning crew access to certain hours, which can be an
                issue if you are trying to squeeze in a deep clean the morning
                of your move.
              </p>
              <p>
                Timing the clean around your move-in window is the biggest
                logistical challenge. Ideally, you get the keys a day or two
                before the movers arrive and schedule the deep clean for that
                gap. If same-day cleaning and moving is unavoidable, schedule
                the cleaners for the earliest possible slot and the movers for
                the afternoon. Communicate the timeline to both parties so
                everyone knows the constraints.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Ranges</CardTitle>
              <CardDescription>
                What to expect to pay in NYC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Move-in deep cleaning in NYC costs more than a standard
                recurring clean because it is more labor-intensive and the
                apartment is typically dirtier than a regularly maintained
                space. Studios generally run $150 to $250, one-bedrooms $200 to
                $350, two-bedrooms $300 to $500, and three-bedrooms or larger
                $400 to $700. These ranges reflect the NYC market as of 2026
                and vary by neighborhood, building type, and apartment
                condition.
              </p>
              <p>
                The difference between a standard clean and a deep clean is
                significant. A standard clean covers visible surfaces (floors,
                counters, bathroom fixtures) and takes one to two hours. A deep
                clean covers everything the standard does plus the interior of
                appliances, inside cabinets, baseboards, window tracks, and
                other areas that only get attention during a thorough session.
                For a move-in, always opt for the deep clean.
              </p>
              <p>
                Some factors push costs toward the higher end of these ranges:
                very dirty apartments (especially after long-term tenants), pet
                hair and odor remediation, buildings in Manhattan (where
                operating costs for cleaning companies are higher), and
                last-minute bookings during peak moving season. Getting quotes
                from two or three companies and having them see photos of the
                apartment helps you get an accurate price.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DIY Move-In Cleaning Checklist</CardTitle>
              <CardDescription>
                Room-by-room guide if you are doing it yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Kitchen:</strong> Start
                with the oven, running the self-clean cycle if available or
                using oven cleaner. Clean the inside of the refrigerator and
                freezer with a baking soda solution. Wipe the inside of all
                cabinets and drawers before putting in shelf liner. Clean the
                stovetop, range hood filter (soak in hot soapy water), and
                dishwasher (run an empty cycle with a cup of vinegar). Scrub
                the sink and faucet, wipe countertops, and clean under the
                sink.
              </p>
              <p>
                <strong className="text-foreground">Bathroom:</strong> Apply
                bathroom cleaner to the tub, shower, and toilet and let it sit
                while you work on other surfaces. Clean the mirror, sink, and
                vanity. Scrub grout lines with a brush and grout cleaner. Wipe
                down the toilet exterior, flush handle, and base. Clean the
                exhaust fan cover (remove it, soak in soapy water, and let it
                dry). Finish by mopping the floor, paying attention to corners
                and behind the toilet.
              </p>
              <p>
                <strong className="text-foreground">Living areas and
                bedrooms:</strong> Wipe all baseboards, door frames, and light
                switch plates. Clean window sills and tracks (a vacuum
                attachment works well for the tracks). Wipe inside all closets
                including shelves and rods. Dust light fixtures. If you have
                hardwood floors, a damp mop with an appropriate wood cleaner
                is sufficient. For carpet, a thorough vacuuming is a start, but
                consider renting a carpet cleaner for a truly fresh result.
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
                  How far in advance should I book?
                </h3>
                <p className="mt-1">
                  Book at least one to two weeks in advance, especially during
                  peak moving season (May through September). Last-minute
                  bookings are possible but limit your options and may cost
                  more. If you know your key pickup date, schedule the cleaning
                  as soon as the date is confirmed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Is move-in cleaning different from regular cleaning?
                </h3>
                <p className="mt-1">
                  Yes, substantially. A move-in deep clean covers the inside of
                  appliances, cabinets, closets, window tracks, and other areas
                  that regular cleaning skips. It takes longer, costs more, and
                  is far more thorough. The empty apartment makes every surface
                  accessible in a way that is not possible once furniture is in
                  place.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Do I clean before or after movers?
                </h3>
                <p className="mt-1">
                  Before, whenever possible. An empty apartment is significantly
                  easier to deep clean, and you want to unpack into a space
                  that is already fresh. If timing makes a full pre-move clean
                  impossible, prioritize the kitchen and bathroom before the
                  movers arrive, then tackle the remaining rooms after
                  unpacking.
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
                    href="/blog/move-in-day-documentation"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Move-In Day Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/apartment-tour-checklist"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Apartment Tour Checklist
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Get started with Wade Me Home
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
