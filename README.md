# FRAGGED — CS2 Stats Viewer

[![Version](https://img.shields.io/badge/version-1.1.0-a78bfa)](./CHANGELOG.md)
[![Live](https://img.shields.io/badge/live-fragged.vercel.app-ec4899)](https://fragged.vercel.app)
[![Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Express-22d3ee)](#stack)

**Live → [fragged.vercel.app](https://fragged.vercel.app)**

Look up any CS2 player and get a deep breakdown of how they actually play — pulled live from Steam and Leetify. No account needed.

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
- Score, result, rating change, TTD, HS%, accuracy, date

### Search
- Steam64 ID
- Full profile URL (`steamcommunity.com/profiles/...`)
- Custom vanity URL (`steamcommunity.com/id/...`)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite, deployed on Vercel |
| Backend | Node.js + Express, deployed on Render |
| Data | Steam Web API + Leetify public API |
| Styling | Inline styles, custom keyframes |

---

## Deployment

| Service | Host | Trigger |
|---|---|---|
| Frontend | Vercel | auto-deploys on push to `main` |
| Backend | Render (free tier) | auto-deploys on push to `main` |

Render's free tier sleeps the backend after 15 min of inactivity — first request after that takes ~30–50 s to wake up.

---

## Running locally

**Backend**
```bash
cd backend
cp .env.example .env
# add your Steam API key — get one free at steamcommunity.com/dev/apikey
npm install
node server.js              # runs on http://localhost:3001
```

**Frontend**
```bash
cd frontend
npm install
npm run dev                 # runs on http://localhost:5173
```

The frontend reads `VITE_API_URL` for the backend address; locally it falls back to `localhost:3001` automatically.

> Steam profiles must be set to **public**. Leetify data only shows for players registered on [leetify.com](https://leetify.com).

---

## Environment variables

**Backend** (`.env`)
```
STEAM_API_KEY=your_key_here
PORT=3001
```

**Frontend** (Vercel dashboard or `.env.local`)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Project structure

```
fragged/
├── backend/                # Node.js + Express
│   ├── server.js           # API logic, Steam + Leetify fan-out
│   ├── .env.example
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

- **Leetify fallback** — for players not on Leetify, pull from alternative sources
- **AI roast** — Claude-powered breakdown of stats, actually funny, not generic
- **Mobile** — proper responsive layout (currently desktop-first)
- **Map win rates / weapon breakdowns** — per-map and per-weapon performance
- **Share card** — one-click image export
- **Player vs player** — head-to-head stat overlay

See the [CHANGELOG](./CHANGELOG.md) for what's already shipped.

---

## Versioning

Releases follow [Semantic Versioning](https://semver.org). Changes are tracked in [CHANGELOG.md](./CHANGELOG.md) using the [Keep a Changelog](https://keepachangelog.com) format. Each release is also published on [GitHub Releases](https://github.com/temuulendog/fragged/releases).

---

Built by [temuulendog](https://github.com/temuulendog)
