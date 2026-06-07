# FRAGGED — Editorial-Grid UI Redesign

**Date:** 2026-06-08
**Branch:** `redesign/editorial-grid`
**Status:** Design approved (visual mockups), spec under review
**Approved mockup:** `.superpowers/brainstorm/82442-1780853191/content/full-results-v3.html` (+ `synthesis-ac.html` for the landing)

---

## 1. Why

Usage cooled off and real users say the site "looks obviously AI-made." They're right: the current build (v1.5.0) leans on the exact stack that reads as default-model output — dark **navy** `#06060c`, **purple→cyan gradients**, **glassmorphism** (backdrop-blur cards), **glowing orbs**, orbiting rings, animated grid, shimmer pills, and colored glow box-shadows on everything.

**Goal:** Replace the entire visual layer with a distinctive, human-looking **editorial sports-stats** aesthetic that is modern (not futuristic), fully dark (gamers play at night — no flashbang-white), and visually unlike every other CS2 stats site (Leetify, csstats.gg, tracker.gg, scope.gg are all near-identical dark card dashboards).

**Non-goal:** Any backend / data / functionality change. The Cloudflare Worker, its response shape, the three-tier logic, all data sources, and Leetify compliance behavior stay exactly as they are.

---

## 2. Direction (locked)

**Editorial dark-grid** — a "stat sheet designed by a person":

