"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PhotoCapture } from "./PhotoCapture";
import { PhotoCard } from "./PhotoCard";
import { usePhotoDocumentation } from "@/lib/hooks/usePhotoDocumentation";
import type { PhotoRoom } from "@/lib/types/movein";

interface Props {
  room: PhotoRoom | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoRoomSheet({ room, open, onOpenChange }: Props) {
  const { useRoomPhotos, uploadPhoto, uploading, updatePhotoNote, removePhoto } =
    usePhotoDocumentation();
  const photosQuery = useRoomPhotos(room?.id ?? null);
  const photos = photosQuery.data ?? [];

  if (!room) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{room.roomLabel}</SheetTitle>
          <SheetDescription>
            {photos.length} {photos.length === 1 ? "photo" : "photos"} documented
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Upload button */}
          <div className="flex justify-end">
            <PhotoCapture
              roomId={room.id}
              uploading={uploading}
              onCapture={async (args) => {
                await uploadPhoto(args);
              }}
            />
          </div>

          {/* Photo grid */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onUpdateNote={updatePhotoNote}
                  onDelete={removePhoto}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No photos yet. Tap &ldquo;Add photo&rdquo; to document this room&rsquo;s
                condition.
              </p>
              <p className="text-xs text-muted-foreground">
                Photos are timestamped and geotagged to create a verifiable record.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
