import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "can-broker-charge-administrative-fee-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Can NYC Brokers Charge an 'Administrative Fee'? (FARE Act 2026)",
  description:
    "No — DCWP treats rebranded broker fees (administrative, marketing, processing, agency) as FARE Act violations when the broker was landlord-hired. Application fees are capped at $20.",
  keywords: [
    "FARE Act administrative fee",
    "broker administrative fee NYC",
    "NYC application fee cap",
    "marketing fee NYC apartment",
    "processing fee NYC broker",
    "FARE Act loophole",
    "rebranded broker fee NYC",
    "$20 application fee cap NYC",
  ],
  openGraph: {
    title: "Can a NYC broker charge an 'administrative fee' under the FARE Act?",
    description:
      "Renaming a broker fee does not legalize it. DCWP has flagged administrative, marketing, processing, and agency fees as rebranded broker fees.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Can a NYC broker charge an 'administrative fee' under the FARE Act?"
      jurisdictionTag="NYC only"
      badges={["FARE Act 2026"]}
      reviewedAt="2026-04-30"
      shortAnswer="No. DCWP has explicitly flagged 'administrative,' 'marketing,' 'processing,' and 'agency' fees as rebranded broker fees when the broker was hired by the landlord. The label on the fee does not change the legal analysis. Separately, NYC application fees are capped at $20 by state law."
      bottomLine="If a landlord-hired broker charges you a fee under any name in 2026 — administrative, marketing, processing, agency, or anything else over $20 that is not security, first month's rent, or your own broker's commission — DCWP treats it as a FARE Act violation."
      sections={[
        {
          heading: "Why renaming the fee does not work",
          body: [
            "The FARE Act prohibits charging a tenant for the work of a landlord-hired broker. The statute is written in terms of the work, not the label. DCWP guidance and 2025–2026 enforcement actions explicitly treat any fee charged by or routed to a landlord-hired broker as covered, regardless of what it is called on a receipt.",
            "The categories DCWP has flagged in enforcement letters and refund orders include: administrative fee, marketing fee, agency fee, processing fee, paperwork fee, lease-prep fee, document fee, and 'broker keys' fees.",
          ],
        },
        {
          heading: "What you can legally be charged",
          body: [
            "After the FARE Act, the legitimate fees on a NYC rental boil down to a short list:",
          ],
          bullets: [
            "First month's rent.",
            "Security deposit (capped at one month's rent under New York State law since 2019).",
            "Application fee — capped at $20 statewide, including credit and background checks combined.",
            "Move-in fee — only if the building's lease/house rules charge one to all tenants and only if it is a real fee for actual costs (e.g., elevator pad rental). Not a vehicle for renaming a broker fee.",
            "Your own broker's fee — only if you separately and explicitly engaged a tenant-side broker before they showed you the unit.",
          ],
        },
        {
          heading: "How to spot a rebrand in real time",
          body: [
            "Three patterns are common in 2026 attempts to evade the FARE Act:",
          ],
          bullets: [
            "An 'administrative fee' equal to roughly 12–15% of annual rent — the same number a broker fee used to be. This is the textbook rebrand.",
            "A 'marketing fee' added to the lease rider when no separate listing was created on the tenant's behalf.",
            "An application fee well above $20 (often $100–$500) that quietly bundles 'processing.' The $20 cap covers all credit/background checks combined.",
          ],
        },
        {
          heading: "What to do if asked to pay one",
          body: [
            "Ask the broker, in writing, what the fee covers and which work product the fee corresponds to. Most rebrands fall apart under that question because there is no separate work product — the broker did the same job they would have done before the FARE Act.",
            "Save the email or text exchange. File at nyc.gov/dcwp. Refunds in 2025–2026 cases have been the standard outcome.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/fare-act-violation-reporter",
          title: "FARE Act Violation Reporter",
          blurb: "Classify the rebrand and draft a DCWP complaint.",
        },
        {
          href: "/tools/fare-act-broker-fee-checker",
          title: "FARE Act savings checker",
          blurb: "What was the fee really worth — what should you not pay?",
        },
      ]}
      relatedQuestions={[
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
          slug: "does-fare-act-apply-to-streeteasy-listings",
          question:
            "Does the FARE Act apply to apartments listed on StreetEasy?",
        },
        {
          slug: "can-landlord-raise-rent-after-fare-act",
          question:
            "Can my NYC landlord raise the rent to cover the broker fee?",
        },
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question:
            "How do I find out if my NYC apartment is rent-stabilized?",
        },
      ]}
      relatedReadingHref="/blog/nyc-fare-act-broker-fee-ban"
      relatedReadingLabel="NYC FARE Act broker fee ban — full guide"
    />
  );
}
