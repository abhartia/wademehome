"use client";

import { FormEvent } from "react";
import { toast } from "sonner";
import { useLandlord } from "@/components/providers/LandlordProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LandlordLeadsPage() {
  const { properties, leads, createLead, updateLead } = useLandlord();

  const onCreateLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await createLead({
      property_id: String(data.get("property_id") ?? ""),
      unit_id: null,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
    });
    event.currentTarget.reset();
    toast.success("Lead created.");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Add lead</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={onCreateLead}>
            <Input name="property_id" placeholder="Property ID" required />
            <Input name="name" placeholder="Lead name" required />
            <Input name="email" type="email" placeholder="Lead email" required />
            <Input name="phone" placeholder="Phone" />
            <Input name="message" placeholder="Message" />
            <Button type="submit" className="w-full">
              Save lead
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Use one of your property IDs: {properties.map((property) => property.id).join(", ")}
          </p>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Lead inbox ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateLead(lead.id, { status: "contacted" })}>
                    Mark contacted
                  </Button>
                  <Button size="sm" onClick={() => updateLead(lead.id, { status: "closed" })}>
                    Close
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm">{lead.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
