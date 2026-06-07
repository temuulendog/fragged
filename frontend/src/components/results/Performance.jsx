import { T } from '../../theme';
import { SectionLabel, MetricCell } from '../ui';
import FaceitPanel from './FaceitPanel';

// Leetify performance: 5 side-by-side metric cells (with goal ticks) + slim Faceit on the right.
// Scaling reminder: aim/utility/positioning are already 0-100; opening/clutch are x100 for display.
export default function Performance({ L, tier, faceit }) {
  const opening = L.opening != null ? L.opening * 100 : null;
  const clutch = L.clutch != null ? L.clutch * 100 : null;
  const oPct = (v) => (v == null ? 0 : ((v + 2) / 4) * 100);   // opening natural range -2..+2
  const cPct = (v) => (v == null ? 0 : ((v + 10) / 40) * 100); // clutch natural range -10..+30
  const fmt2 = (v) => (v >= 0 ? '+' : '') + v.toFixed(2);

  return (
    <div className="fr-sec">
      <SectionLabel hint={`bar vs ${tier.label} · tick = goal`}>Performance</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: faceit ? '1fr 210px' : '1fr', borderTop: `1px solid ${T.line}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <MetricCell label="Aim" value={Math.round(L.aim)} valuePct={L.aim} tickPct={tier.aim} />
          <MetricCell label="Utility" value={Math.round(L.utility)} valuePct={L.utility} tickPct={tier.utility} />
          <MetricCell label="Positioning" value={Math.round(L.positioning)} valuePct={L.positioning} tickPct={tier.positioning} />
          <MetricCell label="Opening Duels" value={opening != null ? fmt2(opening) : '—'} accent valuePct={oPct(opening)} tickPct={oPct(tier.opening)} />
          <MetricCell label="Clutching" value={clutch != null ? fmt2(clutch) : '—'} accent valuePct={cPct(clutch)} tickPct={cPct(tier.clutch)} noRight={!faceit} />
        </div>
        {faceit && <FaceitPanel faceit={faceit} />}
      </div>
    </div>
  );
}
