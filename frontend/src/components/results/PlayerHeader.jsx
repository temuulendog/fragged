import { T } from '../../theme';

// Top identity row: avatar + name + mono meta line, with the orange Premier rank block.
export default function PlayerHeader({ name, avatarUrl, level, statsAvailable, hoursPlayed, matchesPlayed, winRate, premier, faceit }) {
  const parts = statsAvailable
    ? [
        `Steam Lvl ${level}`,
        faceit?.region,
        `${matchesPlayed.toLocaleString()} matches`,
        `${winRate}% win`,
        `${hoursPlayed.toLocaleString()} hrs`,
      ]
    : [
        `Steam Lvl ${level}`,
        faceit?.region,
        faceit ? `${(faceit.totalMatches ?? 0).toLocaleString()} faceit matches` : null,
        faceit?.winRate != null ? `${Math.round(faceit.winRate)}% faceit win` : null,
        premier != null ? `${premier.toLocaleString()} premier` : null,
      ];
  const meta = parts.filter(Boolean).join(' · ');

  return (
    <div className="fr-sec" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', borderBottom: `1px solid ${T.line}` }}>
      <div style={{ display: 'flex', gap: 18, padding: 22, alignItems: 'center', minWidth: 0 }}>
        <img
          src={avatarUrl}
          alt={name}
          style={{ width: 74, height: 74, border: `1px solid ${T.line}`, objectFit: 'cover', display: 'block', flex: 'none', background: T.surf }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 40, lineHeight: 1, letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div className="mono" style={{ marginTop: 11, fontSize: 10, color: T.mut }}>{meta}</div>
        </div>
      </div>
      {premier != null && (
        <div style={{ background: T.acc, color: T.ink, padding: '18px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', flex: 'none' }}>
          <b style={{ fontFamily: T.display, fontWeight: 900, fontSize: 42, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{premier.toLocaleString()}</b>
          <span className="mono" style={{ fontSize: 9, fontWeight: 700, marginTop: 5 }}>Premier</span>
        </div>
      )}
    </div>
  );
}
