import { T } from '../../theme';

// Slim Faceit block — level + Elo + link. Sits on the right of Performance
// (Leetify users) or as its own section (Faceit-only users).
export default function FaceitPanel({ faceit }) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 11, textAlign: 'center' }}>
      <div className="mono" style={{ fontSize: 9, color: T.mut }}>Faceit</div>
      <div style={{
        width: 56, height: 56, border: `2px solid ${T.acc}`, color: T.acc,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.display, fontWeight: 900, fontSize: 27,
      }}>{faceit.level ?? '—'}</div>
      <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 21, fontVariantNumeric: 'tabular-nums' }}>
        {faceit.elo?.toLocaleString() ?? '—'} <span className="mono" style={{ fontSize: 9, color: T.mut }}>ELO</span>
      </div>
      <a
        href={`https://www.faceit.com/en/players/${faceit.nickname}`}
        target="_blank" rel="noopener noreferrer"
        className="mono"
        style={{ fontSize: 9, color: T.acc, textDecoration: 'none', border: `1px solid ${T.acc}`, padding: '7px 13px' }}
      >View on Faceit →</a>
    </div>
  );
}
