import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreditAndRentalApplications() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How credit history shows up in rental decisions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Landlords who pull credit are usually looking for patterns of reliability more
            than a single three-digit score. Late payments, high utilization, collections,
            and prior evictions (where reportable) can weigh against an application—exactly
            how much depends on the owner&apos;s policy and local rules about what may be
            considered. A thin credit file—common for young adults, recent immigrants, or
            people who have always paid cash—is not the same as a bad file, but automated
            scoring can still disadvantage applicants unless a human reviews the full
            picture.
          </p>
          <p>
            Before you apply widely, pull your own credit reports from the major bureaus
            through the federally authorized annual process and dispute material errors.
            Paying down revolving balances can improve utilization faster than waiting for
            time to pass. Avoid opening new credit lines right before a move if you are
            borderline on approval; hard inquiries are a small factor but signal churn to
            some reviewers.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Income, debt-to-income, and the rest of the story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Many landlords compare rent to gross monthly income using a multiple (for
            example, rent not exceeding one-third of gross income). That rule of thumb breaks
            down when student loans, child support, or medical debt dominate your budget. If
            your debt-to-income ratio is high but you have stable employment and cash
            reserves, some owners will listen—especially with documentation. Others follow
            rigid spreadsheets; knowing which type of landlord you face saves wasted
            application fees.
          </p>
          <p>
            If credit issues stem from one-time crises—divorce, job loss, illness—be
            prepared to explain with dates and recovery steps without oversharing. Fair
            housing law limits certain questions; focus on facts relevant to ability to pay
            going forward. Guarantors, larger deposits where legal, or prepaid rent (where
            permitted) may be options; verify local law before agreeing to unusual terms.
            When in doubt, consult a tenants&apos; union or attorney in your state—this
            article is general information, not legal advice.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Credit counseling, disputes, and rebuilding over time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Nonprofit credit counseling can help you structure debt payoff if high balances
            block approvals—choose HUD-approved or NFCC-member agencies and avoid outfits
            that promise instant score fixes. If you find identity theft accounts, file
            police reports and dispute with bureaus promptly; fraud freezes may slow
            applications temporarily but protect you long-term.
          </p>
          <p>
            Rebuilding credit is measured in months and years, not days. Secured cards,
            on-time rent reporting products where available, and consistent low utilization
            move scores gradually. Be skeptical of services that rent trade lines—those can
            violate lender policies. Patience plus documentation eventually widens your
            housing options without relying on guarantors indefinitely.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
