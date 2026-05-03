"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PropertyImageGallery } from "@/components/properties/PropertyImageGallery";
import { ThumbsUp, ThumbsDown, Heart, Lock, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import {
  toTourRequestPayload,
  useAddGroupPropertyNote,
  useCreateTourRequest,
  useDeleteGroupPropertyNote,
  useGroupPropertyNotes,
  usePropertyFavorites,
  usePropertyNote,
  usePropertyReactions,
  useToggleFavorite,
  useToggleReaction,
  useUpsertPropertyNote,
  type ReactionKind,
} from "@/lib/properties/api";
import { useActiveGroupId } from "@/lib/groups/activeGroup";
import { useMyGroups } from "@/lib/groups/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { shareListingUrl } from "@/lib/properties/shareListingUrl";
import { cacheProperty } from "@/lib/properties/propertyStorage";

interface PropertyDetailSheetProps {
  property: PropertyDataItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function initials(email: string | null | undefined) {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function PropertyDetailSheet({
  property,
  open,
  onOpenChange,
}: PropertyDetailSheetProps) {
  const activeGroupId = useActiveGroupId();
  const router = useRouter();
  const { user } = useAuth();
  const groupsQuery = useMyGroups({ enabled: Boolean(activeGroupId) });
  const activeGroupName = activeGroupId
    ? groupsQuery.data?.groups.find((g) => g.id === activeGroupId)?.name
    : undefined;
  const propertyKey = useMemo(
    () => (property ? buildPropertyKey(property) : ""),
    [property],
  );
  const [draftNote, setDraftNote] = useState("");
  const [groupNoteDraft, setGroupNoteDraft] = useState("");
  const favoritesQuery = usePropertyFavorites({ groupId: activeGroupId });
  const noteQuery = usePropertyNote(propertyKey, { enabled: !activeGroupId });
  const groupNotesQuery = useGroupPropertyNotes(propertyKey, activeGroupId);
  const reactionsQuery = usePropertyReactions(propertyKey, activeGroupId);
  const toggleFavorite = useToggleFavorite({ groupId: activeGroupId });
  const upsertNote = useUpsertPropertyNote(propertyKey);
  const addGroupNote = useAddGroupPropertyNote(propertyKey, activeGroupId ?? "");
  const deleteGroupNote = useDeleteGroupPropertyNote(propertyKey, activeGroupId ?? "");
  const toggleReaction = useToggleReaction(propertyKey, activeGroupId ?? "");
  const createTourRequest = useCreateTourRequest();
  const [tourConfirmOpen, setTourConfirmOpen] = useState(false);
  const [tourRequestedDate, setTourRequestedDate] = useState("");
  const [tourRequestedTime, setTourRequestedTime] = useState("");
  const [tourRequestMessage, setTourRequestMessage] = useState("");

  const favoritesForProperty = useMemo(() => {
    if (!favoritesQuery.data?.favorites || !propertyKey) return [];
    return favoritesQuery.data.favorites.filter((f) => f.property_key === propertyKey);
  }, [favoritesQuery.data?.favorites, propertyKey]);

  const isFavorited = favoritesForProperty.length > 0;

  const groupNotes = groupNotesQuery.data?.notes ?? [];
  // Wrap the `?? []` in its own memo so the reference is stable — otherwise the
  // two downstream memos' deps change every render, defeating memoization.
  const reactions = useMemo(
    () => reactionsQuery.data?.reactions ?? [],
    [reactionsQuery.data?.reactions],
  );

  const reactionsByKind = useMemo(() => {
    const byKind: Record<ReactionKind, typeof reactions> = {
      thumbs_up: [],
      thumbs_down: [],
      heart: [],
    };
    for (const r of reactions) byKind[r.reaction as ReactionKind].push(r);
    return byKind;
  }, [reactions]);

  const myReactions = useMemo(() => {
    if (!user) return new Set<ReactionKind>();
    return new Set(
      reactions
        .filter((r) => r.user_id === user.id)
        .map((r) => r.reaction as ReactionKind),
    );
  }, [reactions, user]);

  useEffect(() => {
    if (activeGroupId) return;
    setDraftNote(noteQuery.data?.note?.note ?? "");
  }, [noteQuery.data?.note?.note, propertyKey, activeGroupId]);

  if (!property) return null;

  const fullDetailsPath = `/properties/${encodeURIComponent(propertyKey)}`;
  const openFullDetails = () => {
    cacheProperty(propertyKey, property);
    window.open(fullDetailsPath, "_blank", "noopener,noreferrer");
  };

  const shareListing = async () => {
    cacheProperty(propertyKey, property);
    const absoluteUrl = `${window.location.origin}${fullDetailsPath}`;
    await shareListingUrl({ url: absoluteUrl, title: property.name });
  };

  const onSaveFavorite = async () => {
    const response = await toggleFavorite.mutateAsync({
      propertyKey,
      propertyName: property.name,
      propertyAddress: property.address,
    });
    if (response.favorited) {
      toast.success("Saved to favorites", {
        action: {
          label: "View saved",
          onClick: () => router.push("/saved"),
        },
      });
    } else {
      toast.success("Removed from favorites");
    }
  };

  const onSaveNote = async () => {
    await upsertNote.mutateAsync(draftNote);
    toast.success("Note saved");
  };

  const onAddGroupNote = async () => {
    const text = groupNoteDraft.trim();
    if (!text) return;
    try {
      await addGroupNote.mutateAsync(text);
      setGroupNoteDraft("");
      toast.success("Note added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add note");
    }
  };

  const onDeleteGroupNote = async (noteId: string) => {
    try {
      await deleteGroupNote.mutateAsync(noteId);
      toast.success("Note deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const onToggleReaction = async (kind: ReactionKind) => {
    try {
      await toggleReaction.mutateAsync(kind);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reaction failed");
    }
  };

  const onRequestTour = () => {
    setTourRequestedDate("");
    setTourRequestedTime("");
    setTourRequestMessage("");
    setTourConfirmOpen(true);
  };

  const onConfirmSendTourRequest = async () => {
    try {
      await createTourRequest.mutateAsync({
        ...toTourRequestPayload(propertyKey, property),
        requested_date: tourRequestedDate || null,
        requested_time: tourRequestedTime || null,
        request_message: tourRequestMessage.trim() || null,
        group_id: activeGroupId ?? null,
      });
      toast.success("Tour request sent");
      setTourConfirmOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send tour request";
      toast.error(message);
    }
  };

  const emailPreview = [
    `Property: ${property.name}`,
    `Address: ${property.address}`,
    `Requested date: ${tourRequestedDate || "Not specified"}`,
    `Requested time: ${tourRequestedTime || "Not specified"}`,
    "",
    tourRequestMessage.trim() || "No additional message provided.",
  ].join("\n");

  const reactionButtons: { kind: ReactionKind; Icon: typeof ThumbsUp; label: string }[] = [
    { kind: "thumbs_up", Icon: ThumbsUp, label: "Thumbs up" },
    { kind: "thumbs_down", Icon: ThumbsDown, label: "Thumbs down" },
    { kind: "heart", Icon: Heart, label: "Heart" },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="pr-10">
          <SheetTitle className="break-words pr-2">{property.name}</SheetTitle>
          <SheetDescription className="break-words">{property.address}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <PropertyImageGallery property={property} variant="sheet" />

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {formatPropertyRangeLabel(property.bedroom_range)}
            </Badge>
            <Badge variant="secondary">{formatPropertyRangeLabel(property.rent_range)}</Badge>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1">Main amenities</h4>
            <div className="flex flex-wrap gap-2">
              {property.main_amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onRequestTour} disabled={createTourRequest.isPending}>
              Request Tour
            </Button>
            <Button variant="outline" onClick={onSaveFavorite} disabled={toggleFavorite.isPending}>
              {isFavorited ? "Unsave" : "Save"}
            </Button>
            <Button variant="outline" onClick={shareListing}>
              Share
            </Button>
          </div>

          {activeGroupId && favoritesForProperty.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Saved by</span>
              <TooltipProvider delayDuration={150}>
                <div className="flex -space-x-1.5">
                  {favoritesForProperty.map((f) => (
                    <Tooltip key={f.added_by_user_id ?? f.property_key}>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-[10px]">
                            {initials(f.added_by_email)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        {f.added_by_email ?? "Member"}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          )}

          {activeGroupId && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Reactions</h4>
                <div className="flex items-center gap-2">
                  <TooltipProvider delayDuration={150}>
                    {reactionButtons.map(({ kind, Icon, label }) => {
                      const entries = reactionsByKind[kind];
                      const mine = myReactions.has(kind);
                      const who = entries.map((r) => r.email).join(", ");
                      return (
                        <Tooltip key={kind}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={mine ? "default" : "outline"}
                              size="sm"
                              onClick={() => onToggleReaction(kind)}
                              disabled={toggleReaction.isPending}
                              aria-label={label}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{entries.length}</span>
                            </Button>
                          </TooltipTrigger>
                          {entries.length > 0 && (
                            <TooltipContent>{who}</TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </div>
            </>
          )}

          <Separator />

          {activeGroupId ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Group notes
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Only visible to members of
                  {activeGroupName ? ` ${activeGroupName}` : " your group"}. Not
                  shared with landlords or anyone outside the group.
                </p>
              </div>
              {groupNotesQuery.isLoading ? (
                <div className="text-xs text-muted-foreground">Loading notes…</div>
              ) : groupNotes.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  No notes yet. Be the first to share your thoughts with the group.
                </div>
              ) : (
                <div className="space-y-3">
                  {groupNotes.map((n) => {
                    const mine = user?.id === n.author_user_id;
                    return (
                      <div key={n.id} className="flex gap-3">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="text-[10px]">
                            {initials(n.author_email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {n.author_email}
                            </span>
                            <span>•</span>
                            <span>{formatTimestamp(n.created_at)}</span>
                            {mine && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto h-6 w-6"
                                onClick={() => onDeleteGroupNote(n.id)}
                                aria-label="Delete note"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                          <div className="whitespace-pre-wrap text-sm">{n.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="space-y-2">
                <Textarea
                  value={groupNoteDraft}
                  onChange={(e) => setGroupNoteDraft(e.target.value)}
                  placeholder={
                    activeGroupName
                      ? `Add a note for ${activeGroupName}…`
                      : "Add a note for your group…"
                  }
                />
                <Button
                  size="sm"
                  onClick={onAddGroupNote}
                  disabled={addGroupNote.isPending || !groupNoteDraft.trim()}
                >
                  Post note
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Personal notes</h4>
              <Textarea
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                placeholder="What stood out about this property?"
              />
              <Button size="sm" onClick={onSaveNote} disabled={upsertNote.isPending}>
                Save Note
              </Button>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button onClick={openFullDetails}>Open Full Details</Button>
        </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet open={tourConfirmOpen} onOpenChange={setTourConfirmOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader className="pr-10">
            <SheetTitle>Confirm tour request email</SheetTitle>
            <SheetDescription>
              Review and edit the request before sending to our tour operations inbox.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-6">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Preferred date</label>
                <Input
                  type="date"
                  value={tourRequestedDate}
                  onChange={(event) => setTourRequestedDate(event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Preferred time</label>
                <Input
                  type="time"
                  value={tourRequestedTime}
                  onChange={(event) => setTourRequestedTime(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Message</label>
              <Textarea
                value={tourRequestMessage}
                onChange={(event) => setTourRequestMessage(event.target.value)}
                placeholder="Any details for scheduling, availability, or access?"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email preview</label>
              <pre className="max-h-52 overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-xs">
                {emailPreview}
              </pre>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setTourConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirmSendTourRequest} disabled={createTourRequest.isPending}>
              {createTourRequest.isPending ? "Sending..." : "Send Request"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
