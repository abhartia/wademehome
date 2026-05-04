import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "j-51-tax-abatement-rent-stabilization";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Does J-51 Make My NYC Apartment Rent-Stabilized? (2026)",
  description:
    "Yes — receiving J-51 tax benefits places every unit in the building under rent stabilization for the duration of the benefit. Roberts v. Tishman Speyer (2009) closed the loophole landlords had used to opt out.",
  keywords: [
    "J-51 rent stabilization",
    "J-51 tax abatement NYC",
    "J-51 tenant rights",
    "Roberts v. Tishman Speyer",
    "J-51 luxury decontrol",
    "J-51 expiration NYC",
    "J-51 building rent stabilized",
    "J-51 vs 421-a",
    "J-51 lookup NYC",
  ],
  openGraph: {
    title: "Does J-51 make my NYC apartment rent-stabilized?",
    description:
      "Yes — for the duration of the J-51 benefit. Roberts v. Tishman Speyer ended the deregulation loophole in 2009.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Does a J-51 tax abatement make my NYC apartment rent-stabilized?"
      jurisdictionTag="NYC"
      badges={["J-51", "Roberts decision"]}
      reviewedAt="2026-05-03"
      shortAnswer="Yes. NY Real Property Tax Law § 489 (the J-51 program) places every unit in a building receiving J-51 tax benefits under rent stabilization for the full duration of the benefit. The 2009 Court of Appeals decision Roberts v. Tishman Speyer Properties closed the loophole some landlords had used to claim units could be deregulated even while collecting J-51 benefits — the court held that's not lawful, and tens of thousands of units were re-stabilized retroactively. If your building is currently receiving J-51 benefits, every unit in it is rent-stabilized."
      bottomLine="Living in a J-51 building? Your unit IS rent-stabilized today, and every other unit in the building is too. The RGB renewal cap (2.75% / 5.25% for the Oct 2025 – Sep 2026 cycle) governs your increase. Look up your building's J-51 status free on the NYC Department of Finance Property Tax Benefits page — if a J-51 abatement or exemption is listed and active, you're stabilized regardless of what the lease says."
      sections={[
        {
          heading: "What J-51 actually is",
          body: [
            "J-51 is a NYC tax incentive program (NY RPTL § 489 + NYC Administrative Code § 11-243) that gives building owners a tax abatement plus a tax exemption in exchange for performing major capital improvements — new boilers, plumbing, windows, elevators, gut rehab — on existing residential buildings. Unlike 421-a (new construction), J-51 targets renovation of older stock.",
            "The benefit period varies by improvement type: typically 14 years of abatement for moderate rehab, up to 34 years for substantial gut rehab in low-income areas. During the benefit period, the building is required to register with DHCR and every unit is rent-stabilized.",
          ],
        },
        {
          heading: "Roberts v. Tishman Speyer — what changed in 2009",
          body: [
            "Before 2009, several large landlords (Stuyvesant Town / Peter Cooper Village being the most famous) collected J-51 benefits while simultaneously deregulating units under high-rent vacancy decontrol — claiming the two programs ran independently. In Roberts v. Tishman Speyer (NY Court of Appeals, 2009) the court held this was unlawful: a building cannot collect J-51 benefits AND deregulate units, full stop.",
            "The decision applied retroactively. Tens of thousands of units across NYC that had been improperly deregulated were re-classified as rent-stabilized. Many tenants successfully recovered overcharges through DHCR and the courts in the years that followed.",
            "After HSTPA 2019 ended vacancy decontrol entirely, the Roberts issue is largely moot for new tenancies — but it still matters for old overcharge claims and for the status of buildings whose J-51 ran during the 1994–2019 deregulation window.",
          ],
        },
        {
          heading: "How to look up your building's J-51 status",
          body: [
            "Two free, authoritative tools:",
          ],
          bullets: [
            "NYC Department of Finance Property Tax Benefits — search by address; J-51 abatement and exemption start dates, terms, and expiration are listed.",
            "DHCR rent history — every J-51 building must register units with DHCR annually. If your unit's history shows J-51 codes, your stabilization is on the J-51 record.",
            "If DOF shows J-51 active but your lease doesn't include a Rent Stabilization Rider, the lease is non-compliant. Stabilization status is a matter of law — the landlord can't opt out by leaving the rider out of the lease.",
          ],
        },
        {
          heading: "What happens when J-51 expires",
          body: [
            "Three scenarios at expiration, depending on tenant move-in date and notice:",
          ],
          bullets: [
            "Tenant moved in BEFORE the J-51 benefit started, AND the unit was already rent-stabilized for some other reason (e.g., pre-1974 building with 6+ units): unit stays stabilized for life.",
            "Tenant moved in DURING the J-51 benefit period AND the building is post-1974 construction AND proper J-51-expiration notice was given at every lease and renewal: unit can become free-market when J-51 expires.",
            "Tenant moved in DURING the J-51 benefit period AND notice was NOT properly given: the unit stays stabilized for life. DHCR enforces the notice rule strictly — same standard as 421-a.",
          ],
        },
        {
          heading: "J-51 vs. 421-a vs. baseline rent stabilization",
          body: [
            "Three different bases for the same end result. Same RGB cap, same DHCR jurisdiction, same renewal-lease right. Differences:",
          ],
          bullets: [
            "Baseline (pre-1974, 6+ units, no decontrol event) — permanent stabilization, no expiration date.",
            "J-51 — stabilization tied to the abatement period. Expiration possible for post-1974 construction with proper notice.",
            "421-a — stabilization tied to the abatement period (10–35 years). Same expiration mechanics as J-51.",
            "If your building qualifies on multiple bases (e.g., pre-1974 building that ALSO took J-51 for a renovation), the strongest basis governs and you remain stabilized after the abatement expires.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "3-question test covers pre-1974, 421-a, and J-51 paths.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "Run the 2025–2026 renewal increase on your stabilized rent.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question: "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "421a-rent-stabilization-coverage-nyc",
          question: "Are 421-a apartments rent-stabilized in NYC?",
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
