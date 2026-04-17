"use client";

import { use, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Upload } from "lucide-react";
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

import { postVerificationUploadReviewsReviewIdVerificationUploadPost } from "@/lib/api/generated/sdk.gen";

type ProofType = "lease" | "utility_bill" | "rent_receipt" | "mail";

export default function VerifyReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [proofType, setProofType] = useState<ProofType>("lease");
  const [file, setFile] = useState<File | null>(null);
  const [tenancyStart, setTenancyStart] = useState("");
  const [tenancyEnd, setTenancyEnd] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Pick a file first");
      const { data, error } =
        await postVerificationUploadReviewsReviewIdVerificationUploadPost({
          path: { review_id: id },
          body: {
            file,
            proof_type: proofType,
            tenancy_start: tenancyStart || undefined,
            tenancy_end: tenancyEnd || undefined,
          },
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Proof uploaded. Admin will review shortly.");
      router.push("/account/reviews");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    },
  });

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
      <Button asChild variant="ghost" size="sm">
        <Link href="/account/reviews">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold">Upload tenancy proof</h1>
      <p className="text-sm text-muted-foreground">
        Upload a lease page, utility bill, rent receipt, or postmarked mail
        showing you lived at this address. Admin reviews uploads before the
        Verified tenant badge appears on your review.
      </p>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-1">
            <Label>Proof type</Label>
            <Select
              value={proofType}
              onValueChange={(v) => setProofType(v as ProofType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lease">Lease</SelectItem>
                <SelectItem value="utility_bill">Utility bill</SelectItem>
                <SelectItem value="rent_receipt">Rent receipt</SelectItem>
                <SelectItem value="mail">Postmarked mail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>File (PDF or image)</Label>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {file ? "Replace file" : "Choose file"}
              </Button>
              {file && (
                <span className="truncate text-xs text-muted-foreground">
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Redact sensitive fields (SSN, bank info) before uploading.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Tenancy start</Label>
              <Input
                type="date"
                value={tenancyStart}
                onChange={(e) => setTenancyStart(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Tenancy end</Label>
              <Input
                type="date"
                value={tenancyEnd}
                onChange={(e) => setTenancyEnd(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={() => mutation.mutate()}
            disabled={!file || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Uploading…" : "Submit proof"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
