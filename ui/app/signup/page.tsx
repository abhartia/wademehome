"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  resendVerificationEmailAuthVerifyEmailResendPostMutation,
  signupAuthSignupPostMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/api/errors";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [sent, setSent] = useState(false);

  const signupMutation = useMutation({
    ...signupAuthSignupPostMutation(),
  });

  const resendMutation = useMutation({
    ...resendVerificationEmailAuthVerifyEmailResendPostMutation(),
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await signupMutation.mutateAsync({
        body: { email, password },
      });
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                We sent a verification link to <strong className="text-foreground">{email}</strong>.
                Open it to activate your account, then you can log in or continue to onboarding.
              </p>
              {info && <p className="text-foreground">{info}</p>}
              {error && <p className="text-destructive">{error}</p>}
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={resendMutation.isPending || !email.trim()}
                onClick={async () => {
                  setError("");
                  setInfo("");
                  try {
                    await resendMutation.mutateAsync({
                      body: { email: email.trim() },
                    });
                    setInfo("Another verification email is on its way.");
                  } catch (err) {
                    setError(getApiErrorMessage(err));
                  }
                }}
              >
                Resend verification email
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Go to log in</Link>
              </Button>
            </div>
          ) : (
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
                placeholder="Password (8+ characters)"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                disabled={signupMutation.isPending}
                className="w-full"
                type="submit"
              >
                Sign up
              </Button>
            </form>
          )}
          <p className="mt-3 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
