"use client";

import { use, useState } from "react";
import { AlertCircle, Check, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import {
  usePublicApplicantPreview,
  useSubmitPublicApplicant,
} from "@/lib/applicants/api";

type PageProps = { params: Promise<{ token: string }> };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-lg">{children}</div>
      <Toaster />
    </div>
  );
}

function StatusCard({
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
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${toneBg}`}
        >
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

export default function PublicApplicantRegisterPage(props: PageProps) {
  const { token } = use(props.params);
  const previewQuery = usePublicApplicantPreview(token);
  const submitMutation = useSubmitPublicApplicant();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [budget, setBudget] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    try {
      await submitMutation.mutateAsync({
        token,
        body: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          notes: notes.trim() || null,
          budget_usd: budget.trim() ? Number(budget) : null,
          move_in_date: moveInDate || null,
        },
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (previewQuery.isLoading) {
    return (
      <Shell>
        <StatusCard
          icon={<Loader2 className="h-6 w-6 animate-spin" />}
          title="Loading…"
        />
      </Shell>
    );
  }

  if (previewQuery.isError || !previewQuery.data) {
    return (
      <Shell>
        <StatusCard
          icon={<AlertCircle className="h-6 w-6" />}
          tone="error"
          title="Link not found"
          description="This registration link doesn't exist or has already been used."
        />
      </Shell>
    );
  }

  const preview = previewQuery.data;

  if (preview.expired) {
    return (
      <Shell>
        <StatusCard
          icon={<AlertCircle className="h-6 w-6" />}
          tone="error"
          title="Link expired"
          description="Ask the person who sent you this link for a fresh one."
        />
      </Shell>
    );
  }

  if (preview.already_submitted) {
    return (
      <Shell>
        <StatusCard
          icon={<Check className="h-6 w-6" />}
          tone="success"
          title="Already submitted"
          description="This link has already been used. Reach out to the group directly for an update."
        />
      </Shell>
    );
  }

  if (submitted) {
    return (
      <Shell>
        <StatusCard
          icon={<Check className="h-6 w-6" />}
          tone="success"
          title="Thanks — you're on the list!"
          description={`Your details were sent to ${preview.group_name}. They'll reach out directly.`}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <StatusCard
        icon={<UserPlus className="h-6 w-6" />}
        title={`Apply to ${preview.group_name}`}
        description={
          preview.role_context
            ? `Opening: ${preview.role_context}`
            : "Share your details so the group can reach out."
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div className="space-y-1">
            <Label htmlFor="r-name">Name</Label>
            <Input
              id="r-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={255}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="r-email">Email</Label>
            <Input
              id="r-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="r-phone">Phone (optional)</Label>
            <Input
              id="r-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={64}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="r-budget">Budget / rent (USD)</Label>
              <Input
                id="r-budget"
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="r-movein">Move-in date</Label>
              <Input
                id="r-movein"
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="r-notes">Anything else?</Label>
            <Textarea
              id="r-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell them about yourself, work situation, lifestyle, pets, etc."
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? "Sending…" : "Submit application"}
          </Button>
        </form>
      </StatusCard>
    </Shell>
  );
}
