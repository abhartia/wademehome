import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "free-market-rent-increase-renewal-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Max NYC Free-Market Rent Increase at Renewal? (2026 Rules)",
  description:
    "There is no NYC cap on free-market renewal increases — only on rent-stabilized units. But landlords must give 30/60/90-day written notice if increasing more than 5%, per NY HSTPA § 226-c.",
  keywords: [
    "NYC rent increase renewal",
    "NYC free market rent increase",
    "max NYC rent renewal",
    "NYC landlord rent increase notice",
    "HSTPA 226-c rent increase",
    "NYC 90-day rent increase notice",
    "NYC rent renewal cap free market",
    "NYC rent jump renewal",
  ],
  openGraph: {
    title: "How much can a NYC landlord raise the rent at renewal?",
    description:
      "No cap on free-market units — but written notice required for >5% increases. 30/60/90 days based on tenancy length.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="How much can a NYC landlord raise my rent at renewal if I'm not rent-stabilized?"
      jurisdictionTag="NYS / NYC"
      badges={["Free market", "HSTPA § 226-c"]}
      reviewedAt="2026-05-02"
      shortAnswer="There is no statutory cap on rent increases for free-market (non-rent-stabilized) NYC apartments. The market sets the price. However, NY Real Property Law § 226-c (added by HSTPA 2019) requires written notice for any renewal increase of more than 5%: 30 days for tenancies under 1 year, 60 days for tenancies of 1–2 years, and 90 days for tenancies of 2+ years. If proper notice isn't given, the tenant has the right to remain at the current rent until the notice period passes."
      bottomLine="If your NYC apartment is free-market (not rent-stabilized), the landlord can raise the renewal rent by any amount — but they must give you 30/60/90-day advance written notice for increases over 5%. If you receive a renewal at a sharp increase with short notice, the notice period is your leverage: you have time to negotiate, find another unit, or insist they comply with § 226-c."
      sections={[
        {
          heading: "Free-market vs. rent-stabilized — different rules",
          body: [
            "About 56% of NYC's rental stock is rent-stabilized (~1 million units), capped at the annual percentage the Rent Guidelines Board sets. Free-market units (the other ~44%) have no statutory increase cap — at renewal, the landlord quotes whatever the market will bear.",
            "If you don't know which one you have, the rent-stabilization checker tool runs a 3-question test in 30 seconds. The lease itself usually says — look for a Rent Stabilization Rider (NYC Form 12) or a 'free market' designation.",
          ],
        },
        {
          heading: "What HSTPA § 226-c actually requires",
          body: [
            "Real Property Law § 226-c — added by the Housing Stability and Tenant Protection Act of 2019 — requires a NYC landlord to give written notice if they intend to (a) not renew the lease, or (b) renew with a rent increase of more than 5%. The notice period scales with how long you've been a tenant:",
          ],
          bullets: [
            "Less than 1 year of tenancy: 30 days advance written notice.",
            "1 year up to 2 years of tenancy: 60 days advance written notice.",
            "2 or more years of tenancy: 90 days advance written notice.",
            "Notice less than the required period: tenant has the right to stay at the current rent until the proper notice period elapses.",
          ],
        },
        {
          heading: "What 'no cap' means in practice",
          body: [
            "Landlords can technically raise free-market rent by any percentage. In practice, NYC market-rate increases over the last decade have averaged 3–8% per year for tenants in place, with sharper jumps (15–30%) when a unit is being repriced to market after a long tenancy.",
            "If you receive a renewal at 25%+ over the prior rent: this is usually a 'go away' price — the landlord wants the unit back. Negotiate down, or use the notice period to find another unit. Mid-cycle (Jan–Mar) renewals tend to be most aggressive; off-season (Sep–Nov) is more negotiable.",
          ],
        },
        {
          heading: "Negotiation leverage when you get a steep renewal",
          body: [
            "Three things that move the number down:",
          ],
          bullets: [
            "Comparable listings in the same building or block at lower asking rent — print them and bring them to the conversation.",
            "Tenancy length and rent-payment history. Landlords value reliable on-time payers and avoid vacancy costs ($2,000–$5,000 in lost rent + lease-up fees).",
            "Willingness to sign a longer lease (24 months) in exchange for a smaller increase.",
            "If the landlord won't move and you walk: factor in your move costs. The move-in cost estimator handles the math.",
          ],
        },
        {
          heading: "When the rent IS capped",
          body: [
            "Three exceptions where free-market-style increases don't apply: (1) The unit is actually rent-stabilized — RGB-set cap (2.75% / 5.25% for the Oct 2025 – Sep 2026 cycle). (2) The building is in a 421-a / J-51 / Mitchell-Lama tax-abatement program — rent-regulated for the abatement term. (3) The lease itself includes a renewal cap clause (rare in NYC, but possible in negotiated leases).",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Verify whether your unit is actually free-market or stabilized.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "If stabilized, run the lawful renewal increase.",
        },
        {
          href: "/tools/net-effective-rent-calculator",
          title: "Net-Effective Rent Calculator",
          blurb:
            "Compare your renewal offer to fresh market listings.",
        },
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Run the cost to move if you decide to walk on a steep renewal.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question: "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "how-much-can-rent-stabilized-rent-go-up-2026",
          question: "How much can NYC rent-stabilized rent go up in 2026?",
        },
        {
          slug: "break-lease-renovation-nyc",
          question: "Can my NYC landlord break my lease for renovations?",
        },
        {
          slug: "can-landlord-raise-rent-after-fare-act",
          question:
            "Can my NYC landlord raise the rent to cover the broker fee?",
        },
        {
          slug: "dhcr-rent-history-request-nyc",
          question:
            "How do I request a NYC apartment's rent history from DHCR?",
        },
      ]}
      relatedReadingHref="/nyc-rent-by-neighborhood"
      relatedReadingLabel="NYC rent by neighborhood — current medians + concession data"
    />
  );
}
