"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MoveInSetup } from "@/components/movein/MoveInSetup";
import { VendorCategoryCard } from "@/components/movein/VendorCategoryCard";
import { VendorCategorySheet } from "@/components/movein/VendorCategorySheet";
import { MoveInChecklist } from "@/components/movein/MoveInChecklist";
import { useMoveIn } from "@/components/providers/MoveInProvider";
import { VendorCategory } from "@/lib/types/movein";

const CATEGORIES: VendorCategory[] = ["electric", "gas", "internet", "movers"];

export default function MoveInPage() {
  const { getOrderByCategory } = useMoveIn();
  const [openCategory, setOpenCategory] = useState<VendorCategory | null>(null);

  return (
    <div className="h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Move-in Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up utilities, hire movers, and track every task for a smooth
            move.
          </p>
        </div>

        {/* Setup header */}
        <MoveInSetup />

        <Separator />

        {/* Vendor categories */}
        <div>
          <h2 className="mb-3 text-base font-semibold">Vendor Setup</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <VendorCategoryCard
                key={cat}
                category={cat}
                order={getOrderByCategory(cat)}
                onOpen={() => setOpenCategory(cat)}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Checklist */}
        <div>
          <h2 className="mb-3 text-base font-semibold">Move-in Checklist</h2>
          <MoveInChecklist />
        </div>
      </div>

      {/* Vendor sheet */}
      {openCategory && (
        <VendorCategorySheet
          open={!!openCategory}
          onOpenChange={(open) => !open && setOpenCategory(null)}
          category={openCategory}
        />
      )}
    </div>
  );
}
