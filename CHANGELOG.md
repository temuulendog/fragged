# Changelog

All notable changes to FRAGGED will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.1] — 2026-06-14

### Fixed
- **Premier seasons sometimes missing.** csstats.gg intermittently serves datacenter IPs a small (~8 KB) stub page instead of the full ~170 KB profile (rate-limit / cold render), which made `fetchPremierSeasons` return nothing and skip caching — so some players (especially uncached ones) showed no Premier history. The scraper now **retries until it gets a full page** (detected by size, so a block is never mistaken for "no Premier"); a real full page with no Premier tiles still correctly yields none. Once captured, the result is cached as before.

### Changed
- Bumped the backend's local `wrangler` dev dependency to v4.

---

## [2.2.0] — 2026-06-14

**Premier season history**, a Leetify fallback for accountless players, and a proper mobile layout.

### Added
- **Premier seasons in the header** (`PremierSeasons`) — every CS2 Premier season the player has ranked in, scraped from csstats.gg: each season's **final** rank and **best (peak)** rank, rendered with the in-game Premier banner art (current season on top). Replaces the single big Premier badge.
- **Premier-season cache (Cloudflare D1)** — seasons are stored per player and re-fetched only when needed. Past seasons never change, so they're cached indefinitely; the current season is invalidated by the player's latest Leetify Premier-match timestamp (zero extra requests — Leetify is already fetched), falling back to a 2-hour TTL for players without Leetify. The table is created on first use; a live scrape is used if the binding is ever absent.
- **Backup stats for accountless players** (`BackupCard`) — when a player has no Leetify profile, Leetify-style numbers (Aim, Utility, Positioning, Rating, Opening, Clutch, CT/T, Win Rate, Matches) are sourced from csst.at and shown as a plain stats box — deliberately **not** branded as Leetify (no logo, badge, or "View on Leetify" link).
- **Mobile layout** — the desktop-only fixed grids now collapse to a single column on phones (`useIsMobile`): the header stacks, the card grid goes one-column, and side-by-side blocks stack.

### Changed
- The header **K/D ring** stays but drops its "K/D" text label.

### Removed
- The **Sides** (CT/T) section — those ratings already live in the Leetify card.
- The inline Faceit **level icon** next to the Elo value (the level badge stays in the card header).

---

## [2.1.0] — 2026-06-13

A **boxed dashboard** built on top of the v2.0.0 editorial system — dense, above-the-fold cards in the style of csstats / csst.at, plus the real CS2 Premier rating art throughout.

### Added
- **Boxed card grid** — `Card` / `StatGroup` primitives drive a two-column dashboard of Steam, Leetify, Faceit, and Medals cards.
- **Steam card** (`SteamCard`) — SteamID64, CS2 playtime (total / last 2 weeks), **CS friend code** computed deterministically from the steamID64 (MD5 via the Workers runtime, verified against the in-game value), vanity, registration date, and a clickable Steam-profile name.
- **CS2 Premier rating banner** (`PremierBadge`) — the official csstats rank art (`public/premier/*.png`) tinted per 5K bracket (`common` → `unusual`), Roboto numerals split big-thousands / small-sub-thousands; unranked renders the empty "none" banner.
- **K/D ring** (`KDRing`) in the header from Steam matchmaking kills/deaths.
- **Weapons card** (`WeaponStatsCard`) — per-weapon kills **and accuracy** (`total_hits / total_shots`) from Steam, with weapon icons, sorted by kills.
- **Medals card** (`MedalsCard`) — CS2 service medals, operation coins, and Premier season medals read from the public Steam inventory collectibles.
- **Full Faceit card** (`FaceitCard`) — official FACEIT logo + level icons, Elo, K/D, win/HS/ADR, entry, utility, flash, sniper, clutches, recent W/L, clickable profile name.
- **Match history rank art** — Premier rows show the rating banner **before → Δ → after**; Competitive rows show the rank icon (1–18, `public/rank/*.svg`).
- Backend: friend-code computation, a `steam` profile object, per-weapon accuracy, `medals` from the inventory, and extra Leetify fields (`leetifyRating`, `winrate`, `totalMatches`, `firstMatch`).

