"use client";

import { useMemo } from "react";
import type { Message } from "ai/react";

import { BrandLogo } from "@/components/branding/BrandLogo";
import { cn } from "@/lib/utils";

import { AgentStepStrip } from "./AgentStepStrip";
import { BuildingProfileCard } from "./cards/BuildingProfileCard";
import { FavoritesResultsCard } from "./cards/FavoritesResultsCard";
import { GroupListCard } from "./cards/GroupListCard";
import { GuarantorSummaryCard } from "./cards/GuarantorSummaryCard";
import { LandlordProfileCard } from "./cards/LandlordProfileCard";
import { LeaseAnswerCard } from "./cards/LeaseAnswerCard";
import { LeaseSummaryCard } from "./cards/LeaseSummaryCard";
import { MoveInChecklistCard } from "./cards/MoveInChecklistCard";
import { MoveInOrdersCard } from "./cards/MoveInOrdersCard";
import { NavigationActionCard } from "./cards/NavigationActionCard";
import { ProfileSummaryCard } from "./cards/ProfileSummaryCard";
import { PropertyResultsCard } from "./cards/PropertyResultsCard";
import { RoommateConnectionsCard } from "./cards/RoommateConnectionsCard";
import { RoommateMatchesCard } from "./cards/RoommateMatchesCard";
import { ToursResultsCard } from "./cards/ToursResultsCard";
import {
  isAgentAnnotation,
  type AgentAnnotation,
  type AgentErrorAnnotation,
  type AgentStepAnnotation,
  type AgentToolCallAnnotation,
  type AgentToolResultAnnotation,
  type BuildingProfileAnnotation,
  type FavoritesResultsAnnotation,
  type GroupListAnnotation,
  type GuarantorSummaryAnnotation,
  type LandlordProfileAnnotation,
  type LeaseAnswerAnnotation,
  type LeaseSummaryAnnotation,
  type MoveInChecklistAnnotation,
  type MoveInOrdersAnnotation,
  type NavigationActionAnnotation,
  type ProfileSummaryAnnotation,
  type PropertyResultsAnnotation,
  type RoommateConnectionsAnnotation,
  type RoommateMatchesAnnotation,
  type ToursResultsAnnotation,
} from "./types";

interface Props {
  message: Message;
  isLast: boolean;
  isLoading: boolean;
}

interface Bucketed {
  steps: AgentStepAnnotation[];
  toolCalls: AgentToolCallAnnotation[];
  toolResults: AgentToolResultAnnotation[];
  errors: AgentErrorAnnotation[];
  cards: AgentAnnotation[];
}

function cardIdentity(card: AgentAnnotation): string | null {
  // The caller's stable identifier — the backend's own id for the entity the
  // card represents. `title` / `query` are intentionally NOT used here:
  // they're display strings ("Move-in checklist", "Building") that collide
  // across unrelated cards and should not drive dedup.
  const data = (card.data ?? {}) as Record<string, unknown>;
  const id =
    (data.id as string | undefined) ??
    (data.tool_id as string | undefined) ??
    (data.href as string | undefined);
  return id ?? null;
}

function bucket(annotations: unknown[] | undefined): Bucketed {
  const out: Bucketed = {
    steps: [],
    toolCalls: [],
    toolResults: [],
    errors: [],
    cards: [],
  };
  if (!annotations) return out;

  // Dedup card annotations by (type, stable-id), keeping the LAST emission.
  // Tools like `view_movein_plan` / `list_movein_tasks` / `add_movein_task`
  // all emit `movein_checklist` during one turn; streaming can also replay
  // the same building_profile as it's refined. We want the final payload to
  // win, not a pile of remounted cards.
  const cardSlots: (AgentAnnotation | null)[] = [];
  const slotByKey = new Map<string, number>();

  for (const a of annotations) {
    if (!isAgentAnnotation(a)) continue;
    switch (a.type) {
      case "agent_step":
        out.steps.push(a as AgentStepAnnotation);
        break;
      case "agent_tool_call":
        out.toolCalls.push(a as AgentToolCallAnnotation);
        break;
      case "agent_tool_result":
        out.toolResults.push(a as AgentToolResultAnnotation);
        break;
      case "agent_error":
        out.errors.push(a as AgentErrorAnnotation);
        break;
      case "property_results":
      case "property_listings":
      case "tours_results":
      case "favorites_results":
      case "profile_summary":
      case "navigation_action":
      case "roommate_matches":
      case "roommate_connections":
      case "group_list":
      case "lease_summary":
      case "lease_answer":
      case "movein_checklist":
      case "movein_orders":
      case "guarantor_summary":
      case "building_profile":
      case "landlord_profile": {
        const id = cardIdentity(a);
        const dedupKey = id ? `${a.type}:${id}` : null;
        if (dedupKey && slotByKey.has(dedupKey)) {
          cardSlots[slotByKey.get(dedupKey)!] = a;
        } else {
          const slot = cardSlots.length;
          cardSlots.push(a);
          if (dedupKey) slotByKey.set(dedupKey, slot);
        }
        break;
      }
      default:
        // Ignore search_plan / search_summary / search_hint / search_stats —
        // useful to UI later but noisy in chat.
        break;
    }
  }

  out.cards = cardSlots.filter((c): c is AgentAnnotation => c !== null);
  return out;
}

