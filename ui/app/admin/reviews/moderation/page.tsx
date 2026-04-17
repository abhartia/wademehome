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

import { decideModerationEndpointAdminReviewsModerationFlagIdDecidePost } from "@/lib/api/generated/sdk.gen";
import { readModerationQueueAdminReviewsModerationGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen";

export default function ModerationQueuePage() {
  const queryClient = useQueryClient();
  const queueQ = useQuery(
    readModerationQueueAdminReviewsModerationGetOptions({
      query: { limit: 100, offset: 0 },
    })
  );

  const decide = useMutation({
    mutationFn: async (args: {
      id: string;
      decision: "accepted" | "rejected";
      review_action: "hide" | "remove" | "none";
      note?: string;
    }) => {
      const { data, error } =
        await decideModerationEndpointAdminReviewsModerationFlagIdDecidePost({
          path: { flag_id: args.id },
          body: {
            decision: args.decision,
            review_action: args.review_action,
            resolution_note: args.note ?? null,
          },
        });
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
      <h1 className="text-2xl font-semibold">Moderation queue</h1>
      {queueQ.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (queueQ.data?.items ?? []).length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No flags pending.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag</TableHead>
                  <TableHead>Submitted by</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueQ.data!.items.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <Badge variant="outline">{f.flag_type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {f.submitted_by_role}
                    </TableCell>
                    <TableCell className="max-w-sm text-xs">
                      {f.review_title && (
                        <div className="font-medium">{f.review_title}</div>
                      )}
                      {f.review_body_preview}
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        Status: {f.review_status}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs text-xs text-muted-foreground">
                      {f.details || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            decide.mutate({
                              id: f.id,
                              decision: "accepted",
                              review_action: "hide",
                            })
                          }
                          disabled={decide.isPending}
                        >
                          Accept (hide)
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            decide.mutate({
                              id: f.id,
                              decision: "accepted",
                              review_action: "remove",
                            })
                          }
                          disabled={decide.isPending}
                        >
                          Accept (remove)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            decide.mutate({
                              id: f.id,
                              decision: "rejected",
                              review_action: "none",
                            })
                          }
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
