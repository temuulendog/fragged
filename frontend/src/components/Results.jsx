import { useMemo } from 'react';

const RANK_TIERS = [
  { min: 25000, label: '25K+', color: '#e05252', aim: 82, utility: 62, positioning: 57, opening: 0.77,  clutch: 10.93 },
  { min: 20000, label: '20K+', color: '#ff10d7', aim: 73, utility: 59, positioning: 54, opening: 0.45,  clutch: 11.50 },
  { min: 15000, label: '15K+', color: '#8b5cf6', aim: 64, utility: 56, positioning: 51, opening: 0.20,  clutch: 10.80 },
  { min: 10000, label: '10K+', color: '#3b82f6', aim: 57, utility: 52, positioning: 48, opening: -0.50, clutch:  9.50 },
  { min:  5000, label:  '5K+', color: '#87b3fa', aim: 51, utility: 49, positioning: 46, opening: -1.50, clutch:  8.00 },
  { min:     1, label:  '1K+', color: '#94a3b8', aim: 45, utility: 46, positioning: 44, opening: -3.00, clutch:  6.50 },
];

function getRankTier(premier) {
  if (!premier) return RANK_TIERS[RANK_TIERS.length - 1];
  return RANK_TIERS.find(t => premier >= t.min) || RANK_TIERS[RANK_TIERS.length - 1];
}

function premierColor(rating) {
  if (!rating) return '#94a3b8';
  if (rating >= 25000) return '#e05252';
  if (rating >= 20000) return '#ff10d7';
  if (rating >= 15000) return '#8b5cf6';
  if (rating >= 10000) return '#3b82f6';
  if (rating >= 5000)  return '#87b3fa';
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      {/* Badge */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#0f1a13',
        border: `1px solid ${color}55`,
        borderRadius: '6px',
        padding: '10px 18px 10px 10px',
        gap: '10px',
        boxShadow: `0 0 18px ${color}22, inset 0 0 12px rgba(0,0,0,0.4)`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* subtle background glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, ${color}0f 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        {/* Vertical stripe lines (Leetify style) */}
        <svg width="17" height="40" viewBox="0 0 17 40" style={{ flexShrink: 0 }}>
          <path d="M2.5 2.5 L6 2.5 L3.5 37.5 L0 37.5 Z" fill={color} opacity="0.9" />
          <path d="M8.5 2.5 L12 2.5 L9.5 37.5 L6 37.5 Z" fill={color} opacity="0.6" />
        </svg>
        {/* Number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px', position: 'relative' }}>
          <span style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '2.2rem', fontWeight: 800,
            color, letterSpacing: '0.02em', lineHeight: 1,
          }}>{large}</span>
          <span style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '1.4rem', fontWeight: 700,
            color, letterSpacing: '0.02em', lineHeight: 1,
          }}>{small}</span>
        </div>
      </div>
      {/* Tier label */}
      <div style={{
        fontSize: '0.65rem', color: '#6b7f6e',
        textTransform: 'uppercase', letterSpacing: '0.12em',
      }}>
        {tier.label} Premier
      </div>
    </div>
  );
}

