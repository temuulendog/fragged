import { T } from '../../theme';
import { SectionLabel, Bar } from '../ui';

// Shown only when there's no Leetify rating (tier 2/3). FRAGGED's own 0-100 aim score.
export default function FraggedAimCard({ aim, confidence }) {
  const sourceLabel = confidence === 'faceit' ? 'Faceit + Steam aggregates' : 'Steam aggregates only';
  const tooltip = confidence === 'faceit'
    ? 'FRAGGED Aim is computed from Faceit lifetime ADR / KD / HS%, blended with Steam HS% and accuracy. Not the same metric as Leetify Aim.'
    : 'FRAGGED Aim is computed from Steam lifetime HS%, accuracy, and K/D. Less accurate than a Faceit-backed score. Not the same metric as Leetify Aim.';

  return (
    <div className="fr-sec">
      <SectionLabel hint={sourceLabel}>FRAGGED Aim</SectionLabel>
      <div style={{ padding: '4px 22px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 52, lineHeight: 1, color: T.acc, fontVariantNumeric: 'tabular-nums' }}>{aim}</span>
          <span className="mono" style={{ fontSize: 10, color: T.mut }}>/ 100</span>
        </div>
        <Bar valuePct={aim} />
        <p style={{ marginTop: 12, fontSize: 11, color: T.mut, lineHeight: 1.5, maxWidth: 620 }}>{tooltip}</p>
      </div>
    </div>
  );
}
