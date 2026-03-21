"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AppHomePage() {
  return (
    <div className="h-[calc(100vh-3rem)] overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your portal is ready</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/search">Search listings</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tours">View tours</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">Update profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
