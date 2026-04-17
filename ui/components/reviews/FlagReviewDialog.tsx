"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { postFlagReviewsReviewIdFlagPost } from "@/lib/api/generated/sdk.gen";

interface FlagReviewDialogProps {
  reviewId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FLAG_OPTIONS: { value: string; label: string }[] = [
  { value: "defamation", label: "Defamation / false accusation" },
  { value: "factual_error", label: "Factual error" },
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "off_topic", label: "Off-topic / not about this building" },
  { value: "other", label: "Other" },
];

export function FlagReviewDialog({
  reviewId,
  open,
  onOpenChange,
}: FlagReviewDialogProps) {
  const [flagType, setFlagType] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await postFlagReviewsReviewIdFlagPost({
        path: { review_id: reviewId },
        body: {
          flag_type: flagType as
            | "defamation"
            | "factual_error"
            | "spam"
            | "harassment"
            | "off_topic"
            | "other",
          details: details || null,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Thanks — admin will review this shortly.");
      onOpenChange(false);
      setFlagType("");
      setDetails("");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Could not submit flag");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flag this review</DialogTitle>
          <DialogDescription>
            Admin will review your report. Reviews stay visible unless admin
            accepts the flag.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Reason</Label>
            <Select value={flagType} onValueChange={setFlagType}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a reason" />
              </SelectTrigger>
              <SelectContent>
                {FLAG_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Details (optional)</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Anything the admin should know"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!flagType || mutation.isPending}
          >
            {mutation.isPending ? "Submitting…" : "Submit flag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
