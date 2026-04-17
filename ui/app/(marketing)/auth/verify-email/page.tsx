"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { defaultAppLandingPath } from "@/lib/defaultAppLandingPath";
import { pendingInviteRedirectPath } from "@/lib/groups/pendingInvite";
import { authMeQueryKey } from "@/lib/api/authSessionQuery";
import { verifyEmailRouteAuthVerifyEmailPostMutation } from "@/lib/api/generated/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/api/errors";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const { journeyStage } = useUserProfile();
  const journeyStageRef = useRef(journeyStage);
  journeyStageRef.current = journeyStage;
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("Verifying your email…");

  const started = useRef(false);

  const verifyMutation = useMutation({
    ...verifyEmailRouteAuthVerifyEmailPostMutation(),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: authMeQueryKey() });
      await refresh();
      setMessage("Email verified. Redirecting…");
      const pending = pendingInviteRedirectPath();
      if (pending) {
        router.replace(pending);
      } else if (!data?.user?.onboarding_completed) {
        router.replace("/onboarding");
      } else {
        router.replace(defaultAppLandingPath(journeyStageRef.current));
      }
    },
    onError: (err) => {
      setMessage(getApiErrorMessage(err));
    },
  });

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMessage("Missing verification token.");
      return;
    }
    if (started.current) return;
    started.current = true;
    verifyMutation.mutate({ body: { token } });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per token; avoid effect loop from mutation identity
  }, [params]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p>{message}</p>
      <Link href="/login" className="text-sm underline text-muted-foreground">
        Back to log in
      </Link>
    </div>
  );
}
