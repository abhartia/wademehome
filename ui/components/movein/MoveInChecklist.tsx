"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMoveIn } from "@/components/providers/MoveInProvider";
import {
  ChecklistCategory,
  CHECKLIST_CATEGORY_LABELS,
} from "@/lib/types/movein";

const CATEGORY_ORDER: ChecklistCategory[] = [
  "pre-move",
  "address",
  "insurance",
  "moving-day",
  "post-move",
];

export function MoveInChecklist() {
  const { checklist, toggleChecklistItem } = useMoveIn();
  const [openSections, setOpenSections] = useState<Set<ChecklistCategory>>(
    new Set(["pre-move"]),
  );

  function toggleSection(cat: ChecklistCategory) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {CATEGORY_ORDER.map((cat) => {
        const items = checklist.filter((i) => i.category === cat);
        const done = items.filter((i) => i.completed).length;
        const isOpen = openSections.has(cat);

        return (
          <Collapsible
            key={cat}
            open={isOpen}
            onOpenChange={() => toggleSection(cat)}
          >
            <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors hover:bg-accent">
              {isOpen ? (
                <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              <span className="flex-1 text-xs font-medium">
                {CHECKLIST_CATEGORY_LABELS[cat]}
              </span>
              <Badge
                variant={done === items.length ? "default" : "secondary"}
                className="px-1.5 py-0 text-[10px]"
              >
                {done}/{items.length}
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid gap-1 px-2.5 py-2 sm:grid-cols-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-xs transition-colors hover:bg-accent"
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                      className="h-3.5 w-3.5"
                    />
                    <span
                      className={
                        item.completed
                          ? "text-muted-foreground line-through"
                          : ""
                      }
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
