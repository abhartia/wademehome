import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Bad Landlord in NJ or NY? How to Report, Fight Back & Avoid Next Time (2026)",
  description:
    "Step-by-step guide for tenants dealing with a bad landlord in New Jersey or New York. How to report HPD violations, use the NJ DCA hotline, get your security deposit back, and check a landlord before you sign your next lease.",
  keywords: [
    "bad landlord NJ",
    "bad landlord NY",
    "bad landlord NYC",
    "how to report landlord NJ",
    "how to report landlord NYC",
    "report slumlord NYC",
    "worst landlord NYC",
    "NJ tenant rights",
    "NYC tenant rights",
    "HPD violations NYC",
    "NJ DCA landlord complaint",
    "landlord won't return security deposit NJ",
    "landlord won't fix heat NYC",
    "how to check landlord before renting",
    "research landlord NYC",
    "NYC worst landlord watchlist",
    "NJ Anti-Eviction Act",
    "NYC Good Cause Eviction",
    "landlord retaliation NJ NY",
    "housing court NYC",
    "Special Civil Part NJ",
  ],
  openGraph: {
    title:
      "Bad Landlord in NJ or NY? How to Report, Fight Back & Avoid Next Time",
    description:
      "What to do when your landlord won't make repairs, return your deposit, or stops replying. Concrete next steps for tenants in New Jersey and New York.",
    url: `${baseUrl}/bad-landlord-nj-ny`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/bad-landlord-nj-ny` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Bad Landlord in NJ or NY? How to Report, Fight Back & Avoid Next Time (2026)",
    description:
      "A practical guide for tenants dealing with unresponsive, retaliatory, or negligent landlords in New Jersey and New York. Covers HPD, DCA, small claims, rent stabilization, and how to vet your next landlord before signing.",
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
    publisher: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
    author: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
    mainEntityOfPage: `${baseUrl}/bad-landlord-nj-ny`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I report a bad landlord in New Jersey?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For habitability problems in a building with three or more rental units, call the NJ Department of Community Affairs Bureau of Housing Inspection at (609) 633-6227 or the Multifamily Housing Complaint Line at 1-800-MULTI-70 (1-800-685-8470). For monetary disputes up to $5,000 (security deposit, overcharges, repair reimbursement), file in the Small Claims Section of the Special Civil Part in the county where the property is located. For discrimination, file with HUD's Office of Fair Housing at 1-800-669-9777. Always send repair requests by certified mail, return receipt requested — that creates the legal record New Jersey courts require.",
        },
      },
      {
        "@type": "Question",
        name: "How do I report a bad landlord in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Call 311 or file online via the NYC Housing Preservation and Development (HPD) portal. HPD will send an inspector, and confirmed issues become housing code violations on the building's public record. Class C (immediately hazardous — no heat, no hot water, lead paint, gas leak) must be corrected within 24 hours; Class B within 30 days; Class A within 90 days. You can also look up the building on HPD Online to see existing violations and file a complaint yourself. For harassment, contact the Mayor's Office to Protect Tenants or the Public Advocate's office, which maintains the annual NYC Worst Landlord Watchlist.",
        },
      },
      {
        "@type": "Question",
        name: "My landlord won't return my security deposit in NJ. What can I do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New Jersey landlords must return the security deposit within 30 days of the end of the tenancy, along with an itemized list of any deductions and any interest earned. If they miss the deadline or the deductions are bogus, you can sue for double the amount wrongly withheld plus court costs and attorney's fees under the New Jersey Security Deposit Act. The maximum security deposit is capped at 1.5 times monthly rent. File in the Small Claims Section of the Special Civil Part; the filing fee is under $50 and you do not need a lawyer. You have up to six years to bring the claim.",
        },
      },
      {
        "@type": "Question",
        name: "My landlord won't return my security deposit in NYC. What can I do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New York landlords must return the deposit within 14 days of the end of the tenancy with an itemized statement of deductions. If they fail to provide the itemization within 14 days, they forfeit the right to withhold any part of the deposit. You can sue in Small Claims Court (part of Civil Court in NYC) for up to $10,000, and if the court finds the withholding was willful, it can award punitive damages up to twice the deposit. Send a demand letter by certified mail first — many landlords pay once they see you're serious.",
        },
      },
      {
        "@type": "Question",
        name: "Can my landlord evict me for complaining about repairs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No — both states explicitly prohibit retaliatory eviction. In New Jersey, under the Anti-Eviction Act (N.J.S.A. 2A:18-61.1), a landlord cannot evict a tenant for reporting code violations, joining a tenant organization, or filing a habitability complaint. In New York, the Real Property Law and the Housing Stability and Tenant Protection Act of 2019 create a presumption of retaliation if the landlord tries to evict, raise rent, or refuse to renew within one year of a tenant's good-faith complaint. If retaliation is suspected, document the timeline — complaint date, landlord's action date — because that sequence is what establishes the presumption.",
        },
      },
      {
        "@type": "Question",
        name: "How can I check if a landlord is bad BEFORE I sign a lease?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For NYC, look up the building on HPD Online (search by address) to see open violations, complaint history, and registered owner. Check the NYC Public Advocate's Worst Landlord Watchlist and JustFix's 'Who Owns What' tool to unmask LLC-held buildings. Search 311 service requests for the address to see how responsive the landlord has been. For New Jersey, search the DCA multi-family inspection records and your county court's public docket for landlord-tenant cases filed against the owner. A landlord with repeated habitability cases, open violations, or any watchlist appearance is a predictable future problem — move on to the next listing.",
        },
      },
      {
        "@type": "Question",
        name: "My landlord hasn't provided heat. What are my rights?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In NYC during heat season (October 1 to May 31), landlords must maintain indoor temperatures of at least 68°F when outside temp is below 55°F during the day, and at least 62°F overnight regardless of outdoor temp. Hot water must be at least 120°F year-round. Call 311 immediately — no-heat complaints are HPD Class C (immediately hazardous) violations with 24-hour correction deadlines and automatic daily fines. In New Jersey, the state housing code requires adequate heat October 1 through May 1, and the absence of heat is a habitability violation that can justify rent withholding, repair-and-deduct, or constructive eviction — but put everything in writing first via certified mail.",
        },
      },
      {
        "@type": "Question",
        name: "What is the NYC Worst Landlord Watchlist?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Worst Landlord Watchlist is published annually by the NYC Public Advocate's office, ranking the 100 worst landlords in the city by their average number of open housing code violations per month over a rolling 12-month window. The 2026 list (covering December 2024 through November 2025) saw the #1 and #2 landlords amass the most violations in list history, both tied to the same company. The Bronx dominates the list, particularly Highbridge and Mott Haven. If your current or prospective landlord's name or LLC appears on the watchlist, that is public, documented evidence of systemic neglect — treat it as a strong signal to move out or skip the listing.",
        },
      },
      {
        "@type": "Question",
        name: "Does New Jersey have 'Good Cause' or 'Just Cause' eviction protection?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — New Jersey's Anti-Eviction Act (N.J.S.A. 2A:18-61.1) is one of the strongest tenant protection laws in the country. Every residential lease, written or oral, must be renewed unless the landlord can prove one of the specific statutory grounds for eviction: nonpayment of rent, habitual late payment, material lease violations, property damage, disorderly conduct, or a few other defined reasons. The Act does NOT apply to owner-occupied buildings with three or fewer units, so tenants in two- or three-family homes where the owner lives on site have fewer protections. New York adopted a narrower 'Good Cause Eviction' law in 2024 that applies to many market-rate apartments in NYC.",
        },
      },
      {
        "@type": "Question",
        name: "How much can my landlord raise the rent in NYC in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For rent-stabilized apartments with leases starting between October 2025 and September 2026, the NYC Rent Guidelines Board set the allowable increase at 3% for a one-year renewal and 4.5% for a two-year renewal. For market-rate apartments covered by the 2024 Good Cause Eviction law, rent increases above the lower of 10% or 5% plus CPI are presumed unreasonable and can be challenged in court. If you're not sure whether your unit is rent-stabilized, request a rent history from the NYS Division of Homes and Community Renewal (HCR) — it's free and often reveals illegal prior increases that can be recovered.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bad Landlord NJ & NY Guide",
        item: `${baseUrl}/bad-landlord-nj-ny`,
      },
    ],
  },
];

export default function BadLandlordNjNyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Tenant Rights</Badge>
              <Badge variant="secondary">NJ &amp; NY</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Bad Landlord in NJ or NY? How to Report, Fight Back, and Avoid
              the Next One
            </h1>
            <p className="text-sm text-muted-foreground">
              If your landlord stops answering texts about the busted radiator,
              keeps your security deposit &quot;for cleaning&quot;, or mails
              you a 20% rent hike without warning, you are not alone and you
              are not without recourse. In 2024 alone, NYC&apos;s Department
              of Housing Preservation and Development issued more than
              250,000 housing code violations. The NYC Public Advocate&apos;s
              2026 Worst Landlord Watchlist named landlords whose portfolios
              carry record-high violation counts. The New Jersey Department
              of Community Affairs reports rising landlord-tenant complaints
              year over year. About 36.65% of New Jerseyans and roughly
              two-thirds of New York City residents are renters &mdash; which
              means bad-landlord experiences are a majority problem, not a
              niche one. This guide lays out exactly what to do now, what
              leverage you have by state, and &mdash; most importantly &mdash;
              how to vet the next landlord before you sign another lease.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Legal information, not legal advice.
              For case-specific questions, consult a tenant attorney or your
              local legal aid office.
            </p>
          </header>

          {/* TL;DR */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Answer</CardTitle>
              <CardDescription>
                If you only read one card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Report habitability issues immediately.
                </span>{" "}
                NYC: call 311 or file with HPD online. NJ: call the DCA
                Multifamily Housing Complaint Line at 1-800-MULTI-70
                (1-800-685-8470). Inspections are free and create a public
                record that protects you.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Document everything.
                </span>{" "}
                Dated photos, certified-mail repair requests, text and email
                receipts. Without records you have a story; with records you
                have a case.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Retaliation is illegal.
                </span>{" "}
                Both NJ (Anti-Eviction Act) and NY (HSTPA 2019) bar landlords
                from retaliating within a year of a good-faith complaint.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Security deposits:
                </span>{" "}
                NJ &mdash; 30 days to return, cap is 1.5x rent, double damages
                if wrongly withheld. NYC &mdash; 14 days, 1-month cap,
                itemization or forfeit.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Before you sign next time:
                </span>{" "}
                look up the building on HPD Online (NYC), search the
                Watchlist, and check NJ court records for the landlord&apos;s
                name. Five minutes of research saves twelve months of misery.
              </p>
            </CardContent>
          </Card>

          {/* Red flags */}
          <Card>
            <CardHeader>
              <CardTitle>10 Signs You Have a Bad Landlord</CardTitle>
              <CardDescription>
                Any one of these in isolation is an annoyance. Three or more
                is a pattern worth acting on.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  1. Repairs take weeks or never happen.
                </span>{" "}
                Leaks, broken appliances, pest problems, no heat &mdash; a
                reasonable landlord fixes urgent issues within 24 to 72 hours.
                A bad one ignores them or promises &quot;next week&quot; for
                months.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  2. Communication goes dark when there&apos;s a problem.
                </span>{" "}
                Replies within an hour when you&apos;re late on rent; two
                weeks of silence when the ceiling is dripping.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  3. Entry without notice.
                </span>{" "}
                Both states require reasonable advance notice (typically 24
                hours) except in a genuine emergency. Unannounced entries for
                &quot;inspections&quot; or showings are an illegal pattern,
                not a quirk.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  4. Cash-only rent with no receipts.
                </span>{" "}
                A legitimate landlord issues receipts and reports rental
                income. Cash-only requests without paperwork are often tied
                to unregistered units, unreported income, or landlords who
                plan to dispute your payment history later.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  5. Security deposit games.
                </span>{" "}
                No written receipt, no bank account disclosure (NJ requires
                this), vague deductions for &quot;cleaning&quot; or
                &quot;wear and tear&quot; (neither is deductible).
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  6. Illegal fees.
                </span>{" "}
                Application fees over $20 in NYC (capped by state law),
                broker fees charged to tenants when the broker was hired by
                the landlord (banned by the FARE Act in June 2025), late
                fees above 5% of monthly rent in NY.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  7. Rent increase without the right notice or cap.
                </span>{" "}
                NYC rent-stabilized renewals can only increase by the Rent
                Guidelines Board amount (3% / 4.5% for leases beginning
                October 2025 &ndash; September 2026). Market-rate tenants in
                NJ municipalities with rent control (e.g., Jersey City,
                Newark, Hoboken) also have caps. Unilateral hikes outside
                these are often illegal.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  8. Threats to evict over complaints.
                </span>{" "}
                &quot;If you keep calling 311, I&apos;m not renewing your
                lease&quot; is a textbook retaliation threat and illegal in
                both states.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  9. The building appears on public violation lists.
                </span>{" "}
                If your address shows up on HPD Online with dozens of open
                violations, or your landlord&apos;s LLC shows up on the
                Worst Landlord Watchlist, that&apos;s an independent
                third-party judgment.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  10. Buildings owned through shell LLCs with no public
                  manager.
                </span>{" "}
                LLC ownership is legal, but refusal to disclose a managing
                agent (required by NYC HPD registration) is a violation by
                itself and a strong predictor of accountability problems.
              </p>
            </CardContent>
          </Card>

          {/* State Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>NJ vs NYC: Tenant Protections at a Glance</CardTitle>
              <CardDescription>
                The two markets have very different legal regimes. Know which
                one you&apos;re in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>New Jersey</TableHead>
                      <TableHead>New York City</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Just-cause eviction
                      </TableCell>
                      <TableCell>
                        Anti-Eviction Act &mdash; must prove statutory cause
                        for every lease. Exception: owner-occupied 1-3 unit
                        buildings.
                      </TableCell>
                      <TableCell>
                        Good Cause Eviction (2024) for many market-rate
                        units; full protection for rent-stabilized.
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Security deposit cap
                      </TableCell>
                      <TableCell>1.5x monthly rent</TableCell>
                      <TableCell>1 month&apos;s rent (statewide)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Deposit return deadline
                      </TableCell>
                      <TableCell>30 days, itemized</TableCell>
                      <TableCell>
                        14 days, itemized &mdash; or forfeit right to deduct
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Penalty for wrongful withholding
                      </TableCell>
                      <TableCell>Double the amount wrongly withheld</TableCell>
                      <TableCell>
                        Up to 2x deposit if willful (punitive)
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Rent cap / stabilization
                      </TableCell>
                      <TableCell>
                        Local rent control in Jersey City, Newark, Hoboken,
                        Elizabeth, Passaic, and others
                      </TableCell>
                      <TableCell>
                        Rent Stabilization Board sets annual % for ~1M units
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Primary complaint hotline
                      </TableCell>
                      <TableCell>
                        1-800-MULTI-70 (DCA) &middot; (609) 633-6227
                      </TableCell>
                      <TableCell>311 &middot; HPD Online</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Small claims limit
                      </TableCell>
                      <TableCell>
                        $5,000 (Special Civil Part &mdash; Small Claims)
                      </TableCell>
                      <TableCell>$10,000 (NYC Small Claims Court)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Retaliation protection window
                      </TableCell>
                      <TableCell>
                        Presumed retaliation within reasonable period of
                        complaint
                      </TableCell>
                      <TableCell>1 year from tenant&apos;s complaint</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Heat season minimums
                      </TableCell>
                      <TableCell>
                        68&deg;F day / 65&deg;F night, Oct 1 &ndash; May 1
                      </TableCell>
                      <TableCell>
                        68&deg;F day (when outdoor &lt; 55&deg;F) / 62&deg;F
                        night, Oct 1 &ndash; May 31
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Public landlord lookup
                      </TableCell>
                      <TableCell>
                        County court docket, DCA inspection records
                      </TableCell>
                      <TableCell>
                        HPD Online, Worst Landlord Watchlist, Who Owns What
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* NJ Section */}
          <h2 className="pt-2 text-2xl font-semibold tracking-tight">
            New Jersey: What to Do About a Bad Landlord
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>Step 1: Put the Request in Writing</CardTitle>
              <CardDescription>
                Certified mail is the lever that unlocks every NJ remedy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                New Jersey habitability remedies (rent withholding,
                repair-and-deduct, constructive eviction) all depend on
                proving the landlord had written notice and failed to act in
                an &quot;adequate&quot; time. The accepted form is a letter
                sent via <strong>certified mail, return receipt requested</strong>,
                describing the defect and asking for repair by a specific
                date (typically 14 to 30 days for non-emergency; 24 to 72
                hours for heat, hot water, or safety hazards).
              </p>
              <p>
                Keep the green return receipt and a copy of the letter
                forever. Texts and emails help, but the certified-mail
                receipt is what courts rely on.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Step 2: Call the NJ DCA Bureau of Housing Inspection
              </CardTitle>
              <CardDescription>
                For buildings with three or more rental units
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The New Jersey Department of Community Affairs (DCA) Bureau
                of Housing Inspection enforces the state Hotel and Multiple
                Dwelling Law. For any rental building with three or more
                units, they will send an inspector for free and issue formal
                violation notices the landlord must correct.
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  Bureau of Housing Inspection:{" "}
                  <strong>(609) 633-6227</strong> or{" "}
                  <strong>BHIInspections@dca.nj.gov</strong>
                </li>
                <li>
                  Multifamily Housing Complaint Line:{" "}
                  <strong>1-800-MULTI-70 (1-800-685-8470)</strong>
                </li>
                <li>
                  Fair housing / discrimination: HUD Office of Fair Housing
                  &mdash; <strong>1-800-669-9777</strong>
                </li>
              </ul>
              <p>
                For 1&ndash;2 unit buildings, the enforcement agency is
                usually your municipal code enforcement office (look up the
                property maintenance or building department for your town).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Step 3: Use the Anti-Eviction Act as Your Shield
              </CardTitle>
              <CardDescription>
                Why NJ is one of the strongest tenant-protection states in
                the country
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The NJ Anti-Eviction Act (N.J.S.A. 2A:18-61.1) requires every
                residential lease to renew automatically unless the landlord
                can prove one of a short list of statutory grounds: unpaid
                rent, habitual late payment, material lease violation,
                property damage, disorderly conduct, conversion, or sale of
                an owner-occupied unit. &quot;I just don&apos;t like
                you&quot; is not on the list.
              </p>
              <p>
                The Act explicitly protects tenants from retaliatory eviction
                for reporting code violations, organizing with neighbors, or
                filing a habitability complaint. If your landlord files a
                non-renewal or eviction shortly after you complain,
                retaliation is an affirmative defense you can raise in court.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Important exception:
                </span>{" "}
                the Act does not apply to owner-occupied buildings with
                three or fewer units. Tenants in 2- and 3-family homes where
                the owner lives on site have much weaker protections. If
                you&apos;re renting under that structure, read your lease
                term carefully before complaining &mdash; the landlord
                doesn&apos;t need cause to decline renewal.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Step 4: Security Deposit &mdash; Sue for Double Damages
              </CardTitle>
              <CardDescription>
                The single most reliable NJ tenant remedy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The NJ Security Deposit Act (N.J.S.A. 46:8-19 to 46:8-26)
                gives tenants unusually strong remedies:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Cap:</strong> 1.5x monthly rent, held in a separate
                  interest-bearing account.
                </li>
                <li>
                  <strong>Disclosure:</strong> the landlord must tell you in
                  writing where the deposit is held within 30 days of
                  receiving it, and every year thereafter.
                </li>
                <li>
                  <strong>Return:</strong> within 30 days of move-out, with
                  an itemized statement of any deductions and interest
                  earned.
                </li>
                <li>
                  <strong>Penalty:</strong> if the landlord wrongfully
                  withholds any portion, you can recover double the amount
                  wrongly withheld, plus court costs and reasonable
                  attorney&apos;s fees.
                </li>
              </ul>
              <p>
                File in the Special Civil Part, Small Claims Section of your
                county for amounts up to $5,000. Filing fees are under $50,
                no lawyer required, and statute of limitations is six years.
                In practice, most landlords settle once you file &mdash; the
                double-damages exposure makes litigation a bad bet for them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Step 5: Rent Withholding and Repair-and-Deduct
              </CardTitle>
              <CardDescription>
                Powerful but procedurally precise &mdash; do not freestyle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                New Jersey recognizes two remedies for habitability failures
                that most tenants misuse and end up losing:
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Rent withholding (Marini v. Ireland, 1970).
                </span>{" "}
                If the landlord fails to correct a substantial defect after
                written notice, you can deposit rent into escrow (not pocket
                it, not stop paying) and defend against any eviction filing
                with the habitability breach. Courts expect the money to
                exist &mdash; set up a dedicated escrow account and keep
                statements.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Repair-and-deduct.
                </span>{" "}
                For necessary emergency repairs after written notice and
                reasonable time, you can pay a licensed contractor and
                deduct the cost from rent, with receipts and documentation.
                Limited to reasonable cost; aggressive use invites disputes.
              </p>
              <p>
                Both are serious remedies. If the stakes are high, call
                Legal Services of New Jersey (1-888-LSNJ-LAW /
                1-888-576-5529) for free representation before you act.
              </p>
            </CardContent>
          </Card>

          {/* NY Section */}
          <h2 className="pt-2 text-2xl font-semibold tracking-tight">
            New York City: What to Do About a Bad Landlord
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>Step 1: Call 311 or File with HPD Online</CardTitle>
              <CardDescription>
                The single most important action for NYC tenants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                NYC&apos;s Department of Housing Preservation and Development
                (HPD) is the enforcement arm for the Housing Maintenance
                Code. A 311 call or online HPD complaint dispatches an
                inspector to your unit (usually within 5 business days, same
                day for Class C emergencies like no heat or gas leaks).
                Confirmed defects become public violations tied to the
                building on HPD Online.
              </p>
              <p>
                Violations are classified by severity:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Class A (non-hazardous):</strong> 90 days to
                  correct. Peeling paint in non-child units, minor cosmetic.
                </li>
                <li>
                  <strong>Class B (hazardous):</strong> 30 days. Inadequate
                  lighting, missing smoke detectors, pest infestation.
                </li>
                <li>
                  <strong>Class C (immediately hazardous):</strong> 24 hours.
                  No heat, no hot water, lead paint in child unit, gas leak,
                  mold in child-occupied unit, window guards missing.
                </li>
              </ul>
              <p>
                HPD issued more than 250,000 violations in 2024 alone, and
                over 10.5 million since recordkeeping began. The system is
                crowded, but it works &mdash; and the paper trail is
                invaluable if you later go to housing court.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Step 2: Understand Rent Stabilization (It&apos;s Likely You)
              </CardTitle>
              <CardDescription>
                ~1 million NYC apartments are stabilized, and many tenants
                don&apos;t know they are in one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Rent-stabilized apartments are subject to annual rent
                increase caps set by the NYC Rent Guidelines Board. For
                leases starting between October 1, 2025 and September 30,
                2026, the allowable increase is{" "}
                <strong>3% for a one-year renewal</strong> and{" "}
                <strong>4.5% for a two-year renewal</strong>.
              </p>
              <p>
                Rent stabilization applies broadly:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  Buildings with 6+ units built before 1974
                </li>
                <li>
                  Buildings that received tax abatements (421-a, J-51)
                </li>
                <li>
                  Units that were previously stabilized and never properly
                  deregulated (a huge loophole surface post-HSTPA 2019)
                </li>
              </ul>
              <p>
                <span className="font-semibold text-foreground">
                  Free rent history:
                </span>{" "}
                request one from the NYS Division of Homes and Community
                Renewal (HCR) &mdash; it&apos;s free, takes 30 seconds, and
                shows every registered rent and tenant for decades. Illegal
                prior increases are recoverable for up to 6 years plus
                treble damages if willful.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Step 3: Good Cause Eviction (2024)
              </CardTitle>
              <CardDescription>
                Extends protection to many market-rate NYC tenants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                New York&apos;s Good Cause Eviction law, passed in 2024,
                extends just-cause-style protection to many market-rate
                apartments that aren&apos;t rent-stabilized. Under the law,
                landlords must demonstrate &quot;good cause&quot; to evict
                or refuse to renew a covered tenant, and can only raise rent
                up to <strong>the lower of 10% or 5% plus local CPI</strong>;
                anything above that is presumed unreasonable and can be
                challenged.
              </p>
              <p>
                Coverage carve-outs include: small landlords (owners of 10
                or fewer units), units with rents above a high-rent
                threshold, new construction built after 2009 (for 30 years),
                and owner-occupied buildings with fewer than 10 units. If
                your lease-renewal proposal is out of line, don&apos;t just
                sign &mdash; check coverage and push back.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Step 4: Housing Court &mdash; HP Action
              </CardTitle>
              <CardDescription>
                When HPD violations aren&apos;t being corrected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                If your landlord ignores HPD violations, you can file a
                Housing Part (HP) Action in Housing Court to force repairs.
                It&apos;s designed to be tenant-accessible: filing fee under
                $50, forms provided by the court, and no lawyer required
                (though legal aid is often available free).
              </p>
              <p>
                The judge can order repairs by a deadline, impose civil
                penalties on the landlord, and even transfer the building
                to a court-appointed administrator (7A proceeding) in
                extreme cases. Retaliation for filing an HP Action is
                illegal and triggers additional tenant protections.
              </p>
              <p>
                For free help, contact:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Legal Aid Society</strong> &mdash; (212) 577-3300
                </li>
                <li>
                  <strong>Housing Court Answers</strong> &mdash;
                  (212) 962-4795
                </li>
                <li>
                  <strong>NYC Right to Counsel</strong> &mdash; free lawyer
                  in eviction cases for tenants at or below 200% of federal
                  poverty level
                </li>
                <li>
                  <strong>JustFix</strong> &mdash; free online tools for
                  letters, HP actions, and rent history requests
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Step 5: Report Harassment to the Public Advocate
              </CardTitle>
              <CardDescription>
                How landlords end up on the Worst Landlord Watchlist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The NYC Public Advocate&apos;s office publishes the annual
                Worst Landlord Watchlist, ranking the 100 worst landlords in
                the city by average open housing code violations per month
                over a rolling 12-month window. The 2026 list (covering Dec
                2024 &ndash; Nov 2025) features the highest violation counts
                in list history for the top two spots, both tied to the same
                operating company. The Bronx, particularly Highbridge and
                Mott Haven, dominates the rankings.
              </p>
              <p>
                If you&apos;re being harassed, the Public Advocate&apos;s
                office and the Mayor&apos;s Office to Protect Tenants
                (<strong>(212) 788-7654</strong>) investigate tenant
                harassment and can refer for enforcement. Patterns of
                harassment include: repeatedly filing unjustified eviction
                cases, shutting off services, construction-as-harassment,
                buyout pressure, and refusing to accept rent.
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Common scenarios */}
          <h2 className="pt-2 text-2xl font-semibold tracking-tight">
            Common Scenarios: Exactly What to Do
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>&quot;My landlord won&apos;t fix the heat&quot;</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">NYC:</span>{" "}
                call 311 tonight. No-heat during heat season (Oct 1 &ndash;
                May 31) is a Class C (immediately hazardous) violation. HPD
                can inspect same-day, and civil penalties run $250&ndash;$500
                per day per apartment. On the coldest days of 2025-26,
                no-heat 311 calls broke records &mdash; you are far from
                alone.
              </p>
              <p>
                <span className="font-semibold text-foreground">NJ:</span>{" "}
                send a certified-mail letter demanding repair within 24 to
                72 hours. Call 1-800-MULTI-70 if 3+ units, or your
                municipal code enforcement for smaller buildings. Document
                indoor temperatures with a photo of a thermometer plus time
                stamp. If the issue persists, you have grounds for rent
                withholding (escrow) or constructive eviction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                &quot;My landlord is keeping my security deposit&quot;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">NJ:</span>{" "}
                deadline is 30 days from move-out. If missed or the
                deductions are dubious, send a certified-mail demand letter
                citing N.J.S.A. 46:8-21.1 and giving 10 days to pay in full.
                Then file in Special Civil Part Small Claims &mdash;
                &lt;$50 fee, no lawyer required, double damages available.
                Normal cleaning and wear-and-tear are NOT deductible under
                NJ law; bring photos from move-in and move-out.
              </p>
              <p>
                <span className="font-semibold text-foreground">NYC:</span>{" "}
                deadline is 14 days, itemized. If the landlord misses the
                window, they forfeit the right to deduct at all. Send the
                demand letter citing GOL &sect; 7-108, then file in Small
                Claims (up to $10,000). Punitive damages up to 2x for
                willful withholding.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                &quot;My landlord wants to raise the rent a lot&quot;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">NYC:</span>{" "}
                request a rent history from HCR. If it&apos;s stabilized,
                the 2025-26 caps are 3% / 4.5%. If it&apos;s market-rate,
                check Good Cause coverage &mdash; increases above 10% or 5%
                + CPI (whichever is lower) are presumed unreasonable. Local
                rent control in Jersey City, Newark, Hoboken, and other NJ
                cities applies similar caps. Don&apos;t just sign the
                renewal &mdash; negotiate, and if stonewalled, see our{" "}
                <Link
                  href="/blog/negotiating-rent-and-lease-terms"
                  className="text-primary underline underline-offset-2"
                >
                  rent negotiation guide
                </Link>
                .
              </p>
              <p>
                <span className="font-semibold text-foreground">NJ:</span>{" "}
                check if your municipality has rent control
                (jerseycity.gov, newarknj.gov, hobokennj.gov all publish
                annual allowable increases). Outside rent-controlled
                municipalities, there&apos;s no statewide cap &mdash; but
                the Anti-Eviction Act still requires that an unreasonable
                rent increase used to force a tenant out be proven
                non-retaliatory.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                &quot;My landlord entered without permission&quot;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Both states require reasonable notice (typically 24 hours)
                for non-emergency entry. Repeated unannounced entry can
                constitute harassment and, in severe cases, constructive
                eviction &mdash; giving you the right to terminate the
                lease without penalty. Document each instance in writing,
                send a cease-and-desist by certified mail, and file a
                complaint with HPD (NYC) or DCA (NJ) if it continues.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                &quot;My landlord is threatening to evict me because I
                complained&quot;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Retaliation is illegal in both states. Write down the exact
                dates of your complaints (to landlord, to HPD, to DCA, to
                311) and any subsequent landlord action (notice to vacate,
                rent hike, refusal to renew). The sequence itself is the
                evidence.
              </p>
              <p>
                <span className="font-semibold text-foreground">NJ:</span>{" "}
                retaliation is a full defense to eviction under the
                Anti-Eviction Act. Contact Legal Services of NJ
                (1-888-LSNJ-LAW).
              </p>
              <p>
                <span className="font-semibold text-foreground">NY:</span>{" "}
                RPL &sect; 223-b creates a presumption of retaliation if
                landlord action follows within 1 year of a good-faith
                complaint. Call Legal Aid or Housing Court Answers. If
                you&apos;re income-qualified, NYC&apos;s Right to Counsel
                gets you a free attorney in any eviction case.
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* How to check BEFORE signing - conversion section */}
          <h2 className="pt-2 text-2xl font-semibold tracking-tight">
            How to Vet a Landlord Before You Sign
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>The 10-Minute Pre-Lease Background Check</CardTitle>
              <CardDescription>
                The single highest-ROI activity in apartment hunting.
                Landlords screen you; you should screen them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Most bad-landlord stories start with a tenant who skipped a
                10-minute check. The information is public, free, and
                overwhelmingly predictive &mdash; landlords who had
                violation problems last year will almost certainly have
                them next year.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  For NYC listings:
                </span>
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>HPD Online</strong> (hpdonline.nyc.gov) &mdash;
                  search the address. Look at: open violations (anything
                  over 20 in a small building is a red flag), complaint
                  history, and registered owner / managing agent.
                </li>
                <li>
                  <strong>Who Owns What</strong> (whoownswhat.justfix.org)
                  &mdash; unmasks LLC-held portfolios. If the &quot;cute
                  indie landlord&quot; actually owns 80 buildings with 3,000
                  violations, you want to know.
                </li>
                <li>
                  <strong>NYC Worst Landlord Watchlist</strong>
                  (landlordwatchlist.com) &mdash; if the name or LLC
                  appears, treat it as a hard pass.
                </li>
                <li>
                  <strong>311 Service Requests</strong> &mdash; search the
                  address on NYC Open Data. Volume and pattern of
                  complaints tell you about the building culture.
                </li>
                <li>
                  <strong>DOB violations and ECB</strong>
                  (a810-dobnow.nyc.gov) &mdash; construction and safety
                  issues.
                </li>
              </ul>
              <p>
                <span className="font-semibold text-foreground">
                  For NJ listings:
                </span>
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>NJ Courts Public Access</strong>
                  (njcourts.gov) &mdash; search the landlord&apos;s name in
                  the Special Civil Part. Prior landlord-tenant cases filed
                  against the owner are the clearest signal.
                </li>
                <li>
                  <strong>DCA inspection records</strong> &mdash; request
                  the building&apos;s most recent multi-family inspection
                  via OPRA (Open Public Records Act). Citations are public.
                </li>
                <li>
                  <strong>Municipal code enforcement</strong> &mdash; most
                  towns publish property-maintenance citations. Check
                  jerseycity.gov, hobokennj.gov, newarknj.gov, etc.
                </li>
                <li>
                  <strong>Google Maps + Yelp + Reddit</strong> &mdash; for
                  mid-size landlords with office presence, current and
                  former tenants often review in detail. Search
                  &quot;[building name] reviews&quot; and
                  &quot;[landlord name] Reddit&quot;.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What to Ask the Landlord Before You Sign</CardTitle>
              <CardDescription>
                The answers (and the non-answers) tell you a lot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  &quot;Who is the managing agent, and what&apos;s their
                  direct phone number?&quot; &mdash; a professional
                  operation has this ready; a bad one fumbles.
                </li>
                <li>
                  &quot;What&apos;s the typical response time for repair
                  requests?&quot; &mdash; vague answers are red flags.
                </li>
                <li>
                  &quot;Is this unit rent-stabilized? Can I see the rent
                  history?&quot; (NYC) &mdash; legitimate landlords have
                  nothing to hide; shady ones get defensive.
                </li>
                <li>
                  &quot;Where will my security deposit be held?&quot; (NJ
                  requires a bank disclosure in writing.)
                </li>
                <li>
                  &quot;Can I talk to a current tenant in the
                  building?&quot; &mdash; this single question eliminates
                  the majority of bad landlords, who refuse.
                </li>
                <li>
                  &quot;Is there an arbitration clause in the lease?&quot;
                  &mdash; read it carefully; arbitration clauses in
                  residential leases may be unenforceable in NY and are
                  disfavored in NJ, but a landlord pushing a broad one is
                  signaling how disputes will go.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>
                The Tenant Paper Trail That Wins Cases
              </CardTitle>
              <CardDescription>
                What to collect from day one, not &quot;when things go
                wrong&quot;
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Move-in video walk-through</strong>, date-stamped
                  on your phone, showing every room, appliance, and visible
                  defect. Email it to yourself the same day.
                </li>
                <li>
                  <strong>Signed lease</strong> and all riders, addenda,
                  rules, and the state-required disclosures (lead paint,
                  bedbug history in NYC, flood zone in NJ).
                </li>
                <li>
                  <strong>Rent receipts</strong> for every payment, or bank
                  statements showing direct payment.
                </li>
                <li>
                  <strong>Security deposit</strong> bank disclosure (NJ) and
                  receipt.
                </li>
                <li>
                  <strong>Every repair request</strong> in a dedicated email
                  thread or text thread, with dates, photos, and the
                  landlord&apos;s reply.
                </li>
                <li>
                  <strong>Certified-mail receipts</strong> for formal
                  complaints.
                </li>
                <li>
                  <strong>311 / HPD / DCA complaint numbers</strong> with
                  dates.
                </li>
                <li>
                  <strong>Move-out video</strong> in the same format as the
                  move-in walk-through.
                </li>
              </ul>
              <p>
                Keep everything in a single folder (Google Drive, Dropbox).
                If you never use it, great. If you ever need it, it will
                settle a case that would otherwise be your word against a
                landlord with a lawyer.
              </p>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Do I need a lawyer to sue in small claims court?
                </span>{" "}
                No &mdash; both NJ Special Civil Part Small Claims and NYC
                Small Claims are designed for self-represented litigants.
                Fees are under $50. Bring documentation; judges rely on
                paper.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Will filing a complaint get me evicted?
                </span>{" "}
                No, retaliation is illegal in both states. A retaliatory
                action within a year of your good-faith complaint creates a
                presumption against the landlord. Document the sequence.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Can I break my lease because of bad conditions?
                </span>{" "}
                Potentially yes &mdash; under the doctrine of constructive
                eviction, if the unit becomes uninhabitable and the
                landlord fails to correct after written notice, you may
                terminate. This is risky if done wrong; consult legal aid
                first.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  What if my landlord is a small individual owner who just
                  &quot;isn&apos;t great&quot;?
                </span>{" "}
                Small-owner situations are where most 1-3 unit NJ tenants
                and NYC brownstone tenants end up. Protections are thinner
                (Anti-Eviction Act doesn&apos;t apply to owner-occupied
                1-3 units; Good Cause carves out small landlords). The
                best leverage is still paper-trail and small-claims for
                deposits, but expect less recourse on renewals. The
                strongest move is to vet harder before signing.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Where can I get free legal help?
                </span>
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>NJ:</strong> Legal Services of New Jersey
                  (1-888-LSNJ-LAW), Volunteer Lawyers for Justice NJ,
                  county-specific legal aid.
                </li>
                <li>
                  <strong>NYC:</strong> Legal Aid Society, Housing Court
                  Answers, Right to Counsel NYC, JustFix online tools.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Related Guides */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <Link
                  href="/nyc-apartment-search-guide"
                  className="text-primary underline underline-offset-2"
                >
                  NYC apartment search guide
                </Link>{" "}
                &mdash; how to find a good landlord, not just a good
                apartment.
              </p>
              <p>
                <Link
                  href="/best-time-to-rent-nyc"
                  className="text-primary underline underline-offset-2"
                >
                  Best time to rent in NYC
                </Link>{" "}
                &mdash; timing your search for leverage.
              </p>
              <p>
                <Link
                  href="/cost-of-moving-to-nyc"
                  className="text-primary underline underline-offset-2"
                >
                  Cost of moving to NYC
                </Link>{" "}
                &mdash; deposit, broker fees, and what&apos;s actually
                legal to charge.
              </p>
              <p>
                <Link
                  href="/nyc-rent-by-neighborhood"
                  className="text-primary underline underline-offset-2"
                >
                  NYC rent by neighborhood
                </Link>{" "}
                &mdash; know the going rate before you negotiate.
              </p>
              <p>
                <Link
                  href="/nyc-moving-checklist"
                  className="text-primary underline underline-offset-2"
                >
                  NYC moving checklist
                </Link>{" "}
                &mdash; including the move-in walk-through video.
              </p>
              <p>
                <Link
                  href="/blog/negotiating-rent-and-lease-terms"
                  className="text-primary underline underline-offset-2"
                >
                  Negotiating rent and lease terms
                </Link>{" "}
                &mdash; push back on renewal increases.
              </p>
              <p>
                <Link
                  href="/blog/nyc-rent-stabilization-guide"
                  className="text-primary underline underline-offset-2"
                >
                  NYC rent stabilization explained
                </Link>{" "}
                &mdash; check if your apartment qualifies.
              </p>
              <p>
                <Link
                  href="/blog/rental-application-screening-basics"
                  className="text-primary underline underline-offset-2"
                >
                  Rental application checklist
                </Link>{" "}
                &mdash; have your paperwork ready.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle>Find a Good Landlord the First Time</CardTitle>
              <CardDescription>
                Wade Me Home surfaces rentals across NYC and NJ with building
                context and violation history baked in &mdash; so you can
                avoid the bad-landlord cycle before you sign.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/">Start Your Search</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
