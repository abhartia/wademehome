"use client";

import {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Film,
  Image as ImageIcon,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePasteAndCreate } from "@/lib/userListings/useUserListings";
import { useActiveGroupId } from "@/lib/groups/activeGroup";
import { useMyGroups } from "@/lib/groups/api";
import {
  readToursToursGetOptions,
  readToursToursGetQueryKey,
  updateTourRouteToursTourIdPatchMutation,
  uploadTourMediaRouteToursTourIdMediaPostMutation,
  upsertTourNoteRouteToursTourIdNotePutMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { toursFromApi } from "@/lib/api/portalMappers";

const PERSONAL_GROUP_VALUE = "__personal__";

type Phase = "idle" | "parsing" | "updating" | "uploading" | "done" | "error";

export function LogTourModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [tourDate, setTourDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [files, setFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseDetail, setPhaseDetail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [savedTourId, setSavedTourId] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const qc = useQueryClient();
  const activeGroupId = useActiveGroupId();
  const groupsQuery = useMyGroups();
  const pasteMut = usePasteAndCreate();
  const updateTourMut = useMutation(updateTourRouteToursTourIdPatchMutation());
  const uploadMediaMut = useMutation(
    uploadTourMediaRouteToursTourIdMediaPostMutation(),
  );
  const upsertNoteMut = useMutation(upsertTourNoteRouteToursTourIdNotePutMutation());

  const myGroups = groupsQuery.data?.groups ?? [];
  // Default the selector to the sidebar's active group; user can override before submitting.
  const [selectedGroupValue, setSelectedGroupValue] = useState<string>(
    () => activeGroupId ?? PERSONAL_GROUP_VALUE,
  );
  const effectiveGroupId =
    selectedGroupValue === PERSONAL_GROUP_VALUE ? null : selectedGroupValue;

  const selectedGroupName = useMemo(() => {
    if (!effectiveGroupId) return null;
    return myGroups.find((g) => g.id === effectiveGroupId)?.name ?? null;
  }, [effectiveGroupId, myGroups]);

  const busy =
    phase === "parsing" || phase === "updating" || phase === "uploading";

  const reset = useCallback(() => {
    setAddress("");
    setNotes("");
    setFiles([]);
    setPhase("idle");
    setPhaseDetail("");
    setErrorMessage(null);
    setSavedName(null);
    setSavedTourId(null);
    setUploadedCount(0);
    setTourDate(new Date().toISOString().slice(0, 10));
    setSelectedGroupValue(activeGroupId ?? PERSONAL_GROUP_VALUE);
  }, [activeGroupId]);

  const handleOpenChange = (next: boolean) => {
    if (busy) return; // don't close mid-upload
    setOpen(next);
    if (!next) reset();
  };

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    if (list.length === 0) return;
    setFiles((prev) => [...prev, ...list]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = useCallback(async () => {
    const trimmedAddress = address.trim();
    if (!trimmedAddress) return;
    setErrorMessage(null);
    setSavedName(null);
    setSavedTourId(null);
    setUploadedCount(0);

    // 1. Paste → create listing, favorite, and a saved tour in the group scope.
    setPhase("parsing");
    setPhaseDetail("Parsing address and looking it up…");
    let propertyKey: string | null = null;
    let propertyName: string | null = null;
    try {
      const res = await pasteMut.mutateAsync({
        text: trimmedAddress,
        force: true, // bypass dedupe so "already in a group member's list" doesn't block
        groupId: effectiveGroupId,
      });
      if (res.parse_error) {
        setPhase("error");
        setErrorMessage(res.parse_error);
        return;
      }
      if (!res.listing) {
        setPhase("error");
        setErrorMessage("Could not create the listing.");
        return;
      }
      propertyKey = res.listing.property_key;
      propertyName = res.listing.name;
    } catch (err) {
      setPhase("error");
      setErrorMessage(err instanceof Error ? err.message : "Could not save listing.");
      return;
    }

    // 2. Fetch the fresh tour list (group-scoped), locate the tour for this listing.
    setPhase("updating");
    setPhaseDetail("Marking as toured…");
    const query = {
      limit: 200,
      offset: 0,
      sort: "created_at_desc",
      ...(effectiveGroupId ? { group_id: effectiveGroupId } : {}),
    };
    try {
      const raw = await qc.fetchQuery({
        ...readToursToursGetOptions({ query }),
        queryKey: readToursToursGetQueryKey({ query }),
        staleTime: 0,
      });
      const tours = toursFromApi(raw);
      const tour = tours.find((t) => t.property.id === propertyKey);
      if (!tour) {
        setPhase("error");
        setErrorMessage("Saved the place but couldn't locate the tour to mark as toured.");
        return;
      }
      setSavedTourId(tour.id);

      await updateTourMut.mutateAsync({
        path: { tour_id: tour.id },
        body: {
          status: "completed",
          scheduled_date: tourDate,
          scheduled_time: "",
        },
      });

      if (notes.trim()) {
        await upsertNoteMut.mutateAsync({
          path: { tour_id: tour.id },
          body: {
            note: {
              ratings: {},
              pros: "",
              cons: "",
              general_notes: notes.trim(),
              would_apply: null,
              photo_checklist: [],
              updated_at: "",
            },
          },
        });
      }

      // 3. Upload media files one by one.
      if (files.length > 0) {
        setPhase("uploading");
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setPhaseDetail(
            `Uploading ${file.name} (${i + 1}/${files.length})…`,
          );
          await uploadMediaMut.mutateAsync({
            path: { tour_id: tour.id },
            body: { file },
          });
        }
      }
    } catch (err) {
      setPhase("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong.",
      );
      return;
    }

    await qc.invalidateQueries({
      queryKey: readToursToursGetQueryKey({ query }),
    });

    setPhase("done");
    setPhaseDetail("");
    setSavedName(propertyName);
    setUploadedCount(files.length);
  }, [
    address,
    effectiveGroupId,
    files,
    notes,
    pasteMut,
    qc,
    tourDate,
    updateTourMut,
    uploadMediaMut,
    upsertNoteMut,
  ]);

  const isDone = phase === "done";
  const formLocked = busy || isDone;
  const canSubmit = address.trim().length > 0 && !formLocked;

  const goToTour = () => {
    setOpen(false);
    reset();
    router.push("/tours?tab=completed");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 text-xs"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-3.5 w-3.5" />
        Log a place I toured
      </Button>

      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log a place you toured</DialogTitle>
          <DialogDescription>
            Paste the address or a Zillow / StreetEasy URL — we&apos;ll save
            the place, mark it as toured, and attach your video.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Save to
            </label>
            <Select
              value={selectedGroupValue}
              onValueChange={setSelectedGroupValue}
              disabled={formLocked}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Choose where to save" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PERSONAL_GROUP_VALUE}>
                  Personal (just me)
                </SelectItem>
                {myGroups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {effectiveGroupId && selectedGroupName ? (
              <p className="text-[11px] text-muted-foreground">
                Shared with everyone in <strong>{selectedGroupName}</strong>.
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Only visible to you.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Address or listing URL
            </label>
            <Textarea
              rows={2}
              placeholder={`269 Terrace Ave #B, Jersey City, NJ 07307\nor https://www.zillow.com/…`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={formLocked}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Tour date
              </label>
              <Input
                type="date"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                disabled={formLocked}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Quick note (optional)
              </label>
              <Input
                placeholder="First impression…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={formLocked}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Video / photos
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full gap-1.5"
              onClick={() => fileInputRef.current?.click()}
              disabled={formLocked}
            >
              <Upload className="h-3.5 w-3.5" />
              Choose video or photos
            </Button>
            {files.length > 0 && (
              <ul className="space-y-1 pt-1">
                {files.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1 text-xs"
                  >
                    {file.type.startsWith("video/") ? (
                      <Film className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {formatBytes(file.size)}
                    </Badge>
                    {!formLocked && (
                      <button
                        type="button"
                        aria-label="Remove file"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => removeFile(i)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {phase === "error" && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">Couldn&apos;t finish logging</div>
                <div>{errorMessage ?? "Unknown error."}</div>
              </div>
            </div>
          )}

          {busy && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{phaseDetail}</span>
            </div>
          )}

          {isDone && (
            <div className="space-y-2 rounded-md border border-green-200 bg-green-50 px-3 py-3 text-xs text-green-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                <div className="flex-1">
                  <div className="font-medium">
                    Logged{savedName ? ` "${savedName}"` : ""} as toured
                  </div>
                  <div className="text-green-700/80">
                    {uploadedCount > 0
                      ? `Uploaded ${uploadedCount} file${uploadedCount === 1 ? "" : "s"}. `
                      : ""}
                    {selectedGroupName
                      ? `Visible to everyone in ${selectedGroupName}.`
                      : "Saved to your personal list."}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={goToTour}
                  disabled={!savedTourId}
                >
                  View in Tours
                  <ArrowRight className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={reset}
                >
                  Log another
                </Button>
              </div>
            </div>
          )}

          {!isDone && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenChange(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button size="sm" disabled={!canSubmit} onClick={submit}>
                {busy ? "Saving…" : "Save tour"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
