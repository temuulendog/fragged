import { T } from '../../theme';
import { Card, StatGroup } from '../ui';

// Compact Leetify box for the dense dashboard (the headline numbers).
// Detailed Sides/Opening/Trades/Grenades still render below via <Roles>.
// Scaling: aim/utility/positioning already 0-100 (round); opening/clutch/ct/t
// are raw small floats → x100, signed, 2 decimals (verbatim Section-5 labels).
const fmt2 = (v) => (v == null ? '—' : ((v * 100 >= 0 ? '+' : '') + (v * 100).toFixed(2)));
const sign2 = (v) => (v == null ? '—' : ((v >= 0 ? '+' : '') + v.toFixed(2)));   // already-scaled value
const intOr = (v) => (v == null ? '—' : Math.round(v));

export default function LeetifyCard({ L, steamId }) {
  if (!L || L.aim == null) return null;

  const items = [
    { label: 'Aim', value: intOr(L.aim) },
    { label: 'Utility', value: intOr(L.utility) },
    { label: 'Positioning', value: intOr(L.positioning) },
    { label: 'Rating', value: sign2(L.leetifyRating), accent: true },
    { label: 'Opening Duels', value: fmt2(L.opening), accent: true },
    { label: 'Clutching', value: fmt2(L.clutch), accent: true },
    { label: 'CT Rating', value: fmt2(L.ctRating), accent: true },
    { label: 'T Rating', value: fmt2(L.tRating), accent: true },
    { label: 'Time to Damage', value: L.reactionTime != null ? `${Math.round(L.reactionTime)}ms` : '—' },
    { label: 'Preaim', value: L.preaim != null ? `${L.preaim.toFixed(2)}°` : '—' },
    { label: 'Win Rate', value: L.winrate != null ? `${Math.round(L.winrate * 100)}%` : '—' },
    { label: 'Matches', value: L.totalMatches?.toLocaleString() ?? '—' },
  ];

  return (
    <Card
      logo={
        <a href="https://leetify.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
          <img src="/leetify-badge.png" alt="Data provided by Leetify" style={{ height: 30, display: 'block' }} />
        </a>
      }
      badge={
        <a
          href={`https://leetify.com/app/profile/${steamId}`}
          target="_blank" rel="noopener noreferrer"
          className="mono"
          style={{ fontSize: 9, color: T.acc, textDecoration: 'none' }}
        >View on Leetify →</a>
      }
    >
      <StatGroup items={items} cols={3} />
    </Card>
  );
}
