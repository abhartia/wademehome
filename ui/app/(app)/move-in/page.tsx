"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Camera, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MoveInSetup } from "@/components/movein/MoveInSetup";
import { VendorCategoryCard } from "@/components/movein/VendorCategoryCard";
import { VendorCategorySheet } from "@/components/movein/VendorCategorySheet";
import { MoveInChecklist } from "@/components/movein/MoveInChecklist";
import { useMoveIn } from "@/components/providers/MoveInProvider";
import { usePhotoDocumentation } from "@/lib/hooks/usePhotoDocumentation";
import { VendorCategory } from "@/lib/types/movein";

const CATEGORIES: VendorCategory[] = ["electric", "gas", "internet", "movers"];

export default function MoveInPage() {
  const { getOrderByCategory } = useMoveIn();
  const { summary } = usePhotoDocumentation();
  const [openCategory, setOpenCategory] = useState<VendorCategory | null>(null);
  const photoCount = summary?.totalPhotos ?? 0;

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

        {/* Photo Documentation */}
        <div>
          <h2 className="mb-3 text-base font-semibold">Photo Documentation</h2>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Camera className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Move-in condition photos</p>
                <p className="text-xs text-muted-foreground">
                  {photoCount > 0
                    ? `${photoCount} photo${photoCount === 1 ? "" : "s"} documented across ${summary?.roomCount ?? 0} room${(summary?.roomCount ?? 0) === 1 ? "" : "s"}`
                    : "Protect your deposit by documenting your apartment\u2019s condition on move-in day"}
                </p>
              </div>
              {photoCount > 0 && (
                <Badge variant="secondary" className="shrink-0">
                  <ImageIcon className="mr-1 h-3 w-3" />
                  {photoCount}
                </Badge>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/move-in/photos">
                  {photoCount > 0 ? "View" : "Start"}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
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
