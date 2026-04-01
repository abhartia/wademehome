import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";

const contactEmail = "support@wademehome.com";

export const metadata: Metadata = {
  title: "For property managers | Wade Me Home",
  description:
    "Competitive rent and concession intelligence near your asset, plus optional weekly email snapshots. Partnerships for listings and integrations.",
  openGraph: {
    title: "For property managers | Wade Me Home",
    description:
      "Market intelligence for leasing teams and pathways to list on Wade Me Home.",
  },
};

export default function ForPropertyManagersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <Badge variant="outline">Property managers</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              Pricing intelligence and renter reach
            </h1>
            <p className="text-sm text-muted-foreground">
              Wade Me Home combines inventory-backed search with tools for leasing teams.
              Explore nearby buildings—rents, concessions when available, and listing
              links—around any address. Opt in to a weekly email with the same snapshot
              so your team does not have to re-check competitor sites by hand.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Competitive analysis (invite)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The property manager workspace is available to invited accounts. Ask your
                Wade Me Home contact to enable the <span className="text-foreground">property_manager</span> role,
                then sign in and open Competitive analysis.
              </p>
              <Button asChild variant="secondary">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild variant="outline" className="ml-2">
                <Link href="/property-manager/analysis">Open analysis (signed in)</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What we&apos;re building</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Today, discovery starts with fast, trustworthy search. Over time, we
                intend to work with Internet listing services (ILSs), direct feeds,
                and property management systems so listings stay accurate as units
                turn over—which matters in high-churn markets like the New York metro.
              </p>
              <p>
                We do not claim integrations we have not shipped. If you represent a
                portfolio or listing platform, reach out and we&apos;ll discuss the
                right feed format, attribution, and compliance for your market.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get in touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Email us with your company name, markets, approximate unit count, and
                how you currently syndicate listings (if applicable).
              </p>
              <Button asChild>
                <a href={`mailto:${contactEmail}?subject=Property%20manager%20listing%20inquiry`}>
                  Email {contactEmail}
                </a>
              </Button>
            </CardContent>
          </Card>

          <Separator />
          <p className="text-xs text-muted-foreground">
            Looking for a place to rent?{" "}
            <Link href="/" className="font-medium text-foreground underline-offset-4 hover:underline">
              Start on the home page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
