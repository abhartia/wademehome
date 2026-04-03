"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoRoomCard } from "./PhotoRoomCard";
import { PhotoRoomSheet } from "./PhotoRoomSheet";
import { AddRoomDialog } from "./AddRoomDialog";
import { usePhotoDocumentation } from "@/lib/hooks/usePhotoDocumentation";
import type { PhotoRoom } from "@/lib/types/movein";

export function PhotoRoomList() {
  const { rooms, addRoom, removeRoom } = usePhotoDocumentation();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<PhotoRoom | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleRoomClick(room: PhotoRoom) {
    setSelectedRoom(room);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Rooms</h3>
        <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add room
        </Button>
      </div>

      {rooms.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {rooms.map((room) => (
            <PhotoRoomCard
              key={room.id}
              room={room}
              onClick={() => handleRoomClick(room)}
              onDelete={removeRoom}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Start by adding rooms you want to document. Common choices: living room,
            kitchen, bathroom, bedroom.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first room
          </Button>
        </div>
      )}

      <AddRoomDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={async (roomType, roomLabel) => {
          await addRoom(roomType, roomLabel);
        }}
      />

      <PhotoRoomSheet
        room={selectedRoom}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
