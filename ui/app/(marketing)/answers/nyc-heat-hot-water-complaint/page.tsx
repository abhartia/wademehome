import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-heat-hot-water-complaint";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Heat-and-Hot-Water Rules + Complaints (2026 Guide)",
  description:
    "NYC Heat Season runs Oct 1 to May 31. Daytime heat must reach 68°F when outside is below 55°F. Hot water 120°F year-round. File via 311 — HPD inspectors respond and issue violations.",
  keywords: [
    "NYC heat season",
    "NYC heat 68 degrees rule",
    "NYC hot water 120 degrees",
    "NYC heat complaint 311",
    "NYC HPD heat violation",
    "NYC heat hot water law",
    "NYC heat October to May",
    "NYC tenant heat rights",
    "NYC apartment cold complaint",
    "no hot water NYC apartment",
  ],
  openGraph: {
    title: "What are NYC's heat-and-hot-water rules?",
    description:
      "Heat Season Oct 1–May 31. 68°F day / 62°F night. Hot water 120°F always. File via 311.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What are NYC's heat-and-hot-water rules and how do I file a complaint?"
      jurisdictionTag="NYC"
      badges={["Heat Season Oct–May", "311 / HPD"]}
      reviewedAt="2026-05-03"
      shortAnswer="NYC's Heat Season runs October 1 to May 31. During the season, the daytime indoor temperature (6 a.m. to 10 p.m.) must reach at least 68°F whenever the outdoor temperature is below 55°F. The nighttime indoor temperature (10 p.m. to 6 a.m.) must reach at least 62°F regardless of outside conditions. Hot water (120°F or higher at the tap) is required 24/7/365 — not seasonal. Complaints go through 311 (online, app, or phone); HPD inspectors respond, take readings, and issue violations against the landlord. Persistent failures can result in HPD-ordered emergency repairs at the landlord's expense and per-day civil penalties."
      bottomLine="If you're cold in your NYC apartment between October 1 and May 31, file a 311 heat complaint immediately — don't wait, don't escalate to your landlord first. Each day without heat creates a separate violation, and the 311 record is the documentary proof for any rent abatement, repair, or HP-action case. For hot water — file 311 any month of the year. Habitability failures matter: chronic heat violations can support a rent abatement of 10–30% via Housing Court HP-action, or an Article 7-A administrator if the building is severely neglected."
      sections={[
        {
          heading: "The temperature standards (NYC Admin Code § 27-2029)",
          body: [
            "Two thresholds, scaled by time of day, both during Heat Season (October 1 – May 31):",
          ],
          bullets: [
            "Daytime (6 a.m. – 10 p.m.): if outside temperature is below 55°F, indoor temperature must be at least 68°F.",
            "Nighttime (10 p.m. – 6 a.m.): indoor temperature must be at least 62°F regardless of outside temperature.",
            "Hot water (year-round, all hours): every faucet must deliver at least 120°F.",
            "Older standard you may have seen quoted (55°F night) was raised — current minimum is 62°F night.",
          ],
        },
        {
          heading: "How to file a 311 heat-or-hot-water complaint",
          body: [
            "Three channels, all create the same documentary record:",
          ],
          bullets: [
            "Web: nyc.gov/311 — search 'heat or hot water complaint.' Best for documentation; you get a complaint number.",
            "App: NYC311 mobile app — same form as web, geolocates the building.",
            "Phone: dial 311 — caller's identity is kept confidential from the landlord under NYC Admin Code § 27-2120.",
            "What to include: building address, apartment number, current indoor temperature reading (a $10 thermometer is plenty), how long the condition has lasted, whether you've tried to reach the landlord. Photos of a thermometer in the unit are persuasive.",
          ],
        },
        {
          heading: "What happens after you file",
          body: [
            "Standard sequence:",
          ],
          bullets: [
            "Complaint forwards to HPD (NYC Department of Housing Preservation and Development).",
            "HPD attempts to call the landlord first; if no response within ~12 hours (heat) or 24 hours (hot water), an HPD inspector visits.",
            "If the inspector confirms the violation, an Order to Correct is issued. The landlord has 24 hours to fix heat / 24 hours to restore hot water.",
            "If unfixed, HPD's Emergency Repair Program (ERP) can dispatch contractors at the landlord's expense — bill is added to the property tax record as a tax lien.",
            "Civil penalties: up to $250 per day for heat violations, up to $500 per day for repeat heat violations.",
          ],
        },
        {
          heading: "Tenant remedies if violations continue",
          body: [
            "Three escalation paths beyond 311:",
          ],
          bullets: [
            "HP-action (Housing Part action) — file in NYC Housing Court for a court order compelling repairs. Tenant can seek a rent abatement (10–30% typical for chronic heat issues) and recover court costs.",
            "Article 7-A administrator — if 1/3 of the building's tenants file together and conditions are severe (no heat / no water for an extended period), the court can appoint an administrator to manage the building and collect rent for repairs.",
            "Rent withholding / escrow — fact-specific and risky. Don't withhold rent without legal advice; in many cases, depositing rent into an escrow account preserves leverage without exposing the tenant to non-payment proceedings.",
            "All three paths benefit from a documented 311 complaint history. File early, file every day the violation persists.",
          ],
        },
        {
          heading: "Common landlord pushback (and why it doesn't work)",
          body: [
            "Things landlords say that aren't legal defenses:",
          ],
          bullets: [
            "'The boiler is being repaired.' Repair time doesn't suspend the temperature standard. The landlord must provide alternate heat (space heaters, hotel relocation) until repaired.",
            "'You're paying for heat — buy a space heater.' Heat is the landlord's responsibility in NYC residential rentals unless the lease explicitly transfers it AND a separate utility meter exists. Most leases do not.",
            "'It's only a few degrees off.' The thresholds are bright-line. 67°F daytime when outside is 50°F is a violation. 61°F nighttime is a violation.",
            "'The complaint will hurt your relationship with us.' Retaliation for a 311 complaint is illegal under RPL § 223-b. Landlords who retaliate after a documented complaint face additional civil penalties.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Stabilized tenants have stronger habitability remedies.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "nyc-bedbug-disclosure-law",
          question: "What does NYC's bedbug-disclosure law require?",
        },
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "nyc-eviction-notice-timeline",
          question: "How long does NYC eviction take?",
        },
        {
          slug: "break-lease-renovation-nyc",
          question: "Can my NYC landlord break my lease for renovations?",
        },
      ]}
      relatedReadingHref="/bad-landlord-nj-ny"
      relatedReadingLabel="NYC bad-landlord guide — when to escalate"
    />
  );
}
