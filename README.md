# FRAGGED — CS2 Stats Viewer `v1.0.0`

**Live → [fragged.vercel.app](https://fragged.vercel.app)**

Look up any CS2 player and get a breakdown of how they actually play. Pulls live data from Steam and Leetify, no account needed.

---

## Features

- **Premier rank badge** — styled after the in-game rating display
- **Performance bars** — Aim, Utility, Positioning, Opening Duels, Clutching — each benchmarked against your rank tier (25K+ is compared to 25K+ players, not everyone)
- **Skill gauges** — Headshot %, Time to Damage, Crosshair Placement
- **Performance triangle** — visual breakdown of your three core skill axes vs. your rank average
- **Match history** — recent Premier and Competitive games with score, result, TTD, HS%, accuracy
- **Flexible search** — accepts Steam64 ID, full profile URL (`/profiles/...`), or custom vanity URL (`/id/...`)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, deployed on Vercel |
| Backend | Node.js + Express, deployed on Render |
| Data | Steam Web API + Leetify public API (free, no key needed) |

---

## Deployment

The app is split into two services:

- **Frontend** → [Vercel](https://vercel.com) — auto-deploys on every push to `main`
- **Backend** → [Render](https://render.com) — free Node.js hosting, also auto-deploys on push

Any code pushed to GitHub triggers a redeploy on both automatically.

---

## Running locally

**Backend**
```bash
cd backend
cp .env.example .env
# add your Steam API key — get one free at steamcommunity.com/dev/apikey
npm install
node server.js
# runs on localhost:3001
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# runs on localhost:5173
```

The frontend reads `VITE_API_URL` for the backend address. Locally it falls back to `localhost:3001` automatically, no extra config needed.

> Steam profile must be set to **public**. Leetify data only shows for players registered on [leetify.com](https://leetify.com).

---

## Environment Variables

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

## Roadmap

This is v1.0.0 — works well, more planned:

- **Leetify fallback** — for players not on Leetify, pull from alternative sources so the performance section still shows something useful
- **AI roast** — Claude-powered breakdown of your stats, actually funny, not generic
- **Mobile** — currently desktop-first, proper responsive layout coming
- **More match data** — kill stats per match, map win rates, weapon breakdowns
- **Share card** — one-click image export of your stats to post or send

---

Built by [temuulendog](https://github.com/temuulendog)
