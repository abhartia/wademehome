"use client";

import { useChat } from "ai/react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { UIEventsTypesEnum } from "@/components/annotations/UIEventsTypes";
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

export type SearchStatsState = {
  returned_count: number;
  limit_cap: number | null;
  sort_note: string | null;
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
  searchStats: SearchStatsState;
  profileMemoryUpdate: ProfileMemoryUpdateState;
} {
  let properties: PropertyDataItem[] = [];
  let searchHint: SearchHintState = null;
  let searchSummary: SearchSummaryState = null;
  let searchStats: SearchStatsState = null;
  let profileMemoryUpdate: ProfileMemoryUpdateState = null;

  if (message.role && message.role !== "assistant") {
    return { properties, searchHint, searchSummary, searchStats, profileMemoryUpdate };
  }

  const annRaw = message.annotations;
  if (!Array.isArray(annRaw)) {
    return { properties, searchHint, searchSummary, searchStats, profileMemoryUpdate };
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
    if (ann.type === UIEventsTypesEnum.SEARCH_STATS && ann.data && typeof ann.data === "object") {
      const d = ann.data as {
        returned_count?: unknown;
        limit_cap?: unknown;
        sort_note?: unknown;
      };
      const returned =
        typeof d.returned_count === "number" && Number.isFinite(d.returned_count)
          ? Math.max(0, Math.floor(d.returned_count))
          : 0;
      const cap =
        typeof d.limit_cap === "number" && Number.isFinite(d.limit_cap)
          ? Math.max(0, Math.floor(d.limit_cap))
          : null;
      const note =
        typeof d.sort_note === "string" && d.sort_note.trim() ? d.sort_note.trim() : null;
      searchStats = { returned_count: returned, limit_cap: cap, sort_note: note };
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

  return { properties, searchHint, searchSummary, searchStats, profileMemoryUpdate };
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

/**
 * Streams POST /listings/chat via `useChat` (same protocol as the full search chat UI).
 * Persists message history for multi-turn search; use `resetSession` to clear.
 */
export function useListingSearchStream() {
  const [properties, setProperties] = useState<PropertyDataItem[]>([]);
  const [searchHint, setSearchHint] = useState<SearchHintState>(null);
  const [searchSummary, setSearchSummary] = useState<SearchSummaryState>(null);
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
    id: "landing-listing-search",
    onFinish: applyAnnotationsFromFinish,
  });

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
    setProperties([]);
    setSearchHint(null);
    setSearchSummary(null);
    setSearchStats(null);
    setProfileMemoryUpdate(null);
    setProfileMemoryUpdateVersion(0);
  }, []);

  const sendSearchTurn = useCallback(async ({ content }: SendSearchTurnArgs) => {
    const { append: ap, stop: s } = chatFnsRef.current;
    s();
    setProperties([]);
    setSearchHint(null);
    setSearchSummary(null);
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
