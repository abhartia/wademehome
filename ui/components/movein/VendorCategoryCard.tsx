"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Flame, Wifi, Truck, ArrowRight } from "lucide-react";
import { VendorCategory, VendorOrder } from "@/lib/types/movein";

const ICONS: Record<VendorCategory, React.ElementType> = {
  electric: Zap,
  gas: Flame,
  internet: Wifi,
  movers: Truck,
};

const LABELS: Record<VendorCategory, string> = {
  electric: "Electricity",
  gas: "Gas",
  internet: "Internet",
  movers: "Movers",
};

const statusBadge: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  researching: { label: "Researching", variant: "outline" },
  requested: { label: "Requested", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "default" },
  active: { label: "Active", variant: "default" },
};

interface VendorCategoryCardProps {
  category: VendorCategory;
  order?: VendorOrder;
  onOpen: () => void;
}

export function VendorCategoryCard({
  category,
  order,
  onOpen,
}: VendorCategoryCardProps) {
  const Icon = ICONS[category];
  const label = LABELS[category];
  const badge = order ? statusBadge[order.status] : null;

  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">{label}</span>
              {badge && (
                <Badge
                  variant={badge.variant}
                  className="px-1.5 py-0 text-[10px]"
                >
                  {badge.label}
                </Badge>
              )}
              {!order && (
                <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                  Not started
                </Badge>
              )}
            </div>
            {order ? (
              <div className="mt-0.5 space-y-0.5">
                <p className="text-xs text-muted-foreground">
                  {order.vendorName} &middot; {order.planName}
                </p>
                <p className="text-xs font-medium">{order.monthlyCost}</p>
              </div>
            ) : (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Compare providers and select a plan
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-7 w-full gap-1 text-xs"
          onClick={onOpen}
        >
          {order ? "Manage" : "Compare & Order"}
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
