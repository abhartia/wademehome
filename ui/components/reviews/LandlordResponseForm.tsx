"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { postResponseReviewsReviewIdResponsePost } from "@/lib/api/generated/sdk.gen";

interface LandlordResponseFormProps {
  reviewId: string;
  onCancel: () => void;
  onSubmitted: () => void;
}

export function LandlordResponseForm({
  reviewId,
  onCancel,
  onSubmitted,
}: LandlordResponseFormProps) {
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await postResponseReviewsReviewIdResponsePost({
        path: { review_id: reviewId },
        body: { body },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Response posted.");
      queryClient.invalidateQueries();
      onSubmitted();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Could not post response");
    },
  });

  return (
    <div className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Respond publicly to this review"
        rows={4}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => mutation.mutate()}
          disabled={!body.trim() || mutation.isPending}
        >
          {mutation.isPending ? "Posting…" : "Post response"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
