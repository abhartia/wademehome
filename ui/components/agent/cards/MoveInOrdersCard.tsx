"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck } from "lucide-react";

import type { MoveInOrdersAnnotation } from "../types";

interface Props {
  data: MoveInOrdersAnnotation["data"];
}

export function MoveInOrdersCard({ data }: Props) {
  const orders = data.orders ?? [];
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <Truck className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/move-in">Open</Link>
        </Button>
      </div>
      {orders.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {data.empty_message || "No orders placed yet."}
        </div>
      ) : (
        <ul className="divide-y">
          {orders.slice(0, 6).map((o) => (
            <li key={o.id} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{o.vendor_name}</p>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {o.category}
                  </Badge>
                  <Badge className="border-transparent bg-emerald-500/15 text-[10px] uppercase text-emerald-700 dark:text-emerald-300">
                    {o.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {[o.plan_name, o.scheduled_date, o.monthly_cost]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
