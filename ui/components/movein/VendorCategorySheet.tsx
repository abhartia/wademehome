"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  Phone,
  Globe,
  MapPin,
  Trash2,
} from "lucide-react";
import { useMoveIn } from "@/components/providers/MoveInProvider";
import { VendorCategory, Vendor, VendorPlan } from "@/lib/types/movein";
import { MOCK_VENDORS } from "@/lib/mock/movein";

interface VendorCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: VendorCategory;
}

const LABELS: Record<VendorCategory, string> = {
  electric: "Electricity Providers",
  gas: "Gas Providers",
  internet: "Internet Providers",
  movers: "Moving Companies",
};

export function VendorCategorySheet({
  open,
  onOpenChange,
  category,
}: VendorCategorySheetProps) {
  const { getOrderByCategory, addOrder, updateOrder, removeOrder } =
    useMoveIn();
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  const vendors = MOCK_VENDORS.filter((v) => v.category === category);
  const currentOrder = getOrderByCategory(category);

  function handleSelectPlan(vendor: Vendor, plan: VendorPlan) {
    addOrder({
      vendorId: vendor.id,
      vendorName: vendor.name,
      planId: plan.id,
      planName: plan.name,
      category,
      status: "requested",
      scheduledDate: "",
      accountNumber: "",
      notes: "",
      monthlyCost: `${plan.price}${plan.priceUnit}`,
    });
  }

  function handleConfirm() {
    if (currentOrder) {
      updateOrder(currentOrder.id, { status: "confirmed" });
    }
  }

  function handleActivate() {
    if (currentOrder) {
      updateOrder(currentOrder.id, { status: "active" });
    }
  }

  function handleCancel() {
    if (currentOrder) {
      removeOrder(currentOrder.id);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{LABELS[category]}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {/* Current order */}
          {currentOrder && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Current Selection
                </label>
                <Card className="border-primary py-0">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {currentOrder.vendorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentOrder.planName} &middot;{" "}
                          {currentOrder.monthlyCost}
                        </p>
                      </div>
                      <Badge
                        variant={
                          currentOrder.status === "confirmed" ||
                          currentOrder.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className="px-1.5 py-0 text-[10px] capitalize"
                      >
                        {currentOrder.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      {currentOrder.status === "requested" && (
                        <Button
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={handleConfirm}
                        >
                          <Check className="h-3 w-3" />
                          Mark Confirmed
                        </Button>
                      )}
                      {currentOrder.status === "confirmed" && (
                        <Button
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={handleActivate}
                        >
                          <Check className="h-3 w-3" />
                          Mark Active
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 text-xs text-destructive"
                        onClick={handleCancel}
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Separator />
            </>
          )}

          {/* Vendor list */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground">
              {currentOrder ? "Switch Provider" : "Available Providers"}
            </label>
            {vendors.map((vendor) => {
              const isExpanded = expandedVendor === vendor.id;
              return (
                <Card key={vendor.id} className="py-0">
                  <CardContent className="p-0">
                    <button
                      onClick={() =>
                        setExpandedVendor(isExpanded ? null : vendor.id)
                      }
                      className="flex w-full items-center gap-3 p-3 text-left"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {vendor.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">
                            {vendor.name}
                          </span>
                          <span className="flex items-center gap-0.5 text-xs text-amber-500">
                            <Star className="h-3 w-3 fill-amber-400" />
                            {vendor.rating}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ({vendor.reviewCount.toLocaleString()})
                          </span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {vendor.coverageArea}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t px-3 pb-3 pt-2">
                        <div className="mb-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Phone className="h-2.5 w-2.5" />
                            {vendor.phone}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Globe className="h-2.5 w-2.5" />
                            {vendor.website}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {vendor.plans.map((plan) => (
                            <div
                              key={plan.id}
                              className="flex items-start gap-3 rounded-lg border p-2.5"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-medium">
                                    {plan.name}
                                  </span>
                                  {plan.popular && (
                                    <Badge
                                      variant="secondary"
                                      className="px-1 py-0 text-[9px]"
                                    >
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                <p className="mt-0.5 text-sm font-semibold">
                                  {plan.price}
                                  <span className="text-xs font-normal text-muted-foreground">
                                    {plan.priceUnit}
                                  </span>
                                </p>
                                <ul className="mt-1 space-y-0.5">
                                  {plan.features.map((f) => (
                                    <li
                                      key={f}
                                      className="flex items-center gap-1 text-[11px] text-muted-foreground"
                                    >
                                      <Check className="h-2.5 w-2.5 text-green-500" />
                                      {f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <Button
                                size="sm"
                                variant={
                                  currentOrder?.planId === plan.id
                                    ? "secondary"
                                    : "default"
                                }
                                className="h-7 shrink-0 text-xs"
                                onClick={() =>
                                  handleSelectPlan(vendor, plan)
                                }
                                disabled={currentOrder?.planId === plan.id}
                              >
                                {currentOrder?.planId === plan.id
                                  ? "Selected"
                                  : "Select"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
