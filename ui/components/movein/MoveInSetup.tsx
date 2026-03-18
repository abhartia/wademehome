"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, ChevronDown, ChevronUp, Check, Building2 } from "lucide-react";
import { useMoveIn } from "@/components/providers/MoveInProvider";
import { useTours } from "@/components/providers/ToursProvider";

export function MoveInSetup() {
  const { plan, updatePlan, progress } = useMoveIn();
  const { tours } = useTours();
  const [showPicker, setShowPicker] = useState(false);

  const completedTours = tours.filter(
    (t) => t.status === "completed" || t.status === "scheduled",
  );

  const totalTasks = progress.checklistTotal + progress.vendorsTotal;
  const doneTasks = progress.checklistDone + progress.vendorsSetUp;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <Card className="py-0">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* Address + date */}
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Moving to
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <Input
                  value={plan.targetAddress}
                  onChange={(e) =>
                    updatePlan({ targetAddress: e.target.value })
                  }
                  placeholder="Enter target address"
                  className="h-8 text-sm"
                />
              </div>
              {completedTours.length > 0 && (
                <div className="mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-1 text-xs"
                    onClick={() => setShowPicker(!showPicker)}
                  >
                    {showPicker ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                    Pick from tours
                  </Button>
                  {showPicker && (
                    <div className="mt-1 space-y-1">
                      {completedTours.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            updatePlan({ targetAddress: t.property.address });
                            setShowPicker(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-md border p-1.5 text-left text-xs transition-colors hover:bg-accent ${
                            plan.targetAddress === t.property.address
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <Building2 className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <span className="truncate">
                            {t.property.name} &middot; {t.property.address}
                          </span>
                          {plan.targetAddress === t.property.address && (
                            <Check className="h-3 w-3 shrink-0 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Move date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <Input
                    type="date"
                    value={plan.moveDate}
                    onChange={(e) =>
                      updatePlan({ moveDate: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Moving from
                </label>
                <Input
                  value={plan.moveFromAddress}
                  onChange={(e) =>
                    updatePlan({ moveFromAddress: e.target.value })
                  }
                  placeholder="Current address (optional)"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col items-center gap-1.5 sm:w-32 sm:shrink-0 sm:pt-2">
            <div className="text-2xl font-bold">{pct}%</div>
            <Progress value={pct} className="h-2 w-full" />
            <p className="text-center text-[11px] text-muted-foreground">
              {progress.vendorsSetUp}/{progress.vendorsTotal} vendors
              &middot; {progress.checklistDone}/{progress.checklistTotal}{" "}
              tasks
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
