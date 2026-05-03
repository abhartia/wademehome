import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "dhcr-rent-history-request-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "How to Request a NYC DHCR Rent History (2026 Guide)",
  description:
    "Tenants of any rent-regulated NYC apartment can request the unit's full rent history from NY Homes & Community Renewal (HCR/DHCR) for free. Online turnaround is 2–6 weeks; mailed requests take 6–10 weeks.",
  keywords: [
    "DHCR rent history",
    "NYC rent history request",
    "HCR rent history NYC",
    "how to get DHCR rent history",
    "NYC apartment rent history",
    "rent stabilized rent history",
    "NYC overcharge rent history",
    "DHCR online portal",
  ],
  openGraph: {
    title: "How do I request a NYC apartment's rent history from DHCR?",
    description:
      "Free request to NY HCR. Online portal 2–6 weeks; mail 6–10 weeks. Required for any rent-overcharge case.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="How do I request a NYC apartment's rent history from DHCR?"
      jurisdictionTag="NYS / NYC"
      badges={["Rent stabilization", "Free request"]}
      reviewedAt="2026-05-02"
      shortAnswer="Any tenant of a rent-regulated NYC apartment can request the unit's full rent registration history from NY Homes & Community Renewal (HCR, formerly DHCR) for free. The fastest path is the HCR online tenant portal (typical turnaround 2–6 weeks). Mailed paper requests on form RA-90 take 6–10 weeks. The history shows every rent registered for the unit since 1984, plus any preferential-rent arrangements."
      bottomLine="If you suspect rent overcharge or want to confirm whether your NYC apartment is genuinely rent-stabilized, the HCR rent history is the authoritative document. The request is free, you have a statutory right to it as the current tenant, and the answer settles most disputes — including whether a 'preferential rent' was lawfully recaptured at renewal."
      sections={[
        {
          heading: "Who can request",
          body: [
            "The current tenant of record can always request the rent history for their own unit. Prior tenants can request for the period of their tenancy. Prospective tenants generally cannot — but if you have a signed lease or are a named applicant, HCR will sometimes process the request.",
            "Owners (landlords) can request their own building's history. Attorneys representing tenants can submit requests on the tenant's behalf with authorization.",
          ],
        },
        {
          heading: "How to file (online — fastest)",
          body: [
            "The HCR online portal at hcr.ny.gov is the fastest route. You'll need:",
          ],
          bullets: [
            "Building address (street + borough + ZIP).",
            "Apartment number.",
            "Your name and contact info as the current tenant.",
            "A copy of a current utility bill, lease, or government ID showing your name at the address (the portal will ask you to upload this).",
          ],
        },
        {
          heading: "How to file (paper form RA-90)",
          body: [
            "If you'd rather mail it: download form RA-90 from the HCR website ('Tenant's Request for Rental History — Form RA-90'), fill it out completely (building address, apartment, your name, signature), attach proof of tenancy, and mail to: NYS Homes and Community Renewal, Office of Rent Administration, Gertz Plaza, 92-31 Union Hall Street, 6th Floor, Jamaica, NY 11433.",
            "Mail turnaround in 2026 is running 6–10 weeks. The online portal route, when available, is materially faster.",
          ],
        },
        {
          heading: "What the rent history actually shows",
          body: [
            "The DHCR/HCR rent history is a chronological table starting in 1984 (when registration was first required) showing, for each year:",
          ],
          bullets: [
            "Legal regulated rent (the cap from prior renewals).",
            "Actual rent charged (usually equal to the legal rent unless a preferential rent was offered).",
            "Tenant of record (name).",
            "Tax abatement / regulatory program (421-a, J-51, etc.).",
            "Rent-stabilization status code (RS = stabilized, EX = exempt, etc.).",
          ],
          // body continues — done above with bullet items
        },
        {
          heading: "Why tenants pull this",
          body: [
            "Three common reasons. (1) To confirm a unit is actually rent-stabilized when the landlord claims it isn't. (2) To investigate suspected rent overcharge — by law, you can compare what the landlord is charging today to what they have lawfully been allowed to charge based on cumulative RGB-set increases since the last lawful base. (3) To preserve evidence before a deregulation or substantial-rehabilitation argument. Overcharge claims have a 6-year lookback period under HSTPA — pull early and preserve the document.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Run a 3-question test before pulling the rent history.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "Compute the lawful renewal increase against what was actually charged.",
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
          question:
            "Can my NYC landlord break my lease for renovations?",
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
