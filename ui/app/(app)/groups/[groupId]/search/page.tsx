"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGroup } from "@/lib/groups/api";
import { composeGroupQuery } from "@/lib/groups/composeGroupQuery";

type PageProps = { params: Promise<{ groupId: string }> };

export default function GroupSearchPage(props: PageProps) {
  const { groupId } = use(props.params);
  const router = useRouter();
  const groupQuery = useGroup(groupId);

  useEffect(() => {
    if (!groupQuery.data) return;
    const q = composeGroupQuery(groupQuery.data);
    if (q) {
      router.replace(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.replace(`/groups/${groupId}?missing_prefs=1`);
    }
  }, [groupQuery.data, groupId, router]);

  return (
    <div className="flex min-h-[60dvh] items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {groupQuery.isError
        ? "Couldn't load group preferences"
        : "Loading group search…"}
    </div>
  );
}
