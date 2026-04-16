import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import Link from "next/link";

export default function LeaseRenewalVsMoving() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reading your renewal offer against the market</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            When renewal time approaches, landlords often send a new rent figure with a
            deadline to accept or give notice. In regulated markets, increases may be capped
            or require specific forms; in others, the lease governs how much notice you must
            give to leave or to request a month-to-month arrangement. Compare the renewal
            number to similar listings in your building and neighborhood—adjusting for
            floor, exposure, and renovations. If your unit is overpriced relative to comps,
            a polite negotiation with data is sometimes successful, especially if you have
            been a reliable tenant and vacancy is costly for the owner.
          </p>
          <p>
            Do not miss notice windows: automatic renewal clauses can lock you in at an
            unfavorable rate or obligate you to another full term. Calendar the deadline
            weeks in advance. If you need flexibility, ask whether a shorter extension or
            month-to-month is available—expect a higher premium for that option.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>When moving beats renewing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Moving has switching costs: broker fees where applicable, movers, overlapping
            rent, new deposits, and time off work. Sometimes a higher renewal still beats
            those costs; sometimes a cheaper unit elsewhere pays for itself in months. Model
            your break-even honestly, including non-money factors like commute, building
            quality, and roommate fit.
          </p>
          <p>
            If you decide to move, line up the next lease before giving notice when possible
            to avoid gap risk. If you stay, get renewal terms in signed writing. Rent
            regulation is hyperlocal—this article is general guidance, not legal advice for
            your jurisdiction.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Non-financial factors: commute, community, and quality of life</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            A slightly higher renewal might still beat moving if your commute is ideal, your
            building community is supportive, and your unit is unusually quiet. Conversely,
            a cheaper renewal cannot fix a bad landlord, chronic maintenance issues, or a
            neighborhood that no longer fits your life stage. Put numbers on a spreadsheet,
            but also weight sleep quality and stress—those are harder to price but matter
            for health.
          </p>
          <p>
            If you are considering a move, tour during the season you would actually live
            there—summer heat, winter slush, and school-year traffic patterns differ. Talk
            to neighbors in candidate buildings about management responsiveness; online
            reviews can be skewed, but patterns across many reviews often tell a story.
            Combine renewal math with lifestyle fit before you sign another year or give
            notice.
          </p>
          <p>
            If you negotiate a renewal concession—free month, parking waiver—get it in the
            signed renewal package, not a side email that predates the final document.
            Promotions sometimes expire between verbal agreement and DocuSign.
          </p>
          <p>
            If your apartment is rent stabilized in NYC, your landlord&apos;s renewal
            increase is capped by the Rent Guidelines Board — see our{" "}
            <Link
              href="/blog/nyc-rent-stabilization-guide"
              className="text-primary underline underline-offset-2"
            >
              NYC rent stabilization guide
            </Link>{" "}
            for current rates and how to verify your status. If you are leaning
            toward moving, also check our{" "}
            <Link
              href="/best-time-to-rent-nyc"
              className="text-primary underline underline-offset-2"
            >
              month-by-month NYC rental market guide
            </Link>{" "}
            — timing your move can mean a 5% to 10% lower headline rent on
            an otherwise identical apartment.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA />
    </div>
  );
}
