"use client";

import { useChat } from "ai/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { UIEventsTypesEnum } from "@/components/annotations/UIEventsTypes";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import type { UserProfile } from "@/lib/types/userProfile";

const CHAT_URL =
  (process.env.NEXT_PUBLIC_CHAT_API_URL ?? "") + "/listings/chat";

export type ListingSearchPhase = "idle" | "streaming" | "done" | "error";

export type SearchHintState = {
  suggest_account: boolean;
  reason?: string | null;
} | null;

export type SearchSummaryState = {
  headline: string;
  bullets: string[];
} | null;

export type SearchPlanState = {
  summary_headline: string;
  summary_bullets: string[];
} | null;

export type SearchFilterBreakdownState = {
  criteria: Array<{
    key: string;
    label: string;
    excluded_count: number;
    matched_count: number;
    eligible_without_this_rule: number;
  }>;
} | null;

export type SearchStatsState = {
  returned_count: number;
  matched_count: number | null;
  limit_cap: number | null;
  sort_note: string | null;
  parse_ms: number | null;
  embed_ms: number | null;
  db_ms: number | null;
  breakdown_ms: number | null;
  amenity_ms: number | null;
  validation_ms: number | null;
  total_ms: number | null;
  semantic_candidates: number | null;
  amenity_scored_count: number | null;
  validated_kept_count: number | null;
  validated_dropped_count: number | null;
  validation_cache_hits: number | null;
  validation_cache_misses: number | null;
} | null;

type AllowedMemoryField =
  | "preferredCities"
  | "maxMonthlyRent"
  | "bedroomsNeeded"
  | "dealbreakers"
  | "neighbourhoodPriorities"
  | "moveTimeline";

export type ProfileMemoryPatch = Partial<
  Pick<
    UserProfile,
    | "preferredCities"
    | "maxMonthlyRent"
    | "bedroomsNeeded"
    | "dealbreakers"
    | "neighbourhoodPriorities"
    | "moveTimeline"
  >
>;

export type ProfileMemoryUpdateState = {
  patch: ProfileMemoryPatch;
  updated_fields: AllowedMemoryField[];
} | null;

type SendSearchTurnArgs = {
  /** Full user message (query + optional geo context appended by caller). */
  content: string;
};

