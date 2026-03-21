import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles } from "@/lib/blog/articles";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Renter guides & blog | Wade Me Home",
  description:
    "Practical guides for U.S. renters—search, touring, applications, leases, move-in, and more.",
  openGraph: {
    title: "Renter guides & blog | Wade Me Home",
    description:
      "Practical guides for renters navigating search, leasing, and move-in.",
  },
};

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-8 p-6">
        <header className="space-y-3">
          <Badge variant="outline">Blog</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Guides for renters</h1>
          <p className="text-sm text-muted-foreground">
            Straightforward articles about searching, applying, signing a lease, and living in
            a rental in the U.S. This isn&apos;t legal advice—verify rules for your state and
            city.
          </p>
        </header>
        <ul className="grid list-none gap-4 p-0">
          {blogArticles.map((article) => (
            <li key={article.slug}>
              <Link href={`/blog/${article.slug}`} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Card className="transition-colors hover:bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>{formatDate(article.publishedAt)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
