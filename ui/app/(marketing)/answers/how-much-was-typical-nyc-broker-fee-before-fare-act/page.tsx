import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "how-much-was-typical-nyc-broker-fee-before-fare-act";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "How Much Was the Typical NYC Broker Fee Before the FARE Act?",
  description:
    "Pre-FARE Act NYC broker fees ran 8.33% (one month's rent) to 15% of annual rent — typically $3,000–$10,000 on a $4,000–$6,000/month apartment. The FARE Act eliminated this cost as of June 11, 2025.",
  keywords: [
    "NYC broker fee history",
    "typical NYC broker fee",
    "broker fee 15% NYC",
    "broker fee one month NYC",
    "NYC broker fee before FARE Act",
    "NYC broker fee amount",
    "NYC broker fee cost 2024",
    "broker fee percentage NYC",
  ],
  openGraph: {
    title: "How much was the typical NYC broker fee before the FARE Act?",
    description:
      "8.33% (one month) to 15% of annual rent — typically $3,000–$10,000 per move. The FARE Act zeroed this out for tenants on June 11, 2025.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="How much was the typical NYC broker fee before the FARE Act?"
      jurisdictionTag="NYC historical"
      badges={["Pre-FARE history"]}
      reviewedAt="2026-05-02"
      shortAnswer="The standard NYC broker fee before the FARE Act ran from 8.33% of annual rent (the equivalent of one month's rent) on the low end to 15% of annual rent on the high end. For a $4,000/month apartment that's $4,000 (one month) to $7,200 (15%) — paid by the tenant at lease signing on top of first month + security. The FARE Act, effective June 11, 2025, eliminated this charge for tenants in landlord-engaged transactions."
      bottomLine="A NYC renter signing a $4,000–$6,000/month apartment in 2024 routinely paid $4,000–$10,800 in broker fees on top of first + security. The FARE Act zeroed that out for landlord-engaged listings — which is essentially every public-listed NYC rental — starting in mid-2025. The historical 8.33%–15% range is what your relocation budget assumed before mid-2025."
      sections={[
        {
          heading: "The two most common pre-FARE pricing structures",
          body: [
            "There were two industry-standard ways NYC brokers quoted the fee:",
          ],
          bullets: [
            "**One month's rent** — equivalent to 8.33% of annual rent. The 'low' end of broker fee territory, common at large no-fee-competitive towers and on lower-rent listings.",
            "**15% of annual rent** — the 'standard' fee on most StreetEasy and brokerage-listed apartments. On $4,000/month rent, this was $7,200; on $6,000/month, $10,800.",
            "Some brokers charged in between — 10%, 12%, or 'one month's rent on a 12-month lease' phrased to obscure the percentage.",
          ],
        },
        {
          heading: "What you paid out the door, pre-FARE",
          body: [
            "On a typical $4,000/month NYC 1BR in 2024, a tenant moving in paid:",
          ],
          bullets: [
            "First month's rent: $4,000",
            "Security deposit: $4,000 (one month, capped by HSTPA)",
            "Broker fee (15% of annual rent): $7,200",
            "Application + credit checks: $20 (capped by RPL § 238-a)",
            "Total cash at lease signing: ~$15,220 — before any movers, COI, or utilities.",
          ],
        },
        {
          heading: "How fees varied by market segment",
          body: [
            "Three distinct fee tiers existed pre-FARE. (1) Large no-fee towers (LeFrak, Equity, AvalonBay, EQR with in-house leasing) — $0 broker fee, structurally. About 10–15% of public-listed NYC rentals. (2) Co-op and condo rentals brokered by big firms (Corcoran, Compass, Douglas Elliman) — usually 15% standard. (3) Walkup and small-landlord units listed through smaller brokerages — variable, often one month's rent (~8.33%) for negotiating leverage.",
            "Outer-borough rentals (Bushwick, Bed-Stuy, Astoria walkups) skewed toward one month's rent. Manhattan luxury skewed toward 15%.",
          ],
        },
        {
          heading: "Why the FARE Act mattered economically",
          body: [
            "The FARE Act, passed November 2024 and effective June 11, 2025, didn't reduce broker fees — it shifted them from the tenant to the landlord, who hires the broker. From the renter's perspective, that means the typical broker fee dropped from $4,000–$10,800 to $0 on essentially every landlord-engaged transaction.",
            "Across roughly 200,000 NYC market-rate rental moves per year, the FARE Act has shifted an estimated $700M–$1.4B annually from tenant pockets to either landlord-side leasing budgets or, more commonly, in-house leasing teams. The early data suggests asking rents have moved up 1–2% to absorb some of that cost — a fraction of the 8–15% the tenant used to pay directly.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/fare-act-broker-fee-checker",
          title: "FARE Act Savings Checker",
          blurb:
            "Run the dollar amount the FARE Act saves you on your specific rent.",
        },
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Compare your 2026 lease-signing total to the pre-FARE equivalent.",
        },
        {
          href: "/tools/nyc-broker-fee-law-timeline",
          title: "NYC Broker Fee Law Timeline",
          blurb:
            "13-event timeline from 2019 DOS guidance through pending NJ A-2978.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "what-is-no-fee-apartment-nyc",
          question: "What is a no-fee apartment in NYC?",
        },
        {
          slug: "who-pays-broker-fee-nyc-fare-act",
          question: "Who pays the broker fee in NYC under the FARE Act?",
        },
        {
          slug: "fare-act-broker-fee-refund",
          question:
            "Can I get my NYC broker fee refunded under the FARE Act?",
        },
        {
          slug: "can-landlord-raise-rent-after-fare-act",
          question:
            "Can my NYC landlord raise the rent to cover the broker fee?",
        },
        {
          slug: "does-fare-act-apply-to-jersey-city-hoboken",
          question: "Does the FARE Act apply to Jersey City and Hoboken?",
        },
      ]}
      relatedReadingHref="/blog/nyc-fare-act-broker-fee-ban"
      relatedReadingLabel="NYC FARE Act broker fee ban — full guide"
    />
  );
}
