import { T } from '../../theme';
import PremierBadge from './PremierBadge';

// Premier-season history (from csstats.gg), bare — no box, no row lines. RANK
// (end-of-season) and BEST (peak) labels once at the top; tight rows of
// S# · rank · best, current season on top. seasons: [{ season, end, peak }].
const H = 21;
const BW = Math.round((H * 178) / 64); // badge width — fixes the rank/best columns

export default function PremierSeasons({ seasons }) {
  if (!seasons?.length) return null;

  const ordered = [...seasons].sort((a, b) => b.season - a.season);
  const lbl = { fontSize: 7, color: T.mut, letterSpacing: '.1em', textAlign: 'center', width: BW, flex: 'none' };
  const cell = { width: BW, flex: 'none', display: 'flex', justifyContent: 'center' };
  const dash = <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 13, color: T.dim }}>—</span>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
        <span style={{ width: 18, flex: 'none' }} />
        <span className="mono" style={lbl}>RANK</span>
        <span className="mono" style={lbl}>BEST</span>
      </div>
      {ordered.map((s) => (
        <div key={s.season} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '1px 0' }}>
          <span className="mono" style={{ width: 18, flex: 'none', fontSize: 10, fontWeight: 700, color: T.fg }}>S{s.season}</span>
          <span style={cell}>{s.end != null ? <PremierBadge premier={s.end} height={H} /> : dash}</span>
          <span style={cell}>{s.peak != null ? <PremierBadge premier={s.peak} height={H} /> : dash}</span>
        </div>
      ))}
    </div>
  );
}
