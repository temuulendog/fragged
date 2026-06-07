# FRAGGED Editorial-Grid Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace FRAGGED's entire frontend visual layer with the approved dark "editorial-grid" aesthetic (no glow/glass/gradients) without changing any backend, data wiring, or three-tier logic.

**Architecture:** Centralize design tokens in one `theme.js` module + a slim global `fragged.css`. Build a small set of reusable UI primitives (masthead, section label, hairline bar, metric cell, stat grid). Decompose the 1,752-line `Results.jsx` into focused section components under `components/results/`, each consuming the existing `player` data shape. Hero, Loading, Roast, and the redirect promo are rewritten against the same tokens.

**Tech Stack:** React 18 + Vite, inline-style objects driven by a shared `T` token object (matches the existing idiom), Google Fonts (Hanken Grotesk + Space Mono). No new dependencies.

**Visual source of truth:** the approved mockups on disk:
- `.superpowers/brainstorm/82442-1780853191/content/full-results-v3.html` (Results — every section, exact CSS)
- `.superpowers/brainstorm/82442-1780853191/content/synthesis-ac.html` (Landing)

**Branch:** `redesign/editorial-grid` (already created; `main` untouched = revert path).

**Repo git rules:** author `temuulendog <temuuleng23@gmail.com>`, **no `Co-Authored-By` trailers**.

---

## Design tokens (single source — used verbatim in Task 1)

```
bg      #100f0c   surf    #16140f
fg      #f0eee9   mut     rgba(240,238,233,.55)   dim rgba(240,238,233,.32)
line    rgba(240,238,233,.12)   line2 rgba(240,238,233,.07)
acc     #ff5a1f   ink #100f0c
win     #5fa56a   loss #c2483b
font display/body/number: 'Hanken Grotesk'
font mono/label:          'Space Mono'
```

Rules everywhere: tabular-nums on numbers; labels in Space Mono uppercase ~`.12em`; 1px hairlines; radius 0–5px; **no** backdrop-blur, **no** colored box-shadow glows, **no** gradients (one allowed exception: the avatar placeholder block), **no** drifting/orbiting/grid-shift animations. Leetify metric labels stay verbatim (`AIM`, `UTILITY`, `POSITIONING`, `OPENING DUELS`, `CLUTCHING`, `CT RATING`, `T RATING`, `HEADSHOT ACCURACY`, `TIME TO DAMAGE`, `CROSSHAIR PLACEMENT`).

---

## File structure

```
frontend/
  index.html                         # MODIFY: font <link>, theme-color
  src/
    theme.js                         # CREATE: T tokens, fonts, keyframes, helpers (getRankTier, RANK_TIERS, premierColor, parseSearchInput, fmt helpers)
    fragged.css                      # MODIFY: replace tokens + base + primitives, strip glow/glass utilities
    main.jsx                         # (unchanged)
    App.jsx                          # (unchanged — props already wired: onSearch, onReset, ?q deep-link)
    components/
      Hero.jsx                       # REWRITE
      Loading.jsx                    # REWRITE
      Roast.jsx                      # REWRITE (restyle)
      MastheadPromo.jsx              # CREATE (replaces RedirectPromo big card; 2-line)
      RedirectPromo.jsx              # DELETE (after refs removed)
      ui.jsx                         # CREATE: Masthead, SectionLabel, Bar, MetricCell, Cell, MiniArc
      results/
        Results.jsx                  # REWRITE orchestrator (moves out of components/Results.jsx)
        PlayerHeader.jsx             # CREATE
        LeetifyAttribution.jsx       # CREATE
        Performance.jsx              # CREATE (5 metric cells + Faceit panel on right)
        TriangleGauges.jsx           # CREATE (triangle + tier pills + 3 MiniArc gauges)
        Roles.jsx                    # CREATE (CT/T ratings + Opening Duels + Trades + Grenades & Utility, restyled)
        WeaponAffinity.jsx           # CREATE
        MatchHistory.jsx             # CREATE (adds Mode column)
        Verdict.jsx                  # CREATE
        FraggedAimCard.jsx           # CREATE (tier 2/3)
        FaceitPanel.jsx              # CREATE (slim: level + elo + link)
```

