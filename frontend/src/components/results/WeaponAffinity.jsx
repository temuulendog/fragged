import { T } from '../../theme';
import { SectionLabel } from '../ui';

// Steam-derived weapon class split. Universal (renders for all tiers).
export default function WeaponAffinity({ affinity }) {
  const items = [
    { label: 'Rifle', value: affinity.rifle },
    { label: 'Pistol', value: affinity.pistol },
    { label: 'Sniper', value: affinity.sniper },
    { label: 'SMG', value: affinity.smg },
  ];
  return (
    <div className="fr-sec">
      <SectionLabel>Weapon Affinity</SectionLabel>
      <div style={{ padding: '14px 22px 20px' }}>
        {items.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '7px 0' }}>
            <div className="mono" style={{ width: 64, fontSize: 10, color: T.mut }}>{label}</div>
            <div style={{ flex: 1, height: 8, background: T.line }}>
              <div style={{ height: '100%', width: `${value}%`, background: T.fg }} />
            </div>
            <div style={{ width: 42, textAlign: 'right', fontFamily: T.display, fontWeight: 700, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
