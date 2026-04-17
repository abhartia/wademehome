"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AlertCircle, Check, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { useActiveGroup } from "@/lib/groups/activeGroup";
import { useAcceptInvite, useInvitePreview } from "@/lib/groups/api";
import {
  consumePendingInviteToken,
  setPendingInviteToken,
} from "@/lib/groups/pendingInvite";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

function StateCard({
  icon,
  tone = "default",
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  tone?: "default" | "error" | "success";
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const toneBg =
    tone === "error"
      ? "bg-destructive/10 text-destructive"
      : tone === "success"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-primary/10 text-primary";
  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${toneBg}`}>
          {icon}
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {children ? <div className="mt-5 w-full">{children}</div> : null}
      </div>
    </div>
  );
}

function InviteAcceptInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, loading } = useAuth();
  const { setActiveGroupId } = useActiveGroup();
  const preview = useInvitePreview(token);
  const accept = useAcceptInvite();
  const submittedRef = useRef(false);

  const previewData = preview.data;

  useEffect(() => {
    if (loading || !token || !user || !previewData) return;
    if (previewData.revoked || previewData.expired) return;
    if (submittedRef.current) return;
    submittedRef.current = true;

    accept
      .mutateAsync(token)
      .then((res) => {
        consumePendingInviteToken();
        setActiveGroupId(res.group_id);
        toast.success(`Joined "${res.group_name}"`);
        router.replace(`/search?g=${res.group_id}`);
      })
      .catch((err) => {
        submittedRef.current = false;
        toast.error(err instanceof Error ? err.message : "Failed to join group");
      });
  }, [user, loading, token, previewData, accept, router, setActiveGroupId]);

  if (!token) {
    return (
      <StateCard
        icon={<AlertCircle className="h-6 w-6" />}
        tone="error"
        title="Invalid invite link"
        description="This link is missing its token. Ask the sender to share it again."
      />
    );
  }

  if (preview.isLoading) {
    return (
      <StateCard
        icon={<Loader2 className="h-6 w-6 animate-spin" />}
        title="Loading invite…"
      />
    );
  }

  if (preview.isError || !previewData) {
    return (
      <StateCard
        icon={<AlertCircle className="h-6 w-6" />}
        tone="error"
        title="Invite not found"
        description="This invite may have been revoked or the link is invalid."
      />
    );
  }

  if (previewData.revoked) {
    return (
      <StateCard
        icon={<AlertCircle className="h-6 w-6" />}
        tone="error"
        title="Invite revoked"
        description="The inviter revoked this link. Ask them to send a new one."
      />
    );
  }

  if (previewData.expired) {
    return (
      <StateCard
        icon={<AlertCircle className="h-6 w-6" />}
        tone="error"
        title="Invite expired"
        description="This invite is past its expiration date. Ask for a new one."
      />
    );
  }

  if (!user) {
    setPendingInviteToken(token);
    const next = encodeURIComponent(`/invites/accept?token=${token}`);
    return (
      <StateCard
        icon={<Users className="h-6 w-6" />}
        title={`Join "${previewData.group_name}"`}
        description={
          previewData.inviter_email
            ? `${previewData.inviter_email} invited you to share an apartment search.`
            : "You've been invited to a shared apartment search."
        }
      >
        <div className="flex flex-col gap-2">
          <Link href={`/login?next=${next}`} className="w-full">
            <Button className="w-full">Sign in to join</Button>
          </Link>
          <Link href={`/signup?next=${next}`} className="w-full">
            <Button variant="outline" className="w-full">
              Create an account
            </Button>
          </Link>
        </div>
      </StateCard>
    );
  }

  if (accept.isSuccess) {
    return (
      <StateCard
        icon={<Check className="h-6 w-6" />}
        tone="success"
        title={`Joined "${previewData.group_name}"`}
        description="Redirecting to your search…"
      />
    );
  }

  return (
    <StateCard
      icon={<Loader2 className="h-6 w-6 animate-spin" />}
      title={`Joining "${previewData.group_name}"…`}
      description={
        previewData.inviter_email
          ? `Invited by ${previewData.inviter_email}`
          : undefined
      }
    />
  );
}

export default function InviteAcceptPage() {
  return (
    <>
      <Toaster />
      <Suspense
        fallback={
          <Shell>
            <StateCard
              icon={<Loader2 className="h-6 w-6 animate-spin" />}
              title="Loading invite…"
            />
          </Shell>
        }
      >
        <Shell>
          <InviteAcceptInner />
        </Shell>
      </Suspense>
    </>
  );
}
