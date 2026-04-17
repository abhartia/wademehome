"use client";

import Link from "next/link";
import { Users, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useActiveGroup } from "@/lib/groups/activeGroup";
import { useMyGroups } from "@/lib/groups/api";

const PERSONAL = "__personal";
const MANAGE = "__manage";

export function GroupSwitcher() {
  const { activeGroupId, setActiveGroupId } = useActiveGroup();
  const groupsQuery = useMyGroups();
  const groups = groupsQuery.data?.groups ?? [];

  const selected = activeGroupId ?? PERSONAL;

  function handleChange(value: string) {
    if (value === MANAGE) return;
    if (value === PERSONAL) setActiveGroupId(null);
    else setActiveGroupId(value);
  }

  const activeLabel =
    activeGroupId === null
      ? "Personal"
      : groups.find((g) => g.id === activeGroupId)?.name ?? "Personal";

  return (
    <div className="flex items-center gap-1">
      <Select value={selected} onValueChange={handleChange}>
        <SelectTrigger
          size="sm"
          aria-label="Active group"
          className="flex-1 text-xs group-data-[collapsible=icon]:hidden"
        >
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue placeholder="Personal">{activeLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Search as</SelectLabel>
            <SelectItem value={PERSONAL}>Personal</SelectItem>
          </SelectGroup>
          {groups.length > 0 && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Groups</SelectLabel>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
          <SelectSeparator />
          <SelectGroup>
            <Link href="/groups" className="block">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal"
              >
                <Settings className="h-3.5 w-3.5" />
                Manage groups
              </Button>
            </Link>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
