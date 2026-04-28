# Changelog

All notable changes to FRAGGED will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.2.0]: https://github.com/temuulendog/fragged/releases/tag/v1.2.0
[1.1.0]: https://github.com/temuulendog/fragged/releases/tag/v1.1.0
[1.0.0]: https://github.com/temuulendog/fragged/releases/tag/v1.0.0
