"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  postClaimLandlordEntitiesEntityIdClaimPost,
} from "@/lib/api/generated/sdk.gen";
import {
  readEntityLandlordEntitiesEntityIdGetOptions,
} from "@/lib/api/generated/@tanstack/react-query.gen";

export default function ClaimLandlordPage({
  params,
}: {
  params: Promise<{ entityId: string }>;
}) {
  const { entityId } = use(params);
  const router = useRouter();
  const entityQ = useQuery(
    readEntityLandlordEntitiesEntityIdGetOptions({ path: { entity_id: entityId } })
  );
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await postClaimLandlordEntitiesEntityIdClaimPost({
        path: { entity_id: entityId },
        body: {
          display_name: displayName || null,
          company_name: companyName || null,
          phone_number: phone || null,
          notes: notes || null,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Claim submitted — admin will review shortly.");
      router.push(`/landlords/${entityId}`);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Could not submit claim");
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/landlords/${entityId}`}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold">
        Claim {entityQ.data?.canonical_name ?? "landlord"}
      </h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-1">
            <Label>Your display name</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Company name</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Phone number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>
              Notes for admin (e.g. deed link, LLC registration, proof of
              ownership)
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Submitting…" : "Submit claim"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