function RatingBar({ label, value, benchmark, minVal = 0, maxVal = 100, decimals = 0, color = '#d4834a' }) {
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
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.72rem', color: '#6b7f6e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
          {benchPct != null && (
            <span style={{ fontSize: '0.68rem', color: '#4a6350' }}>avg {fmt(benchmark)}</span>
          )}
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color, fontFamily: 'Barlow Condensed, sans-serif' }}>
            {fmt(value)}
          </span>
        </div>
      </div>
      <div style={{ position: 'relative', height: '8px', background: '#162a1c', borderRadius: '4px' }}>
        <div style={{
          height: '100%', borderRadius: '3px',
          width: `${barPct}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: 'width 0.8s ease',
        }} />
        {benchPct != null && (
          <div style={{
            position: 'absolute', top: '-3px', bottom: '-3px',
            left: `${benchPct}%`,
            width: '2px', background: '#f5f0e8', borderRadius: '1px',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 4px rgba(245,240,232,0.6)',
          }} />
        )}
      </div>
    </div>
  );
}

function MiniCircle({ label, value, displayValue, fill, unit = '', good, bad, invert = false }) {
  const SIZE = 88, cx = 44, cy = 48, R = 34, sw = 7;
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

  let valueColor = '#d4834a';
  if (good != null && bad != null) {
    valueColor = invert
      ? (value <= good ? '#4ade80' : value >= bad ? '#ef4444' : '#d4834a')
      : (value >= good ? '#4ade80' : value <= bad ? '#ef4444' : '#d4834a');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <path d={trackPath} fill="none" stroke="#1a2f20" strokeWidth={sw} strokeLinecap="round" />
        <path
          d={trackPath} fill="none" stroke={valueColor} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${dash} ${arcLength}`}
        />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#f5f0e8"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          {displayValue ?? '—'}
        </text>
        {unit && <text x={cx} y={cy + 17} textAnchor="middle" fontSize="7" fill="#6b7f6e">{unit}</text>}
      </svg>
      <span style={{ fontSize: '0.6rem', color: '#6b7f6e', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

function TriangleChart({ aim, utility, positioning, tier }) {
  const W = 200, H = 200, cx = W / 2, cy = H / 2 + 10, maxR = 72;

  const axes = [
    { label: 'AIM',         angle: -90, value: aim,         bench: tier.aim },
    { label: 'POSITIONING', angle:  30, value: positioning,  bench: tier.positioning },
    { label: 'UTILITY',     angle: 150, value: utility,      bench: tier.utility },
  ];

  const toPoint = (angle, r) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const pts = (arr) => arr.map(p => `${p.x},${p.y}`).join(' ');
  const playerPts = axes.map(a => toPoint(a.angle, (a.value / 100) * maxR));
  const benchPts  = axes.map(a => toPoint(a.angle, (a.bench / 100) * maxR));

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {[0.25, 0.5, 0.75, 1.0].map(r => (
        <polygon key={r} points={pts(axes.map(a => toPoint(a.angle, r * maxR)))} fill="none" stroke="#1e3528" strokeWidth="1" />
      ))}
      {axes.map((a, i) => {
        const outer = toPoint(a.angle, maxR);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#1e3528" strokeWidth="1" />;
      })}
      <polygon points={pts(benchPts)} fill={`${tier.color}22`} stroke={tier.color} strokeWidth="1.5" strokeDasharray="4 3" />
      <polygon points={pts(playerPts)} fill="#d4834a33" stroke="#d4834a" strokeWidth="2" />
      {playerPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#d4834a" />)}
      {axes.map((a, i) => {
        const lp = toPoint(a.angle, maxR + 14);
        return (
          <text key={i} x={lp.x} y={lp.y + 4} textAnchor="middle" fontSize="8" fill="#6b7f6e"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

function RankLegend({ activeTier }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
      {RANK_TIERS.map(t => (
        <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: t.label === activeTier.label ? 1 : 0.4 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
          <span style={{ fontSize: '0.65rem', color: t.label === activeTier.label ? '#f5f0e8' : '#6b7f6e', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>
            {t.label}
          </span>
          {t.label === activeTier.label && <span style={{ fontSize: '0.55rem', color: t.color }}>YOU</span>}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
        <div style={{ width: '18px', height: '2px', background: '#d4834a', flexShrink: 0 }} />
        <span style={{ fontSize: '0.6rem', color: '#d4834a' }}>Player</span>
      </div>
    </div>
  );
}

function MatchHistory({ matches }) {
  if (!matches?.length) return null;

  const mapName = (m) => (m?.map_name || m?.map || '—').replace('de_', '').replace(/^\w/, c => c.toUpperCase());

  const score = (m) => {
    const s = m.score;
    if (Array.isArray(s)) return `${s[0]} : ${s[1]}`;
    return '— : —';
  };

  const result = (m) => {
    if (m.outcome === 'win')  return { label: 'W', color: '#4ade80' };
    if (m.outcome === 'loss') return { label: 'L', color: '#ef4444' };
    return { label: 'D', color: '#94a3b8' };
  };

  const fmtDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const ttdColor = (ms) => {
    if (ms == null) return '#6b7f6e';
    if (ms < 400) return '#4ade80';
    if (ms < 600) return '#d4834a';
    return '#ef4444';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #1e3528' }}>
            {['MAP', 'MODE', 'SCORE', 'RES', 'RATING ±', 'TTD', 'HS%', 'ACC', 'DATE'].map(h => (
              <th key={h} style={{ padding: '8px 10px', color: '#6b8f72', fontWeight: 600, textAlign: h === 'MAP' ? 'left' : 'center', letterSpacing: '0.08em', fontSize: '0.65rem', fontFamily: 'Barlow Condensed, sans-serif' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matches.map((m, i) => {
            const r = result(m);
            const rc = (i < matches.length - 1 && m.rank_type === 11 && matches[i].rank > 0 && matches[i + 1].rank > 0)
              ? matches[i].rank - matches[i + 1].rank : null;
            const ttd = m.reaction_time_ms;

            return (
              <tr key={i} style={{ borderBottom: '1px solid #0f1f14' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a2f2088'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '7px 8px', color: '#a0b4a4', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>{mapName(m)}</td>
                <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
                    padding: '2px 6px', borderRadius: '3px',
                    background: m.rank_type === 11 ? 'rgba(245,200,66,0.12)' : 'rgba(59,130,246,0.12)',
                    color: m.rank_type === 11 ? '#f5c842' : '#60a5fa',
                  }}>
                    {m.rank_type === 11 ? 'PREMIER' : 'COMP'}
                  </span>
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#f5f0e8' }}>{score(m)}</td>
                <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                  <span style={{ color: result(m).color, fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif' }}>{result(m).label}</span>
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                  {rc != null
                    ? <span style={{ color: rc >= 0 ? '#4ade80' : '#ef4444', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>{rc >= 0 ? '+' : ''}{rc}</span>
                    : <span style={{ color: '#4a6350' }}>—</span>}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: ttdColor(ttd), fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {ttd != null ? `${Math.round(ttd)}ms` : '—'}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#a0b4a4' }}>
                  {m.accuracy_head != null ? `${Math.round(m.accuracy_head)}%` : '—'}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#6b7f6e' }}>
                  {m.accuracy_enemy_spotted != null ? `${m.accuracy_enemy_spotted.toFixed(1)}%` : '—'}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#4a6350' }}>{fmtDate(m.finished_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: '#0f1a13', borderRadius: '10px',
      border: '1px solid #1a2f20',
      borderTop: accent ? `2px solid ${accent}` : '1px solid #1a2f20',
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '4px',
      flex: '1 1 120px',
    }}>
      <span style={{ fontSize: '0.6rem', color: '#4a6350', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif' }}>{label}</span>
      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#f5f0e8', lineHeight: 1.1 }}>{value}</span>
    </div>
  );
}

export default function Results({ player }) {
  const { name, avatarUrl, level, stats, leetify: L } = player;
  const { totalKills, totalDeaths, totalKillsHeadshot, matchesWon, matchesPlayed, hoursPlayed, shotsFired, shotsHit, favoriteWeapon, favoriteWeaponKills } = stats;

  const hasLeetify = L && L.aim != null;
  const premier = L?.premier ?? null;
  const tier = getRankTier(premier);

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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
      <span style={{
        fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
        fontSize: '0.85rem', color: '#a0b4a4',
        textTransform: 'uppercase', letterSpacing: '0.12em',
      }}>{text}</span>
      {right && <span style={{ fontSize: '0.68rem', color: tier.color, letterSpacing: '0.08em' }}>{right}</span>}
    </div>
  );

  const card = (children, extraStyle = {}) => (
    <div style={{
      background: 'linear-gradient(145deg, #0f1a13 0%, #0a1610 100%)',
      border: '1px solid #1e3528',
      borderRadius: '14px',
      padding: '22px 24px',
      ...extraStyle,
    }}>{children}</div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0d1f17', color: '#f5f0e8', fontFamily: 'Inter, sans-serif' }}>

      {/* Header banner */}
      <div style={{
        borderBottom: `1px solid ${tier.color}33`,
        background: `linear-gradient(180deg, ${tier.color}08 0%, transparent 100%)`,
      }}>
        {/* Thin tier color line at very top */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }} />
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={avatarUrl} alt={name} style={{
              width: '60px', height: '60px', borderRadius: '8px',
              border: `2px solid ${tier.color}88`,
              display: 'block',
            }} />
            <div style={{
              position: 'absolute', bottom: '-4px', right: '-4px',
              background: '#0d1f17', borderRadius: '4px',
              padding: '1px 5px',
              fontSize: '0.55rem', fontWeight: 700, color: '#6b7f6e',
              letterSpacing: '0.05em', border: '1px solid #1e3528',
            }}>LV {level}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '1.8rem', fontWeight: 800,
              letterSpacing: '0.04em', lineHeight: 1, color: '#f5f0e8',
            }}>{name}</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '5px' }}>
              {[
                { v: `${hoursPlayed.toLocaleString()} hrs`, label: 'playtime' },
                { v: matchesPlayed.toLocaleString(), label: 'matches' },
                { v: `${winRate}% wr`, label: null },
              ].map(({ v, label }) => (
                <span key={v} style={{ fontSize: '0.72rem', color: '#4a6350' }}>
                  {v}
                </span>
              ))}
            </div>
          </div>
          {premier != null && <PremierMedal rating={premier} />}
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 24px 80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <StatCard label="K/D Ratio"    value={kd}                             accent="#d4834a" />
          <StatCard label="Headshot %"   value={`${hsPercent}%`}                accent="#f472b6" />
          <StatCard label="Accuracy"     value={`${accuracy}%`}                 />
          <StatCard label="Fav Weapon"   value={favoriteWeapon}                 accent={tier.color} />
          <StatCard label="Weapon Kills" value={favoriteWeaponKills.toLocaleString()} />
          <StatCard label="Total Kills"  value={totalKills.toLocaleString()}    />
        </div>

        {/* Performance Bars */}
        {hasLeetify && card(<>
          {sectionTitle('Performance Overview', `${tier.label} benchmarks`)}
          <RatingBar label="AIM"           value={L.aim}         benchmark={tier.aim}         minVal={0}  maxVal={100} decimals={1} color="#d4834a" />
          <RatingBar label="UTILITY"       value={L.utility}     benchmark={tier.utility}     minVal={0}  maxVal={100} decimals={1} color="#60a5fa" />
          <RatingBar label="POSITIONING"   value={L.positioning} benchmark={tier.positioning} minVal={0}  maxVal={100} decimals={1} color="#a78bfa" />
          <RatingBar label="OPENING DUELS" value={openingDisplay} benchmark={tier.opening}    minVal={-8} maxVal={8}   decimals={2} color="#4ade80" />
          <RatingBar label="CLUTCHING"     value={clutchDisplay}  benchmark={tier.clutch}     minVal={0}  maxVal={25}  decimals={2} color="#f472b6" />
        </>)}

        {/* Mini Circles + Triangle */}
        {hasLeetify && (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {card(<>
              {sectionTitle('Key Stats')}
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <MiniCircle label="Headshot %" value={hsPercent} displayValue={`${hsPercent}%`} fill={hsPercent} good={50} bad={30} />
                <MiniCircle label="Time to Dmg" value={ttdMs} displayValue={ttdMs != null ? `${Math.round(ttdMs)}` : '—'} unit="ms" fill={ttdFill} />
                <MiniCircle label="Crosshair°" value={preaimDeg} displayValue={preaimDeg != null ? `${preaimDeg.toFixed(1)}°` : '—'} fill={preaimFill} />
              </div>
            </>, { flex: '0 0 auto' })}

            {card(<>
              {sectionTitle('Performance Profile')}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <TriangleChart aim={L.aim} utility={L.utility} positioning={L.positioning} tier={tier} />
                <RankLegend activeTier={tier} />
              </div>
            </>, { flex: 1, minWidth: '260px' })}
          </div>
        )}

        {/* CT / T Ratings */}
        {hasLeetify && (L.ctRating != null || L.tRating != null) && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'CT Side Rating', value: L.ctRating, color: '#60a5fa' },
              { label: 'T Side Rating',  value: L.tRating,  color: '#f59e0b' },
            ].filter(x => x.value != null).map(({ label, value, color }) =>
              card(
                <>
                  <div style={{ fontSize: '0.62rem', color: '#4a6350', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', fontFamily: 'Barlow Condensed, sans-serif' }}>{label}</div>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{(value * 100).toFixed(1)}</div>
                </>,
                { flex: 1, borderTop: `2px solid ${color}55` }
              )
            )}
          </div>
        )}

        {/* Match History */}
        {hasLeetify && L.recentMatches?.length > 0 && card(<>
          {sectionTitle('Recent Matches')}
          <MatchHistory matches={L.recentMatches} />
        </>)}

        {!hasLeetify && card(
          <div style={{ textAlign: 'center', color: '#4a6350', fontSize: '0.85rem', padding: '12px 0' }}>
            Leetify data unavailable — player may not be on Leetify.
          </div>
        )}
      </div>
    </div>
  );
}
