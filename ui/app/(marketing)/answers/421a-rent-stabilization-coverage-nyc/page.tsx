import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "421a-rent-stabilization-coverage-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Are 421-a Apartments Rent-Stabilized in NYC? (2026 Answer)",
  description:
    "Yes — for the duration of the 421-a abatement (typically 10, 15, 20, 25, or 35 years). Some convert to free-market when the abatement expires; others stay stabilized for life.",
  keywords: [
    "421-a rent stabilization",
    "421a rent stabilization NYC",
    "Affordable NY 421-a",
    "421-a abatement expire",
    "421-a vs rent stabilized",
    "421-a renewal cap NYC",
    "421-a tenant rights",
    "post-2017 421-a",
    "421-a free market when",
  ],
  openGraph: {
    title: "Are 421-a apartments rent-stabilized in NYC?",
    description:
      "Yes for the abatement duration. Whether they stay stabilized after depends on the construction year and program version.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Are 421-a apartments rent-stabilized in NYC?"
      jurisdictionTag="NYC"
      badges={["421-a / Affordable NY", "RGB-capped"]}
      reviewedAt="2026-05-03"
      shortAnswer="Yes — every 421-a tax-abated unit is rent-stabilized for as long as the abatement runs (typically 10, 15, 20, 25, or 35 years depending on the program version and the affordability set-aside elected). Renewal increases follow the Rent Guidelines Board cap (2.75% / 5.25% for the Oct 2025 – Sep 2026 cycle), the same as conventionally stabilized units. When the 421-a benefit expires, what happens depends on construction year: pre-1974 buildings stay stabilized for life; post-1974 buildings can convert to free-market unless they qualify for stabilization on another basis."
      bottomLine="Living in a 421-a building? Your unit IS rent-stabilized today. Your lease must include a Rent Stabilization Rider (NYC Form 12). At renewal, the RGB-set cap governs your increase. The clock to watch is the 421-a expiration date — public on the NYC Department of Finance benefit lookup. If the building is post-1974 construction and the only basis for stabilization is the 421-a benefit, the landlord can move you to free-market when the abatement ends."
      sections={[
        {
          heading: "What 421-a actually is",
          body: [
            "421-a is the section of NY Real Property Tax Law that gives developers a property-tax abatement on new multifamily construction in exchange for affordability commitments. The program has been renamed and amended several times since 1971; the post-2017 version is branded 'Affordable New York' (a/k/a 421-a(16)). Most new luxury and mid-market rental towers in NYC built since 2008 are some flavor of 421-a.",
            "The deal: the developer gets reduced property taxes for 10–35 years; in exchange, every unit in the building (including the market-rate units) is rent-stabilized for the abatement period, and a percentage of units are rented at deeper-affordable thresholds tied to AMI bands.",
          ],
        },
        {
          heading: "How long does the abatement (and the stabilization) last?",
          body: [
            "Abatement length varies by program version and election:",
          ],
          bullets: [
            "421-a(1-15) — pre-2008 versions ran 10, 15, or 25 years.",
            "421-a(16) Affordable NY (post-2017) — typically 35 years total: full exemption for years 1–25, then a 30-year partial-affordability tail. Stabilization runs the full 35 years.",
            "421-a(16) extended affordability (Option C/E/G) — affordability commitments run 40 years. Stabilization can extend with them.",
            "Bottom line: in any 421-a building, every unit is stabilized for the full abatement term as a matter of law. The landlord doesn't get to opt out.",
          ],
        },
        {
          heading: "What happens when the abatement expires",
          body: [
            "This is the question every 421-a tenant should know the answer to before signing. Two paths:",
          ],
          bullets: [
            "Pre-1974 building (rare for 421-a, but possible on substantial-rehab projects): the underlying building is permanently rent-stabilized regardless of the abatement, so units stay stabilized for life.",
            "Post-1974 building (the vast majority of 421-a stock): the unit can be deregulated to free-market when the 421-a abatement expires, IF (a) proper notice was given to the tenant at every lease and renewal that the unit was stabilized solely because of the abatement, AND (b) the unit doesn't qualify for stabilization on some other basis (e.g., a separately-elected J-51 enrollment).",
            "DHCR enforces the notice rule strictly. Landlords who failed to include the 421-a expiration notice in the lease at every renewal can lose the deregulation right entirely — the unit then stays stabilized for life.",
          ],
        },
        {
          heading: "How to look up your building's 421-a status",
          body: [
            "Two free tools, both authoritative:",
          ],
          bullets: [
            "NYC Department of Finance Property Tax Benefits lookup — search by address; the active 421-a benefit (if any), term, and expiration year are listed.",
            "DHCR rent history (form RA-90 or online portal) — the registered rent and the registration code (e.g., '421-a') are listed annually back to the unit's first registration. If your unit was ever registered under 421-a, it's in the history.",
            "If both lookups disagree (rare), DHCR is the controlling authority for stabilization status.",
          ],
        },
        {
          heading: "Do market-rate units in a 421-a building have the same protections?",
          body: [
            "Yes. The market-rate units in a 421-a building are stabilized for the abatement period exactly the same way as the income-restricted units. Same RGB cap on renewal increases, same right to a 1- or 2-year renewal lease, same DHCR jurisdiction, same Rent Stabilization Rider requirement. The difference is only in the initial rent (market vs. income-restricted) — the regulatory framework on top is identical.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Run the 3-question test (building age, unit count, abatement) to confirm.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "If stabilized, run the lawful renewal increase.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question: "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "j-51-tax-abatement-rent-stabilization",
          question:
            "Does a J-51 tax abatement make my NYC apartment rent-stabilized?",
        },
        {
          slug: "rent-stabilization-vacancy-decontrol-nyc",
          question: "Did HSTPA end vacancy decontrol in NYC?",
        },
        {
          slug: "how-much-can-rent-stabilized-rent-go-up-2026",
          question: "How much can NYC rent-stabilized rent go up in 2026?",
        },
        {
          slug: "dhcr-rent-history-request-nyc",
          question: "How do I request a NYC apartment's rent history from DHCR?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC rent stabilization — full 2026 guide"
    />
  );
}
