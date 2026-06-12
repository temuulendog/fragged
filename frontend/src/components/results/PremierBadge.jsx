import { getPremierTier } from '../../theme';

// CS2 Premier rating badge — exact csstats.gg implementation: the tier's rank art
// (public/premier/<tier>.png, 178x64) as a contained background, with the rating
// overlaid in Roboto bold colored to the tier and a 1px black text-shadow.
export default function PremierBadge({ premier, height = 40 }) {
  if (premier == null) return null;
  const width = Math.round(height * 178 / 64);

  // Unranked / rating expired (rank gone — must play to re-rank) → empty "none" banner.
  if (premier <= 0) {
    return <div style={{ width, height, flex: 'none', backgroundImage: 'url(/premier/none.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: '50% 50%' }} />;
  }

  const tier = getPremierTier(premier);

  const str = premier.toLocaleString();
  const ci = str.indexOf(',');
  const big = ci === -1 ? str : str.slice(0, ci);   // leading thousands
  const small = ci === -1 ? '' : str.slice(ci);     // ",012"

  const numStyle = {
    fontFamily: "'Roboto', sans-serif", fontWeight: 700, color: tier.color,
    textShadow: '0 1px 0 #000', fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '.01em',
  };

  return (
    <div style={{
      width, height, flex: 'none', boxSizing: 'border-box',
      backgroundImage: `url(/premier/${tier.name}.png)`,
      backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: '50% 50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingLeft: Math.round(width * 0.2), paddingRight: Math.round(width * 0.05),
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'nowrap',
        transform: `translate(${Math.round(height * 0.02)}px, ${Math.round(height * 0.03)}px) skewX(-14deg)`,
      }}>
        <span style={{ ...numStyle, fontSize: Math.round(height * 0.82) }}>{big}</span>
        <span style={{ ...numStyle, fontSize: Math.round(height * 0.55) }}>{small}</span>
      </span>
    </div>
  );
}
