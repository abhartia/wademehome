-- Vendor catalog: this repo does not ship fabricated provider rows.
-- Tables stay empty until you load verified data via your own process.
--
-- Optional reset (run against the app Postgres only):
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/sql/vendor_catalog_seed.sql
--
BEGIN;
TRUNCATE TABLE vendor_catalog CASCADE;
COMMIT;
