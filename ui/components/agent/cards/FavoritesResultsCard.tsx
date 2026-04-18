"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MapPin } from "lucide-react";

import type { FavoritesResultsAnnotation } from "../types";

interface Props {
  data: FavoritesResultsAnnotation["data"];
}

export function FavoritesResultsCard({ data }: Props) {
  const items = data.favorites ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <Heart className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/saved">Open saved</Link>
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {data.empty_message || "Nothing saved yet."}
        </div>
      ) : (
        <ul className="divide-y">
          {items.slice(0, 8).map((f) => (
            <li
              key={f.property_key}
              className="flex items-center gap-3 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{f.property_name}</p>
                <p className="mt-0.5 inline-flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{f.property_address}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