> `components/Results.jsx` import in `App.jsx` becomes `./components/results/Results`. **Removed:** `PremierSeasons`, `RankBadge`, `PremierMedal` (replaced by orange rank block), `StatCard` glow variant, `StickySearch` (folded into `Masthead`).

---

## Task 1: Shared theme module

**Files:** Create `frontend/src/theme.js`

- [ ] **Step 1: Create the token + helper module**

```jsx
// frontend/src/theme.js
export const T = {
  bg: '#100f0c', surf: '#16140f',
  fg: '#f0eee9', mut: 'rgba(240,238,233,.55)', dim: 'rgba(240,238,233,.32)',
  line: 'rgba(240,238,233,.12)', line2: 'rgba(240,238,233,.07)',
  acc: '#ff5a1f', ink: '#100f0c',
  win: '#5fa56a', loss: '#c2483b',
  display: "'Hanken Grotesk', sans-serif",
  mono: "'Space Mono', monospace",
};

// Premier tier benchmarks (data — unchanged values, recolored neutral since rainbow is retired)
export const RANK_TIERS = [
  { min: 25000, label: '25K+', aim: 82, utility: 62, positioning: 57, opening: 0.77,  clutch: 10.93 },
  { min: 20000, label: '20K+', aim: 74, utility: 61, positioning: 55, opening: 0.45,  clutch: 11.50 },
  { min: 15000, label: '15K+', aim: 66, utility: 58, positioning: 53, opening: 0.20,  clutch: 10.80 },
  { min: 10000, label: '10K+', aim: 58, utility: 55, positioning: 51, opening: -0.50, clutch:  9.50 },
  { min:  5000, label:  '5K+', aim: 48, utility: 51, positioning: 50, opening: -1.50, clutch:  8.00 },
  { min:     1, label:  '1K+', aim: 31, utility: 46, positioning: 46, opening: -3.00, clutch:  6.50 },
];

export function getRankTier(premier) {
  if (!premier) return RANK_TIERS[RANK_TIERS.length - 1];
  return RANK_TIERS.find(t => premier >= t.min) || RANK_TIERS[RANK_TIERS.length - 1];
}

export function parseSearchInput(raw) {
  const s = raw.trim();
  const profileMatch = s.match(/steamcommunity\.com\/profiles\/(\d{17})/);
  if (profileMatch) return { id: profileMatch[1], type: 'id' };
  const vanityMatch = s.match(/steamcommunity\.com\/id\/([^/\s?]+)/);
  if (vanityMatch) return { id: vanityMatch[1], type: 'vanity' };
  if (/^\d{17}$/.test(s)) return { id: s, type: 'id' };
  if (s.length > 0) return { id: s, type: 'vanity' };
  return null;
}

// Minimal motion — fade/slide up + bar grow. No glow/spin/grid/float.
export const KEYFRAMES = `
@keyframes fr-fadeUp { from { opacity:0; transform:translateY(14px);} to {opacity:1; transform:translateY(0);} }
@keyframes fr-growBar { from { transform:scaleX(0);} to { transform:scaleX(1);} }
.fr-sec { animation: fr-fadeUp 500ms cubic-bezier(0.16,1,0.3,1) both; }
.fr-bar > i { transform-origin:left center; animation: fr-growBar 800ms cubic-bezier(0.16,1,0.3,1) 120ms both; }
.fr-rowh { transition: background-color 140ms ease; }
.fr-rowh:hover { background-color: rgba(240,238,233,.04); }
`;
```

