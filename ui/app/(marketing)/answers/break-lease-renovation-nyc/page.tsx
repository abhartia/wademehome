import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "break-lease-renovation-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Can a NYC Landlord Break My Lease for Renovations? (2026)",
  description:
    "No — a signed lease binds the landlord too. NYC landlords cannot evict a free-market tenant mid-lease for renovations without paying buyout damages. Rent-stabilized tenants have stronger protections still.",
  keywords: [
    "NYC landlord break lease renovation",
    "can landlord evict for renovation NYC",
    "NYC lease break renovation",
    "renovation buyout NYC",
    "rent stabilized renovation eviction",
    "NYC lease termination landlord",
    "NYC tenant rights renovation",
    "RPL 235-f",
  ],
  openGraph: {
    title: "Can a NYC landlord break my lease for renovations?",
    description:
      "No — a signed lease binds the landlord too. Buyouts are negotiated, not imposed. Rent-stabilized tenants have stronger protections.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Can my NYC landlord break my lease for renovations?"
      jurisdictionTag="NYC tenant rights"
      badges={["Lease law 2026"]}
      reviewedAt="2026-05-02"
      shortAnswer="No. A signed NYC lease binds the landlord just as much as the tenant. A landlord cannot terminate a free-market lease mid-term for 'renovations' or 'building improvements' — only for the limited grounds the lease itself or NYC's Housing Maintenance Code lists (mostly nonpayment, lease violation, or owner-occupancy under narrow conditions). Buyouts are always negotiated, not imposed."
      bottomLine="If your NYC landlord tells you to leave for renovations before your lease ends, your starting position is: no, the lease binds you both. They can offer you a buyout (cash to leave voluntarily); you can negotiate or refuse. Rent-stabilized tenants have additional protections — landlords cannot use renovation as a pretext to push out stabilized tenants without HCR approval."
      sections={[
        {
          heading: "Free-market tenants — the lease is the law",
          body: [
            "A signed NYC lease is a binding contract for both parties. The landlord agrees to deliver the apartment for the term, and the tenant agrees to pay rent and abide by the lease. Renovations, building improvements, conversion plans, or sale of the building do not give the landlord a unilateral termination right unless the lease itself includes such a clause — which most NYC standard form leases do not.",
            "If the landlord wants you out, they have two options: (1) wait until lease end and not renew, or (2) offer you a cash buyout to leave voluntarily. Buyouts in NYC for desirable units typically range from 3–24 months of rent, depending on the strategic value of vacating the unit (lease-up at much higher rent, demolition, or condo conversion).",
          ],
        },
        {
          heading: "Rent-stabilized tenants — much stronger protection",
          body: [
            "If your apartment is rent-stabilized, the landlord cannot end your tenancy at lease end either — you have a right to renewal at the RGB-set increase. Renovation is not an automatic ground for non-renewal.",
            "Even substantial-rehabilitation arguments require the landlord to file with NY Homes & Community Renewal (HCR) and prove the building is actually unfit and that the work cannot be done with tenants in place. HCR rejects most of these applications. Coercive renovation tactics (no heat, no hot water, intentional construction noise) are tenant harassment under NYC Admin Code § 27-2004(a)(48) and trigger Housing Court and DOB penalties.",
          ],
        },
        {
          heading: "How to handle a buyout offer",
          body: [
            "If the landlord makes a buyout offer, treat it as the start of a negotiation, not a take-it-or-leave-it:",
          ],
          bullets: [
            "Get the offer in writing.",
            "Don't sign anything on the first call. Take 7+ days to research comparables.",
            "Counter at 2–3× the initial offer. Landlords routinely come up.",
            "If you're rent-stabilized, your buyout floor is much higher — your right to renew at a regulated rent has substantial financial value to the landlord.",
            "Consider hiring a tenant-rights attorney; many work on contingency for buyouts above $10K and can extract 2–4× higher offers.",
          ],
        },
        {
          heading: "When a landlord can legitimately terminate early",
          body: [
            "Limited cases exist. (1) The lease itself includes an early-termination clause (rare in residential leases). (2) The landlord is invoking nonpayment, lease violation, or another lease-listed default. (3) Owner-occupancy: the landlord intends to move into the unit and uses the formal RPL § 226-b notice (only valid in narrow circumstances and usually requires going through Housing Court). (4) The Department of Buildings issues a vacate order due to genuine unsafe conditions — but this is the city's call, not the landlord's.",
            "Renovation is not on this list. If the landlord cites renovation, they're asking, not telling.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Verify whether your unit is stabilized — strongest defense against eviction-for-renovation pressure.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "Run the lawful renewal increase to gauge what your renewed lease should look like.",
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
          slug: "dhcr-rent-history-request-nyc",
          question:
            "How do I request a NYC apartment's rent history from DHCR?",
        },
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "can-landlord-raise-rent-after-fare-act",
          question:
            "Can my NYC landlord raise the rent to cover the broker fee?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC rent stabilization guide — full overview"
    />
  );
}
