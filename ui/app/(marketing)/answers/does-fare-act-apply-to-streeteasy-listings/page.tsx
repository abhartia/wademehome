import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "does-fare-act-apply-to-streeteasy-listings";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Does the FARE Act Apply to StreetEasy Listings? (NYC, 2026)",
  description:
    "Yes. If a broker posted the listing on StreetEasy, Zillow, or any platform, the FARE Act treats them as landlord-engaged — the landlord pays. Tenant-paid fee is illegal.",
  keywords: [
    "FARE Act StreetEasy",
    "FARE Act apartment listings",
    "StreetEasy broker fee",
    "FARE Act NYC 2026",
    "is broker fee legal StreetEasy",
    "no fee listings NYC",
    "StreetEasy listing fee NYC",
    "FARE Act listing platforms",
  ],
  openGraph: {
    title: "Does the FARE Act apply to StreetEasy listings?",
    description:
      "Listing-platform postings are the strongest single FARE Act signal. If the broker posted the listing, the landlord engaged them and the tenant fee is illegal.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Does the FARE Act apply to apartments listed on StreetEasy?"
      jurisdictionTag="NYC only"
      badges={["FARE Act 2026"]}
      reviewedAt="2026-04-30"
      shortAnswer="Yes. If a broker posted the listing on StreetEasy, Zillow, Apartments.com, or any public rental platform, the FARE Act treats them as landlord-engaged. Charging the tenant a broker fee on that lease is illegal under NYC Admin. Code §§ 20-699.20–20-699.27 (effective June 11, 2025)."
      bottomLine="Listing authorship is the strongest single FARE Act signal. If the broker's name or brokerage is on the StreetEasy listing as the contact, you almost certainly do not owe a broker fee — and if you already paid one, DCWP routinely orders refunds."
      sections={[
        {
          heading: "Why listing authorship is the test that decides",
          body: [
            "The FARE Act does not ban broker fees outright. It says the party who hired the broker pays the broker. The whole law turns on identifying who hired whom.",
            "DCWP — the NYC Department of Consumer and Worker Protection that enforces the Act — has written guidance treating listing authorship as near-conclusive. Tenants do not pay to post listings on StreetEasy; landlords (or their agents) do. If a broker is the contact on a public listing, they are marketing the unit on the landlord's behalf.",
            "Eight months of DCWP enforcement data through April 2026 line up with that reading: violation findings consistently cite who posted the listing as a primary fact.",
          ],
        },
        {
          heading: "What StreetEasy listing data DCWP looks at",
          body: [
            "When you file a complaint, DCWP will ask for evidence the broker who demanded a fee from you was the same broker named on the listing. The cleanest proof:",
          ],
          bullets: [
            "A screenshot of the StreetEasy listing showing the broker's name + brokerage in the contact block.",
            "Any email or text from that broker confirming the unit address.",
            "The lease itself, with the brokerage on the rider or commission line.",
            "If the listing was on Zillow, Apartments.com, RentHop, Localize, or Naked Apartments — same evidentiary value.",
          ],
        },
        {
          heading: "The narrow exception",
          body: [
            "The FARE Act has one carve-out: tenant-side broker representation. If you signed a search agreement up front with a buyer's-side broker — paid them an hourly retainer, gave them a written engagement scope — and that broker found you a unit on StreetEasy, you can owe their fee. The broker is your agent, not the landlord's.",
            "This is rare in NYC rentals. Most apartment hunters call the number on a StreetEasy listing; that broker is by definition not their tenant-side rep. If you do not remember signing a written representation agreement before the broker showed you any unit, the carve-out does not apply.",
          ],
        },
        {
          heading: "If you already paid",
          body: [
            "File at nyc.gov/dcwp. Average DCWP resolution is 30–60 days; refunds are common when listing-authorship evidence is clean. If DCWP does not move fast enough, NYC Small Claims Court ($20 filing fee, $10,000 cap, no attorney needed) is the standard self-help path.",
            "Use the FARE Act Violation Reporter below to draft the complaint with your details inserted.",
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
          blurb: "Estimate your savings if the fee was illegal.",
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
          slug: "fare-act-broker-fee-refund",
          question:
            "Can I get my NYC broker fee refunded under the FARE Act?",
        },
        {
          slug: "does-fare-act-apply-to-jersey-city-hoboken",
          question: "Does the FARE Act apply to Jersey City and Hoboken?",
        },
        {
          slug: "can-landlord-raise-rent-after-fare-act",
          question:
            "Can my NYC landlord raise the rent to cover the broker fee?",
        },
      ]}
      relatedReadingHref="/blog/nyc-fare-act-broker-fee-ban"
      relatedReadingLabel="NYC FARE Act broker fee ban — full guide"
    />
  );
}
