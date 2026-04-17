"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  RotateCw,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DedupeMatch,
  usePasteAndCreate,
} from "@/lib/userListings/useUserListings";
import { useActiveGroupId } from "@/lib/groups/activeGroup";
import { useMyGroups } from "@/lib/groups/api";

type ItemStatus = "processing" | "saved" | "dedupe" | "error";

interface QueueItem {
  id: string;
  text: string;
  preview: string;
  status: ItemStatus;
  savedName?: string;
  errorMessage?: string;
  dedupeMatches?: DedupeMatch[];
}

function previewLine(text: string): string {
  const firstLine = text.trim().split("\n")[0] ?? "";
  return firstLine.length > 80 ? firstLine.slice(0, 77) + "…" : firstLine;
}

export function AddPropertyModal() {
  const [open, setOpen] = useState(false);
  const [pasted, setPasted] = useState("");
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pasteMut = usePasteAndCreate();
  const activeGroupId = useActiveGroupId();
  const groupsQuery = useMyGroups();
  const activeGroupName =
    activeGroupId && groupsQuery.data?.groups
      ? (groupsQuery.data.groups.find((g) => g.id === activeGroupId)?.name ??
        null)
      : null;

  const reset = useCallback(() => {
    setPasted("");
    setQueue([]);
    pasteMut.reset();
  }, [pasteMut]);

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    setOpen(next);
  };

  useEffect(() => {
    if (open) {
      window.setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [open]);

  const submit = useCallback(
    async (text: string, force = false, reuseId?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const id =
        reuseId ??
        (typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `q-${Date.now()}-${Math.random()}`);

      setQueue((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) =>
            i.id === id
              ? { ...i, status: "processing", errorMessage: undefined }
              : i,
          );
        }
        return [
          {
            id,
            text: trimmed,
            preview: previewLine(trimmed),
            status: "processing",
          },
          ...prev,
        ];
      });

      try {
        const res = await pasteMut.mutateAsync({
          text: trimmed,
          force,
          groupId: activeGroupId,
        });
        setQueue((prev) =>
          prev.map((i) => {
            if (i.id !== id) return i;
            if (res.listing) {
              return {
                ...i,
                status: "saved",
                savedName: res.listing.name,
              };
            }
            if (res.dedupe_matches.length > 0) {
              return {
                ...i,
                status: "dedupe",
                dedupeMatches: res.dedupe_matches,
              };
            }
            if (res.parse_error) {
              return {
                ...i,
                status: "error",
                errorMessage: res.parse_error,
              };
            }
            return { ...i, status: "error", errorMessage: "Unknown response." };
          }),
        );
      } catch (err) {
        setQueue((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "error",
                  errorMessage:
                    err instanceof Error ? err.message : "Request failed.",
                }
              : i,
          ),
        );
      }
    },
    [pasteMut, activeGroupId],
  );

  const handlePasteEvent = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text || !text.trim()) return;
    e.preventDefault();
    setPasted("");
    void submit(text);
  };

  const handleSubmitButton = () => {
    const text = pasted;
    setPasted("");
    void submit(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitButton();
    }
  };

  const dismiss = (id: string) =>
    setQueue((prev) => prev.filter((i) => i.id !== id));

  const processingCount = queue.filter((i) => i.status === "processing").length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-3.5 w-3.5" />
        Add a property
      </Button>

      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add properties</DialogTitle>
          <DialogDescription>
            Paste a Zillow / StreetEasy / Apartments.com share message — or just
            a URL. Each paste queues and processes on its own; you can paste the
            next one right away.
            {activeGroupName ? (
              <>
                {" "}
                Saving to{" "}
                <strong className="font-medium text-foreground">
                  {activeGroupName}
                </strong>
                .
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Textarea
            ref={textareaRef}
            rows={3}
            placeholder={`269 Terrace Ave #B, Jersey City, NJ 07307 | Zillow https://share.google/…\n— or any listing URL`}
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            onPaste={handlePasteEvent}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">
              {processingCount > 0
                ? `${processingCount} processing in background…`
                : "Paste anywhere in this box to queue."}
            </p>
            <Button
              size="sm"
              onClick={handleSubmitButton}
              disabled={!pasted.trim()}
            >
              Queue
            </Button>
          </div>
        </div>

        {queue.length > 0 && (
          <ul className="space-y-1.5 pt-2">
            {queue.map((item) => (
              <QueueRow
                key={item.id}
                item={item}
                onRetry={(force) => void submit(item.text, force, item.id)}
                onDismiss={() => dismiss(item.id)}
              />
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

function QueueRow({
  item,
  onRetry,
  onDismiss,
}: {
  item: QueueItem;
  onRetry: (force: boolean) => void;
  onDismiss: () => void;
}) {
  return (
    <li className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
      <div className="flex items-start gap-2">
        <StatusIcon status={item.status} />
        <div className="flex-1 space-y-1">
          <div className="truncate font-medium">
            {item.status === "saved" && item.savedName
              ? item.savedName
              : item.preview}
          </div>

          {item.status === "processing" && (
            <div className="text-[10px] text-muted-foreground">
              Parsing, geocoding, saving…
            </div>
          )}

          {item.status === "saved" && (
            <div className="text-[10px] text-muted-foreground">
              Added to your Saved list.
            </div>
          )}

          {item.status === "error" && (
            <div className="space-y-1">
              <p className="text-[11px] text-destructive">
                {item.errorMessage ?? "Something went wrong."}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="h-6 gap-1 text-[10px]"
                onClick={() => onRetry(false)}
              >
                <RotateCw className="h-2.5 w-2.5" />
                Retry
              </Button>
            </div>
          )}

          {item.status === "dedupe" && item.dedupeMatches && (
            <div className="space-y-1">
              <p className="text-[11px] text-amber-800">
                Might already exist — matched{" "}
                <strong>{item.dedupeMatches[0].name}</strong>.
              </p>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  className="h-6 gap-1 text-[10px]"
                  onClick={() => onRetry(true)}
                >
                  Save anyway
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px]"
                  onClick={onDismiss}
                >
                  Skip
                </Button>
              </div>
            </div>
          )}
        </div>

        {item.status !== "processing" && (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </li>
  );
}

function StatusIcon({ status }: { status: ItemStatus }) {
  if (status === "processing")
    return <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" />;
  if (status === "saved")
    return <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />;
  if (status === "dedupe")
    return <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />;
  return <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />;
}
