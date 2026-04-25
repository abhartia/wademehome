# Runbook

What to do when the site is on fire. Keep it short; add new sections when you learn something new the hard way.

## Deploy pipeline basics

- CI/CD is in [.github/workflows/azure-appservice-cicd.yml](.github/workflows/azure-appservice-cicd.yml).
- Backend and frontend build independently based on the `changes` path filter.
- Each is deployed to an Azure App Service **staging slot**, health-probed, then **slot-swapped** into production.
- Rollback = swap the slots back.

## Staging deploy is red

1. Open the failing GitHub Actions run and find the failed job.
2. If it's `test-backend` or `test-frontend` — it's a code issue; open a revert PR.
3. If it's `build-backend` / `build-frontend` — probably a Dockerfile or dep change. Reproduce locally with `docker build ./api` or `docker build ./ui`.
4. If it's `deploy` — the health probe timed out. Go to the Azure portal → App Service → **Deployment slots → staging → Log stream**. Common causes:
   - `ImagePullUnauthorizedFailure` — ACR permissions changed; re-run the pipeline.
   - `WEBSITES_PORT` mismatch (backend wants 8000, frontend wants 3000).
   - Container crashes on boot — stream the container logs for a traceback.

## Production is down

**First minute — triage:**

```bash
# Is the process alive? (cheap, no downstreams)
curl -i https://api.wademehome.com/health

# Is it ready to serve? (hits the DB; 503 means a downstream is broken)
curl -i https://api.wademehome.com/ready

# What does the response request_id correlate with in logs?
# (search Azure App Service logs for that request_id)
```

If `/health` is 200 but `/ready` is 503, the process is up but a dependency
(currently just the DB) is failing the check. Inspect the `checks` map in
the `/ready` response to see which probe failed; the exception detail is in
the app logs under `readiness_probe_failed`.

**First five minutes — decide:**

- If the last production deploy was less than 30 minutes ago, **swap slots back**:
  ```bash
  az webapp deployment slot swap \
    --resource-group wademehome-rg \
    --name wademehome-backend \
    --slot production --target-slot staging
  ```
- If the issue predates the last deploy, check:
  - Azure status page for the region.
  - DB connectivity (App Service metrics → **Connection count**).
  - Rate-limit tripping (429s in logs) — someone might be abusing chat.
  - OpenAI / Azure OpenAI outage (the chat endpoint will surface upstream errors).

## Feature flag kill switch

To disable a feature in production without a redeploy:

```sql
UPDATE feature_flags SET enabled = false WHERE key = 'the_feature_name';
```

The in-process cache TTL is 30 s; every replica picks up the change within that window.

## Rotating secrets

1. Generate a new value (e.g. `openssl rand -hex 32` for `INTERNAL_CRON_SECRET`).
2. Update the GitHub Actions secret **and** the App Service Application Setting (staging first, then production).
3. Restart the affected slot.
4. Confirm `/health` still returns 200 and the scheduled job (if any) still succeeds.

## Data incident

If user data was exposed or corrupted:

1. Capture the state — do not `DELETE`. Dump the affected table via `pg_dump`.
2. Open a private security advisory in the repo.
3. Notify affected users per the disclosure policy in [SECURITY.md](SECURITY.md).
4. Write a blameless post-mortem and link it from the relevant ADR.

## Useful commands

```bash
# Stream backend logs (requires `az` CLI + correct subscription)
az webapp log tail --resource-group wademehome-rg --name wademehome-backend

# Run alembic migrations against staging
DATABASE_URL=... alembic upgrade head

# Find the request_id for a specific user error
# (replace with your log aggregator's query syntax)
```

## On-call checklist (before you go off-shift)

- [ ] All active incidents resolved or handed off.
- [ ] Any manual DB changes captured as a migration PR.
- [ ] Flags set during triage either committed as the default or reverted.
- [ ] Post-mortem filed for any sev-1/sev-2 incident.
