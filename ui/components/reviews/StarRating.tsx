"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const SIZE_CLASSES: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

export function StarRating({
  value,
  max = 5,
  onChange,
  size = "md",
  label,
}: StarRatingProps) {
  const interactive = Boolean(onChange);
  return (
    <div
      role={interactive ? "radiogroup" : undefined}
      aria-label={label}
      className="inline-flex items-center gap-0.5"
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            aria-label={`${n} of ${max}`}
            className={cn(
              "rounded transition-colors",
              interactive && "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                SIZE_CLASSES[size],
                filled ? "fill-amber-500 text-amber-500" : "fill-transparent text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