### Changed
- **Leetify** is now a full stat card (not a slim panel), with the official "Data provided by Leetify" badge.
- **Premier rank** is shown as the in-game banner instead of a plain orange block.

### Removed
- The **Breakdown** section (you-vs-goal triangle + tier pills + skill gauges) and the **Opening Duels**, **Trades**, and **Grenades & Utility** role blocks (kept **Sides**).

---

## [2.0.0] — 2026-06-08

Complete visual redesign. FRAGGED moves off the dark-navy / purple-cyan "glow" look to a dark **editorial stat-sheet** aesthetic: warm near-black, a single signal-orange accent, Hanken Grotesk + Space Mono typography, hairline-grid structure, and tabular numbers — no gradients, glassmorphism, or glow. Backend, data sources, and the three-tier display logic are unchanged.

### Changed
- **Whole frontend restyled** to an editorial-grid system. Tokens live in `src/index.css` (CSS vars) and `src/theme.js` (JS inline styles); fonts swapped to Hanken Grotesk + Space Mono.
- **Results page rebuilt** into focused section components under `src/components/results/` (`PlayerHeader`, `LeetifyAttribution`, `Performance`, `TriangleGauges`, `Roles`, `WeaponAffinity`, `MatchHistory`, `FaceitPanel`, `FraggedAimCard`) orchestrated by `results/Results.jsx`.
- **Performance** metrics now render as side-by-side cells with a goal-tier tick; the triangle keeps a flat (no-glow) you-vs-goal view with inline tier pills; skill gauges are clean half-arcs.
- **Faceit** slimmed to level + Elo + "View on Faceit", placed beside the Performance section.
- **Match history** gains a **Mode** column (Premier / Competitive); the Premier rank-delta backward-scan is preserved.
- **Loading** screen is now a minimal indeterminate bar; the **landing** leads with an editorial headline + search.
- The jksteamcommunity promo moved from a full-width card into a compact 2-line masthead line.

### Removed
- Premier-by-Season card (the public Leetify endpoint only exposes the ~100 most recent matches, so it was mostly empty).
- The old purple/cyan theme, glassmorphism, glow shadows, drifting orbs / orbiting rings / animated grid, the full-width `RedirectPromo` card, and the unused `fragged.css`.

### Preserved
- Backend response shape, three-tier display, the `statsAvailable` (private Game Details) fallback, Leetify Section-5 metric labels + official attribution badge with live fetch / no caching, and all data sources.

## [1.5.0] — 2026-05-07

A new way to land on FRAGGED: paste any Steam profile URL, swap `steamcommunity.com` for `jksteamcommunity.com`, and you're sent straight to that player's stats page. Adds an animated promo card to the home and results pages that demonstrates the trick, ports the loading screen to the dark navy / purple-cyan theme, and fixes a long-standing green-bleed bug on the body background.

### Added

#### `jksteamcommunity.com` Steam-URL redirect
- New apex domain `jksteamcommunity.com` (apex + `www`) registered through Cloudflare and bound to a dedicated Cloudflare Worker
- New `redirect-worker/` package — minimal Worker that pattern-matches the path of any incoming request and 302-redirects to csstat.com:
  - `/id/<vanity>` → `csstat.com/?q=<vanity>&type=vanity`
  - `/profiles/<steam64>` → `csstat.com/?q=<steam64>&type=id`
  - Tolerant of trailing slashes, profile subpaths (`/id/x/inventory`, `/profiles/x/games`), and case variation in the path prefix
  - Strict on the captured ID — vanity must match `[a-zA-Z0-9_-]{1,64}`, steam64 must be exactly 17 digits; anything else falls through to the catch-all
  - Catch-all (root, `/market/...`, `/groups/...`, etc.) lands on the csstat.com homepage
