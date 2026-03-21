"use client";

import { useChat } from "ai/react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { UIEventsTypesEnum } from "@/components/annotations/UIEventsTypes";

const CHAT_URL =
  (process.env.NEXT_PUBLIC_CHAT_API_URL ?? "") + "/listings/chat";

export type ListingSearchPhase = "idle" | "streaming" | "done" | "error";

export type SearchHintState = {
  suggest_account: boolean;
  reason?: string | null;
} | null;

type RunSearchArgs = {
  /** Full user message (query + optional geo context appended by caller). */
  composedMessage: string;
};

function parseAssistantAnnotations(message: {
  role?: string;
  annotations?: unknown;
}): { properties: PropertyDataItem[]; searchHint: SearchHintState } {
  let properties: PropertyDataItem[] = [];
  let searchHint: SearchHintState = null;

  if (message.role && message.role !== "assistant") {
    return { properties, searchHint };
  }

  const annRaw = message.annotations;
  if (!Array.isArray(annRaw)) {
    return { properties, searchHint };
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
  }

  return { properties, searchHint };
}

/**
 * Streams POST /listings/chat via `useChat` (same protocol as the full search chat UI).
 * Token text comes from the assistant message; listings + account hint from `onFinish` annotations.
 */
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

export function useListingSearchStream() {
  const [properties, setProperties] = useState<PropertyDataItem[]>([]);
  const [searchHint, setSearchHint] = useState<SearchHintState>(null);

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
    const normalized = normalizeFinishMessage(message) ?? (message as { role?: string; annotations?: unknown } | null);
    if (!normalized) return;
    const { properties: props, searchHint: hint } = parseAssistantAnnotations(normalized);
    setProperties(props);
    setSearchHint(hint);
  }, []);

  const { messages, append, setMessages, stop, status, error } = useChat({
    api: CHAT_URL,
    credentials: "include",
    headers,
    id: "landing-listing-search",
    onFinish: applyAnnotationsFromFinish,
  });

  // useChat may return new function identities each render; stable callbacks avoid
  // parent useEffects that list reset/runSearch in deps from looping infinitely.
  const chatFnsRef = useRef({ append, setMessages, stop });
  chatFnsRef.current = { append, setMessages, stop };

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

  const reset = useCallback(() => {
    const { stop: s, setMessages: sm } = chatFnsRef.current;
    s();
    sm([]);
    setProperties([]);
    setSearchHint(null);
  }, []);

  const runSearch = useCallback(async ({ composedMessage }: RunSearchArgs) => {
    const { append: ap, stop: s, setMessages: sm } = chatFnsRef.current;
    s();
    sm([]);
    setProperties([]);
    setSearchHint(null);
    await ap({ role: "user", content: composedMessage });
  }, []);

  return {
    phase,
    streamText,
    properties,
    searchHint,
    error: error ?? null,
    runSearch,
    reset,
    abort: stop,
  };
}
