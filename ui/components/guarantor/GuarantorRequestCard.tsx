"use client";

import { GuarantorRequest } from "@/lib/types/guarantor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Send,
  Trash2,
  Eye,
  Building2,
} from "lucide-react";

const statusConfig: Record<
  GuarantorRequest["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "outline" },
  invited: { label: "Invited", variant: "default" },
  opened: { label: "Opened", variant: "secondary" },
  consented: { label: "Consented", variant: "secondary" },
  signed: { label: "Signed", variant: "secondary" },
  submitted: { label: "Submitted", variant: "secondary" },
  verified: { label: "Verified", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
  expired: { label: "Expired", variant: "destructive" },
  declined: { label: "Declined", variant: "destructive" },
  revoked: { label: "Revoked", variant: "destructive" },
};

function timeAgo(iso: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface GuarantorRequestCardProps {
  request: GuarantorRequest;
  onSend?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export function GuarantorRequestCard({
  request,
  onSend,
  onDelete,
  onViewDetails,
}: GuarantorRequestCardProps) {
  const cfg = statusConfig[request.status];
  const latestTime = request.signedAt || request.viewedAt || request.sentAt || request.createdAt;

  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-medium">
                {request.guarantorSnapshot.name}
              </span>
              <Badge variant={cfg.variant} className="text-[10px] px-1.5 py-0">
                {cfg.label}
              </Badge>
              {request.status === "verified" &&
                request.verificationStatus === "verified" && (
                  <Badge
                    variant="outline"
                    className="gap-0.5 border-green-200 bg-green-50 px-1.5 py-0 text-[10px] text-green-700"
                  >
                    <ShieldCheck className="h-2.5 w-2.5" />
                    Verified
                  </Badge>
                )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {request.lease.propertyName} &middot;{" "}
                {request.lease.monthlyRent}/mo
              </span>
            </div>

            {latestTime && (
              <p className="text-[11px] text-muted-foreground">
                {request.status === "signed"
                  ? "Signed"
                  : request.status === "opened"
                    ? "Opened"
                    : request.status === "invited"
                      ? "Invited"
                      : "Created"}{" "}
                {timeAgo(latestTime)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {request.status === "draft" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={onSend}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                <Send className="h-3 w-3" />
                Send
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="h-7 gap-1 px-2 text-xs text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </>
          )}
          {(request.status === "invited" || request.status === "opened" || request.status === "consented") && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onViewDetails}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                <Eye className="h-3 w-3" />
                View Details
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={onSend}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                <Send className="h-3 w-3" />
                Resend Email
              </Button>
            </>
          )}
          {(request.status === "signed" || request.status === "submitted" || request.status === "verified") && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onViewDetails}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                <Eye className="h-3 w-3" />
                View Details
              </Button>
            </>
          )}
          {(request.status === "expired" || request.status === "declined" || request.status === "failed" || request.status === "revoked") && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={onSend}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                <Send className="h-3 w-3" />
                Resend
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="h-7 gap-1 px-2 text-xs text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
