"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Flag, MessageSquare } from "lucide-react";

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});
const formatMonthYear = (iso: string) => MONTH_YEAR.format(new Date(iso));

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { StarRating } from "./StarRating";
import { FlagReviewDialog } from "./FlagReviewDialog";
import { LandlordResponseForm } from "./LandlordResponseForm";

export interface ReviewCardReview {
  id: string;
  author_display_name: string;
  overall_rating: number;
  title?: string | null;
  body: string;
  tenancy_start: string;
  tenancy_end?: string | null;
  verified_tenant: boolean;
  landlord_relation: string;
  landlord_entity_id: string;
  landlord_entity_name: string;
  subratings: Record<string, number>;
  response_body?: string | null;
  created_at: string;
}

interface ReviewCardProps {
  review: ReviewCardReview;
  showLandlordLink?: boolean;
  canRespond?: boolean;
  onResponseSubmitted?: () => void;
}

const DIMENSION_LABELS: Record<string, string> = {
  responsiveness: "Responsiveness",
  maintenance: "Maintenance",
  deposit_return: "Deposit return",
  heat_hot_water: "Heat / hot water",
  pest_control: "Pest control",
  harassment: "Harassment",
  building_condition: "Building condition",
  noise: "Noise",
  value: "Value",
};

export function ReviewCard({
  review,
  showLandlordLink = true,
  canRespond = false,
  onResponseSubmitted,
}: ReviewCardProps) {
  const [flagOpen, setFlagOpen] = useState(false);
  const [responseOpen, setResponseOpen] = useState(false);

  const tenancy = review.tenancy_end
    ? `${formatMonthYear(review.tenancy_start)} – ${formatMonthYear(review.tenancy_end)}`
    : `Since ${formatMonthYear(review.tenancy_start)}`;

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <StarRating value={review.overall_rating} size="sm" />
              {review.verified_tenant && (
                <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified tenant
                </Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {review.landlord_relation}
              </Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {review.author_display_name} · {tenancy}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFlagOpen(true)}
            aria-label="Flag review"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {review.title && (
          <div className="font-medium">{review.title}</div>
        )}

        <p className="whitespace-pre-wrap text-sm text-foreground">{review.body}</p>

        {Object.keys(review.subratings).length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
            {Object.entries(review.subratings).map(([dim, score]) => (
              <div key={dim} className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">{DIMENSION_LABELS[dim] ?? dim}</span>
                <StarRating value={score} size="sm" />
              </div>
            ))}
          </div>
        )}

        {showLandlordLink && (
          <div className="text-xs text-muted-foreground">
            Landlord:{" "}
            <Link
              href={`/landlords/${review.landlord_entity_id}`}
              className="font-medium underline-offset-2 hover:underline"
            >
              {review.landlord_entity_name || "View landlord"}
            </Link>
          </div>
        )}

        {(review.response_body || canRespond) && <Separator />}

        {review.response_body && (
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              Response from landlord
            </div>
            <p className="whitespace-pre-wrap">{review.response_body}</p>
          </div>
        )}

        {canRespond && !review.response_body && (
          <>
            {!responseOpen ? (
              <Button size="sm" variant="outline" onClick={() => setResponseOpen(true)}>
                Respond to review
              </Button>
            ) : (
              <LandlordResponseForm
                reviewId={review.id}
                onCancel={() => setResponseOpen(false)}
                onSubmitted={() => {
                  setResponseOpen(false);
                  onResponseSubmitted?.();
                }}
              />
            )}
          </>
        )}

        <FlagReviewDialog
          reviewId={review.id}
          open={flagOpen}
          onOpenChange={setFlagOpen}
        />
      </CardContent>
    </Card>
  );
}
