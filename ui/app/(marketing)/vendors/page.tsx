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
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "Set Up Utilities for Your New Apartment | Wade Me Home",
  description:
    "Guide to setting up electricity, gas, internet, and booking movers for your new apartment. Timelines, what you need, and how Wade Me Home helps.",
  openGraph: {
    title: "Set Up Utilities for Your New Apartment | Wade Me Home",
    description:
      "Guide to setting up electricity, gas, internet, and booking movers for your new apartment. Timelines, what you need, and how Wade Me Home helps.",
    url: `${baseUrl}/vendors`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Essential Vendors for Your New Apartment",
  description:
    "A guide to the key services you need to set up when moving into a new apartment, including electricity, gas, internet, and movers.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Electricity",
      description:
        "Set up your electric account 1-2 weeks before move-in with your lease, SSN, and move-in date.",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Natural Gas",
      description:
        "Activate gas service with same-day or scheduled activation, including pilot light checks.",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Internet",
      description:
        "Arrange internet service 1-3 weeks ahead, choosing between self-install and technician visit.",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Movers",
      description:
        "Book movers 4-6 weeks in advance, comparing estimates and verifying insurance.",
    },
  ],
};

export default function VendorsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <Badge variant="outline">Vendors</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              Set Up Utilities and Services for Your New Apartment
            </h1>
            <p className="text-sm text-muted-foreground">
              Moving into a new apartment means coordinating half a dozen
              services in a tight window. Electricity, gas, internet, and
              movers all have different lead times, different documentation
              requirements, and different ways to trip you up. This guide
              walks through each service so you know when to call, what to
              have ready, and what to watch out for.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Electricity</CardTitle>
              <CardDescription>
                When to call, what you need, and how billing works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Contact your electricity provider one to two weeks before your
                move-in date. In New York City, that is Con Edison for most of
                the five boroughs. You will need your new address, the
                approximate move-in date, your Social Security number (for
                the credit check), and a copy of your lease or a letter from
                your landlord confirming the move-in date. You can start
                service online, by phone, or through the Con Ed app.
              </p>
              <p>
                Electricity accounts in most apartments are individual, meaning
                you are billed directly by the utility. Some buildings,
                particularly newer luxury rentals, include electricity in the
                rent or use a sub-metering system where the building charges
                you based on your unit&apos;s usage. Ask your landlord or
                management company which arrangement applies to your unit
                before you call the utility, because you may not need to set
                up a separate account at all.
              </p>
              <p>
                If the previous tenant&apos;s account is still active when you move
                in, the utility will typically transfer service to your name
                as of your start date. You will not be responsible for any
                outstanding balance from the prior tenant. However, if service
                was disconnected between tenants, activation can take one to
                two business days. Moving in on a Friday without having called
                ahead can mean a weekend without power, so plan accordingly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Natural Gas</CardTitle>
              <CardDescription>
                Activation, pilot lights, and seasonal considerations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Natural gas powers your stove, oven, and sometimes your heat
                and hot water (though many NYC buildings have central
                boilers). If your unit has gas appliances, you need to set up
                a gas account with the provider, which is Con Edison in most
                of Manhattan, the Bronx, Brooklyn, and Queens, or National
                Grid in parts of Brooklyn, Queens, and Staten Island. The
                setup process is similar to electricity and can often be done
                at the same time if both services are through Con Ed.
              </p>
              <p>
                Gas activation may require a technician visit if service was
                shut off between tenants. The technician needs to check for
                leaks, verify pilot lights on any gas appliances, and confirm
                everything is safe before turning on service. If you have a
                gas stove with pilot lights (common in older buildings),
                the technician will light them during activation. In newer
                buildings with electronic ignition, this step is automatic.
                Schedule the visit for before or on your move-in day so you
                can cook from day one.
              </p>
              <p>
                Seasonal timing matters if your unit has gas heat. If you are
                moving in during fall or winter, confirming gas service before
                your first night is not just convenient, it is a safety issue.
                NYC landlords are legally required to maintain minimum
                temperatures in apartments (68 degrees during the day when
                the outside temperature is below 55 degrees), but if your
                heat runs on gas billed to your account, you need that
                account active. Do not wait until you are cold to call the gas
                company.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internet</CardTitle>
              <CardDescription>
                Lead times, installation options, and speed recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Internet setup requires more lead time than most people
                expect. Depending on your building and provider, installation
                can take one to three weeks from the time you place the order.
                In buildings that are already wired for a specific provider
                (common in newer constructions), a self-install kit may be
                available with next-day shipping. In older buildings or those
                without existing wiring, a technician visit is required, and
                appointment availability can be limited.
              </p>
              <p>
                Check which providers serve your specific building before you
                sign up. In NYC, choices typically include a cable provider
                (Optimum or Spectrum depending on your borough) and a fiber
                provider (Verizon Fios where available). Fiber is generally
                faster and more reliable, but availability is building-by-
                building. Your landlord or building management can usually
                tell you which providers have existing infrastructure in the
                building.
              </p>
              <p>
                For a typical apartment, a plan offering 200 to 300 Mbps
                download speed is sufficient for streaming, video calls, and
                general use by two to three people. If you work from home and
                take frequent video calls while others are streaming, consider
                300 to 500 Mbps. Gigabit plans are available but are overkill
                for most apartments unless you have very specific bandwidth
                needs. The router placement matters more than raw speed in a
                small apartment, so place it centrally and not inside a
                closet.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Movers</CardTitle>
              <CardDescription>
                How far ahead to book, what to compare, and insurance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Book your movers four to six weeks before your move date. During
                peak season (May through September), six to eight weeks is
                safer. The first and last days of each month are the most
                in-demand and tend to book up first, so mid-month moves are
                easier to schedule and sometimes cheaper. If your lease starts
                on the first and you have any flexibility, consider moving on
                the second or third to avoid the rush.
              </p>
              <p>
                Get at least three estimates and make sure each company sees
                your apartment (in person or via video walkthrough). Compare
                not just the hourly rate, but what is included: packing
                materials, furniture disassembly and reassembly, mattress bags,
                the number of movers, and the truck size. Ask specifically
                about stair surcharges, long carry fees, and building COI
                requirements. A slightly higher hourly rate from a company that
                includes materials and has no surprise fees often works out
                cheaper overall.
              </p>
              <p>
                Insurance is worth understanding before your move. Basic carrier
                liability, which movers are required to offer at no additional
                cost, covers $0.60 per pound per item. That valuation is
                essentially meaningless for electronics, artwork, or anything
                fragile and expensive. Full-value protection, available as an
                add-on, covers the actual replacement cost of items that are
                damaged or lost. It typically costs a few hundred dollars and
                is worth the peace of mind if you own anything you cannot
                easily replace.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How Wade Me Home Helps</CardTitle>
              <CardDescription>
                Making vendor setup less painful
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Wade Me Home filters vendors by your state and apartment type
                so you see only the providers and services that are relevant to
                your specific situation. Instead of searching for which
                electricity company serves your borough or which internet
                providers have wired your building, we surface the right
                options based on your address and let you compare plans side
                by side.
              </p>
              <p>
                Our vendor catalog covers electricity, gas, internet, movers,
                and cleaning services. For each category, you can see pricing
                ranges, what documentation is required, typical lead times, and
                reviews from other renters in your area. The goal is to
                replace the scattershot process of Googling each service
                individually with a single, organized view of everything you
                need to set up.
              </p>
              <p>
                We also track your setup progress. As you activate each
                service, you can check it off in your move-in dashboard so you
                have a clear picture of what is done and what still needs
                attention. No more wondering whether you called the gas
                company or just thought about calling the gas company. Sign up
                and see vendor recommendations tailored to your new address.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Related guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <Link
                    href="/blog/utilities-internet-move-in"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Setting Up Utilities and Internet
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Set up your move with Wade Me Home
              </Link>
            </Button>
          </div>

          <Separator />
          <p className="text-xs text-muted-foreground">
            Looking for a place to rent?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Start on the home page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
