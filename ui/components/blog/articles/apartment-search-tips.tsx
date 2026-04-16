import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function ApartmentSearchTips() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Why rental search feels chaotic—and how to tame it</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            In many U.S. cities, inventory is fragmented across dozens of listing sites,
            property managers, and syndication feeds. The same unit can appear multiple
            times with slightly different photos or prices; others linger after lease. High
            turnover means desirable units can lease within days, while stale ads clutter
            your results. Accepting that mess as structural—not personal failure—helps you
            build systems instead of refreshing feeds obsessively.
          </p>
          <p>
            Start with a written search brief: maximum rent, neighborhoods or ZIPs, bedroom
            count, pet policy, and deal-breakers like walk-up floors or in-unit laundry. Use
            saved searches and alerts, but batch your review to specific times of day so the
            process does not consume every hour. When something looks promising, verify
            availability the same day before falling in love—call or email with the listing
            ID. Duplicate listings often mean you need to trace back to the source manager
            to avoid paying unnecessary fees or applying twice.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Staying organized and application-ready</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Track every serious contender in one place: address, rent, fees, contact, tour
            date, and outcome. Screenshots of listing pages help when ads disappear. Prepare
            a folder of PDFs landlords commonly request—recent pay stubs, offer letter, photo
            ID, prior landlord references—so you are not scrambling when a deadline hits.
            If you use a guarantor service or co-signer, confirm their requirements early;
            those steps can add days.
          </p>
          <p>
            Finally, pace yourself. Burnout leads to skipped lease clauses and rushed
            decisions. If you are relocating from far away, consider a short-term sublet or
            corporate housing for a month to search on the ground—expensive upfront but
            sometimes cheaper than signing a year in a neighborhood you have only seen on
            video. The goal is a confident signature, not the fastest possible lease.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Using data without drowning in listings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Map-based search helps you cluster tours geographically to save time. Note
            average days on market for buildings you like—if units linger, you may have more
            leverage; if they vanish fast, pre-approve your application materials. Set a
            weekly cap on new tours to avoid decision fatigue; quality beats quantity when
            leases last a year or more.
          </p>
          <p>
            Track price changes on saved listings; some platforms show history. Sudden drops
            may signal concessions or issues—ask directly. Neighborhood Facebook or Reddit
            groups sometimes surface unlisted sublets or roommate situations; vet those
            carefully against scams. Combine online research with in-person intuition—data
            cannot smell mold or hear train noise through walls.
          </p>
          <p>
            Before wiring a deposit or paying an application fee to an unfamiliar listing, learn
            how to{" "}
            <Link
              href="/blog/nyc-apartment-scams"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              recognize common apartment scams
            </Link>{" "}
            so you can spot red flags early.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          <p>
            Searching in NYC? See our{" "}
            <Link
              href="/nyc-rent-by-neighborhood"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              NYC Rent by Neighborhood guide
            </Link>{" "}
            for average prices and commute times across all four boroughs, and
            our{" "}
            <Link
              href="/best-time-to-rent-nyc"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              month-by-month guide to the NYC rental market
            </Link>{" "}
            so you can time your search for the best price-to-selection trade-off.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA variant="search" />
    </div>
  );
}
