# Changelog

All notable changes to FRAGGED will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.0]: https://github.com/temuulendog/fragged/releases/tag/v1.1.0
[1.0.0]: https://github.com/temuulendog/fragged/releases/tag/v1.0.0
