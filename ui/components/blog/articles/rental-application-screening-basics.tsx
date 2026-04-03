import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function RentalApplicationScreeningBasics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What landlords are trying to learn from your application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Rental screening exists to answer a few practical questions: Can this household
            afford the rent on an ongoing basis? Will they pay on time and care for the
            property? Is there unacceptable risk for this owner&apos;s insurance, lender
            covenants, or fair-housing-compliant policies? The exact mix of income multiples,
            credit thresholds, and background checks varies by landlord, building, and
            jurisdiction—there is no single national standard. Professional management
            companies often publish criteria; smaller landlords may decide case by case.
          </p>
          <p>
            Typical inputs include proof of income (pay stubs, offer letters, tax returns for
            self-employed applicants), government-issued ID, rental history with contact
            information for previous landlords, and sometimes personal references. Screening
            may include credit reports and criminal background checks where permitted by law.
            Some states and cities restrict what can be asked or how records can be used; if
            you believe a denial was discriminatory or violated local law, tenant advocacy
            organizations and attorneys can explain options—this article is not legal advice.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Improving your odds without misrepresenting anything</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Accuracy matters: typos in employer phone numbers delay verification; mismatched
            addresses raise questions. If you have a gap in rental history, a short cover
            letter explaining job training, caregiving, or school can help—honestly. If your
            income is commission-heavy, offer a longer pay history or bank statements only if
            the landlord requests them under their process. Co-signers and guarantors exist
            precisely because raw numbers do not capture every qualified renter; understand
            the fees and obligations before you commit a family member or buy a guarantor
            product.
          </p>
          <p>
            Apply selectively. Each hard pull or paid application chips away at your budget
            and patience. When you are denied, ask whether the decision was based on credit
            and how to obtain a free copy of the report if applicable under federal or state
            rules. Use feedback to adjust expectations—sometimes a slightly lower rent tier
            or a different neighborhood clears the bar. Persistence with preparation beats
            volume without focus.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fair housing, privacy, and your rights during screening</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Federal and state fair housing laws prohibit discrimination based on protected
            classes; local laws may add categories. Landlords may not apply screening
            criteria unevenly or ask prohibited questions disguised as small talk. If you
            encounter steering—being discouraged from certain buildings based on who you
            are—document it and seek help from fair housing organizations.
          </p>
          <p>
            Screening reports can contain errors; you have rights to dispute inaccurate
            information under the Fair Credit Reporting Act and related rules. Keep copies
            of your application so you know what landlords received. If you consent to
            background checks, understand scope—some reports include eviction records that
            are incomplete or sealed in ways that vary by jurisdiction.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA />
    </div>
  );
}
