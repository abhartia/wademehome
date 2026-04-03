"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ChecklistCategory = "pre-move" | "utilities" | "moving-day" | "post-move";

interface ChecklistItemDef {
  label: string;
  category: ChecklistCategory;
}

const CATEGORY_LABELS: Record<ChecklistCategory, string> = {
  "pre-move": "Pre-move",
  utilities: "Utilities",
  "moving-day": "Moving Day",
  "post-move": "Post-move",
};

const CATEGORY_ORDER: ChecklistCategory[] = [
  "pre-move",
  "utilities",
  "moving-day",
  "post-move",
];

const DEFAULT_ITEMS: ChecklistItemDef[] = [
  { label: "Get renters insurance", category: "pre-move" },
  { label: "Research and book movers", category: "pre-move" },
  { label: "Schedule move-in cleaning", category: "pre-move" },
  { label: "Set up electricity", category: "utilities" },
  { label: "Set up gas/heat", category: "utilities" },
  { label: "Set up internet/WiFi", category: "utilities" },
  { label: "Take move-in condition photos", category: "moving-day" },
  { label: "Test smoke detectors", category: "moving-day" },
  { label: "Check all locks and windows", category: "moving-day" },
  { label: "Forward mail (USPS)", category: "post-move" },
  { label: "Update address on IDs and accounts", category: "post-move" },
  { label: "Meet neighbors and building staff", category: "post-move" },
];

const STORAGE_KEY = "wmh-guest-checklist";

function loadChecked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set(arr);
  } catch {
    // ignore
  }
  return new Set();
}

function saveChecked(checked: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  } catch {
    // ignore
  }
}

export function GuestMoveInChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => loadChecked());
  const [openCategories, setOpenCategories] = useState<Set<ChecklistCategory>>(
    () => new Set(CATEGORY_ORDER),
  );

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCheckedItems(loadChecked());
  }, []);

  const toggleItem = useCallback(
    (label: string) => {
      setCheckedItems((prev) => {
        const next = new Set(prev);
        if (next.has(label)) {
          next.delete(label);
        } else {
          next.add(label);
        }
        saveChecked(next);
        return next;
      });
    },
    [],
  );

  const toggleCategory = useCallback((cat: ChecklistCategory) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const totalItems = DEFAULT_ITEMS.length;
  const completedCount = DEFAULT_ITEMS.filter((item) =>
    checkedItems.has(item.label),
  ).length;
  const progressPercent =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: DEFAULT_ITEMS.filter((item) => item.category === cat),
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Move-in Checklist</CardTitle>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completedCount} of {totalItems} completed
            </span>
            <span className="font-medium text-foreground">
              {progressPercent}%
            </span>
          </div>
          <Progress value={progressPercent} />
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {grouped.map(({ category, items }) => {
          const catCompleted = items.filter((i) =>
            checkedItems.has(i.label),
          ).length;
          const isOpen = openCategories.has(category);
          return (
            <Collapsible
              key={category}
              open={isOpen}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted/50">
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
                <span className="flex-1 text-sm font-medium">
                  {CATEGORY_LABELS[category]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {catCompleted}/{items.length}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-1 pb-1 pl-6 pt-1">
                  {items.map((item) => {
                    const isChecked = checkedItems.has(item.label);
                    return (
                      <label
                        key={item.label}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/30"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleItem(item.label)}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            isChecked &&
                              "text-muted-foreground line-through",
                          )}
                        >
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        <p className="pt-3 text-center text-xs text-muted-foreground">
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Sign up
          </Link>{" "}
          to save your checklist and access the full move-in hub.
        </p>
      </CardContent>
    </Card>
  );
}
