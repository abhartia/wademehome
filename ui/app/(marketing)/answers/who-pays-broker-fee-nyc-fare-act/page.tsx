import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "who-pays-broker-fee-nyc-fare-act";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Who Pays the Broker Fee in NYC Under the FARE Act? (2026)",
  description:
    "Whoever hired the broker pays. If the broker posted the listing, has keys, or shows the unit, the landlord pays. Tenant pays only if they signed a tenant-side agreement first.",
  keywords: [
    "who pays broker fee NYC",
    "FARE Act 2026",
    "NYC broker fee law",
    "landlord pays broker fee NYC",
    "tenant broker fee NYC",
    "NYC apartment no fee",
    "FARE Act tenant rights",
    "broker fee illegal NYC",
  ],
  openGraph: {
    title: "Who pays the broker fee in NYC under the FARE Act?",
    description:
      "Hiring decides paying. The party who engaged the broker pays the broker — the FARE Act's whole rule in one line.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Who pays the broker fee in NYC under the FARE Act?"
      jurisdictionTag="NYC only"
      badges={["FARE Act 2026"]}
      reviewedAt="2026-04-30"
      shortAnswer="Whoever hired the broker pays the broker. If the broker posted the listing, has keys to the unit, is showing the apartment, or earns commission from the landlord, the landlord pays. The tenant only pays when the tenant separately and explicitly engaged a buyer's-side broker first."
      bottomLine="In practice, almost every NYC rental in 2026 is a landlord-engaged broker situation, which means the landlord pays. If a broker demands a fee from you and any one of the four landlord-engagement signals is present, the demand is presumptively illegal."
      sections={[
        {
          heading: "The four landlord-engagement signals",
          body: [
            "DCWP weighs four signals when deciding who hired the broker. Any one is sufficient evidence on its own; in combination they are conclusive.",
          ],
          bullets: [
            "Listing authorship — the broker posted the unit on StreetEasy, Zillow, Apartments.com, or any public rental platform.",
            "Key custody — the broker has access to the unit and is the one letting people in.",
            "Showing — the broker is the person physically showing the apartment.",
            "Commission flow — the broker is paid by the landlord on lease-up.",
          ],
        },
        {
          heading: "When the tenant pays (the narrow case)",
          body: [
            "The FARE Act's exception is for genuine tenant-side representation. To qualify, you typically must have:",
            "Signed a written engagement letter or search agreement with a broker, naming them as your agent. Paid an hourly fee or retainer that pre-dates them showing you any specific unit. Asked them to find listings on your behalf — including listings the landlord has not engaged any other broker on.",
            "If those facts are present, the broker is your agent, you hired them, and you owe their fee. This describes a small share of NYC rentals — mostly relocation searches and high-end condos.",
          ],
        },
        {
          heading: "Why the question matters in 2026",
          body: [
            "Before June 11, 2025, NYC was the largest US city where tenant-paid broker fees on landlord-engaged transactions were standard. Fees of one month's rent to 15% of annual rent were normal. The FARE Act flipped the default.",
            "Through April 2026 (about 10 months of enforcement), DCWP has logged well over 1,500 complaints and issued refunds and $2,000-per-violation fines on repeat-offender brokerages. The norm has shifted: most large landlords have moved to in-house leasing or pay-the-broker themselves; smaller landlords sometimes still try to push the fee onto tenants. That second case is what enforcement is for.",
          ],
        },
        {
          heading: "What to do if you are being asked to pay",
          body: [
            "Ask the broker, in writing (text or email), three questions: who posted the listing, who has the keys, and who pays their commission. Save the answers.",
            "If the answers point to the landlord on any axis, decline to pay and either negotiate the fee onto the landlord or use the violation reporter to draft a DCWP complaint.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/fare-act-violation-reporter",
          title: "FARE Act Violation Reporter",
          blurb: "Run your facts and draft a copy-paste DCWP complaint.",
        },
        {
          href: "/tools/fare-act-broker-fee-checker",
          title: "FARE Act savings checker",
          blurb: "Estimate the dollars at stake.",
        },
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in cost estimator",
          blurb: "First, last, security, movers, with the FARE Act applied.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "does-fare-act-apply-to-streeteasy-listings",
          question:
            "Does the FARE Act apply to apartments listed on StreetEasy?",
        },
        {
          slug: "can-broker-charge-administrative-fee-nyc",
          question:
            "Can a NYC broker charge an 'administrative fee' under the FARE Act?",
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
