"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { INSPECTION_CHECKLIST_ITEMS } from "@/lib/tours/checklists";
import { ChevronDown, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function InspectionChecklist() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const doneCount = checked.size;

  return (
    <div className="rounded-md border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 px-2.5 py-2 text-left text-xs font-medium"
      >
        <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
        <span>Inspection Checklist</span>
        {doneCount > 0 && (
          <span className="text-[10px] text-muted-foreground">
            {doneCount}/{INSPECTION_CHECKLIST_ITEMS.length}
          </span>
        )}
        <ChevronDown
          className={cn(
            "ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="grid gap-1.5 border-t px-2.5 py-2 sm:grid-cols-2">
          {INSPECTION_CHECKLIST_ITEMS.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-1.5 text-xs"
            >
              <Checkbox
                checked={checked.has(item)}
                onCheckedChange={() => toggle(item)}
                className="h-3.5 w-3.5"
              />
              <span
                className={cn(
                  checked.has(item) && "text-muted-foreground line-through",
                )}
              >
                {item}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
