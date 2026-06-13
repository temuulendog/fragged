import { Card, StatGroup } from '../ui';

// Plain performance box shown ONLY when a player has no Leetify profile.
// Numbers come from the backend `backup_data` (sourced from csst.at) — this is
// deliberately NOT branded as Leetify: no logo, no "Data provided by Leetify"
// badge, no "View on Leetify" link. Just the raw numbers in the same grid.
// Scaling matches LeetifyCard: aim/utility/positioning are 0-100 ints;
// rating is an already-signed float; opening/clutch/ct/t are small floats x100.
const fmt2 = (v) => (v == null ? '—' : ((v * 100 >= 0 ? '+' : '') + (v * 100).toFixed(2)));
const sign2 = (v) => (v == null ? '—' : ((v >= 0 ? '+' : '') + v.toFixed(2)));
const intOr = (v) => (v == null ? '—' : Math.round(v));

export default function BackupCard({ data }) {
  if (!data || data.aim == null) return null;

  const items = [
    { label: 'Aim', value: intOr(data.aim) },
    { label: 'Utility', value: intOr(data.utility) },
    { label: 'Positioning', value: intOr(data.positioning) },
    { label: 'Rating', value: sign2(data.leetifyRating), accent: true },
    { label: 'Opening Duels', value: fmt2(data.opening), accent: true },
    { label: 'Clutching', value: fmt2(data.clutch), accent: true },
    { label: 'CT Rating', value: fmt2(data.ctRating), accent: true },
    { label: 'T Rating', value: fmt2(data.tRating), accent: true },
    { label: 'Win Rate', value: data.winrate != null ? `${Math.round(data.winrate * 100)}%` : '—' },
    { label: 'Matches', value: data.totalMatches?.toLocaleString() ?? '—' },
  ];

  return (
    <Card>
      <StatGroup items={items} cols={3} />
    </Card>
  );
}
