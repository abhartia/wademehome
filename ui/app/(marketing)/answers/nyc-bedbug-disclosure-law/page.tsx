import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-bedbug-disclosure-law";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Bedbug Disclosure Law — What Landlords Must Tell You (2026)",
  description:
    "NYC landlords must give every prospective tenant a Bedbug Disclosure Form (HPD Form NYC-CHG-DOH-1A) listing the building's bedbug infestation history for the prior year. Required at every lease and renewal under NYC Admin Code § 27-2018.1.",
  keywords: [
    "NYC bedbug disclosure",
    "NYC bedbug law",
    "HPD bedbug form NYC",
    "NYC bedbug disclosure form",
    "NYC bedbug history landlord",
    "NYC bedbug treatment",
    "NYC bedbug eradication",
    "bedbug disclosure law NYC",
    "NYC tenant bedbug rights",
    "NYC apartment bedbug history",
  ],
  openGraph: {
    title: "What does NYC's bedbug-disclosure law require?",
    description:
      "Every NYC lease must include the building's bedbug history form. Required at every signing and renewal.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What does NYC's bedbug-disclosure law require?"
      jurisdictionTag="NYC"
      badges={["NYC Admin Code § 27-2018.1", "Required at every lease"]}
      reviewedAt="2026-05-03"
      shortAnswer="Under NYC Administrative Code § 27-2018.1 (and NY State Multiple Dwelling Law § 304-a), every NYC landlord of a Class A multiple dwelling must give every prospective and renewing tenant a Bedbug Disclosure Form (HPD's Notice of Bedbug Infestation History) at lease signing and at every renewal. The form discloses, for the unit and the building, whether there was any bedbug infestation in the prior year and whether eradication was performed. Failure to provide the form is a Class C violation (immediately hazardous) — the steepest tier in NYC's housing-violation system. Tenants who don't receive the form can demand it any time."
      bottomLine="If a NYC landlord didn't hand you a Bedbug Disclosure Form (a one-page HPD document) before you signed your lease, that is a Class C violation. You can request it at any time — by email is fine — and the landlord must provide it within a reasonable period. Past bedbug history in the building isn't a reason to refuse to lease (most NYC buildings have had at least one incident at some point), but undisclosed history is itself a tenant-protection violation worth raising in any future habitability dispute."
      sections={[
        {
          heading: "What the disclosure form actually contains",
          body: [
            "The form (HPD Notice of Bedbug Infestation History — also called Form NYC-CHG-DOH-1A) is a single page. It asks the landlord to certify, under penalty of perjury, the following for the prior year:",
          ],
          bullets: [
            "Whether the unit you're leasing had a bedbug infestation.",
            "Whether eradication efforts were performed and whether they were successful.",
            "Whether any other unit in the building had a bedbug infestation.",
            "Whether eradication efforts were performed building-wide and the outcomes.",
            "Date the form is filled out and the landlord/agent's signature.",
          ],
        },
        {
          heading: "When the form must be given",
          body: [
            "The statute requires delivery 'at the commencement of any tenancy.' HPD interprets this as:",
          ],
          bullets: [
            "Before or at the moment you sign a new lease.",
            "Before or at the moment you sign every renewal lease.",
            "Available on demand at any time during the tenancy if you ask the landlord for it.",
            "It does NOT have to be given to month-to-month tenants every month — but at any point a written renewal goes out, the form must accompany it.",
          ],
        },
        {
          heading: "What 'no infestation in the prior year' actually means",
          body: [
            "Many tenants assume the form is a guarantee of no bedbugs going forward. It is not. It's a statutory disclosure of the building's recent history, nothing more.",
            "What 'no infestation' on the form does NOT certify: that there will be no infestation during the tenancy, that the building is currently bedbug-free, that adjacent units or the rest of the floor are bedbug-free at the moment of disclosure (only the prior 1-year window is required). What it DOES certify: that, to the landlord's knowledge, there was no documented infestation in the listed unit or building during the prior year.",
            "If bedbugs appear after move-in and the form said 'no infestation,' the landlord is still responsible for eradication under NYC's housing maintenance code, regardless of who brought them in (the legal presumption favors the tenant absent affirmative evidence the tenant introduced them).",
          ],
        },
        {
          heading: "What to do if you didn't receive the form",
          body: [
            "Three escalating steps:",
          ],
          bullets: [
            "Email the landlord requesting the form. Keep the email — it's your documentation.",
            "If no response within 7–10 days, file a 311 complaint citing 'failure to provide bedbug disclosure form.' HPD will follow up with a Class C violation if the landlord still doesn't comply.",
            "If bedbugs subsequently appear and the landlord disputes responsibility, the missing or false disclosure form is a major piece of evidence in any rent-abatement, HP-action, or Housing Court proceeding. Save every email and 311 complaint number.",
          ],
        },
        {
          heading: "What happens if bedbugs appear during the tenancy",
          body: [
            "Bedbugs are a Class B violation (hazardous) on first occurrence; Class C if recurrent. The landlord is required to eradicate at the landlord's expense — no fee can be charged to the tenant. Standard professional eradication takes 2–3 treatments over 4–6 weeks.",
            "Tenant duties: report promptly, allow access for inspection and treatment, follow preparation instructions (laundry, vacuuming, bag-and-seal). Failure to cooperate can shift cost responsibility to the tenant; cooperation preserves the landlord-pays default.",
            "Rent abatement during eradication: typical award is 10–25% of rent for the affected period if the unit becomes uninhabitable (e.g., during heat-treatment or whole-room preparation). Higher if eradication drags on past 90 days or recurs.",
          ],
        },
      ]}
      relatedTools={[]}
      relatedQuestions={[
        {
          slug: "nyc-heat-hot-water-complaint",
          question:
            "What are NYC's heat-and-hot-water rules and how do I file a complaint?",
        },
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "break-lease-renovation-nyc",
          question: "Can my NYC landlord break my lease for renovations?",
        },
        {
          slug: "nyc-eviction-notice-timeline",
          question: "How long does NYC eviction take?",
        },
      ]}
      relatedReadingHref="/bad-landlord-nj-ny"
      relatedReadingLabel="NYC bad-landlord guide — when to escalate"
    />
  );
}
