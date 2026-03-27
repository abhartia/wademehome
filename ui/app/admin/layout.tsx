import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight">Admin</span>
            <span className="text-xs text-muted-foreground">wademehome</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/inventory">Inventory</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/property-managers">Property managers</Link>
            </Button>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}

