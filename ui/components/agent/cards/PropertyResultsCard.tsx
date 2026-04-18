"use client";

import { useState } from "react";

import { PropertyList } from "@/components/annotations/PropertyListings/PropertyListings";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { PropertyDetailSheet } from "@/components/properties/PropertyDetailSheet";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

import type { PropertyResultsAnnotation } from "../types";

interface Props {
  data: PropertyResultsAnnotation["data"];
}

export function PropertyResultsCard({ data }: Props) {
  const [selected, setSelected] = useState<PropertyDataItem | null>(null);
  const [open, setOpen] = useState(false);

  const properties = data.properties ?? [];

  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <Building2 className="h-4 w-4 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{data.title}</p>
          {data.query ? (
            <p className="truncate text-xs text-muted-foreground">
              for &ldquo;{data.query}&rdquo;
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {properties.length} result{properties.length === 1 ? "" : "s"}
        </span>
      </div>

      {properties.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          No matches yet — try widening your area or budget.
        </div>
      ) : (
        <div className="max-h-[28rem] overflow-y-auto p-2">
          <PropertyList
            properties={properties}
            selectedProperty={selected}
            onSelectProperty={(p) => {
              setSelected(p);
              setOpen(true);
            }}
          />
        </div>
      )}

      <PropertyDetailSheet
        property={selected}
        open={open}
        onOpenChange={setOpen}
      />
    </Card>
  );
}
