import { Card } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
    <Image
      src={src}
      alt={alt}
      fill
      sizes="128px"
      className="object-cover"
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
          <p className="mt-1 text-sm text-gray-600">{property.bedroom_range}</p>
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
            {property.rent_range}
          </div>
        </div>
      </div>
      </Card>
    </button>
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
  if (!properties || properties.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {properties.map((property, index) => (
        <PropertyCard
          key={index}
          property={property}
          isSelected={
            selectedProperty?.name === property.name &&
            selectedProperty?.address === property.address
          }
          onSelectProperty={onSelectProperty}
        />
      ))}
    </div>
  );
};

export const PropertyListingsAnnotation = ({
  data,
}: Props) => {
  if (!data.properties || data.properties.length === 0) return null;

  return <PropertyList properties={data.properties} />;
};