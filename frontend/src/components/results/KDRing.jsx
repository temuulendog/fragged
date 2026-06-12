import { T } from '../../theme';

// csstats-style circular K/D gauge: a full ring split green (achieved) / red (deficit),
// big tabular number in the middle. Green/red is the one sanctioned use of the
// win/loss palette in the v2.0.0 rules.
//
// Scale: K/D is mapped onto 0..2 (1.0 = neutral, sits at the halfway mark),
// so a 1.00 reads as a half-green ring and climbs from there.
export default function KDRing({ kd, label = 'K/D', sub, size = 132 }) {
  const value = Number(kd) || 0;
  const frac = Math.min(1, Math.max(0.02, value / 2));   // green fraction of the ring
  const r = 40;
  const C = 2 * Math.PI * r;
  const green = frac * C;
  const red = C - green;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {label && <div className="mono" style={{ fontSize: 9, color: T.mut, alignSelf: 'flex-start', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <g transform="rotate(-90 50 50)" fill="none" strokeWidth="6" strokeLinecap="butt">
            {/* green = achieved */}
            <circle cx="50" cy="50" r={r} stroke={T.win} strokeDasharray={`${green} ${C}`} />
            {/* red = remainder, drawn starting where green ends */}
            <circle cx="50" cy="50" r={r} stroke={T.loss} strokeDasharray={`${red} ${C}`} strokeDashoffset={-green} />
          </g>
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: size * 0.26, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {value.toFixed(2)}
          </span>
          {sub && <span className="mono" style={{ fontSize: 8, color: T.mut, marginTop: 4 }}>{sub}</span>}
        </div>
      </div>
    </div>
  );
}
