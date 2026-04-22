# WadeMeHome Growth Agent -- Worklog

This file is the institutional memory for the wademehome-growth scheduled agent. Read it before every session.

## How to Use This File

---

## 2026-04-22 -- Session 16 (Rent-stabilization refresh + Greenpoint/Bushwick spokes + Programmatic under-price pages)

### Context
- Sixteenth growth agent run. GSC's standout was **not** a
  neighborhood this time: `/blog/nyc-rent-stabilization-guide`
  pulled **28 impressions** at avg pos 41.3, including pos 45 for
  "annual rent increase nyc". That's the closest any page is to
  page 1 on a commercial query. Prioritized depth on this page
  over yet another neighborhood spoke.
- Trends pull worked cleanly today (vs. S15's 429s). Confirmed
  astoria +29% YoY, LIC +7%; forest hills and ridgewood down;
  FARE/broker-fee queries evergreen not spike. Supports continued
  investment in Brooklyn/Queens transit-adjacent spokes.
- Carried over the S15 queue (Greenpoint + Bushwick rent-prices
  spokes) and shipped both. Also shipped the long-queued
  "programmatic landing pages backed by live listing queries"
  product bet as `/nyc/[hood]/apartments-under-[price]` — 40 pages.

### Key Numbers (GSC 30d)
- **Rent-stabilization blog: 28 imprs, avg pos 41.3** — top content
  page by impressions. Query "annual rent increase nyc" at pos 45.
- Williamsburg cluster: 33 imprs, 16 queries, pos 62.8 avg.
- LIC cluster: 13 imprs, 6 queries, pos 78.2 avg (S15 spoke
  shipped, awaiting reindex).
- Astoria cluster: 9 imprs, pos 20.9 avg — **closest to page 1 on
  neighborhood queries**.
- Total 30d: 50 queries, 54 impressions, 0 clicks (still
  pre-click; the rent-stabilization refresh is the most likely
  first-click catalyst).

### Completed

**Blog refresh (1):**
- `/blog/nyc-rent-stabilization-guide` — new
  `#nyc-annual-rent-increase-history` anchor with full 2015–2026
  RGB rate table (11 lease cycles, incl. 0% freezes 2015/16/20 and
  current 3%/4.5% for 10/1/2025–9/30/2026). Title rewritten to
  surface "Renewal Rates" + "2015–2026 RGB History". Keywords
  15 → 26. `reviewedAt: 2026-04-22`.

**New spoke pages (2):**
- `/nyc/greenpoint/rent-prices` — full template, Studio $2,400 /
  1BR $3,100 / 2BR $4,300 / 3BR $5,800. Sub-areas:
  Waterfront/Franklin/Manhattan Ave/Nassau-Norman/McGuinness.
  G-train discount vs. Williamsburg comparison.
- `/nyc/bushwick/rent-prices` — full template, Studio $2,100 /
  1BR $2,700 / 2BR $3,400 / 3BR $4,500. Sub-areas:
  Morgan-Jefferson L / Central / Ridgewood border / Broadway JMZ.
  **Unique loft market table** ($/sqft sized) + L-train arbitrage
  math ($700/mo saved = $117/hr implicit).

**Programmatic product feature (1 — big one):**
- `/nyc/[hood]/apartments-under-[price]` dynamic route generating
  **40 static pages** (8 hoods × 5 tiers: $2000, $2500, $3000,
  $3500, $4000). Each page renders real filtered inventory via
  `<NeighborhoodLiveListings maxRent={price}>` (TanStack Query),
  plus per-page metadata, 10 keywords, Article+Breadcrumb JSON-LD,
  tier-aware commentary, cross-links.
- Registry: `ui/lib/neighborhoods/nycNeighborhoods.ts` (single
  source of truth for hoods × tiers — reused by sitemap + dynamic
  route).
- Extended `NeighborhoodLiveListings` with `maxRent`/`minRent`
  props; `searchHref` now carries price constraint into search.

**Cross-linking (5 edits):**
- `/nyc-rent-by-neighborhood` — Greenpoint + Bushwick rent-prices
  added after LIC rent-prices.
- `/best-time-to-rent-nyc` — Greenpoint generic link swapped for
  Greenpoint rent-prices; Bushwick rent-prices paragraph added.
- `/nyc/greenpoint` — rent-prices callout repointed from
  Williamsburg to Greenpoint own spoke; rent-prices entry added
  to Related Guides.
- `/nyc/bushwick` — rent-prices card prepended to Related
  neighborhood guides grid.
- `/nyc/williamsburg/rent-prices` — Greenpoint + Bushwick +
  LIC rent-prices added to Related Guides.

**Sitemap:**
- Greenpoint + Bushwick rent-prices at priority 0.75.
- **40 new** `apartments-under-{price}` URLs at priority 0.7
  weekly (computed via flatMap over the registry — auto-updates as
  we add hoods/tiers).

### Not Yet Done / Queue
- Park Slope rent-prices spoke (family AOV; North/Center/South
  Slope/Gowanus edge; school-district angle).
- Jersey City Newport + Journal Square rent-prices spokes.
- UWS rent-prices spoke (Manhattan's highest-AOV hub without one).
- Flatbush / Prospect-Lefferts Gardens rent-prices spoke.
- Borough-level `apartments-under-{price}` pages (Brooklyn /
  Queens / Manhattan rollups) — **only after** hood×tier combos
  show traction.
- `AggregateOffer` JSON-LD on under-price pages (once we've
  confirmed ≥5 listings per tier reliably).
- Live-listings widget on Greenpoint hub (skipped in S14 due to
  thin coord coverage — re-check).
- Evaluate whether rent-stabilization page warrants a dedicated
  `/nyc-rent-guidelines-board` spoke post-reindex.

### SEO Changes Pending Reindex
- `/blog/nyc-rent-stabilization-guide` — deep refresh w/ RGB
  history table, 26 keywords, `reviewedAt: 2026-04-22`.
- `/nyc/greenpoint/rent-prices` — new URL.
- `/nyc/bushwick/rent-prices` — new URL.
- `/nyc/[hood]/apartments-under-[price]` — **40 new URLs**.
- Sitemap reflects all of the above.

### Build / Verify
- `cd ui && npm run build` — **passed**. Build output confirms 40
  under-price pages as `●` (SSG) and all 6 rent-prices spokes
  (EV, Williamsburg, LIC, Astoria, Greenpoint, Bushwick) as `○`
  (static).

---

## 2026-04-21 -- Session 15 (LIC + Astoria rent-prices spokes + Live-Listings rollout to 4 more pages)

### Context
- Fifteenth growth agent run. **LIC is today's clearest breakout**:
  went from 1 → 6 distinct commercial-intent queries in 30 days, all at
  pos 69-85. Astoria has 3 rent-specific queries (avg pos 45) that map
  directly to the rent-prices spoke template (validated by S13 East
  Village + S14 Williamsburg).
- Trends pull hit Google 429 rate-limits on all 7 interest-over-time
  batches. Did not fabricate numbers — worked from GSC impression
  movement (first-party) plus S14 Trends baseline.

### Key Numbers (GSC 30d)
- Williamsburg: 16 queries, pos 47-84 (S14 refresh shipped, awaiting
  reindex).
- **LIC: 6 queries, pos 69-85** (new breakout — was 1 query last
  session). Queries: "apartment in long island city" (85), "apartments
  in long island city" (75), "lic apartments nyc" (69), "long island
  city housing" (75), "long island city new york apartments" (76),
  "new york lic" (80).
- **Astoria: 4 queries, 3 rent-specific at pos 43-49**: "astoria
  average rent" (43.5), "average rent in astoria" (43), "how much is
  rent in astoria" (49), "subway station apartments in astoria" (19).
- Total 30d: 50 queries, 54 impressions, 0 clicks — still pre-click.

### Completed

**New spoke pages (2):**
- `/nyc/long-island-city/rent-prices` — full rent template: unit-size
  table w/ sq ft, sub-neighborhood table (Hunters Point / Court
  Square / Queens Plaza / Hallets Point / Walkup), 6-year trend,
  $/sq ft by building type, net-effective rent math. Article +
  FAQPage (6 Qs) + BreadcrumbList JSON-LD. 21 keywords targeting all
  6 captured GSC queries. Studio $2,900 / 1BR $3,500 / 2BR $5,200 /
  3BR $7,200 median.
- `/nyc/astoria/rent-prices` — same template. Studio $1,950 / 1BR
  $2,500 / 2BR $3,200 / 3BR $4,200 median. Sub-neighborhoods: Ditmars
  / Waterfront / Central / Astoria Heights / East of Steinway. Extra
  comparison table: Astoria vs. LIC / Williamsburg / Sunnyside /
  Woodside / Jackson Heights / Bushwick.

**Page refresh:**
- `/nyc/long-island-city` — keywords 12 → 25 to match all 6 captured
  query variants, meta title rewritten, dateModified 2026-04-21,
  rent-prices callout + live-listings widget inserted before
  Neighborhood Character card.

**Product feature extension (S14 live-listings rollout continues):**
- Mounted `<NeighborhoodLiveListings>` on: `/nyc/astoria` (40.7720,
  -73.9195, r=1.0mi), `/nyc/upper-west-side` (40.7870, -73.9754,
  r=0.8mi), `/nyc/park-slope` (40.6710, -73.9799, r=0.9mi),
  `/nyc/bushwick` (40.6942, -73.9212, r=1.0mi).
- Coverage now **7/10 NYC hub pages**: Williamsburg, East Village,
  LIC, Astoria, UWS, Park Slope, Bushwick.

**Cross-linking:**
- `/nyc-rent-by-neighborhood` — added LIC rent-prices + Astoria
  rent-prices entries.
- `/best-time-to-rent-nyc` — added LIC + Astoria rent-prices
  paragraph blocks next to existing Williamsburg/EV links.

**Sitemap:** added both new rent-prices routes at priority 0.75,
monthly.

### Not Yet Done / Queue
- Greenpoint rent-prices spoke (same template, G-train discount
  angle from S14 Trends data).
- Bushwick rent-prices spoke (best-value play).
- Park Slope rent-prices spoke (family-renter intent, higher AOV).
- Jersey City Newport / Journal Square rent-prices spokes.
- Live-listings on Greenpoint (once dataset has coord matches) and
  Jersey City trio.
- Next product bet: neighborhood-level alert email capture
  (opt-in banner + TanStack mutation hook).

### SEO Changes Pending Reindex
- `/nyc/long-island-city/rent-prices` (new)
- `/nyc/astoria/rent-prices` (new)
- `/nyc/long-island-city` (metadata refresh + live-listings)
- `/nyc/astoria` (live-listings + spoke cross-link)
- `/nyc/upper-west-side` (live-listings)
- `/nyc/park-slope` (live-listings)
- `/nyc/bushwick` (live-listings)
- `/nyc-rent-by-neighborhood` (2 new cross-links)
- `/best-time-to-rent-nyc` (2 new cross-links)
- Sitemap: +2 entries

### Build
`cd ui && npm run build` exit 0. Both new rent-prices routes ship as
static pages (○). All edited pages compile cleanly.

---

## 2026-04-20 -- Session 14 (Williamsburg + Greenpoint + East Village Refresh + 2 Spokes + Live-Listings Feature)

### Context
- Fourteenth growth agent run. **Williamsburg is today's dominant signal**:
  went from 5 → 19 impressions in 24h across **13 distinct commercial-intent
  queries** at pos 47–84. This is the densest single-page query cluster
  on the site.
- **LIC appeared in GSC at pos 75** on "long island city housing" — shipped
  Apr 17, indexed Apr 20 (3-day reindex matches pattern).
- Apr 18 GSC: **28 impressions** — highest since Apr 13 (25 imp). Trend
  compounding.
- Astoria holding at pos 20.9 with 4 queries (3 rent-specific).
- Williamsburg page was shortest neighborhood page (847 lines vs. 1243 for
  Park Slope), built Apr 14 BEFORE shadcn Tables existed — quality gap vs.
  newer pages.
- Preview dev server still stale (pre-existing webpack/devtools cache errors,
  unchanged from Session 12). Build verification via `npm run build` exit 0
  is authoritative.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] **Overhauled /nyc/williamsburg page** to match newer-page quality bar:
  - Refreshed meta title to lead with "Apartments for Rent in Williamsburg,
    Brooklyn (2026)" — directly matches top captured query pattern
  - Expanded keywords from 12 → 24, covering every captured variant
  - Added shadcn Table imports and 3 tables:
    - 4-row rent-price Table (Studio → 3BR, with income-needed column)
    - 4-row sub-neighborhood rent Table (North-Waterfront / North-Bedford /
      South / East with specific $ per unit size)
    - 7-row vs-neighbors Table (Williamsburg, Bushwick, Greenpoint, East
      Village, LIC, Park Slope, DUMBO)
  - Added 3-bedroom rent section; expanded sub-neighborhood paragraphs with
    specific rent numbers
  - Added hunting tip #6 (rent stabilization), #7 (move-in budget), #8 (AI
    search) — 8 tips total, up from 6
  - Added LIC comparison section
  - Added visible callout to new rent-prices spoke
  - FAQ: rewrote Q1, added 2 new Qs (no-fee apartments, best time to rent);
    `dateModified` → 2026-04-20
