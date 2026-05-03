import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "what-is-no-fee-apartment-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "What is a No-Fee Apartment in NYC? (2026 FARE Act Edition)",
  description:
    "A no-fee NYC apartment is one where the tenant pays no broker fee. Since the FARE Act took effect June 11, 2025, the great majority of NYC rentals are no-fee by law.",
  keywords: [
    "no fee apartment NYC",
    "what is no fee apartment",
    "NYC no broker fee meaning",
    "FARE Act no fee NYC",
    "no fee NYC rental",
    "no broker fee apartments NYC",
    "no fee NYC 2026",
    "tenant fee NYC",
  ],
  openGraph: {
    title: "What is a no-fee apartment in NYC?",
    description:
      "An apartment where the tenant pays no broker fee. Since the FARE Act, almost every landlord-listed NYC rental qualifies.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What is a no-fee apartment in NYC?"
      jurisdictionTag="NYC only"
      badges={["FARE Act 2026"]}
      reviewedAt="2026-05-02"
      shortAnswer="A no-fee NYC apartment is one where the renter pays no broker commission to lease the unit. The landlord, not the tenant, pays anyone involved in marketing or showing the apartment. Since the FARE Act took effect June 11, 2025, this is the default for almost every landlord-listed NYC rental."
      bottomLine="If a NYC listing was marketed by a broker the landlord engaged — which is essentially every public StreetEasy, Zillow, Apartments.com, or RentHop listing — it should be a no-fee deal under the FARE Act. If you're being asked for a 'broker fee', 'finders fee', 'marketing fee', or any rebrand, that's almost always an illegal demand."
      sections={[
        {
          heading: "The two definitions of 'no fee'",
          body: [
            "Before the FARE Act, 'no fee' was a marketing label — landlords would advertise certain units as 'no broker fee' to compete for tenants in a renter-tight market. Many large rental towers (especially LeFrak, Equity Residential, AvalonBay) ran in-house leasing teams precisely so they could advertise no-fee.",
            "After the FARE Act took effect in June 2025, 'no fee' became the legal default. The law forbids passing the cost of a landlord-engaged broker on to a tenant — so the no-fee label now describes the legal baseline, not a competitive perk.",
          ],
        },
        {
          heading: "How to verify a NYC listing is genuinely no-fee in 2026",
          body: [
            "Even with the FARE Act in force, some smaller landlords and brokers still try to push fees onto tenants. Verify before signing:",
          ],
          bullets: [
            "Read the listing top-to-bottom — search for 'broker fee', 'finder's fee', 'marketing fee', 'agency fee', 'admin fee', 'application fee'. The FARE Act only allows a credit/background check fee, capped at $20 statewide.",
            "Ask the broker, in writing, three questions: who posted the listing, who has the keys, who pays your commission. Save the answers — they are evidence in any later DCWP complaint.",
            "If the listing comes from the building's leasing office directly (no third-party broker), it's no-fee by structure.",
            "If a third-party broker is involved, the FARE Act usually still requires the landlord to pay them — unless you separately and explicitly engaged that broker as your tenant-side agent first.",
          ],
        },
        {
          heading: "What the FARE Act doesn't cover",
          body: [
            "Three carve-outs to know about: (1) Tenant-side broker engagements still exist — if you sign a written agreement with a broker before they show you any specific unit, you can owe them a fee for finding you a place. (2) The act does not apply outside NYC; Jersey City, Hoboken, Newark, and the rest of New Jersey have separate rules. (3) Buildings with rent stabilization protections were already constrained on what they could charge at lease-up.",
            "If you're moving to JC or Hoboken, the math is different — see the related FARE Act jurisdiction question.",
          ],
        },
        {
          heading: "How to find no-fee NYC apartments today",
          body: [
            "Most public-listed NYC rentals as of 2026 are technically no-fee by law. Filter on StreetEasy by 'no fee' to remove listings still tagged tenant-pay (which are mostly in-error or non-FARE-compliant), or use a rental search tool that excludes any listing with a fee in the cost breakdown.",
            "If you're working with a broker who insists you'll owe their fee, get the engagement in writing before they show you anything — that's the only situation where the fee is enforceable post-FARE.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/fare-act-broker-fee-checker",
          title: "FARE Act Savings Checker",
          blurb: "Quantify the dollars the FARE Act puts back in your pocket.",
        },
        {
          href: "/tools/fare-act-violation-reporter",
          title: "FARE Act Violation Reporter",
          blurb:
            "Run your facts and draft a copy-paste DCWP complaint if you've been charged.",
        },
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "First + last + security + movers, with the FARE Act applied automatically.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "who-pays-broker-fee-nyc-fare-act",
          question: "Who pays the broker fee in NYC under the FARE Act?",
        },
        {
          slug: "can-broker-charge-administrative-fee-nyc",
          question:
            "Can a NYC broker charge an 'administrative fee' under the FARE Act?",
        },
        {
          slug: "does-fare-act-apply-to-streeteasy-listings",
          question:
            "Does the FARE Act apply to apartments listed on StreetEasy?",
        },
        {
          slug: "how-much-was-typical-nyc-broker-fee-before-fare-act",
          question:
            "How much was the typical NYC broker fee before the FARE Act?",
        },
        {
          slug: "fare-act-broker-fee-refund",
          question:
            "Can I get my NYC broker fee refunded under the FARE Act?",
        },
      ]}
      relatedReadingHref="/nyc/no-fee-apartments"
      relatedReadingLabel="NYC no-fee apartments — live listings + neighborhood filter"
    />
  );
}
