import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { BrokerFeeLawTimeline } from "@/components/fare-act/BrokerFeeLawTimeline";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/nyc-broker-fee-law-timeline`;

export const metadata: Metadata = {
  title:
    "NYC Broker Fee Law Timeline (2019–2026): FARE Act, REBNY Lawsuit & DCWP Enforcement | Wade Me Home",
  description:
    "Interactive 13-event timeline tracking the NYC broker fee law from the 2019 DOS guidance through the 2024 FARE Act passage, June 2025 effective date, REBNY's failed Second Circuit appeal, and DCWP's 2026 repeat-offender enforcement. Includes a lease-date check that tells you which enforcement window applies to your lease.",
  keywords: [
    "nyc broker fee law",
    "nyc broker fee law 2025",
    "nyc broker fee law 2026",
    "FARE Act timeline",
    "FARE Act history",
    "FARE Act passage date",
    "FARE Act effective date",
    "NYC broker fee ban",
    "NYC broker fee ban 2025",
    "REBNY lawsuit FARE Act",
    "REBNY v NYC FARE Act",
    "FARE Act preliminary injunction",
    "FARE Act Second Circuit",
    "DCWP FARE Act enforcement",
    "FARE Act repeat offender",
    "NYC broker fee history",
    "DOS guidance broker fee 2019",
    "Local Law 169 of 2024",
    "NYC Admin Code 20-699.21",
    "Intro 360 NYC FARE Act",
    "Chi Osse FARE Act",
    "FARE Act lease covered",
    "is my lease covered by FARE Act",
    "FARE Act compliance bulletin",
    "NJ A-2978 broker fee",
    "Renters Fees Transparency Act",
    "federal broker fee law",
    "NYC broker fee 2024 2025 2026",
  ],
  openGraph: {
    title:
      "NYC Broker Fee Law Timeline (2019–2026): FARE Act, REBNY Lawsuit & DCWP Enforcement",
    description:
      "Interactive timeline of the NYC FARE Act and broker-fee fight — from 2019 DOS guidance through 2026 DCWP repeat-offender enforcement. Plus a lease-date check.",
    url: TOOL_URL,
    type: "website",
  },
  alternates: { canonical: TOOL_URL },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NYC Broker Fee Law Timeline (2019–2026)",
    url: TOOL_URL,
    applicationCategory: "GovernmentApplication",
    operatingSystem: "Any",
    description:
      "Interactive 13-event timeline of NYC's FARE Act and broker-fee law from 2019 DOS guidance through 2026 DCWP repeat-offender enforcement, with a lease-date check that tells you which FARE Act enforcement window applies to your lease.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When was the NYC broker fee law passed?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The NYC FARE Act (Intro 360 / Local Law 169 of 2024) passed the NYC City Council 42-8 on November 13, 2024, and became law on December 13, 2024 by the 30-day window after Mayor Adams declined to sign or veto. The 180-day implementation window meant the law took effect on June 11, 2025.",
        },
      },
      {
        "@type": "Question",
        name: "Did REBNY succeed in blocking the FARE Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. REBNY filed suit in SDNY in December 2024 seeking a preliminary injunction. Judge Ronnie Abrams denied the PI in May 2025, finding the FARE Act not preempted by NY State law and finding the disclosure provisions survived Central Hudson scrutiny. The Second Circuit affirmed in September 2025. The merits litigation continues but enforcement is solidly in place.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between the 2019 DOS guidance and the 2024 FARE Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The 2019 DOS guidance was a state-level interpretation of RPL §238-a (the HSTPA broker-fee prohibition). REBNY obtained a preliminary injunction in April 2020 (REBNY v. DOS) blocking enforcement of that guidance. The injunction held for 5 years. The 2024 FARE Act is a NYC ordinance, not state guidance — it works at the city level, so it isn't bound by the state-court injunction. That's why the FARE Act took effect in June 2025 even though RPL §238-a enforcement was still enjoined.",
        },
      },
      {
        "@type": "Question",
        name: "What enforcement window does my lease fall under?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Use the lease-date check at the top of this page. Pre-June-11-2025 leases are not covered by the FARE Act (only RPL §238-a, which was enjoined). June 11–July 15 2025 leases fall in the early enforcement window before DCWP's compliance bulletin. July 15 2025–January 15 2026 leases fall in the DCWP guidance window where 'administrative' or 'marketing' rebrand fees are presumptively violations. Post-January 15 2026 leases fall in the repeat-offender enforcement era with $2,000+ enhanced penalties.",
        },
      },
      {
        "@type": "Question",
        name: "Does the FARE Act apply in Jersey City or Hoboken?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. The FARE Act is a NYC ordinance (NYC Admin. Code §20-699.21) and has no force in NJ. NJ's A-2978 (Pending 2026) is a NJ Assembly bill modeled on the FARE Act that would extend the broker-fee shift to Jersey City, Hoboken, and Newark — but it's currently stalled in committee. Until passage, NJ tenants can still be charged tenant-paid broker fees on most rentals.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a federal broker fee law?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sen. Booker (NJ) and Rep. Ocasio-Cortez (NY-14) introduced the Renters' Fees Transparency Act in March 2026 (S. 4082 / H.R. 7991) — a federal companion bill that would require the FTC to enforce broker-fee transparency nationwide modeled on NYC's FARE Act. Hearings expected late 2026. Passage uncertain.",
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
        name: "Tools",
        item: `${baseUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "NYC Broker Fee Law Timeline",
        item: TOOL_URL,
      },
    ],
  },
];

