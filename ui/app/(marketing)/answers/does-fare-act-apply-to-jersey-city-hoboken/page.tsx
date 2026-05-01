import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "does-fare-act-apply-to-jersey-city-hoboken";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Does the FARE Act Apply to Jersey City and Hoboken? (2026)",
  description:
    "No. The FARE Act is a NYC ordinance only — it does not apply in Jersey City, Hoboken, Newark, or anywhere in NJ. NJ landlord-direct buildings often have no broker fee anyway.",
  keywords: [
    "FARE Act Jersey City",
    "FARE Act Hoboken",
    "FARE Act NJ",
    "Jersey City broker fee",
    "Hoboken broker fee",
    "Newark broker fee",
    "no fee NJ apartments",
    "NJ tenant rights broker fee",
  ],
  openGraph: {
    title: "Does the FARE Act apply to Jersey City and Hoboken?",
    description:
      "No — the FARE Act is NYC-only. NJ broker-fee practices are different (most large complexes are direct-leased / no-fee anyway).",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Does the FARE Act apply to Jersey City and Hoboken?"
      jurisdictionTag="NJ — FARE Act does not apply"
      badges={["NJ tenant rights"]}
      reviewedAt="2026-04-30"
      shortAnswer="No. The FARE Act is a New York City ordinance (NYC Admin. Code §§ 20-699.20–20-699.27). It does not apply in Jersey City, Hoboken, Newark, or anywhere else in New Jersey. NJ broker-fee practice is governed by state law and individual lease terms — and in practice most large NJ rental complexes operate direct-leased / no-fee even without a FARE Act."
      bottomLine="If you are renting in JC, Hoboken, or anywhere in NJ, the FARE Act gives you no leverage — but the typical NJ luxury complex (LeFrak, Roseland, Toll, Tarragon) is direct-leased through an in-house team and charges no broker fee anyway. The FARE Act question rarely comes up on those buildings."
      sections={[
        {
          heading: "What the FARE Act actually covers",
          body: [
            "The FARE Act is a New York City Council ordinance, codified in NYC Administrative Code §§ 20-699.20–20-699.27 and enforced by DCWP. By design and by jurisdiction, it covers only rentals located in the five boroughs of New York City: Manhattan, Brooklyn, Queens, Bronx, and Staten Island.",
            "Crossing the Hudson — into Jersey City, Hoboken, Weehawken, Edgewater, West New York, Newark, or anywhere else in New Jersey — takes you out of NYC code entirely. NYC enforcement bodies have no jurisdiction in NJ; DCWP cannot order refunds in NJ cases.",
          ],
        },
        {
          heading: "Why NJ broker fees are usually a non-issue anyway",
          body: [
            "The Hudson waterfront's rental stock is dominated by large institutional landlords with in-house leasing teams. Newport (LeFrak), Port Imperial / Hoboken waterfront (Roseland, Toll Brothers, Tarragon), and the JC downtown high-rises typically operate direct-leased: you call the leasing office, they show you the unit, you sign with them. No third-party broker, no broker fee.",
            "When a tenant works with a third-party broker on a JC or Hoboken rental, the broker is most often paid by the landlord on lease-up — same direct-pay model the FARE Act now mandates in NYC, just achieved through market structure rather than legislation.",
          ],
        },
        {
          heading: "When you might still pay a broker fee in NJ",
          body: ["The cases where NJ tenants do pay a broker fee:"],
          bullets: [
            "Smaller-landlord rentals — the small two-family or four-unit walk-ups where the landlord posts on Zillow and a local broker decides to chase a fee from the tenant.",
            "Tenant-side relocation searches — you signed a written engagement with a broker, paid them a retainer, and they found you a unit in NJ.",
            "Sublet markets where there is no listing and the broker is a matchmaker.",
          ],
        },
        {
          heading: "What NJ tenants can do",
          body: [
            "NJ does not have a FARE Act analog. Your leverage is contractual: read the lease and any broker fee agreement before you sign. Decline to sign anything you do not understand. NJ landlord-tenant law is otherwise tenant-favorable on security deposits (capped at 1.5 months' rent), notice requirements, and habitability.",
            "If you are weighing NYC vs. NJ for cost reasons, the move-in cost estimator and PATH commute math below help quantify the trade-off — including the FARE Act savings you give up by leaving NYC.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in cost estimator",
          blurb:
            "First, last, security, movers — works for both NYC (FARE Act) and NJ.",
        },
        {
          href: "/tools/net-effective-rent-calculator",
          title: "Net-effective rent calculator",
          blurb: "Compare NYC vs JC/Hoboken offers on real concession-adjusted rent.",
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
          slug: "can-broker-charge-administrative-fee-nyc",
          question:
            "Can a NYC broker charge an 'administrative fee' under the FARE Act?",
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
