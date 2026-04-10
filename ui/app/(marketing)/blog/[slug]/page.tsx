import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getArticleMeta } from "@/lib/blog/articles";
import { articleBodies } from "@/lib/blog/articleBodies";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ slug: string }> };

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wademehome.com";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getArticleMeta(slug);
  if (!meta) return {};
  const title = `${meta.title} | Wade Me Home`;
  return {
    title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.publishedAt,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const meta = getArticleMeta(slug);
  const Body = articleBodies[slug];
  if (!meta || !Body) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.publishedAt,
    author: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    publisher: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    mainEntityOfPage: `${baseUrl}/blog/${slug}`,
    keywords: meta.keywords?.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.title,
        item: `${baseUrl}/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <article className="mx-auto max-w-3xl space-y-6 p-6">
        <div className="space-y-3">
          <Badge variant="outline">Guide</Badge>
          <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">
            Published {formatDate(meta.publishedAt)}
          </p>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <Separator />
        <Body />
        <Separator />
        <p className="text-xs text-muted-foreground">
          This article is for general information only and is not legal advice. Rules vary by
          state and locality.
        </p>
        <p>
          <Link
            href="/blog"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            ← All guides
          </Link>
        </p>
      </article>
    </div>
  );
}
