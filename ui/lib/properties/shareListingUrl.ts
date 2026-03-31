"use client";

import { toast } from "sonner";

export async function shareListingUrl(options: { url: string; title?: string }): Promise<void> {
  const { url, title } = options;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: title ?? "Listing", url });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    toast.success("Copied link");
  } catch {
    toast.error("Could not copy — copy the address from your browser’s bar.");
  }
}
