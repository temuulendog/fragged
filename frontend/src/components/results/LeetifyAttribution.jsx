import { T } from '../../theme';

// Leetify TOS compliance: official badge image (links to leetify.com) + "View on Leetify" link.
// The badge asset itself carries the "Data provided by Leetify" wording — do not replace with text.
export default function LeetifyAttribution({ steamId }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 22px', borderBottom: `1px solid ${T.line}`, background: T.surf }}>
      <a href="https://leetify.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/leetify-badge.png" alt="Data provided by Leetify" style={{ height: 28, width: 'auto', display: 'block' }} />
      </a>
      <a
        href={`https://leetify.com/app/profile/${steamId}`}
        target="_blank" rel="noopener noreferrer"
        className="mono"
        style={{ fontSize: 9, color: T.acc, textDecoration: 'none', fontWeight: 700 }}
      >View on Leetify →</a>
    </div>
  );
}
