"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PropertyImage({ src, alt, className }: PropertyImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <Building2 className="size-16 opacity-40" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 144px"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}
