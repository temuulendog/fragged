import { T } from '../../theme';
import { SectionLabel, Cell, StatLine } from '../ui';

const fmtSigned2 = (v) => (v == null ? '—' : (v * 100 >= 0 ? '+' : '') + (v * 100).toFixed(2));
const pct1 = (v) => (v == null ? '—' : `${v.toFixed(1)}%`);
const num2 = (v) => (v == null ? '—' : v.toFixed(2));
const num1 = (v) => (v == null ? '—' : v.toFixed(1));
const money = (v) => (v == null ? '—' : `$${Math.round(v)}`);

// CT vs T two-value row.
function CtT({ label, ct, t }) {
  const f = (v) => (v != null ? `${v.toFixed(1)}%` : '—');
  const bV = { fontFamily: T.display, fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums', color: T.fg };
  return (
    <div className="fr-rowh" style={{ display: 'flex', alignItems: 'baseline', padding: '9px 0', borderBottom: `1px solid ${T.line2}` }}>
      <span className="mono" style={{ flex: 1, fontSize: 9, color: T.mut }}>{label}</span>
      <span style={{ width: 72, textAlign: 'right' }}><span className="mono" style={{ fontSize: 8, color: T.dim, marginRight: 5 }}>CT</span><b style={bV}>{f(ct)}</b></span>
      <span style={{ width: 72, textAlign: 'right' }}><span className="mono" style={{ fontSize: 8, color: T.dim, marginRight: 5 }}>T</span><b style={bV}>{f(t)}</b></span>
    </div>
  );
}

// All the detailed Leetify role/utility data, preserved from the original and restyled.
// Each sub-block renders only if its inputs exist.
export default function Roles({ L }) {
  const hasSides = L.ctRating != null || L.tRating != null;
  const hasOpening = L.ctOpeningAggression != null || L.ctOpeningDuel != null;
  const hasTrades = L.tradeKillsSuccess != null;
  const hasNades = L.flashHitFoePerFlash != null || L.heFoesDmg != null;
  const subhead = { fontFamily: T.mono, fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: T.acc, marginBottom: 4 };

  return (
    <>
      {hasSides && (
        <div className="fr-sec">
          <SectionLabel>Sides</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <Cell label="CT Rating" value={fmtSigned2(L.ctRating)} accent />
            <Cell label="T Rating" value={fmtSigned2(L.tRating)} noRight />
          </div>
        </div>
      )}

      {hasOpening && (
        <div className="fr-sec">
          <SectionLabel>Opening Duels</SectionLabel>
          <div style={{ padding: '6px 22px 14px' }}>
            <CtT label="Aggression Success" ct={L.ctOpeningAggression} t={L.tOpeningAggression} />
            <CtT label="Duel Win Rate" ct={L.ctOpeningDuel} t={L.tOpeningDuel} />
          </div>
        </div>
      )}

      {hasTrades && (
        <div className="fr-sec">
          <SectionLabel>Trades</SectionLabel>
          <div style={{ padding: '6px 22px 14px' }}>
            <StatLine label="Trade Kills Success" value={pct1(L.tradeKillsSuccess)} />
            <StatLine label="Trade Deaths Success" value={pct1(L.tradedDeathsSuccess)} />
            <StatLine label="Kill Opportunities / Round" value={num2(L.tradeKillOpps)} />
          </div>
        </div>
      )}

      {hasNades && (
        <div className="fr-sec">
          <SectionLabel>Grenades &amp; Utility</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div style={{ padding: '12px 22px 14px', borderRight: `1px solid ${T.line}` }}>
              <div style={subhead}>Flashbangs</div>
              <StatLine label="Thrown / Match" value={num1(L.flashThrown)} />
              <StatLine label="Enemies Flashed / Flash" value={num2(L.flashHitFoePerFlash)} />
              <StatLine label="Avg Flash Duration" value={L.flashHitFoeDuration != null ? `${L.flashHitFoeDuration.toFixed(2)}s` : '—'} />
              <StatLine label="Teammates Flashed / Flash" value={num2(L.flashHitFriendPerFlash)} />
              <StatLine label="Flash → Kill %" value={pct1(L.flashLeadToKill)} />
            </div>
            <div style={{ padding: '12px 22px 14px' }}>
              <div style={subhead}>HE &amp; Aim</div>
              <StatLine label="HE Dmg (Enemies)" value={num1(L.heFoesDmg)} />
              <StatLine label="HE Dmg (Friendlies)" value={num2(L.heFriendsDmg)} />
              <StatLine label="Counter-Strafing" value={pct1(L.counterStrafing)} />
              <StatLine label="Utility on Death" value={money(L.utilityOnDeath)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
