"use client";

import { LandlordShell } from "@/components/navigation/LandlordShell";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return <LandlordShell>{children}</LandlordShell>;
}
