import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-moving-cost-2026";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "How Much Does It Cost to Move to NYC in 2026? (Itemized)",
  description:
    "A NYC apartment move in 2026 costs $4,500–$15,500 typical for a one-bedroom. Itemized: first month + security + movers + COI + utility setup + tipping. Broker fee is usually $0 thanks to the FARE Act.",
  keywords: [
    "NYC moving cost 2026",
    "how much does it cost to move to NYC",
    "NYC apartment moving cost",
    "NYC move-in cost",
    "cost of moving to NYC",
    "NYC mover cost",
    "first month security NYC total",
    "NYC apartment lease signing cost",
  ],
  openGraph: {
    title: "How much does it cost to move to NYC in 2026?",
    description:
      "$4,500–$15,500 typical for a 1BR. First + security + movers + COI + utilities + tipping. Broker fee usually $0 (FARE Act).",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="How much does it cost to move to NYC in 2026?"
      jurisdictionTag="NYC + JC + Hoboken"
      badges={["Move-in cost 2026"]}
      reviewedAt="2026-05-02"
      shortAnswer="A typical 2026 NYC apartment move costs $4,500–$15,500 all-in for a one-bedroom, depending on rent level and whether you hire pro movers. The biggest pieces are first month's rent + a one-month security deposit (HSTPA cap), professional movers, building Certificate of Insurance fees, utility set-up deposits, and tipping. The broker fee — historically the largest single line — is usually $0 in 2026 thanks to the FARE Act."
      bottomLine="The honest pre-FARE NYC move-in cost was 4–6× monthly rent (first + last + security + broker fee + movers). In 2026, with HSTPA capping deposits at one month and the FARE Act eliminating tenant broker fees, the typical move-in is 2–3× monthly rent + movers + utilities. For a $4,000/month 1BR, that's roughly $11,000–$13,500 cash at lease signing."
      sections={[
        {
          heading: "The full itemized breakdown (1BR, $4,000/month gross example)",
          body: [
            "All numbers are 2026 NYC market typical for a free-market one-bedroom at $4,000/month gross rent. Adjust proportionally for studio (down ~25%) or 2BR (up ~30%).",
          ],
          bullets: [
            "First month's rent: $4,000 (paid forward, not held).",
            "Security deposit: $4,000 (HSTPA cap = one month).",
            "Application + credit/background check fee: $20 max per applicant (RPL § 238-a cap).",
            "Broker fee: $0 in most cases under the FARE Act, since June 2025. (Pre-FARE: $4,000–$7,200 = 8.33–15% of annual rent.)",
            "Local movers (1BR, 2 movers, ~3 hrs): $700–$1,500.",
            "Building move-in fee + COI (Certificate of Insurance): $300–$750. Many doorman buildings require both.",
            "Renters insurance, year 1: $150–$300.",
            "Utility setup deposits (Con Ed, internet, gas if separate): $200–$500.",
            "Tipping movers: $100–$300.",
            "Furniture / supplies first 30 days: highly variable, $500–$3,000+.",
          ],
        },
        {
          heading: "Total cash at lease signing",
          body: [
            "Just the lease-signing line items (first + security + application + COI + maybe a move-in fee): $8,300–$8,800 for the example above. Add movers + utilities + insurance over the first month: $9,650–$11,150. Pre-FARE the equivalent move was $13,650–$18,350.",
            "If you have a guarantor-substitute service like Insurent or TheGuarantors, factor in their fee (typically 65–85% of one month's rent). Some landlords waive it for verifiable income at 40× monthly rent or above.",
          ],
        },
        {
          heading: "Where costs vary",
          body: [
            "Walkup vs. doorman: doorman buildings frequently require COI ($150–$400) and a move-in deposit ($250–$1,000, refundable). Walkups have neither but mover labor goes up by ~25–40% for stairs.",
            "Studio vs. 1BR vs. 2BR: scales with rent, plus mover labor scales with cubic feet of stuff.",
            "JC / Hoboken vs. NYC: NJ doesn't have the FARE Act, so broker fees still occasionally apply (though most large NJ rentals are direct-leased / no-fee). NJ security deposit cap is 1.5 months (vs. NYC's 1 month). PATH adds a transit setup line item.",
            "Long-distance move: interstate moves cost $2,500–$8,000 for a 1BR depending on distance. Local NYC quotes are based on hourly labor; long-distance is based on weight + miles.",
          ],
        },
        {
          heading: "Hidden costs renters miss",
          body: [
            "Three things that surprise first-time NYC renters: (1) The COI requirement — many doorman buildings won't let movers in without one, and your mover has to issue it (sometimes $50–$150 extra). (2) Building elevator reservation slots — peak Saturdays are booked weeks ahead and may push your move-in to a weekday, which means taking time off work. (3) Furniture delivery vs. self-move — IKEA or Wayfair delivery to a walkup is a separate fee from your apartment movers.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Plug in your rent and building type, get the full itemized total in 30 seconds.",
        },
        {
          href: "/tools/fare-act-broker-fee-checker",
          title: "FARE Act Savings Checker",
          blurb:
            "Quantify the broker-fee dollars the FARE Act puts back in your pocket.",
        },
        {
          href: "/tools/net-effective-rent-calculator",
          title: "Net-Effective Rent Calculator",
          blurb:
            "Compare two listings on the only honest rent number.",
        },
        {
          href: "/tools/path-commute-roi-calculator",
          title: "PATH Commute ROI Calculator",
          blurb:
            "If JC/Hoboken is in the mix, run the rent-vs-commute math first.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
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
          slug: "gross-vs-net-effective-rent",
          question:
            "What's the difference between gross rent and net effective rent?",
        },
        {
          slug: "how-much-was-typical-nyc-broker-fee-before-fare-act",
          question:
            "How much was the typical NYC broker fee before the FARE Act?",
        },
      ]}
      relatedReadingHref="/cost-of-moving-to-nyc"
      relatedReadingLabel="Cost of moving to NYC — full breakdown + scenarios"
    />
  );
}
