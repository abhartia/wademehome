import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function RentersInsuranceBasics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Why leases ask for proof of renters insurance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The building owner&apos;s insurance generally covers the structure and common
            areas—not your belongings if there is a fire, theft, or burst pipe, and not your
            liability if you accidentally flood the unit below or injure someone in your
            home. Renters insurance fills that gap for a modest premium in most places. That
            is why landlords require a certificate of insurance naming minimum liability
            limits: it aligns incentives and reduces disputes when something goes wrong.
          </p>
          <p>
            A standard policy has two big pieces: personal property coverage for clothes,
            electronics, and furniture (subject to deductibles and category limits for items
            like jewelry or bikes), and personal liability for harm you cause to people or
            property. Loss of use coverage can pay temporary housing if your unit is
            uninhabitable after a covered event—read the dollar limits and time caps.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Choosing limits, roommates, and exclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Underinsuring saves pennies until you file a claim. Walk through a rough
            inventory of replacement cost—not original purchase price—for clothes,
            furniture, and gear. Earthquake and flood usually require separate endorsements
            or policies; in some regions that matters more than liability minimums. Roommates
            may need separate policies or named insured status; do not assume one policy
            covers everyone&apos;s property without reading the declarations page.
          </p>
          <p>
            Send the certificate to your landlord before move-in deadlines; renewals should
            auto-send if your carrier supports it. If you get a dog, disclose breed to your
            carrier—some restrict certain breeds or charge more. This overview is not
            insurance or legal advice; read your policy jacket and ask your agent about
            anything unclear before you rely on coverage in a crisis.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Claims, deductibles, and life after a loss</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            If you suffer a covered loss—fire, theft, burst pipe—document everything before
            cleanup when safe to do so: photos, police reports for theft, receipts for
            emergency repairs. Mitigate further damage where reasonable; insurers may deny
            claims if you ignore obvious next steps. Keep an inventory app or spreadsheet
            updated annually; memory fades when you are stressed.
          </p>
          <p>
            Liability claims—someone injured in your unit—can exceed policy limits in
            serious cases; umbrella policies may be worth discussing with an agent if you
            have assets to protect. Renewal premiums may rise after claims; compare quotes
            every few years. Insurance is a long-term relationship; choose carriers with
            solid financial strength ratings and             readable policies.
          </p>
          <p>
            If you acquire expensive gear—camera equipment, musical instruments—schedule
            those items explicitly; standard caps may leave you underinsured after a theft.
            Review coverage when you travel; some policies extend off-premises theft only
            with limits.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA />
    </div>
  );
}