- [x] **Created /nyc/williamsburg/rent-prices spoke page** (~700 lines):
  - First neighborhood SPOKE page on the site — new content pattern
  - Target keywords: "williamsburg rent prices" (captured pos 47),
    "williamsburg brooklyn rent prices" (pos 54), studio/1BR/2BR/3BR rent,
    north/south/east williamsburg rent prices, price per square foot, net
    effective rent
  - 5 Tables: rent by unit size, rent by sub-neighborhood, 6-year rent trend
    (2020–2026 YoY), price per square foot by building type, net-effective-
    rent concession math
  - Unique content: 6-year historical trend, $/sq ft benchmarks, concession
    math — no competitor covers this
  - Structured data: Article + FAQPage (5 Qs) + BreadcrumbList
- [x] Added /nyc/williamsburg/rent-prices to ui/app/sitemap.ts (priority 0.75)
- [x] Cross-linked TO the spoke FROM 3 pages:
  - /nyc/williamsburg (visible callout + Related Guides list)
  - /nyc-rent-by-neighborhood (Related guides list)
  - /best-time-to-rent-nyc (Related Guides)
- [x] Build verified: `npm run build` → exit 0. /nyc/williamsburg now
  1.43 kB (was 1.02 kB pre-overhaul); /nyc/williamsburg/rent-prices =
  1.43 kB, 198 kB First Load
- [x] Wrote report analytics/reports/2026-04-20.md
- [x] **SECOND BATCH (post-user-directive to ship everything identified same-day)**:
  - [x] **Created /nyc/greenpoint page** (~900 lines): Brooklyn neighborhood
    guide targeting +108.7% YoY Trends signal. Meta title leads with
    "Apartments for Rent in Greenpoint, Brooklyn (2026)". 24 keywords
    (Greenpoint Landing, Eagle and West, One Blue Slip, Greenpoint vs.
    Williamsburg). JSON-LD: Article + FAQPage (6 Qs) + BreadcrumbList.
    Sections: Quick Facts, Rising Demand callout (+108.7% YoY), Polish
    heritage + McCarren Park, Rent by Unit Size Table (4 rows), Rent by
    Sub-Area Table (Waterfront / Franklin / Manhattan Ave / McGuinness),
    Transit (G, L-via-walk, NYC Ferry), 5 best-blocks sub-areas, 8 hunting
    tips, vs-neighbors comparison (5 rows), FAQ, 10 Related Guides.
  - [x] **Refreshed /nyc/east-village page** to 2026 quality bar (793 →
    ~1100 lines). Meta title "Apartments for Rent in East Village,
    Manhattan (2026)". Keywords 10 → 24. JSON-LD Article dateModified →
    2026-04-20; FAQPage expanded to 7 Qs (added Alphabet City comparison).
    Added shadcn Tables: Rent by Unit Size (4 rows), Rent by Sub-Area
    (Alphabet City / Tompkins Square / St. Marks / 14th St Edge),
    vs-neighbors (5 rows). Added Rising Demand callout (+168.6% YoY),
    dedicated Rent Stabilization section, 8 hunting tips (was 6),
    peak-month context, callout to new rent-prices spoke.
  - [x] **Created /nyc/east-village/rent-prices spoke** (~700 lines) —
    second neighborhood spoke on the site (after Williamsburg). Meta title
    "East Village Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown".
    5 Tables: Rent by Unit Size with Typical Sq Ft column, Rent by Sub-Area
    with Walk-to-Subway column, 6-Year Trend 2020–2026 with YoY + Context
    columns, Price/Sq Ft by Building Type (4 rows), Net-Effective-Rent
    concession math (4 scenarios). FAQ (6 Qs) + Article + BreadcrumbList.
  - [x] Added `/nyc/greenpoint` (priority 0.8) and
    `/nyc/east-village/rent-prices` (priority 0.75) to `ui/app/sitemap.ts`.
  - [x] Cross-linked: `/nyc-rent-by-neighborhood` → both new pages;
    `/nyc/williamsburg` → `/nyc/greenpoint` (updated "vs. Greenpoint"
    section to highlight +108% YoY spillover); `/best-time-to-rent-nyc` →
    both new pages.
  - [x] Build verified: `npm run build` → exit 0. All three new/refreshed
    pages compiled at 1.44 kB / 198 kB First Load — matching existing
    neighborhood-page sizing.
- [x] **Made product-feature building a permanent daily routine step**
  (user directive): updated `~/.claude/scheduled-tasks/wademehome-growth-agent/SKILL.md`
  "Take bold action" to require two ships per session — (1) all content/SEO
  work identified today, (2) one product-feature bet that converts SEO
  traffic into product interaction. Example feature types documented:
  filtered-listings mounts on neighborhood pages, programmatic landing
  pages like `/nyc/{hood}/apartments-under-{price}`, CTR/UX on pages that
  rank but don't convert, sitemap/indexing infra, new filter endpoints.
- [x] **SHIPPED TODAY'S PRODUCT FEATURE: `<NeighborhoodLiveListings>`**
  (converts SEO rankers into product users):
  - New client component at
    `ui/components/neighborhoods/NeighborhoodLiveListings.tsx` — uses
    TanStack Query via existing `useNearbyListings({mode:"radius"})` hook
    to fetch real listings from `/listings/nearby` endpoint by lat/lng +
    radius. Shadcn Card/Badge/Button/Skeleton components. No mock data,
    no heuristic fallback — real empty state with CTA to `/search`.
  - 6-card grid (2-col mobile, 3-col desktop) with image/name/address/
    bedrooms/rent/amenities. Each card links to `/properties/[key]` using
    the existing `buildPropertyKey` slug. Uses `groupPropertiesByBuilding`
    to dedupe same-building multi-unit results.
  - Mounted on `/nyc/greenpoint` (40.7295, -73.9555, r=1.0 mi),
    `/nyc/east-village` (40.7265, -73.9815, r=0.8 mi), and
    `/nyc/williamsburg` (40.7136, -73.9610, r=1.0 mi) — the 3 neighborhood
    pages shipped today. Placed below the "Why [hood] Right Now" callout
    so SEO readers see real inventory before the deeper editorial content.
  - Build impact: each of the 3 pages grew from 1.43 kB / 198 kB First
    Load JS → 171 B / 217 kB — the +19 kB is TanStack Query + client
    component runtime, expected and acceptable.
  - Build verified: `npm run build` → exit 0. Preview dev server
    has a known stale-compile issue (HMR not recompiling after file
    changes — same issue as Sessions 12–13), so production build is
    authoritative. RSC flight data confirms the client component is
    bundled into all 3 page routes.
- [x] **Saved feedback memory: no deferral** — standing rule that identified
  work ships same day, not deferred to next session.
- [x] **Added Google Trends to the permanent routine** (user challenge mid-session):
  - Created `analytics/pull_trends.py` using `pytrends` (with a urllib3-2.x shim
    for the `method_whitelist` → `allowed_methods` rename). Pulls 5y weekly
    interest-over-time for 35 NYC rental keywords across 7 semantic batches
    (neighborhoods N-BK, Queens, Manhattan, rent prices, commercial intent,
    regulatory/seasonal, Jersey City), plus related-query rising/top for 10
    seed queries in both NY and US geos. Outputs `analytics/trends_data.json`
    with `trend_summaries` (YoY, peak-week, current-vs-peak-%).
  - Updated `~/.claude/scheduled-tasks/wademehome-growth-agent/SKILL.md` to
    make `pull_trends.py` step 5 of Startup (permanent, every session) and
    expanded the Analyze section with guidance on combining the inside
    (GSC/GA4) and outside (Trends) views.
  - Retroactively evaluated today's Williamsburg bet with Trends: +24.1% YoY,
    3-month lead on July peak — direction and timing are correct.
  - **Trends-driven pivot to priority queue (see report for full table)**:
    - East Village +168.6% YoY ← refresh + spoke candidate
    - Greenpoint +108.7% YoY, NO PAGE ← ship next session
    - Harlem +16.2%, Chelsea +8.9% — both no page
    - UWS -20.3% YoY — just built a page; demand is cyclical, don't panic
    - "nyc broker fee" -71% but "nyc broker fee law 2025" is rising (750)
      — regulatory-reference queries durable, not news-cycle queries