function parseAssistantAnnotations(message: {
  role?: string;
  annotations?: unknown;
}): {
  properties: PropertyDataItem[];
  searchHint: SearchHintState;
  searchSummary: SearchSummaryState;
  searchPlan: SearchPlanState;
  searchFilterBreakdown: SearchFilterBreakdownState;
  searchStats: SearchStatsState;
  profileMemoryUpdate: ProfileMemoryUpdateState;
} {
  let properties: PropertyDataItem[] = [];
  let searchHint: SearchHintState = null;
  let searchSummary: SearchSummaryState = null;
  let searchPlan: SearchPlanState = null;
  let searchFilterBreakdown: SearchFilterBreakdownState = null;
  let searchStats: SearchStatsState = null;
  let profileMemoryUpdate: ProfileMemoryUpdateState = null;

  if (message.role && message.role !== "assistant") {
    return { properties, searchHint, searchSummary, searchPlan, searchFilterBreakdown, searchStats, profileMemoryUpdate };
  }

  const annRaw = message.annotations;
  if (!Array.isArray(annRaw)) {
    return { properties, searchHint, searchSummary, searchPlan, searchFilterBreakdown, searchStats, profileMemoryUpdate };
  }

  for (const raw of annRaw) {
    if (!raw || typeof raw !== "object") continue;
    const ann = raw as { type?: string; data?: unknown };
    if (ann.type === UIEventsTypesEnum.SEARCH_HINT && ann.data && typeof ann.data === "object") {
      const d = ann.data as { suggest_account?: boolean; reason?: string | null };
      searchHint = {
        suggest_account: Boolean(d.suggest_account),
        reason: d.reason ?? null,
      };
    }
    if (ann.type === UIEventsTypesEnum.PROPERTY_LISTINGS && ann.data && typeof ann.data === "object") {
      const d = ann.data as { properties?: PropertyDataItem[] };
      properties = d.properties ?? [];
    }
    if (ann.type === UIEventsTypesEnum.SEARCH_SUMMARY && ann.data && typeof ann.data === "object") {
      const d = ann.data as { headline?: string; bullets?: string[] };
      const headline = typeof d.headline === "string" ? d.headline.trim() : "";
      const bullets = Array.isArray(d.bullets)
        ? d.bullets.filter((b): b is string => typeof b === "string" && b.trim().length > 0)
        : [];
      if (headline || bullets.length > 0) {
        searchSummary = { headline: headline || "Your search", bullets };
      }
    }
    if (ann.type === UIEventsTypesEnum.SEARCH_PLAN && ann.data && typeof ann.data === "object") {
      const d = ann.data as { summary_headline?: unknown; summary_bullets?: unknown };
      const summary_headline =
        typeof d.summary_headline === "string" && d.summary_headline.trim()
          ? d.summary_headline.trim()
          : "Property search";
      const summary_bullets = Array.isArray(d.summary_bullets)
        ? d.summary_bullets.filter((b): b is string => typeof b === "string" && b.trim().length > 0)
        : [];
      searchPlan = { summary_headline, summary_bullets };
    }
    if (
      ann.type === UIEventsTypesEnum.SEARCH_FILTER_BREAKDOWN &&
      ann.data &&
      typeof ann.data === "object"
    ) {
      const d = ann.data as { criteria?: unknown };
      const criteria = Array.isArray(d.criteria)
        ? d.criteria
            .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
            .map((item) => {
              const key = typeof item.key === "string" ? item.key : "";
              const label = typeof item.label === "string" ? item.label : key;
              const excluded_count =
                typeof item.excluded_count === "number" && Number.isFinite(item.excluded_count)
                  ? Math.max(0, Math.floor(item.excluded_count))
                  : 0;
              const matched_count =
                typeof item.matched_count === "number" && Number.isFinite(item.matched_count)
                  ? Math.max(0, Math.floor(item.matched_count))
                  : 0;
              const eligible_without_this_rule =
                typeof item.eligible_without_this_rule === "number" &&
                Number.isFinite(item.eligible_without_this_rule)
                  ? Math.max(0, Math.floor(item.eligible_without_this_rule))
                  : 0;
              return {
                key,
                label,
                excluded_count,
                matched_count,
                eligible_without_this_rule,
              };
            })
            .filter((item) => item.key.length > 0)
        : [];
      searchFilterBreakdown = { criteria };
    }
    if (ann.type === UIEventsTypesEnum.SEARCH_STATS && ann.data && typeof ann.data === "object") {
      const d = ann.data as {
        returned_count?: unknown;
        matched_count?: unknown;
        limit_cap?: unknown;
        sort_note?: unknown;
        parse_ms?: unknown;
        embed_ms?: unknown;
        db_ms?: unknown;
        breakdown_ms?: unknown;
        amenity_ms?: unknown;
        validation_ms?: unknown;
        total_ms?: unknown;
        semantic_candidates?: unknown;
        amenity_scored_count?: unknown;
        validated_kept_count?: unknown;
        validated_dropped_count?: unknown;
        validation_cache_hits?: unknown;
        validation_cache_misses?: unknown;
      };
      const returned =
        typeof d.returned_count === "number" && Number.isFinite(d.returned_count)
          ? Math.max(0, Math.floor(d.returned_count))
          : 0;
      const matched =
        typeof d.matched_count === "number" && Number.isFinite(d.matched_count)
          ? Math.max(0, Math.floor(d.matched_count))
          : null;
      const cap =
        typeof d.limit_cap === "number" && Number.isFinite(d.limit_cap)
          ? Math.max(0, Math.floor(d.limit_cap))
          : null;
      const note =
        typeof d.sort_note === "string" && d.sort_note.trim() ? d.sort_note.trim() : null;
      const parseMs =
        typeof d.parse_ms === "number" && Number.isFinite(d.parse_ms)
          ? Math.max(0, Math.floor(d.parse_ms))
          : null;
      const embedMs =
        typeof d.embed_ms === "number" && Number.isFinite(d.embed_ms)
          ? Math.max(0, Math.floor(d.embed_ms))
          : null;
      const dbMs =
        typeof d.db_ms === "number" && Number.isFinite(d.db_ms)
          ? Math.max(0, Math.floor(d.db_ms))
          : null;
      const breakdownMs =
        typeof d.breakdown_ms === "number" && Number.isFinite(d.breakdown_ms)
          ? Math.max(0, Math.floor(d.breakdown_ms))
          : null;
      const totalMs =
        typeof d.total_ms === "number" && Number.isFinite(d.total_ms)
          ? Math.max(0, Math.floor(d.total_ms))
          : null;
      const amenityMs =
        typeof d.amenity_ms === "number" && Number.isFinite(d.amenity_ms)
          ? Math.max(0, Math.floor(d.amenity_ms))
          : null;
      const validationMs =
        typeof d.validation_ms === "number" && Number.isFinite(d.validation_ms)
          ? Math.max(0, Math.floor(d.validation_ms))
          : null;
      const semanticCandidates =
        typeof d.semantic_candidates === "number" && Number.isFinite(d.semantic_candidates)
          ? Math.max(0, Math.floor(d.semantic_candidates))
          : null;
      const amenityScoredCount =
        typeof d.amenity_scored_count === "number" && Number.isFinite(d.amenity_scored_count)
          ? Math.max(0, Math.floor(d.amenity_scored_count))
          : null;
      const validatedKept =
        typeof d.validated_kept_count === "number" && Number.isFinite(d.validated_kept_count)
          ? Math.max(0, Math.floor(d.validated_kept_count))
          : null;
      const validatedDropped =
        typeof d.validated_dropped_count === "number" && Number.isFinite(d.validated_dropped_count)
          ? Math.max(0, Math.floor(d.validated_dropped_count))
          : null;
      const validationCacheHits =
        typeof d.validation_cache_hits === "number" && Number.isFinite(d.validation_cache_hits)
          ? Math.max(0, Math.floor(d.validation_cache_hits))
          : null;
      const validationCacheMisses =
        typeof d.validation_cache_misses === "number" && Number.isFinite(d.validation_cache_misses)
          ? Math.max(0, Math.floor(d.validation_cache_misses))
          : null;
      searchStats = {
        returned_count: returned,
        matched_count: matched,
        limit_cap: cap,
        sort_note: note,
        parse_ms: parseMs,
        embed_ms: embedMs,
        db_ms: dbMs,
        breakdown_ms: breakdownMs,
        amenity_ms: amenityMs,
        validation_ms: validationMs,
        total_ms: totalMs,
        semantic_candidates: semanticCandidates,
        amenity_scored_count: amenityScoredCount,
        validated_kept_count: validatedKept,
        validated_dropped_count: validatedDropped,
        validation_cache_hits: validationCacheHits,
        validation_cache_misses: validationCacheMisses,
      };
    }
    if (
      ann.type === UIEventsTypesEnum.PROFILE_MEMORY_UPDATE &&
      ann.data &&
      typeof ann.data === "object"
    ) {
      const d = ann.data as { patch?: unknown; updated_fields?: unknown };
      const patch = sanitizeProfileMemoryPatch(d.patch);
      const updated = sanitizeUpdatedFields(d.updated_fields, patch);
      if (updated.length > 0) {
        profileMemoryUpdate = {
          patch,
          updated_fields: updated,
        };
      }
    }
  }

  return {
    properties,
    searchHint,
    searchSummary,
    searchPlan,
    searchFilterBreakdown,
    searchStats,
    profileMemoryUpdate,
  };
}

