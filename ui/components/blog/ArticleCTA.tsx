import Link from "next/link";
import { ArrowRight, Home, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Variant = "movein" | "search" | "general";

const COPY: Record<Variant, { icon: typeof Home; heading: string; body: string; cta: string }> = {
  movein: {
    icon: Truck,
    heading: "Planning a move?",
    body: "Wade Me Home helps you set up utilities, compare movers, document your apartment condition, and track every move-in task in one place.",
    cta: "Start your move-in plan",
  },
  search: {
    icon: Home,
    heading: "Looking for an apartment?",
    body: "Wade Me Home searches across listing sites so you don't have to. See rents, amenities, and availability on one map.",
    cta: "Search apartments",
  },
  general: {
    icon: Home,
    heading: "Wade Me Home: tools for every stage of renting",
    body: "From apartment search to move-in day and beyond. Compare listings, set up utilities, document condition, and manage your lease.",
    cta: "Get started free",
  },
};

export function ArticleCTA({ variant = "general" }: { variant?: Variant }) {
  const { icon: Icon, heading, body, cta } = COPY[variant];
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:gap-5">
        <div className="rounded-md bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold">{heading}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/signup">
            {cta}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
