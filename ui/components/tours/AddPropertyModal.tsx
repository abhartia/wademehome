"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Pencil,
  ExternalLink,
} from "lucide-react";

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

type Stage = "paste" | "preview" | "manual";

interface FormState {
  name: string;
  address: string;
  unit: string;
  price: string;
  beds: string;
  baths: string;
  image_url: string;
  source_url: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
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
  latitude: null,
  longitude: null,
  city: null,
  state: null,
  zipcode: null,
};

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  context?: { id: string; text: string; short_code?: string }[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function hostFromUrl(url: string | null | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function formFromPrefill(prefill: PrefillFields, pastedText: string): FormState {
  return {
    name: prefill.name ?? "",
    address: prefill.address ?? "",
    unit: prefill.unit ?? "",
    price: prefill.price ?? "",
    beds: prefill.beds ?? "",
    baths: prefill.baths ?? "",
    image_url: prefill.image_url ?? "",
    source_url: prefill.source_url ?? firstUrl(pastedText) ?? "",
    latitude: prefill.latitude,
    longitude: prefill.longitude,
    city: prefill.city,
    state: prefill.state,
    zipcode: prefill.zipcode,
  };
}

function firstUrl(text: string): string | null {
  const m = text.match(/https?:\/\/\S+/i);
  return m ? m[0] : null;
}

export function AddPropertyModal() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("paste");
  const [pasted, setPasted] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [dedupeMatches, setDedupeMatches] = useState<DedupeMatch[]>([]);
  const [overrideDedupe, setOverrideDedupe] = useState(false);
  const [duplicateConflict, setDuplicateConflict] =
    useState<DuplicateListingError | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ name: string } | null>(null);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [addressFocused, setAddressFocused] = useState(false);

  const suggestTimer = useRef<number | null>(null);
  const pasteRef = useRef<HTMLTextAreaElement | null>(null);

  const parseMut = useParseListingUrl();
  const dedupeMut = useDedupeCheck();
  const createMut = useCreateUserListing();

  const reset = useCallback(() => {
    setStage("paste");
    setPasted("");
    setForm(EMPTY_FORM);
    setDedupeMatches([]);
    setOverrideDedupe(false);
    setDuplicateConflict(null);
    setSubmitError(null);
    setSubmitted(null);
    setSuggestions([]);
    parseMut.reset();
    dedupeMut.reset();
    createMut.reset();
  }, [parseMut, dedupeMut, createMut]);

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    setOpen(next);
  };

  useEffect(() => {
    if (open && stage === "paste") {
      // Auto-focus so the user can paste immediately.
      window.setTimeout(() => pasteRef.current?.focus(), 80);
    }
  }, [open, stage]);

  const runDedupe = useCallback(
    async (lat: number, lng: number, address: string, unit: string) => {
      try {
        const res = await dedupeMut.mutateAsync({
          latitude: lat,
          longitude: lng,
          address,
          unit: unit || null,
        });
        setDedupeMatches(res.matches);
      } catch {
        setDedupeMatches([]);
      }
    },
    [dedupeMut],
  );

  const parseText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setSubmitError(null);
      try {
        const res = await parseMut.mutateAsync(trimmed);
        const next = formFromPrefill(res.prefill, trimmed);
        setForm(next);
        if (res.prefill.address) {
          setStage("preview");
          if (res.prefill.latitude != null && res.prefill.longitude != null) {
            await runDedupe(
              res.prefill.latitude,
              res.prefill.longitude,
              res.prefill.address,
              next.unit,
            );
          }
        } else {
          setStage("manual");
          setSubmitError(
            "Couldn't pull an address out of that. Fill in the details below.",
          );
        }
      } catch (err) {
        setStage("manual");
        setSubmitError(
          err instanceof Error ? err.message : "Could not parse that paste.",
        );
      }
    },
    [parseMut, runDedupe],
  );

  const handlePasteEvent = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text || !text.trim()) return;
    // Let the default paste complete, then auto-parse.
    window.setTimeout(() => void parseText(text), 0);
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
      /* ignore */
    }
  };

  const handleAddressChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      address: value,
      latitude: null,
      longitude: null,
    }));
    setDedupeMatches([]);
    setOverrideDedupe(false);
    if (suggestTimer.current) window.clearTimeout(suggestTimer.current);
    suggestTimer.current = window.setTimeout(() => {
      void fetchAddressSuggestions(value);
    }, 250);
  };

  const pickSuggestion = async (feature: MapboxFeature) => {
    const [lng, lat] = feature.center;
    const ctx = feature.context ?? [];
    const city = ctx.find((c) => c.id.startsWith("place"))?.text ?? null;
    const regionItem = ctx.find((c) => c.id.startsWith("region"));
    const stateCode =
      regionItem?.short_code?.replace(/^US-/i, "").toUpperCase() ??
      regionItem?.text ??
      null;
    const zipcode = ctx.find((c) => c.id.startsWith("postcode"))?.text ?? null;
    setForm((prev) => ({
      ...prev,
      address: feature.place_name,
      latitude: lat,
      longitude: lng,
      city,
      state: stateCode,
      zipcode,
    }));
    setSuggestions([]);
    await runDedupe(lat, lng, feature.place_name, form.unit);
  };

  const canSave =
    !!form.address.trim() &&
    form.latitude != null &&
    form.longitude != null &&
    (dedupeMatches.length === 0 || overrideDedupe);

  const handleSubmit = async () => {
    setSubmitError(null);
    setDuplicateConflict(null);

    if (!form.address.trim()) {
      setSubmitError("Address is required.");
      return;
    }
    if (form.latitude == null || form.longitude == null) {
      setSubmitError("Pick an address from the suggestions to geocode it.");
      return;
    }
    if (dedupeMatches.length > 0 && !overrideDedupe) {
      setSubmitError(
        "We found possible duplicates — pick one or confirm yours is different.",
      );
      return;
    }

    try {
      const created = await createMut.mutateAsync({
        name: form.name.trim() || form.address.trim(),
        address: form.address.trim(),
        unit: form.unit.trim() || null,
        city: form.city,
        state: form.state,
        zipcode: form.zipcode,
        latitude: form.latitude,
        longitude: form.longitude,
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
          err instanceof Error ? err.message : "Could not save that listing.",
        );
      }
    }
  };

  const prefillHost = hostFromUrl(form.source_url);

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
            Paste a Zillow/StreetEasy share message — address, link, anything —
            and we&apos;ll do the rest.
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
        ) : stage === "paste" ? (
          <div className="space-y-3">
            <Label htmlFor="paste-blob" className="text-xs">
              Paste anything
            </Label>
            <Textarea
              id="paste-blob"
              ref={pasteRef}
              rows={4}
              placeholder={`269 Terrace Ave #B, Jersey City, NJ 07307 | Zillow https://share.google/…\n— or just a URL`}
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              onPaste={handlePasteEvent}
              disabled={parseMut.isPending}
            />
            {parseMut.isPending && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Reading the listing…
              </p>
            )}
            {submitError && !parseMut.isPending && (
              <p className="text-xs text-destructive">{submitError}</p>
            )}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                onClick={() => {
                  setStage("manual");
                  setForm(EMPTY_FORM);
                }}
              >
                Enter details manually
              </button>
              <Button
                size="sm"
                onClick={() => void parseText(pasted)}
                disabled={!pasted.trim() || parseMut.isPending}
              >
                {parseMut.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Parse
              </Button>
            </div>
          </div>
        ) : stage === "preview" ? (
          <div className="space-y-3">
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="flex gap-3">
                {form.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image_url}
                    alt=""
                    className="h-20 w-20 rounded object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : null}
                <div className="flex-1 space-y-1 text-xs">
                  <div className="text-sm font-medium">
                    {form.name || form.address}
                  </div>
                  <div className="text-muted-foreground">{form.address}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground">
                    {form.price && <span>{form.price}</span>}
                    {form.beds && <span>{form.beds} bd</span>}
                    {form.baths && <span>{form.baths} ba</span>}
                  </div>
                  {prefillHost && form.source_url && (
                    <a
                      href={form.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground underline"
                    >
                      {prefillHost}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </div>
              {form.latitude != null && form.longitude != null && (
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Geocoded ({form.latitude.toFixed(4)},{" "}
                  {form.longitude.toFixed(4)})
                </p>
              )}
            </div>

            {dedupeMatches.length > 0 && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600" />
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-medium text-amber-900">
                      We might already have this — track one of these instead?
                    </p>
                    <ul className="space-y-1.5">
                      {dedupeMatches.map((m) => (
                        <li
                          key={m.property_key}
                          className="rounded border border-amber-200 bg-white px-2 py-1.5 text-xs"
                        >
                          <div className="font-medium">{m.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {m.address} · ~{Math.round(m.distance_meters)}m away
                          </div>
                        </li>
                      ))}
                    </ul>
                    <label className="flex items-center gap-2 text-xs text-amber-900">
                      <input
                        type="checkbox"
                        checked={overrideDedupe}
                        onChange={(e) => setOverrideDedupe(e.target.checked)}
                      />
                      Mine is different — save anyway
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

            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground underline"
              onClick={() => setStage("manual")}
            >
              <Pencil className="h-3 w-3" />
              Edit details
            </button>
          </div>
        ) : (
          <ManualForm
            form={form}
            setForm={setForm}
            suggestions={suggestions}
            addressFocused={addressFocused}
            setAddressFocused={setAddressFocused}
            onAddressChange={handleAddressChange}
            onPickSuggestion={pickSuggestion}
            dedupeMatches={dedupeMatches}
            overrideDedupe={overrideDedupe}
            setOverrideDedupe={setOverrideDedupe}
            duplicateConflict={duplicateConflict}
            submitError={submitError}
            bannerHost={prefillHost || null}
          />
        )}

        {stage !== "paste" && !submitted && (
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSave || createMut.isPending}
            >
              {createMut.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              Save to my list
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ManualFormProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  suggestions: MapboxFeature[];
  addressFocused: boolean;
  setAddressFocused: (v: boolean) => void;
  onAddressChange: (value: string) => void;
  onPickSuggestion: (f: MapboxFeature) => void | Promise<void>;
  dedupeMatches: DedupeMatch[];
  overrideDedupe: boolean;
  setOverrideDedupe: (v: boolean) => void;
  duplicateConflict: DuplicateListingError | null;
  submitError: string | null;
  bannerHost: string | null;
}

function ManualForm({
  form,
  setForm,
  suggestions,
  addressFocused,
  setAddressFocused,
  onAddressChange,
  onPickSuggestion,
  dedupeMatches,
  overrideDedupe,
  setOverrideDedupe,
  duplicateConflict,
  submitError,
  bannerHost,
}: ManualFormProps) {
  return (
    <div className="space-y-3">
      {bannerHost && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Prefilled from <strong>{bannerHost}</strong>. Review before saving.
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
            onChange={(e) => onAddressChange(e.target.value)}
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
                  onClick={() => void onPickSuggestion(s)}
                >
                  {s.place_name}
                </button>
              ))}
            </div>
          )}
        </div>
        {form.latitude != null && form.longitude != null && (
          <p className="text-[10px] text-muted-foreground">
            Geocoded ({form.latitude.toFixed(4)}, {form.longitude.toFixed(4)})
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
            onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
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
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
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
            onChange={(e) => setForm((p) => ({ ...p, beds: e.target.value }))}
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
            onChange={(e) => setForm((p) => ({ ...p, baths: e.target.value }))}
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
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
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
                We might already have this — track one of these instead?
              </p>
              <ul className="space-y-1.5">
                {dedupeMatches.map((m) => (
                  <li
                    key={m.property_key}
                    className="rounded border border-amber-200 bg-white px-2 py-1.5 text-xs"
                  >
                    <div className="font-medium">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {m.address} · ~{Math.round(m.distance_meters)}m away
                    </div>
                  </li>
                ))}
              </ul>
              <label className="flex items-center gap-2 text-xs text-amber-900">
                <input
                  type="checkbox"
                  checked={overrideDedupe}
                  onChange={(e) => setOverrideDedupe(e.target.checked)}
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
  );
}