const ALLOWED_MEMORY_FIELDS: AllowedMemoryField[] = [
  "preferredCities",
  "maxMonthlyRent",
  "bedroomsNeeded",
  "dealbreakers",
  "neighbourhoodPriorities",
  "moveTimeline",
];

function isAllowedMemoryField(field: string): field is AllowedMemoryField {
  return (ALLOWED_MEMORY_FIELDS as string[]).includes(field);
}

function sanitizeStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function sanitizeProfileMemoryPatch(raw: unknown): ProfileMemoryPatch {
  if (!raw || typeof raw !== "object") return {};
  const patch: ProfileMemoryPatch = {};
  const source = raw as Record<string, unknown>;

  if (typeof source.moveTimeline === "string" && source.moveTimeline.trim()) {
    patch.moveTimeline = source.moveTimeline.trim();
  }
  if (typeof source.maxMonthlyRent === "string" && source.maxMonthlyRent.trim()) {
    patch.maxMonthlyRent = source.maxMonthlyRent.trim();
  }
  if (typeof source.bedroomsNeeded === "string" && source.bedroomsNeeded.trim()) {
    patch.bedroomsNeeded = source.bedroomsNeeded.trim();
  }
  const preferredCities = sanitizeStringArray(source.preferredCities);
  if (preferredCities.length > 0) {
    patch.preferredCities = preferredCities;
  }
  const dealbreakers = sanitizeStringArray(source.dealbreakers);
  if (dealbreakers.length > 0) {
    patch.dealbreakers = dealbreakers;
  }
  const neighbourhoodPriorities = sanitizeStringArray(source.neighbourhoodPriorities);
  if (neighbourhoodPriorities.length > 0) {
    patch.neighbourhoodPriorities = neighbourhoodPriorities;
  }

  return patch;
}