- [ ] **Step 2: Verify it imports** — `cd frontend && node -e "import('./src/theme.js').then(m=>console.log(Object.keys(m)))"` is not valid for JSX-free `.js`; instead rely on the build in later tasks. Skip standalone run.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/theme.js
git -c user.name="temuulendog" -c user.email="temuuleng23@gmail.com" commit -m "feat(redesign): shared editorial theme tokens + helpers"
```

---

## Task 2: Fonts + theme-color in index.html

**Files:** Modify `frontend/index.html`

- [ ] **Step 1:** Replace the Barlow+Inter Google Fonts `<link>`/`<style>@import` with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2:** Change `<meta name="theme-color" content="#06060c" />` → `content="#100f0c"`.

- [ ] **Step 3: Commit**

```bash
git add frontend/index.html
git -c user.name="temuulendog" -c user.email="temuuleng23@gmail.com" commit -m "feat(redesign): swap fonts to Hanken Grotesk + Space Mono"
```

---

## Task 3: Global CSS rewrite

**Files:** Modify `frontend/src/fragged.css` (the existing `@import` line at top may be removed since fonts now load via index.html)

- [ ] **Step 1:** Replace the entire file with token-driven base + primitives:

```css
:root {
  --bg:#100f0c; --surf:#16140f; --fg:#f0eee9;
  --mut:rgba(240,238,233,.55); --dim:rgba(240,238,233,.32);
  --line:rgba(240,238,233,.12); --line2:rgba(240,238,233,.07);
  --acc:#ff5a1f; --ink:#100f0c; --win:#5fa56a; --loss:#c2483b;
  --display:'Hanken Grotesk', sans-serif; --mono:'Space Mono', monospace;
}
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
html { -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
body { background:var(--bg); color:var(--fg); font-family:var(--display); font-size:15px; line-height:1.5; }
::selection { background:var(--acc); color:var(--ink); }
/* slim scrollbar */
*::-webkit-scrollbar { width:10px; height:10px; }
*::-webkit-scrollbar-thumb { background:rgba(240,238,233,.14); }
*::-webkit-scrollbar-track { background:transparent; }
a { color:var(--acc); }
.mono { font-family:var(--mono); letter-spacing:.12em; text-transform:uppercase; }
```

(Delete the old `.grain-overlay`, `.card` glow hover, `.btn-*` amber, `.input-pill`, `.divider-amber`, and all amber/green tokens.)

- [ ] **Step 2: Commit**

```bash
git add frontend/src/fragged.css
git -c user.name="temuulendog" -c user.email="temuuleng23@gmail.com" commit -m "feat(redesign): token-driven global CSS, strip glow/glass utilities"
```

---

## Task 4: Shared UI primitives

**Files:** Create `frontend/src/components/ui.jsx`

These are reused by every page. Port exact look from `full-results-v3.html`.

- [ ] **Step 1: Create primitives**

```jsx
// frontend/src/components/ui.jsx
import { T } from '../theme';
import MastheadPromo from './MastheadPromo';

export function Masthead({ onReset, search }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:18,
      padding:'13px 22px', borderBottom:`1px solid ${T.line}`, position:'sticky', top:0, background:T.bg, zIndex:50 }}>
      <button onClick={onReset} aria-label="Home" style={{ background:'none', border:'none', cursor:'pointer',
        fontFamily:T.display, fontWeight:900, letterSpacing:'.16em', textTransform:'uppercase', fontSize:18, color:T.fg, flex:'none' }}>
        FR<span style={{ color:T.acc }}>A</span>GGED
      </button>
      <MastheadPromo />
      {search /* a <SearchBox/> or null */}
    </div>
  );
}

export function SectionLabel({ children, hint }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'20px 22px 10px' }}>
      <h4 style={{ fontFamily:T.mono, fontSize:11, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:T.fg }}>{children}</h4>
      <div style={{ flex:1, height:1, background:T.line }} />
      {hint && <div style={{ fontSize:9, color:T.dim, fontFamily:T.mono, letterSpacing:'.1em', textTransform:'uppercase' }}>{hint}</div>}
    </div>
  );
}

// Hairline bar with optional orange goal tick. valuePct/tickPct are 0..100.
export function Bar({ valuePct, tickPct }) {
  return (
    <div className="fr-bar" style={{ height:3, background:T.line, marginTop:10, position:'relative' }}>
      <i style={{ display:'block', height:'100%', width:`${Math.min(100,Math.max(0,valuePct))}%`, background:T.fg }} />
      {tickPct != null && <u style={{ position:'absolute', top:-2, left:`${Math.min(100,Math.max(0,tickPct))}%`, width:1, height:7, background:T.acc }} />}
    </div>
  );
}

// One performance cell: label, value, optional bar.
export function MetricCell({ label, value, accent, valuePct, tickPct, sub }) {
  return (
    <div style={{ padding:'15px 14px', borderRight:`1px solid ${T.line}` }}>
      <div className="mono" style={{ fontSize:9, color:T.mut, marginBottom:9 }}>{label}</div>
      <div style={{ fontFamily:T.display, fontWeight:700, fontSize:25, fontVariantNumeric:'tabular-nums', color:accent ? T.acc : T.fg }}>{value}</div>
      {valuePct != null ? <Bar valuePct={valuePct} tickPct={tickPct} /> : sub ? <div className="mono" style={{ fontSize:9, color:T.dim, marginTop:8 }}>{sub}</div> : null}
    </div>
  );
}