### Not Yet Done (queue for future sessions)
- [ ] Monitor /nyc/williamsburg content overhaul — did positions improve
  from 47–84 range toward 30–50 range? Check after 2026-04-25
- [ ] Monitor /nyc/williamsburg/rent-prices indexing (check after 2026-04-25).
  Primary target: capture "williamsburg rent prices" (currently pos 47) with
  the dedicated spoke
- [ ] Monitor /nyc/park-slope indexing (check after 2026-04-24)
- [ ] Monitor /nyc/upper-west-side indexing (check after 2026-04-24)
- [ ] Monitor /nyc/bushwick indexing (check after 2026-04-23)
- [ ] Monitor /blog/nyc-apartment-scams (E-E-A-T fix Apr 18, check 2026-04-23)
- [ ] **CRITICAL**: Astoria at pos 20.9 — could hit page 1 any day. Watch.
- [ ] **If Williamsburg rent-prices spoke works** (indexes + captures pos<30
  within 10 days), ship /nyc/astoria/rent-prices next — Astoria has 3 rent
  queries at pos 43–49 waiting for a targeted page
- [ ] Monitor /nyc/greenpoint indexing (SHIPPED TODAY, check after 2026-04-25).
  Trends +108.7% YoY; July peak; 3-month rank lead time.
- [ ] Monitor /nyc/east-village refresh + /nyc/east-village/rent-prices
  spoke indexing (SHIPPED TODAY, check after 2026-04-25). EV already
  ranks pos 10.0, refresh targets +168.6% YoY demand surge.
- [ ] Harlem new page — +16.2% YoY, no page, secondary March peak already
  past so less urgent than Greenpoint
- [ ] Chelsea new page — +8.9% YoY, high absolute volume (recent=58), no page
- [ ] FARE Act / broker-fee content refresh — "nyc broker fee" is -71% YoY
  but "nyc broker fee law 2025" is a rising related query at value 750.
  Refresh /blog/nyc-fare-act-broker-fee-ban with a "2026 update" angle.
- [ ] Investigate pre-existing dev server issues (webpack cache + devtools
  segment-explorer-node errors) — out of SEO scope
- [ ] Investigate missing onboarding funnel events in GA4
- [ ] Check GA consent management — may block event tracking
- [ ] Build social/Reddit distribution strategy for content

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc/greenpoint — NEW page 2026-04-20 (Trends +108.7% YoY), check after 2026-04-25
- /nyc/east-village — content refresh to 2026 quality bar 2026-04-20, check 2026-04-25
- /nyc/east-village/rent-prices — NEW spoke 2026-04-20 (Trends +168.6% YoY), check 2026-04-25
- Cross-links to Greenpoint + East Village rent-prices from 3 pages each — 2026-04-20, check 2026-04-25
- /nyc/williamsburg/rent-prices — new spoke 2026-04-20, check after 2026-04-25
- /nyc/williamsburg — meta + content overhaul 2026-04-20, check 2026-04-25
- Cross-links to Williamsburg rent-prices from 3 pages — 2026-04-20, check 2026-04-25
- /nyc/park-slope — new page 2026-04-19 PM, check after 2026-04-24
- /nyc/upper-west-side — new page 2026-04-19 AM, check after 2026-04-24
- /nyc/bushwick — new page 2026-04-18, check after 2026-04-23
- E-E-A-T fix on /blog/nyc-apartment-scams — 2026-04-18, check after 2026-04-23
- /nyc/long-island-city — INDEXED 2026-04-20 at pos 75 ✓ (shipped Apr 17)
- /best-time-to-rent-nyc — 2026-04-16, check after 2026-04-21
- /cost-of-moving-to-nyc — 2026-04-16 AM, check after 2026-04-21
- /nyc/astoria — INDEXED at pos 20.9, 4 queries ✓
- /nyc/williamsburg — INDEXED at pos 61.1 with **13-query cluster** ✓
- /nyc/east-village — INDEXED at pos 10.0 ✓
- /nyc-rent-by-neighborhood — INDEXED at pos 10.7 ✓
- /blog/nyc-rent-stabilization-guide — INDEXED at pos 53.4 (20 imp) ✓
- /blog/nyc-fare-act-broker-fee-ban — INDEXED at pos 95 ✓

