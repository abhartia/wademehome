"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Check } from "lucide-react";

const FEATURES = [
  "Room-by-room photo capture",
  "Automatic timestamps and GPS coordinates",
  "Printable condition report for your records",
];

export function GuestPhotoDocsCTA() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">
              Protect your security deposit
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Take timestamped, geotagged photos of every room on move-in day.
              If your landlord tries to charge you for pre-existing damage,
              you will have evidence.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <ul className="space-y-1.5">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
              {f}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/signup">Sign up to use</Link>
          </Button>
          <Badge variant="secondary">Free</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
