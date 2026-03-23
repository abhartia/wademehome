"use client";

import { FormEvent } from "react";
import { toast } from "sonner";
import { useLandlord } from "@/components/providers/LandlordProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LandlordApplicationsPage() {
  const { applications, createApplication, updateApplication } = useLandlord();

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await createApplication({
      property_id: String(data.get("property_id") ?? ""),
      unit_id: String(data.get("unit_id") ?? ""),
      applicant_name: String(data.get("applicant_name") ?? ""),
      applicant_email: String(data.get("applicant_email") ?? ""),
      annual_income: Number(data.get("annual_income") ?? 0) || null,
      credit_score: Number(data.get("credit_score") ?? 0) || null,
      notes: String(data.get("notes") ?? ""),
    });
    event.currentTarget.reset();
    toast.success("Application added.");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Add application</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={onCreate}>
            <Input name="property_id" placeholder="Property ID" required />
            <Input name="unit_id" placeholder="Unit ID" />
            <Input name="applicant_name" placeholder="Applicant name" required />
            <Input name="applicant_email" type="email" placeholder="Applicant email" required />
            <Input name="annual_income" type="number" placeholder="Annual income" />
            <Input name="credit_score" type="number" placeholder="Credit score" />
            <Input name="notes" placeholder="Notes" />
            <Button type="submit" className="w-full">
              Save application
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {applications.map((application) => (
            <div key={application.id} className="rounded-md border p-3">
              <p className="font-medium">{application.applicant_name}</p>
              <p className="text-xs text-muted-foreground">{application.applicant_email}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateApplication(application.id, { status: "under_review" })}
                >
                  Review
                </Button>
                <Button size="sm" onClick={() => updateApplication(application.id, { status: "approved" })}>
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateApplication(application.id, { status: "denied" })}
                >
                  Deny
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
