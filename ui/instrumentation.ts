// Next.js runs this once per server/edge runtime on boot.
// We only wire Sentry when NEXT_PUBLIC_SENTRY_DSN is set, so local dev stays offline.

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  try {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      const Sentry = await import("@sentry/nextjs").catch(() => null);
      if (!Sentry) return;
      Sentry.init({
        dsn,
        tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
        environment: process.env.NEXT_PUBLIC_APP_ENV ?? "dev",
      });
    }
  } catch (err) {
    // Never crash boot because of observability wiring.
    // eslint-disable-next-line no-console
    console.warn("sentry init skipped:", err);
  }
}
