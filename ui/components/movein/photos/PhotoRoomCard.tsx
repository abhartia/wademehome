"use client";

import {
  Archive,
  Bath,
  Bed,
  CookingPot,
  DoorOpen,
  ImageIcon,
  LayoutGrid,
  Sofa,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PhotoRoom, PhotoRoomType } from "@/lib/types/movein";

const ICONS: Record<PhotoRoomType, typeof Sofa> = {
  living_room: Sofa,
  bedroom: Bed,
  kitchen: CookingPot,
  bathroom: Bath,
  hallway: DoorOpen,
  closet: Archive,
  other: LayoutGrid,
};

interface Props {
  room: PhotoRoom;
  onClick: () => void;
  onDelete: (roomId: string) => void;
}

export function PhotoRoomCard({ room, onClick, onDelete }: Props) {
  const Icon = ICONS[room.roomType] ?? LayoutGrid;

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-3 p-4">
        {room.firstPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              room.firstPhotoUrl.startsWith("http")
                ? room.firstPhotoUrl
                : `/api/move-in/photos/file/${room.firstPhotoUrl}`
            }
            alt={room.roomLabel}
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight truncate">{room.roomLabel}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <ImageIcon className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {room.photoCount} {room.photoCount === 1 ? "photo" : "photos"}
            </span>
          </div>
        </div>
        {room.photoCount > 0 && (
          <Badge variant="secondary" className="shrink-0">
            {room.photoCount}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 shrink-0 p-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(room.id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </CardContent>
    </Card>
  );
}
