import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function ConditionalApprovalHigherDeposit() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What conditional approval usually means</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Landlords sometimes approve applicants who fall slightly outside standard
            criteria if they accept additional risk mitigation: a larger security deposit
            where legal, prepaid rent for several months, a guarantor, or a higher monthly
            pet or amenity fee. The condition should be explicit in writing before you pay
            non-refundable fees—what exactly satisfies the condition, and whether it applies
            only to the initial term or renewals as well.
          </p>
          <p>
            Prepaid rent sounds simple but can affect your cash flow and, in some places,
            legal rights—some jurisdictions limit how many months may be collected upfront.
            Never agree to side arrangements that contradict the lease without a signed
            addendum reviewed carefully.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Questions to ask before you accept</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Ask whether the higher deposit is refundable on the same terms as other tenants
            and whether any portion is non-refundable. Confirm whether conditional terms fall
            away after a year of on-time payments—some owners will document that transition;
            others will not unless you ask. If the alternative is denial, weigh the total cost
            of the concession against other apartments where you qualify cleanly.
          </p>
          <p>
            If something feels exploitative relative to local norms, check tenant guides or
            consult an attorney. Fair housing law prohibits discrimination; differential terms
            must be justified by legitimate screening criteria, not membership in a protected
            class. This article is educational, not legal advice.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Documentation and next steps after you move in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Keep a PDF folder with your application, the signed lease, every addendum related
            to the conditional approval, and receipts for prepaid rent or supplemental
            deposits. If management staff rotate, the next person should be able to see why
            your file differs from a &quot;standard&quot; tenant without you re-explaining.
            After six or twelve months of on-time payments, ask in writing whether your file
            can be reclassified to standard renewal terms; attach your payment history if
            your portal exports it.
          </p>
          <p>
            If economic conditions change—job loss, medical bills—communicate early with
            property management before you miss rent. Some owners will negotiate payment
            plans; others will not, but silence rarely helps. Know whether your conditional
            terms affect eviction timelines or cure periods in your jurisdiction. Again,
            local counsel or tenant unions are the right source for legal strategy; this
            article only flags issues to track so you can ask informed questions.
          </p>
          <p>
            Keep a calendar reminder to revisit terms before renewal; automated rent
            increases may apply differently once you are no longer &quot;conditional.&quot;
            If your financial picture improves dramatically, ask whether standard screening
            could replace prepaid rent at renewal—some owners prefer cleaner files even if
            it means adjusting your ledger.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA variant="movein" />
    </div>
  );
}
