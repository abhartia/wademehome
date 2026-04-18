"use client";

import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

import type { LeaseAnswerAnnotation } from "../types";

interface Props {
  data: LeaseAnswerAnnotation["data"];
}

export function LeaseAnswerCard({ data }: Props) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
        <Quote className="h-4 w-4 text-primary" />
        <p className="flex-1 truncate text-sm font-medium">{data.title}</p>
      </div>
      <div className="space-y-2 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {data.question}
        </p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{data.answer}</p>
      </div>
    </Card>
  );
}