- Both custom domains pinned in `redirect-worker/wrangler.toml` so the routes don't drift from dashboard state

#### Auto-search via `?q=` deep-linking
- `App.jsx` now reads `?q=<id>&type=<id|vanity>` from `window.location.search` on mount, fires `handleSubmit` with the parsed values, then strips the param via `history.replaceState` so a second search via the StickySearch doesn't carry a stale URL
- When `type` is missing, type is inferred (`/^\d{17}$/.test(q) ? 'id' : 'vanity'`)
- This is the landing surface that makes the redirect domain useful — without it the redirect would just dump users on a homepage with junk in the URL bar

#### `<RedirectPromo>` card on Home and Results
- New `RedirectPromo` component that advertises the redirect trick in a way that matches existing FRAGGED chrome
- Glassmorphism card with a slow purple border-glow pulse, a continuously-glowing pulse on the **`jk`** letters, a blinking caret, and a bouncing purple ↓ arrow underneath
- Mock browser bar with macOS traffic-light dots, lock glyph, and a monospace URL where the `jk` prefix is highlighted in the brand purple
- Card itself is an `<a>` to `https://jksteamcommunity.com/id/yourname` — opens the live redirect in a new tab so users learn the trick by clicking
- Rendered on Hero (between the search form and the feature pills row) and on Results (between the StickySearch and the player header banner)

### Changed

#### Loading screen — dark navy redesign
- Old amber spinner / green overlay / cream text retired
- New screen matches Hero: deep navy background (`#06060c`), three radial accent gradients (purple top, cyan bottom-right, pink bottom-left), drifting blurred glow orbs, and the same masked grid backdrop
- Spinner is now two concentric SVG arcs — purple outer arc spinning forward, cyan inner arc spinning in reverse, with a small purple/cyan gradient core that pulses
- Rotating headline ("Fetching your stats…", "Counting your deaths…", etc.) renders with a white→purple gradient text fill and a soft purple drop-shadow
- Animated three-dot loader and an uppercase `THIS WILL ONLY TAKE A MOMENT` Barlow-Condensed sub

### Fixed

#### Green bleed-through on body background
- `fragged.css` design tokens (`--color-bg-base`, `--color-bg-surface`, `--color-bg-surface-2`, `--color-bg-surface-3`, `--color-bg-overlay`) were still set to the original dark-green palette from pre-v1.4.0
- Hero and Results both painted their own dark navy background but only filled their viewport — any content overflow (now triggered, for example, by the new RedirectPromo card pushing Hero past 100vh on shorter viewports) revealed the green body underneath
- Tokens swapped to the dark navy palette and the `<meta name="theme-color">` updated from `#0d1f17` to `#06060c` so mobile chrome bars also match

### Notes
- The redirect Worker is deployed manually (`npx wrangler deploy` from `redirect-worker/`) — intentionally outside the existing `deploy-worker.yml` GitHub Actions workflow, because the code is ~20 lines, has no secrets, and is unlikely to change once shipped
- Cloudflare provisions and renews the TLS certs for `jksteamcommunity.com` + `www.jksteamcommunity.com` automatically once the custom domains are bound via the Worker dashboard
- The promo card uses `yourname` as the placeholder vanity in the demo URL (not a real account) — a deliberate "this is a placeholder, swap it for your own" cue

---

## [1.4.0] — 2026-05-03

UX overhaul and resilience pass: the home page and verdict section are rebuilt to match the dark navy / purple-cyan language used throughout Results, every results page now has a sticky search bar and a per-season Premier rank breakdown, match history shows the rank itself alongside the delta, and the backend no longer rejects players whose Steam game-detail privacy is set to friends-only.

### Added

