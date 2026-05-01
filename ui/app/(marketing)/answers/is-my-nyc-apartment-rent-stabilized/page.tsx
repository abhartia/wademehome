import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "is-my-nyc-apartment-rent-stabilized";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Is My NYC Apartment Rent-Stabilized? (How to Check, 2026)",
  description:
    "Check three facts: built before 1974? six or more units? no permanent deregulation event? If yes, presumptive stabilization. Order a free DHCR rent history to confirm.",
  keywords: [
    "is my NYC apartment rent stabilized",
    "rent stabilization NYC check",
    "DHCR rent history",
    "rent stabilized eligibility NYC",
    "NYC rent stabilization 2026",
    "pre-1974 NYC building",
    "421-a rent stabilized",
    "rent stabilized renewal NYC",
  ],
  openGraph: {
    title: "Is my NYC apartment rent-stabilized?",
    description:
      "Three quick facts decide it. The DHCR rent history is the official confirmation — free, takes 4–8 weeks.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="How do I find out if my NYC apartment is rent-stabilized?"
      jurisdictionTag="NYC only"
      badges={["Rent stabilization 2026"]}
      reviewedAt="2026-04-30"
      shortAnswer="Run three tests: was the building constructed before 1974, does it have six or more residential units, and has no permanent deregulation event happened? If all three are yes, the unit is presumptively rent-stabilized. Newer buildings receiving 421-a or J-51 tax abatements are also stabilized for the abatement term. Confirm via a free DHCR rent history."
      bottomLine="Most NYC tenants in pre-1974 6+ unit buildings are stabilized and don't know it. Stabilization affects every renewal increase you ever face — the difference between a 2–5% RGB cap and a 15%+ market increase compounds to thousands per year."
      sections={[
        {
          heading: "The three-question quick test",
          body: [
            "Stabilization in NYC follows from how the unit got into the system. The dominant pathway is what's called Emergency Tenant Protection Act (ETPA) coverage:",
          ],
          bullets: [
            "Was the building constructed before January 1, 1974?",
            "Does the building contain six or more residential units?",
            "Has the unit been permanently deregulated? (High-rent / high-income deregulation, gut-renovation events, single-family carve-outs are the main pathways — most of which were closed by the 2019 HSTPA.)",
          ],
        },
        {
          heading: "Newer buildings: 421-a and J-51",
          body: [
            "Buildings constructed after 1974 can still be stabilized if they receive a 421-a or J-51 tax abatement. The deal: the developer gets a property-tax break in exchange for accepting rent stabilization for the duration of the abatement (typically 10–35 years). At the end of the abatement, the unit may stay stabilized if the tenant has been there continuously, depending on the specific abatement program.",
            "If you live in a glass-tower-luxury building constructed in the last 20 years and it's stabilized, this is almost always why.",
          ],
        },
        {
          heading: "How to confirm: DHCR rent history",
          body: [
            "The official confirmation is a free document called a 'Rent Registration History' from the New York State Division of Housing and Community Renewal (DHCR). Request it at hcr.ny.gov. It takes 4–8 weeks to arrive by mail.",
            "The document lists every registered rent for your unit going back decades. If your unit is registered, it's stabilized. If the document comes back with no record, it may be deregulated, never properly registered (also a violation), or coverage may be ETPA-only without DHCR registration. The Rent Stabilization Checker below walks through the analysis.",
          ],
        },
        {
          heading: "What to do if you discover you're stabilized",
          body: [
            "Compare your current rent against the legal regulated rent in the DHCR history. If your landlord has been overcharging — collecting more than the registered rent plus authorized increases — you can file an overcharge complaint with DHCR. The remedy: refund of the overcharge, often with treble damages on willful overcharges (3× the amount).",
            "Even without an overcharge claim, your renewal increases are now governed by the RGB cap (2.75% / 5.25% for the 2025–2026 cycle), not market. Use the RGB calculator below to compute next year's lawful renewal.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb: "Run your building's facts past the eligibility test.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb: "Exact dollar cap on a stabilized renewal.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "how-much-can-rent-stabilized-rent-go-up-2026",
          question:
            "How much can NYC rent-stabilized rent go up in 2026?",
        },
        {
          slug: "can-landlord-raise-rent-after-fare-act",
          question:
            "Can my NYC landlord raise the rent to cover the broker fee?",
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
          slug: "can-broker-charge-administrative-fee-nyc",
          question:
            "Can a NYC broker charge an 'administrative fee' under the FARE Act?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC rent stabilization — complete tenant guide"
    />
  );
}
