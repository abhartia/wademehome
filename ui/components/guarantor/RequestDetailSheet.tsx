"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  Send,
  XCircle,
  User,
  Building2,
  Calendar,
  Clock,
} from "lucide-react";
import { GuarantorRequest } from "@/lib/types/guarantor";
import { StatusTimeline } from "./StatusTimeline";
import { useGuarantor } from "@/components/providers/GuarantorProvider";

interface RequestDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: GuarantorRequest | null;
}

export function RequestDetailSheet({
  open,
  onOpenChange,
  request,
}: RequestDetailSheetProps) {
  const { sendRequest, decideRequest } = useGuarantor();

  if (!request) return null;

  const canCancel =
    request.status === "invited" || request.status === "opened";
  const canResend =
    request.status === "expired" || request.status === "declined" || request.status === "failed";

  async function handleCancel() {
    await decideRequest(request!.id, "revoked", "Cancelled by renter");
  }

  async function handleResend() {
    await sendRequest(request!.id);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Request Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {/* Verification */}
          {request.status === "verified" &&
            request.verificationStatus === "verified" && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Guarantor Verified
                  </p>
                  <p className="text-xs text-green-600">
                    Agreement signed and verified
                  </p>
                </div>
              </div>
            )}

          {/* Guarantor Info */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Guarantor
            </label>
            <div className="flex items-center gap-2.5 rounded-lg border p-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {request.guarantorSnapshot.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {request.guarantorSnapshot.email}
                </p>
              </div>
            </div>
          </div>

          {/* Lease Info */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Lease Details
            </label>
            <div className="space-y-2 rounded-lg border p-2.5">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{request.lease.propertyName}</span>
              </div>
              <p className="pl-5 text-xs text-muted-foreground">
                {request.lease.propertyAddress}
              </p>
              <div className="flex flex-wrap gap-3 pl-5">
                <span className="flex items-center gap-1 text-xs">
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                    {request.lease.monthlyRent}/mo
                  </Badge>
                </span>
                {request.lease.leaseStart && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Starts{" "}
                    {new Date(
                      request.lease.leaseStart + "T00:00:00",
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {request.lease.leaseTerm}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Status Timeline
            </label>
            <StatusTimeline
              history={request.statusHistory}
              currentStatus={request.status}
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={handleCancel}
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel Request
              </Button>
            )}
            {canResend && (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={handleResend}
              >
                <Send className="h-3.5 w-3.5" />
                Resend
              </Button>
            )}
            {request.status === "submitted" && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() =>
                  decideRequest(request.id, "verified", "Verified after review")
                }
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Mark Verified
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
