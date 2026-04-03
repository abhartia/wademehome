"use client";

import { useState } from "react";
import { Edit3, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoNoteDialog } from "./PhotoNoteDialog";
import type { MoveInPhoto } from "@/lib/types/movein";

interface Props {
  photo: MoveInPhoto;
  onUpdateNote: (photoId: string, note: string) => Promise<unknown>;
  onDelete: (photoId: string) => Promise<void>;
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function PhotoCard({ photo, onUpdateNote, onDelete }: Props) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(photo.id);
    } finally {
      setDeleting(false);
    }
  }

  const photoSrc = photo.photoUrl.startsWith("http")
    ? photo.photoUrl
    : `/api/move-in/photos/file/${photo.photoUrl}`;

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoSrc}
        alt={photo.note || "Move-in photo"}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />

      {/* Timestamp overlay */}
      {photo.capturedAt && (
        <div className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
          {formatTimestamp(photo.capturedAt)}
        </div>
      )}

      {/* GPS indicator */}
      {photo.latitude != null && photo.longitude != null && (
        <div className="absolute right-1.5 top-1.5 rounded bg-black/60 p-1">
          <MapPin className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Actions */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-white hover:bg-white/20 hover:text-white"
          onClick={() => setNoteOpen(true)}
        >
          <Edit3 className="mr-1 h-3 w-3" />
          Note
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-red-300 hover:bg-white/20 hover:text-red-200"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Note display */}
      {photo.note && (
        <div className="border-t px-2 py-1.5">
          <p className="line-clamp-2 text-xs text-muted-foreground">{photo.note}</p>
        </div>
      )}

      <PhotoNoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        initialNote={photo.note || ""}
        onSave={(note) => onUpdateNote(photo.id, note)}
      />
    </div>
  );
}
