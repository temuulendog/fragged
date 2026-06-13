import { T } from '../../theme';
import KDRing from './KDRing';
import PremierSeasons from './PremierSeasons';
import useIsMobile from '../../useIsMobile';

// Top identity row: avatar + name + mono meta line + K/D ring + Premier season strip.
// Stacks vertically on mobile (ring + seasons drop to a row below the identity).
export default function PlayerHeader({ name, avatarUrl, level, statsAvailable, hoursPlayed, matchesPlayed, winRate, premier, premierSeasons, faceit, kd }) {
  const mobile = useIsMobile();
  const hasSeasons = premierSeasons?.length > 0;
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

  const right = (
    <div
      style={{
        display: 'flex', alignItems: 'center', flex: 'none',
        borderTop: mobile ? `1px solid ${T.line}` : 'none',
      }}
    >
      {kd != null && (
        <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch', padding: mobile ? '14px 18px' : '0 24px', borderLeft: mobile ? 'none' : `1px solid ${T.line}` }}>
          <KDRing kd={kd} label={null} size={mobile ? 78 : 96} />
        </div>
      )}
      {hasSeasons && (
        <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch', padding: mobile ? '12px 14px' : '12px 18px', borderLeft: `1px solid ${T.line}` }}>
          <PremierSeasons seasons={premierSeasons} />
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fr-sec"
      style={{
        display: 'flex', flexDirection: mobile ? 'column' : 'row',
        justifyContent: 'space-between', alignItems: 'stretch', borderBottom: `1px solid ${T.line}`,
      }}
    >
      <div style={{ display: 'flex', gap: mobile ? 14 : 18, padding: mobile ? 16 : 22, alignItems: 'center', minWidth: 0 }}>
        <img
          src={avatarUrl}
          alt={name}
          style={{ width: mobile ? 56 : 74, height: mobile ? 56 : 74, border: `1px solid ${T.line}`, objectFit: 'cover', display: 'block', flex: 'none', background: T.surf }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: mobile ? 26 : 40, lineHeight: 1, letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div className="mono" style={{ marginTop: mobile ? 8 : 11, fontSize: 10, color: T.mut }}>{meta}</div>
        </div>
      </div>
      {(kd != null || hasSeasons) && right}
    </div>
  );
}
