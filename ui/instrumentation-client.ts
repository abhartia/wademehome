import posthog from "posthog-js";

const token =
  process.env.NODE_ENV === "development"
    ? undefined
    : process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (token) {
  posthog.init(token, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    person_profiles: "identified_only",
    opt_out_capturing_by_default: true,
  });
}
