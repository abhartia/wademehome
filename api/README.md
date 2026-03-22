# API

## Database migrations (Alembic)

From the `api/` directory, with `DATABASE_URL` set in `.env`:

```bash
PYTHONPATH=src uv run alembic upgrade head
```

Check current revision:

```bash
PYTHONPATH=src uv run alembic current
```

`PYTHONPATH=src` is required so Alembic can import `core.config` and models.

Inventory listings table (see `LISTINGS_TABLE_NAME` / `LISTINGS_TABLE_SCHEMA` in `.env`) gets additive columns via Alembic as well—for example `images_urls` (JSON array as `TEXT`). Set those env vars before running migrations if you use a non-default table or schema.
