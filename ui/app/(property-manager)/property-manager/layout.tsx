"use client";

import { PropertyManagerShell } from "@/components/navigation/PropertyManagerShell";

export default function PropertyManagerLayout({ children }: { children: React.ReactNode }) {
  return <PropertyManagerShell>{children}</PropertyManagerShell>;
}
