"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCachedProperty } from "@/lib/properties/propertyStorage";
import {
  toTourRequestPayload,
  useCreateTourRequest,
  usePropertyFavorites,
  usePropertyNote,
  useToggleFavorite,
  useUpsertPropertyNote,
} from "@/lib/properties/api";
import { toast } from "sonner";

export default function PropertyDetailsPage() {
  const params = useParams<{ propertyKey: string | string[] }>();
  const propertyKey = useMemo(() => {
    const raw = params.propertyKey;
    const segment = Array.isArray(raw) ? raw[0] : raw;
    if (!segment) return "";
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  }, [params.propertyKey]);

  const { user, loading: authLoading } = useAuth();
  const apiEnabled = Boolean(user) && !authLoading;

  const [draftNote, setDraftNote] = useState("");
  const property = useMemo(() => getCachedProperty(propertyKey), [propertyKey]);
  const favoritesQuery = usePropertyFavorites({ enabled: apiEnabled });
  const noteQuery = usePropertyNote(propertyKey, { enabled: apiEnabled && Boolean(propertyKey) });
  const toggleFavorite = useToggleFavorite();
  const upsertNote = useUpsertPropertyNote(propertyKey);
  const createTourRequest = useCreateTourRequest();

  useEffect(() => {
    if (!apiEnabled) return;
    setDraftNote(noteQuery.data?.note?.note ?? "");
  }, [noteQuery.data?.note?.note, apiEnabled]);

  const isFavorited = useMemo(() => {
    if (!favoritesQuery.data?.favorites) return false;
    return favoritesQuery.data.favorites.some((f) => f.property_key === propertyKey);
  }, [favoritesQuery.data?.favorites, propertyKey]);

  if (!property) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Property unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          This property detail page needs an entry from search results first.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{property.name}</h1>
        <p className="text-muted-foreground">{property.address}</p>
      </div>
      <div className="relative h-80 w-full overflow-hidden rounded-lg border bg-muted">
        {property.images_urls[0] ? (
          <Image src={property.images_urls[0]} alt={property.name} fill className="object-cover" />
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{property.rent_range}</Badge>
        <Badge variant="secondary">{property.bedroom_range}</Badge>
        {(property.main_amenities ?? []).map((amenity) => (
          <Badge key={amenity} variant="outline">
            {amenity}
          </Badge>
        ))}
      </div>

      {!user && !authLoading ? (
        <p className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
            sign up
          </Link>{" "}
          to save this listing, add notes, and request a tour.
        </p>
      ) : null}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {user ? (
          <Button
            onClick={async () => {
              const response = await toggleFavorite.mutateAsync({
                propertyKey,
                propertyName: property.name,
                propertyAddress: property.address,
              });
              toast.success(response.favorited ? "Saved to favorites" : "Removed from favorites");
            }}
          >
            {isFavorited ? "Unsave" : "Save"}
          </Button>
        ) : (
          <Button asChild>
            <Link href="/login">Save</Link>
          </Button>
        )}
        {user ? (
          <Button
            variant="outline"
            onClick={async () => {
              await createTourRequest.mutateAsync(toTourRequestPayload(propertyKey, property));
              toast.success("Tour request submitted");
            }}
          >
            Request Tour
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/login">Request Tour</Link>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={async () => {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Copied link");
          }}
        >
          Share
        </Button>
        <Button variant="outline" onClick={() => toast.info("Contact flow coming next")}>
          Contact
        </Button>
        <Button variant="outline" onClick={() => toast.info("Added to compare shortlist")}>
          Compare
        </Button>
        <Button variant="outline" onClick={() => toast.info("Application flow coming next")}>
          Apply
        </Button>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your notes</h2>
        {user ? (
          <>
            <Textarea
              value={draftNote}
              onChange={(event) => setDraftNote(event.target.value)}
              placeholder="Write your pros, cons, and follow-up questions."
            />
            <Button
              size="sm"
              onClick={async () => {
                await upsertNote.mutateAsync(draftNote);
                toast.success("Note saved");
              }}
            >
              Save note
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Notes are saved to your account after you{" "}
            <Link href="/login" className="underline underline-offset-4">
              log in
            </Link>
            .
          </p>
        )}
      </section>
    </main>
  );
}
