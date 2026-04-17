"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { useActiveGroup } from "@/lib/groups/activeGroup";
import { useAcceptInvite, useInvitePreview } from "@/lib/groups/api";

function InviteAcceptInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, loading } = useAuth();
  const { setActiveGroupId } = useActiveGroup();
  const preview = useInvitePreview(token);
  const accept = useAcceptInvite();
  const [submitted, setSubmitted] = useState(false);

  const previewData = preview.data;

  useEffect(() => {
    if (loading) return;
    if (!token) return;
    if (user && previewData && !submitted && !previewData.revoked && !previewData.expired) {
      setSubmitted(true);
      accept
        .mutateAsync(token)
        .then((res) => {
          setActiveGroupId(res.group_id);
          toast.success(`Joined "${res.group_name}"`);
          router.replace(`/search?g=${res.group_id}`);
        })
        .catch((err) => {
          toast.error(err instanceof Error ? err.message : "Failed to join group");
        });
    }
  }, [user, loading, token, previewData, submitted, accept, router, setActiveGroupId]);

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid link</CardTitle>
          <CardDescription>This invite link is missing its token.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (preview.isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (preview.isError || !previewData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invite not found</CardTitle>
          <CardDescription>
            This invite may have been revoked or the link is invalid.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (previewData.revoked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invite revoked</CardTitle>
          <CardDescription>
            The inviter revoked this link. Ask them to send a new one.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (previewData.expired) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invite expired</CardTitle>
          <CardDescription>
            This invite is past its expiration date. Ask for a new one.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    const next = encodeURIComponent(`/invites/accept?token=${token}`);
    return (
      <Card>
        <CardHeader>
          <CardTitle>You&apos;re invited to join {previewData.group_name}</CardTitle>
          <CardDescription>
            {previewData.inviter_email
              ? `${previewData.inviter_email} wants to share their apartment search with you.`
              : "Someone invited you to their shared apartment search."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Link href={`/login?next=${next}`}>
            <Button>Sign in to join</Button>
          </Link>
          <Link href={`/signup?next=${next}`}>
            <Button variant="outline">Create an account</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Joining {previewData.group_name}…</CardTitle>
        <CardDescription>
          {previewData.inviter_email
            ? `Invited by ${previewData.inviter_email}.`
            : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-40" />
      </CardContent>
    </Card>
  );
}

export default function InviteAcceptPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-12">
      <Toaster />
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <InviteAcceptInner />
      </Suspense>
    </div>
  );
}
