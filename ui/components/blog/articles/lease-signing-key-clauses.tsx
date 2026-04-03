import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function LeaseSigningKeyClauses() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Why rushing DocuSign costs renters money</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Electronic signing makes it easy to click through dozens of pages without
            reading. Yet the lease and addenda define rent amount, renewal options, guest
            policies, maintenance responsibilities, entry rights, late fees, and what
            happens if you need to break the lease early. Verbal promises from a leasing
            agent do not bind the owner unless they appear in writing in the contract or a
            signed addendum. Before you sign, block time to read sequentially—not skim—and
            flag anything that contradicts what you were told on tour.
          </p>
          <p>
            House rules, parking exhibits, pet addenda, and utility allocation often live
            outside the main body. Cross-reference rent numbers against your application
            summary; typos in monthly rent or lease dates occur more often than they should.
            Confirm the unit number, storage number, and parking space letter if assigned.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Clauses that deserve extra attention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Renewal: automatic renewal, notice windows, and how rent increases are
            calculated—especially in regulated markets where forms of notice matter.
            Subletting and assignment: whether you can replace yourself on the lease and what
            fees apply. Early termination: flat fees, rent-through-reletting, or landlord
            discretion. Maintenance: who handles HVAC filters, pest control, and appliance
            repair; how to report emergencies; and whether you may withhold rent for
            failures (often tightly regulated—do not assume).
          </p>
          <p>
            If something is unclear, ask for plain-language clarification in email and
            request a written addendum if the answer changes your obligations. For
            high-stakes leases or unusual clauses, paying a local attorney for an hour of
            review can be cheaper than a year of regret. This article is not legal advice; it
            is a checklist to slow you down long enough to read what you are signing.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>After signing: calendars, rent payment, and renewals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Export rent due dates, grace periods, and late-fee triggers into your calendar
            with reminders a few days early. Autopay helps if your cash flow is steady;
            otherwise set transfers that clear before weekends and banking holidays. If rent
            increases at renewal, verify the calculation method against your regulatory
            environment when applicable.
          </p>
          <p>
            Store the signed PDF where you can find it years later—leases matter for tax
            deductions in rare cases, visa applications, and disputes. If roommates join
            later, ensure addenda are signed by all parties. A clean document trail beats
            memory every time a question arises about who agreed to what.
          </p>
          <p>
            If your building is converting to condos or undergoing major capital work, riders
            may reference assessments or construction access—read those even if the base
            rent looks standard. Special assessments sometimes pass through to renters in
            specific lease structures; ask directly when in doubt.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA />
    </div>
  );
}