function cardKey(card: AgentAnnotation, idx: number): string {
  // Post-dedup, identical (type, id) can no longer repeat, so the id alone
  // is a unique, render-stable key. Cards without an id (e.g. a
  // profile_summary that carries only display fields) fall back to
  // `${type}-${idx}`, which is unique within the siblings produced by a
  // single map() call.
  const id = cardIdentity(card);
  return id ? `${card.type}-${id}` : `${card.type}-${idx}`;
}

function renderCard(card: AgentAnnotation, idx: number) {
  const key = cardKey(card, idx);
  switch (card.type) {
    case "property_results":
      return (
        <PropertyResultsCard
          key={key}
          data={(card as PropertyResultsAnnotation).data}
        />
      );
    case "property_listings": {
      // Reuse the search-style payload as a property results card.
      const data = (card.data ?? {}) as Record<string, unknown>;
      const properties = (data.properties ?? []) as PropertyResultsAnnotation["data"]["properties"];
      return (
        <PropertyResultsCard
          key={key}
          data={{ title: "Listings", query: null, properties }}
        />
      );
    }
    case "tours_results":
      return (
        <ToursResultsCard
          key={key}
          data={(card as ToursResultsAnnotation).data}
        />
      );
    case "favorites_results":
      return (
        <FavoritesResultsCard
          key={key}
          data={(card as FavoritesResultsAnnotation).data}
        />
      );
    case "profile_summary":
      return (
        <ProfileSummaryCard
          key={key}
          data={(card as ProfileSummaryAnnotation).data}
        />
      );
    case "navigation_action":
      return (
        <NavigationActionCard
          key={key}
          data={(card as NavigationActionAnnotation).data}
        />
      );
    case "roommate_matches":
      return (
        <RoommateMatchesCard
          key={key}
          data={(card as RoommateMatchesAnnotation).data}
        />
      );
    case "roommate_connections":
      return (
        <RoommateConnectionsCard
          key={key}
          data={(card as RoommateConnectionsAnnotation).data}
        />
      );
    case "group_list":
      return (
        <GroupListCard
          key={key}
          data={(card as GroupListAnnotation).data}
        />
      );
    case "lease_summary":
      return (
        <LeaseSummaryCard
          key={key}
          data={(card as LeaseSummaryAnnotation).data}
        />
      );
    case "lease_answer":
      return (
        <LeaseAnswerCard
          key={key}
          data={(card as LeaseAnswerAnnotation).data}
        />
      );
    case "movein_checklist":
      return (
        <MoveInChecklistCard
          key={key}
          data={(card as MoveInChecklistAnnotation).data}
        />
      );
    case "movein_orders":
      return (
        <MoveInOrdersCard
          key={key}
          data={(card as MoveInOrdersAnnotation).data}
        />
      );
    case "guarantor_summary":
      return (
        <GuarantorSummaryCard
          key={key}
          data={(card as GuarantorSummaryAnnotation).data}
        />
      );
    case "building_profile":
      return (
        <BuildingProfileCard
          key={key}
          data={(card as BuildingProfileAnnotation).data}
        />
      );
    case "landlord_profile":
      return (
        <LandlordProfileCard
          key={key}
          data={(card as LandlordProfileAnnotation).data}
        />
      );
    default:
      return null;
  }
}

export function AgentMessage({ message, isLast, isLoading }: Props) {
  const isUser = message.role === "user";
  const buckets = useMemo(
    () => bucket(message.annotations),
    [message.annotations],
  );

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
          <BrandLogo className="h-4 w-4 text-primary" title="Assistant" />
        </div>
      )}

      <div
        className={cn(
          "flex max-w-[88%] min-w-0 flex-col gap-2",
          isUser && "items-end",
        )}
      >
        {!isUser && (buckets.steps.length > 0 || buckets.toolCalls.length > 0) ? (
          <AgentStepStrip
            steps={buckets.steps}
            toolCalls={buckets.toolCalls}
            toolResults={buckets.toolResults}
          />
        ) : null}

        {message.content ? (
          <div
            className={cn(
              "whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
              isUser
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-foreground",
            )}
          >
            {message.content}
            {isLast && isLoading && !isUser ? (
              <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-foreground/60" />
            ) : null}
          </div>
        ) : !isUser && isLast && isLoading ? (
          <div className="inline-flex items-center gap-1.5 rounded-2xl bg-muted/50 px-4 py-2.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
          </div>
        ) : null}

        {!isUser && buckets.cards.length > 0 ? (
          <div className="flex w-full flex-col gap-2">
            {buckets.cards.map(renderCard)}
          </div>
        ) : null}

        {!isUser && buckets.errors.length > 0 ? (
          <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
            {buckets.errors[buckets.errors.length - 1].data.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
