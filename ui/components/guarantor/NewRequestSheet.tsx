"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Send,
  Save,
  Check,
  User,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGuarantor } from "@/components/providers/GuarantorProvider";
import { useTours } from "@/components/providers/ToursProvider";
import {
  LeaseInfo,
  SavedGuarantor,
  RELATIONSHIP_OPTIONS,
  LEASE_TERM_OPTIONS,
} from "@/lib/types/guarantor";

interface NewRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewRequestSheet({ open, onOpenChange }: NewRequestSheetProps) {
  const { savedGuarantors, addGuarantor, addRequest, sendRequest } =
    useGuarantor();
  const { tours } = useTours();

  const [selectedGuarantorId, setSelectedGuarantorId] = useState("");
  const [showNewGuarantor, setShowNewGuarantor] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelationship, setNewRelationship] =
    useState<SavedGuarantor["relationship"]>("parent");

  const [useManualProperty, setUseManualProperty] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState("");
  const [lease, setLease] = useState<LeaseInfo>({
    propertyName: "",
    propertyAddress: "",
    monthlyRent: "",
    leaseStart: "",
    leaseTerm: "12 months",
  });

  const completedTours = tours.filter((t) => t.status === "completed");
  const otherTours = tours.filter(
    (t) => t.status !== "completed" && t.status !== "cancelled",
  );

  function selectTour(tourId: string) {
    setSelectedTourId(tourId);
    const tour = tours.find((t) => t.id === tourId);
    if (tour) {
      setLease((prev) => ({
        ...prev,
        propertyName: tour.property.name,
        propertyAddress: tour.property.address,
        monthlyRent: tour.property.rent.replace("/mo", ""),
      }));
    }
  }

  function reset() {
    setSelectedGuarantorId("");
    setShowNewGuarantor(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewRelationship("parent");
    setSelectedTourId("");
    setUseManualProperty(false);
    setLease({
      propertyName: "",
      propertyAddress: "",
      monthlyRent: "",
      leaseStart: "",
      leaseTerm: "12 months",
    });
  }

  function resolveGuarantorId(): string | null {
    if (selectedGuarantorId) return selectedGuarantorId;
    if (showNewGuarantor && newName.trim() && newEmail.trim()) {
      return addGuarantor({
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        relationship: newRelationship,
      });
    }
    return null;
  }

  function canSubmit() {
    const hasGuarantor =
      !!selectedGuarantorId ||
      (showNewGuarantor && newName.trim() && newEmail.trim());
    const hasProperty =
      lease.propertyName.trim() && lease.monthlyRent.trim();
    return hasGuarantor && hasProperty;
  }

  function handleSend() {
    const gId = resolveGuarantorId();
    if (!gId) return;
    const requestId = addRequest(gId, lease);
    sendRequest(requestId);
    reset();
    onOpenChange(false);
  }

  function handleDraft() {
    const gId = resolveGuarantorId();
    if (!gId) return;
    addRequest(gId, lease);
    reset();
    onOpenChange(false);
  }

  const availableProperties = [...completedTours, ...otherTours];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Signing Request</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {/* Guarantor Picker */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Guarantor
            </label>

            {savedGuarantors.length > 0 && !showNewGuarantor && (
              <div className="space-y-1.5">
                {savedGuarantors.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGuarantorId(g.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg border p-2.5 text-left transition-colors ${
                      selectedGuarantorId === g.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{g.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {g.email}
                      </p>
                    </div>
                    {selectedGuarantorId === g.id && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => {
                    setShowNewGuarantor(true);
                    setSelectedGuarantorId("");
                  }}
                >
                  <Plus className="h-3 w-3" />
                  Add new guarantor
                </Button>
              </div>
            )}

            {(showNewGuarantor || savedGuarantors.length === 0) && (
              <div className="space-y-2 rounded-lg border p-3">
                {savedGuarantors.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-1 text-xs"
                    onClick={() => {
                      setShowNewGuarantor(false);
                    }}
                  >
                    <ChevronUp className="h-3 w-3" />
                    Pick existing
                  </Button>
                )}
                <Input
                  placeholder="Full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Email address"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Phone number"
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="h-8 text-sm"
                />
                <div className="flex flex-wrap gap-1.5">
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <Badge
                      key={opt.value}
                      variant={
                        newRelationship === opt.value ? "default" : "outline"
                      }
                      className="cursor-pointer px-2 py-0.5 text-xs"
                      onClick={() => setNewRelationship(opt.value)}
                    >
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Property / Lease */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Property
            </label>

            {!useManualProperty && availableProperties.length > 0 ? (
              <div className="space-y-1.5">
                {availableProperties.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => selectTour(t.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-colors ${
                      selectedTourId === t.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{t.property.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.property.address} &middot; {t.property.rent}
                      </p>
                    </div>
                    {selectedTourId === t.id && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => {
                    setUseManualProperty(true);
                    setSelectedTourId("");
                    setLease((prev) => ({
                      ...prev,
                      propertyName: "",
                      propertyAddress: "",
                      monthlyRent: "",
                    }));
                  }}
                >
                  <ChevronDown className="h-3 w-3" />
                  Enter manually
                </Button>
              </div>
            ) : (
              <div className="space-y-2 rounded-lg border p-3">
                {availableProperties.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-1 text-xs"
                    onClick={() => setUseManualProperty(false)}
                  >
                    <ChevronUp className="h-3 w-3" />
                    Pick from tours
                  </Button>
                )}
                <Input
                  placeholder="Property name"
                  value={lease.propertyName}
                  onChange={(e) =>
                    setLease((prev) => ({
                      ...prev,
                      propertyName: e.target.value,
                    }))
                  }
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Address"
                  value={lease.propertyAddress}
                  onChange={(e) =>
                    setLease((prev) => ({
                      ...prev,
                      propertyAddress: e.target.value,
                    }))
                  }
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Monthly rent (e.g. $3,200)"
                  value={lease.monthlyRent}
                  onChange={(e) =>
                    setLease((prev) => ({
                      ...prev,
                      monthlyRent: e.target.value,
                    }))
                  }
                  className="h-8 text-sm"
                />
              </div>
            )}
          </div>

          {/* Lease details */}
          <div className="space-y-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Lease Start Date
            </label>
            <Input
              type="date"
              value={lease.leaseStart}
              onChange={(e) =>
                setLease((prev) => ({ ...prev, leaseStart: e.target.value }))
              }
              className="h-8 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Lease Term
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LEASE_TERM_OPTIONS.map((term) => (
                <Badge
                  key={term}
                  variant={lease.leaseTerm === term ? "default" : "outline"}
                  className="cursor-pointer px-2.5 py-0.5 text-xs"
                  onClick={() =>
                    setLease((prev) => ({ ...prev, leaseTerm: term }))
                  }
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSend}
              disabled={!canSubmit()}
              className="flex-1 gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Send to Guarantor
            </Button>
            <Button
              variant="outline"
              onClick={handleDraft}
              disabled={!canSubmit()}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              Draft
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
