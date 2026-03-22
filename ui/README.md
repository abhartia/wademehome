This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## API Client (Hey API + TanStack Query)

The UI is configured with `@hey-api/openapi-ts` and `@tanstack/react-query`.

### Generate client and query helpers

```bash
npm run openapi:generate:local
```

This pulls your backend OpenAPI spec from `http://127.0.0.1:8000/openapi.json` and generates files in `lib/api/generated`.

You can also point at another spec URL or file:

```bash
OPENAPI_INPUT=https://your-api.example.com/openapi.json npm run openapi:generate
```

### Runtime base URL

Set API base URL in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Usage

Generated query options are available from:

- `lib/api/generated/@tanstack/react-query.gen`
- `lib/api` (barrel export)

## Analytics (GA4)

This app supports Google Analytics 4 (direct `gtag.js`) with consent-gated tracking.

### Environment variables

Set this in your `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is not set, analytics is disabled.

### Consent behavior

- Analytics consent defaults to denied.
- A consent banner is shown until the user explicitly accepts or declines.
- No GA events are sent until consent is granted.

### Onboarding funnel events

The onboarding flow emits these GA4 custom events:

- `onboarding_started`
- `onboarding_step_viewed`
- `onboarding_answer_submitted`
- `onboarding_summary_viewed`
- `onboarding_completed`
- `onboarding_reset`
- `onboarding_abandoned`

The implementation only sends structured metadata (step/stage/mode/counts), not raw free-text answers.

### QA checklist

- Confirm no GA requests/events fire before accepting consent.
- Accept consent and verify `page_view` appears in GA4 Realtime/DebugView.
- Run through onboarding and verify event sequence in DebugView:
  - start -> step viewed -> answer submitted -> summary viewed -> completed
- Reset onboarding and verify `onboarding_reset`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Dev troubleshooting

Default `npm run dev` uses the **webpack** dev server. For Turbopack (often faster HMR), use `npm run dev:turbo`; if you see odd manifest errors, prefer webpack dev.

If you see `ENOENT` errors for files under `ui/.next/` (e.g. `_buildManifest.js.tmp`, `server-reference-manifest.json`, **`required-server-files.json`**), the build output is missing or stale:

- **Development:** stop the dev server, run `rm -rf .next` in `ui/`, then `npm run dev` again.
- **Production (`next start`):** `required-server-files.json` is created by `next build`. Run `rm -rf .next && npm run build` in `ui/`, then `npm run start`. Do not run `next start` after a failed or partial build.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
