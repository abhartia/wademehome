import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "rent-stabilization-vacancy-decontrol-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Did HSTPA End Vacancy Decontrol in NYC? (2026 Answer)",
  description:
    "Yes. The Housing Stability and Tenant Protection Act of 2019 permanently ended high-rent vacancy decontrol and the 20% vacancy bonus. Once stabilized, units now stay stabilized.",
  keywords: [
    "vacancy decontrol NYC",
    "high rent vacancy decontrol",
    "vacancy decontrol HSTPA",
    "rent stabilization permanent NYC",
    "20% vacancy bonus NYC",
    "rent stabilization deregulation NYC",
    "$2,774 vacancy decontrol threshold",
    "NYC rent stabilization escape hatch closed",
    "HSTPA 2019 deregulation",
  ],
  openGraph: {
    title: "Did HSTPA end vacancy decontrol in NYC?",
    description:
      "Yes — vacancy decontrol, the 20% vacancy bonus, and high-income deregulation were all repealed in June 2019.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Did HSTPA end vacancy decontrol in NYC?"
      jurisdictionTag="NYC / NYS"
      badges={["HSTPA 2019", "Permanent change"]}
      reviewedAt="2026-05-03"
      shortAnswer="Yes. The Housing Stability and Tenant Protection Act of 2019 (HSTPA), signed June 14, 2019, permanently ended three deregulation pathways that had been quietly draining the NYC rent-stabilized stock for 25 years: high-rent vacancy decontrol, the 20% vacancy bonus, and high-income deregulation. Once a NYC unit is rent-stabilized today, it stays stabilized — there is no longer a rent threshold or income threshold that flips it free-market on turnover."
      bottomLine="Before HSTPA, a stabilized unit's legal rent could cross a deregulation threshold ($2,774.76 in 2018) and become free-market on the next vacancy. About 155,000 NYC units were lost to vacancy decontrol between 1994 and 2019. HSTPA closed all three escape hatches in 2019. If your unit was stabilized in 2019, it still is in 2026 — the 'crossed the threshold' deregulation argument no longer works."
      sections={[
        {
          heading: "The three pathways HSTPA closed",
          body: [
            "Before 2019, NYC's rent-stabilized stock leaked in three distinct ways. HSTPA repealed all three in a single statute:",
          ],
          bullets: [
            "High-rent vacancy decontrol — once a unit's legal regulated rent crossed a threshold ($2,774.76 in 2018, scaled annually), the next vacancy turned the unit free-market. REPEALED.",
            "20% vacancy bonus — landlords could legally raise the regulated rent by ~20% on every turnover, plus a longevity bonus, accelerating the trip to the threshold. REPEALED.",
            "High-income / high-rent decontrol — units rented to households earning over $200,000 for two consecutive years could be deregulated when the legal rent also exceeded the threshold. REPEALED.",
          ],
        },
        {
          heading: "How big was the leak before HSTPA?",
          body: [
            "Between 1994 (when high-rent vacancy decontrol was enacted) and 2019, NYC lost an estimated 155,000+ units from rent stabilization through these three pathways combined. The Rent Guidelines Board's 2017 Housing Supply Report counted ~25,000 deregulations in 2016 alone.",
            "After HSTPA, the only ways a unit can leave rent stabilization are: (1) the building is permanently demolished, (2) a 421-a / J-51 / Mitchell-Lama tax-benefit period ends AND the unit was post-1974 construction NOT otherwise stabilized, or (3) DHCR grants a fact-specific Substantial Rehabilitation deregulation (rare, narrowly construed).",
          ],
        },
        {
          heading: "What this means if you're a current stabilized tenant",
          body: [
            "Your protections are stronger now than they have been at any point since 1994:",
          ],
          bullets: [
            "Renewal rent increases are capped by the RGB annually (2.75% / 5.25% for the Oct 2025 – Sep 2026 cycle).",
            "Your unit cannot be deregulated by crossing a rent threshold — that threshold no longer exists.",
            "Your unit cannot be deregulated by income — high-income decontrol was eliminated.",
            "Major Capital Improvement (MCI) and Individual Apartment Improvement (IAI) rent increases were also sharply curtailed and made temporary, not permanent additions to the legal rent.",
            "Your right to a renewal lease (1 or 2 year, your choice) was preserved unchanged.",
          ],
        },
        {
          heading: "What this means if you're hunting for a stabilized unit",
          body: [
            "The total stabilized stock is no longer shrinking through these three pathways. New stabilized units do enter the rolls each year — primarily through new 421-a buildings (Affordable NY, the post-2017 tax abatement) and J-51 enrollments — but the daily attrition has stopped.",
            "Rent-stabilized listings are not always advertised as such. The lease itself is the proof — a Rent Stabilization Rider (NYC Form 12) must be attached. If you suspect a unit is stabilized but the asking rent doesn't reflect it, request the DHCR rent history before signing — it's free, takes 2–6 weeks via the online portal, and is the single document a tenant-rights attorney will ask for first in any overcharge case.",
          ],
        },
        {
          heading: "What HSTPA did NOT change",
          body: [
            "A few features people sometimes assume HSTPA repealed but didn't:",
          ],
          bullets: [
            "Demolition is still a deregulation pathway. A landlord who wants the unit back to demolish the building can still pursue it through DHCR with a Notice of Intent to Demolish.",
            "Substantial Rehabilitation (~75%+ of building systems replaced) can still produce a fact-specific DHCR ruling that the building re-enters the market unstabilized. This is hard to establish and rarely granted.",
            "Single-family homes and condos remain outside rent stabilization regardless of building age or rent level.",
            "If a 421-a / J-51 abatement ends and the unit's only basis for stabilization was that abatement, the unit can become free-market when the abatement expires (and the post-1974 construction requirement is met).",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Run the 3-question test to see if your unit is stabilized.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "Run the lawful 2025–2026 renewal increase on your stabilized rent.",
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
          slug: "421a-rent-stabilization-coverage-nyc",
          question: "Are 421-a apartments rent-stabilized in NYC?",
        },
        {
          slug: "j-51-tax-abatement-rent-stabilization",
          question:
            "Does a J-51 tax abatement make my NYC apartment rent-stabilized?",
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
