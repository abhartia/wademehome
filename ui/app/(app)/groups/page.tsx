"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Users, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import posthog from "posthog-js";
import { useActiveGroup } from "@/lib/groups/activeGroup";
import { useCreateGroup, useMyGroups } from "@/lib/groups/api";

export default function GroupsPage() {
  const groupsQuery = useMyGroups();
  const createGroup = useCreateGroup();
  const { setActiveGroupId } = useActiveGroup();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    try {
      const group = await createGroup.mutateAsync(name);
      posthog.capture("group_created", { group_id: group.id, group_name: group.name });
      setActiveGroupId(group.id);
      setCreateOpen(false);
      setNewName("");
      toast.success(`Created "${group.name}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create group");
    }
  }

  const groups = groupsQuery.data?.groups ?? [];

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Groups</h1>
          <p className="text-sm text-muted-foreground">
            Share favorites, notes, reactions, and tours with a partner or small group.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a group</DialogTitle>
              <DialogDescription>
                Give it a name you&apos;ll recognize, e.g. &quot;Apartment hunt w/ spouse&quot;.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="group-name">Group name</Label>
              <Input
                id="group-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Apartment hunt"
                autoFocus
                maxLength={120}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createGroup.isPending || !newName.trim()}
              >
                {createGroup.isPending ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {groupsQuery.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No groups yet</CardTitle>
            <CardDescription>
              Create a group to share a single pool of saved apartments with someone.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-2">
          {groups.map((g) => (
            <Link key={g.id} href={`/groups/${g.id}`} className="block">
              <Card className="py-4 transition hover:border-primary/40">
                <CardContent className="flex items-center justify-between gap-4 px-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{g.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {g.member_count} member{g.member_count === 1 ? "" : "s"} •{" "}
                        {g.role === "owner" ? "Owner" : "Member"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
