import { T } from '../../theme';
import { Card, StatGroup } from '../ui';

// Steam profile box. Backend fills the legit Web-API + computed fields;
// commendations and inventoryValue arrive only when a data source is wired in
// (not exposed by the Steam Web API), so they render only when present.
function SteamLogo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill={T.fg} aria-hidden="true" style={{ display: 'block' }}>
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
      </svg>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 15, letterSpacing: '.06em' }}>STEAM</span>
    </span>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(unix) {
  if (!unix) return null;
  const d = new Date(unix * 1000);
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}, ${d.getUTCFullYear()}`;
}

// Commendations render as "62 · 57 · 55" with friendly/leader/teacher glyphs.
function Commends({ c }) {
  if (!c) return null;
  const cell = (n, glyph) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {n?.toLocaleString() ?? '—'}<span style={{ fontSize: 13 }}>{glyph}</span>
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      {cell(c.friendly, '🙂')}{cell(c.leader, '👑')}{cell(c.teacher, '🎓')}
    </span>
  );
}

export default function SteamCard({ steam: s, name }) {
  if (!s) return null;
  const registered = fmtDate(s.registered);

  const nameLink = name && (
    <a
      href={`https://steamcommunity.com/profiles/${s.steamId64}`}
      target="_blank" rel="noopener noreferrer"
      style={{ fontFamily: T.display, fontWeight: 800, fontSize: 14, color: T.fg, textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: T.mut, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, display: 'inline-block' }}
    >{name}</a>
  );

  const items = [
    { label: 'SteamID64', value: <span style={{ fontSize: 13, whiteSpace: 'nowrap', letterSpacing: '-.02em' }}>{s.steamId64}</span> },
    s.commendations ? { label: 'Commendations', value: <Commends c={s.commendations} /> } : null,
    { label: 'CS2 Playtime', value: s.playtimeTotal ? `${s.playtimeTotal.toLocaleString()}h / ${(s.playtime2Weeks || 0).toLocaleString()}h` : '—' },
    { label: 'CS Friendcode', value: s.friendCode || '—' },
    s.vanity ? { label: 'Vanity', value: s.vanity } : null,
    s.inventoryValue != null ? { label: 'Inventory Value', value: `$${s.inventoryValue.toLocaleString()}` } : null,
    { label: 'Registered', value: registered || '—' },
    s.xpLevel != null ? { label: 'XP Level', value: s.xpLevel.toLocaleString() } : null,
  ];

  return (
    <Card logo={<SteamLogo />} title={nameLink}>
      <StatGroup items={items} cols={3} valueSize={15} />
    </Card>
  );
}
