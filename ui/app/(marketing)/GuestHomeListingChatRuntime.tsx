"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  type ListingSearchPhase,
  type ListingSearchStreamApi,
  useListingSearchStream,
} from "@/lib/listings/useListingSearchStream";

const MIN_QUERY_CHARS = 2;

export type GuestHomeListingChatRuntimeProps = {
  /** Increment each time the user submits a search (including follow-ups). */
  fireVersion: number;
  /** Latest composed user message; read only when fireVersion advances. */
  getMessage: () => string;
  onPhaseChange?: (phase: ListingSearchPhase) => void;
  children: (api: ListingSearchStreamApi) => ReactNode;
};

/**
 * Mount only after the user starts a search so `useChat` / `/listings/chat` never runs on idle home load.
 */
export function GuestHomeListingChatRuntime({
  fireVersion,
  getMessage,
  onPhaseChange,
  children,
}: GuestHomeListingChatRuntimeProps) {
  const api = useListingSearchStream();
  const lastFiredVersion = useRef(0);
  const getMessageRef = useRef(getMessage);
  getMessageRef.current = getMessage;
  const sendSearchTurnRef = useRef(api.sendSearchTurn);
  sendSearchTurnRef.current = api.sendSearchTurn;

  useEffect(() => {
    onPhaseChange?.(api.phase);
  }, [api.phase, onPhaseChange]);

  useEffect(() => {
    if (fireVersion <= 0) {
      lastFiredVersion.current = 0;
      return;
    }
    if (lastFiredVersion.current === fireVersion) return;
    const msg = getMessageRef.current().trim();
    if (msg.length < MIN_QUERY_CHARS) return;
    lastFiredVersion.current = fireVersion;
    void sendSearchTurnRef.current({ content: msg });
  }, [fireVersion]);

  return <>{children(api)}</>;
}