// Generic stat cell (no bar) for grids.
export function Cell({ label, value, accent }) {
  return (
    <div style={{ padding:'15px 18px', borderTop:`1px solid ${T.line}`, borderRight:`1px solid ${T.line}` }}>
      <div className="mono" style={{ fontSize:9, color:T.mut, marginBottom:9 }}>{label}</div>
      <div style={{ fontFamily:T.display, fontWeight:700, fontSize:19, fontVariantNumeric:'tabular-nums', color:accent ? T.acc : T.fg }}>{value}</div>
    </div>
  );
}

// Clean half-arc gauge (no glow). fill 0..100.
export function MiniArc({ label, value, fill, accent }) {
  const len = 107; const dash = Math.min(len, Math.max(0, (fill/100)*len));
  return (
    <div style={{ padding:18, borderRight:`1px solid ${T.line}`, textAlign:'center' }}>
      <svg viewBox="0 0 80 48" width="86">
        <path d="M6,44 A34 34 0 0 1 74 44" fill="none" stroke={T.line} strokeWidth="4" />
        <path d="M6,44 A34 34 0 0 1 74 44" fill="none" stroke={accent ? T.acc : T.fg} strokeWidth="4" strokeDasharray={`${dash} ${len}`} />
      </svg>
      <div style={{ fontFamily:T.display, fontWeight:800, fontSize:24, marginTop:6, fontVariantNumeric:'tabular-nums' }}>{value}</div>
      <div className="mono" style={{ fontSize:8, color:T.mut, marginTop:6 }}>{label}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ui.jsx
git -c user.name="temuulendog" -c user.email="temuuleng23@gmail.com" commit -m "feat(redesign): shared UI primitives (masthead, bar, cells, gauge)"
```

---

## Task 5: MastheadPromo (replaces RedirectPromo card)

**Files:** Create `frontend/src/components/MastheadPromo.jsx`

- [ ] **Step 1: Create the 2-line promo**

```jsx
// frontend/src/components/MastheadPromo.jsx
import { T } from '../theme';
export default function MastheadPromo() {
  return (
    <a href="https://jksteamcommunity.com/id/yourname" target="_blank" rel="noopener noreferrer"
       style={{ fontFamily:T.mono, textAlign:'center', lineHeight:1.55, flex:1, textDecoration:'none', color:'inherit' }}>
      <span style={{ display:'block', fontSize:10.5, letterSpacing:'.02em', color:T.mut }}>
        <b style={{ color:T.acc }}>jk</b>steamcommunity.com/id/yourname
      </span>
      <span style={{ display:'block', fontSize:8, letterSpacing:'.06em', textTransform:'uppercase', color:T.dim, marginTop:2 }}>
        a steam-style link that jumps straight to these stats
      </span>
    </a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/MastheadPromo.jsx
git -c user.name="temuulendog" -c user.email="temuuleng23@gmail.com" commit -m "feat(redesign): compact 2-line jksteamcommunity masthead promo"
```

---

## Task 6: Hero (landing) rewrite

**Files:** Rewrite `frontend/src/components/Hero.jsx`. Source of truth: `synthesis-ac.html` landing block. Keep the existing `parseInput` + `onSubmit(id,type)` contract and `error` prop.

- [ ] **Step 1:** Replace the file. Structure: a full-height `T.bg` section; top `Masthead` (wordmark + promo, no search on landing); centered column (max-width ~620) with: a Space-Mono kicker pill `CS2 · STEAM · LEETIFY · FACEIT`; a Hanken 900 uppercase headline `Paste your steam id.` / `See the <span acc>damage</span>.`; a single bordered search row = text input (mono placeholder `steamcommunity.com/id/… or 17-digit id`) + solid-orange `ROAST ME` submit; the footnote `Profile must be public` OR the red `error`. No orbs/rings/grid/gradient text. Keep `parseInput` identical to current.

Key elements (exact accent usage):

```jsx
// headline
<h1 style={{ fontFamily:T.display, fontWeight:900, fontSize:'clamp(40px,8vw,72px)', lineHeight:.96,
  letterSpacing:'-.02em', textTransform:'uppercase' }}>
  Paste your steam id.<br/>See the <span style={{ color:T.acc }}>damage</span>.
</h1>
// submit
<button type="submit" style={{ background:T.acc, color:T.ink, border:'none', padding:'0 22px',
  fontFamily:T.display, fontWeight:800, fontSize:13, letterSpacing:'.12em', textTransform:'uppercase', cursor:'pointer' }}>Roast me</button>
```

- [ ] **Step 2: Verify** build (Task 11 covers full build); visually confirm landing renders dark with orange CTA via `npm run dev`.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Hero.jsx
git -c user.name="temuulendog" -c user.email="temuuleng23@gmail.com" commit -m "feat(redesign): editorial landing/hero"
```

---

## Task 7: Loading rewrite

**Files:** Rewrite `frontend/src/components/Loading.jsx`

- [ ] **Step 1:** Replace with: `T.bg` full screen, centered `FRAGGED` wordmark (Hanken 900), a thin **indeterminate orange bar** (a 2px track with an orange segment animated left↔right via a local keyframe), and a Space-Mono status line cycling the existing rotating headlines (keep the array; restyle — no gradient text, no orbs/arcs). Example bar keyframe (local `<style>`):

```jsx
const LOAD_CSS = `@keyframes fr-load { 0%{left:-40%} 100%{left:100%} }`;
// track:
<div style={{ position:'relative', width:240, height:2, background:T.line, overflow:'hidden' }}>
  <div style={{ position:'absolute', top:0, height:'100%', width:'40%', background:T.acc, animation:'fr-load 1.1s linear infinite' }} />
</div>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Loading.jsx
git -c user.name="temuulendog" -c user.email="temuuleng23@gmail.com" commit -m "feat(redesign): minimal editorial loading screen"
```

---

## Task 8: Results decomposition + rewrite

Create `frontend/src/components/results/` and move the orchestrator there. Each sub-component takes plain props from the existing `player` shape. **Preserve all data + logic**, restyle only.

### 8a — FaceitPanel (slim) + FraggedAimCard

**Files:** Create `results/FaceitPanel.jsx`, `results/FraggedAimCard.jsx`

- [ ] **Step 1: FaceitPanel** — props `{ faceit }`. Renders the compact right-of-Performance block: `FACEIT` mono label, orange-bordered level box (`faceit.level`), `faceit.elo.toLocaleString()` + `ELO`, and `View on Faceit →` link to `https://www.faceit.com/en/players/${faceit.nickname}`. (Exact styles: `.fr-fc`/`.fc-lvl`/`.fc-elo`/`.fc-btn` in `full-results-v3.html`.)

- [ ] **Step 2: FraggedAimCard** — props `{ aim, confidence }`. Restyle the existing card to editorial: section label `FRAGGED AIM`, big number `{aim}` in `T.acc` with `/100`, a `Bar valuePct={aim}`, source label (`Faceit + Steam aggregates` | `Steam aggregates only`) + the existing disclaimer text. No glow/gradient.

- [ ] **Step 3: Commit** (`feat(redesign): slim Faceit panel + FRAGGED Aim card`).

### 8b — PlayerHeader + LeetifyAttribution

**Files:** Create `results/PlayerHeader.jsx`, `results/LeetifyAttribution.jsx`

- [ ] **Step 1: PlayerHeader** — props `{ name, avatarUrl, level, region, statsAvailable, hoursPlayed, matchesPlayed, winRate, premier, faceit }`. Left: square avatar (`<img>` with `border:1px solid line`, no rotating ring), name (Hanken 800, 40px), mono meta line. Build the meta from real data: when `statsAvailable` → `Steam Lvl {level} · {region||'—'} · {matchesPlayed} matches · {winRate}% win · {hoursPlayed}h`; when not → Faceit/premier counterparts (mirror current header fallback logic exactly). Right: **orange rank block** — `premier.toLocaleString()` + `PREMIER` (only when `premier != null`). (Styles `.fr-head`/`.fr-rank`.)

- [ ] **Step 2: LeetifyAttribution** — props none. Render only when used. `T.surf` strip, the **official `/leetify-badge.png` image wrapped in `<a href="https://leetify.com/">`**, the text `Data provided by Leetify`, and `View on Leetify →` → `https://leetify.com/app/profile/${steamId}` (pass `steamId` prop). Keep image (NOT a text badge). (Styles `.fr-attr`.)

- [ ] **Step 3: Commit** (`feat(redesign): player header + Leetify attribution`).

### 8c — Performance (+ Faceit panel)

**Files:** Create `results/Performance.jsx`

- [ ] **Step 1:** props `{ L, tier, faceit }`. Two-column grid `1fr 210px` (`.fr-perf2`): left = 5 side-by-side `MetricCell`s (`.pmetrics` 5-col), right = `<FaceitPanel>` (or nothing if no faceit). Metric cells, with bars + goal tick computed against `tier`:
  - `AIM` value `L.aim` → `valuePct={L.aim}` `tickPct={tier.aim}`
  - `UTILITY` `L.utility` → tick `tier.utility`
  - `POSITIONING` `L.positioning` → tick `tier.positioning`
  - `OPENING DUELS` value `+{(L.opening*100).toFixed(2)}` accent; `valuePct=((L.opening*100)+2)/4*100`, `tickPct=((tier.opening)+2)/4*100`
  - `CLUTCHING` value `+{(L.clutch*100).toFixed(2)}` accent; `valuePct=((L.clutch*100)+10)/40*100`, `tickPct=((tier.clutch)+10)/40*100`

  (Display rule reminder: aim/utility/positioning are already 0–100; opening/clutch are ×100 for display. Keep exact Leetify labels.)

- [ ] **Step 2: Commit** (`feat(redesign): performance section with side-by-side bars + faceit`).

### 8d — TriangleGauges

**Files:** Create `results/TriangleGauges.jsx`

- [ ] **Step 1:** props `{ L, hsPercent, ttdMs, preaimDeg, goalTier, setGoalTier }`. Left panel: clean SVG triangle (YOU = `rgba(255,90,31,.18)` fill + `T.acc` stroke; GOAL = dashed `T.mut` outline) using `L.aim/utility/positioning` vs `goalTier.aim/utility/positioning` (reuse current point math, drop glow filters/gradients). Below it: inline **tier pills** `10K/15K/20K/25K` (mono, active = orange bg) calling `setGoalTier` with the matching `RANK_TIERS` entry. Right: three `MiniArc` gauges — `HEADSHOT ACCURACY` (`fill=hsPercent`, accent), `TIME TO DAMAGE` (`value={ttdMs+'ms'}`, `fill=((800-ttdMs)/500)*100`), `CROSSHAIR PLACEMENT` (`value={preaimDeg+'°'}`, `fill=((20-preaimDeg)/15)*100`). Layout `.fr-perf` (`1fr 1.3fr`).

- [ ] **Step 2: Commit** (`feat(redesign): triangle + tier pills + skill gauges`).

### 8e — Roles (CT/T + Opening Duels + Trades + Grenades & Utility)

**Files:** Create `results/Roles.jsx`

- [ ] **Step 1:** props `{ L }`. Restyle the existing detailed Leetify content into editorial sections (preserve every stat; render each block only if its inputs exist):
  - **Sides & Roles** grid (`.fr-grid` 5-col `Cell`s): `CT RATING` `+{(L.ctRating*100).toFixed(2)}` (acc), `T RATING` `{(L.tRating*100).toFixed(2)}`, plus `OPENING WIN %`, `TRADE KILL %`, `UTIL DMG / RND` summary values.
  - **Opening Duels** rows: CT/T `Aggression Success` (`L.ctOpeningAggression`/`L.tOpeningAggression`) and `Duel Win Rate` (`L.ctOpeningDuel`/`L.tOpeningDuel`) — two-value rows (CT label `T.fg`, T label `T.mut`), tabular.
  - **Trades** rows: `Trade Kills Success %` (`L.tradeKillsSuccess`), `Trade Deaths Success %` (`L.tradedDeathsSuccess`), `Kill Opps / Round` (`L.tradeKillOpps`).
  - **Grenades & Utility** two columns — Flashbangs (`L.flashThrown`, `L.flashHitFoePerFlash`, `L.flashHitFoeDuration`, `L.flashHitFriendPerFlash`, `L.flashLeadToKill`) and HE & Aim (`L.heFoesDmg`, `L.heFriendsDmg`, `L.counterStrafing`, `L.utilityOnDeath`). Use a simple `label … value` hairline row (Space Mono label, Hanken value). No bars required here (keep it dense/tabular); color stays neutral (drop the old good/warn/bad glow coloring — optional: keep win/loss color only on clearly-good/bad if desired, but default neutral to honor color discipline).

- [ ] **Step 2: Commit** (`feat(redesign): roles — CT/T, opening duels, trades, grenades & utility`).

### 8f — WeaponAffinity

**Files:** Create `results/WeaponAffinity.jsx`

- [ ] **Step 1:** props `{ affinity }`. Section label `WEAPON AFFINITY`; four `.waf-row`s (Rifle/Pistol/Sniper/SMG) = mono name + flat hairline track (`T.line` bg, `T.fg` fill at `value%`) + `value%`. No gradient/glow. (Styles `.waf`.)

- [ ] **Step 2: Commit** (`feat(redesign): weapon affinity bars`).

### 8g — MatchHistory (with Mode column)

**Files:** Create `results/MatchHistory.jsx`

- [ ] **Step 1:** props `{ matches, visible, onLoadMore }`. Editorial `.mt` table, columns: `Map · Mode · Result · Score · K — D · HS% · Rank ± · Date`.
  - **Mode**: `m.rank_type === 11` → `<span class="mode prem">Premier</span>` else `Competitive` (muted).
  - **Result**: `WIN` (`T.win`) / `LOSS` (`T.loss`) / `DRAW` from `m.outcome`.
  - **Score**: `Array.isArray(m.score) ? \`${m.score[0]} — ${m.score[1]}\` : '—'`.
  - **K — D**: from match if present (`m.kills`/`m.deaths`) else `—` (keep whatever the current data exposes; current table didn't show K-D so use `—` if absent).
  - **HS%**: `Math.round(m.accuracy_head)+'%'`.
  - **Rank ±**: Premier rows (`m.rank_type === 11 && m.rank > 0`) → `m.rank.toLocaleString()` + delta. **Delta logic UNCHANGED**: scan forward (`j=i+1..`) for the previous Premier match with `rank>0`, `rc = m.rank - prev.rank`; render `+rc`/`rc` in `T.win`/`T.loss`, else `—`. Competitive rows → `—`.
  - **Date**: from `m.finished_at` → `Mon DD` (e.g., `May 06`).
  - `Load more matches` footer row when `visible < matches.length`, calling `onLoadMore`.

- [ ] **Step 2: Commit** (`feat(redesign): editorial match history table with mode column`).

### 8h — Verdict

**Files:** Create `results/Verdict.jsx`

- [ ] **Step 1:** props `{ text }` (optional). `T.surf` strip: mono `Verdict —` + a Hanken line with an orange-highlighted phrase. If no roast text wired yet, use a static placeholder line (matches mockup). (Styles `.fr-verdict`.)

- [ ] **Step 2: Commit** (`feat(redesign): verdict strip`).

### 8i — Results orchestrator

**Files:** Create `results/Results.jsx` (new home), then update `App.jsx` import; delete old `components/Results.jsx`.

- [ ] **Step 1:** Port the orchestration from the old `Results` default export. Keep ALL of:
  - destructure `{ name, avatarUrl, level, stats, leetify:L, faceit, fragged, affinity, steamId, statsAvailable=true }`
  - derived: `hasLeetify = L && L.aim != null`, `premier`, `tier = getRankTier(premier)`, `goalTier` state (init `tier`), `visibleMatches` state (init 15), `kd/hsPercent/accuracy/winRate`, `ttdMs/preaimDeg`.
  - Render order (each gated as today):
    1. `<Masthead onReset search={<SearchBox onSearch/>}/>` (sticky; replaces StickySearch)
    2. `<PlayerHeader .../>`
    3. statsAvailable===false → the restyled "Steam game stats not public" notice (T.surf strip, `T.acc` warn dot)
    4. `hasLeetify && <LeetifyAttribution steamId/>`
    5. `hasLeetify && <Performance L tier faceit/>`
    6. `hasLeetify && <TriangleGauges .../>`
    7. `hasLeetify && <Roles L/>`
    8. `hasLeetify && L.recentMatches?.length && <><SectionLabel>Match History</SectionLabel><MatchHistory .../></>`
    9. `!hasLeetify && fragged && <FraggedAimCard .../>`
    10. `!hasLeetify && faceit && <FaceitPanel faceit/>` (full-width context)
    11. `affinity && <WeaponAffinity .../>`
    12. `<Verdict/>`
    13. `!hasLeetify && !faceit && <emptyState/>` (sign-up CTA → leetify.com)
    14. footer strip (`csstat.com` · `Steam · Leetify · Faceit`)
  - **Removed:** the `<PremierSeasons>` block (delete entirely), the redirect promo card div (promo now lives in masthead), the animated grid overlay, radial-gradient page background (replace with flat `T.bg`).

- [ ] **Step 2:** Add a tiny `SearchBox` (input + Go) inside `ui.jsx` or `results/Results.jsx` using `parseSearchInput`; wraps `onSearch(id,type)` then clears. (Styles `.fr-search`.)

- [ ] **Step 3:** Update `App.jsx` import: `import Results from './components/results/Results';`

- [ ] **Step 4:** Delete `frontend/src/components/Results.jsx` and `frontend/src/components/RedirectPromo.jsx` once no imports remain (`grep -rn "RedirectPromo\|components/Results'" frontend/src`).

- [ ] **Step 5: Commit** (`feat(redesign): results orchestrator + remove premier seasons / old Results`).

---

## Task 9: Roast page restyle

**Files:** Rewrite `frontend/src/components/Roast.jsx`

- [ ] **Step 1:** Restyle the existing roast/verdict view to the editorial system (dark `T.bg`, Hanken + mono, orange accent, hairline frame). Keep its current props/placeholder text and the two buttons ("Share my shame" → solid orange; "Try another player" → outlined hairline). No green/glass.

- [ ] **Step 2: Commit** (`feat(redesign): restyle roast page`).

---

## Task 10: Full verification pass

- [ ] **Step 1: Build** — `cd frontend && npm run build` → expect success, no unresolved imports (catches deleted-file references).
- [ ] **Step 2: Dev server** — `npm run dev`, then drive the real app (use the `run`/`verify` skills). Check three players:
  - Tier 1 (Leetify+Faceit), e.g. a public Premier profile — all sections render, bars+ticks correct, match Mode column shows Premier/Competitive, attribution badge image loads.
  - `statsAvailable:false` case: steam64 `76561199230209487` (Equa) — notice strip shows, no crash, Faceit/premier counters used.
  - Tier 3 (no Leetify/Faceit) — FRAGGED Aim + weapon affinity + sign-up CTA.
- [ ] **Step 3:** Confirm visually: no purple/cyan, no glow/glass anywhere; orange is the only accent; numbers tabular.
- [ ] **Step 4: Commit** any fixes (`fix(redesign): …`).

---

## Task 11: Preview & handoff (no auto-deploy)

- [ ] **Step 1:** Push branch: `git push -u origin redesign/editorial-grid`. Do **not** merge to `main` (main auto-deploys to csstat.com). Use a Cloudflare Pages branch preview to review live before deciding.
- [ ] **Step 2:** Update `CHANGELOG.md` + `FRAGGED_CONTEXT.md`/this repo docs as a follow-up when the redesign is accepted (out of scope until approved).

---

## Self-review notes
- **Spec coverage:** landing (T6), loading (T7), results all sections incl. preserved Opening Duels/Trades/Grenades (T8e), Faceit slim on right (T8c), match Mode column (T8g), Premier Seasons removed (T8i), masthead promo (T5), roast (T9), tokens/fonts (T1–T3), tier logic + statsAvailable + three-tier + compliance labels/badge + rank-delta scan all called out as preserved. ✓
- **Color discipline:** orange accent only; win/loss green/red on results + deltas; tier rainbow retired. ✓
- **Naming consistency:** `T`, `getRankTier`, `RANK_TIERS`, `parseSearchInput`, `Bar`, `MetricCell`, `Cell`, `MiniArc`, `Masthead`, `MastheadPromo`, `FaceitPanel` used consistently across tasks. ✓
- **Known data gap:** match `K — D` column shows `—` unless the match objects carry kills/deaths; current table didn't render K-D, so this is additive and safe (verify against live data in T10; drop the column if always empty).
