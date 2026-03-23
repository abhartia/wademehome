"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLandlord } from "@/components/providers/LandlordProvider";

export default function LandlordDashboardPage() {
  const { profile, properties, leads, bookings, applications, leaseOffers } = useLandlord();

  const stats = [
    { label: "Properties", value: properties.length },
    { label: "Leads", value: leads.length },
    { label: "Tour bookings", value: bookings.length },
    { label: "Applications", value: applications.length },
    { label: "Lease offers", value: leaseOffers.length },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Independent Landlord HQ</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {profile?.display_name || "Landlord"} • {profile?.company_name || "Independent"}
          </span>
          <Badge variant="secondary">{profile?.verification_status || "pending"}</Badge>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-5">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="text-sm">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
