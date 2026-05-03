import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "gross-vs-net-effective-rent";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Gross vs. Net Effective Rent — What's the Difference? (NYC 2026)",
  description:
    "Gross rent is what you pay each month. Net effective rent spreads any free-month concession across the lease term — it's the apples-to-apples number to compare two listings.",
  keywords: [
    "net effective rent",
    "gross rent vs net effective rent",
    "what is net effective rent",
    "NYC concession math",
    "free month rent NYC",
    "net effective rent calculator NYC",
    "net effective vs face rent",
    "NYC lease concession",
  ],
  openGraph: {
    title: "Gross vs. net effective rent — what's the difference?",
    description:
      "Gross is the monthly check. Net effective spreads concessions across the term. Net effective is what to compare.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What's the difference between gross rent and net effective rent?"
      jurisdictionTag="NYC + JC + Hoboken"
      badges={["Rent math 2026"]}
      reviewedAt="2026-05-02"
      shortAnswer="Gross rent (also called face rent) is the dollar amount you write on the check each month. Net effective rent spreads any concession — typically one or two free months on a 12- or 13-month lease — across every month of the term. Net effective is the lower number, and it's the only honest way to compare two listings."
      bottomLine="Always compare listings on net effective rent, not gross. A '$5,500/month with 2 months free on a 14-month lease' apartment is actually $4,714/month net effective — cheaper than a $5,000 listing with no concession. The math matters most at year 2, when the concession typically vanishes and your renewal is quoted off the gross."
      sections={[
        {
          heading: "The formula",
          body: [
            "Net effective monthly rent = (gross monthly rent × paid months) ÷ total lease months.",
            "Example: $5,500 gross × 12 paid months = $66,000 ÷ 14 total months on the lease = $4,714 net effective. The 2 free months drop the per-month cost by $786.",
            "If concessions are quoted differently (e.g. '1 month free' on a 13-month lease, or '6 weeks free' on a 12-month lease), convert everything to total free days first, then to whole-month equivalents.",
          ],
        },
        {
          heading: "Why landlords quote concessions instead of dropping the gross",
          body: [
            "Three reasons. (1) Renewal anchoring: a landlord can offer 2 months free on a $5,500 lease in year 1, then quote your year-2 renewal at $5,500 with no concession — a 16.7% effective increase that doesn't read as a 16.7% bump on the lease. (2) Rent-comp data: brokers and appraisers report 'asking rent', which is the gross face number; concessions don't show up in market data, which keeps comps high. (3) Marketing: '2 months free' reads more compelling than 'rent reduced from $5,500 to $4,714' even though the year-1 cost is identical.",
          ],
        },
        {
          heading: "How to compare two listings",
          body: [
            "Make sure you're comparing apples to apples on three axes:",
          ],
          bullets: [
            "Net effective rent (not gross) — use the formula above for each.",
            "Lease term — a 14-month lease is a longer commitment than a 12-month, with more market risk.",
            "Renewal exposure — ask the landlord, in writing, what the year-2 renewal is likely to look like. If they quote off the gross, factor in the year-2 jump.",
          ],
        },
        {
          heading: "When net effective is misleading",
          body: [
            "Net effective math assumes you stay for the full lease term. If you break the lease early, you may owe back a pro-rated share of the concession (the 'concession recapture' clause). Read the lease — most NYC concession leases include this clause.",
            "If you're a serial mover with a job that might transfer you out of NYC mid-lease, the gross rent is the more honest number to compare.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/net-effective-rent-calculator",
          title: "Net-Effective Rent Calculator",
          blurb:
            "Plug in two listings, get the side-by-side net-effective comparison.",
        },
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Computes year-1 cash including the concession savings.",
        },
        {
          href: "/tools/path-commute-roi-calculator",
          title: "PATH Commute ROI Calculator",
          blurb:
            "If you're comparing NYC vs. JC/Hoboken, run net effective on both first.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "nyc-moving-cost-2026",
          question: "How much does it cost to move to NYC in 2026?",
        },
        {
          slug: "what-is-no-fee-apartment-nyc",
          question: "What is a no-fee apartment in NYC?",
        },
        {
          slug: "how-much-was-typical-nyc-broker-fee-before-fare-act",
          question:
            "How much was the typical NYC broker fee before the FARE Act?",
        },
        {
          slug: "can-landlord-raise-rent-after-fare-act",
          question:
            "Can my NYC landlord raise the rent to cover the broker fee?",
        },
      ]}
      relatedReadingHref="/nyc-rent-by-neighborhood"
      relatedReadingLabel="NYC rent by neighborhood — current medians + concession data"
    />
  );
}
