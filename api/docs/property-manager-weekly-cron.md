# Property manager weekly email (cron)

Active subscriptions live in `property_manager_report_subscriptions`. A scheduled job should call the internal API once per week (or on your cadence).

## Endpoint

- **Method / path:** `POST /internal/property-manager/reports/send-weekly`
- **Header:** `X-Internal-Cron-Secret: <INTERNAL_CRON_SECRET>`
- **Body:** none

Returns JSON: `{ "sent": <number>, "failed": <number> }`.

If `INTERNAL_CRON_SECRET` is unset in the environment, the endpoint responds **503** so accidental public calls do not run partial logic.

## Requirements

- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` configured (same as auth email).
- `DATABASE_URL` and listings inventory (`LISTINGS_TABLE_NAME`, etc.) so `fetch_nearby_listings_radius` returns rows.

## Manual send (logged-in PM or admin)

`POST /property-manager/report-subscriptions/{subscription_id}/send-now` with a normal session cookie sends that watch’s HTML report to the subscription owner’s verified email and updates `last_sent_at`. No cron secret.

## Example: curl

```bash
curl -sS -X POST \
  "$API_BASE/internal/property-manager/reports/send-weekly" \
  -H "X-Internal-Cron-Secret: $INTERNAL_CRON_SECRET"
```

## Example: GitHub Actions (weekly)

Store `INTERNAL_CRON_SECRET` and your production API base URL as repository secrets, then schedule a workflow on `cron: '0 14 * * 1'` (Monday 14:00 UTC) that runs the `curl` above.

## Promoting users

Assign the `property_manager` role in the `users` table (or via your admin tooling). Admins may also use the competitive analysis UI.
