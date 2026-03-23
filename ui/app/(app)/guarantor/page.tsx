"use client";

import { useState } from "react";
import { useGuarantor } from "@/components/providers/GuarantorProvider";
import { GuarantorRequestCard } from "@/components/guarantor/GuarantorRequestCard";
import { NewRequestSheet } from "@/components/guarantor/NewRequestSheet";
import { RequestDetailSheet } from "@/components/guarantor/RequestDetailSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  ShieldCheck,
  Send,
  User,
  Pencil,
  Trash2,
  X,
  Check,
  FileText,
} from "lucide-react";
import {
  GuarantorRequest,
  SavedGuarantor,
  RELATIONSHIP_OPTIONS,
} from "@/lib/types/guarantor";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GuarantorPage() {
  const {
    savedGuarantors,
    addGuarantor,
    updateGuarantor,
    removeGuarantor,
    requests,
    sendRequest,
    removeRequest,
  } = useGuarantor();

  const { journeyStage } = useUserProfile();
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState<GuarantorRequest | null>(
    null,
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRelationship, setEditRelationship] =
    useState<SavedGuarantor["relationship"]>("parent");

  const [showAddGuarantor, setShowAddGuarantor] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addRelationship, setAddRelationship] =
    useState<SavedGuarantor["relationship"]>("parent");

  function startEdit(g: SavedGuarantor) {
    setEditingId(g.id);
    setEditName(g.name);
    setEditEmail(g.email);
    setEditPhone(g.phone);
    setEditRelationship(g.relationship);
  }

  async function saveEdit() {
    if (!editingId) return;
    await updateGuarantor(editingId, {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      relationship: editRelationship,
    });
    setEditingId(null);
  }

  async function handleAddGuarantor() {
    if (!addName.trim() || !addEmail.trim()) return;
    await addGuarantor({
      name: addName.trim(),
      email: addEmail.trim(),
      phone: addPhone.trim(),
      relationship: addRelationship,
    });
    setAddName("");
    setAddEmail("");
    setAddPhone("");
    setAddRelationship("parent");
    setShowAddGuarantor(false);
  }

  const activeRequests = requests.filter(
    (r) =>
      r.status === "invited" || r.status === "opened" || r.status === "consented" || r.status === "signed" || r.status === "submitted",
  );
  const completedRequests = requests.filter(
    (r) => r.status === "verified",
  );
  const draftRequests = requests.filter((r) => r.status === "draft");
  const otherRequests = requests.filter(
    (r) => r.status === "expired" || r.status === "declined" || r.status === "failed" || r.status === "revoked",
  );
  const hasSignedRequest = requests.some((r) => r.status === "verified");
  const showStagePrompt =
    hasSignedRequest &&
    journeyStage !== "lease-signed" &&
    journeyStage !== "moving" &&
    journeyStage !== "moved-in";

  return (
    <div className="h-[calc(100vh-3rem)] overflow-y-auto">
      {showStagePrompt && (
        <div className="flex items-center gap-2 border-b bg-green-50/50 px-4 py-2">
          <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
          <p className="flex-1 text-xs text-green-700">
            Guarantor verified! Update your journey stage when your lease is signed.
          </p>
          <Button variant="outline" size="sm" asChild className="h-6 gap-1 px-2 text-[10px]">
            <Link href="/profile">
              Update stage
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </Button>
        </div>
      )}
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Guarantor Signing
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage guarantor contacts and signing requests for your lease
              applications.
            </p>
          </div>
          <Button
            onClick={() => setNewRequestOpen(true)}
            className="gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            New Request
          </Button>
        </div>

        {/* Saved Guarantors */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold">Saved Guarantors</h2>
            {!showAddGuarantor && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => setShowAddGuarantor(true)}
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            )}
          </div>

          {savedGuarantors.length === 0 && !showAddGuarantor && (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                <User className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Save a guarantor to get started
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 gap-1.5"
                  onClick={() => setShowAddGuarantor(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Guarantor
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {savedGuarantors.map((g) =>
              editingId === g.id ? (
                <Card key={g.id} className="border-primary py-0">
                  <CardContent className="space-y-2 p-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Full name"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Email"
                      type="email"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Phone"
                      type="tel"
                      className="h-8 text-sm"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {RELATIONSHIP_OPTIONS.map((opt) => (
                        <Badge
                          key={opt.value}
                          variant={
                            editRelationship === opt.value
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer px-2 py-0.5 text-xs"
                          onClick={() => setEditRelationship(opt.value)}
                        >
                          {opt.label}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={saveEdit}
                      >
                        <Check className="h-3 w-3" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 text-xs"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card key={g.id} className="py-0">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">{g.name}</span>
                        <Badge
                          variant="secondary"
                          className="px-1.5 py-0 text-[10px] capitalize"
                        >
                          {g.relationship}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {g.email}
                        {g.phone ? ` · ${g.phone}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => startEdit(g)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => void removeGuarantor(g.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}

            {/* Add new guarantor inline form */}
            {showAddGuarantor && (
              <Card className="border-dashed py-0">
                <CardContent className="space-y-2 p-3">
                  <Input
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="Full name"
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Input
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="Phone"
                    type="tel"
                    className="h-8 text-sm"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {RELATIONSHIP_OPTIONS.map((opt) => (
                      <Badge
                        key={opt.value}
                        variant={
                          addRelationship === opt.value ? "default" : "outline"
                        }
                        className="cursor-pointer px-2 py-0.5 text-xs"
                        onClick={() => setAddRelationship(opt.value)}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={handleAddGuarantor}
                      disabled={!addName.trim() || !addEmail.trim()}
                    >
                      <Plus className="h-3 w-3" />
                      Save Contact
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 gap-1 text-xs"
                      onClick={() => setShowAddGuarantor(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator />

        {/* Signing Requests */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Signing Requests</h2>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => setNewRequestOpen(true)}
            >
              <Plus className="h-3 w-3" />
              New Request
            </Button>
          </div>

          {requests.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No signing requests yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 gap-1.5"
                  onClick={() => setNewRequestOpen(true)}
                >
                  <Send className="h-3.5 w-3.5" />
                  Create Request
                </Button>
              </CardContent>
            </Card>
          )}

          {activeRequests.length > 0 && (
            <div className="mb-4 space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                Active
              </h3>
              {activeRequests.map((req) => (
                <GuarantorRequestCard
                  key={req.id}
                  request={req}
                  onViewDetails={() => setDetailRequest(req)}
                  onSend={() => void sendRequest(req.id)}
                />
              ))}
            </div>
          )}

          {draftRequests.length > 0 && (
            <div className="mb-4 space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                Drafts
              </h3>
              {draftRequests.map((req) => (
                <GuarantorRequestCard
                  key={req.id}
                  request={req}
                  onSend={() => void sendRequest(req.id)}
                  onDelete={() => void removeRequest(req.id)}
                  onViewDetails={() => setDetailRequest(req)}
                />
              ))}
            </div>
          )}

          {completedRequests.length > 0 && (
            <div className="mb-4 space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                Completed
              </h3>
              {completedRequests.map((req) => (
                <GuarantorRequestCard
                  key={req.id}
                  request={req}
                  onViewDetails={() => setDetailRequest(req)}
                />
              ))}
            </div>
          )}

          {otherRequests.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                Expired / Declined
              </h3>
              {otherRequests.map((req) => (
                <GuarantorRequestCard
                  key={req.id}
                  request={req}
                  onSend={() => void sendRequest(req.id)}
                  onDelete={() => void removeRequest(req.id)}
                  onViewDetails={() => setDetailRequest(req)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <NewRequestSheet
        open={newRequestOpen}
        onOpenChange={setNewRequestOpen}
      />
      <RequestDetailSheet
        open={!!detailRequest}
        onOpenChange={(open) => !open && setDetailRequest(null)}
        request={detailRequest}
      />
    </div>
  );
}