### Key Numbers (2026-04-20)
- GA4 30d: 13 users, 97 sessions, 623 pageviews, ~23% bounce
- GSC 30d: 1 click, 214 page-impressions (up from 186), 50+ queries
- GSC daily Apr 18: 28 impressions at pos 35.8 (highest since Apr 13)
- Williamsburg: 5 → 19 imp in 24h (**3.8x surge**), **13-query cluster**,
  pos 61.1 (overhauled today — today's pos is the BEFORE measurement)
- LIC: NEWLY INDEXED at pos 75 (3 days after ship — on pattern)
- Astoria: pos 20.9, 12 imp (holding)
- Traffic: 100% direct, 0% organic (still)
- Total blog posts: 27
- Total guide pages: 7
- Total neighborhood pages: **8** (EV refreshed + Williamsburg + Astoria +
  LIC + Bushwick + UWS + Park Slope + **Greenpoint new**)
- Total neighborhood SPOKE pages: **2** (Williamsburg Rent Prices +
  **East Village Rent Prices new**)

---

## 2026-04-19 -- Session 13 (Park Slope Guide + Astoria Rent Queries Emerging)

### Context
- Thirteenth growth agent run, second session of the day.
- GSC data essentially unchanged from AM (Google hasn't posted Apr 18 yet),
  BUT query-level view shows new commercial-intent queries surfacing:
  - "astoria average rent" pos 43.5, "average rent in astoria" pos 43,
    "how much is rent in astoria" pos 49 — 3 new Astoria rent-intent queries
  - "lease renewal rent stabilized nyc" pos 44, "annual rent increase nyc"
    pos 45 — new rent-stabilization queries
  - "apartments for rent williamsburg" pos 57 — Williamsburg commercial
- Astoria holding at pos 20.9 with 12 impressions.
- Apr 17 daily data = 17 imp at pos 11.7 (best sustained position).
- All Session 12 content (UWS, Bushwick, etc.) still within reindex windows.
- Preview dev server unresponsive again (same as Session 12) — build
  verification via `npm run build` exit 0 is authoritative.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Created /nyc/park-slope neighborhood guide (~750 lines)
  - Target keywords: "Park Slope apartments", "Park Slope Brooklyn rent",
    "Park Slope rent prices 2026", "brownstone apartments Park Slope",
    "family apartments Park Slope", "Park Slope 1 bedroom rent",
    "North Slope vs South Slope", "apartments near Prospect Park",
    "apartments 11215 11217 11238"
  - 4-row rent table (Studio → 3BR) with income requirements (shadcn Table)
  - 7-row vs. neighbors comparison table (Park Slope, Williamsburg, Bushwick,
    UWS, East Village, LIC, Astoria)
  - Detailed transit: 2/3 express at Grand Army Plaza, F/G at 7th Ave &
    15th St-Prospect Park, R on Fourth Ave, buses, Prospect Park bike loop
  - 4 sub-neighborhoods: North Slope, Central Slope (PS 321 catchment),
    South Slope, Fourth Avenue Corridor (new construction)
  - Dedicated brownstones deep-dive: what you get, trade-offs, small-landlord
    dynamics, rent stabilization
  - Dedicated District 15 schools section — unique content angle (PS 321
    flagship, middle school choice system, private/charter)
  - 8-point renter tips; Is Park Slope right for you? pros/cons
  - 6-question FAQ + FAQPage JSON-LD; Article + BreadcrumbList
  - 7th neighborhood page, 4th Brooklyn page (Williamsburg + Bushwick + Park Slope)
- [x] Added /nyc/park-slope to sitemap
- [x] Cross-linked FROM 5 pages (bidirectional internal links):
  - /nyc/williamsburg — Related Guides list
  - /nyc/bushwick — Related neighborhood guides card grid
  - /nyc-rent-by-neighborhood — Brooklyn body text + Related guides list
  - /best-time-to-rent-nyc — Related Guides (family-relocation/winter angle)
  - /nyc/upper-west-side — Related Guides (family-anchor pair)
- [x] Build verified: `npm run build` → exit 0, /nyc/park-slope = 1.42 kB,
  198 kB First Load
- [x] Wrote analytics report (analytics/reports/2026-04-19-b.md)

### Not Yet Done (queue for future sessions)
- [ ] Monitor /nyc/park-slope indexing (check after 2026-04-24)
- [ ] **CRITICAL**: Watch Astoria — at pos 20.9, improving ~4 pos/day; could
  hit page 1 by 2026-04-23 (first content page on page 1 = milestone)
- [ ] **Astoria rent-specific query optimization**: 3 new rent queries ranking
  pos 43–49 but core Astoria ranks 20.9 — either add rent H2 high in page or
  ship /nyc/astoria/rent-prices spoke. Decide based on Bushwick/UWS indexing.
- [ ] **Williamsburg diagnostic**: at pos 59.2 vs. Astoria's 20.9 despite
  similar page age — pull query-page data, consider meta refresh
- [ ] Monitor /nyc/upper-west-side indexing (check after 2026-04-24)
- [ ] Monitor /nyc/bushwick indexing (check after 2026-04-23)
- [ ] Monitor /blog/nyc-apartment-scams (E-E-A-T fix Apr 18, check after 2026-04-23)
- [ ] Monitor /nyc/long-island-city indexing (check after 2026-04-22)
- [ ] Monitor /best-time-to-rent-nyc indexing (check after 2026-04-21)
- [ ] Monitor /cost-of-moving-to-nyc indexing (check after 2026-04-21)
- [ ] Next neighborhood candidates: Harlem (value+growth), Greenpoint
  (G/L adjacent, hip, natural complement to Williamsburg), Chelsea
  (high-volume commercial Manhattan)
- [ ] Investigate pre-existing React duplicate-key errors (building_profile,
  movein_checklist) in concierge — out of SEO scope but dev-server symptom
- [ ] Investigate missing onboarding funnel events in GA4
- [ ] Check GA consent management — may block event tracking
- [ ] Build social/Reddit distribution strategy for content

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc/park-slope — new page 2026-04-19 PM, check after 2026-04-24
- Cross-links to Park Slope from 5 pages — 2026-04-19 PM, check after 2026-04-24
- /nyc/upper-west-side — new page 2026-04-19 AM, check after 2026-04-24
- /nyc/bushwick — new page 2026-04-18, check after 2026-04-23
- E-E-A-T fix on /blog/nyc-apartment-scams — 2026-04-18, check after 2026-04-23
- /nyc/long-island-city — new page 2026-04-17, check after 2026-04-22
- /best-time-to-rent-nyc — 2026-04-16, check after 2026-04-21
- /cost-of-moving-to-nyc — 2026-04-16 AM, check after 2026-04-21
- /nyc/astoria — INDEXED at pos 20.9 SURGING (12 imp, 3 new rent queries) ✓
- /nyc/williamsburg — INDEXED at pos 59.2 (5 imp) ✓
- /nyc/east-village — INDEXED at pos 10.0 ✓
- /nyc-rent-by-neighborhood — INDEXED at pos 10.7 ✓
- /blog/nyc-rent-stabilization-guide — INDEXED at pos 55.8 (19 imp) ✓
- /blog/nyc-fare-act-broker-fee-ban — INDEXED at pos 95 ✓

### Key Numbers (2026-04-19 PM)
- GA4 30d: 13 users, 95 sessions, ~620 pageviews, 27.5% bounce
- GSC 30d: 1 click, ~186 page-impressions, 50 queries
- GSC daily Apr 17: 17 imp at pos 11.7 (best sustained position)
- Astoria: pos 20.9, 12 imp, now ranking for 3 rent-specific queries
- Traffic: 100% direct, 0% organic (still)
- Total blog posts: 27
- Total guide pages: 7
- Total neighborhood pages: 7 (EV + Williamsburg + Astoria + LIC + Bushwick +
  UWS + Park Slope)

---

## 2026-04-19 -- Session 12 (Upper West Side Guide + Astoria Surge)

### Context
- Twelfth growth agent run. Astoria SURGING: 5 → 12 impressions, pos 25.4 → 20.9
  in one session — fastest multi-impression gain for any content page yet.
- Williamsburg: 1 → 5 impressions (5x jump). Both neighborhood pages gaining
  traction fast.
- Apr 17 daily: 17 impressions at pos 11.7 — best sustained position trend.
- All new pages (Bushwick, LIC, best-time, cost-of-moving) still within reindex
  windows. E-E-A-T fix for scams also within window.
- GSC Apr 16 data revised: was 3 imp/9.7 pos in Session 11, now shows 17 imp/18.8
  pos — normal GSC data latency revision.
- Preview dev server unresponsive (stale after 24h); build verification confirmed
  via `npm run build` exit 0 and correct output size.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Created /nyc/upper-west-side neighborhood guide (~900 lines)
  - Target keywords: "Upper West Side apartments", "UWS apartments", "Upper West
    Side rent", "UWS apartments for rent", "upper west side nyc rent 2026",
    "pre-war apartments upper west side", "family apartments UWS nyc",
    "upper west side 1 bedroom rent", "apartments near central park nyc"
  - 4-row rent table (Studio → 3BR) with income requirements (shadcn Table)
  - 7-row vs. neighbors comparison table (UWS, UES, EV, Williamsburg, LIC, Astoria, Bushwick)
  - Detailed transit: 1 local, 2/3 express (7-10 min to Midtown from 72nd), B/C,
    crosstown Select Bus, Citi Bike to Hudson Greenway
  - 4 sub-neighborhoods: 72nd-79th (most expensive), 79th-89th (central/museum mile),
    89th-96th (quieter, 10-15% less), 96th-110th (near Columbia, most affordable)
  - Pre-war buildings deep dive: steam heat, co-ops vs. rentals, rent stabilization
    density (unique content angle no listings aggregator covers)
  - 7-point renter tips; Is UWS right for you? pros/cons
  - 6-question FAQ + FAQPage JSON-LD; Article + BreadcrumbList
  - 6th neighborhood page, 2nd Manhattan page (East Village + UWS)
- [x] Added /nyc/upper-west-side to sitemap
- [x] Cross-linked FROM 4 pages:
  - /nyc/east-village — Related Guides list
  - /nyc-rent-by-neighborhood — Manhattan body text + Related Guides list
  - /best-time-to-rent-nyc — Related Guides
  - /cost-of-moving-to-nyc — Related Guides
- [x] Build verified: `npm run build` → exit 0 (1.42 kB, 198 kB First Load)
- [x] Wrote analytics report (analytics/reports/2026-04-19.md)

### Not Yet Done (queue for future sessions)
- [ ] Monitor /nyc/upper-west-side indexing (check after 2026-04-24)
- [ ] **CRITICAL**: Watch Astoria position — at pos 20.9 and improving ~4 pos/day,
  could hit page 1 (pos <10) by 2026-04-23 or sooner
- [ ] Monitor /nyc/bushwick indexing (check after 2026-04-23)
- [ ] Monitor /blog/nyc-apartment-scams (E-E-A-T fix Apr 18, check after 2026-04-23)
- [ ] Monitor /nyc/long-island-city indexing (check after 2026-04-22)
- [ ] Monitor /best-time-to-rent-nyc indexing (check after 2026-04-21)
- [ ] Monitor /cost-of-moving-to-nyc indexing (check after 2026-04-21)
- [ ] Next neighborhood candidates: Park Slope (Brooklyn family anchor, natural
  complement to Williamsburg + Bushwick cluster) or Harlem (value/growth)
- [ ] Investigate pre-existing React duplicate-key errors (building_profile,
  movein_checklist) in concierge — out of SEO scope but worth fixing
- [ ] Investigate missing onboarding funnel events in GA4
- [ ] Check GA consent management — may block event tracking
- [ ] Build social/Reddit distribution strategy for content

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc/upper-west-side — new page 2026-04-19, check after 2026-04-24
- Cross-links to UWS from 4 pages — 2026-04-19, check after 2026-04-24
- /nyc/bushwick — new page 2026-04-18, check after 2026-04-23
- E-E-A-T fix on /blog/nyc-apartment-scams — 2026-04-18, check after 2026-04-23
- /nyc/long-island-city — new page 2026-04-17, check after 2026-04-22
- /best-time-to-rent-nyc — 2026-04-16, check after 2026-04-21
- /cost-of-moving-to-nyc — 2026-04-16 AM, check after 2026-04-21
- /nyc/astoria — INDEXED at pos 20.9 SURGING (12 imp) ✓
- /nyc/williamsburg — INDEXED at pos 59.2 (5 imp, 5x jump) ✓
- /nyc/east-village — INDEXED at pos 10.0 ✓
- /nyc-rent-by-neighborhood — INDEXED at pos 10.7 ✓
- /blog/nyc-rent-stabilization-guide — INDEXED at pos 55.8 ✓
- /blog/nyc-fare-act-broker-fee-ban — INDEXED at pos 95 ✓

### Key Numbers (2026-04-19)
- GA4 30d: 13 users, 91 sessions, 609 pageviews, 27.5% bounce
- GSC 30d: 1 click, ~186 page-impressions, 50 queries
- GSC daily Apr 17: 17 impressions at pos 11.7 (best sustained position yet)
- Astoria: pos 25.4 → 20.9 in one session, 5 → 12 impressions
- Williamsburg: 1 → 5 impressions (5x)
- Traffic: 100% direct, 0% organic (still)
- Total blog posts: 27
- Total guide pages: 7
- Total neighborhood pages: 6 (EV + Williamsburg + Astoria + LIC + Bushwick + UWS)

---

- Each session adds a dated section at the top
- Check `Not Yet Done` items from previous sessions before starting new work
- Don't judge SEO changes for at least 3-5 days after making them
- Mark completed items with [x], pending with [ ]

---

## 2026-04-18 -- Session 11 (Bushwick Guide + Apartment Scams E-E-A-T Fix)

### Context
- Eleventh growth agent run. Astoria continues improving fast: pos 33.7 → **25.4**
  (now 5 imp vs. 3 last session) — fastest single-day position improvement so far.
- Apr 16 had only 3 impressions but best-ever avg position of 9.7.
- GA4: +2 users, +10 sessions, +63 pageviews vs. last session.
- /blog/nyc-apartment-scams STILL not in GSC — 6 days overdue (every other page
  indexed in 2–3 days). E-E-A-T fix applied today.
- LIC (created Apr 17) not yet in GSC — too new (check Apr 22).
- /best-time-to-rent-nyc and /cost-of-moving-to-nyc pending reindex (check Apr 21).

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Fixed GA4 pull script DEADLINE_EXCEEDED timeout — added retry with 60s
  timeout and 3-attempt backoff
- [x] Created /nyc/bushwick neighborhood guide (~800 lines)
  - Target keywords: "Bushwick apartments", "Bushwick Brooklyn rent",
    "Bushwick rent prices 2026", "apartments for rent Bushwick Brooklyn",
    "Bushwick studios rent", "Bushwick 1 bedroom rent", "moving to Bushwick",
    "East Williamsburg apartments", "Bushwick loft apartments"
  - 5-row rent price table, 6-row vs-neighbors comparison table (shadcn Table)
  - Detailed transit guide: L train (6 stops), M, J/Z, biking
  - 5 sub-neighborhoods: East Williamsburg/Morgan, Wyckoff Ave corridor,
    Central Bushwick/Halsey-Wilson, Ridgewood border, South Bushwick
  - Lifestyle section: arts scene, food (Roberta's), grocery weakness
  - Is Bushwick right for you? pros/cons grid
  - Structured data: Article + FAQPage (6 Qs) + BreadcrumbList
  - 5th neighborhood page, 2nd Brooklyn neighborhood
- [x] Added /nyc/bushwick to sitemap
- [x] Cross-linked FROM 4 pages:
  - /nyc/williamsburg — "vs. Bushwick" body (now a link) + Related Guides
  - /nyc-rent-by-neighborhood — Brooklyn section body + Related Guides
  - /best-time-to-rent-nyc — Related Guides
  - /blog/neighborhood-research-for-renters — article body
- [x] E-E-A-T fix for /blog/nyc-apartment-scams (YMYL trust signals):
  - Added `reviewedAt?: string` and `author?: string` to BlogArticleMeta type
  - Added `reviewedAt: "2026-04-18"` + `author: "Wade Me Home Editorial Team"`
    to scams article metadata
  - Updated blog `[slug]/page.tsx` template: Article JSON-LD now uses
    `dateModified`, `@type: Person` author when set; visible byline + last-reviewed
    date displayed
  - Made 7 external citations clickable links (FBI IC3, HPD, ACRIS, eAccessNY,
    NYPD, FTC, NY AG)
  - Added "Sources and resources" card with 6 authority links
- [x] Build verified: `npm run build` → exit code 0 (8.1 min)
- [x] Wrote analytics report (analytics/reports/2026-04-18.md)

### Not Yet Done (queue for future sessions)
- [ ] Monitor /nyc/bushwick indexing (check after 2026-04-23)
- [ ] Check if /blog/nyc-apartment-scams finally appears in GSC (E-E-A-T fix
  applied 2026-04-18; give 3–5 days, check after 2026-04-23)
- [ ] Monitor /best-time-to-rent-nyc indexing (check after 2026-04-21)
- [ ] Monitor /cost-of-moving-to-nyc indexing (check after 2026-04-21)
- [ ] Monitor /nyc/long-island-city indexing (check after 2026-04-22)
- [ ] Check Astoria position trajectory — continuing to improve past pos 25?
- [ ] Next neighborhood candidates: UWS (family/high income), Park Slope
  (Brooklyn family anchor), Harlem (value+growth). Bushwick was highest volume;
  UWS or Park Slope is next.
- [ ] Investigate east-village pos 10 → 0 click gap (needs more impressions)
- [ ] Investigate missing onboarding funnel events in GA4
- [ ] Check GA consent management — may block event tracking
- [ ] Build social/Reddit distribution strategy for content
- [ ] Consider "Bushwick vs. Williamsburg: Full Comparison" spoke guide once
  both pages are indexed

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc/bushwick — new page 2026-04-18, check after 2026-04-23
- Cross-links to Bushwick from 4 pages — 2026-04-18, check after 2026-04-23
- E-E-A-T fix on /blog/nyc-apartment-scams — 2026-04-18, check after 2026-04-23
- Blog template dateModified/author JSON-LD — 2026-04-18, check after 2026-04-23
- /nyc/long-island-city — new page 2026-04-17, check after 2026-04-22
- Cross-links to LIC from 6 pages — 2026-04-17, check after 2026-04-22
- /best-time-to-rent-nyc — 2026-04-16, check after 2026-04-21
- /cost-of-moving-to-nyc — 2026-04-16, check after 2026-04-21
- /nyc/astoria — INDEXED at pos 25.4 and improving ✓
- /nyc/williamsburg — INDEXED at pos 57 ✓
- /nyc/east-village — INDEXED at pos 10 ✓
- /nyc-rent-by-neighborhood — INDEXED at pos 10.7 ✓
- /blog/nyc-rent-stabilization-guide — INDEXED at pos 55.8 ✓
- /blog/nyc-fare-act-broker-fee-ban — INDEXED at pos 95 ✓
- /blog/nyc-apartment-scams — E-E-A-T fix 2026-04-18, monitor from 2026-04-23

### Key Numbers (2026-04-18)
- GA4 30d: 13 users, 81 sessions, 541 pageviews, 32% bounce
- GSC 30d: 1 click, ~155 page-impressions, 50 queries, avg position ~10 (best)
- GSC daily: Apr 13=25, Apr 14=19, Apr 15=22, Apr 16=3 (pos 9.7!)
- Astoria: pos 33.7 → 25.4 in 1 day (fastest improvement so far)
- Traffic: 100% direct, 0% organic (still)
- Total blog posts: 27
- Total guide pages: 7
- Total neighborhood pages: 5 (EV + Williamsburg + Astoria + LIC + Bushwick)

---

## 2026-04-17 -- Session 10 (Long Island City Neighborhood Guide)

### Context
- Tenth growth agent run. Apr 15 GSC hit **best avg position ever (12.4)** on
  22 impressions — content pages are driving position improvements faster
  than impression totals.
- MILESTONE: /nyc/astoria indexed at pos 33.7 in ~2 days (created 2026-04-15).
- MILESTONE: /nyc/williamsburg ranking for commercial-intent "apartments for
  rent williamsburg" at pos 57.
- MILESTONE: /nyc/east-village at pos 10 (page 1!).
- Rent stabilization guide now #1 content page with 19 impressions / 5+ queries
  (up from 18 imp / 11 queries in session 9 — different query cut).
- Apartment scams post STILL not in GSC — 5 days overdue. Outlier vs other
  content. Likely E-E-A-T issue with "scams" trigger word. Deadline: 2026-04-19.
- Neighborhood-page pattern proven: faster indexing + commercial-intent capture
  than blog posts.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Created /nyc/long-island-city neighborhood guide (~800 lines)
  - Target keywords: "LIC apartments", "Long Island City apartments",
    "LIC rent prices", "Court Square apartments", "Hunters Point apartments",
    "LIC no fee apartments", "LIC luxury apartments"
  - 4 sub-neighborhood breakdown: Court Square, Hunters Point, Hallets Point,
    Queens Plaza + older walkup stock
  - Unique sections: luxury building amenities explainer, rent concessions /
    net-effective-rent guide (LIC has deepest concessions in NYC)
  - 6-row LIC-vs-neighbors rent comparison table (shadcn Table)
  - Structured data: Article + FAQPage (6 Qs) + BreadcrumbList
  - 4th neighborhood page — second Queens neighborhood (paired with Astoria)
- [x] Added /nyc/long-island-city to sitemap
- [x] Cross-linked FROM 4 neighborhood/guide pages:
  - /nyc/astoria (both body "vs. LIC" section + Related Guides)
  - /nyc/williamsburg (Related Guides)
  - /nyc/east-village (Related Guides)
  - /nyc-rent-by-neighborhood (Queens body text + Related Guides list)
- [x] Cross-linked FROM 2 additional pages:
  - /best-time-to-rent-nyc (Related Guides — LIC = deepest winter concessions)
  - /blog/nyc-fare-act-broker-fee-ban (body — LIC was no-fee before FARE Act)
- [x] Verified build compiles (LIC: 2.34 kB, 197 kB First Load)
- [x] Verified in browser preview — H1 correct, JSON-LD present, Table renders,
  cross-links bidirectional (Astoria → LIC confirmed)
- [x] Wrote analytics report (analytics/reports/2026-04-17.md)

### Not Yet Done (queue for future sessions)
- [ ] Monitor /nyc/long-island-city indexing (check after 2026-04-22)
- [ ] Check which queries /nyc/astoria captures beyond the 3 known
- [ ] Once /best-time-to-rent-nyc indexes (2026-04-21), analyze queries
- [ ] Once /cost-of-moving-to-nyc indexes (2026-04-21), analyze queries
- [ ] If apartment scams post still missing by 2026-04-19, add E-E-A-T signals
  (author bio, cited sources, last-reviewed date)
- [ ] Next neighborhood candidates (in priority order based on search volume):
  Bushwick (Brooklyn alt, highest search volume), UWS (family), Park Slope
  (family Brooklyn), Harlem (growth segment)
- [ ] Investigate east-village pos 10 → 0 click gap once more data available
  (could be title/description CTR issue on page 1)
- [ ] Investigate missing onboarding funnel events in GA4
- [ ] Check GA consent management -- may be blocking event tracking
- [ ] Build social/Reddit distribution strategy for content
- [ ] Once LIC indexes, spin off potential spoke content: "LIC vs Astoria
  decision guide", "NYC waterfront apartments comparison"

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc/long-island-city -- new page created 2026-04-17, check after 2026-04-22
- Cross-links to LIC from 6 pages -- 2026-04-17, check after 2026-04-22
- /best-time-to-rent-nyc -- new pillar created 2026-04-16, check after 2026-04-21
- /cost-of-moving-to-nyc -- new page created 2026-04-16, check after 2026-04-21
- Cross-links to best-time-to-rent from 7 pages -- 2026-04-16, check 2026-04-21
- Rent stabilization meta optimization -- 2026-04-16, check after 2026-04-21
- /nyc/astoria -- INDEXED at pos 33.7 ✓ (3 imp on astoria-rent queries)
- /nyc/williamsburg -- INDEXED at pos 57 ✓ ("apartments for rent williamsburg")
- /nyc/east-village -- INDEXED at pos 10 ✓ (page 1 but 0 clicks)
- /nyc-rent-by-neighborhood -- INDEXED at pos 10.7 ✓ (17 imp)
- /blog/nyc-rent-stabilization-guide -- INDEXED at pos 55.8 ✓ (19 imp, 5+ queries)
- /blog/nyc-fare-act-broker-fee-ban -- INDEXED at pos 95 ✓
- /blog/nyc-apartment-scams -- created 2026-04-12, OVERDUE (5 days, still missing)

### Key Numbers (2026-04-17)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged)
- GSC 30d: 0 new clicks, ~112 page-impressions, 50 queries, avg position ~30
- GSC best day: Apr 15 = 22 impressions at pos 12.4 (BEST EVER)
- GSC daily: Apr 9=25, Apr 10=11, Apr 11=6, Apr 12=21, Apr 13=25, Apr 14=19, Apr 15=22
- Traffic: 100% direct, 0% organic (still)
- Total blog posts: 27
- Total guide pages: 7
- Total neighborhood pages: 4 (East Village + Williamsburg + Astoria + LIC)
- Content-page share of impressions: ~35% (growing)

---

## 2026-04-16 -- Session 9 (Best-Time-to-Rent NYC Pillar + Rent Stabilization Meta)

### Context
- Ninth growth agent run, second of the day (session 8 was earlier today).
- GSC data essentially unchanged from morning pull — Google hasn't published Apr 15 data
  yet. 117 impressions, 50 queries, /blog/nyc-rent-stabilization-guide still 18 imp pos
  58.5, /nyc-rent-by-neighborhood still 17 imp pos 10.7.
- Used the cycle to ship the high-seasonal-relevance pillar page from the queue rather
  than micro-optimize stale data.
- Apartment scams post (created Apr 12) STILL not in GSC — 4 days past. Slower indexing
  than rent stabilization (2 days) or FARE Act (3 days). Possibly trust signal issue
  with "scams" trigger word; monitor for Apr 18 — if still missing, consider adding
  E-E-A-T signals.
- Rent stabilization is best-performing post (11 ranking queries) — optimized meta to
  match actual ranking queries, not assumed ones.

### Completed
- [x] Pulled fresh GA4 and GSC data (essentially unchanged from session 8)
- [x] Created comprehensive /best-time-to-rent-nyc seasonal pillar page (~700 lines)
  - Target keywords: "best time to rent apartment NYC", "when to start looking for
    apartment NYC", "NYC rental season", "cheapest month to rent NYC", "NYC apartment
    hunting timeline", "NYC rental market timing"
  - 12-row seasonal price/inventory/competition/leverage index table (shadcn Table)
  - Month-by-month breakdown (7 sections covering all 12 months)
  - 5 renter-type strategy personas (recent grad, flexible pro, couple, family, roommates)
  - Negotiation leverage by season table
  - Net effective vs gross rent explainer
  - 90/60/30-day apartment hunting timeline
  - Structured data: Article + FAQPage (7 questions) + BreadcrumbList
  - 12+ internal links out to neighborhood pages, cost guide, search guide, etc.
- [x] Added /best-time-to-rent-nyc to sitemap
- [x] Cross-linked FROM 4 guide pages: search-guide, rent-by-neighborhood, moving-checklist,
  cost-of-moving
- [x] Cross-linked FROM 3 blog posts: apartment-search-tips, lease-renewal-vs-moving,
  negotiating-rent-and-lease-terms
- [x] Optimized /blog/nyc-rent-stabilization-guide title + description + keywords based
  on actual GSC ranking queries (added "rent increase laws", "lease renewal", "rent
  stabilization NYC code")
- [x] Verified build compiles successfully (best-time-to-rent-nyc: 994 B, 195 kB First Load)
- [x] Wrote analytics report (analytics/reports/2026-04-16-b.md)

### Not Yet Done (queue for future sessions)
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Create more neighborhood pages: Bushwick, UWS, or LIC next (if existing ones gain traction)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Monitor /nyc-rent-by-neighborhood position after meta optimization (target: top 10 for clicks)
- [ ] Monitor apartment scams post — if still missing in GSC after Apr 18, add E-E-A-T
  signals (author bio, sources)
- [ ] Once /best-time-to-rent-nyc indexes, spin off spoke posts: "winter NYC apartment
  hunting playbook", "summer NYC rental sprint guide", "NYC rental concessions explained"
- [ ] Once /cost-of-moving-to-nyc indexes (created Apr 16 AM), check which queries it captures
- [ ] Monitor property page impressions — if trend continues, optimize property page meta titles

### SEO Changes Pending Reindex (don't judge before date shown)
- /best-time-to-rent-nyc -- new pillar page created 2026-04-16, check after 2026-04-21
- Cross-links to best-time-to-rent from 7 pages -- 2026-04-16, check after 2026-04-21
- Rent stabilization meta optimization -- 2026-04-16, check after 2026-04-21
- /cost-of-moving-to-nyc -- new page created 2026-04-16 AM, check after 2026-04-21
- Cross-links to cost guide from 6 pages -- 2026-04-16, check after 2026-04-21
- /nyc/astoria -- new page created 2026-04-15, check after 2026-04-20
- /nyc-rent-by-neighborhood meta title/description updated 2026-04-15, check after 2026-04-20
- /nyc/williamsburg -- new page created 2026-04-14, check after 2026-04-19
- /nyc/east-village -- new page created 2026-04-13, check after 2026-04-18
- robots.txt updated (disallow app routes) -- 2026-04-13, check after 2026-04-18
- /blog/nyc-apartment-scams -- created 2026-04-12, OVERDUE for indexing (4 days, still missing)
- /blog/nyc-rent-stabilization-guide -- created 2026-04-12, INDEXED at position 58.5 ✓ (18 imp, 11 queries!)
- /blog/nyc-fare-act-broker-fee-ban -- created 2026-04-11, INDEXED at position 95 ✓
- /nyc-rent-by-neighborhood -- created 2026-04-10, INDEXED at position 10.7 ✓

### Key Numbers (2026-04-16 PM)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged)
- GSC 30d: 1 click, 117 impressions (flat from AM), 50 queries (flat), avg position ~30
- GSC daily: Apr 8=12, Apr 9=25, Apr 10=11, Apr 11=6, Apr 12=21, Apr 13=25, Apr 14=19
  (Apr 15 still not reported)
- Traffic: 100% direct, 0% organic
- Total blog posts: 27
- Total guide pages: 7 (added best-time-to-rent-nyc)
- Total neighborhood pages: 3
- Pages with GSC data: ~50

---

## 2026-04-16 -- Session 8 (NYC Move-In Costs Guide + Table Component)

### Context
- Eighth growth agent run. GSC impressions grew to 117 (was 111, +5.4%).
- 50 queries now (was 49).
- Rent stabilization guide surged to 18 impressions across 10 queries (was 11 imp / 5 queries).
- /nyc-rent-by-neighborhood holding at position 10.7 — still on edge of page 1.
- New daily data: Apr 14 = 19 impressions, maintaining 19-25/day range.
- GA4 essentially unchanged — no real users since early April.
- Apartment scams post still not in GSC (created Apr 12, check tomorrow).

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Created comprehensive /cost-of-moving-to-nyc guide page
  - ~600 lines, 10 sections covering every move-in expense
  - Target keywords: "cost of moving to NYC", "how much does it cost to move to NYC", "NYC move-in costs", "first apartment NYC budget"
  - 3 cost comparison tables + 3 scenario budgets (Astoria studio, Williamsburg 1BR, East Village 2BR split)
  - Structured data: Article + FAQPage (5 questions) + BreadcrumbList
  - 15+ internal links to existing content
  - Added shadcn/ui Table component to the project
- [x] Added /cost-of-moving-to-nyc to sitemap
- [x] Cross-linked FROM 4 guide pages: movers, moving checklist, rent-by-neighborhood, move-in cleaning
- [x] Cross-linked FROM 2 blog posts: broker-fees-and-upfront-costs, security-deposits-move-in-fees
- [x] Fixed missing Link import in security-deposits-move-in-fees article
- [x] Verified build compiles successfully
- [x] Wrote analytics report (analytics/reports/2026-04-16.md)

### Not Yet Done (queue for future sessions)
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Create more neighborhood pages: Bushwick, UWS, or LIC next (if existing ones gain traction)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Monitor /nyc-rent-by-neighborhood position after meta optimization (target: top 10 for clicks)
- [ ] Optimize rent stabilization blog post meta — it now has 10 queries, consider improving title/description for highest-volume ones
- [ ] Monitor apartment scams post — should appear in GSC any day now (created Apr 12)
- [ ] Monitor property page impressions — if trend continues, optimize property page meta titles
- [ ] Once cost-of-moving page indexes, check which queries it captures
- [ ] Consider creating a "best time to rent apartment NYC" standalone page (high seasonal relevance)

### SEO Changes Pending Reindex (don't judge before date shown)
- /cost-of-moving-to-nyc -- new page created 2026-04-16, check after 2026-04-21
- Cross-links to cost guide from 6 pages -- 2026-04-16, check after 2026-04-21
- /nyc/astoria -- new page created 2026-04-15, check after 2026-04-20
- /nyc-rent-by-neighborhood meta title/description updated 2026-04-15, check after 2026-04-20
- /nyc/williamsburg -- new page created 2026-04-14, check after 2026-04-19
- /nyc/east-village -- new page created 2026-04-13, check after 2026-04-18
- robots.txt updated (disallow app routes) -- 2026-04-13, check after 2026-04-18
- /blog/nyc-apartment-scams -- created 2026-04-12, check after 2026-04-17 (TOMORROW)
- /blog/nyc-rent-stabilization-guide -- created 2026-04-12, INDEXED at position 58.5 ✓ (18 imp, 10 queries!)
- /blog/nyc-fare-act-broker-fee-ban -- created 2026-04-11, INDEXED at position 95 ✓
- /nyc-rent-by-neighborhood -- created 2026-04-10, INDEXED at position 10.7 ✓

### Key Numbers (2026-04-16)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged)
- GSC 30d: 1 click, 117 impressions (+5.4%), 50 queries (was 49), avg position ~30
- GSC daily: Apr 8=12, Apr 9=25, Apr 10=11, Apr 11=6, Apr 12=21, Apr 13=25, Apr 14=19
- Traffic: 100% direct, 0% organic
- Total blog posts: 27
- Total guide pages: 6 (added cost-of-moving-to-nyc)
- Total neighborhood pages: 3 (East Village + Williamsburg + Astoria)
- Pages with GSC data: ~50

---

## 2026-04-15 -- Session 7 (Astoria Guide + Rent-by-Neighborhood Meta Optimization)

### Context
- Seventh growth agent run. GSC impressions surged to 111 (was 86, +29%).
- 49 queries now (was 38).
- MILESTONE: /blog/nyc-rent-stabilization-guide appeared in GSC at position 58.5 with 11 impressions — second blog post indexed!
- /nyc-rent-by-neighborhood improved to position 10.7 (was 13.8) — approaching top 10!
- Rent stabilization post ranking for 5 different queries: "nyc rent increase laws", "rent stabilization nyc increase", "stabilized rent", etc.
- Apr 13 daily: 25 impressions (matching Apr 9 peak).
- Content pages now account for 45% of impressions (up from ~35%).
- No user activity since Apr 6. All traffic still 100% direct.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Optimized /nyc-rent-by-neighborhood meta title and description for page 1 push
  - New title: "NYC Rent Prices by Neighborhood (2026): What You'll Pay in Every Borough"
  - Front-loaded keyword, added curiosity hook, removed site name for space
  - Updated dateModified to 2026-04-15
- [x] Created Astoria neighborhood guide (/nyc/astoria)
  - ~2,500 words, 10 sections including FAQ with 5 questions
  - Dedicated dining scene section (unique differentiator for Astoria)
  - 5 micro-neighborhoods: Ditmars, Broadway Corridor, 30th Avenue, South Astoria/Ravenswood, Steinway Street
  - Target keywords: "Astoria apartments", "Astoria Queens rent", "Astoria rent prices 2026"
  - Structured data: Article + FAQPage + BreadcrumbList
  - Internal links to roommates, rental application, lease negotiation, scams, FARE Act, Williamsburg, East Village
  - Third neighborhood page — first Queens neighborhood
- [x] Added /nyc/astoria to sitemap
- [x] Cross-linked FROM nyc-rent-by-neighborhood (body text + related guides section)
- [x] Cross-linked FROM Williamsburg page (related guides section)
- [x] Cross-linked FROM East Village page (related guides section)
- [x] Cross-linked FROM neighborhood-research-for-renters blog post
- [x] Verified build compiles successfully
- [x] Wrote analytics report (analytics/reports/2026-04-15.md)

### Not Yet Done (queue for future sessions)
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Create more neighborhood pages: Bushwick, UWS, or LIC next (if Astoria/East Village/Williamsburg gain traction)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Monitor /nyc-rent-by-neighborhood position after meta optimization (target: top 10 for clicks)
- [ ] Optimize rent stabilization blog post meta if positions improve (currently pos 50-64 on 5 queries)
- [ ] Once more blog posts appear in GSC, analyze which get impressions and optimize meta descriptions
- [ ] Monitor property page impressions — if trend continues, optimize property page meta titles for building-name queries
- [ ] If blog indexing pace continues, watch for apartment scams post to appear in GSC (created Apr 12)

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc/astoria -- new page created 2026-04-15, check after 2026-04-20
- /nyc-rent-by-neighborhood meta title/description updated 2026-04-15, check after 2026-04-20
- Cross-links to Astoria from 4 pages -- 2026-04-15, check after 2026-04-20
- /nyc/williamsburg -- new page created 2026-04-14, check after 2026-04-19
- /nyc/east-village -- new page created 2026-04-13, check after 2026-04-18
- robots.txt updated (disallow app routes) -- 2026-04-13, check after 2026-04-18
- noindex on /login and /profile -- 2026-04-13, check after 2026-04-18
- /blog/nyc-apartment-scams -- created 2026-04-12, NOW IN REINDEX WINDOW (not yet in GSC)
- /blog/nyc-rent-stabilization-guide -- created 2026-04-12, INDEXED at position 58.5 ✓
- /blog/nyc-fare-act-broker-fee-ban -- created 2026-04-11, INDEXED at position 95 ✓
- BreadcrumbList JSON-LD added 2026-04-11, PAST REINDEX WINDOW ✓
- /nyc-rent-by-neighborhood -- created 2026-04-10, INDEXED at position 10.7 ✓

### Key Numbers (2026-04-15)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged)
- GSC 30d: 1 click, 111 impressions (+29%), 49 queries (was 38), avg position ~30
- GSC daily: Apr 8=12, Apr 9=25, Apr 10=11, Apr 11=6, Apr 12=21, Apr 13=25
- Traffic: 100% direct, 0% organic
- Total blog posts: 27
- Total guide pages: 5
- Total neighborhood pages: 3 (East Village + Williamsburg + Astoria)
- Pages with GSC data: ~30+

---

## 2026-04-14 -- Session 6 (Williamsburg Guide + First Blog Indexed)

### Context
- Sixth growth agent run. GSC impressions surged to 86 (was 65, +32%).
- 38 queries now (was 30).
- MILESTONE: /blog/nyc-fare-act-broker-fee-ban appeared in GSC at position 95 — first blog post indexed!
- /nyc-rent-by-neighborhood improved to position 13.8 (was 15).
- /login still showing in GSC (noindex from Apr 13 hasn't been re-crawled yet).
- No user activity since Apr 6. All traffic still 100% direct.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Created Williamsburg neighborhood guide (/nyc/williamsburg)
  - ~2,200 words, 8 sections including FAQ with 5 questions
  - Target keywords: "Williamsburg apartments", "Williamsburg Brooklyn rent", "Williamsburg rent prices 2026"
  - Structured data: Article + FAQPage + BreadcrumbList
  - Internal links to roommates, rental application, lease negotiation, scams, FARE Act, East Village
  - Second neighborhood page — builds out the /nyc/ directory
- [x] Added /nyc/williamsburg to sitemap
- [x] Cross-linked FROM nyc-rent-by-neighborhood (body text + related guides section)
- [x] Cross-linked FROM East Village page ("vs. Williamsburg" section)
- [x] Cross-linked FROM neighborhood-research-for-renters blog post
- [x] Verified build compiles successfully
- [x] Wrote analytics report (analytics/reports/2026-04-14.md)

### Not Yet Done (queue for future sessions)
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Create more neighborhood pages: Astoria, Bushwick next (if Williamsburg/East Village gain traction)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Monitor property page impressions — if trend continues, optimize property page meta titles for building-name queries
- [ ] Once more blog posts appear in GSC, analyze which get impressions and optimize meta descriptions
- [ ] If blog indexing pace is slow, consider splitting sitemap into sitemap index (blog, properties, guides separate)
- [ ] Optimize FARE Act blog post meta if it starts getting impressions for competitive queries

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc/williamsburg -- new page created 2026-04-14, check after 2026-04-19
- Cross-links to Williamsburg from 3 pages -- 2026-04-14, check after 2026-04-19
- /nyc/east-village -- new page created 2026-04-13, check after 2026-04-18
- robots.txt updated (disallow app routes) -- 2026-04-13, check after 2026-04-18
- noindex on /login and /profile -- 2026-04-13, check after 2026-04-18
- FAQPage schema on /blog/nyc-apartment-scams -- 2026-04-13, check after 2026-04-18
- /blog/nyc-apartment-scams -- created 2026-04-12, NOW IN REINDEX WINDOW
- /blog/nyc-rent-stabilization-guide -- created 2026-04-12, NOW IN REINDEX WINDOW
- /blog/nyc-fare-act-broker-fee-ban -- created 2026-04-11, INDEXED at position 95 ✓
- BreadcrumbList JSON-LD added 2026-04-11, PAST REINDEX WINDOW ✓
- /nyc-rent-by-neighborhood -- created 2026-04-10, INDEXED at position 13.8 ✓

### Key Numbers (2026-04-14)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged)
- GSC 30d: 1 click, 86 impressions (+32%), 38 queries (was 30), avg position ~30 (improved from ~37)
- GSC daily: Apr 8=12, Apr 9=25, Apr 10=11, Apr 11=6, Apr 12=21
- Traffic: 100% direct, 0% organic
- Total blog posts: 27
- Total guide pages: 5
- Total neighborhood pages: 2 (East Village + Williamsburg)
- Pages with GSC data: ~15+

---

## 2026-04-13 -- Session 5 (East Village Guide + Technical SEO Fix + FAQ Schema)

### Context
- Fifth growth agent run. GSC impressions surged to 65 (was 48, +35%).
- 38 pages now indexed (up from ~30). Average position improved to ~37 (was ~44).
- /nyc-rent-by-neighborhood appeared in GSC at position 15 — new page indexed in 3 days!
- Brand query "wade me" appeared at position 4 (2 impressions).
- PROBLEM: /login (5 impressions) and /profile (1 impression) were being indexed.
- Blog posts still not in GSC — expected, wait until Apr 16-17.
- No user activity since Apr 6. All traffic still 100% direct.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Fixed app routes being indexed — updated robots.ts to disallow /login, /profile, /onboarding, /search, /app, /tours, /lease, /move-in, /roommates, /guarantor
- [x] Added noindex layout wrappers for /login and /profile routes
- [x] Created East Village neighborhood guide (/nyc/east-village)
  - ~2,000 words, 7 sections including FAQ with 5 questions
  - Target keywords: "East Village apartments", "East Village rent", "moving to East Village NYC"
  - Structured data: Article + FAQPage + BreadcrumbList
  - Internal links to roommates, rental application, lease negotiation, scams, FARE Act
  - First neighborhood-specific landing page — template for future expansion
- [x] Added /nyc/east-village to sitemap
- [x] Cross-linked FROM nyc-rent-by-neighborhood (body text + related guides section)
- [x] Cross-linked FROM neighborhood-research-for-renters blog post
- [x] Added FAQPage JSON-LD to apartment scams blog post (5 questions)
- [x] Verified build compiles successfully
- [x] Wrote analytics report (analytics/reports/2026-04-13.md)

### Not Yet Done (queue for future sessions)
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Create more neighborhood-specific pages if /nyc/east-village gains traction (Williamsburg, Astoria, Bushwick next)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Monitor property page impressions — if trend continues, optimize property page meta titles for building-name queries
- [ ] Once blog posts appear in GSC, analyze which get impressions and optimize meta descriptions
- [ ] If blog still absent from GSC after Apr 16, consider splitting sitemap into index or reducing property page count

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc/east-village -- new page created 2026-04-13, check after 2026-04-18
- robots.txt updated (disallow app routes) -- 2026-04-13, check after 2026-04-18
- noindex on /login and /profile -- 2026-04-13, check after 2026-04-18
- FAQPage schema on /blog/nyc-apartment-scams -- 2026-04-13, check after 2026-04-18
- Cross-links to East Village from 2 pages -- 2026-04-13, check after 2026-04-18
- /blog/nyc-apartment-scams -- new post created 2026-04-12, check after 2026-04-17
- HowTo schema on /nyc-move-in-cleaning -- 2026-04-12, check after 2026-04-17
- /blog/nyc-rent-stabilization-guide -- new post created 2026-04-12, check after 2026-04-17
- /blog/nyc-fare-act-broker-fee-ban -- new post created 2026-04-11, check after 2026-04-16
- BreadcrumbList JSON-LD added to all blog + guide pages 2026-04-11, check after 2026-04-16
- /nyc-rent-by-neighborhood -- new page created 2026-04-10, APPEARING at position 15 ✓

### Key Numbers (2026-04-13)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged)
- GSC 30d: 1 click, 65 impressions (+35%), 30 queries (was 28), avg position ~37 (improved from ~44)
- GSC daily: Apr 8=12, Apr 9=25, Apr 10=11, Apr 11=6
- Traffic: 100% direct, 0% organic
- Total blog posts: 27
- Total guide pages: 5
- Total neighborhood pages: 1 (East Village — new)
- Total pages indexed in GSC: 38

---

## 2026-04-12 -- Session 4 (Apartment Scams Blog + HowTo Schema + Indexing Investigation)

### Context
- Fourth growth agent run. GSC queries grew from 25→28 (3 new property-name queries).
- Apr 10 daily data now available: 11 impressions (down from Apr 9 peak of 25).
- Blog posts STILL not appearing in GSC — investigated and confirmed it's not a technical issue.
- No user activity since Apr 6. All traffic still 100% direct.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Investigated blog indexing issue — confirmed SSR, metadata, JSON-LD all correct
  - Root cause: large sitemap (~12K URLs) + new domain = slow crawl budget allocation to blog content
  - Not a bug to fix; patience required
- [x] Added HowTo JSON-LD schema to /nyc-move-in-cleaning (3 steps: kitchen, bathroom, living areas)
  - Confirmed /nyc-moving-checklist already had HowTo schema — cleared from queue
- [x] Created new blog post: NYC Apartment Scams (/blog/nyc-apartment-scams)
  - ~1,800 words, 7 sections including FAQ with 5 questions
  - Target keywords: "NYC apartment scams", "rental scams NYC", "apartment scam red flags", "fake apartment listing", "Craigslist apartment scam"
  - Internal links to homepage, rent-by-neighborhood, FARE Act, rent stabilization, security deposits
- [x] Added cross-links TO apartment scams post from:
  - broker-fees-and-upfront-costs blog post
  - apartment-search-tips blog post
  - rental-application-screening-basics blog post
- [x] Verified build compiles successfully
- [x] Wrote analytics report (analytics/reports/2026-04-12-b.md)

### Not Yet Done (queue for future sessions)
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Consider neighborhood-specific landing pages (e.g., /nyc/williamsburg, /nyc/astoria)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Monitor property page impressions — if trend continues, optimize property page meta titles for building-name queries
- [ ] Once blog posts appear in GSC, analyze which get impressions and optimize meta descriptions
- [ ] If blog still absent from GSC after Apr 16, consider splitting sitemap into index or reducing property page count
- [ ] Consider adding FAQPage JSON-LD to apartment scams blog post (content is structured for it)

### SEO Changes Pending Reindex (don't judge before date shown)
- /blog/nyc-apartment-scams -- new post created 2026-04-12, check after 2026-04-17
- HowTo schema on /nyc-move-in-cleaning -- 2026-04-12, check after 2026-04-17
- Cross-links to apartment scams from 3 pages -- 2026-04-12, check after 2026-04-17
- /blog/nyc-rent-stabilization-guide -- new post created 2026-04-12, check after 2026-04-17
- /blog/nyc-fare-act-broker-fee-ban -- new post created 2026-04-11, check after 2026-04-16
- BreadcrumbList JSON-LD added to all blog + guide pages 2026-04-11, check after 2026-04-16
- /nyc-rent-by-neighborhood -- new page created 2026-04-10, check after 2026-04-15

### Key Numbers (2026-04-12 session 4)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged)
- GSC 30d: 1 click, 48 impressions, 28 queries (was 25), avg position ~44
- GSC daily: Apr 10 = 11 impressions (new data point)
- Traffic: 100% direct, 0% organic
- Total blog posts: 27 (added apartment scams)
- Total guide pages: 5

---

## 2026-04-12 -- Session 3 (Rent Stabilization Blog + Cross-Linking)

### Context
- Third growth agent run. GSC queries jumped from 9→25 (property pages being indexed broadly).
- GSC impressions stable at 48 but spread across many more queries now.
- "manhattan apartment movers" appeared as a new query (position 78).
- Blog posts still not appearing in GSC — BreadcrumbList/cross-link changes from Apr 11 need time.
- No user activity since Apr 6. All traffic still 100% direct.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Created new blog post: NYC Rent Stabilization Explained (/blog/nyc-rent-stabilization-guide)
  - ~2,000 words, 10 sections including FAQ with 6 questions
  - Target keywords: "NYC rent stabilization", "rent stabilized apartment NYC", "rent control NYC", "NYC rent guidelines 2025 2026"
  - Internal links to homepage, rent-by-neighborhood, FARE Act post, negotiating rent post
- [x] Added cross-links TO rent stabilization post from:
  - negotiating-rent-and-lease-terms blog post
  - lease-renewal-vs-moving blog post
  - nyc-fare-act-broker-fee-ban blog post
  - nyc-rent-by-neighborhood guide page (Related guides section)
- [x] Confirmed FAQPage JSON-LD already exists on all guide pages with FAQ sections (movers, cleaning, rent-by-neighborhood) — worklog item cleared
- [x] Verified build compiles successfully
- [x] Wrote analytics report (analytics/reports/2026-04-12.md)

### Not Yet Done (queue for future sessions)
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Consider neighborhood-specific landing pages (e.g., /nyc/williamsburg, /nyc/astoria)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Monitor property page impressions — if trend continues, optimize property page meta titles for building-name queries
- [ ] Create blog post about NYC apartment scams / rental fraud red flags
- [ ] Consider adding HowTo schema to moving checklist and cleaning guide pages
- [ ] Once blog posts appear in GSC, analyze which get impressions and optimize meta descriptions

### SEO Changes Pending Reindex (don't judge before date shown)
- /blog/nyc-rent-stabilization-guide -- new post created 2026-04-12, check after 2026-04-17
- Cross-links to rent stabilization from 4 pages -- 2026-04-12, check after 2026-04-17
- /blog/nyc-fare-act-broker-fee-ban -- new post created 2026-04-11, check after 2026-04-16
- BreadcrumbList JSON-LD added to all blog + guide pages 2026-04-11, check after 2026-04-16
- Cross-linking updates across guide pages 2026-04-11, check after 2026-04-16
- /nyc-rent-by-neighborhood -- new page created 2026-04-10, check after 2026-04-15
- /nyc-apartment-movers -- meta update 2026-04-10, check after 2026-04-15

### Key Numbers (2026-04-12)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged)
- GSC 30d: 1 click, 48 impressions, 25 queries (was 9), avg position ~44
- GSC daily: peak 25 impressions on Apr 9, quiet since (1 impr on Apr 4, 7)
- Traffic: 100% direct, 0% organic
- Total blog posts: 26 (added rent stabilization)
- Total guide pages: 5

---

## 2026-04-11 -- Session 2 (FARE Act Blog + Structured Data + Cross-Linking)

### Context
- Second growth agent run. GSC impressions doubled (23→48) driven by property page indexing.
- Daily impression trend spiking: 12 on Apr 8, 25 on Apr 9.
- Still zero organic clicks beyond the 1 click on homepage.
- Blog posts not yet appearing in GSC.

### Completed
- [x] Pulled fresh GA4 and GSC data
- [x] Created new blog post: NYC FARE Act Broker Fee Ban (/blog/nyc-fare-act-broker-fee-ban)
  - ~1,500 words, 8 sections including FAQ
  - Target keywords: "NYC broker fee ban", "FARE Act NYC", "no fee apartments NYC"
  - Internal links to rent budget, security deposits, homepage
- [x] Added BreadcrumbList JSON-LD to blog article template (covers all 25 posts)
- [x] Added BreadcrumbList JSON-LD to all 5 guide pages (movers, search guide, cleaning, checklist, rent-by-neighborhood)
- [x] Cross-linked all NYC guide pages to each other (10+ new internal links added)
- [x] Added FARE Act cross-link from broker-fees-and-upfront-costs blog post
- [x] Added FARE Act + guide links to nyc-apartment-search-guide related section
- [x] Verified build compiles successfully
- [x] Wrote analytics report (analytics/reports/2026-04-11.md)

### Not Yet Done (queue for future sessions)
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Consider neighborhood-specific landing pages (e.g., /nyc/williamsburg, /nyc/astoria)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Add FAQPage JSON-LD schema to guide pages with FAQ sections (movers, rent-by-neighborhood)
- [ ] Create blog post about NYC rent stabilization / rent control basics
- [ ] Monitor property page impressions — if trend continues, consider optimizing property page meta titles

### SEO Changes Pending Reindex (don't judge before date shown)
- /blog/nyc-fare-act-broker-fee-ban -- new post created 2026-04-11, check after 2026-04-16
- BreadcrumbList JSON-LD added to all blog + guide pages 2026-04-11, check after 2026-04-16
- Cross-linking updates across guide pages 2026-04-11, check after 2026-04-16
- /nyc-rent-by-neighborhood -- new page created 2026-04-10, check after 2026-04-15
- /nyc-apartment-movers -- meta update 2026-04-10, check after 2026-04-15

### Key Numbers (2026-04-11)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 26.8% bounce (unchanged from baseline)
- GSC 30d: 1 click, 48 impressions (+109%), 9 queries, avg position ~40
- GSC daily: 25 impressions on Apr 9 (up from ~0 a week ago)
- Traffic: 100% direct, 0% organic

---

## 2026-04-10 -- First Session (Baseline + Neighborhood Guide)

### Context
- First ever growth agent run. Established baseline metrics.
- Site is at pre-organic stage: 11 users (all direct/team), zero organic traffic.
- 25 blog posts exist but have zero GSC impressions.
- Property pages are getting indexed (building-name queries showing).
- /nyc-apartment-movers has early signal: 4 impressions at position 78 for "apartment movers nyc".

### Completed
- [x] Pulled GA4 and GSC data, saved to analytics/ JSON files
- [x] Created /nyc-rent-by-neighborhood landing page (350+ lines, FAQPage + Article schema, 10 target keywords)
- [x] Updated /nyc-apartment-movers meta title/description/keywords for better query targeting
- [x] Added internal links from 3 blog posts to new neighborhood guide
- [x] Added /nyc-rent-by-neighborhood to sitemap.ts
- [x] Added cross-link from /nyc-apartment-movers to /nyc-rent-by-neighborhood
- [x] Wrote first analytics report (analytics/reports/2026-04-10.md)

### Not Yet Done (queue for future sessions)
- [ ] Submit /nyc-rent-by-neighborhood to Google for indexing
- [ ] Investigate missing onboarding funnel events in GA4 (onboarding_started etc. not appearing)
- [ ] Add BreadcrumbList JSON-LD to all guide and blog pages
- [ ] Create a blog post about NYC broker fee law changes (trending topic)
- [ ] Build social/Reddit distribution strategy for content
- [ ] Cross-link all NYC guide pages (movers, checklist, search guide, cleaning, neighborhood)
- [ ] Check GA consent management -- may be blocking some event tracking
- [ ] Consider neighborhood-specific landing pages (e.g., /nyc/williamsburg, /nyc/astoria)

### SEO Changes Pending Reindex (don't judge before date shown)
- /nyc-rent-by-neighborhood -- new page created 2026-04-10, check after 2026-04-15
- /nyc-apartment-movers -- meta update 2026-04-10, check after 2026-04-15

### Baseline Numbers (2026-04-10)
- GA4 30d: 11 users, 71 sessions, 478 pageviews, 17.1min avg session, 26.8% bounce
- GSC 30d: 1 click, 23 impressions, 9 queries, avg position ~40
- Traffic: 100% direct, 0% organic
