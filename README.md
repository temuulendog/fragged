# FRAGGED — CS2 Stats Viewer

[![Version](https://img.shields.io/badge/version-2.1.0-ff5a1f)](./CHANGELOG.md)
[![Live](https://img.shields.io/badge/live-www.csstat.com-ff5a1f)](https://www.csstat.com)
[![Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Cloudflare-555555)](#stack)

**Live → [www.csstat.com](https://www.csstat.com)**

Look up any CS2 player and get a deep breakdown of how they actually play — pulled live from Steam, Leetify, and Faceit. Three-tier display means **every player gets meaningful data**, even without a Leetify or Faceit account. No login needed.

> **v2.1.0 — boxed dashboard.** A dense, above-the-fold card grid (Steam · Leetify · Faceit · Medals · Weapons), the real CS2 **Premier rating banner** tinted per rank, and rank art in match history. Built on the v2.0.0 editorial system — warm near-black, a single signal-orange accent, Hanken Grotesk + Space Mono, tabular numbers.

---

## Features

### Player header
- Square avatar, player name, and a mono meta line — Steam level · region · matches · win rate · hours
- **Official-MM K/D ring** — green/red gauge from Steam matchmaking kills/deaths
- **CS2 Premier rating banner** — the in-game / csstats-style rank banner, tinted to the player's 5K bracket (common → unusual) with Roboto numerals

### Boxed dashboard
A dense, above-the-fold grid of cards (csstats-style):

- **Steam** — SteamID64, CS2 playtime (total / last 2 weeks), **CS friend code** (computed straight from the steamID64, no API call), vanity, registration date; clickable Steam-profile name
- **Leetify** *(when available)* — Aim · Utility · Positioning · Rating · Opening Duels · Clutching · CT/T Rating · Time to Damage · Preaim · Win Rate · Matches, with the official "Data provided by Leetify" badge
- **Faceit** *(when available)* — Elo + level icon, K/D, Win% · HS% · ADR · Matches · Entry · Util/Rd · Flash · Sniper · 1v1 · 1v2, recent W/L, clickable Faceit-profile name
- **Medals** — CS2 service medals, operation coins, and Premier season medals from the Steam inventory
- **Sides** — CT / T Leetify ratings

### Weapons
- Per-weapon **kills and accuracy** from Steam lifetime stats, with weapon icons, sorted by kills

### Match history
- Up to 99 recent matches; **Map · Mode · Result · Score · TTD · HS% · Rating · Date**
- **Premier** rows show the rating banner **before → Δ → after**; **Competitive** rows show the rank icon (1–18); unranked Premier shows the empty "none" banner
- Load More paginates 15 at a time

### Weapon affinity *(all tiers)*
- Rifle / Pistol / Sniper / SMG split from Steam lifetime weapon kills

### Three-tier coverage
- **Tier 1 — Leetify available:** full Leetify suite above, plus a compact Faceit panel (level + Elo + link) beside Performance
- **Tier 2 — Faceit only:** **FRAGGED Aim** score (custom 0–100, blended from Faceit + Steam aggregates) + Faceit
- **Tier 3 — neither:** FRAGGED Aim (Steam-only) + Weapon Affinity + sign-up CTA

### Resilience
- Players whose CS2 **Game Details** privacy is friends-only (but profile is public) render with a notice and Leetify + Faceit data instead of being rejected
- The header swaps the Steam matches / win-rate row for Faceit + Premier counterparts when Steam stats aren't available

### Search
- Steam64 ID
- Full profile URL (`steamcommunity.com/profiles/...`)
- Custom vanity URL (`steamcommunity.com/id/...`)
- Steam-style shortcut: swap `steamcommunity.com` → `jksteamcommunity.com` to jump straight to a player's stats

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite, deployed on Cloudflare Pages |
| Backend | Cloudflare Workers (`fetch` handler, native `fetch` for outbound) |
| Domain / DNS | Cloudflare Registrar — `csstat.com` |
| Data | Steam Web API + Leetify Public CS API + Faceit Data API |
| Styling | Inline styles driven by shared tokens (`src/theme.js`), Hanken Grotesk + Space Mono |

---

## Deployment

| Service | Host | Trigger |
|---|---|---|
| Frontend | Cloudflare Pages | auto-deploys on push to `main` |
| Backend | Cloudflare Workers | `wrangler deploy` from `backend/` (GitHub Actions on `backend/**`) |

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
├── backend/                    # Cloudflare Worker
│   ├── src/
│   │   └── index.js            # API logic, Steam + Leetify + Faceit fan-out
│   ├── wrangler.toml
│   └── package.json
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css           # global tokens + base + .mono utility
│   │   ├── theme.js            # design tokens (T) + shared helpers
│   │   └── components/
│   │       ├── Hero.jsx        # landing page + search
│   │       ├── Loading.jsx
│   │       ├── Roast.jsx       # verdict + share (AI roast placeholder)
│   │       ├── ui.jsx          # Masthead, SectionLabel, Bar, cells, gauge
│   │       ├── MastheadPromo.jsx
│   │       └── results/        # Results page, split by section
│   │           ├── Results.jsx          # orchestrator
│   │           ├── PlayerHeader.jsx
│   │           ├── LeetifyAttribution.jsx
│   │           ├── Performance.jsx
│   │           ├── TriangleGauges.jsx
│   │           ├── Roles.jsx
│   │           ├── WeaponAffinity.jsx
│   │           ├── MatchHistory.jsx
│   │           ├── FaceitPanel.jsx
│   │           └── FraggedAimCard.jsx
│   ├── index.html
│   └── package.json
├── redirect-worker/            # jksteamcommunity.com → csstat.com redirect Worker
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
