"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
  label?: string;
}

export function StarRating({
  value,
  onChange,
  size = "md",
  label,
}: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="w-22 shrink-0 text-xs text-muted-foreground">
          {label}
        </span>
      )}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            disabled={!onChange}
            className={cn(
              "transition-colors",
              onChange
                ? "cursor-pointer hover:text-yellow-400"
                : "cursor-default",
            )}
          >
            <Star
              className={cn(
                iconSize,
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
