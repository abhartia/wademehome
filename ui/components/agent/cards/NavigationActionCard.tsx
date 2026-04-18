"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Compass } from "lucide-react";

import type { NavigationActionAnnotation } from "../types";

interface Props {
  data: NavigationActionAnnotation["data"];
}

export function NavigationActionCard({ data }: Props) {
  return (
    <Card className="flex items-center gap-3 border-border/60 bg-gradient-to-br from-primary/5 to-transparent px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Compass className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{data.title}</p>
        {data.description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {data.description}
          </p>
        ) : null}
      </div>
      <Button asChild size="sm" className="gap-1">
        <Link href={data.href}>
          {data.cta || "Open"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </Card>
  );
}
