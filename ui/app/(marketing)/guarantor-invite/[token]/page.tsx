"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type InviteContext = {
  request_id: string;
  guarantor_name: string;
  guarantor_email: string;
  status: string;
  invite_expires_at: string;
  lease: {
    property_name: string;
    property_address: string;
    monthly_rent: string;
    lease_start: string;
    lease_term: string;
  };
};

const CONSENT_VERSION = "v1";

export default function GuarantorInvitePage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_CHAT_API_URL ??
    "";

  const [context, setContext] = useState<InviteContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const [signatureEmail, setSignatureEmail] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [documentType, setDocumentType] = useState("income-proof");
  const [filename, setFilename] = useState("");
  const [storageKey, setStorageKey] = useState("");
  const [declineNote, setDeclineNote] = useState("");

  const api = useMemo(
    () => `${baseUrl.replace(/\/$/, "")}/guarantor-invite/${token}`,
    [baseUrl, token],
  );

  const refreshContext = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch(api, { credentials: "include" });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.detail || "Unable to load invite");
      setLoading(false);
      return;
    }
    setContext(await response.json());
    setLoading(false);
  }, [api]);

  const post = useCallback(async (path: string, body?: unknown) => {
    setError("");
    const response = await fetch(`${api}/${path}`, {
      method: "POST",
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.detail || "Request failed");
      return false;
    }
    await refreshContext();
    return true;
  }, [api, refreshContext]);

  useEffect(() => {
    if (!token) return;
    void refreshContext();
  }, [token, refreshContext]);

  if (loading) return <div className="mx-auto max-w-2xl p-6 text-sm">Loading invite...</div>;
  if (error) return <div className="mx-auto max-w-2xl p-6 text-sm text-destructive">{error}</div>;
  if (!context) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Guarantor E-Sign Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{context.status}</Badge>
            <span className="text-muted-foreground">
              Expires {new Date(context.invite_expires_at).toLocaleString()}
            </span>
          </div>
          <p><strong>Guarantor:</strong> {context.guarantor_name} ({context.guarantor_email})</p>
          <p><strong>Property:</strong> {context.lease.property_name}</p>
          <p><strong>Address:</strong> {context.lease.property_address}</p>
          <p><strong>Rent:</strong> {context.lease.monthly_rent}</p>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => void post("open")}>Acknowledge & Open</Button>
            <Button variant="outline" onClick={() => void post("consent", { consent_text_version: CONSENT_VERSION })}>
              Accept E-Sign Consent
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Signer full name" value={signatureName} onChange={(e) => setSignatureName(e.target.value)} />
          <Input placeholder="Signer email" type="email" value={signatureEmail} onChange={(e) => setSignatureEmail(e.target.value)} />
          <Textarea placeholder="Type your legal signature" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} />
          <Button
            onClick={() =>
              void post("sign", {
                signer_name: signatureName,
                signer_email: signatureEmail,
                signature_text: signatureText,
                consent_text_version: CONSENT_VERSION,
              })
            }
            disabled={!signatureName.trim() || !signatureEmail.trim() || !signatureText.trim()}
          >
            Submit Signature
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supporting Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Document type (e.g. income-proof)" value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
          <Input placeholder="Filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
          <Input placeholder="Storage key (uploaded object path)" value={storageKey} onChange={(e) => setStorageKey(e.target.value)} />
          <Button
            variant="outline"
            onClick={() =>
              void post("documents", {
                document_type: documentType,
                filename,
                content_type: "application/octet-stream",
                byte_size: 1,
                storage_key: storageKey,
                metadata_json: {},
              })
            }
            disabled={!documentType.trim() || !filename.trim() || !storageKey.trim()}
          >
            Submit Document Metadata
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Decline Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea placeholder="Reason for decline (optional)" value={declineNote} onChange={(e) => setDeclineNote(e.target.value)} />
          <Button variant="destructive" onClick={() => void post("decline", { note: declineNote })}>
            Decline Invite
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
