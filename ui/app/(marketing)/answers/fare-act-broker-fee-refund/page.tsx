import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "fare-act-broker-fee-refund";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Can I Get My NYC Broker Fee Refunded? (FARE Act 2026)",
  description:
    "Yes, in many cases. DCWP routinely orders refunds for landlord-hired-broker fees charged to tenants. Standard 30–60 day window; $10K Small Claims if DCWP is slow.",
  keywords: [
    "FARE Act broker fee refund",
    "NYC broker fee refund",
    "DCWP refund broker fee",
    "broker fee back NYC",
    "FARE Act enforcement",
    "small claims broker fee NYC",
    "NYC broker fee illegal refund",
    "tenant broker fee back",
  ],
  openGraph: {
    title: "Can I get my NYC broker fee refunded under the FARE Act?",
    description:
      "Yes — DCWP has been ordering refunds since the FARE Act took effect. Standard outcome is 30–60 days. NYC Small Claims is the backup self-help path.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Can I get my NYC broker fee refunded under the FARE Act?"
      jurisdictionTag="NYC only"
      badges={["FARE Act 2026"]}
      reviewedAt="2026-04-30"
      shortAnswer="Yes, in most cases where the landlord engaged the broker. DCWP has been ordering refunds since the FARE Act took effect on June 11, 2025. The standard administrative path is 30–60 days. If DCWP does not move fast enough, NYC Small Claims Court is the next step — $20 filing fee, $10,000 cap, no attorney required."
      bottomLine="Through April 2026 (about 10 months of enforcement), DCWP has logged well over 1,500 tenant complaints. Refunds are the typical outcome when the broker was landlord-hired and the demand was inside DCWP's roughly 12-month complaint window."
      sections={[
        {
          heading: "Step 1: file at DCWP",
          body: [
            "Go to nyc.gov/dcwp and file a consumer complaint. The complaint form will ask for your name, the broker's name and brokerage, the unit address, the fee amount, the date paid, and how the fee was demanded.",
            "DCWP will contact the broker, ask for their position, and usually issue a refund order within 30–60 days. Repeat-offender brokerages also see $2,000-per-violation fines stack on top.",
          ],
        },
        {
          heading: "Step 2: build the evidence DCWP wants",
          body: ["The strongest complaint files contain four kinds of proof:"],
          bullets: [
            "A screenshot of the listing showing the broker's name + brokerage as the contact.",
            "Written communication (text, email) from the broker confirming they showed the unit, had keys, or are paid by the landlord.",
            "Lease pages showing the broker's name on the rider or the commission line.",
            "Receipts (Zelle screenshot, credit-card statement, cashier's check) showing the payment to the broker or brokerage.",
          ],
        },
        {
          heading: "Step 3: use Small Claims if DCWP is slow",
          body: [
            "If DCWP has not resolved your complaint in 60 days, NYC Small Claims is the standard self-help path. The mechanics:",
          ],
          bullets: [
            "$20 filing fee (more for higher amounts but capped low).",
            "$10,000 maximum award per case.",
            "No attorney is required and there is no jury — you tell your story to a court attorney or judge.",
            "In 2025–2026, tenants have won FARE Act small-claims cases on text-message evidence alone.",
          ],
        },
        {
          heading: "Step 4: when to escalate to civil court or Legal Aid",
          body: [
            "If the fee was over $10,000 (luxury rentals where the broker fee was 15% of $100K+ rent), or if multiple tenants in the same building were charged illegally, civil court or a class action is the path. Legal Aid Society NYC and the Tenant Defense Network handle intake on those.",
            "If your landlord retaliates after you file — sudden lease non-renewal, harassment, repair-and-deduct disputes — that is a separate housing-court issue, and Legal Aid handles those too.",
          ],
        },
        {
          heading: "Statute-of-limitations windows",
          body: [
            "DCWP's administrative complaint window is approximately 1 year from the date of the demand or the date of payment. Small-claims and civil-court windows are typically longer (3 to 6 years on contract / consumer-protection theories) — a tenant-rights attorney can confirm the exact window for your facts. The reporter below flags whether your demand date is inside the 12-month DCWP window.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/fare-act-violation-reporter",
          title: "FARE Act Violation Reporter",
          blurb: "Classifies your case and drafts the DCWP complaint.",
        },
        {
          href: "/tools/fare-act-broker-fee-checker",
          title: "FARE Act savings checker",
          blurb: "Shows the dollar amount in dispute.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "who-pays-broker-fee-nyc-fare-act",
          question: "Who pays the broker fee in NYC under the FARE Act?",
        },
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
