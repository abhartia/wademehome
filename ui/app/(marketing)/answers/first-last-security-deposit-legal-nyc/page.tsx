import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "first-last-security-deposit-legal-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Is First, Last, and Security Legal in NYC? (HSTPA 2026)",
  description:
    "No. The 2019 HSTPA capped move-in deposits at one month's rent. A NYC landlord cannot collect first month + last month + security — only first month + a one-month security deposit.",
  keywords: [
    "first last security NYC",
    "NYC security deposit cap",
    "is first last and security legal NYC",
    "HSTPA security deposit",
    "NYC landlord deposit limit",
    "max security deposit NYC",
    "last month rent NYC illegal",
    "NYC deposit law 2026",
  ],
  openGraph: {
    title: "Is first, last, and security legal in NYC?",
    description:
      "No — the 2019 HSTPA caps move-in deposits at one month's rent. First + last + security is illegal in NYC.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Is asking for first, last, and security legal in NYC?"
      jurisdictionTag="NYS / NYC"
      badges={["HSTPA 2019"]}
      reviewedAt="2026-05-02"
      shortAnswer="No. New York State's Housing Stability and Tenant Protection Act of 2019 (HSTPA) capped landlord move-in deposits at the equivalent of one month's rent. A NYC landlord can collect first month's rent and a security deposit of up to one month — but not also a 'last month's rent' deposit on top. The total cash you owe at lease signing is two months' rent, not three."
      bottomLine="If a NYC landlord asks for first + last + security, they're asking for one month more than the law allows. The legal max move-in cash is first month + one month security. Push back, cite General Obligations Law § 7-108(1-a), and walk if they don't budge — most professional landlords already know the rule."
      sections={[
        {
          heading: "What HSTPA actually says",
          body: [
            "New York General Obligations Law § 7-108(1-a), enacted as part of HSTPA in June 2019, caps any deposit or advance from a tenant — whether labeled security, last month's rent, key deposit, or anything else — at no more than one month's rent.",
            "The total cash a landlord can demand at lease signing in NYC is therefore: first month's rent + a deposit of up to one month's rent. That's it. Asking for first + last + security adds an unlawful third month.",
          ],
        },
        {
          heading: "What counts toward the one-month cap",
          body: [
            "HSTPA's deposit cap is comprehensive — the label doesn't matter. These all count toward the one-month limit:",
          ],
          bullets: [
            "Security deposit",
            "Last month's rent (held as a deposit, not paid forward)",
            "Pet deposit",
            "Key deposit",
            "Any 'additional security' for guarantor-less tenants, foreign tenants, or tenants with low credit",
            "Any cleaning deposit beyond a non-refundable reasonable cleaning fee",
          ],
        },
        {
          heading: "What the landlord still owes you",
          body: [
            "HSTPA also requires the landlord to: (1) hold the deposit in a separate, interest-bearing account at a NYS bank, (2) provide the tenant with a written itemized statement of any deductions within 14 days of move-out, and (3) return the balance within those same 14 days. Missing the 14-day deadline waives the landlord's right to keep any of the deposit.",
            "If the landlord misses the deadline or refuses to return the full deposit without itemized deductions, you can recover the deposit in NYC Small Claims Court (jurisdiction up to $10,000). Many tenants prevail because landlords either skip the inspection requirement or fail to provide written itemization in time.",
          ],
        },
        {
          heading: "Common pushbacks landlords use (and how to respond)",
          body: ["The deposit cap is well-established by 2026, but you'll occasionally hear:"],
          bullets: [
            "\"It's not a deposit, it's prepaid last month's rent.\" — Doesn't matter. HSTPA's cap covers any 'deposit or advance', regardless of label.",
            "\"Out-of-state tenants need extra security.\" — Not an exception in the statute. The one-month cap applies to all tenants.",
            "\"You don't have a guarantor, so we need extra.\" — Not an exception. Use a guarantor-substitute service (Insurent, TheGuarantors) if the landlord won't move forward without one — those services don't count toward the deposit cap.",
            "\"It's our standard policy.\" — Standard policies don't override state law. If the landlord won't change the demand in writing, walk.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Itemizes your full lease-signing cash with the HSTPA cap pre-applied.",
        },
        {
          href: "/tools/fare-act-violation-reporter",
          title: "FARE Act Violation Reporter",
          blurb:
            "If you were also charged a broker fee, that's a separate FARE Act violation.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "nyc-application-fee-cap",
          question:
            "What's the maximum application or credit-check fee a NYC landlord can charge?",
        },
        {
          slug: "what-is-no-fee-apartment-nyc",
          question: "What is a no-fee apartment in NYC?",
        },
        {
          slug: "nyc-moving-cost-2026",
          question: "How much does it cost to move to NYC in 2026?",
        },
        {
          slug: "who-pays-broker-fee-nyc-fare-act",
          question: "Who pays the broker fee in NYC under the FARE Act?",
        },
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question: "How do I find out if my NYC apartment is rent-stabilized?",
        },
      ]}
      relatedReadingHref="/blog/nyc-fare-act-broker-fee-ban"
      relatedReadingLabel="NYC FARE Act broker fee ban — full guide"
    />
  );
}
