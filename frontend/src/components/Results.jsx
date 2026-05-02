import { useMemo, useState } from 'react';

const RANK_TIERS = [
  { min: 25000, label: '25K+', color: '#ef4444', aim: 82, utility: 62, positioning: 57, opening: 0.77,  clutch: 10.93 },
  { min: 20000, label: '20K+', color: '#ec4899', aim: 74, utility: 61, positioning: 55, opening: 0.45,  clutch: 11.50 },
  { min: 15000, label: '15K+', color: '#a78bfa', aim: 66, utility: 58, positioning: 53, opening: 0.20,  clutch: 10.80 },
  { min: 10000, label: '10K+', color: '#3b82f6', aim: 58, utility: 55, positioning: 51, opening: -0.50, clutch:  9.50 },
  { min:  5000, label:  '5K+', color: '#60a5fa', aim: 48, utility: 51, positioning: 50, opening: -1.50, clutch:  8.00 },
  { min:     1, label:  '1K+', color: '#94a3b8', aim: 31, utility: 46, positioning: 46, opening: -3.00, clutch:  6.50 },
];

const T = {
  bg: '#06060c',
  bg2: '#0c0c18',
  surface: 'linear-gradient(145deg, rgba(28, 28, 46, 0.55) 0%, rgba(14, 14, 24, 0.7) 100%)',
  surfaceAlt: 'linear-gradient(180deg, rgba(36, 36, 58, 0.4) 0%, rgba(18, 18, 32, 0.6) 100%)',
  border: 'rgba(120, 120, 180, 0.10)',
  borderStrong: 'rgba(167, 139, 250, 0.22)',
  text: '#f4f4f8',
  text2: '#a8a8c0',
  textMuted: '#6a6a82',
  textDim: '#4a4a5e',
  accent: '#a78bfa',
  accent2: '#22d3ee',
  good: '#34d399',
  bad: '#f87171',
  warn: '#fbbf24',
  ct: '#60a5fa',
  tSide: '#fbbf24',
};

const KEYFRAMES = `
@keyframes fr-fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fr-fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes fr-scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes fr-growBar {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes fr-drawArc {
  from { stroke-dashoffset: var(--arc-len, 200); }
  to   { stroke-dashoffset: 0; }
}
@keyframes fr-pulse {
  0%, 100% { box-shadow: 0 0 30px var(--glow), 0 0 0 1px rgba(255,255,255,0.04); }
  50%      { box-shadow: 0 0 60px var(--glow), 0 0 0 1px rgba(255,255,255,0.08); }
}
@keyframes fr-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes fr-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
@keyframes fr-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes fr-gridShift {
  0% { background-position: 0 0; }
  100% { background-position: 48px 48px; }
}
.fr-section {
  animation: fr-fadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.fr-card {
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 220ms;
  will-change: transform;
}
.fr-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 139, 250, 0.35) !important;
  box-shadow: 0 14px 50px rgba(0,0,0,0.55),
              0 0 0 1px rgba(167, 139, 250, 0.18),
              0 0 60px rgba(167, 139, 250, 0.08);
}
.fr-stat:hover {
  transform: translateY(-2px);
  border-color: rgba(167, 139, 250, 0.30) !important;
}
.fr-stat:hover .fr-stat-val {
  background-position: 100% 0;
}
.fr-row {
  transition: background-color 180ms ease;
}
.fr-row:hover {
  background-color: rgba(167, 139, 250, 0.06) !important;
}
.fr-bar-fill {
  transform-origin: left center;
  animation: fr-growBar 1100ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both;
}
.fr-arc {
  animation: fr-drawArc 1300ms cubic-bezier(0.16, 1, 0.3, 1) 250ms both;
}
.fr-medal {
  animation: fr-scaleIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both,
             fr-pulse 3.5s ease-in-out 600ms infinite;
}
.fr-avatar-ring {
  animation: fr-spin 14s linear infinite;
}
`;

function getRankTier(premier) {
  if (!premier) return RANK_TIERS[RANK_TIERS.length - 1];
  return RANK_TIERS.find(t => premier >= t.min) || RANK_TIERS[RANK_TIERS.length - 1];
}

function premierColor(rating) {
  if (!rating) return '#94a3b8';
  if (rating >= 25000) return '#ef4444';
  if (rating >= 20000) return '#ec4899';
  if (rating >= 15000) return '#a78bfa';
  if (rating >= 10000) return '#3b82f6';
  if (rating >= 5000)  return '#60a5fa';
  return '#94a3b8';
}

function PremierMedal({ rating }) {
  const color = premierColor(rating);
  const tier = getRankTier(rating);

  const formatted = rating != null ? rating.toLocaleString('en-US') : '—';
  const lastComma = formatted.lastIndexOf(',');
  const large = lastComma >= 0 ? formatted.slice(0, lastComma + 1) : formatted;
  const small = lastComma >= 0 ? formatted.slice(lastComma + 1) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        className="fr-medal"
        style={{
          '--glow': `${color}40`,
          display: 'inline-flex', alignItems: 'center',
          background: `linear-gradient(135deg, ${color}1f 0%, #18060a 50%, #0c0408 100%)`,
          border: `1px solid ${color}55`,
          borderRadius: '6px',
          padding: '6px 14px 6px 8px',
          gap: '8px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg width="14" height="30" viewBox="0 0 14 30" style={{ flexShrink: 0, position: 'relative' }}>
          <path d="M2 1 L5 1 L3 29 L0 29 Z" fill={color} />
          <path d="M7 1 L10 1 L8 29 L5 29 Z" fill={color} opacity="0.55" />
        </svg>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0px', position: 'relative' }}>
          <span style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '1.7rem', fontWeight: 800,
            color, letterSpacing: '0.01em', lineHeight: 1,
          }}>{large}</span>
          <span style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '1.7rem', fontWeight: 800,
            color, letterSpacing: '0.01em', lineHeight: 1,
          }}>{small}</span>
        </div>
      </div>
      <div style={{
        fontSize: '0.62rem', color: T.textMuted,
        textTransform: 'uppercase', letterSpacing: '0.16em',
        fontWeight: 600,
      }}>
        {tier.label} <span style={{ color: T.textDim }}>·</span> Premier
      </div>
    </div>
  );
}

