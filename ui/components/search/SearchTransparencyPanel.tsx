"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Criterion = {
  key: string;
  label: string;
  excluded_count: number;
  matched_count: number;
  eligible_without_this_rule: number;
};

export function SearchTransparencyPanel({
  criteria,
  finalMatched,
  stageStats,
}: {
  criteria: Criterion[];
  /** Rows matching every strict filter (before LIMIT). */
  finalMatched?: number | null;
  stageStats?: {
    semantic_candidates?: number | null;
    amenity_scored_count?: number | null;
    validated_kept_count?: number | null;
    validated_dropped_count?: number | null;
    validation_cache_hits?: number | null;
    validation_cache_misses?: number | null;
  } | null;
}) {
  if (!criteria || criteria.length === 0) return null;
  const globalMatch =
    typeof finalMatched === "number" && Number.isFinite(finalMatched)
      ? Math.max(0, Math.floor(finalMatched))
      : null;
  return (
    <div className="mt-2 rounded-md border border-border/60 bg-background/80 px-2.5 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Filter transparency
      </p>
      {globalMatch != null ? (
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">All filters:</span> {globalMatch} listing
          {globalMatch === 1 ? "" : "s"}
        </p>
      ) : null}
      {stageStats ? (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {typeof stageStats.semantic_candidates === "number" ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
              semantic {stageStats.semantic_candidates}
            </Badge>
          ) : null}
          {typeof stageStats.amenity_scored_count === "number" ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
              amenity scored {stageStats.amenity_scored_count}
            </Badge>
          ) : null}
          {typeof stageStats.validated_kept_count === "number" ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
              kept {stageStats.validated_kept_count}
            </Badge>
          ) : null}
          {typeof stageStats.validated_dropped_count === "number" ? (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal">
              dropped {stageStats.validated_dropped_count}
            </Badge>
          ) : null}
          {typeof stageStats.validation_cache_hits === "number" &&
          typeof stageStats.validation_cache_misses === "number" ? (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal">
              cache {stageStats.validation_cache_hits}/{stageStats.validation_cache_hits + stageStats.validation_cache_misses}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <div className="mt-2 space-y-2">
        {criteria.map((item) => {
          const pool = item.eligible_without_this_rule;
          const cut = item.excluded_count;
          const cutShare =
            pool > 0 ? Math.round(Math.min(100, Math.max(0, (cut / pool) * 100))) : 0;
          return (
            <div key={item.key} className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-xs text-foreground">{item.label}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
                    pool {pool}
                  </Badge>
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal">
                    cut {cut}
                  </Badge>
                </div>
              </div>
              <Progress value={pool > 0 ? cutShare : 0} className="h-1.5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
