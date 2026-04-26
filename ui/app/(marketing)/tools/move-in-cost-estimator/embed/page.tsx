import type { Metadata } from "next";

import { MoveInCostEstimator } from "@/components/widgets/MoveInCostEstimator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "NYC Move-In Cost Estimator (embed)",
  description:
    "Embeddable NYC move-in cost estimator — total cash at signing + monthly amortization.",
  alternates: { canonical: `${baseUrl}/tools/move-in-cost-estimator/embed` },
  robots: { index: false, follow: true },
};

export default function MoveInCostEmbedPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-4 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            NYC Move-In Cost Estimator
          </h1>
          <p className="text-sm text-muted-foreground">
            Free NYC tool — total cash at signing, FARE Act-aware broker fee defaults.
          </p>
        </header>
        <MoveInCostEstimator bare showAttribution />
      </div>
    </div>
  );
}
