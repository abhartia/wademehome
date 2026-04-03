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
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialNote: string;
  onSave: (note: string) => Promise<unknown>;
}

export function PhotoNoteDialog({ open, onOpenChange, initialNote, onSave }: Props) {
  const [note, setNote] = useState(initialNote);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(note.trim());
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Photo note</DialogTitle>
          <DialogDescription>
            Describe any existing damage, marks, or condition details you want to document.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="e.g. Existing scratch on kitchen counter near stove"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
