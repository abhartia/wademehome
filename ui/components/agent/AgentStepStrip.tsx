"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  XCircle,
} from "lucide-react";

import type {
  AgentStepAnnotation,
  AgentToolCallAnnotation,
  AgentToolResultAnnotation,
} from "./types";

interface StepLine {
  key: string;
  agent: string;
  label: string;
  state: "running" | "done" | "error";
  detail?: string | null;
}

function stepsFromAnnotations(
  steps: AgentStepAnnotation[],
  toolCalls: AgentToolCallAnnotation[],
  toolResults: AgentToolResultAnnotation[],
): StepLine[] {
  const out: StepLine[] = [];
  steps.forEach((s, i) => {
    const state = (s.data.state === "start" || s.data.state == null
      ? "running"
      : s.data.state) as StepLine["state"];
    out.push({
      key: `s-${i}`,
      agent: s.data.agent,
      label: s.data.label,
      state,
      detail: s.data.detail,
    });
  });

  // Resolve tool call → result pairs. A successful result flips the
  // matching call from running → done.
  const resultsByCall = new Map<string, AgentToolResultAnnotation>();
  toolResults.forEach((r) => resultsByCall.set(r.data.tool_id, r));
  toolCalls.forEach((c, i) => {
    const r = resultsByCall.get(c.data.tool_id);
    out.push({
      key: `t-${i}`,
      agent: "tool",
      label: prettyToolName(c.data.tool_name),
      state: r ? (r.data.ok ? "done" : "error") : "running",
      detail: r?.data.summary,
    });
  });

  // Cascade terminal states backwards within each agent: when a step
  // transitions running → done|error for agent X, every earlier step
  // from X that is still "running" is implicitly finished. Without this,
  // the tool emits a sequence like ["Planning…" running, "Searching…"
  // running, "Found N" done] — the first two stay stuck on running
  // forever and the outer Loader2 spins after the reply has rendered.
  // Tool rows are handled separately above (result pairing), so we only
  // cascade across "step" rows, keyed by their agent name.
  const latestTerminalByAgent = new Map<string, number>();
  out.forEach((item, idx) => {
    if (item.agent === "tool") return;
    if (item.state === "done" || item.state === "error") {
      latestTerminalByAgent.set(item.agent, idx);
    }
  });
  out.forEach((item, idx) => {
    if (item.agent === "tool") return;
    if (item.state !== "running") return;
    const terminalIdx = latestTerminalByAgent.get(item.agent);
    if (terminalIdx !== undefined && terminalIdx > idx) {
      item.state = "done";
    }
  });
  return out;
}

function prettyToolName(name: string) {
  return name.replace(/_/g, " ");
}

interface Props {
  steps: AgentStepAnnotation[];
  toolCalls: AgentToolCallAnnotation[];
  toolResults: AgentToolResultAnnotation[];
}

export function AgentStepStrip({ steps, toolCalls, toolResults }: Props) {
  const [open, setOpen] = useState(false);
  const items = useMemo(
    () => stepsFromAnnotations(steps, toolCalls, toolResults),
    [steps, toolCalls, toolResults],
  );
  if (items.length === 0) return null;

  const isRunning = items.some((i) => i.state === "running");
  const headline = items[items.length - 1];

  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 py-2 text-xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-left text-muted-foreground transition-colors hover:text-foreground"
      >
        {isRunning ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        )}
        <span className="flex-1 truncate">
          <span className="font-medium text-foreground">
            {headline.agent === "tool"
              ? `Used ${headline.label}`
              : `${capitalize(headline.agent)}: ${headline.label}`}
          </span>
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>
      {open ? (
        <ul className="mt-2 space-y-1.5 border-t border-border/40 pt-2">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex items-start gap-2 text-muted-foreground"
            >
              <StateGlyph state={item.state} />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate",
                    item.state === "done" && "text-foreground",
                  )}
                >
                  <span className="font-medium">
                    {item.agent === "tool"
                      ? `tool · ${item.label}`
                      : `${item.agent} · ${item.label}`}
                  </span>
                </p>
                {item.detail ? (
                  <p className="line-clamp-2 text-[11px] opacity-75">
                    {item.detail}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function StateGlyph({ state }: { state: StepLine["state"] }) {
  if (state === "running")
    return <Loader2 className="mt-0.5 h-3 w-3 shrink-0 animate-spin text-primary" />;
  if (state === "error")
    return <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />;
  return <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />;
}

function capitalize(s: string) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}
