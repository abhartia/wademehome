"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoommate } from "@/components/providers/RoommateProvider";
import { RoommateProfileChat } from "@/components/roommates/RoommateProfileChat";
import { RoommateMatches } from "@/components/roommates/RoommateMatches";
import { RoommateConnections } from "@/components/roommates/RoommateConnections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

function MyProfileView() {
  const { myProfile, resetMyProfile } = useRoommate();

  if (!myProfile.profileCompleted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <h3 className="font-semibold">No profile yet</h3>
        <p className="max-w-xs text-sm text-muted-foreground">
          Head to Find Roommates to set up your profile through a quick chat.
        </p>
      </div>
    );
  }

  const rows = [
    { label: "Sleep schedule", value: myProfile.sleepSchedule },
    { label: "Tidiness", value: myProfile.cleanlinessLevel },
    { label: "Noise level", value: myProfile.noiseLevel },
    { label: "Guest policy", value: myProfile.guestPolicy },
    { label: "Smoking", value: myProfile.smoking },
    {
      label: "Interests",
      value: myProfile.interests.join(", ") || "—",
    },
    { label: "Bio", value: myProfile.bio || "—" },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Card>
        <CardContent className="space-y-3 p-5">
          {rows.map((r) => (
            <div key={r.label} className="flex gap-3 text-sm">
              <span className="w-28 shrink-0 text-muted-foreground">
                {r.label}
              </span>
              <span className="font-medium">{r.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {myProfile.interests.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {myProfile.interests.map((i) => (
            <Badge key={i} variant="secondary">
              {i}
            </Badge>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={resetMyProfile}
      >
        <Pencil className="h-3.5 w-3.5" />
        Redo Profile
      </Button>
    </div>
  );
}

export default function RoommatesPage() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const { myProfile, connections } = useRoommate();
  const [activeTab, setActiveTab] = useState("find");

  useEffect(() => {
    if (!profile.roommateSearchEnabled) {
      router.replace("/profile");
    }
  }, [profile.roommateSearchEnabled, router]);

  if (!profile.roommateSearchEnabled) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  const handleProfileComplete = () => {
    setActiveTab("find");
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full flex-col"
      >
        <div className="shrink-0 border-b px-4 pt-3 pb-0">
          <TabsList>
            <TabsTrigger value="find">Find Roommates</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="connections" className="gap-1.5">
              Connections
              {connections.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px]"
                >
                  {connections.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="find" className="flex-1 overflow-y-auto">
          {!myProfile.profileCompleted ? (
            <RoommateProfileChat onComplete={handleProfileComplete} />
          ) : (
            <div className="p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Your Matches</h2>
                <p className="text-sm text-muted-foreground">
                  Sorted by compatibility based on your profile and preferences.
                </p>
              </div>
              <RoommateMatches />
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="flex-1 overflow-y-auto p-4">
          <MyProfileView />
        </TabsContent>

        <TabsContent value="connections" className="flex-1 overflow-hidden p-4">
          <RoommateConnections />
        </TabsContent>
      </Tabs>
      <Toaster richColors closeButton={true} />
    </div>
  );
}
