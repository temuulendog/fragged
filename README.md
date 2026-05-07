# FRAGGED — CS2 Stats Viewer

[![Version](https://img.shields.io/badge/version-1.5.0-a78bfa)](./CHANGELOG.md)
[![Live](https://img.shields.io/badge/live-www.csstat.com-ec4899)](https://www.csstat.com)
[![Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Cloudflare-22d3ee)](#stack)

**Live → [www.csstat.com](https://www.csstat.com)**

Look up any CS2 player and get a deep breakdown of how they actually play — pulled live from Steam, Leetify, and Faceit. Three-tier display means **every player gets meaningful data**, even without a Leetify or Faceit account. No login needed.

---

## Features

### Stats overview
- **Premier rank badge** — Leetify-style parallelogram badge, color-coded by rank tier
- **Stat tiles** — K/D, headshot %, accuracy, favorite weapon, total kills
- **Performance bars** — Aim, Utility, Positioning, Opening Duels, Clutching — each benchmarked against the player's rank tier
- **Skill gauges** — Headshot %, Time to Damage, Crosshair Placement (animated 270° arcs)

### Performance vs goal *(new in 1.1.0)*
- Pick any goal rank from **1K+** through **25K+** with the tier dropdown
- Performance triangle overlays **YOU** (pink) on top of **GOAL** (purple)
- Hover any vertex for the exact value; deltas shown below the chart

### Detailed Leetify breakdown *(new in 1.1.0)*
- **Opening Duels** — CT vs T side aggression success and duel win rate
- **Trades** — trade kills success, trade deaths success, kill opportunities per round
- **Grenades & Utility** — flashbangs (thrown, enemies/flash, duration, friendly flashes, flash→kill), HE damage (enemies + friendlies), counter-strafing, utility on death

### Match history
- Up to 99 recent Premier + Competitive matches *(was 15 in 1.0.0)*
- Load More button paginates 15 at a time
- **Rank ± column** *(new in 1.4.0)* — per-match Premier rank color-coded by tier, with the rating delta below
- Score, result, TTD, HS%, accuracy, date

### Premier by Season *(new in 1.4.0)*
- Per-season rollup of Premier history: matches, win rate, most-played map, **min → max rank** as colored slanted badges
- Click a season to expand the per-match list (up to 12, with a footer for the rest)
- All four CS2 Premier seasons always render — seasons outside the recent-matches window are shown muted with a caveat *(Leetify's public API only exposes the ~100 most recent matches)*

### Sticky search *(new in 1.4.0)*
- Persistent search bar at the top of the Results view — search a new player without scrolling back to the home page
- Clickable FRAGGED wordmark resets to the landing page

### Three-tier coverage *(new in 1.3.0)*
- **Tier 1 — Leetify available:** full Leetify aim / utility / positioning suite + "Data Provided by Leetify" attribution
- **Tier 2 — Faceit only:** **FRAGGED Aim** score (custom 0–100, blended from Faceit + Steam aggregates) + Faceit card (Elo, Level, KD, ADR, HS%, win rate, 1v1/1v2 clutch, last 5 W/L, best map)
- **Tier 3 — neither:** FRAGGED Aim (Steam-only) + Weapon Affinity + sign-up CTA
- **Weapon Affinity** — Rifle / Sniper / Pistol / SMG breakdown from Steam lifetime weapon kills (shown in tier 2 / 3)

### Resilience *(new in 1.4.0)*
- Players whose CS2 **Game Details** privacy is friends-only (but profile is public) used to be rejected as "private" — they now render with a yellow notice and Leetify + Faceit data instead
- Header swaps the Steam playtime / matches / win-rate row for Faceit + Premier counterparts when Steam stats aren't available

### Search
- Steam64 ID
- Full profile URL (`steamcommunity.com/profiles/...`)
- Custom vanity URL (`steamcommunity.com/id/...`)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite, deployed on Cloudflare Pages |
| Backend | Cloudflare Workers (`fetch` handler, native `fetch` for outbound) |
| Domain / DNS | Cloudflare Registrar — `csstat.com` |
| Data | Steam Web API + Leetify Public CS API + Faceit Data API |
| Styling | Inline styles, custom keyframes |

---

## Deployment

| Service | Host | Trigger |
|---|---|---|
| Frontend | Cloudflare Pages | auto-deploys on push to `main` |
| Backend | Cloudflare Workers | `wrangler deploy` from `backend/` |

Both run on Cloudflare's edge network — no cold starts, sub-second response times globally.

---

## Running locally

**Backend** (Cloudflare Workers via `wrangler dev`)
```bash
cd backend
npm install
echo 'STEAM_API_KEY="your_key_here"' > .dev.vars
# get a free Steam API key at steamcommunity.com/dev/apikey
npx wrangler dev            # runs on http://localhost:8787
```

**Frontend**
```bash
cd frontend
npm install
npm run dev                 # runs on http://localhost:5173
```

For local dev, point the frontend at the local Worker by creating `frontend/.env.local`:
```
VITE_API_URL=http://localhost:8787
```

> Steam profiles must be set to **public**. Leetify data only shows when Leetify has parsed at least one demo for the player and the player's privacy mode allows it. Faceit data only shows for players with a Faceit account.

---

## Environment variables

**Backend** — production secrets stored in Cloudflare:
```bash
npx wrangler secret put STEAM_API_KEY
npx wrangler secret put LEETIFY_API_KEY    # https://leetify.com/app/developer
npx wrangler secret put FACEIT_API_KEY     # https://developers.faceit.com
```

For local dev, put them all in `backend/.dev.vars` (gitignored):
```
STEAM_API_KEY="your_steam_key"
LEETIFY_API_KEY="your_leetify_key"
FACEIT_API_KEY="your_faceit_key"
```

**Frontend** (Cloudflare Pages dashboard → Settings → Variables, or `.env.local`)
```
VITE_API_URL=https://fragged-api.<your-subdomain>.workers.dev
```

---

## Project structure

```
fragged/
├── backend/                # Cloudflare Worker
│   ├── src/
│   │   └── index.js        # API logic, Steam + Leetify fan-out
│   ├── wrangler.toml       # Worker config
│   └── package.json
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Hero.jsx          # Landing page + search
│   │   │   ├── Loading.jsx
│   │   │   ├── Results.jsx       # Stats display (main view)
│   │   │   └── Roast.jsx         # AI roast (placeholder)
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── CHANGELOG.md
└── README.md
```

---

## Roadmap

- **AI roast** — Claude-powered breakdown of stats, actually funny, not generic *(currently a static placeholder)*
- **Mobile** — proper responsive layout (currently desktop-first)
- **Map win rates / weapon breakdowns** — per-map and per-weapon performance
- **Share card** — one-click image export
- **Player vs player** — head-to-head stat overlay
- **Cloudflare rate limiting** — 100 req/min/IP before adding ads, to protect the Worker free tier and Steam API quota

See the [CHANGELOG](./CHANGELOG.md) for what's already shipped.

---

## Versioning

Releases follow [Semantic Versioning](https://semver.org). Changes are tracked in [CHANGELOG.md](./CHANGELOG.md) using the [Keep a Changelog](https://keepachangelog.com) format. Each release is also published on [GitHub Releases](https://github.com/temuulendog/fragged/releases).

---

Built by [temuulendog](https://github.com/temuulendog)
