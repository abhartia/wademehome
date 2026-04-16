# WadeMeHome Growth Agent -- Worklog

This file is the institutional memory for the wademehome-growth scheduled agent. Read it before every session.

## How to Use This File

- Each session adds a dated section at the top
- Check `Not Yet Done` items from previous sessions before starting new work
- Don't judge SEO changes for at least 3-5 days after making them
- Mark completed items with [x], pending with [ ]

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
