"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import { cacheProperty } from "@/lib/properties/propertyStorage";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface GuestPropertyDetailSheetProps {
  property: PropertyDataItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestPropertyDetailSheet({
  property,
  open,
  onOpenChange,
}: GuestPropertyDetailSheetProps) {
  const propertyKey = useMemo(() => (property ? buildPropertyKey(property) : ""), [property]);

  if (!property) return null;

  const openFullDetails = () => {
    cacheProperty(propertyKey, property);
    const path = `/properties/${encodeURIComponent(propertyKey)}`;
    window.open(path, "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{property.name}</SheetTitle>
          <SheetDescription>{property.address}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          <div className="relative h-56 w-full overflow-hidden rounded-md border bg-muted">
            {property.images_urls[0] ? (
              <Image
                src={property.images_urls[0]}
                alt={property.name}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{property.bedroom_range}</Badge>
            <Badge variant="secondary">{property.rent_range}</Badge>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-semibold">Main amenities</h4>
            <div className="flex flex-wrap gap-2">
              {property.main_amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <p className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
            Sign up to save favorites, keep notes, and request tours.
          </p>

          <Button type="button" className="w-full" size="lg" onClick={openFullDetails}>
            Open full details
          </Button>
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/signup">Sign up to continue</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
