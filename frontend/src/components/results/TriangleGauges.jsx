import { T, RANK_TIERS } from '../../theme';
import { SectionLabel, MiniArc } from '../ui';

// Left: you-vs-goal triangle (flat, no glow) + tier pills.
// Right: three clean half-arc gauges (HS accuracy / time-to-damage / crosshair placement).
export default function TriangleGauges({ L, hsPercent, ttdMs, preaimDeg, goalTier, setGoalTier }) {
  const cx = 110, cy = 92, maxR = 66;
  const axes = [{ a: -90, k: 'aim' }, { a: 30, k: 'utility' }, { a: 150, k: 'positioning' }];
  const pt = (angle, frac) => {
    const r = maxR * Math.max(0, Math.min(1, frac));
    const rad = (angle * Math.PI) / 180;
    return `${(cx + r * Math.cos(rad)).toFixed(1)},${(cy + r * Math.sin(rad)).toFixed(1)}`;
  };
  const lp = (angle, r) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const youPts = axes.map(ax => pt(ax.a, (L[ax.k] ?? 0) / 100)).join(' ');
  const goalPts = axes.map(ax => pt(ax.a, (goalTier[ax.k] ?? 0) / 100)).join(' ');
  const gridPts = axes.map(ax => pt(ax.a, 1)).join(' ');
  const labels = [
    { ...lp(-90, maxR + 14), t: 'AIM', anchor: 'middle' },
    { ...lp(30, maxR + 18), t: 'UTILITY', anchor: 'start' },
    { ...lp(150, maxR + 18), t: 'POSITION', anchor: 'end' },
  ];

  const pills = RANK_TIERS.filter(t => t.min >= 10000).slice().reverse();

  return (
    <div className="fr-sec">
      <SectionLabel>Breakdown</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', borderTop: `1px solid ${T.line}` }}>
        {/* triangle + tier pills */}
        <div style={{ padding: '18px 22px', borderRight: `1px solid ${T.line}` }}>
          <div className="mono" style={{ fontSize: 9, color: T.mut, marginBottom: 6 }}>You vs goal</div>
          <svg viewBox="0 0 220 175" width="100%" height="150">
            <polygon points={gridPts} fill="none" stroke="rgba(240,238,233,.12)" />
            <polygon points={goalPts} fill="none" stroke="rgba(240,238,233,.32)" strokeDasharray="3 3" />
            <polygon points={youPts} fill="rgba(255,90,31,.18)" stroke={T.acc} strokeWidth="1.5" />
            {labels.map((l, i) => (
              <text key={i} x={l.x} y={l.y + 3} fill="rgba(240,238,233,.55)" fontSize="8" fontFamily="Space Mono" textAnchor={l.anchor}>{l.t}</text>
            ))}
          </svg>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 8, color: T.mut, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 9, height: 9, background: T.acc, display: 'inline-block' }} /> You
            </span>
            <span className="mono" style={{ fontSize: 8, color: T.mut, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 9, borderTop: `1px dashed ${T.mut}`, display: 'inline-block' }} /> Goal
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {pills.map(t => {
              const on = t.label === goalTier.label;
              return (
                <button
                  key={t.label}
                  onClick={() => setGoalTier(t)}
                  className="mono"
                  style={{
                    fontSize: 8, padding: '4px 7px', cursor: 'pointer',
                    border: `1px solid ${on ? T.acc : T.line}`,
                    background: on ? T.acc : 'transparent',
                    color: on ? T.ink : T.mut,
                    fontWeight: on ? 700 : 400, letterSpacing: '.08em',
                  }}
                >{t.label.replace('+', '')}</button>
              );
            })}
          </div>
        </div>

        {/* gauges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <MiniArc label="Headshot Accuracy" value={`${hsPercent}%`} fill={hsPercent} accent />
          <MiniArc label="Time to Damage" value={ttdMs != null ? `${Math.round(ttdMs)}ms` : '—'} fill={ttdMs != null ? ((800 - ttdMs) / 500) * 100 : 0} />
          <MiniArc label="Crosshair Placement" value={preaimDeg != null ? `${preaimDeg.toFixed(1)}°` : '—'} fill={preaimDeg != null ? ((20 - preaimDeg) / 15) * 100 : 0} noRight />
        </div>
      </div>
    </div>
  );
}
