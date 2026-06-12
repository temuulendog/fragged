import { SectionLabel, Cell } from '../ui';

const fmtSigned2 = (v) => (v == null ? '—' : (v * 100 >= 0 ? '+' : '') + (v * 100).toFixed(2));

// Leetify CT/T side ratings.
export default function Roles({ L }) {
  const hasSides = L.ctRating != null || L.tRating != null;
  if (!hasSides) return null;

  return (
    <div className="fr-sec">
      <SectionLabel>Sides</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <Cell label="CT Rating" value={fmtSigned2(L.ctRating)} accent />
        <Cell label="T Rating" value={fmtSigned2(L.tRating)} noRight />
      </div>
    </div>
  );
}
