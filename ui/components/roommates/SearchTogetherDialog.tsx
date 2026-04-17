"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createGroupFromRoommateConnectionRoommatesConnectionsConnectionIdGroupPostMutation,
  inviteRoommateConnectionToGroupRoommatesConnectionsConnectionIdInvitesPostMutation,
  listGroupsGroupsGetQueryKey,
  listInvitesGroupsGroupIdInvitesGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import { useMyGroups } from "@/lib/groups/api";

interface Props {
  connectionId: string;
  roommateName: string;
}

export function SearchTogetherDialog({ connectionId, roommateName }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const groupsQuery = useMyGroups({ enabled: open });
  const ownedGroups = (groupsQuery.data?.groups ?? []).filter(
    (g) => g.role === "owner",
  );

  const createGroupMut = useMutation({
    ...createGroupFromRoommateConnectionRoommatesConnectionsConnectionIdGroupPostMutation(),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: listGroupsGroupsGetQueryKey({}),
      });
      setOpen(false);
      if (data?.already_member) {
        toast.info(`${roommateName} is already in that group.`);
      } else {
        toast.success(`Group "${data?.group_name}" created — invite sent.`);
      }
      if (data?.group_id) {
        router.push(`/groups/${data.group_id}`);
      }
    },
    onError: () => {
      toast.error("Couldn't create the group. Try again.");
    },
  });

  const inviteMut = useMutation({
    ...inviteRoommateConnectionToGroupRoommatesConnectionsConnectionIdInvitesPostMutation(),
    onSuccess: async (data, variables) => {
      const groupId = variables.body.group_id;
      await queryClient.invalidateQueries({
        queryKey: listInvitesGroupsGroupIdInvitesGetQueryKey({
          path: { group_id: String(groupId) },
        }),
      });
      setOpen(false);
      if (data?.already_member) {
        toast.info(`${roommateName} is already a member.`);
      } else {
        toast.success(`Invite sent to ${roommateName}.`);
      }
    },
    onError: () => {
      toast.error("Couldn't send the invite. Try again.");
    },
  });

  const busy = createGroupMut.isPending || inviteMut.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Users2 className="h-4 w-4" />
          Search together
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search together with {roommateName}</DialogTitle>
          <DialogDescription>
            Create a shared group to collaborate on saved properties, notes,
            and tours.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="default"
            className="justify-start gap-2"
            disabled={busy}
            onClick={() =>
              createGroupMut.mutate({
                path: { connection_id: connectionId },
                body: { name: null },
              })
            }
          >
            <Plus className="h-4 w-4" />
            Create a new group with {roommateName}
          </Button>

          {ownedGroups.length > 0 && (
            <>
              <p className="px-1 pt-3 text-xs font-medium text-muted-foreground">
                Or invite to an existing group
              </p>
              {ownedGroups.map((g) => (
                <Button
                  key={g.id}
                  variant="outline"
                  className="justify-start gap-2"
                  disabled={busy}
                  onClick={() =>
                    inviteMut.mutate({
                      path: { connection_id: connectionId },
                      body: { group_id: g.id },
                    })
                  }
                >
                  <Users2 className="h-4 w-4" />
                  Invite to {g.name}
                </Button>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
