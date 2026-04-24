# FRAGGED

CS2 stats viewer that pulls your data and tells you the truth about your gameplay. Built as a portfolio project.

![dark green UI with player stats, performance bars, and match history](public/preview.png)

## What it does

Paste in your Steam ID, profile link, or custom URL — it fetches your CS2 stats from Steam and Leetify, then displays:

- Premier rank badge
- Performance ratings (Aim, Utility, Positioning, Opening Duels, Clutching) with rank-tier benchmarks
- Key stat gauges — headshot %, time to damage, crosshair placement
- Skill triangle (Aim / Utility / Positioning) vs. your rank tier average
- Recent match history with score, TTD, HS%, accuracy

All Leetify benchmarks are tier-aware — if you're 25K+ you're compared to other 25K+ players, not the global average.

## Stack

- **Frontend** — React + Vite, all inline styles (no CSS framework)
- **Backend** — Node.js + Express
- **APIs** — Steam Web API, Leetify public API (no key needed)

## Running locally

**Backend**

```bash
cd cs2-roaster-backend
cp .env.example .env
# add your Steam API key to .env
npm install
node server.js
```

Get a free Steam API key at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)

**Frontend**

```bash
cd cs2-roaster
npm install
npm run dev
```

Opens at `http://localhost:5173`. The frontend talks to the backend on port 3001.

## Notes

- Steam profile must be set to **public** for stats to load
- Leetify data only available for players registered on [leetify.com](https://leetify.com)
- Supports Steam64 ID, full profile URLs, and custom vanity URLs