#### SEO & social previews
- Real `<title>`, `meta description`, `keywords`, `theme-color`, and canonical link in `index.html`
- Open Graph + Twitter Card tags so Google, Discord, X, etc. show a rich preview
- 1200×630 `og-image.png` (FRAGGED wordmark + tagline + `csstat.com`) shipped in `frontend/public/`
- `WebSite` JSON-LD structured data block

#### Sticky in-results search bar
- New `<StickySearch>` component pinned to the top of the viewport on the Results page
- Compact form: clickable FRAGGED wordmark resets to home, input + submit on the right
- Reuses the same Steam ID / profile URL / vanity URL parser from Hero
- No more scrolling back to the landing page to look up another player

#### Premier by Season card
- New `<PremierSeasons>` component above the Recent Matches card
- Buckets recent Premier matches into Season 1–4 by hardcoded CS2 season date ranges
- Per-season rollup: match count, win rate, most-played map, min → max rank as colored slanted "rank badges" matching the Leetify visual language
- Click a season to expand a per-match list (up to 12, with a "+ N more" footer)
- Always renders all four seasons; seasons with no matches in the recent window appear muted with an explanatory caveat (Leetify's public API only exposes the most recent ~100 matches)

#### Rank badges in match history
- The `RATING ±` column is now `RANK ±` and shows two stacked values: the absolute Premier rank for that match, color-coded by tier, with the rating delta below it

### Changed

#### Home page (Hero)
- Full visual redesign — green theme replaced with the dark navy / purple+cyan look used by Results
- FRAGGED wordmark now uses a white→lavender→purple gradient with neon drop-shadow
- Two orbiting rings with glowing accent dots, drifting purple/cyan blur orbs, and an animated grid backdrop
- "CS2 Stats Tracker · Steam · Leetify · Faceit" pill with shimmer above the wordmark
- Glassmorphism input with magnifier glyph and purple focus glow
- CTA recolored from orange to a purple→cyan gradient with hover lift
- Feature pills row (Premier Rank · Aim & Utility · Match History · Faceit + Leetify) and `csstat.com` credit at the bottom

#### Verdict / Roast section
- Background, divider, card, and buttons all rebuilt to match the dark navy theme — no more green panel
- Verdict card is now a glass card with backdrop blur and a top accent line
- Quote mark switches from amber to purple-tinted; cursor blink uses purple with a glow
- Section title styled like Results section titles (gradient bar + uppercase Barlow Condensed)
- "Share my shame" → purple→cyan gradient; "Try another player" → outlined button matching Results
- Auto-typing roast preserved; only the chrome changed

### Fixed

#### Match history rank delta
- Comp-mode entries reuse the same `rank` field for per-map ranks (1–15), so the previous delta logic could subtract a tiny number like `11` from the player's actual Premier rating and produce nonsense like `+25,315`
- `MatchHistory` now scans backwards through the array for the previous Premier match with `rank > 0` and computes the delta against that, ignoring any interleaved Comp matches

#### Graceful degrade for "game-details private"
- Some players have a fully public profile but their CS2 *Game Details* privacy set to friends-only — the Steam `GetUserStatsForGame` endpoint returns HTTP 400 for them
- Backend used to surface this as `Profile is private. Coward.` (403) and abort the entire response, even when Leetify and Faceit had data
- Backend now exposes `statsAvailable: boolean` in the response and only 403s when the Steam profile *and* both Leetify and Faceit are unreachable
- Frontend gracefully swaps the Steam stat-card row for a yellow notice banner and substitutes the playtime/matches/win-rate header with Faceit + Premier counterparts when Steam-derived numbers aren't available
- `FRAGGED Aim` is suppressed when Steam stats are missing (its inputs would all be zero)

### Notes
- `recent_matches` from Leetify is still capped at the latest ~100 matches by their public API, so the Premier by Season card cannot show data for older seasons that fall outside that window — the card now states this explicitly instead of just hiding the affected seasons

---

## [1.3.0] — 2026-04-28

Three-tier stats display so every searched player gets meaningful data, even without a Leetify account. Adds Faceit integration, a custom FRAGGED Aim score for non-Leetify users, weapon affinity breakdown, and Leetify legal attribution per their developer guidelines.

### Added

#### Faceit integration
- New backend fan-out fetches Faceit player data + lifetime CS2 stats in parallel with Steam and Leetify
- New `<FaceitCard>` shows Level (color-coded by tier), Elo, Region, avg K/D, avg HS%, ADR, win rate, total matches, 1v1 / 1v2 / entry win rates, util damage per round, last-5 W/L pills, and best map (≥10 matches)
- `View on Faceit →` link to player's Faceit profile

#### FRAGGED Aim score
- Custom 0–100 aim rating computed when no Leetify data is available
- **Faceit-backed formula:** weighted blend of Faceit ADR (25%) + Faceit avg K/D (25%) + Faceit avg HS% (20%) + Steam HS% (10%) + Steam accuracy (10%) + Steam K/D (10%)
- **Steam-only formula:** Steam HS% (40%) + accuracy (30%) + K/D (30%)
- Card labels the data source ("Faceit + Steam aggregates" or "Steam aggregates only") and explicitly states it is **not** the same metric as Leetify Aim — clear disclaimer in tooltip
- Color-graded bar (red < 45 < amber < 70 < green)

#### Weapon affinity
- New `<WeaponAffinity>` shows Rifle / Sniper / Pistol / SMG percentages from Steam lifetime weapon kills
- Animated bar chart with per-class color coding
- Shown in tier 2 / tier 3 to fill space the Leetify suite would normally occupy

#### Leetify legal compliance
- "Data Provided by Leetify" attribution + small Leetify glyph linking to leetify.com
- "View on Leetify →" link to the player's Leetify profile (in pink `#F84982` per their style guide)
- Both rendered at the bottom of the Leetify section, only when Leetify data is present
- All Leetify API calls now send the `_leetify_key` header for higher rate limits

### Changed
- Backend response shape now includes `steamId`, `faceit`, `fragged`, and `affinity`
- `safeGet()` now accepts an optional `headers` argument for keyed requests
- Render logic in `Results.jsx` is now tier-based:
  - **Tier 1 (Leetify):** full Leetify suite + attribution
  - **Tier 2 (Faceit, no Leetify):** FRAGGED Aim + Faceit card + Weapon Affinity
  - **Tier 3 (neither):** FRAGGED Aim (Steam-only) + Weapon Affinity + sign-up CTA
- Old empty "Leetify data unavailable" state replaced with the new fallback layers

### Notes
- Per Leetify's developer guidelines, no API responses are cached or persisted; data is fetched live on every request
- FRAGGED Aim is **not** a substitute for Leetify Aim — Leetify's metric uses demo-parsed inputs (preaim, time-to-damage, spray accuracy) that are not available via Steam or Faceit APIs

---

## [1.2.0] — 2026-04-27

Full migration to the Cloudflare stack and a new permanent home at **csstat.com**.

### Added
- Custom domain **csstat.com** (registered through Cloudflare; both apex and `www` resolve)
- Cloudflare Workers backend at `fragged-api.temuuleng23.workers.dev` — replaces the Express+Render setup
- `wrangler.toml` and `src/index.js` Worker entry point in `backend/`

### Changed
- **Backend** rewritten from Express to a Cloudflare Workers `fetch` handler — same routes, same response shape, same Steam + Leetify fan-out, but using the platform's native `fetch` instead of `axios`
- **Frontend hosting** moved from Vercel to Cloudflare Pages (auto-deploys from `main`)
- `STEAM_API_KEY` is now a Cloudflare Worker secret instead of a `.env` file
- Project structure updated — `backend/server.js` removed; entry point is now `backend/src/index.js`
- README + deployment docs updated to reflect the Cloudflare stack

### Removed
- Express, axios, dotenv, cors dependencies from the backend (replaced by native Workers APIs)
- Vercel + Render deploys (services decommissioned)

### Performance
- **No more cold starts** — Workers respond in ~10ms instead of the 30–50s wakeup that Render's free tier imposed after 15 min idle
- Edge-deployed: requests are served from the closest of Cloudflare's 300+ PoPs instead of a single Render region

---

## [1.1.0] — 2026-04-27

A deep stats expansion and a complete visual redesign of the player results page.

### Added

#### Detailed Leetify stats
- **Opening Duels** card — CT vs T side comparison for aggression success rate and duel win rate
- **Trades** card — trade kills success, trade deaths success, kill opportunities per round
- **Grenades & Utility** card — flashbang metrics (thrown, enemies flashed per flash, average duration, teammates flashed, flash→kill %), HE damage (enemies and friendlies), counter-strafing accuracy, utility on death
- Backend exposes 16 new fields from `leetifyData.stats`

#### Performance triangle overhaul
- `TierSelector` dropdown — pick any goal rank from 1K+ to 25K+ to see how you compare
- YOU rendered in pink, GOAL in fixed purple
- Per-vertex hover tooltips reveal the exact stat value at each axis
- Delta row below the chart shows how far above/below each axis is from the goal tier

#### Match history pagination
- Recent matches cap raised from 15 to **99**
- Default view shows 15 matches with a **Load More** button revealing 15 more per click
- Section header shows current `n / total` counter

#### Visual / UX
- Deep navy theme (`#06060c`) with radial purple/cyan glow gradients tinted by player's tier
- Glassmorphism cards with hover lift, glow, and gradient border
- Staggered fade-up entrance animations across all sections
- Premier medal redesigned: tighter, sharper, with shimmer sweep
- Avatar wrapped in a slow-rotating dashed tier-colored ring
- Animated bar fills (`scaleX`) and animated mini-circle arcs (`stroke-dashoffset`)
- Subtle drifting grid background

### Changed
- `RANK_TIERS` aim / utility / positioning numbers updated to match Leetify's current published goal-tier averages
- Performance triangle GOAL color is now fixed purple regardless of tier (previously tier-colored)
- Premier medal style refactored to be more compact and on-brand

### Fixed
- Mini-circle arcs (Headshot %, Time to Damage, Crosshair°) were not rendering — SVG gradient and filter IDs containing spaces or special characters (`%`, `°`) silently failed to resolve in `url(#…)`. IDs are now sanitized via `label.replace(/[^a-zA-Z0-9]/g, '')`.
- Arc draw animation final-state instability resolved by using a literal `stroke-dashoffset: 0` endpoint instead of a CSS variable.

---

## [1.0.0] — 2026-04-25

Initial public release.

### Added
- Premier rank badge with Leetify-style parallelogram stripes and split number formatting
- Performance bars: Aim, Utility, Positioning, Opening Duels, Clutching — each benchmarked against rank tier
- Skill gauges: Headshot %, Time to Damage, Crosshair Placement (270° arc SVG)
- Performance triangle radar chart (player vs rank average)
- Match history table for recent Premier and Competitive games
- CT and T side rating cards
- Flexible search supporting Steam64 ID, profile URL, or custom vanity URL
- Backend with Steam Web API + Leetify public API integration
- Vercel + Render deployment
- `VITE_API_URL` environment variable for production backend URL

---

[2.0.0]: https://github.com/temuulendog/fragged/releases/tag/v2.0.0
[1.5.0]: https://github.com/temuulendog/fragged/releases/tag/v1.5.0
[1.4.0]: https://github.com/temuulendog/fragged/releases/tag/v1.4.0
[1.3.0]: https://github.com/temuulendog/fragged/releases/tag/v1.3.0
[1.2.0]: https://github.com/temuulendog/fragged/releases/tag/v1.2.0
[1.1.0]: https://github.com/temuulendog/fragged/releases/tag/v1.1.0
[1.0.0]: https://github.com/temuulendog/fragged/releases/tag/v1.0.0
