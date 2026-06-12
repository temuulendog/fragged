import { T } from '../../theme';
import KDRing from './KDRing';
import PremierBadge from './PremierBadge';

// Top identity row: avatar + name + mono meta line, official-MM K/D ring, orange Premier rank block.
export default function PlayerHeader({ name, avatarUrl, level, statsAvailable, hoursPlayed, matchesPlayed, winRate, premier, faceit, kd }) {
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
      <div style={{ display: 'flex', alignItems: 'stretch', flex: 'none' }}>
        {kd != null && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px', borderLeft: `1px solid ${T.line}` }}>
            <KDRing kd={kd} label="K/D" size={96} />
          </div>
        )}
        {premier != null && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 28px', borderLeft: `1px solid ${T.line}`, flex: 'none' }}>
            <PremierBadge premier={premier} height={40} />
          </div>
        )}
      </div>
    </div>
  );
}
