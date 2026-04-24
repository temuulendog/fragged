import { useState, useEffect, useRef } from 'react';

const Roast = ({ roastText, onReset }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (indexRef.current < roastText.length) {
          setDisplayed(roastText.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, 22);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(startTimer);
  }, [roastText]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'FRAGGED', text: roastText.slice(0, 200) + '...' });
    } else {
      navigator.clipboard?.writeText(roastText);
      alert('Roast copied to clipboard!');
    }
  };

  return (
    <section style={s.section}>
      <div style={s.inner}>
        <div style={s.divider} />
        <div style={s.verdictLabel}>The Verdict</div>
        <div style={s.card}>
          <div style={s.quoteMark}>"</div>
          <div style={s.roastText}>
            {displayed.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: i < displayed.split('\n\n').length - 1 ? 16 : 0 }}>{para}</p>
            ))}
            {!done && <span style={s.cursor} />}
          </div>
        </div>
        {done && (
          <div style={s.btnRow}>
            <button style={s.btnAmber} onClick={handleShare}>SHARE MY SHAME</button>
            <button style={s.btnOutline} onClick={onReset}>TRY ANOTHER PLAYER</button>
          </div>
        )}
      </div>
    </section>
  );
};

const s = {
  section: { background: '#0d1f17', paddingBottom: 80 },
  inner: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  divider: { height: 1, background: '#d4834a', opacity: 0.5, marginBottom: 36 },
  verdictLabel: {
    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
    fontSize: 'clamp(36px,5vw,52px)', letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#f5f0e8', marginBottom: 24,
  },
  card: {
    background: '#1a2f20', border: '1px solid rgba(245,240,232,0.07)',
    borderRadius: 12, padding: '36px 40px', boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
    position: 'relative', overflow: 'hidden',
  },
  quoteMark: {
    position: 'absolute', top: 8, left: 24, fontSize: 140, lineHeight: 0.8,
    color: 'rgba(212,131,74,0.10)', fontFamily: 'Georgia, serif', userSelect: 'none',
  },
  roastText: {
    fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.8,
    color: '#f5f0e8', position: 'relative', zIndex: 1, paddingLeft: 8,
  },
  cursor: {
    display: 'inline-block', width: 2, height: '1em', background: '#d4834a',
    marginLeft: 2, verticalAlign: 'text-bottom',
    animation: 'fraggedBlink 1s step-end infinite',
  },
  btnRow: { display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' },
  btnAmber: {
    flex: 1, minWidth: 180, background: '#d4834a', color: '#0d1f17',
    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
    fontSize: 16, letterSpacing: '0.10em', textTransform: 'uppercase',
    border: 'none', borderRadius: 8, padding: '16px 0', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(212,131,74,0.30)', transition: 'all 150ms',
  },
  btnOutline: {
    flex: 1, minWidth: 180, background: 'transparent', color: '#f5f0e8',
    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
    fontSize: 16, letterSpacing: '0.10em', textTransform: 'uppercase',
    border: '1px solid rgba(245,240,232,0.28)', borderRadius: 8,
    padding: '16px 0', cursor: 'pointer', transition: 'all 150ms',
  },
};

export default Roast;