const FAQ_DISPLAY = [
  {
    q: "When was the NYC FARE Act passed?",
    a: "Intro 360 passed the NYC Council 42-8 on November 13, 2024, became law December 13, 2024, and took effect June 11, 2025 (180 days post-enactment).",
  },
  {
    q: "Did REBNY's lawsuit succeed?",
    a: "No. The SDNY denied REBNY's preliminary injunction in May 2025. The Second Circuit affirmed in September 2025. Merits litigation continues; enforcement is in place.",
  },
  {
    q: "How is this different from the 2019 DOS guidance?",
    a: "The 2019 guidance was state-level and enjoined in REBNY v. DOS (April 2020). The FARE Act is a NYC ordinance that works at the city level, sidestepping the state-court injunction.",
  },
  {
    q: "What is Local Law 169 of 2024?",
    a: "Local Law 169 is the NYC FARE Act, codified at NYC Administrative Code §§ 20-699.20 through 20-699.27. It prohibits charging tenants broker fees on landlord-listed rentals and requires upfront disclosure of all fees.",
  },
  {
    q: "What is DCWP's role?",
    a: "DCWP (Department of Consumer & Worker Protection) is the enforcement agency. It issues civil penalties ($1,000 first offense, $2,000 repeat), processes complaints at nyc.gov/dcwp, and has issued the first repeat-offender ruling ($5,000 enhanced penalty) in January 2026.",
  },
  {
    q: "Is this legal advice?",
    a: "No — this is informational. The timeline cites primary sources but does not constitute legal advice. For a specific dispute, run the situation through our violation reporter or contact Legal Aid Society NYC.",
  },
];

export default function NYCBrokerFeeLawTimelinePage() {
  return (
    <div className="bg-background">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:py-14">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Free</Badge>
            <Badge className="bg-emerald-600">Lease-date check included</Badge>
            <Badge variant="outline">2019 → 2026</Badge>
            <Badge variant="outline">13 events</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            NYC Broker Fee Law Timeline (2019–2026)
          </h1>
          <p className="text-base text-muted-foreground">
            Interactive timeline tracking every key milestone in the NYC
            tenant-paid-broker-fee fight — from the 2019 DOS guidance, through
            the 2020 REBNY preliminary injunction, the 2024 FARE Act passage,
            the June 2025 effective date, the SDNY and Second Circuit
            decisions denying REBNY&apos;s motion to block enforcement, and
            DCWP&apos;s 2026 first repeat-offender ruling. Includes a
            lease-date check that tells you which enforcement window your
            lease falls under.
          </p>
        </header>

        <BrokerFeeLawTimeline />

        <Card>
          <CardHeader>
            <CardTitle>Why this timeline matters for renters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Most NYC renters who Google &ldquo;NYC broker fee law
              2025&rdquo; or &ldquo;FARE Act&rdquo; arrive without knowing
              whether the law applies to their specific lease, what
              enforcement looks like, or whether REBNY&apos;s lawsuit
              actually changed anything. The short answer: REBNY lost its
              preliminary injunction motion at both the SDNY and the
              Second Circuit; enforcement is in place; DCWP is actively
              issuing fines; and any tenant-side broker fee on a
              landlord-listed unit signed on or after June 11, 2025 is
              presumptively a violation.
            </p>
            <p>
              The timeline above lays out the full procedural history with
              citations so you can verify each step. The lease-date check
              tells you which of four enforcement windows your specific
              lease falls under (pre-FARE / early enforcement / DCWP
              guidance / repeat-offender era). The window matters because
              the strength of your DCWP complaint, your small-claims
              eligibility, and the likely DCWP penalty amount all change
              with the enforcement window.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Where to find the primary sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong>The FARE Act statute:</strong> NYC Administrative
              Code §§ 20-699.20 through 20-699.27. The bill was Intro 360
              of 2024 / Local Law 169 of 2024. Full text on the NYC
              Council legislation tracker.
            </p>
            <p>
              <strong>DCWP enforcement materials:</strong> nyc.gov/dcwp
              hosts the FARE Act compliance bulletin (DCWP Bulletin
              2025-04, July 2025), the public complaint form, and a
              public list of issued penalties.
            </p>
            <p>
              <strong>REBNY litigation:</strong> REBNY v. NYC,
              1:24-cv-09678 (SDNY); appeal at the Second Circuit. PACER
              docket and Justia have the full filings.
            </p>
            <p>
              <strong>2019 DOS guidance and REBNY v. DOS:</strong> Index
              No. 902343-20 (Albany Sup. Ct.). The April 2020
              preliminary injunction and subsequent rulings are public.
            </p>
            <p>
              <strong>NJ A-2978:</strong> NJ Legislature&apos;s public
              bill tracker shows the bill is in the Housing Committee with
              no scheduled vote as of 2026-05-01.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            {FAQ_DISPLAY.map((item) => (
              <div key={item.q} className="space-y-1.5">
                <p className="font-semibold text-foreground">{item.q}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Related guides &amp; tools</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="justify-between">
              <Link href="/blog/nyc-fare-act-broker-fee-ban">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  FARE Act broker fee ban guide
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/fare-act-violation-reporter">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  FARE Act violation reporter
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/fare-act-broker-fee-checker">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  FARE Act savings checker
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/answers/does-fare-act-apply-to-jersey-city-hoboken">
                <span className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Does the FARE Act apply in JC / Hoboken?
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  All NYC renter tools
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
