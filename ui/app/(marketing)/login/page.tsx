"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { defaultAppLandingPath } from "@/lib/defaultAppLandingPath";
import { pendingInviteRedirectPath } from "@/lib/groups/pendingInvite";
import { authMeQueryKey } from "@/lib/api/authSessionQuery";
import {
  loginAuthLoginPostMutation,
  requestMagicLinkAuthMagicLinkRequestPostMutation,
  resendVerificationEmailAuthVerifyEmailResendPostMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/api/errors";
import posthog from "posthog-js";

export default function LoginPage() {
  const router = useRouter();
  const { refresh, user, loading } = useAuth();
  const { journeyStage } = useUserProfile();
  const journeyStageRef = useRef(journeyStage);
  journeyStageRef.current = journeyStage;

  useEffect(() => {
    if (loading || !user) return;
    const pending = pendingInviteRedirectPath();
    if (pending) {
      router.replace(pending);
      return;
    }
    router.replace(user.onboarding_completed ? defaultAppLandingPath(journeyStage) : "/onboarding");
  }, [loading, user, router, journeyStage]);
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [needsVerify, setNeedsVerify] = useState(false);

  const loginMutation = useMutation({
    ...loginAuthLoginPostMutation(),
    onSuccess: async (data) => {
      if (data?.user?.email) {
        posthog.identify(data.user.email, { email: data.user.email });
      }
      posthog.capture("user_logged_in", { method: "password" });
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
  });

  const resendMutation = useMutation({
    ...resendVerificationEmailAuthVerifyEmailResendPostMutation(),
  });

  const magicMutation = useMutation({
    ...requestMagicLinkAuthMagicLinkRequestPostMutation(),
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setNeedsVerify(false);
    try {
      await loginMutation.mutateAsync({
        body: { email, password },
      });
    } catch (err) {
      const msg = getApiErrorMessage(err);
      if (msg.toLowerCase().includes("verify")) {
        setNeedsVerify(true);
      }
      setError(msg);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) return;
    setError("");
    setInfo("");
    try {
      await resendMutation.mutateAsync({
        body: { email: email.trim() },
      });
      setInfo("Verification email sent. Check your inbox.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleMagicLink = async () => {
    setError("");
    setInfo("");
    try {
      await magicMutation.mutateAsync({
        body: { email },
      });
      posthog.capture("magic_link_requested", { email });
      setInfo("Magic link sent. Check your inbox.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-muted-foreground">{info}</p>}
            {needsVerify && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={resendMutation.isPending || !email}
                onClick={handleResendVerification}
              >
                Resend verification email
              </Button>
            )}
            <Button disabled={loginMutation.isPending} className="w-full" type="submit">
              Continue
            </Button>
            <Button
              disabled={magicMutation.isPending || !email}
              className="w-full"
              variant="outline"
              type="button"
              onClick={handleMagicLink}
            >
              Email me a magic link
            </Button>
          </form>
          <p className="mt-3 text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
