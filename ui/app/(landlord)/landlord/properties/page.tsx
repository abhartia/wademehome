"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLandlord } from "@/components/providers/LandlordProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LandlordPropertiesPage() {
  const { properties, createProperty, updateProperty, publishProperty, createUnit } =
    useLandlord();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId) ?? null,
    [properties, selectedPropertyId],
  );

  const onCreateProperty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await createProperty({
      title: String(data.get("title") ?? ""),
      description: String(data.get("description") ?? ""),
      street_line1: String(data.get("street_line1") ?? ""),
      street_line2: String(data.get("street_line2") ?? ""),
      city: String(data.get("city") ?? ""),
      state: String(data.get("state") ?? ""),
      postal_code: String(data.get("postal_code") ?? ""),
      country: String(data.get("country") ?? "US"),
      amenities: String(data.get("amenities") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
    event.currentTarget.reset();
    toast.success("Property created.");
  };

  const onCreateUnit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProperty) return;
    const data = new FormData(event.currentTarget);
    await createUnit(selectedProperty.id, {
      label: String(data.get("label") ?? ""),
      bedrooms: Number(data.get("bedrooms") ?? 0),
      bathrooms: Number(data.get("bathrooms") ?? 1),
      monthly_rent: Number(data.get("monthly_rent") ?? 0),
      square_feet: Number(data.get("square_feet") ?? 0) || null,
      is_available: true,
    });
    event.currentTarget.reset();
    toast.success("Unit added.");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Create property</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={onCreateProperty}>
            <Input name="title" placeholder="Property title" required />
            <Textarea name="description" placeholder="Description" />
            <Input name="street_line1" placeholder="Street line 1" required />
            <Input name="street_line2" placeholder="Street line 2" />
            <Input name="city" placeholder="City" required />
            <Input name="state" placeholder="State" required />
            <Input name="postal_code" placeholder="Postal code" required />
            <Input name="country" placeholder="Country" defaultValue="US" />
            <Input name="amenities" placeholder="Amenities comma-separated" />
            <Button type="submit" className="w-full">
              Save property
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Portfolio ({properties.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {properties.map((property) => (
            <div key={property.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {property.street_line1}, {property.city} {property.state}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPropertyId(property.id)}
                  >
                    Manage units
                  </Button>
                  <Button
                    size="sm"
                    variant={property.publish_status === "published" ? "secondary" : "default"}
                    onClick={() =>
                      publishProperty(property.id, property.publish_status !== "published")
                    }
                  >
                    {property.publish_status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateProperty(property.id, { title: `${property.title} *` })}
                >
                  Quick update title
                </Button>
              </div>
            </div>
          ))}
          {selectedProperty ? (
            <div className="rounded-md border p-3">
              <p className="mb-2 text-sm font-medium">Add unit to {selectedProperty.title}</p>
              <form className="grid gap-2 md:grid-cols-2" onSubmit={onCreateUnit}>
                <Input name="label" placeholder="Unit label" required />
                <Input name="bedrooms" type="number" placeholder="Bedrooms" defaultValue={1} />
                <Input
                  name="bathrooms"
                  type="number"
                  step="0.5"
                  placeholder="Bathrooms"
                  defaultValue={1}
                />
                <Input name="monthly_rent" type="number" placeholder="Monthly rent" required />
                <Input name="square_feet" type="number" placeholder="Sqft" />
                <Button type="submit">Add unit</Button>
              </form>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