function RatingBar({ label, value, benchmark, minVal = 0, maxVal = 100, decimals = 0, color = T.accent, delay = 0 }) {
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const pct = (v) => ((clamp(v, minVal, maxVal) - minVal) / (maxVal - minVal)) * 100;

  const barPct = pct(value ?? 0);
  const benchPct = benchmark != null ? pct(benchmark) : null;

  const fmt = (v) => {
    if (v == null) return '—';
    const n = parseFloat(v);
    const s = n.toFixed(decimals);
    return n > 0 && decimals > 0 ? `+${s}` : s;
  };

  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
        <span style={{ fontSize: '0.72rem', color: T.text2, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{label}</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
          {benchPct != null && (
            <span style={{ fontSize: '0.66rem', color: T.textMuted, letterSpacing: '0.04em' }}>avg {fmt(benchmark)}</span>
          )}
          <span style={{ fontSize: '1rem', fontWeight: 700, color, fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.02em' }}>
            {fmt(value)}
          </span>
        </div>
      </div>
      <div style={{
        position: 'relative', height: '10px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '5px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
      }}>
        <div
          className="fr-bar-fill"
          style={{
            height: '100%', borderRadius: '5px',
            width: `${barPct}%`,
            background: `linear-gradient(90deg, ${color}55, ${color})`,
            boxShadow: `0 0 12px ${color}55`,
            animationDelay: `${delay}ms`,
          }}
        />
        {benchPct != null && (
          <div style={{
            position: 'absolute', top: '-2px', bottom: '-2px',
            left: `${benchPct}%`,
            width: '2px', background: 'rgba(255,255,255,0.85)', borderRadius: '1px',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 6px rgba(255,255,255,0.5)',
          }} />
        )}
      </div>
    </div>
  );
}

function MiniCircle({ label, value, displayValue, fill, unit = '', good, bad, invert = false, delay = 0 }) {
  const safeId = label.replace(/[^a-zA-Z0-9]/g, '');
  const SIZE = 104, cx = 52, cy = 56, R = 40, sw = 8;
  const SWEEP = 270;
  const circumference = 2 * Math.PI * R;
  const arcLength = (SWEEP / 360) * circumference;

  const clampedFill = Math.min(100, Math.max(0, fill ?? 0));
  const dash = (clampedFill / 100) * arcLength;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const polar = (angle) => ({ x: cx + R * Math.cos(toRad(angle)), y: cy + R * Math.sin(toRad(angle)) });

  const describeArc = (startDeg, sweepDeg) => {
    const s = polar(startDeg), e = polar(startDeg + sweepDeg);
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${sweepDeg > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
  };

  const trackPath = describeArc(135, SWEEP);

  let valueColor = T.accent;
  if (good != null && bad != null) {
    valueColor = invert
      ? (value <= good ? T.good : value >= bad ? T.bad : T.warn)
      : (value >= good ? T.good : value <= bad ? T.bad : T.warn);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <defs>
          <linearGradient id={`grad-${safeId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={valueColor} stopOpacity="0.55" />
            <stop offset="100%" stopColor={valueColor} stopOpacity="1" />
          </linearGradient>
          <filter id={`glow-${safeId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} strokeLinecap="round" />
        <path
          className="fr-arc"
          style={{
            '--arc-len': dash,
            animationDelay: `${delay}ms`,
          }}
          d={trackPath}
          fill="none"
          stroke={`url(#grad-${safeId})`}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${arcLength}`}
          filter={`url(#glow-${safeId})`}
        />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={T.text}
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          {displayValue ?? '—'}
        </text>
        {unit && <text x={cx} y={cy + 18} textAnchor="middle" fontSize="8" fill={T.textMuted}>{unit}</text>}
      </svg>
      <span style={{ fontSize: '0.62rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function TriangleChart({ aim, utility, positioning, goalTier }) {
  const [hover, setHover] = useState(null);
  const W = 280, H = 260, cx = W / 2, cy = H / 2 + 8, maxR = 92;
  const PLAYER_COLOR = '#ec4899';
  const GOAL_COLOR = '#a78bfa';

  const axes = [
    { label: 'Aim',          angle: -90, value: aim,          bench: goalTier.aim },
    { label: 'Utility Usage',angle:  30, value: utility,      bench: goalTier.utility },
    { label: 'Positioning',  angle: 150, value: positioning,  bench: goalTier.positioning },
  ];

  const toPoint = (angle, r) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const pts = (arr) => arr.map(p => `${p.x},${p.y}`).join(' ');
  const playerPts = axes.map(a => toPoint(a.angle, ((a.value ?? 0) / 100) * maxR));
  const benchPts  = axes.map(a => toPoint(a.angle, (a.bench / 100) * maxR));

  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="tri-player" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={PLAYER_COLOR} stopOpacity="0.42" />
            <stop offset="100%" stopColor={PLAYER_COLOR} stopOpacity="0.10" />
          </radialGradient>
          <radialGradient id="tri-goal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOAL_COLOR} stopOpacity="0.32" />
            <stop offset="100%" stopColor={GOAL_COLOR} stopOpacity="0.08" />
          </radialGradient>
          <filter id="tri-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[0.2, 0.4, 0.6, 0.8, 1.0].map(r => (
          <polygon key={r} points={pts(axes.map(a => toPoint(a.angle, r * maxR)))} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {axes.map((a, i) => {
          const outer = toPoint(a.angle, maxR);
          return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
        })}
        <polygon points={pts(benchPts)} fill="url(#tri-goal)" stroke={GOAL_COLOR} strokeWidth="2" style={{ animation: 'fr-fadeIn 700ms ease-out 200ms both' }} />
        <polygon points={pts(playerPts)} fill="url(#tri-player)" stroke={PLAYER_COLOR} strokeWidth="2.2" filter="url(#tri-glow)" style={{ animation: 'fr-fadeIn 900ms ease-out 350ms both' }} />
        {benchPts.map((p, i) => (
          <circle
            key={`g-${i}`} cx={p.x} cy={p.y}
            r={hover === `g-${i}` ? 6 : 3.5}
            fill={GOAL_COLOR}
            style={{
              cursor: 'pointer',
              transition: 'r 200ms',
              filter: hover === `g-${i}` ? `drop-shadow(0 0 10px ${GOAL_COLOR})` : 'none',
              animation: 'fr-scaleIn 500ms ease-out both', animationDelay: `${400 + i * 70}ms`,
            }}
            onMouseEnter={() => setHover(`g-${i}`)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        {playerPts.map((p, i) => (
          <circle
            key={`p-${i}`} cx={p.x} cy={p.y}
            r={hover === `p-${i}` ? 6.5 : 4}
            fill={PLAYER_COLOR}
            style={{
              cursor: 'pointer',
              transition: 'r 200ms',
              filter: `drop-shadow(0 0 ${hover === `p-${i}` ? 12 : 6}px ${PLAYER_COLOR})`,
              animation: 'fr-scaleIn 500ms ease-out both', animationDelay: `${550 + i * 80}ms`,
            }}
            onMouseEnter={() => setHover(`p-${i}`)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        {axes.map((a, i) => {
          const lp = toPoint(a.angle, maxR + 22);
          return (
            <text key={i} x={lp.x} y={lp.y + 4} textAnchor="middle" fontSize="13" fill={T.text2}
              fontWeight="500"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {a.label}
            </text>
          );
        })}
      </svg>
      {hover != null && (() => {
        const isPlayer = hover.startsWith('p-');
        const idx = parseInt(hover.split('-')[1], 10);
        const a = axes[idx];
        const pt = isPlayer ? playerPts[idx] : benchPts[idx];
        const color = isPlayer ? PLAYER_COLOR : GOAL_COLOR;
        const val = isPlayer ? (a.value ?? 0) : a.bench;
        return (
          <div style={{
            position: 'absolute',
            left: pt.x, top: pt.y - 14,
            transform: 'translate(-50%, -100%)',
            background: '#0e0e1a',
            border: `1px solid ${color}66`,
            borderRadius: '6px',
            padding: '6px 10px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: `0 6px 20px rgba(0,0,0,0.6), 0 0 16px ${color}33`,
            animation: 'fr-scaleIn 160ms ease-out both',
            zIndex: 5,
          }}>
            <div style={{ fontSize: '0.55rem', color: color, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '2px' }}>
              {isPlayer ? 'YOU' : 'GOAL'} · {a.label}
            </div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: T.text, letterSpacing: '0.02em' }}>
              {val.toFixed(1)}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function TierSelector({ activeTier, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', minWidth: '160px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          padding: '8px 12px',
          color: T.text,
          cursor: 'pointer',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '0.95rem', fontWeight: 700,
          letterSpacing: '0.04em',
          transition: 'border-color 200ms, background 200ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderStrong; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
      >
        <svg width="14" height="20" viewBox="0 0 14 20" style={{ flexShrink: 0 }}>
          <path d="M2 1 L5 1 L3 19 L0 19 Z" fill={activeTier.color} />
          <path d="M7 1 L10 1 L8 19 L5 19 Z" fill={activeTier.color} opacity="0.55" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left', color: activeTier.color }}>{tierRangeLabel(activeTier)}</span>
        <span style={{ fontSize: '0.7rem', color: T.textMuted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          minWidth: '180px',
          background: '#0e0e1a',
          border: `1px solid ${T.borderStrong}`,
          borderRadius: '8px',
          padding: '6px',
          zIndex: 10,
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          animation: 'fr-fadeUp 200ms ease-out both',
        }}>
          <div style={{ fontSize: '0.55rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.16em', padding: '6px 10px 4px', fontWeight: 700 }}>Matchmaking</div>
          {RANK_TIERS.slice().reverse().map(t => (
            <button
              key={t.label}
              onClick={() => { onChange(t); setOpen(false); }}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: '10px',
                background: t.label === activeTier.label ? 'rgba(167,139,250,0.08)' : 'transparent',
                border: 'none', borderRadius: '5px',
                padding: '8px 10px',
                color: t.color,
                cursor: 'pointer',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '0.95rem', fontWeight: 700,
                letterSpacing: '0.04em',
                textAlign: 'left',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => { if (t.label !== activeTier.label) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (t.label !== activeTier.label) e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="14" height="20" viewBox="0 0 14 20" style={{ flexShrink: 0 }}>
                <path d="M2 1 L5 1 L3 19 L0 19 Z" fill={t.color} />
                <path d="M7 1 L10 1 L8 19 L5 19 Z" fill={t.color} opacity="0.55" />
              </svg>
              <span>{tierRangeLabel(t)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function tierRangeLabel(t) {
  const idx = RANK_TIERS.findIndex(x => x.label === t.label);
  const upper = idx === 0 ? null : RANK_TIERS[idx - 1].min - 1;
  const lo = t.min.toLocaleString();
  if (upper == null) return `${lo}+`;
  return `${lo} – ${upper.toLocaleString()}`;
}

function RankLegend({ activeTier }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', justifyContent: 'center' }}>
      {RANK_TIERS.map(t => (
        <div key={t.label} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          opacity: t.label === activeTier.label ? 1 : 0.35,
          transition: 'opacity 200ms',
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: t.color, flexShrink: 0,
            boxShadow: t.label === activeTier.label ? `0 0 10px ${t.color}` : 'none',
          }} />
          <span style={{
            fontSize: '0.68rem',
            color: t.label === activeTier.label ? T.text : T.textMuted,
            fontFamily: 'Barlow Condensed, sans-serif',
            letterSpacing: '0.08em', fontWeight: 600,
          }}>
            {t.label}
          </span>
          {t.label === activeTier.label && (
            <span style={{
              fontSize: '0.55rem', color: t.color, fontWeight: 700,
              padding: '1px 5px', borderRadius: '3px',
              background: `${t.color}22`,
              letterSpacing: '0.1em',
            }}>YOU</span>
          )}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ width: '20px', height: '2px', background: T.accent, flexShrink: 0, boxShadow: `0 0 8px ${T.accent}` }} />
        <span style={{ fontSize: '0.62rem', color: T.accent, letterSpacing: '0.06em' }}>Player</span>
      </div>
    </div>
  );
}

function MatchHistory({ matches, visible, onLoadMore }) {
  if (!matches?.length) return null;
  const shown = matches.slice(0, visible);

  const mapName = (m) => (m?.map_name || m?.map || '—').replace('de_', '').replace(/^\w/, c => c.toUpperCase());

  const score = (m) => {
    const s = m.score;
    if (Array.isArray(s)) return `${s[0]} : ${s[1]}`;
    return '— : —';
  };

  const result = (m) => {
    if (m.outcome === 'win')  return { label: 'W', color: T.good };
    if (m.outcome === 'loss') return { label: 'L', color: T.bad };
    return { label: 'D', color: T.text2 };
  };

  const fmtDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const ttdColor = (ms) => {
    if (ms == null) return T.textMuted;
    if (ms < 400) return T.good;
    if (ms < 600) return T.warn;
    return T.bad;
  };

  return (
    <div style={{ overflowX: 'auto', margin: '0 -4px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {['MAP', 'MODE', 'SCORE', 'RES', 'RANK ±', 'TTD', 'HS%', 'ACC', 'DATE'].map(h => (
              <th key={h} style={{ padding: '10px 12px', color: T.textMuted, fontWeight: 600, textAlign: h === 'MAP' ? 'left' : 'center', letterSpacing: '0.12em', fontSize: '0.62rem', fontFamily: 'Barlow Condensed, sans-serif' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((m, i) => {
            const r = result(m);
            // Delta = this match's rank minus the previous PREMIER match (rank>0) further down the array.
            // matches[i+1] alone is unsafe because Comp matches reuse the `rank` field for per-map ranks (1-15).
            let rc = null;
            if (m.rank_type === 11 && m.rank > 0) {
              for (let j = i + 1; j < matches.length; j++) {
                const prev = matches[j];
                if (prev.rank_type === 11 && prev.rank > 0) {
                  rc = m.rank - prev.rank;
                  break;
                }
              }
            }
            const ttd = m.reaction_time_ms;

            return (
              <tr
                key={i}
                className="fr-row"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  animation: `fr-fadeUp 500ms ease-out ${i * 40}ms both`,
                }}
              >
                <td style={{ padding: '10px 12px', color: T.text, fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em', fontWeight: 600 }}>{mapName(m)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
                    padding: '3px 8px', borderRadius: '4px',
                    background: m.rank_type === 11 ? 'rgba(251,191,36,0.12)' : 'rgba(96,165,250,0.12)',
                    color: m.rank_type === 11 ? T.warn : T.ct,
                    border: `1px solid ${m.rank_type === 11 ? 'rgba(251,191,36,0.25)' : 'rgba(96,165,250,0.25)'}`,
                  }}>
                    {m.rank_type === 11 ? 'PREMIER' : 'COMP'}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: T.text }}>{score(m)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{
                    color: r.color, fontWeight: 800, fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: '0.95rem', textShadow: `0 0 10px ${r.color}55`,
                  }}>{r.label}</span>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  {m.rank_type === 11 && m.rank > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', lineHeight: 1.05 }}>
                      <span style={{
                        color: getRankTier(m.rank).color,
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        letterSpacing: '0.02em',
                        textShadow: `0 0 10px ${getRankTier(m.rank).color}55`,
                      }}>{m.rank.toLocaleString()}</span>
                      {rc != null ? (
                        <span style={{
                          color: rc >= 0 ? T.good : T.bad,
                          fontFamily: 'Barlow Condensed, sans-serif',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}>{rc >= 0 ? '+' : ''}{rc}</span>
                      ) : (
                        <span style={{ color: T.textDim, fontSize: '0.7rem' }}>—</span>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: T.textDim }}>—</span>
                  )}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: ttdColor(ttd), fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>
                  {ttd != null ? `${Math.round(ttd)}ms` : '—'}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: T.text2 }}>
                  {m.accuracy_head != null ? `${Math.round(m.accuracy_head)}%` : '—'}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: T.textMuted }}>
                  {m.accuracy_enemy_spotted != null ? `${m.accuracy_enemy_spotted.toFixed(1)}%` : '—'}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: T.textDim }}>{fmtDate(m.finished_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {visible < matches.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '18px' }}>
          <button
            onClick={onLoadMore}
            style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(34,211,238,0.10) 100%)',
              border: `1px solid ${T.borderStrong}`,
              borderRadius: '8px',
              padding: '10px 28px',
              color: T.text,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '0.9rem', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'transform 200ms, box-shadow 200ms, border-color 200ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(167,139,250,0.25)';
              e.currentTarget.style.borderColor = T.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = T.borderStrong;
            }}
          >
            Load More <span style={{ color: T.textMuted, marginLeft: '6px' }}>({matches.length - visible})</span>
          </button>
        </div>
      )}
    </div>
  );
}

// CS2 Premier season boundaries (approximate, based on Valve's seasonal cadence).
// Most recent first so we iterate in display order (Season 4 → Season 1).
const PREMIER_SEASONS = [
  { num: 4, label: 'Season Four',  start: '2025-04-23', end: null },
  { num: 3, label: 'Season Three', start: '2024-10-01', end: '2025-04-23' },
  { num: 2, label: 'Season Two',   start: '2024-04-24', end: '2024-10-01' },
  { num: 1, label: 'Season One',   start: '2023-10-05', end: '2024-04-24' },
];

function RankBadge({ rank, size = 'md' }) {
  if (rank == null || rank <= 0) return <span style={{ color: T.textDim }}>—</span>;
  const tier = getRankTier(rank);
  const dims = size === 'sm'
    ? { padX: 10, padY: 4, font: '0.78rem' }
    : { padX: 14, padY: 6, font: '0.95rem' };
  return (
    <span style={{
      display: 'inline-block',
      padding: `${dims.padY}px ${dims.padX}px`,
      background: `linear-gradient(135deg, ${tier.color}33 0%, ${tier.color}14 100%)`,
      border: `1px solid ${tier.color}66`,
      borderRadius: '4px',
      transform: 'skewX(-12deg)',
      boxShadow: `0 0 12px ${tier.color}33`,
    }}>
      <span style={{
        display: 'inline-block',
        transform: 'skewX(12deg)',
        color: tier.color,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 800,
        fontStyle: 'italic',
        fontSize: dims.font,
        letterSpacing: '0.02em',
        textShadow: `0 0 12px ${tier.color}66`,
      }}>{rank.toLocaleString()}</span>
    </span>
  );
}

function PremierSeasons({ matches }) {
  const [expanded, setExpanded] = useState(null);

  const seasons = useMemo(() => {
    const premier = (matches || []).filter(m => m.rank_type === 11 && m.rank > 0 && m.finished_at);

    return PREMIER_SEASONS.map(s => {
      const startMs = new Date(s.start).getTime();
      const endMs = s.end ? new Date(s.end).getTime() : Infinity;
      const inSeason = premier.filter(m => {
        const t = new Date(m.finished_at).getTime();
        return t >= startMs && t < endMs;
      });

      if (!inSeason.length) {
        return { ...s, count: 0, winRate: null, minRank: null, maxRank: null, mostPlayed: null, matches: [], hasData: false };
      }

      const wins = inSeason.filter(m => m.outcome === 'win').length;
      const losses = inSeason.filter(m => m.outcome === 'loss').length;
      const decided = wins + losses;
      const winRate = decided > 0 ? Math.round((wins / decided) * 100) : 0;

      const ranks = inSeason.map(m => m.rank);
      const minRank = Math.min(...ranks);
      const maxRank = Math.max(...ranks);

      const mapCount = {};
      for (const m of inSeason) {
        const map = (m.map_name || m.map || '').replace('de_', '');
        if (!map) continue;
        mapCount[map] = (mapCount[map] || 0) + 1;
      }
      const mostPlayed = Object.entries(mapCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

      return { ...s, count: inSeason.length, winRate, minRank, maxRank, mostPlayed, matches: inSeason, hasData: true };
    });
  }, [matches]);

  if (!seasons.length) return null;

  const fmtDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ fontSize: '0.6rem', color: T.textMuted, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, marginBottom: '8px' }}>
        Displayed in (Min &gt;&gt;&gt; Max) — Leetify only exposes the last ~100 matches, so older seasons may show no data
      </div>
      {seasons.map((s, idx) => {
        const isOpen = s.hasData && expanded === s.num;
        const interactive = s.hasData;
        return (
          <div
            key={s.num}
            style={{
              borderBottom: `1px solid ${T.border}`,
              animation: `fr-fadeUp 500ms ease-out ${idx * 60}ms both`,
              opacity: interactive ? 1 : 0.5,
            }}
          >
            <button
              onClick={() => interactive && setExpanded(isOpen ? null : s.num)}
              disabled={!interactive}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                background: 'transparent', border: 'none',
                cursor: interactive ? 'pointer' : 'default',
                padding: '14px 4px', textAlign: 'left',
                transition: 'background-color 180ms',
                borderRadius: '6px',
              }}
              onMouseEnter={e => { if (interactive) e.currentTarget.style.background = 'rgba(167,139,250,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', color: T.text, letterSpacing: '0.04em' }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: T.text2 }}>
                    {s.hasData
                      ? `${s.count} ${s.count === 1 ? 'match' : 'matches'}, ${s.winRate}% wr, most played: ${s.mostPlayed}`
                      : 'No matches in recent history'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <RankBadge rank={s.minRank} />
                <span style={{ color: T.textDim, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, letterSpacing: '0.1em' }}>&gt;&gt;&gt;</span>
                <RankBadge rank={s.maxRank} />
                {interactive ? (
                  <span style={{
                    color: T.textMuted,
                    fontSize: '0.7rem',
                    marginLeft: '4px',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms',
                    display: 'inline-block',
                  }}>▼</span>
                ) : (
                  <span style={{ width: '14px', display: 'inline-block' }} />
                )}
              </div>
            </button>
            {isOpen && (
              <div style={{ padding: '4px 4px 14px', display: 'flex', flexDirection: 'column', gap: '4px', animation: 'fr-fadeIn 240ms ease-out both' }}>
                {s.matches.slice(0, 12).map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '6px 8px', borderRadius: '4px',
                    background: 'rgba(167,139,250,0.03)',
                    fontSize: '0.74rem', color: T.text2,
                  }}>
                    <span style={{ minWidth: '60px', color: T.text, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>
                      {(m.map_name || m.map || '—').replace('de_', '').replace(/^\w/, c => c.toUpperCase())}
                    </span>
                    <span style={{ minWidth: '50px', textAlign: 'center' }}>
                      {Array.isArray(m.score) ? `${m.score[0]} : ${m.score[1]}` : '—'}
                    </span>
                    <span style={{
                      minWidth: '20px', textAlign: 'center', fontWeight: 800,
                      color: m.outcome === 'win' ? T.good : m.outcome === 'loss' ? T.bad : T.text2,
                      fontFamily: 'Barlow Condensed, sans-serif',
                    }}>
                      {m.outcome === 'win' ? 'W' : m.outcome === 'loss' ? 'L' : 'D'}
                    </span>
                    <span style={{ flex: 1 }} />
                    <RankBadge rank={m.rank} size="sm" />
                    <span style={{ minWidth: '40px', textAlign: 'right', color: T.textDim, fontSize: '0.7rem' }}>
                      {fmtDate(m.finished_at)}
                    </span>
                  </div>
                ))}
                {s.matches.length > 12 && (
                  <div style={{ textAlign: 'center', color: T.textDim, fontSize: '0.7rem', padding: '6px 0' }}>
                    + {s.matches.length - 12} more matches in this season
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatRow({ label, value, suffix = '', decimals = 1, good, bad, invert = false, barMax, delay = 0 }) {
  const v = value != null ? parseFloat(value) : null;
  const display = v != null ? `${v.toFixed(decimals)}${suffix}` : '—';

  let color = T.text2;
  if (v != null && good != null && bad != null) {
    color = invert
      ? (v <= good ? T.good : v >= bad ? T.bad : T.warn)
      : (v >= good ? T.good : v <= bad ? T.bad : T.warn);
  }

  const bm = barMax ?? (suffix === '%' ? 100 : null);
  const barPct = bm != null && v != null ? Math.min(100, Math.max(0, (v / bm) * 100)) : null;

  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: barPct != null ? '6px' : 0 }}>
        <span style={{ fontSize: '0.7rem', color: T.text2, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '1rem', fontWeight: 700, color, fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.02em', textShadow: `0 0 12px ${color}33` }}>{display}</span>
      </div>
      {barPct != null && (
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            className="fr-bar-fill"
            style={{
              height: '100%', width: `${barPct}%`,
              background: `linear-gradient(90deg, ${color}66, ${color})`,
              boxShadow: `0 0 8px ${color}66`,
              borderRadius: '2px',
              animationDelay: `${delay}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function SideCompare({ label, ct, t, suffix = '%', decimals = 1, good, bad, invert = false }) {
  const getColor = (v) => {
    if (v == null || good == null || bad == null) return T.text2;
    return invert
      ? (v <= good ? T.good : v >= bad ? T.bad : T.warn)
      : (v >= good ? T.good : v <= bad ? T.bad : T.warn);
  };
  const fmt = (v) => v != null ? `${v.toFixed(decimals)}${suffix}` : '—';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: '0.7rem', color: T.text2, textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ textAlign: 'right', minWidth: '64px' }}>
          <div style={{ fontSize: '0.55rem', color: T.ct, letterSpacing: '0.16em', marginBottom: '3px', fontWeight: 700 }}>CT</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif', color: getColor(ct), textShadow: `0 0 12px ${getColor(ct)}33` }}>{fmt(ct)}</div>
        </div>
        <div style={{ textAlign: 'right', minWidth: '64px' }}>
          <div style={{ fontSize: '0.55rem', color: T.tSide, letterSpacing: '0.16em', marginBottom: '3px', fontWeight: 700 }}>T</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif', color: getColor(t), textShadow: `0 0 12px ${getColor(t)}33` }}>{fmt(t)}</div>
        </div>
      </div>
    </div>
  );
}

const LEETIFY_PINK = '#F84982';
const FACEIT_ORANGE = '#FF5500';

function FraggedAimCard({ aim, confidence }) {
  const color = aim >= 70 ? T.good : aim >= 45 ? T.warn : T.bad;
  const sourceLabel = confidence === 'faceit' ? 'Faceit + Steam aggregates' : 'Steam aggregates only';
  const tooltip = confidence === 'faceit'
    ? 'FRAGGED Aim is computed from Faceit lifetime ADR / KD / HS%, blended with Steam HS% and accuracy. Not the same metric as Leetify Aim.'
    : 'FRAGGED Aim is computed from Steam lifetime HS%, accuracy, and K/D. Less accurate than Faceit-backed score. Not the same metric as Leetify Aim.';

  return (
    <div
      className="fr-card fr-section"
      style={{
        background: T.surface,
        backdropFilter: 'blur(14px)',
        border: `1px solid ${T.border}`,
        borderTop: `2px solid ${color}66`,
        borderRadius: '16px',
        padding: '22px 24px',
        animationDelay: '180ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ width: '3px', height: '14px', background: `linear-gradient(180deg, ${T.accent}, ${T.accent2})`, borderRadius: '2px' }} />
        <span style={{
          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
          fontSize: '0.92rem', color: T.text,
          textTransform: 'uppercase', letterSpacing: '0.16em',
        }}>FRAGGED Aim</span>
        <span style={{ fontSize: '0.6rem', color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ({sourceLabel})
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif', fontSize: '3rem',
          fontWeight: 800, color, lineHeight: 1,
          textShadow: `0 0 30px ${color}55`,
        }}>{aim}</div>
        <div style={{ fontSize: '0.7rem', color: T.textMuted }}>/ 100</div>
      </div>
      <div style={{ marginTop: '12px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${aim}%`, background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 12px ${color}66`,
          animation: 'fr-growBar 1000ms cubic-bezier(0.16, 1, 0.3, 1) both',
          transformOrigin: 'left center',
        }} />
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.66rem', color: T.textMuted, lineHeight: 1.45 }}>
        {tooltip}
      </div>
    </div>
  );
}

function FaceitCard({ faceit }) {
  const levelColor = faceit.level >= 9 ? '#ff5500' : faceit.level >= 6 ? '#fbbf24' : faceit.level >= 3 ? '#60a5fa' : '#94a3b8';
  const recent = faceit.recentResults || [];

  return (
    <div
      className="fr-card fr-section"
      style={{
        background: T.surface,
        backdropFilter: 'blur(14px)',
        border: `1px solid ${T.border}`,
        borderTop: `2px solid ${FACEIT_ORANGE}55`,
        borderRadius: '16px',
        padding: '22px 24px',
        animationDelay: '220ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '3px', height: '14px', background: FACEIT_ORANGE, borderRadius: '2px', boxShadow: `0 0 8px ${FACEIT_ORANGE}` }} />
          <span style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800,
            fontSize: '1rem', color: FACEIT_ORANGE,
            textTransform: 'uppercase', letterSpacing: '0.16em',
          }}>FACEIT</span>
          <span style={{ color: T.text, fontSize: '0.85rem', fontWeight: 600 }}>{faceit.nickname}</span>
        </div>
        <a
          href={`https://www.faceit.com/en/players/${faceit.nickname}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: FACEIT_ORANGE, textDecoration: 'underline', fontSize: '0.7rem', fontWeight: 700 }}
        >
          View on Faceit →
        </a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
        gap: '14px',
      }}>
        {[
          { label: 'Level', value: faceit.level ? `LV ${faceit.level}` : '—', color: levelColor },
          { label: 'Elo', value: faceit.elo?.toLocaleString() || '—' },
          { label: 'Region', value: faceit.region || '—' },
          { label: 'Avg K/D', value: faceit.kdAvg?.toFixed(2) || '—' },
          { label: 'Avg HS%', value: faceit.hsAvg != null ? `${faceit.hsAvg}%` : '—' },
          { label: 'ADR', value: faceit.adr?.toFixed(1) || '—' },
          { label: 'Win Rate', value: faceit.winRate != null ? `${faceit.winRate}%` : '—' },
          { label: 'Matches', value: faceit.totalMatches?.toLocaleString() || '—' },
          { label: '1v1 Win', value: faceit.clutch1v1 != null ? `${Math.round(faceit.clutch1v1 * 100)}%` : '—' },
          { label: '1v2 Win', value: faceit.clutch1v2 != null ? `${Math.round(faceit.clutch1v2 * 100)}%` : '—' },
          { label: 'Entry Win', value: faceit.entrySuccessRate != null ? `${Math.round(faceit.entrySuccessRate * 100)}%` : '—' },
          { label: 'Util DMG/R', value: faceit.utilDmgPerRound?.toFixed(1) || '—' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '0.58rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</span>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.05,
              color: color || T.text,
              textShadow: color ? `0 0 14px ${color}55` : 'none',
            }}>{value}</span>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${T.border}` }}>
          <span style={{ fontSize: '0.6rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>Recent</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            {recent.map((r, i) => {
              const isWin = r === '1' || r === 1;
              return (
                <div key={i} style={{
                  width: '22px', height: '22px', borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.75rem', fontWeight: 800,
                  background: isWin ? `${T.good}22` : `${T.bad}22`,
                  border: `1px solid ${isWin ? T.good : T.bad}55`,
                  color: isWin ? T.good : T.bad,
                }}>{isWin ? 'W' : 'L'}</div>
              );
            })}
          </div>
          {faceit.bestMap && (
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: T.text2 }}>
              Best map: <span style={{ color: T.good, fontWeight: 700 }}>{faceit.bestMap.name}</span> ({faceit.bestMap.winRate}%)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function WeaponAffinity({ affinity }) {
  const items = [
    { label: 'Rifle', value: affinity.rifle, color: T.accent },
    { label: 'Sniper', value: affinity.sniper, color: T.accent2 },
    { label: 'Pistol', value: affinity.pistol, color: T.warn },
    { label: 'SMG', value: affinity.smg, color: T.good },
  ];
  return (
    <div
      className="fr-card fr-section"
      style={{
        background: T.surface,
        backdropFilter: 'blur(14px)',
        border: `1px solid ${T.border}`,
        borderRadius: '16px',
        padding: '22px 24px',
        animationDelay: '260ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '3px', height: '14px', background: `linear-gradient(180deg, ${T.accent}, ${T.accent2})`, borderRadius: '2px' }} />
        <span style={{
          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
          fontSize: '0.92rem', color: T.text,
          textTransform: 'uppercase', letterSpacing: '0.16em',
        }}>Weapon Affinity</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', color: T.text2, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.95rem', fontWeight: 700, color }}>{value}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${value}%`,
                background: `linear-gradient(90deg, ${color}88, ${color})`,
                boxShadow: `0 0 8px ${color}55`,
                animation: 'fr-growBar 900ms cubic-bezier(0.16, 1, 0.3, 1) both',
                transformOrigin: 'left center',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div
      className="fr-stat fr-card"
      style={{
        background: T.surface,
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: `1px solid ${T.border}`,
        borderTop: accent ? `2px solid ${accent}` : `1px solid ${T.border}`,
        padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: '6px',
        flex: '1 1 130px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40px',
        background: accent ? `radial-gradient(ellipse at top, ${accent}14 0%, transparent 70%)` : 'transparent',
        pointerEvents: 'none',
      }} />
      <span style={{ fontSize: '0.6rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'Inter, sans-serif', fontWeight: 600, position: 'relative' }}>{label}</span>
      <span
        className="fr-stat-val"
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '1.85rem', fontWeight: 700, lineHeight: 1.05,
          letterSpacing: '0.01em',
          color: T.text,
          background: accent ? `linear-gradient(120deg, ${T.text} 30%, ${accent} 50%, ${T.text} 70%)` : T.text,
          backgroundSize: '200% 100%',
          backgroundPosition: '0% 0',
          WebkitBackgroundClip: accent ? 'text' : 'unset',
          WebkitTextFillColor: accent ? 'transparent' : T.text,
          transition: 'background-position 800ms ease',
          position: 'relative',
        }}
      >{value}</span>
    </div>
  );
}

function parseSearchInput(raw) {
  const s = raw.trim();
  const profileMatch = s.match(/steamcommunity\.com\/profiles\/(\d{17})/);
  if (profileMatch) return { id: profileMatch[1], type: 'id' };
  const vanityMatch = s.match(/steamcommunity\.com\/id\/([^/\s?]+)/);
  if (vanityMatch) return { id: vanityMatch[1], type: 'vanity' };
  if (/^\d{17}$/.test(s)) return { id: s, type: 'id' };
  if (s.length > 0) return { id: s, type: 'vanity' };
  return null;
}

function StickySearch({ onSearch, onReset, tierColor }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseSearchInput(query);
    if (!parsed) return;
    onSearch(parsed.id, parsed.type);
    setQuery('');
  };

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(6, 6, 12, 0.78)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '10px 28px',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <button
          onClick={onReset}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '4px 8px',
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800,
            fontSize: '1.2rem', letterSpacing: '0.14em',
            color: T.text,
            textShadow: `0 0 18px ${tierColor}55`,
            flexShrink: 0,
          }}
          aria-label="Back to home"
        >FRAGGED</button>
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search another Steam ID, profile link, or custom URL..."
            style={{
              flex: 1, minWidth: 0,
              background: 'rgba(12, 12, 24, 0.7)',
              border: `1px solid ${focused ? T.borderStrong : T.border}`,
              borderRadius: '8px',
              color: T.text,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.86rem',
              padding: '8px 14px',
              outline: 'none',
              transition: 'border-color 200ms, box-shadow 200ms',
              boxShadow: focused ? `0 0 0 2px ${T.accent}22` : 'none',
            }}
          />
          <button
            type="submit"
            disabled={!query.trim()}
            style={{
              background: query.trim() ? `linear-gradient(135deg, ${T.accent} 0%, ${T.accent2} 100%)` : 'rgba(120,120,180,0.10)',
              color: query.trim() ? '#0a0a14' : T.textMuted,
              border: 'none', borderRadius: '8px',
              padding: '8px 18px',
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
              fontSize: '0.82rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: query.trim() ? 'pointer' : 'not-allowed',
              transition: 'transform 150ms, box-shadow 150ms',
              flexShrink: 0,
            }}
          >Search</button>
        </form>
      </div>
    </div>
  );
}

export default function Results({ player, onSearch, onReset }) {
  const { name, avatarUrl, level, stats, leetify: L, faceit, fragged, affinity, steamId, statsAvailable = true } = player;
  const { totalKills, totalDeaths, totalKillsHeadshot, matchesWon, matchesPlayed, hoursPlayed, shotsFired, shotsHit, favoriteWeapon, favoriteWeaponKills } = stats;

  const hasLeetify = L && L.aim != null;
  const premier = L?.premier ?? null;
  const tier = getRankTier(premier);
  const [goalTier, setGoalTier] = useState(tier);
  const [visibleMatches, setVisibleMatches] = useState(15);

  const kd = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : '∞';
  const hsPercent = totalKills > 0 ? Math.round((totalKillsHeadshot / totalKills) * 100) : 0;
  const accuracy = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0;
  const winRate = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;

  const openingDisplay = hasLeetify && L.opening != null ? L.opening * 100 : null;
  const clutchDisplay  = hasLeetify && L.clutch  != null ? L.clutch  * 100 : null;

  const ttdMs     = L?.reactionTime ?? null;
  const ttdFill   = ttdMs != null ? Math.min(100, Math.max(0, ((800 - ttdMs) / 500) * 100)) : 0;
  const preaimDeg = L?.preaim ?? null;
  const preaimFill = preaimDeg != null ? Math.min(100, Math.max(0, ((20 - preaimDeg) / 15) * 100)) : 0;

  const sectionTitle = (text, right) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '3px', height: '14px', background: `linear-gradient(180deg, ${T.accent}, ${T.accent2})`, borderRadius: '2px', boxShadow: `0 0 8px ${T.accent}` }} />
        <span style={{
          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
          fontSize: '0.92rem', color: T.text,
          textTransform: 'uppercase', letterSpacing: '0.16em',
        }}>{text}</span>
      </div>
      {right && <span style={{ fontSize: '0.66rem', color: tier.color, letterSpacing: '0.1em', fontWeight: 600, padding: '3px 10px', background: `${tier.color}14`, border: `1px solid ${tier.color}33`, borderRadius: '4px' }}>{right}</span>}
    </div>
  );

  const card = (children, extraStyle = {}, delayMs = 0) => (
    <div
      className="fr-card fr-section"
      style={{
        background: T.surface,
        backdropFilter: 'blur(14px)',
        border: `1px solid ${T.border}`,
        borderRadius: '16px',
        padding: '24px 26px',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delayMs}ms`,
        ...extraStyle,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${T.borderStrong}, transparent)`,
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        minHeight: '100vh',
        background: T.bg,
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, ${tier.color}15 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 100% 100%, ${T.accent}0a 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 0% 100%, ${T.accent2}08 0%, transparent 50%)
        `,
        color: T.text,
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(167, 139, 250, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167, 139, 250, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, black, transparent)',
          pointerEvents: 'none',
          animation: 'fr-gridShift 60s linear infinite',
        }} />

        {onSearch && <StickySearch onSearch={onSearch} onReset={onReset} tierColor={tier.color} />}

        {/* Header banner */}
        <div
          className="fr-section"
          style={{
            position: 'relative',
            borderBottom: `1px solid ${T.border}`,
            background: `linear-gradient(180deg, ${tier.color}10 0%, transparent 100%)`,
            animationDelay: '0ms',
          }}
        >
          <div style={{ height: '2px', background: `linear-gradient(90deg, transparent 20%, ${tier.color}, transparent 80%)`, boxShadow: `0 0 20px ${tier.color}` }} />
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 28px', display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
            {/* Avatar with rotating ring */}
            <div style={{ position: 'relative', flexShrink: 0, width: '92px', height: '92px' }}>
              <svg
                className="fr-avatar-ring"
                width="92" height="92" viewBox="0 0 92 92"
                style={{ position: 'absolute', inset: 0 }}
              >
                <circle cx="46" cy="46" r="44" fill="none"
                  stroke={tier.color} strokeWidth="1.5"
                  strokeDasharray="6 14" opacity="0.6"
                  style={{ filter: `drop-shadow(0 0 6px ${tier.color})` }}
                />
              </svg>
              <img src={avatarUrl} alt={name} style={{
                position: 'absolute', top: '6px', left: '6px',
                width: '80px', height: '80px', borderRadius: '50%',
                border: `2px solid ${tier.color}`,
                boxShadow: `0 0 30px ${tier.color}55, 0 6px 20px rgba(0,0,0,0.5)`,
                display: 'block', objectFit: 'cover',
              }} />
              <div style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                background: T.bg2, borderRadius: '6px',
                padding: '2px 7px',
                fontSize: '0.6rem', fontWeight: 800, color: T.text,
                letterSpacing: '0.08em', border: `1px solid ${tier.color}55`,
                fontFamily: 'Barlow Condensed, sans-serif',
                boxShadow: `0 0 10px ${tier.color}33`,
              }}>LV {level}</div>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '2.4rem', fontWeight: 800,
                letterSpacing: '0.02em', lineHeight: 1, color: T.text,
                textShadow: `0 0 24px ${tier.color}33`,
                animation: 'fr-fadeUp 800ms cubic-bezier(0.16,1,0.3,1) 100ms both',
              }}>{name}</div>
              <div style={{
                display: 'flex', gap: '18px', marginTop: '10px', flexWrap: 'wrap',
                animation: 'fr-fadeUp 800ms cubic-bezier(0.16,1,0.3,1) 200ms both',
              }}>
                {(statsAvailable
                  ? [
                      { v: `${hoursPlayed.toLocaleString()}h`, label: 'playtime' },
                      { v: matchesPlayed.toLocaleString(), label: 'matches' },
                      { v: `${winRate}%`, label: 'win rate' },
                    ]
                  : [
                      faceit ? { v: faceit.totalMatches?.toLocaleString() ?? '—', label: 'faceit matches' } : null,
                      faceit ? { v: faceit.winRate != null ? `${Math.round(faceit.winRate)}%` : '—', label: 'faceit win rate' } : null,
                      premier != null ? { v: premier.toLocaleString(), label: 'premier' } : null,
                    ].filter(Boolean)
                ).map(({ v, label }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1rem', color: T.text, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700 }}>{v}</span>
                    <span style={{ fontSize: '0.6rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {premier != null && <PremierMedal rating={premier} />}
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 28px 100px', display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>

          {/* Stat Cards (Steam-derived) */}
          {statsAvailable ? (
            <div className="fr-section" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animationDelay: '120ms' }}>
              <StatCard label="K/D Ratio"    value={kd}                             accent={T.accent} />
              <StatCard label="Headshot %"   value={`${hsPercent}%`}                accent="#ec4899" />
              <StatCard label="Accuracy"     value={`${accuracy}%`}                 accent={T.accent2} />
              <StatCard label="Fav Weapon"   value={favoriteWeapon}                 accent={tier.color} />
              <StatCard label="Weapon Kills" value={favoriteWeaponKills.toLocaleString()} accent={T.warn} />
              <StatCard label="Total Kills"  value={totalKills.toLocaleString()}    accent={T.good} />
            </div>
          ) : (
            <div
              className="fr-section"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 18px',
                background: 'linear-gradient(90deg, rgba(251,191,36,0.06) 0%, transparent 100%)',
                border: `1px solid rgba(251,191,36,0.20)`,
                borderRadius: '10px',
                animationDelay: '120ms',
                fontSize: '0.82rem', color: T.text2,
              }}
            >
              <span style={{ color: T.warn, fontSize: '1rem' }}>⚠</span>
              <span>
                <strong style={{ color: T.text }}>Steam game stats are not public</strong> for this player — their CS2
                Game Details privacy is set to friends-only or private. Showing
                {hasLeetify && faceit ? ' Leetify + Faceit' : hasLeetify ? ' Leetify' : faceit ? ' Faceit' : ''} data only.
              </span>
            </div>
          )}

          {/* Leetify attribution banner — appears immediately above Leetify-sourced data */}
          {hasLeetify && (
            <div
              className="fr-section"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '12px',
                padding: '10px 18px',
                background: `linear-gradient(90deg, ${LEETIFY_PINK}14 0%, transparent 100%)`,
                border: `1px solid ${LEETIFY_PINK}33`,
                borderRadius: '10px',
                animationDelay: '160ms',
              }}
            >
              <a
                href="https://leetify.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: T.text2, textDecoration: 'none',
                  fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={LEETIFY_PINK} style={{ flexShrink: 0 }}>
                  <path d="M3 3h4v14h10v4H3V3z" />
                </svg>
                <span>Data Provided by <span style={{ color: LEETIFY_PINK, fontWeight: 800 }}>Leetify</span></span>
              </a>
              <a
                href={`https://leetify.com/app/profile/${steamId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: LEETIFY_PINK, textDecoration: 'underline',
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                }}
              >
                View on Leetify →
              </a>
            </div>
          )}

          {/* Performance Bars */}
          {hasLeetify && card(<>
            {sectionTitle('Performance Overview', `${tier.label} benchmarks`)}
            <RatingBar label="AIM"           value={L.aim}         benchmark={tier.aim}         minVal={0}  maxVal={100} decimals={1} color={T.accent}  delay={0} />
            <RatingBar label="UTILITY"       value={L.utility}     benchmark={tier.utility}     minVal={0}  maxVal={100} decimals={1} color={T.ct}      delay={100} />
            <RatingBar label="POSITIONING"   value={L.positioning} benchmark={tier.positioning} minVal={0}  maxVal={100} decimals={1} color={T.accent2} delay={200} />
            <RatingBar label="OPENING DUELS" value={openingDisplay} benchmark={tier.opening}    minVal={-8} maxVal={8}   decimals={2} color={T.good}    delay={300} />
            <RatingBar label="CLUTCHING"     value={clutchDisplay}  benchmark={tier.clutch}     minVal={0}  maxVal={25}  decimals={2} color="#ec4899"   delay={400} />
          </>, {}, 200)}

          {/* Faceit card placed directly under Performance Overview */}
          {hasLeetify && faceit && <FaceitCard faceit={faceit} />}

          {/* Mini Circles + Triangle */}
          {hasLeetify && (
            <div className="fr-section" style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', animationDelay: '280ms' }}>
              {card(<>
                {sectionTitle('Key Stats')}
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                  <MiniCircle label="Headshot %" value={hsPercent} displayValue={`${hsPercent}%`} fill={hsPercent} good={50} bad={30} delay={0} />
                  <MiniCircle label="Time to Dmg" value={ttdMs} displayValue={ttdMs != null ? `${Math.round(ttdMs)}` : '—'} unit="ms" fill={ttdFill} delay={150} />
                  <MiniCircle label="Crosshair°" value={preaimDeg} displayValue={preaimDeg != null ? `${preaimDeg.toFixed(1)}°` : '—'} fill={preaimFill} delay={300} />
                </div>
              </>, { flex: '0 0 auto' })}

              {card(<>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '3px', height: '14px', background: `linear-gradient(180deg, ${T.accent}, ${T.accent2})`, borderRadius: '2px', boxShadow: `0 0 8px ${T.accent}` }} />
                    <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.92rem', color: T.text, textTransform: 'uppercase', letterSpacing: '0.16em' }}>Performance</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', boxShadow: '0 0 8px #ec4899' }} />
                      <span style={{ fontSize: '0.66rem', color: T.text2, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>YOU</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
                      <span style={{ fontSize: '0.66rem', color: T.text2, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>GOAL</span>
                    </div>
                    <TierSelector activeTier={goalTier} onChange={setGoalTier} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <TriangleChart aim={L.aim} utility={L.utility} positioning={L.positioning} goalTier={goalTier} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px', marginTop: '12px', paddingTop: '14px', borderTop: `1px solid ${T.border}` }}>
                  {[
                    { label: 'Aim', you: L.aim, goal: goalTier.aim },
                    { label: 'Utility', you: L.utility, goal: goalTier.utility },
                    { label: 'Positioning', you: L.positioning, goal: goalTier.positioning },
                  ].map(({ label, you, goal }) => {
                    const diff = (you ?? 0) - goal;
                    const positive = diff >= 0;
                    return (
                      <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '0.58rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '4px', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: positive ? T.good : T.bad, letterSpacing: '0.02em' }}>
                          {positive ? '+' : ''}{diff.toFixed(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>, { flex: 1, minWidth: '320px' })}
            </div>
          )}

          {/* CT / T Ratings */}
          {hasLeetify && (L.ctRating != null || L.tRating != null) && (
            <div className="fr-section" style={{ display: 'flex', gap: '14px', animationDelay: '360ms' }}>
              {[
                { label: 'CT Side Rating', value: L.ctRating, color: T.ct, side: 'CT' },
                { label: 'T Side Rating',  value: L.tRating,  color: T.tSide, side: 'T' },
              ].filter(x => x.value != null).map(({ label, value, color, side }) =>
                <div
                  key={side}
                  className="fr-card"
                  style={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${color}10 0%, ${T.bg2}cc 100%)`,
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${T.border}`,
                    borderTop: `2px solid ${color}66`,
                    borderRadius: '14px',
                    padding: '22px 26px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0, fontSize: '4.5rem',
                    fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800,
                    color: `${color}10`, lineHeight: 1, padding: '4px 16px',
                    pointerEvents: 'none',
                  }}>{side}</div>
                  <div style={{ fontSize: '0.62rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>{label}</div>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif', fontSize: '2.4rem', fontWeight: 800,
                    color, lineHeight: 1, letterSpacing: '0.02em',
                    textShadow: `0 0 30px ${color}55`,
                  }}>{(value * 100).toFixed(1)}</div>
                </div>
              )}
            </div>
          )}

          {/* Opening Duels + Trades */}
          {hasLeetify && (L.ctOpeningAggression != null || L.tradeKillsSuccess != null) && (
            <div className="fr-section" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', animationDelay: '440ms' }}>
              {L.ctOpeningAggression != null && card(<>
                {sectionTitle('Opening Duels')}
                <SideCompare label="Aggression Success" ct={L.ctOpeningAggression} t={L.tOpeningAggression} good={45} bad={28} />
                <SideCompare label="Duel Win Rate" ct={L.ctOpeningDuel} t={L.tOpeningDuel} good={52} bad={38} />
              </>, { flex: 1, minWidth: '260px' })}

              {L.tradeKillsSuccess != null && card(<>
                {sectionTitle('Trades')}
                <StatRow label="Trade Kills Success" value={L.tradeKillsSuccess} suffix="%" good={55} bad={40} delay={0} />
                <StatRow label="Trade Deaths Success" value={L.tradedDeathsSuccess} suffix="%" good={55} bad={40} delay={100} />
                <StatRow label="Kill Opportunities / Round" value={L.tradeKillOpps} suffix="" decimals={2} good={0.35} bad={0.20} barMax={0.6} delay={200} />
              </>, { flex: 1, minWidth: '260px' })}
            </div>
          )}

          {/* Grenades & Utility */}
          {hasLeetify && (L.flashHitFoePerFlash != null || L.heFoesDmg != null) && card(<>
            {sectionTitle('Grenades & Utility')}
            <div style={{ display: 'flex', gap: '44px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ fontSize: '0.62rem', color: T.accent, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '6px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700 }}>Flashbangs</div>
                <StatRow label="Thrown / Match" value={L.flashThrown} suffix="" decimals={1} good={10} bad={4} barMax={20} delay={0} />
                <StatRow label="Enemies Flashed / Flash" value={L.flashHitFoePerFlash} suffix="" decimals={2} good={0.8} bad={0.3} barMax={1.5} delay={80} />
                <StatRow label="Avg Flash Duration" value={L.flashHitFoeDuration} suffix="s" decimals={2} good={2.0} bad={1.0} barMax={3.5} delay={160} />
                <StatRow label="Teammates Flashed / Flash" value={L.flashHitFriendPerFlash} suffix="" decimals={2} good={0.1} bad={0.3} invert={true} barMax={0.8} delay={240} />
                <StatRow label="Flash → Kill %" value={L.flashLeadToKill} suffix="%" decimals={1} good={15} bad={5} delay={320} />
              </div>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ fontSize: '0.62rem', color: T.accent2, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '6px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700 }}>HE Grenades & Aim</div>
                <StatRow label="HE Avg Dmg (Enemies)" value={L.heFoesDmg} suffix="" decimals={1} good={10} bad={4} barMax={25} delay={0} />
                <StatRow label="HE Avg Dmg (Friendlies)" value={L.heFriendsDmg} suffix="" decimals={2} good={0.5} bad={2} invert={true} barMax={5} delay={80} />
                <StatRow label="Counter-Strafing" value={L.counterStrafing} suffix="%" decimals={1} good={65} bad={45} delay={160} />
                <StatRow label="Utility on Death" value={L.utilityOnDeath} suffix="$" decimals={0} good={100} bad={250} invert={true} barMax={500} delay={240} />
              </div>
            </div>
          </>, {}, 520)}

          {/* Premier by Season */}
          {hasLeetify && L.recentMatches?.length > 0 && card(<>
            {sectionTitle('Premier by Season')}
            <PremierSeasons matches={L.recentMatches} />
          </>, {}, 580)}

          {/* Match History */}
          {hasLeetify && L.recentMatches?.length > 0 && card(<>
            {sectionTitle('Recent Matches', `${Math.min(visibleMatches, L.recentMatches.length)} / ${L.recentMatches.length}`)}
            <MatchHistory matches={L.recentMatches} visible={visibleMatches} onLoadMore={() => setVisibleMatches(v => Math.min(v + 15, L.recentMatches.length))} />
          </>, {}, 600)}

          {/* FRAGGED Aim — only when there is no Leetify rating (otherwise redundant) */}
          {!hasLeetify && fragged && (
            <FraggedAimCard aim={fragged.aim} confidence={fragged.confidence} />
          )}

          {/* Faceit card for non-Leetify users (Leetify users see it under Performance Overview above) */}
          {!hasLeetify && faceit && <FaceitCard faceit={faceit} />}

          {/* Weapon Affinity — universal Steam-derived enrichment */}
          {affinity && <WeaponAffinity affinity={affinity} />}

          {!hasLeetify && !faceit && card(
            <div style={{ textAlign: 'center', color: T.textMuted, fontSize: '0.85rem', padding: '14px 0', lineHeight: 1.5 }}>
              No Leetify or Faceit data for this player.<br />
              <a href="https://leetify.com/" target="_blank" rel="noopener noreferrer" style={{ color: LEETIFY_PINK, fontWeight: 700, textDecoration: 'underline' }}>
                Sign up for Leetify
              </a>
              {' '}to get aim, utility, and positioning ratings.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
