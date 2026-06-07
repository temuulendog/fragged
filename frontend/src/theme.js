// FRAGGED — Editorial-grid design tokens & shared helpers.
// One source of truth for colors, fonts, motion, and the bits of logic
// (rank tiers, search parsing) that several components share.

export const T = {
  bg: '#100f0c',
  surf: '#16140f',
  fg: '#f0eee9',
  mut: 'rgba(240,238,233,.55)',
  dim: 'rgba(240,238,233,.32)',
  line: 'rgba(240,238,233,.12)',
  line2: 'rgba(240,238,233,.07)',
  acc: '#ff5a1f',
  ink: '#100f0c',
  win: '#5fa56a',
  loss: '#c2483b',
  display: "'Hanken Grotesk', sans-serif",
  mono: "'Space Mono', monospace",
};

// Premier tier benchmarks (goal averages used by the triangle + performance ticks).
// Values unchanged from the original; per-tier rainbow colors retired (orange is the only accent now).
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

// Clamp helper for bar/gauge fills.
export const clampPct = (v) => Math.min(100, Math.max(0, v));

// Minimal motion — fade/slide up + bar grow. No glow/spin/grid/float.
export const KEYFRAMES = `
@keyframes fr-fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
@keyframes fr-growBar { from { transform:scaleX(0);} to { transform:scaleX(1);} }
@keyframes fr-load { 0% { left:-40%; } 100% { left:100%; } }
.fr-sec { animation: fr-fadeUp 500ms cubic-bezier(0.16,1,0.3,1) both; }
.fr-bar > i { transform-origin:left center; animation: fr-growBar 800ms cubic-bezier(0.16,1,0.3,1) 120ms both; }
.fr-rowh { transition: background-color 140ms ease; }
.fr-rowh:hover { background-color: rgba(240,238,233,.04); }
`;
