"use client";

import { useEffect, useRef } from "react";
import { ChatInput, ChatSection as ChatSectionUI } from "@llamaindex/chat-ui";
import { useChat } from "ai/react";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";

import CustomChatMessages from "@/components/CustomMessages";
import { QuestionSuggestions } from "@/components/QuestionSuggestions";
import { Button } from "@/components/ui/button";

import "@llamaindex/chat-ui/styles/editor.css";
import "@llamaindex/chat-ui/styles/markdown.css";
import "@llamaindex/chat-ui/styles/pdf.css";

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CHAT_API_URL ??
  "";

const LEASE_SUGGESTIONS = [
  "When is rent due?",
  "What's the pet policy?",
  "How do I give notice to move out?",
  "Who pays for utilities?",
];

function leaseChatFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: "include",
  });
}

export function LeaseAssistantChat({ disabled }: { disabled: boolean }) {
  const apiToken = process.env.NEXT_PUBLIC_CHAT_API_TOKEN;
  const chatUrl = `${apiBase}/portal/lease/chat`;

  const handler = useChat({
    api: chatUrl,
    headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined,
    fetch: leaseChatFetch,
    onError: (error) => {
      console.error("Lease chat error:", error);
      toast.error(
        "Could not reach the lease assistant. Check your connection and try again.",
        { duration: Infinity, dismissible: true },
      );
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages } = handler;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  return (
    <div className="flex min-h-[min(28rem,50vh)] flex-1 flex-col rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Answers use your uploaded lease only — not legal advice.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={disabled}
          onClick={() => {
            handler.stop();
            handler.setMessages([]);
          }}
        >
          <SquarePen className="h-3.5 w-3.5" />
          New chat
        </Button>
      </div>
      <ChatSectionUI handler={handler} className="flex min-h-0 flex-1 flex-col p-0">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <CustomChatMessages />
          </div>
          <div className="shrink-0 border-t px-2 pb-2 pt-1">
            <fieldset disabled={disabled} className="min-w-0 border-0 p-0">
              <ChatInput className="pb-1">
                <ChatInput.Form>
                  <ChatInput.Field
                    placeholder={
                      disabled
                        ? "Upload your lease PDF above to start"
                        : "Ask a question about your lease…"
                    }
                  />
                  <ChatInput.Submit />
                </ChatInput.Form>
              </ChatInput>
            </fieldset>
            <p className="px-3 text-xs text-muted-foreground">
              Wade Me Home may make mistakes. Verify important details against your lease.
            </p>
            <QuestionSuggestions suggestions={LEASE_SUGGESTIONS} />
          </div>
        </div>
      </ChatSectionUI>
    </div>
  );
}
