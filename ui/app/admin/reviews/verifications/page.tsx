"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { decideVerificationEndpointAdminReviewsVerificationsVerificationIdDecidePost } from "@/lib/api/generated/sdk.gen";
import { readVerificationQueueAdminReviewsVerificationsGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";

export default function VerificationsQueuePage() {
  const queryClient = useQueryClient();
  const queueQ = useQuery(
    readVerificationQueueAdminReviewsVerificationsGetOptions({
      query: { limit: 100, offset: 0 },
    })
  );

  const decide = useMutation({
    mutationFn: async (args: {
      id: string;
      decision: "approved" | "rejected";
      reason?: string;
    }) => {
      const { data, error } =
        await decideVerificationEndpointAdminReviewsVerificationsVerificationIdDecidePost(
          {
            path: { verification_id: args.id },
            body: {
              decision: args.decision,
              rejection_reason: args.reason ?? null,
            },
          }
        );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Decision recorded.");
      queryClient.invalidateQueries();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed");
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">Verification queue</h1>
      {queueQ.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (queueQ.data?.items ?? []).length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Queue empty.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueQ.data!.items.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="text-xs">
                      {v.author_display_name ?? v.user_id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{v.review_overall_rating}/5</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {v.proof_type}
                      <br />
                      <span className="break-all font-mono text-[10px] text-muted-foreground">
                        {v.storage_key}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-sm text-xs">
                      {v.review_title && (
                        <div className="font-medium">{v.review_title}</div>
                      )}
                      {v.review_body_preview}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            decide.mutate({ id: v.id, decision: "approved" })
                          }
                          disabled={decide.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const reason = window.prompt(
                              "Reason for rejection?"
                            );
                            if (reason !== null) {
                              decide.mutate({
                                id: v.id,
                                decision: "rejected",
                                reason,
                              });
                            }
                          }}
                          disabled={decide.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
