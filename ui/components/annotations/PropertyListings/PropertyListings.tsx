import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { groupPropertiesByBuilding } from "@/lib/properties/groupPropertiesByBuilding";
import { isSamePropertyListing } from "@/lib/properties/propertyIdentity";
import { PropertyDataItem, UIPropertyListingAnnotation } from "../UIEventsTypes";
import { cn } from "@/lib/utils";

interface Props {
  data: UIPropertyListingAnnotation["data"];
}

function ListingImage({ src, alt }: { src: string | undefined; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <Building2 className="h-8 w-8 opacity-40" />
      </div>
    );
  }

  return (
    // Listing feeds use many third-party CDNs; next/image would require endless remotePatterns.
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary property image hosts
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

const PropertyCard = ({
  property,
  isSelected,
  onSelectProperty,
}: {
  property: PropertyDataItem;
  isSelected: boolean;
  onSelectProperty?: (property: PropertyDataItem) => void;
}) => {
  const imageUrl = property.images_urls?.[0];

  return (
    <button
      type="button"
      onClick={() => onSelectProperty?.(property)}
      className="w-full text-left"
    >
      <Card
        className={cn(
          "flex w-full flex-row gap-3 py-0 transition-colors",
          isSelected ? "ring-2 ring-primary" : "hover:bg-muted/30",
        )}
      >
      <div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-l-md bg-muted">
        <ListingImage src={imageUrl} alt={property.name} />
      </div>
      <div className="flex flex-1 flex-col justify-between px-2 py-3">
        <div>
          <h3 className="text-lg font-bold leading-none">{property.name}</h3>
          <div className="mt-1 flex flex-row items-center gap-1 text-xs text-zinc-500">
            <MapPin className="h-3 w-3" />
            <p>{property.address}</p>
          </div>
          {property.match_reason?.trim() ? (
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{property.match_reason}</p>
          ) : null}
          <p className="mt-1 text-sm text-gray-600">
            {formatPropertyRangeLabel(property.bedroom_range)}
          </p>
          <div className="mt-2">
            <div className="text-xs font-medium text-zinc-500">Amenities:</div>
            <div className="text-xs font-medium leading-none text-zinc-500">
              {property.main_amenities.join(", ")}
            </div>
          </div>
        </div>

        <div className="mt-3 text-right text-xs font-medium leading-none text-zinc-500">
          Rent:
          <div className="text-base font-bold leading-none text-gray-800">
            {formatPropertyRangeLabel(property.rent_range)}
          </div>
        </div>
      </div>
      </Card>
    </button>
  );
};

const BuildingGroupCard = ({
  representative,
  units,
  selectedProperty,
  onSelectProperty,
}: {
  representative: PropertyDataItem;
  units: PropertyDataItem[];
  selectedProperty?: PropertyDataItem | null;
  onSelectProperty?: (property: PropertyDataItem) => void;
}) => {
  const imageUrl = representative.images_urls?.[0];

  return (
    <Card className="overflow-hidden py-0">
      <div className="flex flex-row gap-3 border-b border-border/60">
        <div className="relative h-40 w-28 shrink-0 overflow-hidden bg-muted md:h-44 md:w-32">
          <ListingImage src={imageUrl} alt={representative.name} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col px-2 py-3">
          <h3 className="text-lg font-bold leading-none">{representative.name}</h3>
          <div className="mt-1 flex flex-row items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <p className="min-w-0">{representative.address}</p>
          </div>
          {representative.match_reason?.trim() ? (
            <p className="mt-1 text-xs leading-snug text-muted-foreground">
              {representative.match_reason}
            </p>
          ) : null}
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {units.length} units · pick one below
          </p>
          <div className="mt-2">
            <div className="text-xs font-medium text-muted-foreground">Amenities</div>
            <div className="text-xs font-medium leading-snug text-muted-foreground">
              {representative.main_amenities.join(", ")}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-1">
        {units.map((unit, index) => (
          <Button
            key={`${unit.rent_range}-${unit.bedroom_range}-${index}`}
            type="button"
            variant="ghost"
            className={cn(
              "h-auto w-full justify-between gap-3 px-3 py-2.5 text-left font-normal",
              isSamePropertyListing(selectedProperty, unit)
                ? "bg-muted/50 ring-2 ring-inset ring-primary"
                : "hover:bg-muted/40",
            )}
            onClick={() => onSelectProperty?.(unit)}
          >
            <span className="text-sm text-foreground">
              {formatPropertyRangeLabel(unit.bedroom_range)}
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
              {formatPropertyRangeLabel(unit.rent_range)}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export const PropertyList = ({
  properties,
  selectedProperty,
  onSelectProperty,
}: {
  properties: PropertyDataItem[];
  selectedProperty?: PropertyDataItem | null;
  onSelectProperty?: (property: PropertyDataItem) => void;
}) => {
  const groups = useMemo(() => groupPropertiesByBuilding(properties), [properties]);

  if (!properties || properties.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {groups.map((group) => {
        const [primary] = group.units;
        if (group.units.length === 1) {
          return (
            <PropertyCard
              key={group.key}
              property={primary}
              isSelected={isSamePropertyListing(selectedProperty, primary)}
              onSelectProperty={onSelectProperty}
            />
          );
        }
        return (
          <BuildingGroupCard
            key={group.key}
            representative={primary}
            units={group.units}
            selectedProperty={selectedProperty}
            onSelectProperty={onSelectProperty}
          />
        );
      })}
    </div>
  );
};

export const PropertyListingsAnnotation = ({
  data,
}: Props) => {
  if (!data.properties || data.properties.length === 0) return null;

  return <PropertyList properties={data.properties} />;
};