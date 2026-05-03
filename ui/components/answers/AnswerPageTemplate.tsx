import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, FileText, HelpCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export type AnswerSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type AnswerRelatedTool = {
  href: string;
  title: string;
  blurb: string;
};

export type AnswerRelatedQuestion = {
  slug: string;
  question: string;
};

export type AnswerPageProps = {
  slug: string;
  question: string;
  shortAnswer: string;
  badges: string[];
  bottomLine: string;
  jurisdictionTag?: string;
  reviewedAt: string;
  sections: AnswerSection[];
  embed?: ReactNode;
  embedHeading?: string;
  embedBlurb?: string;
  relatedTools: AnswerRelatedTool[];
  relatedQuestions: AnswerRelatedQuestion[];
  relatedReadingHref?: string;
  relatedReadingLabel?: string;
};

export function buildAnswerJsonLd(p: AnswerPageProps) {
  const url = `${baseUrl}/answers/${p.slug}`;
  const fullAnswerText = [
    p.shortAnswer,
    ...p.sections.flatMap((s) => [
      s.heading,
      ...s.body,
      ...(s.bullets ?? []),
    ]),
    p.bottomLine,
  ].join(" ");

  return [
    {
      "@context": "https://schema.org",
      "@type": "QAPage",
      url,
      mainEntity: {
        "@type": "Question",
        name: p.question,
        text: p.question,
        answerCount: 1,
        acceptedAnswer: {
          "@type": "Answer",
          text: fullAnswerText.slice(0, 4500),
          dateCreated: p.reviewedAt,
          upvoteCount: 0,
          url,
          author: {
            "@type": "Organization",
            name: "Wade Me Home",
            url: baseUrl,
          },
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Answers",
          item: `${baseUrl}/answers`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: p.question,
          item: url,
        },
      ],
    },
  ];
}

export function AnswerPageTemplate(props: AnswerPageProps) {
  const jsonLd = buildAnswerJsonLd(props);

  return (
    <div className="bg-background">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:py-14">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-muted-foreground"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/answers" className="hover:underline">
                Answers
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="line-clamp-1 max-w-[60ch]">{props.question}</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Answer</Badge>
            {props.jurisdictionTag ? (
              <Badge variant="outline">{props.jurisdictionTag}</Badge>
            ) : null}
            {props.badges.map((b) => (
              <Badge key={b} className="bg-emerald-600">
                {b}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {props.question}
          </h1>
          <p className="text-base text-muted-foreground">{props.shortAnswer}</p>
        </header>

        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wide text-emerald-900">
              Bottom line
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-emerald-950">
            {props.bottomLine}
          </CardContent>
        </Card>

        {props.sections.map((s) => (
          <Card key={s.heading}>
            <CardHeader>
              <CardTitle>{s.heading}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {s.body.map((para, idx) => (
                <p key={`${s.heading}-p-${idx}`}>{para}</p>
              ))}
              {s.bullets && s.bullets.length > 0 ? (
                <ul className="list-disc space-y-1.5 pl-6">
                  {s.bullets.map((b, idx) => (
                    <li key={`${s.heading}-b-${idx}`}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        ))}

        {props.embed ? (
          <Card>
            {props.embedHeading ? (
              <CardHeader>
                <CardTitle>{props.embedHeading}</CardTitle>
                {props.embedBlurb ? (
                  <p className="text-sm text-muted-foreground">
                    {props.embedBlurb}
                  </p>
                ) : null}
              </CardHeader>
            ) : null}
            <CardContent className={props.embedHeading ? "" : "pt-6"}>
              {props.embed}
            </CardContent>
          </Card>
        ) : null}

        <Separator />

        {props.relatedTools.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Tools that answer this in 30 seconds</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {props.relatedTools.map((t) => (
                <Button
                  key={t.href}
                  asChild
                  variant="outline"
                  className="h-auto justify-between whitespace-normal py-3 text-left"
                >
                  <Link href={t.href}>
                    <span className="flex flex-col items-start gap-0.5">
                      <span className="flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4 shrink-0" />
                        {t.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.blurb}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {props.relatedQuestions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Related questions NYC renters are asking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {props.relatedQuestions.map((q) => (
                <Link
                  key={q.slug}
                  href={`/answers/${q.slug}`}
                  className="flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted/60"
                >
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="flex-1 underline-offset-2 hover:underline">
                    {q.question}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {props.relatedReadingHref && props.relatedReadingLabel ? (
          <p className="text-sm text-muted-foreground">
            Related reading:{" "}
            <Link
              href={props.relatedReadingHref}
              className="text-primary underline"
            >
              {props.relatedReadingLabel}
            </Link>
            .
          </p>
        ) : null}

        <p className="text-xs text-muted-foreground">
          Reviewed {props.reviewedAt}. Informational only — not legal advice.
          For contested or high-dollar disputes, contact{" "}
          <a
            href="https://legalaidnyc.org/get-help/housing-problems/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Legal Aid Society NYC
          </a>{" "}
          or a tenant-rights attorney.
        </p>
      </main>
    </div>
  );
}
