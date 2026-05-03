import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-application-fee-cap";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Maximum NYC Application or Credit-Check Fee — $20 Cap (2026)",
  description:
    "New York State caps tenant application and credit-check fees at $20 total per applicant. The $20 covers background and credit checks combined — anything more violates HSTPA.",
  keywords: [
    "NYC application fee cap",
    "NYC credit check fee max",
    "$20 application fee NYC",
    "HSTPA application fee",
    "NYC apartment application fee limit",
    "RPL 238-a",
    "NYC tenant fees",
    "credit check fee cap NYS",
  ],
  openGraph: {
    title: "What's the maximum NYC application or credit-check fee?",
    description:
      "$20 statewide. The cap covers background + credit checks combined. More than $20 violates HSTPA.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What's the maximum application or credit-check fee a NYC landlord can charge?"
      jurisdictionTag="NYS / NYC"
      badges={["HSTPA 2019", "$20 cap"]}
      reviewedAt="2026-05-02"
      shortAnswer="$20 per applicant. New York Real Property Law § 238-a, enacted as part of the 2019 HSTPA, caps the total fee a landlord (or their agent or broker) can charge a prospective tenant for background, credit, or reference checks at $20 per applicant — combined, not per check. The landlord must also waive the fee if the applicant provides a recent (within 30 days) credit/background check report on their own."
      bottomLine="The $20 cap is statewide and total. If a NYC landlord, broker, or property manager asks for $50, $75, $100 'application + credit + background', that's an HSTPA violation. The fee covers both checks combined, not each separately, and if you offer a recent report, the landlord must accept it instead of charging."
      sections={[
        {
          heading: "What RPL § 238-a actually says",
          body: [
            "New York Real Property Law § 238-a(1)(b) states that a landlord — or any agent, broker, employee, or assignee acting on the landlord's behalf — may not charge a prospective tenant more than $20 for any background or credit check.",
            "The statute also requires the landlord to provide the prospective tenant with a copy of the background or credit check, plus a receipt itemizing the fee. And — critically — if the prospective tenant provides a copy of a background and/or credit check completed within the past 30 days, the landlord must waive the fee entirely.",
          ],
        },
        {
          heading: "Common rebrands that don't change the analysis",
          body: [
            "Like the FARE Act broker fee rebrands, landlords sometimes try to call the application fee something else to evade the cap:",
          ],
          bullets: [
            "'Processing fee' — covered by the cap.",
            "'Administrative fee' charged at application time — covered by the cap.",
            "'Credit report fee' + 'background check fee' as separate line items — combined cap is still $20.",
            "'Reference check fee' — covered by the cap.",
            "'Application review fee' — covered by the cap.",
          ],
        },
        {
          heading: "What landlords can still charge",
          body: [
            "The cap applies only to background, credit, and reference checks. Landlords can still legally charge:",
          ],
          bullets: [
            "First month's rent (paid forward, not held).",
            "A security deposit of up to one month's rent (HSTPA cap).",
            "A reasonable, non-refundable cleaning fee (if disclosed in the lease).",
            "Late rent fees, capped at $50 or 5% of monthly rent (whichever is less).",
            "Bounced-check fees up to $20 per occurrence.",
          ],
        },
        {
          heading: "What to do if you're overcharged",
          body: [
            "If a NYC landlord, broker, or property manager has charged you more than $20 for application/credit/background checks, the recovery path is the same as for a HSTPA security deposit overcharge:",
            "(1) Send a written demand for the difference back, citing RPL § 238-a. Most landlords refund without escalation. (2) If they refuse, file in NYC Small Claims Court (jurisdiction up to $10,000) — landlords routinely lose these cases because the statute is clear and tenant-favorable.",
            "If the overcharge came from a real-estate broker who is also charging you a broker fee, the FARE Act violation reporter handles both pieces in one DCWP complaint.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Itemizes total move-in cash with the $20 application cap pre-applied.",
        },
        {
          href: "/tools/fare-act-violation-reporter",
          title: "FARE Act Violation Reporter",
          blurb:
            "If a broker overcharged on both fronts, file one DCWP complaint.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "can-broker-charge-administrative-fee-nyc",
          question:
            "Can a NYC broker charge an 'administrative fee' under the FARE Act?",
        },
        {
          slug: "who-pays-broker-fee-nyc-fare-act",
          question: "Who pays the broker fee in NYC under the FARE Act?",
        },
        {
          slug: "what-is-no-fee-apartment-nyc",
          question: "What is a no-fee apartment in NYC?",
        },
        {
          slug: "nyc-moving-cost-2026",
          question: "How much does it cost to move to NYC in 2026?",
        },
      ]}
      relatedReadingHref="/blog/nyc-fare-act-broker-fee-ban"
      relatedReadingLabel="NYC FARE Act broker fee ban — full guide"
    />
  );
}
