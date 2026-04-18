"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, MapPin } from "lucide-react";

import type { LeaseSummaryAnnotation } from "../types";

interface Props {
  data: LeaseSummaryAnnotation["data"];
}

export function LeaseSummaryCard({ data }: Props) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <FileText className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
          <Link href="/lease">Open</Link>
        </Button>
      </div>
      {!data.has_document ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          No lease on file. Upload one from the chat (paperclip) or the lease page.
        </div>
      ) : (
        <div className="space-y-1.5 px-4 py-3 text-sm">
          {data.original_filename ? (
            <p className="truncate font-medium">{data.original_filename}</p>
          ) : null}
          {data.premises_address ? (
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{data.premises_address}</span>
            </p>
          ) : null}
          {data.char_count ? (
            <p className="text-[11px] text-muted-foreground">
              {data.char_count.toLocaleString()} characters extracted
            </p>
          ) : null}
        </div>
      )}
    </Card>
  );
}
