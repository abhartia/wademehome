"use client";

import { useMutation } from "@tanstack/react-query";
import { useChat, type Message } from "ai/react";
import {
  ArrowUp,
  CalendarCheck,
  Heart,
  Loader2,
  Paperclip,
  Search,
  Sparkles,
  SquarePen,
  UserCircle,
  Users2,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/AuthProvider";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActiveGroupId } from "@/lib/groups/activeGroup";
import { cn } from "@/lib/utils";

import { AgentMessage } from "./AgentMessage";

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CHAT_API_URL ??
  "";

const SUGGESTIONS: { icon: React.ReactNode; label: string; prompt: string }[] = [
  {
    icon: <Search className="h-4 w-4" />,
    label: "Find apartments",
    prompt: "Find me 2-bedroom apartments under $4500 in Williamsburg",
  },
  {
    icon: <CalendarCheck className="h-4 w-4" />,
    label: "Show my tours",
    prompt: "What tours do I have coming up?",
  },
  {
    icon: <Heart className="h-4 w-4" />,
    label: "Saved listings",
    prompt: "Show my saved properties",
  },
  {
    icon: <UserCircle className="h-4 w-4" />,
    label: "Update preferences",
    prompt: "Update my budget to $4000 and add Brooklyn to my cities",
  },
  {
    icon: <Users2 className="h-4 w-4" />,
    label: "Find a roommate",
    prompt: "I want to find a roommate",
  },
];

function firstName(email: string | undefined | null) {
  if (!email) return null;
  const local = email.split("@")[0]?.trim();
  if (!local) return null;
  const word = local.split(/[._-]/)[0];
  if (!word) return null;
  return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
}

function makeChatFetch(activeGroupIdRef: { current: string | null }) {
  // Inject the currently-selected group id as a header on every chat POST so
  // the backend's saved_agent knows whether "save it" means personal or
  // group-shared. Header (not body) keeps the ChatRequest pydantic model
  // upstream in llama_index untouched. The value is read from a ref on every
  // call — useChat snapshots `fetch` at hook-init time, so a stable closure
  // reading live state (via ref) is the only way a sidebar switch mid-session
  // takes effect without re-mounting.
  return function chatFetch(input: RequestInfo | URL, init?: RequestInit) {
    const headers = new Headers(init?.headers);
    const gid = activeGroupIdRef.current;
    if (gid) headers.set("X-Active-Group-Id", gid);
    return fetch(input, { ...init, headers, credentials: "include" });
  };
}

interface AgentAttachment {
  kind: string;
  id: string;
  summary: string;
  filename?: string;
  premises_address?: string | null;
  signed_url?: string;
}

function attachmentTextPrefix(att: AgentAttachment): string {
  // Surface the attachment to the orchestrator inline. The system prompt
  // checks for `kind=lease` / `kind=photo` here to route appropriately.
  return `[attachment kind=${att.kind} id=${att.id}${
    att.filename ? ` filename=${JSON.stringify(att.filename)}` : ""
  } summary=${JSON.stringify(att.summary)}]\n\n`;
}

// sessionStorage-backed persistence. Survives route changes and tab
// backgrounding within a tab; does NOT survive tab close (that requires
// Phase-3 server-side persistence). Keyed per user so switching accounts
// doesn't leak history.
const SESSION_KEY_PREFIX = "wmh:agent-chat:";

function loadPersistedMessages(userId: string | undefined | null): Message[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY_PREFIX + userId);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Message[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persistMessages(userId: string | undefined | null, messages: Message[]) {
  if (typeof window === "undefined" || !userId) return;
  const key = SESSION_KEY_PREFIX + userId;
  try {
    if (messages.length === 0) {
      window.sessionStorage.removeItem(key);
    } else {
      window.sessionStorage.setItem(key, JSON.stringify(messages));
    }
  } catch {
    // Quota or disabled — ignore; persistence is best-effort.
  }
}

export function HomeAgentChat() {
  // Chat hits /api/agent/chat — a Next.js Route Handler that pipes the SSE
  // stream chunk-by-chunk. The /_api/* rewrite (used everywhere else) buffers
  // SSE bodies until the upstream closes, which is what made the chat feel
  // static even though the backend was streaming progress in real time.
  const chatUrl = `/api/agent/chat`;
  const uploadUrl = `${apiBase}/agent/upload`;
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const activeGroupId = useActiveGroupId();
  const [attachment, setAttachment] = useState<AgentAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Live ref so chatFetch always sees the current group, even after a
  // sidebar switch mid-conversation.
  const activeGroupIdRef = useRef<string | null>(activeGroupId);
  activeGroupIdRef.current = activeGroupId;
  const chatFetch = useMemo(
    () => makeChatFetch(activeGroupIdRef),
    [],
  );

  const uploadMutation = useMutation<AgentAttachment, Error, File>({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(uploadUrl, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      if (!res.ok) {
        const detail = await res
          .json()
          .then((j) => (j as { detail?: string }).detail)
          .catch(() => res.statusText);
        throw new Error(detail || `Upload failed (${res.status})`);
      }
      return (await res.json()) as AgentAttachment;
    },
    onSuccess: (att) => {
      setAttachment(att);
    },
    onError: (err) => {
      toast.error(err.message || "Upload failed");
    },
  });

  const handler = useChat({
    api: chatUrl,
    fetch: chatFetch,
    onError: (error) => {
      console.error("Agent chat error:", error);
      const detail = error?.message?.trim();
      toast.error(
        "Couldn't reach the assistant. Check your connection and try again.",
        {
          description: detail && detail.length < 200 ? detail : undefined,
          duration: Infinity,
          dismissible: true,
        },
      );
    },
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    stop,
    append,
    error,
  } = handler;

  const scrollRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const hydratedRef = useRef(false);

  // Hydrate from sessionStorage once the user id is known. useChat's
  // initialMessages only runs on the hook's first render (before user is
  // available), so we seed via setMessages after mount instead.
  useEffect(() => {
    if (hydratedRef.current) return;
    if (!user?.id) return;
    const saved = loadPersistedMessages(user.id);
    if (saved.length > 0) setMessages(saved);
    hydratedRef.current = true;
  }, [user?.id, setMessages]);

  // Persist on every message change (skip while still loading auth to avoid
  // clobbering saved state with an empty array before hydration runs).
  useEffect(() => {
    if (!user?.id || !hydratedRef.current) return;
    persistMessages(user.id, messages);
  }, [messages, user?.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  const isEmpty = messages.length === 0;
  const greetingName = firstName(user?.email);

  const profileChips = useMemo(() => {
    const parts: string[] = [];
    if (profile?.preferredCities?.length)
      parts.push(profile.preferredCities.slice(0, 2).join(", "));
    if (profile?.maxMonthlyRent) parts.push(profile.maxMonthlyRent);
    if (profile?.bedroomsNeeded) parts.push(profile.bedroomsNeeded);
    return parts;
  }, [profile]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  const submitWithPrompt = (prompt: string) => {
    if (isLoading) return;
    const text = attachment ? attachmentTextPrefix(attachment) + prompt : prompt;
    void append({ role: "user", content: text });
    if (attachment) setAttachment(null);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text && !attachment) return;
    const composed = attachment
      ? attachmentTextPrefix(attachment) +
        (text ||
          (attachment.kind === "lease"
            ? "I uploaded my lease — please load it."
            : "I uploaded an attachment."))
      : text;
    void append({ role: "user", content: composed });
    handleInputChange({
      target: { value: "" },
    } as ChangeEvent<HTMLTextAreaElement>);
    if (attachment) setAttachment(null);
  };

  const onPickFile = () => {
    if (uploadMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* soft ambient gradient — beautiful, performant (no blur on scroll content) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary/8 via-primary/[0.03] to-transparent"
      />

      <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <div className="inline-flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">Concierge</span>
          {profileChips.length > 0 ? (
            <span className="hidden items-center gap-1 sm:inline-flex">
              <span className="text-muted-foreground/60">·</span>
              {profileChips.map((p) => (
                <Badge
                  key={p}
                  variant="secondary"
                  className="text-[10px] font-normal"
                >
                  {p}
                </Badge>
              ))}
            </span>
          ) : null}
        </div>
        {!isEmpty ? (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1.5 text-muted-foreground"
            onClick={() => {
              stop();
              setMessages([]);
            }}
          >
            <SquarePen className="h-3.5 w-3.5" />
            New chat
          </Button>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto",
          isEmpty ? "flex items-center justify-center" : "",
        )}
      >
        {isEmpty ? (
          <EmptyState
            greetingName={greetingName}
            onPick={submitWithPrompt}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6">
            {messages.map((m, i) => (
              <AgentMessage
                key={m.id || i}
                message={m as Message}
                isLast={i === messages.length - 1}
                isLoading={isLoading}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" ? (
              <PendingAssistantBubble />
            ) : null}
            {!isLoading && error ? (
              <ChatErrorBubble
                error={error}
                onRetry={() => {
                  const last = messages[messages.length - 1];
                  if (last?.role !== "user") return;
                  setMessages(messages.slice(0, -1));
                  void append({ role: "user", content: last.content });
                }}
              />
            ) : null}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto w-full max-w-3xl px-3 py-3 sm:px-4">
          {attachment ? (
            <div className="mb-2 inline-flex max-w-full items-center gap-2 rounded-full border bg-muted/50 px-2.5 py-1 text-xs">
              <Paperclip className="h-3 w-3 shrink-0 text-primary" />
              <span className="truncate">
                <span className="font-medium uppercase tracking-wide">
                  {attachment.kind}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {attachment.filename || attachment.summary}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                aria-label="Remove attachment"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
          <form
            onSubmit={onSubmit}
            className={cn(
              "flex items-end gap-1 rounded-2xl border bg-card px-1.5 py-1.5 shadow-sm",
              "focus-within:ring-2 focus-within:ring-primary/40",
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={uploadMutation.isPending || isLoading}
              onClick={onPickFile}
              className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Attach a file"
              title="Attach lease PDF or image"
            >
              {uploadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
            </Button>
            <textarea
              ref={textRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={
                isEmpty
                  ? "Ask anything — find a place, schedule a tour, update preferences…"
                  : "Reply or ask the next thing…"
              }
              className={cn(
                "min-h-[32px] flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-[15px] leading-relaxed",
                "placeholder:text-muted-foreground/70 focus:outline-none",
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={(!input.trim() && !attachment) || isLoading}
              className="h-8 w-8 shrink-0 rounded-full"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
            Concierge may make mistakes. Confirm important details.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatErrorBubble({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  const detail = error?.message?.trim();
  return (
    <div className="flex w-full justify-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10">
        <Sparkles className="h-4 w-4 text-rose-600 dark:text-rose-400" />
      </div>
      <div className="flex max-w-[88%] min-w-0 flex-col gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
        <span className="font-medium">Couldn&apos;t reach the assistant.</span>
        {detail ? (
          <span className="break-words text-xs opacity-80">{detail}</span>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="w-fit gap-1.5 border-rose-500/40 text-rose-700 hover:bg-rose-500/10 dark:text-rose-300"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

function PendingAssistantBubble() {
  // Shown the moment the user submits, before useChat fabricates the assistant
  // message. Once the first SSE chunk arrives (the backend immediately emits a
  // "Routing your request" agent_step), the assistant message takes over and
  // AgentStepStrip surfaces real progress. This bubble only fills the
  // network-latency gap (~100ms locally, longer on flaky links).
  return (
    <div className="flex w-full justify-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 py-2 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          <span className="font-medium text-foreground">
            Connecting to the assistant…
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  greetingName,
  onPick,
}: {
  greetingName: string | null;
  onPick: (prompt: string) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pb-8 pt-4 text-center sm:pb-12">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {greetingName ? `Hi ${greetingName}, what's next?` : "What's next?"}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Search listings, schedule tours, update preferences — all in one place.
        Just ask.
      </p>

      <div className="mt-8 flex w-full flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onPick(s.prompt)}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm text-foreground/80 shadow-sm transition-all",
              "hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
            )}
          >
            <span className="text-muted-foreground transition-colors group-hover:text-primary">
              {s.icon}
            </span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
