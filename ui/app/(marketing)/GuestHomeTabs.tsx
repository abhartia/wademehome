"use client";

import { Suspense, useState } from "react";
import { SharedLandingHeader, type LandingTab } from "@/components/landing/SharedLandingHeader";
import { GuestHomeSearchClient } from "./GuestHomeSearchClient";
import { GuestMoveInClient } from "./GuestMoveInClient";

export function GuestHomeTabs() {
  const [activeTab, setActiveTab] = useState<LandingTab>("search");

  return (
    <>
      <SharedLandingHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={activeTab === "search" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
        <Suspense>
          <GuestHomeSearchClient />
        </Suspense>
      </div>
      <div className={activeTab === "movein" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
        <GuestMoveInClient />
      </div>
    </>
  );
}
