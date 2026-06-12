import { T } from '../../theme';
import { Card, StatGroup } from '../ui';

// Full Faceit card for the dense dashboard — surfaces the lifetime fields the
// backend already returns (the slim FaceitPanel only showed level + Elo).
const pct = (v) => (v == null ? '—' : `${Math.round(v * 100)}%`);     // 0..1 ratio → %
const pctNum = (v) => (v == null ? '—' : `${Math.round(v)}%`);        // already a percent

// Official FACEIT skill-level icon (public/faceit/level-N.png).
function LevelBadge({ level }) {
  if (level == null) return null;
  return <img src={`/faceit/level-${level}.png`} alt={`Faceit level ${level}`} style={{ height: 26, width: 26, display: 'block', flex: 'none' }} />;
}

// Official FACEIT logo (public/faceit-logo.png — white wordmark, transparent bg).
function FaceitLogo() {
  return <img src="/faceit-logo.png" alt="FACEIT" style={{ height: 15, display: 'block' }} />;
}

export default function FaceitCard({ faceit: f }) {
  if (!f) return null;

  const nickname = f.nickname && (
    <a
      href={`https://www.faceit.com/en/players/${f.nickname}`}
      target="_blank" rel="noopener noreferrer"
      style={{ fontFamily: T.display, fontWeight: 800, fontSize: 14, color: T.fg, textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: T.mut, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160, display: 'inline-block' }}
    >{f.nickname}</a>
  );

  const items = [
    { label: 'Elo', value: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        {f.elo?.toLocaleString() ?? '—'}
        {f.level != null && <img src={`/faceit/level-${f.level}.png`} alt={`Level ${f.level}`} style={{ height: 22, width: 22, display: 'block', flex: 'none' }} />}
      </span>
    ), accent: true },
    { label: 'K/D', value: f.kdAvg != null ? f.kdAvg.toFixed(2) : '—' },
    { label: 'Win %', value: pctNum(f.winRate) },
    { label: 'HS %', value: pctNum(f.hsAvg) },
    { label: 'ADR', value: f.adr != null ? Math.round(f.adr) : '—' },
    { label: 'Matches', value: f.totalMatches?.toLocaleString() ?? '—' },
    { label: 'Entry', value: pct(f.entrySuccessRate) },
    { label: 'Util/Rd', value: f.utilDmgPerRound != null ? f.utilDmgPerRound.toFixed(1) : '—' },
    { label: 'Flash', value: pct(f.flashSuccessRate) },
    { label: 'Sniper', value: pct(f.sniperKillRate) },
    { label: '1v1', value: pct(f.clutch1v1) },
    { label: '1v2', value: pct(f.clutch1v2) },
  ];

  return (
    <Card
      logo={<FaceitLogo />}
      title={nickname}
      badge={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {f.recentResults?.length > 0 && (
            <span style={{ display: 'inline-flex', gap: 4 }}>
              {f.recentResults.map((r, i) => (
                <span key={i} style={{
                  width: 14, height: 14, borderRadius: 3, fontFamily: T.display, fontWeight: 800, fontSize: 9,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: T.ink, background: r === '1' ? T.win : T.loss,
                }}>{r === '1' ? 'W' : 'L'}</span>
              ))}
            </span>
          )}
          <LevelBadge level={f.level} />
        </span>
      }
    >
      <StatGroup items={items} cols={4} />
    </Card>
  );
}
