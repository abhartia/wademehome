"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHOTO_ROOM_META, type PhotoRoomType } from "@/lib/types/movein";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (roomType: PhotoRoomType, roomLabel: string) => Promise<void>;
}

const ROOM_TYPES = Object.entries(PHOTO_ROOM_META) as [PhotoRoomType, { label: string }][];

export function AddRoomDialog({ open, onOpenChange, onAdd }: Props) {
  const [roomType, setRoomType] = useState<PhotoRoomType>("living_room");
  const [customLabel, setCustomLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const label = customLabel.trim() || PHOTO_ROOM_META[roomType].label;

  async function handleSubmit() {
    setLoading(true);
    try {
      await onAdd(roomType, label);
      setCustomLabel("");
      setRoomType("living_room");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a room</DialogTitle>
          <DialogDescription>
            Choose a room type and optionally customize the label (e.g. &ldquo;Master
            Bedroom&rdquo;).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="room-type">Room type</Label>
            <Select value={roomType} onValueChange={(v) => setRoomType(v as PhotoRoomType)}>
              <SelectTrigger id="room-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map(([value, meta]) => (
                  <SelectItem key={value} value={value}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-label">Custom label (optional)</Label>
            <Input
              id="room-label"
              placeholder={PHOTO_ROOM_META[roomType].label}
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