function sanitizeUpdatedFields(raw: unknown, patch: ProfileMemoryPatch): AllowedMemoryField[] {
  const validFromPatch = Object.keys(patch).filter((k): k is AllowedMemoryField =>
    isAllowedMemoryField(k),
  );
  if (!Array.isArray(raw)) return validFromPatch;
  const explicit = raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item): item is AllowedMemoryField => isAllowedMemoryField(item))
    .filter((item) => validFromPatch.includes(item));
  return explicit.length > 0 ? explicit : validFromPatch;
}

/** Compact fingerprint for streaming annotation sync — avoids `JSON.stringify` on large listing payloads every tick. */
function streamAnnotationsSignature(
  messagesLength: number,
  assistantContent: string,
  ann: unknown[],
): string {
  const parts: string[] = [String(messagesLength), String(assistantContent.length)];
  for (const raw of ann) {
    if (!raw || typeof raw !== "object") continue;
    const a = raw as { type?: string; data?: unknown };
    const t = a.type ?? "?";
    if (t === UIEventsTypesEnum.PROPERTY_LISTINGS) {
      const d = a.data as { properties?: PropertyDataItem[] } | undefined;
      const props = d?.properties;
      const n = Array.isArray(props) ? props.length : 0;
      const keys =
        Array.isArray(props) && props.length > 0
          ? props
              .slice(0, 24)
              .map((p) => buildPropertyKey(p))
              .join(",")
          : "";
      parts.push(`PL:${n}:${keys}`);
    } else {
      try {
        parts.push(`${t}:${JSON.stringify(a.data)}`);
      } catch {
        parts.push(`${t}:`);
      }
    }
  }
  return parts.join("\u001f");
}

function normalizeFinishMessage(message: unknown): {
  role?: string;
  annotations?: unknown;
} | null {
  if (!message || typeof message !== "object") return null;
  const m = message as Record<string, unknown>;
  if (m.role === "assistant") return m as { role?: string; annotations?: unknown };
  if ("message" in m && m.message && typeof m.message === "object") {
    return normalizeFinishMessage(m.message);
  }
  return null;
}

export type UseListingSearchStreamOptions = {
  /** Passed to `useChat` `id` — must differ per surface so local persistence does not collide. */
  id?: string;
};

/**
 * Streams POST /listings/chat via `useChat` (same protocol as the full search chat UI).
 * Persists message history for multi-turn search; use `resetSession` to clear.
 */
