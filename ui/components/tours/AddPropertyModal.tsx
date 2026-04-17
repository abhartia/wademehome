"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  RotateCw,
  ExternalLink,
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
import {
  usePropertyFavorites,
  useToggleFavorite,
} from "@/lib/properties/api";

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
  const toggleFavoriteMut = useToggleFavorite({ groupId: activeGroupId });
  const favoritesQuery = usePropertyFavorites({
    groupId: activeGroupId,
    enabled: open,
  });
  // Memoize so the "Use existing" callback's identity stays stable across
  // unrelated renders — eslint's exhaustive-deps also flags a fresh Set each
  // render as a changing dep.
  const favoritedKeys = useMemo(
    () =>
      new Set(
        (favoritesQuery.data?.favorites ?? []).map((f) => f.property_key),
      ),
    [favoritesQuery.data?.favorites],
  );
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

  // "Use existing" path: favorite the matched property (under the active group)
  // instead of creating a new user-added listing. If it's already in the user's
  // saved list, skip the toggle — otherwise useToggleFavorite would flip it off.
  const adoptExisting = useCallback(
    async (itemId: string, match: DedupeMatch) => {
      if (favoritedKeys.has(match.property_key)) {
        setQueue((prev) =>
          prev.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  status: "saved",
                  savedName: match.name || match.address,
                }
              : i,
          ),
        );
        return;
      }
      setQueue((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, status: "processing" } : i,
        ),
      );
      try {
        await toggleFavoriteMut.mutateAsync({
          propertyKey: match.property_key,
          propertyName: match.name,
          propertyAddress: match.address,
        });
        setQueue((prev) =>
          prev.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  status: "saved",
                  savedName: match.name || match.address,
                }
              : i,
          ),
        );
      } catch (err) {
        setQueue((prev) =>
          prev.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  status: "error",
                  errorMessage:
                    err instanceof Error
                      ? err.message
                      : "Could not favorite match.",
                }
              : i,
          ),
        );
      }
    },
    [toggleFavoriteMut, favoritedKeys],
  );

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
                onUseExisting={(match) => void adoptExisting(item.id, match)}
                favoritedKeys={favoritedKeys}
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
  onUseExisting,
  favoritedKeys,
}: {
  item: QueueItem;
  onRetry: (force: boolean) => void;
  onDismiss: () => void;
  onUseExisting: (match: DedupeMatch) => void;
  favoritedKeys: Set<string>;
}) {
  return (
    <li className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
      <div className="flex items-start gap-2">
        <StatusIcon status={item.status} />
        <div className="min-w-0 flex-1 space-y-1">
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
            <DedupeDetails
              matches={item.dedupeMatches}
              onUseExisting={onUseExisting}
              onSaveAnyway={() => onRetry(true)}
              onSkip={onDismiss}
              favoritedKeys={favoritedKeys}
            />
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

function DedupeDetails({
  matches,
  onUseExisting,
  onSaveAnyway,
  onSkip,
  favoritedKeys,
}: {
  matches: DedupeMatch[];
  onUseExisting: (match: DedupeMatch) => void;
  onSaveAnyway: () => void;
  onSkip: () => void;
  favoritedKeys: Set<string>;
}) {
  const top = matches[0];
  const friendlyName =
    top.name && top.name.toLowerCase() !== "property" ? top.name : null;
  const distanceLabel =
    Number.isFinite(top.distance_meters) && top.distance_meters > 0
      ? `${Math.round(top.distance_meters)}m away`
      : null;
  const alreadyFavorited = favoritedKeys.has(top.property_key);

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-amber-800">
        Might already exist — matched {friendlyName ?? "this address"}:
      </p>
      <div className="space-y-1 rounded border border-amber-200 bg-white p-2">
        {friendlyName && (
          <div className="truncate text-[11px] font-medium">
            {friendlyName}
          </div>
        )}
        <div className="truncate text-[11px] text-muted-foreground">
          {top.address}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
          {distanceLabel && <span>{distanceLabel}</span>}
          {top.is_user_contributed && <span>· User-added</span>}
          {alreadyFavorited && <span>· Already in your Saved list</span>}
        </div>
        <Link
          href={`/properties/${encodeURIComponent(top.property_key)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
        >
          View match <ExternalLink className="h-2.5 w-2.5" />
        </Link>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Button
          size="sm"
          className="h-6 gap-1 text-[10px]"
          onClick={() => onUseExisting(top)}
          disabled={alreadyFavorited}
          title={
            alreadyFavorited
              ? "This match is already in your Saved list."
              : "Add the existing match to your Saved list."
          }
        >
          {alreadyFavorited ? "Already saved" : "Use existing"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-[10px]"
          onClick={onSaveAnyway}
        >
          Save as new
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 text-[10px]"
          onClick={onSkip}
        >
          Skip
        </Button>
      </div>
    </div>
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
