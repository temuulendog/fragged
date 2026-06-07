import { T } from '../theme';

// Compact 2-line jksteamcommunity.com promo that lives in the masthead.
// Replaces the old full-width RedirectPromo card. Placeholder vanity is "yourname".
export default function MastheadPromo() {
  return (
    <a
      href="https://jksteamcommunity.com/id/yourname"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: T.mono,
        textAlign: 'center',
        lineHeight: 1.55,
        flex: 1,
        minWidth: 0,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <span style={{ display: 'block', fontSize: 10.5, letterSpacing: '.02em', color: T.mut, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <b style={{ color: T.acc, fontWeight: 700 }}>jk</b>steamcommunity.com/id/yourname
      </span>
      <span style={{ display: 'block', fontSize: 8, letterSpacing: '.06em', textTransform: 'uppercase', color: T.dim, marginTop: 2 }}>
        a steam-style link that jumps straight to these stats
      </span>
    </a>
  );
}
