import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import Link from "next/link";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is it safe to rent an apartment I found on Craigslist?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Craigslist can have legitimate listings, but it is also the most common platform for rental scams because anyone can post without verification. If you find a listing on Craigslist, verify it independently: check the building ownership, tour in person, and never send money before seeing the apartment. Cross-reference the listing on StreetEasy or the management company's website.",
      },
    },
    {
      "@type": "Question",
      name: "Can a landlord ask for first and last month's rent plus a security deposit upfront?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In New York, landlords can ask for first month's rent and a security deposit (capped at one month's rent) at lease signing. They cannot collect last month's rent in advance. Any request for more than these two payments is either illegal or a scam.",
      },
    },
    {
      "@type": "Question",
      name: "What if a broker asks me to pay the application fee in cash?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paying in cash makes it much harder to dispute the charge or get a refund. Always pay application fees by check or card so you have a paper trail. Remember that application fees in NYC are capped at $20, and the fee must go toward the actual cost of a credit or background check.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know if a broker is licensed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Check the New York Department of State's license lookup tool at eAccessNY. Every real estate broker and salesperson in New York must hold an active license. If someone cannot provide a license number or their name does not appear in the database, do not work with them.",
      },
    },
    {
      "@type": "Question",
      name: "Are Facebook Marketplace apartment listings safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Facebook Marketplace has the same risks as Craigslist. While the platform shows user profiles, scammers create fake accounts. Apply the same verification steps: tour in person, check ownership records, and never wire money or send payment before viewing the apartment.",
      },
    },
  ],
};

