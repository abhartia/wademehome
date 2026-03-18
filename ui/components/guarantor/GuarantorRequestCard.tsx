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
  Play,
  Copy,
  Building2,
} from "lucide-react";

const statusConfig: Record<
  GuarantorRequest["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "outline" },
  sent: { label: "Sent", variant: "default" },
  viewed: { label: "Viewed", variant: "secondary" },
  signed: { label: "Signed", variant: "secondary" },
  expired: { label: "Expired", variant: "destructive" },
  declined: { label: "Declined", variant: "destructive" },
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
  onSimulate?: () => void;
  onCopyVerification?: () => void;
}

export function GuarantorRequestCard({
  request,
  onSend,
  onDelete,
  onViewDetails,
  onSimulate,
  onCopyVerification,
}: GuarantorRequestCardProps) {
  const cfg = statusConfig[request.status];
  const latestTime =
    request.signedAt || request.viewedAt || request.sentAt || request.createdAt;

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
              {request.status === "signed" &&
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
                  : request.status === "viewed"
                    ? "Viewed"
                    : request.status === "sent"
                      ? "Sent"
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
          {(request.status === "sent" || request.status === "viewed") && (
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
                variant="secondary"
                onClick={onSimulate}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                <Play className="h-3 w-3" />
                Simulate Response
              </Button>
            </>
          )}
          {request.status === "signed" && (
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
                variant="secondary"
                onClick={onCopyVerification}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                <Copy className="h-3 w-3" />
                Copy Verification
              </Button>
            </>
          )}
          {(request.status === "expired" || request.status === "declined") && (
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
