"use client";

import { FormEvent } from "react";
import { toast } from "sonner";
import { useLandlord } from "@/components/providers/LandlordProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LandlordLeasesPage() {
  const { leaseOffers, createLeaseOffer, leaseOfferAction } = useLandlord();

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await createLeaseOffer({
      property_id: String(data.get("property_id") ?? ""),
      unit_id: String(data.get("unit_id") ?? ""),
      application_id: String(data.get("application_id") ?? "") || null,
      tenant_name: String(data.get("tenant_name") ?? ""),
      tenant_email: String(data.get("tenant_email") ?? ""),
      monthly_rent: Number(data.get("monthly_rent") ?? 0),
      lease_start: String(data.get("lease_start") ?? ""),
      lease_end: String(data.get("lease_end") ?? ""),
      terms_text: String(data.get("terms_text") ?? ""),
    });
    event.currentTarget.reset();
    toast.success("Lease offer created.");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Create lease offer</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={onCreate}>
            <Input name="property_id" placeholder="Property ID" required />
            <Input name="unit_id" placeholder="Unit ID" />
            <Input name="application_id" placeholder="Application ID" />
            <Input name="tenant_name" placeholder="Tenant name" required />
            <Input name="tenant_email" type="email" placeholder="Tenant email" required />
            <Input name="monthly_rent" type="number" placeholder="Monthly rent" required />
            <Input name="lease_start" type="date" required />
            <Input name="lease_end" type="date" required />
            <Textarea name="terms_text" placeholder="Lease terms" required />
            <Button type="submit" className="w-full">
              Save lease offer
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Lease pipeline ({leaseOffers.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaseOffers.map((offer) => (
            <div key={offer.id} className="rounded-md border p-3">
              <p className="font-medium">{offer.tenant_name}</p>
              <p className="text-xs text-muted-foreground">{offer.tenant_email}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => leaseOfferAction(offer.id, "send")}>
                  Send
                </Button>
                <Button size="sm" onClick={() => leaseOfferAction(offer.id, "accept")}>
                  Mark accepted
                </Button>
                <Button size="sm" variant="destructive" onClick={() => leaseOfferAction(offer.id, "decline")}>
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
