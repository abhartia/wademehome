import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function GuarantorsAndCoSigners() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>When landlords ask for backup on the lease</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Guarantors and co-signers exist because income multiples and credit history do
            not capture every reliable renter—students, recent graduates, career changers,
            and newcomers to the country may have thin files or earnings that will grow but
            have not yet appeared on pay stubs. A guarantor agrees to pay rent if you do not;
            a co-signer may be a full party to the lease with the same rights and
            responsibilities as you. The legal distinction matters for liability and for how
            easy it is to exit the arrangement.
          </p>
          <p>
            Institutional guarantor services charge a fee to guarantee rent to the
            landlord&apos;s satisfaction without involving a relative. Family guarantors often
            must show income multiples of their own and may need to be U.S.-based with
            assets the owner finds credible. Everyone should read the guarantee clause: it
            often survives roommate changes, renewal rent increases, and sometimes extends
            until the unit is re-rented after a default.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Relationships, boundaries, and alternatives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Asking a parent or relative to guarantee is a financial and emotional ask. Be
            transparent about rent amount, lease length, and what happens if you lose income.
            Some families prefer a larger security deposit or prepaid rent (where legal)
            over an open-ended guarantee—compare options with the landlord if they allow.
          </p>
          <p>
            If you outgrow the need for a guarantor, renewal is the time to ask whether the
            guarantee can drop off after a year of on-time payments—some owners agree in
            writing; others will not. Document every promise about repairs or rent that
            influenced someone to sign for you. This article is educational only; have a
            lawyer review guarantee documents if the dollar amounts or duration make you
            uneasy.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>International students, visa status, and alternative paths</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Visa categories affect how landlords interpret income; offer school award
            letters, stipend documentation, and savings statements when traditional pay
            stubs do not exist. Some guarantor products specialize in international
            students—compare fees and coverage limits against asking a relative who may face
            currency or income-documentation hurdles.
          </p>
          <p>
            If no guarantor is available, larger deposits or prepaid rent (where permitted)
            may be alternatives—evaluate legal caps and opportunity cost of tying up cash.
            Roommate arrangements where a domestic earner leads the lease can help but carry
            interpersonal risk; contracts between roommates should not contradict the master
            lease.
          </p>
          <p>
            When refinancing or buying a home later, a still-active guarantee can affect a
            family member&apos;s debt-to-income on their mortgage application—discuss release
            timelines with landlords before your relatives apply for major credit. A clean
            exit benefits everyone.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA />
    </div>
  );
}