export function useListingSearchStream(options?: UseListingSearchStreamOptions) {
  const chatId = options?.id ?? "landing-listing-search";
  const [properties, setProperties] = useState<PropertyDataItem[]>([]);
  const [searchHint, setSearchHint] = useState<SearchHintState>(null);
  const [searchSummary, setSearchSummary] = useState<SearchSummaryState>(null);
  const [searchPlan, setSearchPlan] = useState<SearchPlanState>(null);
  const [searchFilterBreakdown, setSearchFilterBreakdown] = useState<SearchFilterBreakdownState>(null);
  const [searchStats, setSearchStats] = useState<SearchStatsState>(null);
  const [profileMemoryUpdate, setProfileMemoryUpdate] = useState<ProfileMemoryUpdateState>(null);
  const [profileMemoryUpdateVersion, setProfileMemoryUpdateVersion] = useState(0);

  const headers = useMemo(
    () =>
      ({
        ...(process.env.NEXT_PUBLIC_CHAT_API_TOKEN
          ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHAT_API_TOKEN}` }
          : {}),
      }) as Record<string, string>,
    [],
  );

  const applyAnnotationsFromFinish = useCallback((message: unknown) => {
    const normalized =
      normalizeFinishMessage(message) ?? (message as { role?: string; annotations?: unknown } | null);
    if (!normalized) return;
    const parsed = parseAssistantAnnotations(normalized);
    setProperties(parsed.properties);
    setSearchHint(parsed.searchHint);
    if (parsed.searchSummary !== null) {
      setSearchSummary(parsed.searchSummary);
    }
    if (parsed.searchPlan !== null) {
      setSearchPlan(parsed.searchPlan);
    }
    if (parsed.searchFilterBreakdown !== null) {
      setSearchFilterBreakdown(parsed.searchFilterBreakdown);
    }
    if (parsed.searchStats !== null) {
      setSearchStats(parsed.searchStats);
    }
    if (parsed.profileMemoryUpdate !== null) {
      setProfileMemoryUpdate(parsed.profileMemoryUpdate);
      setProfileMemoryUpdateVersion((v) => v + 1);
    }
  }, []);

  const { messages, append, setMessages, stop, status, error } = useChat({
    api: CHAT_URL,
    credentials: "include",
    headers,
    id: chatId,
    onFinish: applyAnnotationsFromFinish,
    /** Coalesces SWR `mutate` during streaming — unthrottled updates + map/list re-renders can exceed React's max update depth. */
    experimental_throttle: 50,
  });

  /** Avoids redundant setState (and update-depth issues) when `messages` gets a new array ref but content is unchanged. */
  const streamAnnotationsSigRef = useRef<string>("");
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const annotationRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (annotationRafRef.current != null) {
      cancelAnimationFrame(annotationRafRef.current);
    }
    annotationRafRef.current = requestAnimationFrame(() => {
      annotationRafRef.current = null;
      const msgs = messagesRef.current;
      const tail = msgs[msgs.length - 1];
      // Only sync from the in-flight / latest assistant reply, never from a prior assistant after a new user message.
      if (!tail || tail.role !== "assistant") return;
      const ann = (tail as { annotations?: unknown }).annotations;
      if (!Array.isArray(ann) || ann.length === 0) return;
      const hasListingsAnnotation = ann.some(
        (a) =>
          a &&
          typeof a === "object" &&
          (a as { type?: string }).type === UIEventsTypesEnum.PROPERTY_LISTINGS,
      );
      const content =
        typeof (tail as { content?: unknown }).content === "string"
          ? (tail as { content: string }).content
          : "";
      const sig = streamAnnotationsSignature(msgs.length, content, ann);
      if (streamAnnotationsSigRef.current === sig) return;
      streamAnnotationsSigRef.current = sig;

      const parsed = parseAssistantAnnotations(
        tail as { role?: string; annotations?: unknown },
      );
      if (hasListingsAnnotation) {
        setProperties(parsed.properties);
      }
      setSearchHint(parsed.searchHint);
      if (parsed.searchSummary !== null) {
        setSearchSummary(parsed.searchSummary);
      }
      if (parsed.searchPlan !== null) {
        setSearchPlan(parsed.searchPlan);
      }
      if (parsed.searchFilterBreakdown !== null) {
        setSearchFilterBreakdown(parsed.searchFilterBreakdown);
      }
      if (parsed.searchStats !== null) {
        setSearchStats(parsed.searchStats);
      }
    });
    return () => {
      if (annotationRafRef.current != null) {
        cancelAnimationFrame(annotationRafRef.current);
        annotationRafRef.current = null;
      }
    };
  }, [messages]);

  const chatFnsRef = useRef({ append, setMessages, stop });
  chatFnsRef.current = { append, setMessages, stop };

  const warmSession = useMemo(
    () => messages.some((m) => m.role === "assistant"),
    [messages],
  );

  const streamText = useMemo(() => {
    const assistants = messages.filter((m) => m.role === "assistant");
    const assistant =
      assistants.length > 0 ? assistants[assistants.length - 1] : undefined;
    return assistant?.content ?? "";
  }, [messages]);

  const phase = useMemo((): ListingSearchPhase => {
    if (error) return "error";
    if (status === "submitted" || status === "streaming") return "streaming";
    if (status === "ready") {
      if (messages.some((m) => m.role === "assistant")) return "done";
      return "idle";
    }
    return "idle";
  }, [status, messages, error]);

  const resetSession = useCallback(() => {
    const { stop: s, setMessages: sm } = chatFnsRef.current;
    s();
    sm([]);
    streamAnnotationsSigRef.current = "";
    setProperties([]);
    setSearchHint(null);
    setSearchSummary(null);
    setSearchPlan(null);
    setSearchFilterBreakdown(null);
    setSearchStats(null);
    setProfileMemoryUpdate(null);
    setProfileMemoryUpdateVersion(0);
  }, []);

  const sendSearchTurn = useCallback(async ({ content }: SendSearchTurnArgs) => {
    const { append: ap, stop: s } = chatFnsRef.current;
    s();
    streamAnnotationsSigRef.current = "";
    setProperties([]);
    setSearchHint(null);
    setSearchSummary(null);
    setSearchPlan(null);
    setSearchFilterBreakdown(null);
    setSearchStats(null);
    setProfileMemoryUpdate(null);
    await ap({ role: "user", content });
  }, []);

  return {
    messages,
    warmSession,
    phase,
    streamText,
    properties,
    searchHint,
    searchSummary,
    searchPlan,
    searchFilterBreakdown,
    searchStats,
    profileMemoryUpdate,
    profileMemoryUpdateVersion,
    error: error ?? null,
    sendSearchTurn,
    resetSession,
    abort: stop,
  };
}

export type ListingSearchStreamApi = ReturnType<typeof useListingSearchStream>;
