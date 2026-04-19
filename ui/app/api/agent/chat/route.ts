// Streaming-preserving proxy for /agent/chat. Next.js rewrites buffer SSE
// responses (the dev server collects the entire upstream body before
// flushing downstream), so the chat UI sees nothing until the agent finishes
// ~10s later. A Route Handler that pipes the upstream Response.body straight
// back keeps each SSE chunk landing in the browser within milliseconds.
//
// Note: the rest of the app uses the `/_api/*` rewrite prefix (those are
// regular non-streaming JSON requests where buffering is fine). The chat
// client is the only caller routed to `/api/agent/chat`.

import { NextRequest } from "next/server";

const API_TARGET =
  process.env.API_PROXY_TARGET ??
  process.env.NEXT_PUBLIC_API_PROXY_TARGET ??
  "http://localhost:8000";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// useChat reads `await response.text()` on non-2xx and uses it as the thrown
// Error.message, which the chat UI renders in a toast + inline bubble. Keep
// these strings user-facing — technical details (upstream status, stack, raw
// body) go to console.error server-side only, never to the browser.
const USER_UNREACHABLE =
  "The assistant is temporarily unavailable. Please try again in a moment.";
const USER_UPSTREAM_ERROR =
  "The assistant ran into a problem. Please try again.";

function errorResponse(status: number, userMessage: string): Response {
  return new Response(userMessage, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: NextRequest) {
  // Forward the active-group header so the backend can scope "save it" to the
  // group the user has selected in the sidebar (see agent/router.py).
  const activeGroup = req.headers.get("x-active-group-id");
  const forwardHeaders: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") ?? "application/json",
    cookie: req.headers.get("cookie") ?? "",
  };
  if (activeGroup) forwardHeaders["x-active-group-id"] = activeGroup;

  let upstream: Response;
  try {
    upstream = await fetch(`${API_TARGET}/agent/chat`, {
      method: "POST",
      headers: forwardHeaders,
      body: req.body,
      duplex: "half",
      cache: "no-store",
    } as RequestInit & { duplex: "half" });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("agent/chat proxy: upstream fetch failed", detail);
    return errorResponse(502, USER_UNREACHABLE);
  }

  if (!upstream.ok) {
    // Log the upstream body server-side for debugging, but never forward it
    // to the browser — it can contain stack traces, library errors, or other
    // dev-facing noise that non-technical users shouldn't see.
    const bodyText = await upstream.text().catch(() => "");
    const snippet = bodyText.trim().slice(0, 500) || upstream.statusText || "no body";
    console.error(
      "agent/chat proxy: upstream returned %s — %s",
      upstream.status,
      snippet,
    );
    return errorResponse(upstream.status, USER_UPSTREAM_ERROR);
  }

  const headers = new Headers();
  headers.set(
    "content-type",
    upstream.headers.get("content-type") ?? "text/event-stream",
  );
  headers.set("cache-control", "no-cache, no-transform");
  headers.set("connection", "keep-alive");
  headers.set("x-accel-buffering", "no");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
