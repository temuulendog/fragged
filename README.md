# FRAGGED — CS2 Stats Viewer `v1.0.0`

Look up any CS2 player and get a breakdown of how they actually play. Pulls live data from Steam and Leetify, no account needed.

---

## Features

- **Premier rank badge** — styled after the in-game rating display
- **Performance bars** — Aim, Utility, Positioning, Opening Duels, Clutching — each benchmarked against your rank tier (25K+ is compared to 25K+ players, not everyone)
- **Skill gauges** — Headshot %, Time to Damage, Crosshair Placement
- **Performance triangle** — visual breakdown of your three core skill axes vs. your rank average
- **Match history** — recent Premier and Competitive games with score, result, TTD, HS%, accuracy
- **Flexible search** — accepts Steam64 ID, full profile URL (`/profiles/...`), or custom vanity URL (`/id/...`)

## Stack

- **Frontend** — React + Vite
- **Backend** — Node.js + Express
- **Data** — Steam Web API + Leetify public API

## Running locally

**Backend**
```bash
cd backend
cp .env.example .env
# fill in your Steam API key (free at steamcommunity.com/dev/apikey)
npm install
node server.js
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Runs on `localhost:5173`, talks to the backend on port `3001`.

> Steam profile must be set to **public**. Leetify data only shows up for players registered on [leetify.com](https://leetify.com).

---

## Roadmap

This is v1.0.0 — works well, but there's more planned:

- **Leetify fallback** — for players not on Leetify, pull from alternative sources so the performance section still shows something useful
- **AI roast** — Claude-powered breakdown of your stats, actually funny, not generic
- **Mobile** — currently desktop-first, proper responsive layout coming
- **More match data** — kill stats per match, map win rates, weapon breakdowns
- **Share card** — one-click image export of your stats to post or send

---

Built by [temuulendog](https://github.com/temuulendog)
