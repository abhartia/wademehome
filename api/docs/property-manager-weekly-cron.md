# Property manager weekly email

Active subscriptions live in `property_manager_report_subscriptions`. Reports are sent automatically by the in-app scheduler every Monday at 14:00 UTC.

## How it works

The FastAPI app starts an APScheduler `AsyncIOScheduler` on startup (via the `lifespan` hook in `main.py`). The job in `property_manager/scheduler.py` calls `send_weekly_reports_for_all_active()` directly — no HTTP round-trip or external cron needed.

## Requirements

- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` configured (same as auth email).
- `DATABASE_URL` and listings inventory (`LISTINGS_TABLE_NAME`, etc.) so `fetch_nearby_listings_radius` returns rows.

## Manual send (API)

### Internal endpoint (ad-hoc trigger)

- **Method / path:** `POST /internal/property-manager/reports/send-weekly`
- **Header:** `X-Internal-Cron-Secret: <INTERNAL_CRON_SECRET>`
- **Body:** none

Returns JSON: `{ "sent": <number>, "failed": <number> }`.

### Per-subscription send (logged-in PM or admin)

`POST /property-manager/report-subscriptions/{subscription_id}/send-now` with a normal session cookie sends that watch's HTML report to the subscription owner's verified email and updates `last_sent_at`. No cron secret.

## Promoting users

Assign the `property_manager` role in the `users` table (or via your admin tooling). Admins may also use the competitive analysis UI.
