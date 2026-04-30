"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { postReviewReviewsPost } from "@/lib/api/generated/sdk.gen";
import posthog from "posthog-js";

import { StarRating } from "./StarRating";

const DIMENSIONS: { key: string; label: string; scope: "landlord" | "building" }[] = [
  { key: "responsiveness", label: "Responsiveness", scope: "landlord" },
  { key: "maintenance", label: "Repair responsiveness", scope: "landlord" },
  { key: "deposit_return", label: "Deposit return", scope: "landlord" },
  { key: "harassment", label: "Respectful treatment", scope: "landlord" },
  { key: "heat_hot_water", label: "Heat / hot water", scope: "building" },
  { key: "pest_control", label: "Pest control", scope: "building" },
  { key: "building_condition", label: "Building condition", scope: "building" },
  { key: "noise", label: "Noise", scope: "building" },
  { key: "value", label: "Value for rent", scope: "building" },
];

interface ReviewFormProps {
  buildingId: string;
  buildingLabel: string;
  currentOwnerName: string | null;
  onSubmitted?: () => void;
}

export function ReviewForm({
  buildingId,
  buildingLabel,
  currentOwnerName,
  onSubmitted,
}: ReviewFormProps) {
  const router = useRouter();
  const [landlordRelation, setLandlordRelation] = useState<"owner" | "manager" | "both">("both");
  const [tenancyStart, setTenancyStart] = useState<string>("");
  const [tenancyEnd, setTenancyEnd] = useState<string>("");
  const [overall, setOverall] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [subratings, setSubratings] = useState<Record<string, number>>({});
  const [landlordHintName, setLandlordHintName] = useState<string>(currentOwnerName ?? "");

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await postReviewReviewsPost({
        body: {
          building_id: buildingId,
          landlord_relation: landlordRelation,
          tenancy_start: tenancyStart,
          tenancy_end: tenancyEnd || null,
          overall_rating: overall,
          title: title || null,
          body,
          subratings: Object.entries(subratings).map(([dimension, score]) => ({
            dimension: dimension as
              | "responsiveness"
              | "maintenance"
              | "deposit_return"
              | "heat_hot_water"
              | "pest_control"
              | "harassment"
              | "building_condition"
              | "noise"
              | "value",
            score,
          })),
          landlord_hint_name: landlordHintName || null,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      posthog.capture("review_submitted", {
        building_id: buildingId,
        overall_rating: overall,
        has_subratings: Object.keys(subratings).length > 0,
        landlord_relation: landlordRelation,
        status: data?.status,
      });
      toast.success(
        data?.status === "pending_cooldown"
          ? "Submitted. Low ratings enter a 24-hour cooldown before publishing."
          : "Review published."
      );
      onSubmitted?.();
      router.push(`/buildings/${buildingId}`);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Could not submit review");
    },
  });

  const valid = overall > 0 && tenancyStart && body.trim().length >= 20;

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <div className="text-sm font-medium">Reviewing</div>
          <div className="text-muted-foreground">{buildingLabel}</div>
        </div>

        <div className="space-y-2">
          <Label>Overall rating</Label>
          <StarRating value={overall} onChange={setOverall} size="lg" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Tenancy started</Label>
            <Input
              type="date"
              value={tenancyStart}
              onChange={(e) => setTenancyStart(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Tenancy ended (optional)</Label>
            <Input type="date" value={tenancyEnd} onChange={(e) => setTenancyEnd(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Who are you reviewing?</Label>
          <Select
            value={landlordRelation}
            onValueChange={(v) => setLandlordRelation(v as "owner" | "manager" | "both")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Owner & management both</SelectItem>
              <SelectItem value="owner">The owner</SelectItem>
              <SelectItem value="manager">The management company</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Landlord or management company name</Label>
          <Input
            value={landlordHintName}
            onChange={(e) => setLandlordHintName(e.target.value)}
            placeholder="e.g. Smith Realty LLC"
          />
          <p className="text-xs text-muted-foreground">
            We match this against ACRIS ownership records. If we don&apos;t find a match, we&apos;ll
            create a crowdsourced landlord entry that admin can merge later.
          </p>
        </div>

        <div className="space-y-1">
          <Label>Title (optional)</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary of your experience"
          />
        </div>

        <div className="space-y-1">
          <Label>Your review</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="What was it like living here? (min 20 characters)"
          />
        </div>

        <div className="space-y-2">
          <Label>Sub-ratings (optional)</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DIMENSIONS.map((d) => (
              <div
                key={d.key}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div>
                  <div className="text-sm">{d.label}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {d.scope === "landlord" ? "travels with landlord" : "stays with building"}
                  </div>
                </div>
                <StarRating
                  value={subratings[d.key] ?? 0}
                  onChange={(v) => setSubratings((s) => ({ ...s, [d.key]: v }))}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={!valid || mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? "Submitting…" : "Submit review"}
        </Button>
      </CardContent>
    </Card>
  );
}
