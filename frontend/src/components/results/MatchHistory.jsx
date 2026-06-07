import { T } from '../../theme';

// Editorial match table. Columns use only fields the API actually returns per match
// (no per-match K/D exists, so we show TTD + HS%). Adds the Mode column (Premier/Competitive).
export default function MatchHistory({ matches, visible, onLoadMore }) {
  if (!matches?.length) return null;
  const shown = matches.slice(0, visible);

  const mapName = (m) => (m?.map_name || m?.map || '—').replace('de_', '').replace(/^\w/, c => c.toUpperCase());
  const score = (m) => (Array.isArray(m.score) ? `${m.score[0]} — ${m.score[1]}` : '—');
  const fmtDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: '2-digit' });
  };
  const result = (m) => {
    if (m.outcome === 'win') return { label: 'WIN', color: T.win };
    if (m.outcome === 'loss') return { label: 'LOSS', color: T.loss };
    return { label: 'DRAW', color: T.mut };
  };

  const th = { fontFamily: T.mono, fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: T.mut, textAlign: 'left', padding: '10px 12px', borderTop: `1px solid ${T.line}`, fontWeight: 400 };
  const td = { padding: '11px 12px', fontSize: 12, borderTop: `1px solid ${T.line2}`, fontVariantNumeric: 'tabular-nums' };

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Map', 'Mode', 'Result', 'Score', 'TTD', 'HS%', 'Rank ±', 'Date'].map((h, i) => (
                <th key={h} style={{ ...th, textAlign: i >= 6 ? 'right' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((m, i) => {
              const r = result(m);
              // Delta vs the previous PREMIER match (rank>0) further down the array.
              // Comp matches reuse `rank` for per-map ranks (1-15), so only diff Premier-to-Premier.
              let rc = null;
              if (m.rank_type === 11 && m.rank > 0) {
                for (let j = i + 1; j < matches.length; j++) {
                  const prev = matches[j];
                  if (prev.rank_type === 11 && prev.rank > 0) { rc = m.rank - prev.rank; break; }
                }
              }
              const isPremier = m.rank_type === 11;
              return (
                <tr key={i} className="fr-rowh">
                  <td style={{ ...td, fontWeight: 600 }}>{mapName(m)}</td>
                  <td style={td}>
                    <span className="mono" style={{
                      fontSize: 8, padding: '2px 7px',
                      border: `1px solid ${isPremier ? 'rgba(255,90,31,.5)' : T.line}`,
                      color: isPremier ? T.acc : T.mut,
                    }}>{isPremier ? 'Premier' : 'Competitive'}</span>
                  </td>
                  <td style={{ ...td }}><span style={{ fontWeight: 800, fontSize: 10, color: r.color }}>{r.label}</span></td>
                  <td style={td}>{score(m)}</td>
                  <td style={td}>{m.reaction_time_ms != null ? `${Math.round(m.reaction_time_ms)}ms` : '—'}</td>
                  <td style={td}>{m.accuracy_head != null ? `${Math.round(m.accuracy_head)}%` : '—'}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    {isPremier && m.rank > 0 ? (
                      <span>
                        {m.rank.toLocaleString()}{' '}
                        {rc != null
                          ? <span style={{ color: rc >= 0 ? T.win : T.loss }}>{rc >= 0 ? '+' : '−'}{Math.abs(rc)}</span>
                          : <span style={{ color: T.dim }}>—</span>}
                      </span>
                    ) : <span style={{ color: T.dim }}>—</span>}
                  </td>
                  <td style={{ ...td, textAlign: 'right', fontFamily: T.mono, fontSize: 10, color: T.mut }}>{fmtDate(m.finished_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {visible < matches.length && (
        <div
          onClick={onLoadMore}
          className="fr-rowh"
          style={{ textAlign: 'center', padding: 13, borderTop: `1px solid ${T.line}`, fontFamily: T.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: T.mut, cursor: 'pointer' }}
        >
          Load more matches <span style={{ color: T.dim }}>({matches.length - visible})</span>
        </div>
      )}
    </div>
  );
}
