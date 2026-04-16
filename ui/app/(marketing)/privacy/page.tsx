import type { Metadata } from "next";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy | Wade Me Home",
  description: "How Wade Me Home collects, uses, and protects your information.",
  openGraph: {
    title: "Privacy Policy | Wade Me Home",
    description: "How Wade Me Home collects, uses, and protects your information.",
  },
};

const effectiveDate = "April 17, 2026";
const contactEmail = "support@wademehome.com";
const governingState = "New York (with initial operations in New Jersey)";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 p-6">
        <header className="space-y-3">
          <Badge variant="outline">Legal</Badge>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Effective date: {effectiveDate}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This Privacy Policy explains how wademehome collects, uses, shares,
              and safeguards information when you use the website and related
              features.
            </p>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>1) Scope and applicability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              This policy applies to information processed through Wade Me Home,
              including onboarding, search, tours, roommate, guarantor, and
              move-in features.
            </p>
            <p>
              The service is intended for users in the United States only. The
              initial market focus is New York and New Jersey, but the product
              may be used in other U.S. states.
            </p>
            <p>
              You are interacting with a solo-operated service. There is no
              separate corporate entity at this time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2) Information we collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Depending on how you use the product, we may collect:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-foreground">
                  Profile and onboarding details:
                </span>{" "}
                preferences such as city, budget, move timeline, living
                arrangement, and related responses you submit.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Product usage data:
                </span>{" "}
                pages visited and interactions used to improve onboarding and
                product experience.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Device and technical data:
                </span>{" "}
                browser-level analytics metadata provided by analytics tools when
                consent is granted.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3) How we use information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>We use information to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide and personalize product features.</li>
              <li>
                Support your rental journey workflows and remember prior inputs.
              </li>
              <li>Monitor product performance and improve usability.</li>
              <li>Maintain reliability, safety, and abuse prevention.</li>
              <li>Comply with legal obligations and enforce terms.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4) Cookies, analytics, and consent controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Wade Me Home uses Google Analytics (GA4) with Google Consent
              Mode v2 to understand product usage. Because the service is
              offered only in the United States, analytics are allowed by
              default. You can opt out at any time using the{" "}
              <span className="font-medium text-foreground">
                Your Privacy Choices
              </span>{" "}
              link in the site menu.
            </p>
            <p>
              Your choice is stored in your browser under:
              <code className="ml-1 rounded bg-muted px-1 py-0.5 text-xs">
                wademehome_analytics_consent
              </code>
              .
            </p>
            <p>
              If your browser sends a{" "}
              <span className="font-medium text-foreground">
                Global Privacy Control (GPC)
              </span>{" "}
              signal, analytics are automatically disabled unless you have
              previously chosen to allow them. Advertising identifiers
              (ad_storage, ad_user_data, ad_personalization) are denied by
              default for all visitors. You can also manage cookies in your
              browser settings at any time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5) When information is shared</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Information may be shared only in limited situations:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-foreground">
                  Service providers:
                </span>{" "}
                with vendors that support hosting, analytics, and infrastructure
                operations.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Legal reasons:
                </span>{" "}
                where required by law, subpoena, court order, or to protect
                rights and safety.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Business transfer:
                </span>{" "}
                in connection with a merger, acquisition, restructuring, or sale
                of assets.
              </li>
            </ul>
            <p>
              Personal information is not sold for monetary consideration.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6) Data retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Data is retained only as long as needed for product operations,
              legitimate business purposes, and legal compliance.
            </p>
            <p>
              Standard retention windows:
              <span className="font-medium text-foreground">
                profile and onboarding data for up to 24 months after last
                account activity; product usage analytics for up to 14 months;
                technical security logs for up to 12 months
              </span>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7) Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Reasonable administrative, technical, and organizational safeguards
              are used to protect information. No method of transmission or
              storage is completely secure, and absolute security cannot be
              guaranteed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8) Your rights and choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              You may request access, correction, deletion, or portability of
              personal information, subject to legal limitations.
            </p>
            <p>
              If your U.S. state provides specific privacy rights (for example,
              California), you may submit a request by contacting{" "}
              <span className="font-medium text-foreground">{contactEmail}</span>.
            </p>
            <p>
              Verification may be required before completing rights requests.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9) Children&apos;s privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Wade Me Home is not directed to children under 13, and personal
              information is not knowingly collected from children under 13.
            </p>
            <p>
              If you believe a child provided personal information, contact{" "}
              <span className="font-medium text-foreground">{contactEmail}</span>{" "}
              so it can be reviewed and removed where appropriate.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10) Changes to this policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              This policy may be updated periodically. Material changes will be
              reflected by revising the effective date and, where appropriate,
              providing additional notice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11) Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Contact email:{" "}
              <span className="font-medium text-foreground">{contactEmail}</span>
            </p>
            <p>
              Governing state reference:{" "}
              <span className="font-medium text-foreground">
                {governingState}
              </span>
            </p>
          </CardContent>
        </Card>

        <Separator />
        <p className="pb-8 text-xs text-muted-foreground">
          This page is a product-facing privacy notice and does not constitute
          legal advice.
        </p>
        </div>
      </div>
    </div>
  );
}
