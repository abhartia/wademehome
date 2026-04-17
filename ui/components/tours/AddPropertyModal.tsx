"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Plus, Loader2, Link2, AlertTriangle, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DedupeMatch,
  DuplicateListingError,
  PrefillFields,
  useCreateUserListing,
  useDedupeCheck,
  useParseListingUrl,
} from "@/lib/userListings/useUserListings";

type Mode = "url" | "manual";

interface FormState {
  name: string;
  address: string;
  unit: string;
  price: string;
  beds: string;
  baths: string;
  image_url: string;
  source_url: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  address: "",
  unit: "",
  price: "",
  beds: "",
  baths: "",
  image_url: "",
  source_url: "",
};

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  context?: { id: string; text: string }[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function hostFromUrl(url: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function AddPropertyModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [city, setCity] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [zipcode, setZipcode] = useState<string | null>(null);
  const [prefillHost, setPrefillHost] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [addressFocused, setAddressFocused] = useState(false);
  const [dedupeMatches, setDedupeMatches] = useState<DedupeMatch[]>([]);
  const [duplicateConflict, setDuplicateConflict] =
    useState<DuplicateListingError | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ name: string } | null>(null);
  const [overrideDedupe, setOverrideDedupe] = useState(false);

  const suggestTimer = useRef<number | null>(null);

  const parseMut = useParseListingUrl();
  const dedupeMut = useDedupeCheck();
  const createMut = useCreateUserListing();

  const reset = useCallback(() => {
    setMode("url");
    setUrl("");
    setForm(EMPTY_FORM);
    setCoords(null);
    setCity(null);
    setState(null);
    setZipcode(null);
    setPrefillHost(null);
    setSuggestions([]);
    setDedupeMatches([]);
    setDuplicateConflict(null);
    setSubmitError(null);
    setSubmitted(null);
    setOverrideDedupe(false);
    parseMut.reset();
    dedupeMut.reset();
    createMut.reset();
  }, [parseMut, dedupeMut, createMut]);

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    setOpen(next);
  };

  const applyPrefill = (prefill: PrefillFields, sourceUrl: string) => {
    setForm((prev) => ({
      ...prev,
      name: prefill.name ?? prev.name,
      address: prefill.address ?? prev.address,
      unit: prefill.unit ?? prev.unit,
      price: prefill.price ?? prev.price,
      beds: prefill.beds ?? prev.beds,
      baths: prefill.baths ?? prev.baths,
      image_url: prefill.image_url ?? prev.image_url,
      source_url: sourceUrl,
    }));
    setPrefillHost(prefill.source_host ?? hostFromUrl(sourceUrl));
    setCoords(null);
  };

  const handleParse = async () => {
    setSubmitError(null);
    try {
      const res = await parseMut.mutateAsync(url.trim());
      applyPrefill(res.prefill, url.trim());
      setMode("manual");
      if (res.prefill.address) {
        void fetchAddressSuggestions(res.prefill.address);
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not parse that link.",
      );
    }
  };

  const handleSkipToManual = () => {
    setMode("manual");
    setForm((prev) => ({ ...prev, source_url: url }));
  };

  const fetchAddressSuggestions = async (query: string) => {
    if (!MAPBOX_TOKEN || query.trim().length < 4) {
      setSuggestions([]);
      return;
    }
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query,
    )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=us&types=address&limit=5`;
    try {
      const res = await fetch(endpoint);
      if (!res.ok) return;
      const data = (await res.json()) as { features: MapboxFeature[] };
      setSuggestions(data.features ?? []);
    } catch {
      /* ignore network blips */
    }
  };

  const handleAddressChange = (value: string) => {
    setForm((prev) => ({ ...prev, address: value }));
    setCoords(null);
    setDedupeMatches([]);
    setOverrideDedupe(false);
    if (suggestTimer.current) window.clearTimeout(suggestTimer.current);
    suggestTimer.current = window.setTimeout(() => {
      void fetchAddressSuggestions(value);
    }, 250);
  };

  const pickSuggestion = async (feature: MapboxFeature) => {
    const [lng, lat] = feature.center;
    setForm((prev) => ({ ...prev, address: feature.place_name }));
    setCoords({ lat, lng });
    setSuggestions([]);

    const ctx = feature.context ?? [];
    setCity(ctx.find((c) => c.id.startsWith("place"))?.text ?? null);
    setState(ctx.find((c) => c.id.startsWith("region"))?.text ?? null);
    setZipcode(ctx.find((c) => c.id.startsWith("postcode"))?.text ?? null);

    try {
      const res = await dedupeMut.mutateAsync({
        latitude: lat,
        longitude: lng,
        address: feature.place_name,
        unit: form.unit || null,
      });
      setDedupeMatches(res.matches);
    } catch {
      /* non-blocking */
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setDuplicateConflict(null);

    if (!form.address.trim()) {
      setSubmitError("Address is required.");
      return;
    }
    if (!coords) {
      setSubmitError("Pick an address from the suggestions to geocode it.");
      return;
    }
    if (dedupeMatches.length > 0 && !overrideDedupe) {
      setSubmitError(
        "We found possible duplicates above — pick one or confirm yours is different.",
      );
      return;
    }

    try {
      const created = await createMut.mutateAsync({
        name: form.name.trim() || form.address.trim(),
        address: form.address.trim(),
        unit: form.unit.trim() || null,
        city,
        state,
        zipcode,
        latitude: coords.lat,
        longitude: coords.lng,
        price: form.price.trim() || null,
        beds: form.beds.trim() || null,
        baths: form.baths.trim() || null,
        source_url: form.source_url.trim() || null,
        image_url: form.image_url.trim() || null,
      });
      setSubmitted({ name: created.name });
    } catch (err) {
      if (err instanceof DuplicateListingError) {
        setDuplicateConflict(err);
      } else {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Could not save that listing.",
        );
      }
    }
  };

  const bannerHost = useMemo(() => prefillHost, [prefillHost]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-3.5 w-3.5" />
        Add a property
      </Button>

      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a property you found elsewhere</DialogTitle>
          <DialogDescription>
            Paste a link from Zillow/StreetEasy and we&apos;ll try to prefill,
            or fill in the details yourself.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <p className="text-sm font-medium">
              Added &ldquo;{submitted.name}&rdquo; to your Saved list.
            </p>
            <p className="text-xs text-muted-foreground">
              Only you can see it. You can make it public later if you want.
            </p>
            <Button size="sm" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="flex rounded-md border p-0.5 text-xs">
              <button
                type="button"
                className={`flex-1 rounded-sm py-1.5 ${mode === "url" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setMode("url")}
              >
                Paste URL
              </button>
              <button
                type="button"
                className={`flex-1 rounded-sm py-1.5 ${mode === "manual" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setMode("manual")}
              >
                Enter manually
              </button>
            </div>

            {mode === "url" ? (
              <div className="space-y-3">
                <Label htmlFor="listing-url" className="text-xs">
                  Listing URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="listing-url"
                    placeholder="https://streeteasy.com/building/…"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleParse}
                    disabled={!url.trim() || parseMut.isPending}
                  >
                    {parseMut.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Link2 className="h-3.5 w-3.5" />
                    )}
                    Parse
                  </Button>
                </div>
                {parseMut.isError && (
                  <p className="text-xs text-destructive">
                    {submitError ?? "Could not parse that URL."}
                  </p>
                )}
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline"
                  onClick={handleSkipToManual}
                >
                  Skip — I&apos;ll enter details manually
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bannerHost && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    Prefilled from <strong>{bannerHost}</strong>. Please review
                    the details below before saving.
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="lp-address" className="text-xs">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="lp-address"
                      placeholder="123 Main St, New York, NY"
                      value={form.address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      onFocus={() => setAddressFocused(true)}
                      onBlur={() =>
                        window.setTimeout(() => setAddressFocused(false), 150)
                      }
                    />
                    {addressFocused && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-md border bg-popover shadow-md">
                        {suggestions.map((s) => (
                          <button
                            key={s.place_name}
                            type="button"
                            className="block w-full truncate px-3 py-2 text-left text-xs hover:bg-muted"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => pickSuggestion(s)}
                          >
                            {s.place_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {coords && (
                    <p className="text-[10px] text-muted-foreground">
                      Geocoded ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="lp-unit" className="text-xs">
                      Unit
                    </Label>
                    <Input
                      id="lp-unit"
                      value={form.unit}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, unit: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lp-price" className="text-xs">
                      Price
                    </Label>
                    <Input
                      id="lp-price"
                      placeholder="$3,500"
                      value={form.price}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, price: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lp-beds" className="text-xs">
                      Beds
                    </Label>
                    <Input
                      id="lp-beds"
                      placeholder="2"
                      value={form.beds}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, beds: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lp-baths" className="text-xs">
                      Baths
                    </Label>
                    <Input
                      id="lp-baths"
                      placeholder="1"
                      value={form.baths}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, baths: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lp-name" className="text-xs">
                    Building / listing name (optional)
                  </Label>
                  <Input
                    id="lp-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lp-source" className="text-xs">
                    Source URL (optional)
                  </Label>
                  <Input
                    id="lp-source"
                    value={form.source_url}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, source_url: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lp-image" className="text-xs">
                    Image URL (optional)
                  </Label>
                  <Textarea
                    id="lp-image"
                    rows={2}
                    value={form.image_url}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, image_url: e.target.value }))
                    }
                  />
                </div>

                {dedupeMatches.length > 0 && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600" />
                      <div className="flex-1 space-y-2">
                        <p className="text-xs font-medium text-amber-900">
                          We might already have this — track one of these
                          instead?
                        </p>
                        <ul className="space-y-1.5">
                          {dedupeMatches.map((m) => (
                            <li
                              key={m.property_key}
                              className="rounded border border-amber-200 bg-white px-2 py-1.5 text-xs"
                            >
                              <div className="font-medium">{m.name}</div>
                              <div className="text-[11px] text-muted-foreground">
                                {m.address} · ~{Math.round(m.distance_meters)}m
                                away
                              </div>
                            </li>
                          ))}
                        </ul>
                        <label className="flex items-center gap-2 text-xs text-amber-900">
                          <input
                            type="checkbox"
                            checked={overrideDedupe}
                            onChange={(e) =>
                              setOverrideDedupe(e.target.checked)
                            }
                          />
                          Mine is different — create anyway
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {duplicateConflict && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                    {duplicateConflict.detail.message} —{" "}
                    <strong>{duplicateConflict.detail.match.name}</strong> at{" "}
                    {duplicateConflict.detail.match.address}.
                  </div>
                )}

                {submitError && !duplicateConflict && (
                  <p className="text-xs text-destructive">{submitError}</p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              {mode === "manual" && (
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={createMut.isPending}
                >
                  {createMut.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Save to my list
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
