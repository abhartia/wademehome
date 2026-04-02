-- Vendor catalog seed (UPSERT by vendor_key / plan_key).
-- Run after Alembic includes serves_nationwide, serves_states, user_movein_plans.target_state.
-- Example: psql "$DATABASE_URL" -f scripts/sql/vendor_catalog_seed.sql
BEGIN;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-comcast', 'Xfinity (Comcast)', 'internet', 'XF', 3.9, 52000,
  '(800) 934-6489', 'xfinity.com', 'Cable/fiber — multi-state footprint', false, ARRAY['AL','AR','AZ','CA','CO','CT','FL','GA','IL','IN','KS','KY','LA','MA','MD','MI','MN','MO','MS','NJ','NM','NH','NY','NC','ND','OH','OK','OR','PA','SC','TN','TX','UT','VT','VA','WA','WV','WI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-comcast-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-comcast'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-spectrum', 'Spectrum (Charter)', 'internet', 'SP', 3.7, 41000,
  '(833) 694-9259', 'spectrum.com', 'Cable/fiber — Charter footprint', false, ARRAY['AL','AZ','CA','CO','CT','FL','GA','HI','ID','IL','IN','KS','KY','LA','ME','MA','MI','MN','MO','NC','NE','NH','NJ','NM','NY','OH','OR','PA','SC','TN','TX','VT','VA','WA','WI','WV','WY']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-spectrum-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-spectrum'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-cox', 'Cox Communications', 'internet', 'CX', 3.8, 22000,
  '(855) 349-9313', 'cox.com', 'Cable/fiber — select states', false, ARRAY['AR','AZ','CA','CT','FL','GA','ID','KS','LA','MO','NE','NV','OH','OK','RI','VA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-cox-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-cox'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-optimum', 'Optimum (Altice)', 'internet', 'OP', 3.6, 18000,
  '(866) 200-7153', 'optimum.com', 'NY/NJ/CT and select markets', false, ARRAY['NY','NJ','CT','LA','NC','AR']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-optimum-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-optimum'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-fios', 'Verizon Fios', 'internet', 'VF', 4.2, 19000,
  '(800) 837-4966', 'verizon.com/fiber', 'Fiber Northeast/Mid-Atlantic', false, ARRAY['NY','NJ','PA','DE','MD','VA','DC','MA','RI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-fios-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-fios'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-att', 'AT&T Internet / Fiber', 'internet', 'AT', 3.8, 67000,
  '(800) 288-2020', 'att.com/internet', 'DSL/fiber footprint varies', false, ARRAY['AL','AR','AZ','CA','FL','GA','IL','IN','KS','KY','LA','MI','MS','MO','NC','NV','OH','OK','SC','TN','TX','WI','WV']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-att-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-att'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-frontier', 'Frontier Communications', 'internet', 'FR', 3.4, 28000,
  '(877) 600-1511', 'frontier.com', 'DSL/fiber multi-state', false, ARRAY['AL','AZ','CA','CT','FL','GA','IL','IN','MN','MS','NC','NM','NY','OH','PA','SC','TN','TX','WI','WV']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-frontier-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-frontier'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-lumen', 'Quantum Fiber (Lumen)', 'internet', 'LU', 3.5, 14000,
  '(866) 642-0444', 'lumen.com', 'Metro fiber clusters', false, ARRAY['AZ','CO','FL','IA','ID','MN','MO','NM','NC','OR','TN','TX','UT','WA','WI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-lumen-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-lumen'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-windstream', 'Kinetic by Windstream', 'internet', 'WK', 3.3, 11000,
  '(800) 347-1991', 'windstream.com', 'DSL/fiber rural', false, ARRAY['AL','AR','FL','GA','IA','KY','MS','MO','NC','NE','NM','NY','OH','OK','PA','SC','TX']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-windstream-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-windstream'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-google', 'Google Fiber', 'internet', 'GF', 4.3, 9000,
  '(866) 777-7550', 'fiber.google.com', 'Select metros', false, ARRAY['AL','AZ','CO','FL','GA','IA','ID','KS','MO','NC','NE','TN','TX','UT','WA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-google-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-google'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-tmobile', 'T-Mobile Home Internet', 'internet', 'TM', 4.0, 25000,
  '(844) 275-9310', 't-mobile.com', '5G fixed wireless', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-tmobile-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-tmobile'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-vz5g', 'Verizon 5G Home Internet', 'internet', 'V5', 4.1, 19000,
  '(800) 922-0204', 'verizon.com/home', '5G fixed wireless', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-vz5g-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-vz5g'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-starlink', 'Starlink', 'internet', 'ST', 4.0, 31000,
  '(888) 886-6790', 'starlink.com', 'Satellite broadband', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-starlink-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-starlink'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-hughes', 'Hughesnet', 'internet', 'HU', 3.2, 22000,
  '(866) 347-3292', 'hughesnet.com', 'Satellite broadband', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-hughes-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-hughes'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-viasat', 'Viasat Internet', 'internet', 'VS', 3.1, 15000,
  '(855) 463-9333', 'viasat.com', 'Satellite broadband', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-viasat-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-viasat'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-metronet', 'Metronet', 'internet', 'ME', 4.2, 4500,
  '(855) 769-0936', 'metronet.com', 'Fiber Midwest/Southeast', false, ARRAY['IL','IN','IA','KY','MI','MN','MO','OH','NC','FL','TX','WI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-metronet-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-metronet'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-wow', 'WOW! Internet', 'internet', 'WW', 3.6, 8000,
  '(855) 969-4249', 'wowway.com', 'Cable Midwest/Southeast', false, ARRAY['AL','FL','GA','IL','IN','MI','SC','TN']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-wow-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-wow'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-ziply', 'Ziply Fiber', 'internet', 'ZF', 4.3, 6000,
  '(866) 947-8439', 'ziplyfiber.com', 'Pacific Northwest fiber', false, ARRAY['WA','OR','ID','MT']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-ziply-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-ziply'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-rise', 'Rise Broadband', 'internet', 'RB', 3.5, 5200,
  '(877) 910-6201', 'risebroadband.com', 'Fixed wireless / rural', false, ARRAY['CO','IA','ID','IL','IN','KS','NE','NV','OK','TX','WY']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-rise-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-rise'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-net-mediacom', 'Mediacom', 'internet', 'MC', 3.4, 9000,
  '(855) 633-4226', 'mediacomcable.com', 'Cable Midwest/South', false, ARRAY['AL','AZ','GA','IA','IL','IN','KS','MN','MO','MS','TN','WI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-net-mediacom-std', 'Representative option (confirm with provider)', 'Varies', '/mo', '["Pricing varies by address and credit", "Verify with utility or ISP before signing", "Informational only \u2014 not a live quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-net-mediacom'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-united', 'United Van Lines', 'movers', 'UV', 4.1, 7800,
  '(800) 348-4887', 'unitedvanlines.com', 'National full-service', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-united-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-united'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-mayflower', 'Mayflower Transit', 'movers', 'MY', 4.0, 5600,
  '(877) 720-7725', 'mayflower.com', 'National van line', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-mayflower-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-mayflower'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-allied', 'Allied Van Lines', 'movers', 'AD', 4.0, 6200,
  '(988) 507-4624', 'allied.com', 'National van line', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-allied-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-allied'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-northam', 'North American Van Lines', 'movers', 'NA', 4.0, 5100,
  '(800) 228-3092', 'northamerican.com', 'National van line', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-northam-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-northam'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-atlas', 'Atlas Van Lines', 'movers', 'AT', 4.1, 4800,
  '(800) 638-9797', 'atlasvanlines.com', 'National agent network', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-atlas-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-atlas'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-twomen', 'Two Men and a Truck', 'movers', '2M', 4.3, 14000,
  '(800) 263-0044', 'twomenandatruck.com', 'Franchise network', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-twomen-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-twomen'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-upack', 'U-Pack (ABF)', 'movers', 'UP', 4.5, 12000,
  '(844) 594-3077', 'upack.com', 'DIY container long-distance', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-upack-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-upack'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-pods', 'PODS Moving & Storage', 'movers', 'PD', 4.2, 17000,
  '(855) 706-4758', 'pods.com', 'Portable containers', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-pods-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-pods'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-packrat', '1-800-PACK-RAT', 'movers', 'PR', 4.1, 9800,
  '(800) 722-5728', '1800packrat.com', 'Portable storage', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-packrat-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-packrat'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-bellhops', 'Bellhop Moving', 'movers', 'BH', 4.0, 7200,
  '(800) 373-8393', 'getbellhops.com', 'Local booking platform', true, ARRAY['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-bellhops-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-bellhops'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-flatrate', 'FlatRate Moving', 'movers', 'FR', 4.4, 3200,
  '(212) 988-1543', 'flatrate.com', 'NYC metro', false, ARRAY['NY','NJ','CT']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-flatrate-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-flatrate'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-piece', 'Piece of Cake Moving', 'movers', 'PC', 4.6, 4100,
  '(212) 651-7273', 'pieceofcakemoving.com', 'NYC focused', false, ARRAY['NY','NJ']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-piece-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-piece'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-mv-roadway', 'Roadway Moving', 'movers', 'RW', 4.5, 2800,
  '(212) 780-4564', 'roadwaymoving.com', 'NYC tri-state', false, ARRAY['NY','NJ','CT']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-mv-roadway-quote', 'Binding or non-binding quote (varies)', 'Quote', ' total', '["Inventory-based pricing", "Confirm valuation and insurance", "Informational \u2014 not a firm quote"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-mv-roadway'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-coned', 'Con Edison', 'electric', 'CE', 3.8, 12400,
  '(800) 752-6633', 'coned.com', 'NYC + Westchester', false, ARRAY['NY']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-coned-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-coned'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-ngrid', 'National Grid (US)', 'electric', 'NG', 3.7, 9800,
  '(800) 322-3223', 'nationalgridus.com', 'NY/MA/RI/NH', false, ARRAY['NY','MA','RI','NH']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-ngrid-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-ngrid'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-eversource', 'Eversource Energy', 'electric', 'EV', 3.7, 8600,
  '(800) 592-2000', 'eversource.com', 'CT/MA/NH', false, ARRAY['CT','MA','NH']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-eversource-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-eversource'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-pseg', 'PSEG', 'electric', 'PS', 3.6, 7200,
  '(800) 490-0025', 'pseg.com', 'NJ / Long Island', false, ARRAY['NJ','NY']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-pseg-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-pseg'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-peco', 'PECO (Exelon)', 'electric', 'PE', 3.7, 6500,
  '(800) 494-4000', 'peco.com', 'Southeast PA', false, ARRAY['PA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-peco-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-peco'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-ppl', 'PPL Electric', 'electric', 'PP', 3.6, 5400,
  '(800) 342-5775', 'pplelectric.com', 'Central/Eastern PA', false, ARRAY['PA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-ppl-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-ppl'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-pge', 'Pacific Gas & Electric', 'electric', 'PG', 3.5, 21000,
  '(800) 743-5000', 'pge.com', 'Northern/Central CA', false, ARRAY['CA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-pge-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-pge'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-sce', 'Southern California Edison', 'electric', 'SC', 3.6, 19000,
  '(800) 974-2356', 'sce.com', 'Southern CA', false, ARRAY['CA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-sce-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-sce'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-sdge', 'San Diego Gas & Electric', 'electric', 'SD', 3.7, 8200,
  '(800) 411-7343', 'sdge.com', 'San Diego region', false, ARRAY['CA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-sdge-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-sdge'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-ladwp', 'LADWP', 'electric', 'LW', 3.9, 5600,
  '(800) 342-5397', 'ladwp.com', 'Los Angeles municipal', false, ARRAY['CA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-ladwp-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-ladwp'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-fpl', 'Florida Power & Light', 'electric', 'FP', 3.8, 15000,
  '(800) 226-3547', 'fpl.com', 'Florida IOU', false, ARRAY['FL']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-fpl-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-fpl'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-duke', 'Duke Energy', 'electric', 'DK', 3.7, 24000,
  '(800) 777-9898', 'duke-energy.com', 'Carolinas/Midwest/FL', false, ARRAY['NC','SC','FL','IN','OH','KY','TN']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-duke-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-duke'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-dominion', 'Dominion Energy', 'electric', 'DM', 3.6, 11000,
  '(866) 366-4357', 'dominionenergy.com', 'VA/NC/SC/UT/WY (regional)', false, ARRAY['VA','NC','SC','UT','WY','ID']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-dominion-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-dominion'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-southern', 'Southern Company', 'electric', 'SO', 3.7, 13000,
  '(888) 660-5890', 'southerncompany.com', 'AL/GA/MS', false, ARRAY['AL','GA','MS']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-southern-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-southern'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-tva', 'Tennessee Valley region distributors', 'electric', 'TV', 3.8, 4000,
  '(865) 632-2101', 'tva.com', 'TVA power region', false, ARRAY['TN','AL','KY','MS','NC','GA','VA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-tva-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-tva'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-xcel', 'Xcel Energy', 'electric', 'XE', 3.7, 9000,
  '(800) 895-4999', 'xcelenergy.com', 'Upper Midwest / Plains / TX / NM', false, ARRAY['MN','WI','MI','ND','SD','CO','NM','TX']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-xcel-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-xcel'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-bge', 'BGE (Exelon)', 'electric', 'BG', 3.6, 4800,
  '(800) 685-0123', 'bge.com', 'Central Maryland', false, ARRAY['MD']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-bge-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-bge'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-we', 'WEC Energy Group', 'electric', 'WE', 3.7, 4500,
  '(800) 242-9137', 'wecenergygroup.com', 'WI/MI', false, ARRAY['WI','MI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-we-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-we'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-aps', 'Arizona Public Service', 'electric', 'AP', 3.8, 6200,
  '(800) 253-9405', 'aps.com', 'Arizona IOU', false, ARRAY['AZ']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-aps-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-aps'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-srp', 'Salt River Project', 'electric', 'SR', 4.0, 5100,
  '(602) 236-8888', 'srpnet.com', 'Arizona public power', false, ARRAY['AZ']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-srp-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-srp'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-nve', 'NV Energy', 'electric', 'NV', 3.7, 4900,
  '(702) 402-5555', 'nvenergy.com', 'Nevada IOU', false, ARRAY['NV']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-nve-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-nve'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-pnmp', 'Rocky Mountain Power (PacifiCorp)', 'electric', 'RM', 3.6, 4300,
  '(888) 221-7070', 'rockymountainpower.net', 'UT/WY/ID/OR/WA', false, ARRAY['UT','WY','ID','OR','WA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-pnmp-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-pnmp'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-pnm', 'PNM', 'electric', 'PM', 3.6, 3200,
  '(888) 342-5766', 'pnm.com', 'New Mexico', false, ARRAY['NM']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-pnm-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-pnm'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-oge', 'OG&E', 'electric', 'OG', 3.7, 3800,
  '(800) 627-8321', 'oge.com', 'Oklahoma', false, ARRAY['OK']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-oge-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-oge'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-aep', 'American Electric Power', 'electric', 'AE', 3.6, 8900,
  '(866) 258-3782', 'aep.com', 'Multi-state service', false, ARRAY['AR','IN','KY','LA','MI','OH','OK','TN','TX','VA','WV']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-aep-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-aep'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-ent', 'Entergy', 'electric', 'EN', 3.6, 6700,
  '(800) 368-3749', 'entergy.com', 'AR/LA/MS/TX', false, ARRAY['AR','LA','MS','TX']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-ent-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-ent'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-ons', 'Oncor (delivery)', 'electric', 'ON', 3.8, 7200,
  '(888) 313-6862', 'oncor.com', 'North/Central Texas wires', false, ARRAY['TX']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-ons-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-ons'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-cnp', 'CenterPoint Energy (delivery)', 'electric', 'CP', 3.7, 6100,
  '(800) 332-7143', 'centerpointenergy.com', 'Houston area wires', false, ARRAY['TX']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-cnp-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-cnp'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-aus', 'Austin Energy', 'electric', 'AU', 4.0, 2900,
  '(512) 494-9400', 'austinenergy.com', 'Austin municipal', false, ARRAY['TX']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-aus-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-aus'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-comed', 'ComEd (Exelon)', 'electric', 'CD', 3.6, 9800,
  '(800) 334-7661', 'comed.com', 'Northern Illinois', false, ARRAY['IL']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-comed-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-comed'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-amern', 'Ameren', 'electric', 'AM', 3.7, 7200,
  '(800) 755-5000', 'ameren.com', 'MO/IL', false, ARRAY['MO','IL']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-amern-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-amern'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-nipsco', 'NIPSCO', 'electric', 'NI', 3.5, 3500,
  '(800) 464-7726', 'nipsco.com', 'Northern Indiana', false, ARRAY['IN']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-nipsco-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-nipsco'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-dte', 'DTE Energy', 'electric', 'DT', 3.7, 5600,
  '(800) 477-4747', 'dteenergy.com', 'SE Michigan', false, ARRAY['MI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-dte-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-dte'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-consumers', 'Consumers Energy', 'electric', 'CS', 3.7, 5200,
  '(800) 477-5050', 'consumersenergy.com', 'Lower Michigan', false, ARRAY['MI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-consumers-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-consumers'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-bhec', 'Berkshire Hathaway Energy utilities', 'electric', 'BH', 3.7, 4100,
  '(888) 467-2662', 'berkshirehathawayenergyco.com', 'IA/MN/UT/WY/OR/WA', false, ARRAY['IA','MN','UT','WY','OR','WA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-bhec-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-bhec'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-seattle', 'Seattle City Light', 'electric', 'SL', 4.1, 3800,
  '(206) 684-3000', 'seattle.gov/city-light', 'Seattle public', false, ARRAY['WA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-seattle-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-seattle'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-cps', 'CPS Energy', 'electric', 'CP', 3.8, 4200,
  '(210) 353-2222', 'cpsenergy.com', 'San Antonio municipal', false, ARRAY['TX']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-cps-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-cps'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-lcec', 'Lee County Electric Cooperative', 'electric', 'LC', 3.8, 1200,
  '(239) 656-2300', 'lcec.net', 'Southwest Florida cooperative', false, ARRAY['FL']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-lcec-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-lcec'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-avista', 'Avista Utilities', 'electric', 'AV', 3.7, 3600,
  '(800) 227-9187', 'myavista.com', 'WA/ID', false, ARRAY['WA','ID']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-avista-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-avista'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-pse', 'Puget Sound Energy', 'electric', 'PS', 3.7, 4400,
  '(888) 225-5773', 'pse.com', 'Western WA', false, ARRAY['WA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-pse-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-pse'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-booz', 'Liberty Utilities / regulated brands', 'electric', 'LB', 3.6, 2800,
  '(855) 872-3242', 'libertyutilities.com', 'NH/MA/MO/IL/AR/KS/OK', false, ARRAY['NH','MA','MO','IL','AR','KS','OK']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-booz-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-booz'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-oppo', 'Omaha Public Power District', 'electric', 'OP', 4.0, 2200,
  '(402) 536-4131', 'oppd.com', 'Eastern Nebraska public', false, ARRAY['NE']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-oppo-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-oppo'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-mu', 'Municipal / rural: Mountain West', 'electric', 'MW', 3.7, 1500,
  '', 'Local office', 'MT/CO/WY/AK coverage placeholder', false, ARRAY['MT','CO','WY','AK']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-mu-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-mu'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-me', 'Versant Power / Emera Maine region', 'electric', 'ME', 3.6, 2100,
  '(207) 973-2000', 'versantpower.com', 'Northern/Eastern Maine', false, ARRAY['ME']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-me-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-me'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-ak', 'Chugach Electric Association', 'electric', 'CH', 4.0, 1800,
  '(907) 762-4344', 'chugachelectric.com', 'Southcentral Alaska', false, ARRAY['AK']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-ak-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-ak'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-hi', 'Hawaiian Electric (HECO/MECO/HELCO)', 'electric', 'HI', 3.6, 3400,
  '(808) 969-6666', 'hawaiianelectric.com', 'Hawaii investor-owned', false, ARRAY['HI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-hi-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-hi'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-vt', 'Green Mountain Power', 'electric', 'GM', 4.1, 2100,
  '(888) 835-4672', 'greenmountainpower.com', 'Vermont IOU', false, ARRAY['VT']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-vt-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-vt'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-de', 'Delmarva Power (Exelon)', 'electric', 'DE', 3.6, 3100,
  '(800) 375-7117', 'delmarva.com', 'Delaware/Maryland', false, ARRAY['DE','MD']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-de-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-de'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-ri', 'Rhode Island Energy', 'electric', 'RI', 3.6, 1900,
  '(855) 743-1101', 'rienergy.com', 'Rhode Island delivery', false, ARRAY['RI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-ri-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-ri'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-sdak', 'Black Hills Energy electric', 'electric', 'BH', 3.6, 2600,
  '(888) 890-5554', 'blackhillsenergy.com', 'SD/WY/NE utilities', false, ARRAY['SD','WY','NE']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-sdak-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-sdak'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-constellation', 'Constellation Energy (retail supply)', 'electric', 'CN', 3.5, 11000,
  '(877) 997-2941', 'constellation.com', 'Retail in deregulated markets', false, ARRAY['TX','IL','OH','PA','NY','NJ','MA','MD','DE','DC']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-constellation-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-constellation'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-el-direct', 'Direct Energy (retail supply)', 'electric', 'DX', 3.4, 9000,
  '(866) 684-0356', 'directenergy.com', 'Retail in deregulated markets', false, ARRAY['TX','OH','PA','NY','NJ','MA','MD','IL']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-el-direct-res', 'Residential default / standard offer (varies)', 'Varies', '/kWh or /mo', '["Rates and rider charges vary by tariff", "Verify delivery vs supply if market is deregulated", "Informational only \u2014 confirm with utility"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-el-direct'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-coned', 'Con Edison (gas)', 'gas', 'CG', 3.7, 6200,
  '(800) 752-6633', 'coned.com', 'NYC metro gas', false, ARRAY['NY','NJ']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-coned-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-coned'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-ngrid', 'National Grid (US gas)', 'gas', 'GG', 3.6, 4800,
  '(800) 930-5003', 'nationalgridus.com', 'NY/MA/RI', false, ARRAY['NY','MA','RI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-ngrid-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-ngrid'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-socal', 'SoCalGas', 'gas', 'SG', 3.7, 11000,
  '(800) 427-2200', 'socalgas.com', 'Southern CA gas', false, ARRAY['CA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-socal-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-socal'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-pge', 'PG&E (gas)', 'gas', 'PG', 3.5, 9200,
  '(800) 743-5000', 'pge.com', 'Northern/Central CA gas', false, ARRAY['CA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-pge-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-pge'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-sdom', 'Dominion Energy South (gas)', 'gas', 'DG', 3.6, 6600,
  '(877) 866-9660', 'dominionenergy.com', 'Mid-Atlantic/Southeast gas', false, ARRAY['VA','NC','SC','OH','WV','GA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-sdom-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-sdom'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-southern', 'Atlanta Gas Light / Southern Company Gas', 'gas', 'AG', 3.7, 5400,
  '(800) 427-5460', 'southernco.com', 'Southeast LDC', false, ARRAY['GA','AL','TN']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-southern-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-southern'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-spire', 'Spire', 'gas', 'SP', 3.6, 4100,
  '(800) 887-4173', 'spireenergy.com', 'MO/AL/Mississippi region', false, ARRAY['MO','AL','MS']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-spire-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-spire'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-nicor', 'Nicor Gas', 'gas', 'NI', 3.7, 5200,
  '(888) 642-6748', 'nicorgas.com', 'Northern Illinois gas', false, ARRAY['IL']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-nicor-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-nicor'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-peoples', 'Peoples Gas', 'gas', 'PG', 3.6, 3900,
  '(866) 556-6001', 'peoplesgasdelivery.com', 'Chicago gas', false, ARRAY['IL']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-peoples-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-peoples'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-centerpointg', 'CenterPoint Energy (gas)', 'gas', 'CN', 3.6, 5800,
  '(800) 227-1376', 'centerpointenergy.com', 'AR/LA/MN/MS/OK/TX', false, ARRAY['AR','LA','MN','MS','OK','TX']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-centerpointg-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-centerpointg'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-atmos', 'Atmos Energy', 'gas', 'AT', 3.7, 7200,
  '(888) 286-6700', 'atmosenergy.com', 'Multi-state gas LDC', false, ARRAY['TX','LA','MS','AL','TN','KY','CO','KS']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-atmos-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-atmos'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-nwn', 'NW Natural', 'gas', 'NW', 3.8, 3600,
  '(800) 422-4012', 'nwnatural.com', 'OR/WA', false, ARRAY['OR','WA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-nwn-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-nwn'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-xcelg', 'Xcel Energy (gas)', 'gas', 'XG', 3.6, 3400,
  '(800) 895-4999', 'xcelenergy.com', 'Gas in Xcel states', false, ARRAY['MN','WI','ND','SD','CO','MI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-xcelg-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-xcelg'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-wgl', 'Washington Gas / AltaGas', 'gas', 'WG', 3.6, 3300,
  '(844) 927-4327', 'washingtongas.com', 'DC/MD/VA', false, ARRAY['DC','MD','VA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-wgl-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-wgl'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-ugi', 'UGI Utilities', 'gas', 'UG', 3.6, 3100,
  '(800) 844-9276', 'ugi.com', 'PA utility gas', false, ARRAY['PA']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-ugi-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-ugi'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-sji', 'South Jersey Gas', 'gas', 'SJ', 3.5, 2800,
  '(800) 582-7060', 'southjerseygas.com', 'Southern NJ', false, ARRAY['NJ']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-sji-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-sji'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-elpaso', 'El Paso Natural Gas / Xcel NM cluster', 'gas', 'EP', 3.6, 2400,
  '(800) 654-2765', 'epelectric.com', 'El Paso region / NM', false, ARRAY['TX','NM']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-elpaso-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-elpaso'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-cos', 'Colorado Natural Gas / Black Hills CO', 'gas', 'CO', 3.6, 2200,
  '(844) 370-0998', 'blackhillsenergy.com', 'CO gas utilities', false, ARRAY['CO']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-cos-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-cos'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-mt', 'Northwestern Energy (gas)', 'gas', 'MT', 3.6, 1900,
  '(888) 467-2662', 'northwesternenergy.com', 'MT/SD', false, ARRAY['MT','SD']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-mt-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-mt'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area, serves_nationwide, serves_states)
VALUES (
  gen_random_uuid(), 'v-gas-akhi', 'Hawaii gas utilities (city gas)', 'gas', 'HG', 3.5, 900,
  '', 'local office', 'HI propane/LNG pockets', false, ARRAY['HI']::varchar(2)[]
) ON CONFLICT (vendor_key) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, initials = EXCLUDED.initials,
  rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, phone = EXCLUDED.phone,
  website = EXCLUDED.website, coverage_area = EXCLUDED.coverage_area,
  serves_nationwide = EXCLUDED.serves_nationwide, serves_states = EXCLUDED.serves_states,
  updated_at = now();
INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
SELECT gen_random_uuid(), v.id, 'p-v-gas-akhi-res', 'Residential gas service (rate varies)', 'Varies', '/therm or /mo', '["Supply vs utility charges vary", "Winter balancing and riders apply in many states", "Informational only \u2014 confirm with LDC"]'::json, true
FROM vendor_catalog v WHERE v.vendor_key = 'v-gas-akhi'
ON CONFLICT (plan_key) DO UPDATE SET
  vendor_id = EXCLUDED.vendor_id, name = EXCLUDED.name, price = EXCLUDED.price, price_unit = EXCLUDED.price_unit,
  features = EXCLUDED.features, popular = EXCLUDED.popular;
COMMIT;
