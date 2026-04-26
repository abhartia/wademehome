import type { Metadata } from "next";

import { NetEffectiveRentCalculator } from "@/components/widgets/NetEffectiveRentCalculator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "Net Effective Rent Calculator (embed)",
  description:
    "Embeddable NYC net effective rent calculator — compare two listings on an apples-to-apples basis.",
  alternates: {
    canonical: `${baseUrl}/tools/net-effective-rent-calculator/embed`,
  },
  robots: { index: false, follow: true },
};

export default function NetEffectiveRentEmbedPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-4 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Net Effective Rent Calculator
          </h1>
          <p className="text-sm text-muted-foreground">
            Free NYC tool — see your true monthly cost after free months and broker fees.
          </p>
        </header>
        <NetEffectiveRentCalculator bare showAttribution />
      </div>
    </div>
  );
}