- **Dark, warm near-black** base (NOT navy).
- **Hairline grid** structure — thin 1px rules divide everything; sharp corners; no cards-with-glow.
- **One signal accent** (signal orange) used only for: the rank block, key highlights, active states, links. No rainbow.
- **Strong type system**: a modern grotesk (Hanken Grotesk) for everything visible + a monospace (Space Mono) for all small labels/meta/nav. Tabular figures on all numbers (it's a stat sheet).
- **Energy** comes from a bold solid-orange rank block and confident typography — not from glow.
- **Zero**: gradients, glassmorphism/backdrop-blur, glow box-shadows, drifting orbs, orbiting rings, animated grid, shimmer.

---

## 3. Design tokens

### Color
| Token | Value | Use |
|---|---|---|
| `--bg` | `#100f0c` | page background (warm near-black) |
| `--surf` | `#16140f` | subtle raised strips (attribution bar, verdict, etc.) |
| `--fg` | `#f0eee9` | primary text / numbers |
| `--mut` | `rgba(240,238,233,.55)` | labels, secondary text |
| `--dim` | `rgba(240,238,233,.32)` | meta, footnotes |
| `--line` | `rgba(240,238,233,.12)` | primary hairline rules |
| `--line2` | `rgba(240,238,233,.07)` | inner table-row rules |
| `--acc` | `#ff5a1f` | signal orange — accent |
| `--ink` | `#100f0c` | text on orange |
| `--win` | `#5fa56a` | win result / positive rank delta |
| `--loss` | `#c2483b` | loss result / negative rank delta |

Color discipline: **orange = brand accent**, **green/red = win/loss + rank deltas only**. The Premier rank block is solid orange (we drop the old per-tier rainbow coloring of the rank — tier rainbow is no longer used anywhere now that Premier Seasons is removed).

### Type
- **Display / body / numbers:** `Hanken Grotesk` (weights 400–900). Headlines/wordmark at 800–900; values at 700; tabular-nums everywhere numeric.
- **Labels / meta / nav / mode tags:** `Space Mono` (400/700), uppercase, letter-spacing ~`.12em`.
- **Removed fonts:** Barlow Condensed, Inter. (And the cream/serif "almanac" idea was explicitly rejected — no serif.)

### Shape & motion
- Border radius: 0–5px max (sharp/editorial).
- Borders: 1px hairlines using `--line` / `--line2`.
- Motion: restrained only — short fade/translate-in on mount, bar-width transitions, simple hover (e.g., row/cell background tint or border brighten). **No** lift+glow hovers, no pulsing, no spinning rings.

---

## 4. Layout — page by page

### 4.1 Landing (Hero.jsx)
Reference: `synthesis-ac.html` (landing block), updated with the masthead promo.

- **Masthead** (top, hairline-bottom): `FRAGGED` wordmark (the `A` accented orange) on the left; mono tagline on the right — keep it honest, only reference features that exist (e.g., `CS2 STAT SHEET` or `STEAM · LEETIFY · FACEIT`). Do **not** advertise Compare (roadmap, not built).
- **Headline**: big Hanken 900 uppercase, e.g. `Paste your steam id. / See the damage.` (the word "damage" in orange).
- **Search**: single bordered row — text input (mono placeholder: `steamcommunity.com/id/… or 17-digit id`) + solid-orange **ROAST ME** button. Parsing logic unchanged from current `parseInput`.
- **jksteamcommunity promo**: compact **2-line** mono text near the search (NOT the old big card). Line 1: `jksteamcommunity.com/id/yourname` (with `jk` in orange); line 2: `a steam-style link that jumps straight to these stats`. Links to `https://jksteamcommunity.com/id/yourname`. Placeholder vanity is **`yourname`** (never the user's personal vanity, per project rule).
- **Footnote**: `Profile must be public`.
- Optional vertical mono accent label (`CS2 · STEAM · LEETIFY · FACEIT`) for flavor.
- Error state: inline red (`--loss`) message under the search.

### 4.2 Loading (Loading.jsx)
Retire the navy/orb/dual-arc spinner entirely. New: dark `--bg` screen with the `FRAGGED` masthead and a **minimal editorial loader** — a thin horizontal indeterminate bar (orange) and a mono status line. The rotating headlines ("Counting your deaths…", etc.) may stay, rendered in Hanken (no gradient text fill, no glow).

### 4.3 Results (Results.jsx) — the core
Reference: `full-results-v3.html`. Top to bottom:

1. **Sticky masthead** — `FRAGGED` (resets to home / `onReset`) · the 2-line jksteamcommunity promo (center) · compact search (`paste new steam id…` + Go), wired to `onSearch`/`handleSubmit`. This replaces the current `<StickySearch>`.
2. **Player header** — square avatar (hairline border), name (Hanken 800, large), mono meta line (`Steam Lvl · region · matches · win% · hours`), and a solid-**orange rank block** on the right (Premier rating + `PREMIER` label).
3. **Leetify attribution bar** — `--surf` strip with the **official `leetify-badge.png`** (image, wrapped in a link to `https://leetify.com/`) + "Data provided by Leetify" + `View on Leetify →` link to `https://leetify.com/app/profile/{steam64}`. (Compliance — see §6.)
4. **Performance** — section label + 5 **side-by-side cells**: each cell = mono metric label, big value, a thin bar underneath with an **orange "goal" tick** marking the selected tier benchmark. Metrics: Aim, Utility, Positioning, Opening Duels, Clutching. To the **right** of the 5 cells: a compact **Faceit panel** (level box, Elo, `View on Faceit →`).
5. **You-vs-goal triangle + skill gauges** — left: clean SVG triangle (YOU = orange fill+stroke, GOAL = dashed outline, no glow) with a mono **tier selector** (10K/15K/20K/25K). Right: three clean **half-arc gauges** — Headshot Accuracy, Time to Damage, Crosshair Placement.
6. **Sides & Roles** — grid row: CT Rating, T Rating, Opening Win %, Trade Kill %, Util Dmg / Rnd.
7. **Weapon Affinity** — horizontal bars: Rifle / Pistol / Sniper / SMG with %.
8. **Match History** — dense editorial **table**: Map · **Mode** (Premier = orange tag, Competitive = muted tag) · Result (WIN/LOSS, green/red) · Score · K — D · HS% · **Rank ±** (rating + green/red delta for Premier; `—` for Competitive) · Date. "Load more matches" footer row (existing pagination behavior).
9. **Verdict** — `--surf` strip: mono `Verdict —` + a sharp one-liner roast (orange highlight on the key phrase). Keeps FRAGGED's voice.
10. **Footer** — mono `csstat.com` · `Steam · Leetify · Faceit`.

### 4.4 Roast (Roast.jsx)
Restyle the existing roast/verdict page to the same system (dark, Hanken + mono, orange accent, hairline frame). Drops the old green/glass treatment. Still a placeholder until the AI roast is wired (out of scope here).

---

## 5. Removed / changed components

- **Premier Seasons** (`<PremierSeasons>`) — **removed**. The public Leetify endpoint caps `recent_matches` at ~100 and the internal endpoint is off-limits (Leetify declined extended access), so the seasons card was mostly empty. Deleting it is the honest call.
- **`<RankBadge>`** — likely removable (was used by Premier Seasons and the old match RANK column; new match table shows a plain rating + delta). Remove if no remaining consumers.
- **`<RedirectPromo>`** big card — replaced by the 2-line masthead promo. Repurpose or delete the component; keep the live link to jksteamcommunity.com.
- **`fragged.css`** — replace the amber/green token set + glow shadows with the §3 tokens; strip glassmorphism/grain/glow utilities that go unused.
- **`index.html`** — swap font `@import` to Hanken Grotesk + Space Mono; update `<meta name="theme-color">` to `#100f0c`. (OG image regeneration is optional/out of scope.)

### Suggested file decomposition (improvement)
`Results.jsx` is ~1,751 lines and does everything. Since we're rewriting the visual layer anyway, split the rebuilt sections into focused components under `frontend/src/components/results/` (e.g., `Masthead`, `PlayerHeader`, `LeetifyAttribution`, `Performance`, `TriangleAndGauges`, `SidesRoles`, `WeaponAffinity`, `MatchHistory`, `Verdict`). Keeps each unit understandable and testable. This is a refactor-in-place, not a behavior change.

---

## 6. Must-preserve (data, logic, compliance)

These are **unchanged** and the redesign must respect them exactly:

- **Backend response shape** and all field scaling rules (Leetify aim/utility/positioning are 0–100; opening/clutch/ct/t are ×100 for display, signed, 2 decimals).
- **Three-tier display**: Tier 1 (Leetify) full suite; Tier 2 (Faceit only) → FRAGGED Aim card + Faceit; Tier 3 (neither) → FRAGGED Aim (steam-only) + sign-up CTA. The redesign keeps all three; the FRAGGED Aim card gets the new styling and shows in place of the Leetify Performance/triangle/gauges when there's no Leetify rating.
- **`statsAvailable === false`** path (public profile, friends-only Game Details): swap the Steam stat cells for a notice, use Faceit/Premier for header counters, suppress FRAGGED Aim. Keep this behavior, restyled.
- **Leetify Section-5 compliance:** metric labels must remain **Leetify's exact app labels** — `AIM`, `UTILITY`, `POSITIONING`, `OPENING DUELS`, `CLUTCHING`, `CT RATING`, `T RATING`, `HEADSHOT ACCURACY`, `TIME TO DAMAGE`, `CROSSHAIR PLACEMENT`. (The mockups abbreviated some labels for space — the final build must use the full labels.) Use the **official `leetify-badge.png`** image (not a text badge — the mockup's pink "LEETIFY" chip is a placeholder), keep the badge→leetify.com link and the "View on Leetify" attribution link, and keep **live fetch / no caching**.
- **Match-history rank-delta logic** (scan back for previous Premier match with `rank > 0`) and match filtering (`rank_type === 11 || 12`).

---

## 7. Revert path

All work lands on branch `redesign/editorial-grid`. `main` is untouched, so:
- Reverting = don't merge (or `git checkout main`). Production keeps running v1.5.0.
- We can preview the branch via a Cloudflare Pages preview deployment before merging to `main` (which is what auto-deploys to csstat.com).

---

## 8. Git rules for this repo (reminder)
- Author: `temuulendog` / `temuuleng23@gmail.com`.
- **No `Co-Authored-By` trailers** (solo portfolio project).

---

## 9. Open items to confirm before/with implementation
1. **Accent orange** `#ff5a1f` — locked unless you want it deeper/redder (more molotov).
2. **Loading screen** — minimal bar + mono status (keep the rotating roast headlines?) — confirm during build.
3. **Competitive `Rank ±` cell** — show `—` (current spec) or the per-map rank 1–15? (Leaning `—` since comp has no rating.)
4. **Roast page** scope — restyle only (no AI wiring) this round.
