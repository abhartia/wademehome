"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { defaultAppLandingPath } from "@/lib/defaultAppLandingPath";
import { pendingInviteRedirectPath } from "@/lib/groups/pendingInvite";
import { authMeQueryKey } from "@/lib/api/authSessionQuery";
import { verifyMagicLinkAuthMagicLinkVerifyPostMutation } from "@/lib/api/generated/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/api/errors";
import posthog from "posthog-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const { journeyStage } = useUserProfile();
  const journeyStageRef = useRef(journeyStage);
  journeyStageRef.current = journeyStage;
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("Signing you in...");
  const started = useRef(false);

  const verifyMutation = useMutation({
    ...verifyMagicLinkAuthMagicLinkVerifyPostMutation(),
    onSuccess: async (data) => {
      if (data?.user?.email) {
        posthog.identify(data.user.email, { email: data.user.email });
      }
      posthog.capture("magic_link_verified", { method: "magic_link" });
      await queryClient.invalidateQueries({ queryKey: authMeQueryKey() });
      await refresh();
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
      setMessage("Missing magic-link token.");
      return;
    }
    if (started.current) return;
    started.current = true;
    verifyMutation.mutate({ body: { token } });
  }, [params, verifyMutation]);

  return <div className="p-8 text-center">{message}</div>;
}