export default function NycApartmentScams() {
  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Card>
        <CardHeader>
          <CardTitle>Why apartment scams are so common in NYC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            New York City&apos;s rental market is one of the most competitive in
            the country. Vacancy rates hover around 3 percent, demand far
            outstrips supply, and renters regularly face pressure to act fast or
            lose a listing. Scammers exploit that urgency. They know that when
            someone finds a too-good-to-be-true apartment at below-market rent,
            the instinct is to lock it down immediately—even if that means
            sending money before seeing the place in person.
          </p>
          <p>
            The{" "}
            <a
              href="https://www.ic3.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              FBI&apos;s Internet Crime Complaint Center (IC3)
            </a>{" "}
            reports that rental fraud losses in the US exceed $350 million
            annually, and New York is consistently among the hardest-hit cities.
            The most common victims are first-time renters, people relocating
            from out of state, and international students who may not be
            familiar with local norms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The most common NYC rental scams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Phantom listings:</strong> A
            scammer copies photos and descriptions from a real listing and
            reposts them on Craigslist, Facebook Marketplace, or other platforms
            at a significantly lower price. The &quot;landlord&quot; insists on
            collecting a deposit or first month&apos;s rent via wire transfer,
            Zelle, Venmo, or cryptocurrency before a tour. Once you send money,
            the listing disappears and the person stops responding.
          </p>
          <p>
            <strong className="text-foreground">Hijacked listings:</strong> Similar
            to phantom listings, but the scammer impersonates the actual property
            owner or management company. They may create fake email addresses
            that look almost identical to the real company (e.g.,
            &quot;greystar-rentals.com&quot; instead of the real domain). They
            may even have a key to show you a vacant apartment that they have no
            authority to rent.
          </p>
          <p>
            <strong className="text-foreground">Bait and switch:</strong> A
            legitimate-looking agent or broker advertises an apartment at an
            attractive price. When you show up for a tour, they tell you that
            unit is &quot;just taken&quot; but they have another one—at a higher
            price. While not always illegal, this is a deceptive practice and a
            sign you should walk away.
          </p>
          <p>
            <strong className="text-foreground">Fake landlord with real keys:</strong>{" "}
            The scammer rents an apartment short-term (via Airbnb or a sublease),
            then shows it to multiple prospective tenants, collecting deposits
            and first-month payments from each. When move-in day arrives,
            multiple people show up claiming the same apartment.
          </p>
          <p>
            <strong className="text-foreground">Application fee harvesting:</strong>{" "}
            A &quot;landlord&quot; insists on a non-refundable application fee
            (often $50 to $200) before you can even see the apartment. They
            collect fees from dozens of applicants with no intention of renting
            to anyone. In New York, application fees are capped at $20 by law
            and can only cover the cost of a background or credit check.
          </p>
          <p>
            <strong className="text-foreground">Lease-signing deposit scam:</strong>{" "}
            After an in-person tour of a real apartment, the scammer asks you to
            sign a fake lease and pay a security deposit plus first month&apos;s
            rent in cash, cashier&apos;s check, or wire transfer. The lease
            looks legitimate, but the person has no legal right to rent the unit.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Red flags that signal a rental scam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Price is too low:</strong> If
              a one-bedroom in Manhattan is listed at $1,500 when the market
              average is $3,500, it is almost certainly a scam. Use sites like
              StreetEasy or{" "}
              <Link href="/" className="text-primary hover:underline">
                Wade Me Home
              </Link>{" "}
              to check comparable rents in the neighborhood.
            </li>
            <li>
              <strong className="text-foreground">
                Payment before viewing:
              </strong>{" "}
              Any request for money before you have physically seen the apartment
              in person is a major warning sign. Never send a deposit, holding
              fee, or application fee without a tour.
            </li>
            <li>
              <strong className="text-foreground">Wire transfer or crypto only:</strong>{" "}
              Legitimate landlords and management companies accept checks or
              secure online payment platforms. If someone insists on wire
              transfer, Zelle, Venmo, Cash App, gift cards, or cryptocurrency,
              walk away.
            </li>
            <li>
              <strong className="text-foreground">Refuses to meet in person:</strong>{" "}
              The &quot;landlord&quot; claims to be out of the country, traveling,
              or too busy to show the apartment and offers to mail you the keys.
              A legitimate landlord or their representative will show the unit.
            </li>
            <li>
              <strong className="text-foreground">Pressure to act immediately:</strong>{" "}
              While NYC moves fast, a legitimate landlord will give you at least
              24 to 48 hours to review a lease. Anyone demanding an immediate
              cash payment or threatening that the apartment will be gone in an
              hour is likely running a scam.
            </li>
            <li>
              <strong className="text-foreground">No lease or vague lease:</strong>{" "}
              A real landlord provides a formal lease agreement. If someone
              avoids putting terms in writing or hands you a one-page
              &quot;agreement,&quot; that is a red flag.
            </li>
            <li>
              <strong className="text-foreground">Listing only on one platform:</strong>{" "}
              If the apartment appears only on Craigslist or Facebook but not on
              StreetEasy, Apartments.com, or any management company website,
              verify the listing independently before proceeding.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to verify a listing is legitimate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">
              Check the building and ownership:
            </strong>{" "}
            The NYC Department of Housing Preservation and Development (HPD)
            maintains a public database at{" "}
            <a
              href="https://hpdonline.nyc.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              hpdonline.nyc.gov
            </a>{" "}
            where you can look up any building by address. You can verify the
            registered owner and check for open violations. The NYC Department
            of Finance{" "}
            <a
              href="https://a836-acris.nyc.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ACRIS system
            </a>{" "}
            lets you look up property ownership records.
          </p>
          <p>
            <strong className="text-foreground">
              Reverse-search the photos:
            </strong>{" "}
            Right-click on listing photos and use Google Image Search or TinEye
            to see if the same photos appear on other sites under a different
            address or price. Stolen photos are the most common tool in phantom
            listings.
          </p>
          <p>
            <strong className="text-foreground">
              Verify the person&apos;s identity:
            </strong>{" "}
            Ask for a business card, check the brokerage&apos;s website, and
            verify the broker&apos;s license on the{" "}
            <a
              href="https://www.dos.ny.gov/licensing/licnsrch/profiler.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              New York Department of State&apos;s eAccessNY portal
            </a>
            . If they claim to be the building owner, cross-reference with HPD
            or ACRIS records.
          </p>
          <p>
            <strong className="text-foreground">Visit in person:</strong> Always
            tour the apartment before sending any money. During the tour, check
            that the person showing the unit has legitimate access (a key from
            the management company, not a lockbox code they could have gotten
            from a short-term rental).
          </p>
          <p>
            <strong className="text-foreground">
              Compare rent to market rates:
            </strong>{" "}
            Use{" "}
            <Link href="/" className="text-primary hover:underline">
              Wade Me Home&apos;s AI apartment search
            </Link>{" "}
            or the{" "}
            <Link
              href="/nyc-rent-by-neighborhood"
              className="text-primary hover:underline"
            >
              NYC rent by neighborhood guide
            </Link>{" "}
            to check whether the asking rent is reasonable for the area, size,
            and condition.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>NYC tenant protections you should know</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">
              Application fee cap:
            </strong>{" "}
            New York law limits application fees to $20. Any landlord or broker
            charging more is violating the Housing Stability and Tenant
            Protection Act of 2019.
          </p>
          <p>
            <strong className="text-foreground">Security deposit limit:</strong>{" "}
            Security deposits in New York are capped at one month&apos;s rent.
            If someone asks for two or three months of security, they are either
            breaking the law or running a scam. Learn more about{" "}
            <Link
              href="/blog/security-deposits-move-in-fees"
              className="text-primary hover:underline"
            >
              security deposit rules and move-in fees
            </Link>
            .
          </p>
          <p>
            <strong className="text-foreground">
              Broker fee rules under the FARE Act:
            </strong>{" "}
            Since June 2025, the{" "}
            <Link
              href="/blog/nyc-fare-act-broker-fee-ban"
              className="text-primary hover:underline"
            >
              FARE Act
            </Link>{" "}
            means tenants only pay broker fees if they independently hired that
            broker. If a landlord&apos;s agent is trying to charge you a broker
            fee, that may be illegal.
          </p>
          <p>
            <strong className="text-foreground">Rent stabilization:</strong> If
            you&apos;re looking at a unit in a building with 6 or more apartments
            built before 1974, it may be{" "}
            <Link
              href="/blog/nyc-rent-stabilization-guide"
              className="text-primary hover:underline"
            >
              rent-stabilized
            </Link>
            . Rent-stabilized units have regulated rents—if someone is quoting a
            price well above what the DHCR records show, that is a red flag.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What to do if you have been scammed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong className="text-foreground">
                Stop all communication:
              </strong>{" "}
              Do not send any more money. Block the scammer&apos;s phone number
              and email.
            </li>
            <li>
              <strong className="text-foreground">
                Contact your bank or payment provider:
              </strong>{" "}
              If you paid by credit card, file a chargeback immediately. For wire
              transfers, contact the bank as soon as possible—recovery is harder
              but sometimes possible if caught quickly. For Zelle or Venmo, file
              a dispute through the app.
            </li>
            <li>
              <strong className="text-foreground">File a police report:</strong>{" "}
              File a report with the NYPD online at{" "}
              <a
                href="https://www.nyc.gov/site/nypd/services/victim-services/online-reporting.page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                nyc.gov/nypd
              </a>{" "}
              or at your local precinct. Get the report number for your records.
            </li>
            <li>
              <strong className="text-foreground">
                Report to the FTC and FBI:
              </strong>{" "}
              File a complaint at{" "}
              <a
                href="https://reportfraud.ftc.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                reportfraud.ftc.gov
              </a>{" "}
              and{" "}
              <a
                href="https://www.ic3.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ic3.gov
              </a>{" "}
              (FBI Internet Crime Complaint Center).
            </li>
            <li>
              <strong className="text-foreground">
                Report the listing:
              </strong>{" "}
              Flag the fraudulent listing on whatever platform you found it
              (Craigslist, Facebook Marketplace, etc.) to help protect other
              renters.
            </li>
            <li>
              <strong className="text-foreground">
                Contact the NY Attorney General:
              </strong>{" "}
              File a complaint at{" "}
              <a
                href="https://ag.ny.gov/resources/individuals/housing/tenant-rights"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ag.ny.gov
              </a>
              . The AG&apos;s office investigates patterns of rental fraud.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently asked questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground">
              Is it safe to rent an apartment I found on Craigslist?
            </h3>
            <p className="mt-1">
              Craigslist can have legitimate listings, but it is also the most
              common platform for rental scams because anyone can post without
              verification. If you find a listing on Craigslist, verify it
              independently: check the building ownership, tour in person, and
              never send money before seeing the apartment. Cross-reference the
              listing on StreetEasy or the management company&apos;s website.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Can a landlord ask for first and last month&apos;s rent plus a
              security deposit upfront?
            </h3>
            <p className="mt-1">
              In New York, landlords can ask for first month&apos;s rent and a
              security deposit (capped at one month&apos;s rent) at lease
              signing. They cannot collect last month&apos;s rent in advance.
              Any request for more than these two payments is either illegal or
              a scam.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              What if a broker asks me to pay the application fee in cash?
            </h3>
            <p className="mt-1">
              Paying in cash makes it much harder to dispute the charge or get a
              refund. Always pay application fees by check or card so you have a
              paper trail. Remember that application fees in NYC are capped at
              $20, and the fee must go toward the actual cost of a credit or
              background check.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              How do I know if a broker is licensed?
            </h3>
            <p className="mt-1">
              Check the New York Department of State&apos;s license lookup tool
              at eAccessNY. Every real estate broker and salesperson in New York
              must hold an active license. If someone cannot provide a license
              number or their name does not appear in the database, do not work
              with them.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Are Facebook Marketplace apartment listings safe?
            </h3>
            <p className="mt-1">
              Facebook Marketplace has the same risks as Craigslist. While the
              platform shows user profiles, scammers create fake accounts.
              Apply the same verification steps: tour in person, check
              ownership records, and never wire money or send payment before
              viewing the apartment.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sources and resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <a href="https://www.ic3.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                FBI Internet Crime Complaint Center (IC3)
              </a>{" "}
              — file complaints and view annual rental fraud statistics
            </li>
            <li>
              <a href="https://hpdonline.nyc.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                NYC HPD Online
              </a>{" "}
              — building ownership, registration, and violation records
            </li>
            <li>
              <a href="https://a836-acris.nyc.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                NYC ACRIS Property Records
              </a>{" "}
              — verify who actually owns a building before renting
            </li>
            <li>
              <a href="https://www.dos.ny.gov/licensing/licnsrch/profiler.asp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                NY DOS Broker License Lookup (eAccessNY)
              </a>{" "}
              — verify any broker or agent is licensed in New York State
            </li>
            <li>
              <a href="https://ag.ny.gov/resources/individuals/housing/tenant-rights" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                NY Attorney General — Tenant Rights
              </a>{" "}
              — report rental fraud and learn about your protections
            </li>
            <li>
              <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                FTC ReportFraud
              </a>{" "}
              — Federal Trade Commission fraud reporting portal
            </li>
          </ul>
        </CardContent>
      </Card>

      <ArticleCTA />
    </div>
  );
}
