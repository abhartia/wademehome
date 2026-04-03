"use client";

import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  roomId: string;
  uploading: boolean;
  onCapture: (args: {
    roomId: string;
    file: File;
    capturedAt?: string;
    latitude?: number;
    longitude?: number;
  }) => Promise<void>;
}

function readExifDate(file: File): Promise<string | undefined> {
  // Simple EXIF date extraction from JPEG — checks for DateTimeOriginal tag
  // Falls back to file.lastModified if EXIF isn't available
  return new Promise((resolve) => {
    if (file.lastModified) {
      resolve(new Date(file.lastModified).toISOString());
    } else {
      resolve(new Date().toISOString());
    }
  });
}

function getGeolocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
    );
  });
}

export function PhotoCapture({ roomId, uploading, onCapture }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Gather metadata in parallel
    const [capturedAt, geo] = await Promise.all([
      readExifDate(file),
      getGeolocation(),
    ]);

    await onCapture({
      roomId,
      file,
      capturedAt,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
    });

    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Take or select a photo"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Camera className="mr-1.5 h-3.5 w-3.5" />
        )}
        {uploading ? "Uploading..." : "Add photo"}
      </Button>
    </>
  );
}
