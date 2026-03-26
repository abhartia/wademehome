"use client";

import { useEffect, useRef, type MutableRefObject, type ReactNode } from "react";
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
  /** `useChat` id; must be unique per route/surface (local storage keyed by id). */
  chatId?: string;
  /**
   * Holds the latest `fireVersion` already submitted to the stream. Lives on the parent so
   * React Strict Mode remounts of this runtime do not re-fire the same version (each send
   * calls `stop()` and would abort the in-flight request).
   */
  fireAcknowledgedVersionRef?: MutableRefObject<number>;
  children: (api: ListingSearchStreamApi) => ReactNode;
};

/**
 * Mount only after the user starts a search so `useChat` / `/listings/chat` never runs on idle home load.
 */
export function GuestHomeListingChatRuntime({
  fireVersion,
  getMessage,
  onPhaseChange,
  chatId,
  fireAcknowledgedVersionRef,
  children,
}: GuestHomeListingChatRuntimeProps) {
  const api = useListingSearchStream(chatId ? { id: chatId } : undefined);
  const lastFiredVersion = useRef(0);
  const getMessageRef = useRef(getMessage);
  getMessageRef.current = getMessage;
  const sendSearchTurnRef = useRef(api.sendSearchTurn);
  sendSearchTurnRef.current = api.sendSearchTurn;
  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;

  useEffect(() => {
    onPhaseChangeRef.current?.(api.phase);
  }, [api.phase]);

  useEffect(() => {
    // fireAcknowledgedVersionRef is optional and stable from the parent; omitting from deps avoids
    // spurious reruns — only fireVersion should trigger a new submit attempt.
    const ackRef = fireAcknowledgedVersionRef;
    if (fireVersion <= 0) {
      lastFiredVersion.current = 0;
      return;
    }
    if (ackRef) {
      if (ackRef.current >= fireVersion) return;
    } else if (lastFiredVersion.current === fireVersion) {
      return;
    }
    const msg = getMessageRef.current().trim();
    if (msg.length < MIN_QUERY_CHARS) return;
    if (ackRef) {
      ackRef.current = fireVersion;
    } else {
      lastFiredVersion.current = fireVersion;
    }
    void sendSearchTurnRef.current({ content: msg });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fireAcknowledgedVersionRef is a stable optional ref from parent
  }, [fireVersion]);

  return <>{children(api)}</>;
}
