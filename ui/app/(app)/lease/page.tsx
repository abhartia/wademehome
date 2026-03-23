"use client";

import Link from "next/link";
import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { LeaseAssistantChat } from "@/components/lease/LeaseAssistantChat";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { readLeaseDocumentPortalLeaseGetQueryKey } from "@/lib/api/generated/@tanstack/react-query.gen";
import {
  deleteLeaseDocumentPortalLeaseDelete,
  readLeaseDocumentPortalLeaseGet,
  uploadLeaseDocumentPortalLeaseUploadPost,
} from "@/lib/api/generated/sdk.gen";

export default function LeasePage() {
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: leaseMeta, isLoading } = useQuery({
    queryKey: readLeaseDocumentPortalLeaseGetQueryKey({}),
    enabled: profile.hasCurrentLease,
    queryFn: async () => {
      const { data, error } = await readLeaseDocumentPortalLeaseGet({});
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data, error } = await uploadLeaseDocumentPortalLeaseUploadPost({
        body: { file },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: readLeaseDocumentPortalLeaseGetQueryKey({}),
      });
      toast.success("Lease uploaded. You can ask questions below.");
    },
    onError: () => {
      toast.error("Upload failed. Use a text-based PDF under 15 MB.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await deleteLeaseDocumentPortalLeaseDelete({});
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: readLeaseDocumentPortalLeaseGetQueryKey({}),
      });
      toast.success("Lease removed from your account.");
    },
    onError: () => {
      toast.error("Could not remove the lease document.");
    },
  });

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please choose a PDF file.");
      return;
    }
    uploadMutation.mutate(f);
  };

  if (!profile.hasCurrentLease) {
    return (
      <div className="h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="mx-auto max-w-lg space-y-4 p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>My lease</CardTitle>
              </div>
              <CardDescription>
                The lease assistant is available when your profile says you
                currently have an active lease.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Turn this on from your profile if you have a lease you&apos;d
                like to ask questions about.
              </p>
              <Button asChild>
                <Link href="/profile">Go to profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasDoc = Boolean(leaseMeta?.has_document);
  const chatDisabled = !hasDoc || uploadMutation.isPending;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 border-b bg-background px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">My lease</h1>
        <p className="text-sm text-muted-foreground">
          Upload your lease PDF and ask questions about it.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <Card className="shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lease document</CardTitle>
            <CardDescription>
              PDF only, up to 15&nbsp;MB. Text is extracted on our servers for
              this assistant only.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={onFileChange}
            />
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              disabled={uploadMutation.isPending}
              onClick={onPickFile}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {hasDoc ? "Replace PDF" : "Upload PDF"}
            </Button>
            {hasDoc && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-destructive"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
                title="Remove lease"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {isLoading ? (
              <span className="text-sm text-muted-foreground">Loading…</span>
            ) : hasDoc ? (
              <span className="text-sm text-muted-foreground">
                {leaseMeta?.original_filename}
                {leaseMeta?.updated_at
                  ? ` · updated ${new Date(leaseMeta.updated_at).toLocaleString()}`
                  : null}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                No file uploaded yet.
              </span>
            )}
          </CardContent>
        </Card>

        <div className="flex min-h-0 flex-1 flex-col">
          <LeaseAssistantChat disabled={chatDisabled} />
        </div>
      </div>
    </div>
  );
}
