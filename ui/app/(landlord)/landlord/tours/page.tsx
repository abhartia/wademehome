"use client";

import { FormEvent } from "react";
import { toast } from "sonner";
import { useLandlord } from "@/components/providers/LandlordProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LandlordToursPage() {
  const { slots, bookings, createSlot, createBooking, updateBooking } = useLandlord();

  const onCreateSlot = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await createSlot({
      property_id: String(data.get("property_id") ?? ""),
      unit_id: String(data.get("unit_id") ?? ""),
      start_time: new Date(String(data.get("start_time") ?? "")).toISOString(),
      end_time: new Date(String(data.get("end_time") ?? "")).toISOString(),
      is_blocked: false,
    });
    event.currentTarget.reset();
    toast.success("Tour slot created.");
  };

  const onCreateBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await createBooking({
      slot_id: String(data.get("slot_id") ?? ""),
      guest_name: String(data.get("guest_name") ?? ""),
      guest_email: String(data.get("guest_email") ?? ""),
      notes: String(data.get("notes") ?? ""),
    });
    event.currentTarget.reset();
    toast.success("Tour booking created.");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Schedule slots</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={onCreateSlot}>
            <Input name="property_id" placeholder="Property ID" required />
            <Input name="unit_id" placeholder="Unit ID" required />
            <Input name="start_time" type="datetime-local" required />
            <Input name="end_time" type="datetime-local" required />
            <Button type="submit" className="w-full">
              Create slot
            </Button>
          </form>
          <hr className="my-4" />
          <form className="space-y-2" onSubmit={onCreateBooking}>
            <Input name="slot_id" placeholder="Slot ID" required />
            <Input name="guest_name" placeholder="Guest name" required />
            <Input name="guest_email" type="email" placeholder="Guest email" required />
            <Input name="notes" placeholder="Notes" />
            <Button type="submit" className="w-full">
              Create booking
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Slots ({slots.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {slots.map((slot) => (
            <div key={slot.id} className="rounded-md border p-2 text-sm">
              <p className="font-medium">{slot.id}</p>
              <p>{new Date(slot.start_time).toLocaleString()}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Bookings ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-md border p-2 text-sm">
              <p className="font-medium">{booking.guest_name}</p>
              <p>{booking.guest_email}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateBooking(booking.id, { status: "confirmed" })}
                >
                  Confirm
                </Button>
                <Button size="sm" onClick={() => updateBooking(booking.id, { status: "completed" })}>
                  Complete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
