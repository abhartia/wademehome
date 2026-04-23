# ADR-0003 — `/v1` API prefix with legacy mirror

**Status:** Accepted — 2026-04-23

## Context

The API shipped without a version prefix. Every client — the Next.js app, internal tooling, and anything downstream of OpenAPI codegen — assumed `/listings`, `/auth`, etc. would be stable forever. The first time we wanted to reshape a response schema (pagination cursors, error envelope), there was nowhere to put the new shape without breaking existing clients.

## Decision

Mount every router under `/v1` in addition to the unprefixed paths. Clients migrate to `/v1/*` at their own pace; the legacy paths stay mounted for at least one release and will go behind `LEGACY_API_ROUTES=0` before removal.

Mechanics ([api/src/main.py](../../api/src/main.py)):

```python
_v1 = APIRouter(prefix="/v1")
for r in _ALL_ROUTERS:
    _v1.include_router(r)
app.include_router(_v1)
```

The OpenAPI spec now lists each endpoint twice, so the generated TypeScript client exposes both — a nice forcing function for the frontend team to migrate.

## Alternatives considered

- **Hard cut-over**. Simpler, but breaks every in-flight tab and any downstream integration we don't know about.
- **Separate `/v1` app process**. Duplication of deploy infrastructure for essentially the same code.
- **Header-based versioning (`Accept: application/vnd.wademehome.v2+json`)**. Harder to explore in a browser, harder to cache.

## Consequences

- Next breaking change gets its own `/v2` prefix; the legacy code path runs unchanged until clients migrate.
- Every new endpoint lands under `/v1` automatically because the mirror iterates over the full router list.
- Docs / `openapi.json` get twice as many entries. Acceptable — the duplication is honest about the transition.
- When legacy routes are retired, they come off behind an env flag first (`LEGACY_API_ROUTES=0`) so the change is reversible with a restart.
