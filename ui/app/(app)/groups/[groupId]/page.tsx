"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  LogOut,
  Mail,
  Link as LinkIcon,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserMinus,
  UserPlus,
  UserSearch,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveGroup } from "@/lib/groups/activeGroup";
import { useGroupApplicants } from "@/lib/applicants/api";
import { GroupPreferencesCard } from "@/components/groups/GroupPreferencesCard";
import {
  useCreateInvite,
  useDeleteGroup,
  useGroupInvites,
  useGroupMembers,
  useLeaveGroup,
  useMyGroups,
  useRemoveMember,
  useRenameGroup,
  useRevokeInvite,
  useUpdateMemberRole,
} from "@/lib/groups/api";

type PageProps = { params: Promise<{ groupId: string }> };

function initials(email: string | null | undefined) {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

export default function GroupDetailPage(props: PageProps) {
  const { groupId } = use(props.params);
  const router = useRouter();
  const { setActiveGroupId } = useActiveGroup();
  const myGroupsQuery = useMyGroups();
  const group = useMemo(
    () => myGroupsQuery.data?.groups.find((g) => g.id === groupId) ?? null,
    [myGroupsQuery.data, groupId],
  );
  const isOwner = group?.role === "owner";

  const membersQuery = useGroupMembers(groupId);
  const invitesQuery = useGroupInvites(groupId);
  const applicantsQuery = useGroupApplicants(groupId);
  const renameGroup = useRenameGroup(groupId);
  const deleteGroup = useDeleteGroup();
  const leaveGroup = useLeaveGroup();
  const removeMember = useRemoveMember(groupId);
  const updateMemberRole = useUpdateMemberRole(groupId);
  const createInvite = useCreateInvite(groupId);
  const revokeInvite = useRevokeInvite(groupId);

  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(group?.name ?? "");
  const [inviteEmail, setInviteEmail] = useState("");

  async function handleRename() {
    const name = newName.trim();
    if (!name) return;
    try {
      await renameGroup.mutateAsync(name);
      setRenameOpen(false);
      toast.success("Renamed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Rename failed");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${group?.name}"? This cannot be undone.`)) return;
    try {
      await deleteGroup.mutateAsync(groupId);
      setActiveGroupId(null);
      toast.success("Group deleted");
      router.push("/groups");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleLeave() {
    if (!confirm(`Leave "${group?.name}"?`)) return;
    try {
      await leaveGroup.mutateAsync(groupId);
      setActiveGroupId(null);
      toast.success("Left group");
      router.push("/groups");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Leave failed");
    }
  }

  async function handleInviteEmail() {
    const email = inviteEmail.trim();
    if (!email) return;
    try {
      await createInvite.mutateAsync({ kind: "email", email });
      setInviteEmail("");
      toast.success(`Invite email sent to ${email}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invite failed");
    }
  }

  async function handleShareLink() {
    try {
      const invite = await createInvite.mutateAsync({ kind: "link" });
      await navigator.clipboard.writeText(invite.accept_url);
      toast.success("Share link copied to clipboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create link");
    }
  }

  async function copyExistingLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  async function handleRemoveMember(userId: string, email: string) {
    if (!confirm(`Remove ${email} from the group?`)) return;
    try {
      await removeMember.mutateAsync(userId);
      toast.success("Member removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed");
    }
  }

  async function handleMakeOwner(userId: string, email: string) {
    if (!confirm(`Make ${email} an owner? They'll have full control of the group.`))
      return;
    try {
      await updateMemberRole.mutateAsync({ userId, role: "owner" });
      toast.success(`${email} is now an owner`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Promote failed");
    }
  }

  async function handleRemoveOwner(userId: string, email: string) {
    if (!confirm(`Remove owner role from ${email}?`)) return;
    try {
      await updateMemberRole.mutateAsync({ userId, role: "member" });
      toast.success(`${email} is now a member`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Demote failed");
    }
  }

  async function handleRevokeInvite(id: string) {
    try {
      await revokeInvite.mutateAsync(id);
      toast.success("Invite revoked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Revoke failed");
    }
  }

  if (myGroupsQuery.isLoading) {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
          <Skeleton className="h-8 w-60" />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
          <Link href="/groups" className="text-sm text-muted-foreground">
            <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
            Groups
          </Link>
          <p className="mt-6">Group not found or you&apos;re not a member.</p>
        </div>
      </div>
    );
  }

  const members = membersQuery.data?.members ?? [];
  const activeInvites = (invitesQuery.data?.invites ?? []).filter(
    (inv) => !inv.revoked_at && !inv.accepted_at,
  );

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <Link href="/groups" className="text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
        Groups
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{group.name}</h1>
          <p className="text-sm text-muted-foreground">
            {group.member_count} member{group.member_count === 1 ? "" : "s"} •{" "}
            {isOwner ? "You are the owner" : "You are a member"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setActiveGroupId(group.id);
              router.push("/search");
            }}
          >
            Search in this group
          </Button>
          {isOwner && (
            <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNewName(group.name)}
                >
                  Rename
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename group</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 py-2">
                  <Label htmlFor="rename">Name</Label>
                  <Input
                    id="rename"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    maxLength={120}
                  />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setRenameOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRename} disabled={renameGroup.isPending}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Invite</CardTitle>
          <CardDescription>
            Email magic link or copy a shareable join link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="partner@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              onClick={handleInviteEmail}
              disabled={createInvite.isPending || !inviteEmail.trim()}
            >
              Send email invite
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLink}
              disabled={createInvite.isPending}
            >
              <LinkIcon className="h-4 w-4" />
              Copy share link
            </Button>
            <span className="text-xs text-muted-foreground">
              Anyone with the link can join after signing in.
            </span>
          </div>

          {activeInvites.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Active invites
              </div>
              {activeInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-2 rounded border px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {inv.kind}
                      </Badge>
                      <span className="truncate">
                        {inv.email ?? "Anyone with link"}
                      </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {inv.accept_url}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyExistingLink(inv.accept_url)}
                      aria-label="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevokeInvite(inv.id)}
                      aria-label="Revoke"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <GroupPreferencesCard groupId={groupId} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Applicants</CardTitle>
          <CardDescription>
            Track people interested in joining this group — for example, a 3rd
            housemate or someone taking over a room.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {applicantsQuery.isLoading
              ? "Loading…"
              : `${(applicantsQuery.data?.applicants ?? []).filter((a) => a.name || a.email).length} applicant${
                  (applicantsQuery.data?.applicants ?? []).filter(
                    (a) => a.name || a.email,
                  ).length === 1
                    ? ""
                    : "s"
                }`}
          </div>
          <Button
            onClick={() => router.push(`/groups/${group.id}/applicants`)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Manage applicants
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Find a roommate</CardTitle>
          <CardDescription>
            Browse compatible matches scored against everyone in this group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setActiveGroupId(group.id);
              router.push(`/roommates?g=${group.id}`);
            }}
            className="gap-2"
          >
            <UserSearch className="h-4 w-4" />
            Find a roommate
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {members.map((m) => (
            <div key={m.user_id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {initials(m.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm">{m.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.role === "owner" ? "Owner" : "Member"}
                  </div>
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-1">
                  {m.role === "owner" ? (
                    members.filter((x) => x.role === "owner").length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOwner(m.user_id, m.email)}
                        disabled={updateMemberRole.isPending}
                      >
                        <ShieldOff className="h-4 w-4" />
                        Remove owner
                      </Button>
                    )
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMakeOwner(m.user_id, m.email)}
                        disabled={updateMemberRole.isPending}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Make owner
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(m.user_id, m.email)}
                      >
                        <UserMinus className="h-4 w-4" />
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {!isOwner && (
          <Button variant="outline" onClick={handleLeave}>
            <LogOut className="h-4 w-4" />
            Leave group
          </Button>
        )}
        {isOwner && (
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete group
          </Button>
        )}
      </div>
      </div>
    </div>
  );
}
