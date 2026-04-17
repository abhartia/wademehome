"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReviewsHome() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">Review moderation</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Link href="/admin/reviews/verifications">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Verification queue</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Approve or reject tenant proof uploads.
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/reviews/moderation">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Moderation queue</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Resolve flagged reviews (defamation, factual errors, spam).
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
