import { useState } from 'react';
import { T, parseSearchInput, clampPct } from '../theme';
import MastheadPromo from './MastheadPromo';

// Sticky top bar: wordmark (left) · jksteamcommunity promo (center) · optional search (right).
export function Masthead({ onReset, search }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18,
      padding: '13px 22px', borderBottom: `1px solid ${T.line}`,
      position: 'sticky', top: 0, background: T.bg, zIndex: 50,
    }}>
      <button
        onClick={onReset}
        aria-label="Back to home"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: T.display, fontWeight: 900, letterSpacing: '.16em',
          textTransform: 'uppercase', fontSize: 18, color: T.fg, flex: 'none', padding: 0,
        }}
      >
        FR<span style={{ color: T.acc }}>A</span>GGED
      </button>
      <MastheadPromo />
      {search || <span style={{ width: 1, flex: 'none' }} />}
    </div>
  );
}

// Search input + Go button (used in the Results masthead).
export function SearchBox({ onSearch, placeholder = 'paste new steam id…' }) {
  const [q, setQ] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const parsed = parseSearchInput(q);
    if (!parsed) return;
    onSearch(parsed.id, parsed.type);
    setQ('');
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', border: `1px solid ${T.line}`, flex: 'none' }}>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'transparent', border: 'none', outline: 'none', color: T.fg,
          fontFamily: T.mono, fontSize: 11, padding: '8px 12px', width: 210, maxWidth: '40vw',
        }}
      />
      <button type="submit" style={{
        background: T.acc, color: T.ink, border: 'none', cursor: 'pointer',
        fontFamily: T.display, fontWeight: 800, fontSize: 11, letterSpacing: '.1em',
        textTransform: 'uppercase', padding: '0 14px',
      }}>Go</button>
    </form>
  );
}

// Section header: mono label + hairline rule + optional right-aligned hint.
export function SectionLabel({ children, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 22px 10px' }}>
      <h4 style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: T.fg }}>{children}</h4>
      <div style={{ flex: 1, height: 1, background: T.line }} />
      {hint && <div style={{ fontSize: 9, color: T.dim, fontFamily: T.mono, letterSpacing: '.1em', textTransform: 'uppercase' }}>{hint}</div>}
    </div>
  );
}

// Hairline bar with optional orange "goal" tick. Both 0..100.
export function Bar({ valuePct, tickPct }) {
  return (
    <div className="fr-bar" style={{ height: 3, background: T.line, marginTop: 10, position: 'relative' }}>
      <i style={{ display: 'block', height: '100%', width: `${clampPct(valuePct)}%`, background: T.fg }} />
      {tickPct != null && (
        <u style={{ position: 'absolute', top: -2, left: `${clampPct(tickPct)}%`, width: 1, height: 7, background: T.acc }} />
      )}
    </div>
  );
}

// Performance metric cell: mono label, big value, optional bar (with goal tick).
export function MetricCell({ label, value, accent, valuePct, tickPct }) {
  return (
    <div style={{ padding: '15px 14px', borderRight: `1px solid ${T.line}` }}>
      <div className="mono" style={{ fontSize: 9, color: T.mut, marginBottom: 9 }}>{label}</div>
      <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 25, fontVariantNumeric: 'tabular-nums', color: accent ? T.acc : T.fg }}>{value}</div>
      {valuePct != null && <Bar valuePct={valuePct} tickPct={tickPct} />}
    </div>
  );
}

// Generic stat cell (no bar) for grids — top + right hairlines.
export function Cell({ label, value, accent }) {
  return (
    <div style={{ padding: '15px 18px', borderTop: `1px solid ${T.line}`, borderRight: `1px solid ${T.line}` }}>
      <div className="mono" style={{ fontSize: 9, color: T.mut, marginBottom: 9 }}>{label}</div>
      <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 19, fontVariantNumeric: 'tabular-nums', color: accent ? T.acc : T.fg }}>{value}</div>
    </div>
  );
}

// Clean half-arc gauge (no glow). fill 0..100.
export function MiniArc({ label, value, fill, accent }) {
  const len = 107;
  const dash = Math.min(len, Math.max(0, (clampPct(fill) / 100) * len));
  return (
    <div style={{ padding: 18, borderRight: `1px solid ${T.line}`, textAlign: 'center' }}>
      <svg viewBox="0 0 80 48" width="86" height="52">
        <path d="M6,44 A34 34 0 0 1 74 44" fill="none" stroke={T.line} strokeWidth="4" />
        <path d="M6,44 A34 34 0 0 1 74 44" fill="none" stroke={accent ? T.acc : T.fg} strokeWidth="4" strokeDasharray={`${dash} ${len}`} />
      </svg>
      <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 24, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div className="mono" style={{ fontSize: 8, color: T.mut, marginTop: 6 }}>{label}</div>
    </div>
  );
}

// Mono label … value row (used in dense Roles/Grenades blocks).
export function StatLine({ label, value }) {
  return (
    <div className="fr-rowh" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${T.line2}` }}>
      <span className="mono" style={{ fontSize: 9, color: T.mut }}>{label}</span>
      <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums', color: T.fg }}>{value}</span>
    </div>
  );
}
