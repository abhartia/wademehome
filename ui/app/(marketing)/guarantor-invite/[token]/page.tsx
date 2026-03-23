"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  consentGuarantorInviteGuarantorInviteTokenConsentPostMutation,
  declineGuarantorInviteGuarantorInviteTokenDeclinePostMutation,
  openGuarantorInviteGuarantorInviteTokenOpenPostMutation,
  readGuarantorInviteGuarantorInviteTokenGetOptions,
  readGuarantorInviteGuarantorInviteTokenGetQueryKey,
  signGuarantorInviteGuarantorInviteTokenSignPostMutation,
  uploadGuarantorInviteDocumentsGuarantorInviteTokenDocumentsPostMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";

const CONSENT_VERSION = "v1";
const TERMINAL_STATUSES = new Set(["verified", "failed", "declined", "expired", "revoked"]);
const STATUS_LABELS: Record<string, string> = {
  invited: "Invite sent",
  opened: "Invite opened",
  consented: "Consent accepted",
  signed: "Signed",
  submitted: "Documents submitted",
  verified: "Verified",
  failed: "Verification failed",
  declined: "Declined",
  expired: "Expired",
  revoked: "Revoked",
};

export default function GuarantorInvitePage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const [signatureEmail, setSignatureEmail] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [documentType, setDocumentType] = useState("income-proof");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [declineNote, setDeclineNote] = useState("");

  const contextOptions = useMemo(
    () =>
      readGuarantorInviteGuarantorInviteTokenGetOptions({
        path: { token },
      }),
    [token],
  );
  const contextQuery = useQuery({
    ...contextOptions,
    enabled: Boolean(token),
  });
  const context = contextQuery.data;

  const openMut = useMutation(
    openGuarantorInviteGuarantorInviteTokenOpenPostMutation(),
  );
  const consentMut = useMutation(
    consentGuarantorInviteGuarantorInviteTokenConsentPostMutation(),
  );
  const signMut = useMutation(
    signGuarantorInviteGuarantorInviteTokenSignPostMutation(),
  );
  const uploadMut = useMutation(
    uploadGuarantorInviteDocumentsGuarantorInviteTokenDocumentsPostMutation(),
  );
  const declineMut = useMutation(
    declineGuarantorInviteGuarantorInviteTokenDeclinePostMutation(),
  );

  const isMutating =
    openMut.isPending ||
    consentMut.isPending ||
    signMut.isPending ||
    uploadMut.isPending ||
    declineMut.isPending;

  async function refreshContext() {
    await queryClient.invalidateQueries({
      queryKey: readGuarantorInviteGuarantorInviteTokenGetQueryKey({
        path: { token },
      }),
    });
  }

  async function runAction(
    action: () => Promise<unknown>,
    successMessage: string,
  ) {
    setActionError("");
    setActionSuccess("");
    try {
      await action();
      await refreshContext();
      setActionSuccess(successMessage);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Request failed");
    }
  }

  if (contextQuery.isLoading) {
    return <div className="mx-auto max-w-2xl p-6 text-sm">Loading invite...</div>;
  }
  if (contextQuery.isError || !context) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sm text-destructive">
        Unable to load invite. This link may be invalid or expired.
      </div>
    );
  }

  const status = context.status;
  const isTerminal = TERMINAL_STATUSES.has(status);
  const canOpen = status === "invited";
  const canConsent = status === "invited" || status === "opened";
  const canSign = status === "opened" || status === "consented";
  const canUpload = status === "signed" || status === "submitted";
  const canDecline = !isTerminal;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Guarantor Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{STATUS_LABELS[status] ?? status}</Badge>
            <span className="text-muted-foreground">
              Expires {new Date(context.invite_expires_at).toLocaleString()}
            </span>
          </div>
          <p>
            <strong>Guarantor:</strong> {context.guarantor_name} ({context.guarantor_email})
          </p>
          <p><strong>Property:</strong> {context.lease.property_name}</p>
          <p><strong>Address:</strong> {context.lease.property_address}</p>
          <p><strong>Monthly rent:</strong> {context.lease.monthly_rent}</p>
          <div className="rounded-md border p-3 text-xs">
            <p className="font-medium">What to do next</p>
            <p className="mt-1 text-muted-foreground">
              1) Acknowledge request 2) Accept consent 3) Sign 4) Upload one supporting document.
            </p>
          </div>
          {actionSuccess ? (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
              {actionSuccess}
            </div>
          ) : null}
          {actionError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              {actionError}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Acknowledge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Confirm you have reviewed the request details.
          </p>
          <Button
            onClick={() =>
              void runAction(
                () => openMut.mutateAsync({ path: { token } }),
                "Invite acknowledged.",
              )
            }
            disabled={!canOpen || isMutating}
          >
            Acknowledge and continue
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 2: E-sign consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            You consent to electronically sign this guarantor request (version {CONSENT_VERSION}).
          </p>
          <Button
            variant="outline"
            onClick={() =>
              void runAction(
                () =>
                  consentMut.mutateAsync({
                    path: { token },
                    body: { consent_text_version: CONSENT_VERSION },
                  }),
                "Consent accepted.",
              )
            }
            disabled={!canConsent || isMutating}
          >
            Accept e-sign consent
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Signer full name" value={signatureName} onChange={(e) => setSignatureName(e.target.value)} />
          <Input placeholder="Signer email" type="email" value={signatureEmail} onChange={(e) => setSignatureEmail(e.target.value)} />
          <Textarea placeholder="Type your legal signature exactly as your name" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} />
          <Button
            onClick={() =>
              void runAction(
                () =>
                  signMut.mutateAsync({
                    path: { token },
                    body: {
                      signer_name: signatureName,
                      signer_email: signatureEmail,
                      signature_text: signatureText,
                      consent_text_version: CONSENT_VERSION,
                    },
                  }),
                "Signature submitted.",
              )
            }
            disabled={!canSign || isMutating || !signatureName.trim() || !signatureEmail.trim() || !signatureText.trim()}
          >
            Submit Signature
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 4: Supporting document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Upload one supporting document, such as proof of income.
          </p>
          <Input placeholder="Document type (e.g. income-proof)" value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
          <Input type="file" onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)} />
          <Button
            variant="outline"
            onClick={() =>
              void runAction(
                () =>
                  uploadMut.mutateAsync({
                    path: { token },
                    body: {
                      document_type: documentType,
                      file: documentFile as File,
                    },
                  }),
                "Document uploaded and request submitted.",
              )
            }
            disabled={!canUpload || isMutating || !documentType.trim() || !documentFile}
          >
            Upload Document
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Decline request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea placeholder="Reason for decline (optional)" value={declineNote} onChange={(e) => setDeclineNote(e.target.value)} />
          <Button
            variant="destructive"
            onClick={() =>
              void runAction(
                () =>
                  declineMut.mutateAsync({
                    path: { token },
                    body: { note: declineNote },
                  }),
                "Invite declined.",
              )
            }
            disabled={!canDecline || isMutating}
          >
            Decline Invite
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
